import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import {collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig"; 
import { useAuth } from "../context/UserContext"; 

interface Chat {
  id: string;
  title: string;
  created_at: any;
  messages: any[];
  userId: string;
}

interface DataContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  clearAllChats: () => Promise<void>;
  createChat: () => Promise<string>;
  updateChatMessages: (chatId: string, messages: any[]) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useAuth(); 

  useEffect(() => {
    if (!user) {
      setChats([]); 
      return;
    }

    const chatRef = collection(db, "chats");
    const q = query(chatRef, where("userId", "==", user.uid), orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];

      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [user]);

  // Crear un nuevo chat y asociarlo al usuario
  const createChat = async (): Promise<string> => {
    if (!user) return "";

    try {
      const docRef = await addDoc(collection(db, "chats"), {
        title: "New Chat",
        created_at: serverTimestamp(),
        messages: [],
        userId: user.uid, 
      });

      console.log("✅ Chat creado con ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error creando chat:", error);
      throw error;
    }
  };

  // Limpiar todos los chats del usuario 
  const clearAllChats = async () => {
    if (!user) {
      console.log("⚠ No hay usuario autenticado, no se pueden eliminar los chats.");
      return;
    }

    try {
      console.log("🟡 Intentando eliminar todos los chats del usuario:", user.uid);

      const chatRef = collection(db, "chats");
      const q = query(chatRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("ℹ No hay chats para eliminar.");
        return;
      }

      console.log("Se encontraron ${snapshot.docs.length} chats para eliminar.");

      // Elimina cada chat
      for (const docSnap of snapshot.docs) {
        console.log("🗑 Eliminando chat con ID:", docSnap.id);
        await deleteDoc(doc(db, "chats", docSnap.id));
      }

      setChats([]);
      console.log("✅ Todos los chats eliminados correctamente.");
    } catch (error) {
      console.error("❌ Error eliminando chats:", error);
    }
  };

  // Actualizar mensajes de un chat
  const updateChatMessages = async (chatId: string, messages: any[]) => {
    try {
      const chatRef = doc(db, "chats", chatId);

      const updatedMessages = messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp || new Date(),
      }));

      await updateDoc(chatRef, { messages: updatedMessages });

      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === chatId ? { ...chat, messages: updatedMessages } : chat))
      );

      console.log("✅ Mensajes actualizados en chat ${chatId}");
    } catch (error) {
      console.error("❌ Error actualizando mensajes:", error);
    }
  };

  // Actualizar título del chat según la primera pregunta del usuario
  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, { title });

      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
      );

      console.log("✅ Título actualizado en chat ${chatId}");
    } catch (error) {
      console.error("❌ Error actualizando título del chat:", error);
    }
  };

  return (
    <DataContext.Provider value={{ chats, setChats, clearAllChats, createChat, updateChatMessages, updateChatTitle }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    console.error("⚠️ Error: DataContext es null. Asegúrate de envolver la aplicación con <DataProvider>.");
    throw new Error("useData debe usarse dentro de un DataProvider");
  }
  return context;
};
