import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function FAQ() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Preguntas Frecuentes</Text>
          </TouchableOpacity>
          <Image source={require("../../assets/images/Vector.png")} style={styles.image} />
        </View>
        <View style={styles.divider} />
      </View>
      <ScrollView contentContainerStyle={styles.faqContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Qué incluye el plan gratuito?</Text>
          <Text style={styles.answer}>
            El plan gratuito ofrece acceso a funciones básicas, chat ilimitado con modelos estándar y respuestas rápidas.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Cómo actualizo mi plan?</Text>
          <Text style={styles.answer}>
            Puedes actualizar tu plan desde la página de suscripción. Selecciona "Upgrade to Plus" y sigue los pasos.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Qué diferencia hay entre Plus y Pro?</Text>
          <Text style={styles.answer}>
            El plan Plus incluye acceso a modelos avanzados, mientras que Pro tiene acceso ilimitado a todas las funciones.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Puedo cancelar mi suscripción en cualquier momento?</Text>
          <Text style={styles.answer}>
            Sí, puedes cancelar en cualquier momento sin penalización. Seguirás teniendo acceso hasta el final del período de facturación.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.question}>¿Ofrecen reembolsos?</Text>
          <Text style={styles.answer}>
            No ofrecemos reembolsos, pero puedes cancelar la renovación en cualquier momento desde la configuración de tu cuenta.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    paddingHorizontal: 20,
  },
  headerContainer: { 
    width: "100%",
    backgroundColor: "#343541",
    zIndex: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: "relative", 
    top: Platform.OS === "ios" ? 40 : 20, 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    width: "100%",
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
  divider: { 
    height: 1.5, 
    backgroundColor: "#FFFFFF", 
    opacity: 0.2, 
    marginTop: 10, 
  },
  faqContainer: {
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 90 : 80,
    paddingBottom: 20,
  },
  faqItem: {
    backgroundColor: "#2A2B32",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  question: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  answer: {
    color: "#CCCCCC",
    fontSize: 14,
  },
});