import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, Modal } from "react-native";
import { collection, query, orderBy, onSnapshot, where, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { useRouter, useSegments } from "expo-router"; 
import { DataContext } from "../../context/DataContext";
import { UserContext } from "../../context/UserContext";
import { Feather } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();
  const segments = useSegments(); 
  const dataContext = useContext(DataContext);
  const userContext = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  if (!dataContext || !userContext) {
    return <Text style={styles.errorText}>Error: Context is null</Text>;
  }

  const { chats, setChats, clearAllChats, createChat } = dataContext;
  const { user, logout } = userContext;

  useEffect(() => {
    if (!user && segments[0] !== "login") {
      router.replace("/login");
    }
  }, [user, segments]);

  useEffect(() => {
    if (!user) return;

    const chatRef = collection(db, "chats");
    const q = query(chatRef, where("userId", "==", user.uid), orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        title: doc.data().title || "New Chat",
        created_at: doc.data().created_at?.toDate() || new Date(),
        messages: doc.data().messages || [],
      }));

      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [user]);

  // Crear y mostrar un nuevo chat
  const handleCreateNewChat = async () => {
    try {
      const newChatId = await createChat();
      router.navigate(`/conversation?chatId=${newChatId}`);
    } catch (error) {
      console.error("❌ Error creando chat:", error);
    }
  };

  // Eliminar todos los chats
  const confirmClearChats = () => {
    console.log("🟡 confirmClearChats ejecutado");
    if (Platform.OS === "web") {
      setModalVisible(true); 
    } else {
      Alert.alert(
        "Eliminar todas las conversaciones",
        "¿Seguro que quieres borrar todas las conversaciones? Esta acción no se puede deshacer.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sí, eliminar", onPress: deleteChats }
        ]
      );
    }
  };
  const deleteChats = async () => {
    try {
        console.log("🟡 Eliminando todos los chats...");
        if (!user) {
            console.error("❌ No hay usuario autenticado.");
            return;
        }
        // Eliminar chats en Firestore
        const chatRef = collection(db, "chats");
        const q = query(chatRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("ℹ No hay chats para eliminar.");
            return;
        }

        const batchDelete = snapshot.docs.map(async (docSnap) => {
            console.log("🗑 Eliminando chat con ID:", docSnap.id);
            await deleteDoc(doc(db, "chats", docSnap.id));
        });

        await Promise.all(batchDelete);

        setChats([]);
        console.log("✅ Todos los chats eliminados correctamente.");
        setModalVisible(false); 
    } catch (error) {
        console.error("❌ Error al eliminar chats:", error);
    }
  };

  // Salir de la sesion
  const confirmLogout = () => {
    console.log("🟡 confirmLogout ejecutado");
    if (Platform.OS === "web") {
      setLogoutModalVisible(true); 
    } else {
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Yes, Logout", 

            // Seguimiento del "Logout" en la consola
            onPress: async () => {
              console.log("🟡 Botón de logout presionado en móvil"); 
              try {
                await logout();
                console.log("✅ Logout exitoso en móvil.");
              } catch (error) {
                console.error("❌ Error al cerrar sesión:", error);
              }
            }
          },
        ]
      );
    }
  };



  return (
    <View style={styles.container}>
      {/*<Text style={styles.headerText}>Welcome, {user?.email || "User"}!</Text>*/}
      <View style={styles.chat}>
        <TouchableOpacity style={styles.menuItem} onPress={handleCreateNewChat}>
          <Feather name="message-square" size={20} color="#FFFFFF" />
          <Text style={styles.menuText}>New Chat</Text>
          <Feather name="chevron-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
      <FlatList
        data={chats ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => router.push(`/conversation?chatId=${item.id}`)}
          >
            <Feather name="message-square" size={20} color="#FFFFFF" style={{ opacity: 0.8 }} />
            <Text style={styles.chatText}>{item.title}</Text>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      />
      <View style={styles.menu}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem} onPress={confirmClearChats}>
          <Feather name="trash-2" size={20} color="#FFFFFF" />
          <Text style={styles.menuText}>Clear conversations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate("/upgrade")}>
          <Feather name="user" size={20} color="#FFFFFF" />
          <Text style={styles.menuText}>Upgrade to Plus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="sun" size={20} color="#FFFFFF" />
          <Text style={styles.menuText}>Light mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.navigate("/faq")}>
          <Feather name="external-link" size={20} color="#FFFFFF" />
          <Text style={styles.menuText}>Updates & FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
          <Feather name="log-out" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === "web" && (
        <Modal visible={logoutModalVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutConfirmButton}
                  onPress={async () => {
                    await logout();
                    setLogoutModalVisible(false);
                    console.log("✅ Logout exitoso en web.");
                  }}>
                  <Text style={styles.logoutConfirmText}>Logout</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>
      )}
      {/* Modal en Web para eliminar chats */}
      {Platform.OS === "web" && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>¿Seguro que quieres eliminar todas las conversaciones?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteConfirmButton} onPress={deleteChats}>
                    <Text style={styles.deleteConfirmText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#202123", 
    paddingTop: 50, 
    paddingHorizontal: 20 
  },
  headerText: { 
    color: "#FFFFFF", 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 10 
  },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 15, 
    borderRadius: 8 
  },
  menuText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    marginLeft: 15, 
    flex: 1 
  },
  divider: { 
    height: 1.5, 
    backgroundColor: "#FFFFFF", 
    marginVertical: 10, 
    opacity: 0.4 
  },
  modalBackground: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.7)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContainer: { 
    backgroundColor: "#2A2B32", 
    padding: 20, 
    borderRadius: 10, 
    width: 300, 
    alignItems: "center" 
  },
  modalText: { 
    fontSize: 16, 
    color: "#FFFFFF", 
    textAlign: "center", 
    marginBottom: 15 
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%" 
  },
  cancelButton: { 
    flex: 1, 
    backgroundColor: "#3A3B3C", 
    paddingVertical: 12, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  deleteConfirmButton: { 
    flex: 1, 
    backgroundColor: "#FF6B6B", 
    paddingVertical: 12, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  deleteConfirmText: { 
    color: "#FFFFFF", 
    fontSize: 14, 
    fontWeight: "bold" 
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  chat: {
    marginTop: 10,
  },  
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2B32",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  chatText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1, 
    marginLeft: 10,
    opacity:0.8,
  },
  menu: {
    marginTop: "auto",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutText: {
    color: "#FF6B6B", 
    fontSize: 16, 
    marginLeft: 15, 
    flex: 1 
  },
  logoutConfirmButton: {
    flex: 1,
    backgroundColor: "#10A37F",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutConfirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

