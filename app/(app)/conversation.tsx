import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, TouchableWithoutFeedback, Platform, Keyboard, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"; 
import { db } from "../../utils/FirebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import { DataContext } from "../../context/DataContext";

interface APIResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

interface Message {
  id?: string;
  text: string;
  sender: string;
  timestamp?: any;
}

export default function Conversation() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    console.error("DataContext is null. Make sure DataProvider is wrapping the app.");
    return <View style={styles.errorContainer}><Text style={styles.errorText}>Error: DataContext no encontrado</Text></View>;
  }

  const { updateChatMessages, updateChatTitle } = dataContext; 
  const [message, setMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Cargar mensajes en Firestore
  useEffect(() => {
    if (!chatId) return;

    const chatRef = collection(db, "chats", String(chatId), "messages");
    const q = query(chatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message), 
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Enviar mensaje y obtener respuesta de la API
  const getResponse = async () => {
    if (!message.trim() || !chatId) return;
  
    const userMessage: Message = { 
      text: message, 
      sender: "user", 
      timestamp: new Date().toISOString() 
    };
  
    try {
      setIsLoading(true);
      const textToSend = message;
      setMessage("");
  
      await addDoc(collection(db, "chats", String(chatId), "messages"), userMessage);
  
      await updateChatMessages(String(chatId), [...messages, userMessage]);
  
      if (messages.length === 0) {
        await updateChatTitle(String(chatId), textToSend);
      }
  
      // Obtener respuesta de la API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAQBtLSMrkT7rLYLPxjU_1juJfa1EVde9o",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: textToSend }] }] }),
        }
      );
  
      const data: APIResponse = await response.json();
      const botMessage: Message = {
        text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
        sender: "bot",
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, "chats", String(chatId), "messages"), botMessage);
  
      await updateChatMessages(String(chatId), [...messages, userMessage, botMessage]);
  
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={20} color="#FFFFFF" />
              <Text style={styles.menuText}>Back</Text>
            </TouchableOpacity>
            <Image source={require("../../assets/images/Vector.png")} style={styles.image} />
          </View>
          <View style={styles.divider} />
          <ScrollView 
            contentContainerStyle={[styles.chatContainer, messages.length === 0 ? { justifyContent: "center" } : {}]} 
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <Text style={styles.centerText}>Ask anything, get your answer</Text>
            ) : (
              messages.map((msg, index) => (
                <View key={index} style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.botBubble]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))
            )}
            {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#CCCCCC"
              value={message}
              onChangeText={(text) => setMessage(text)}
              returnKeyType="send"
              onSubmitEditing={getResponse}
            />
            <TouchableOpacity style={styles.sendButton} onPress={getResponse}>
              <Feather name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create
({
  container: { 
    flex: 1, 
    backgroundColor: "#343541", 
    paddingTop: 50, 
    paddingHorizontal: 20 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  backButton: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  menuText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    marginLeft: 5 
  },
  image: { 
    width: 25, 
    height: 25 
  },
  chatContainer: { 
    flexGrow: 1, 
    paddingVertical: 20, 
    justifyContent: "center" 
  },
  centerText: { 
    color: "#CCCCCC", 
    fontSize: 16, 
    textAlign: "center", 
    opacity: 0.6 
  },
  messageBubble: { 
    padding: 10, 
    borderRadius: 10, 
    marginVertical: 5, 
    maxWidth: "75%" 
  },
  userBubble: { 
    backgroundColor: "#10A37F", 
    alignSelf: "flex-end" 
  },
  botBubble: { 
    backgroundColor: "#444654", 
    alignSelf: "flex-start" 
  },
  messageText: { 
    color: "#FFFFFF", 
    fontSize: 16 
  },
  loadingText: { 
    textAlign: "center", 
    color: "#CCCCCC", 
    marginTop: 10 
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#444654", 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 12, 
    marginBottom: 20 
  },
  input: { 
    flex: 1, 
    color: "#FFFFFF", 
    fontSize: 16 
  },
  sendButton: { 
    backgroundColor: "#10A37F", 
    padding: 10, 
    borderRadius: 8, 
    marginLeft: 10 
  },
  divider: { 
    height: 1.5, 
    backgroundColor: "#FFFFFF", 
    marginVertical: 10, 
    opacity: 0.4 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  errorText: { 
    color: "red", 
    fontSize: 16 
  },
});
