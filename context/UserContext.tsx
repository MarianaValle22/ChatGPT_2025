import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../utils/FirebaseConfig";

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    const checkWelcomeScreen = async () => {
      const seenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
      setHasSeenWelcome(seenWelcome === "true");
    };

    checkWelcomeScreen();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("hasSeenWelcome");
      setUser(null); 
      console.log("✅ Usuario deslogueado correctamente.");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, hasSeenWelcome, setHasSeenWelcome }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    console.error("⚠️ Error: UserContext es null. Asegúrate de envolver la aplicación con <UserProvider>.");
    return {
      user: null,
      loading: false,
      logout: async () => {},
      hasSeenWelcome: false,
      setHasSeenWelcome: () => {},
    }; 
  }
  return context;
};
