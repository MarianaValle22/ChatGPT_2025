import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function UpgradePlan() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("Plus");

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Cambia a un plan superior</Text>
          </TouchableOpacity>
          <Image source={require("../../assets/images/Vector.png")} style={styles.image} />
        </View>
        <View style={styles.divider} />
      </View>
      <ScrollView contentContainerStyle={styles.planContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => setSelectedPlan("Plus")}
          style={[
            styles.planCard,
            { backgroundColor: selectedPlan === "Plus" ? "#444654" : "#2A2B32" },
          ]}
        >
          <Text style={styles.planTitle}>Plus</Text>
          <Text style={styles.planPrice}>$20 <Text style={styles.smallText}>USD/mes</Text></Text>
          <Text style={styles.planDescription}>Aumenta la productividad y la creatividad con un acceso ampliado</Text>
          <TouchableOpacity style={styles.currentPlanButton}>
            <Text style={styles.currentPlanText}>Tu plan actual</Text>
          </TouchableOpacity>
          <View style={styles.features}>
            <Text style={styles.featureText}>✔ Todo lo que está incluido en la versión gratuita</Text>
            <Text style={styles.featureText}>✔ Límites de uso ampliados en mensajes y carga de archivos</Text>
            <Text style={styles.featureText}>✔ Modo de voz avanzada y estándar</Text>
            <Text style={styles.featureText}>✔ Acceso a modelos avanzados GPT-4.5</Text>
            <Text style={styles.featureText}>✔ Acceso limitado a generación de video con Sora</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPlan("Pro")}
          style={[
            styles.planCard,
            { backgroundColor: selectedPlan === "Pro" ? "#444654" : "#2A2B32" },
          ]}
        >
          <Text style={styles.planTitle}>Pro</Text>
          <Text style={styles.planPrice}>$200 <Text style={styles.smallText}>USD/mes</Text></Text>
          <Text style={styles.planDescription}>Consigue lo mejor de OpenAI con el máximo nivel de acceso</Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>Obtener Pro</Text>
          </TouchableOpacity>
          <View style={styles.features}>
            <Text style={styles.featureText}>✔ Todo lo que está incluido en la versión Plus</Text>
            <Text style={styles.featureText}>✔ Acceso ilimitado a todos los modelos GPT-4o</Text>
            <Text style={styles.featureText}>✔ Acceso ilimitado al modo de voz avanzado</Text>
            <Text style={styles.featureText}>✔ Investigación avanzada con GPT-4.5 y Operator</Text>
            <Text style={styles.featureText}>✔ Acceso ampliado a la generación de video con Sora</Text>
          </View>
        </TouchableOpacity>
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
  planContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 90 : 80, 
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    width: 320,
    alignItems: "center",
    marginBottom: 15, 
  },
  planTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  planPrice: {
    color: "#10A37F",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  smallText: {
    fontSize: 14,
    color: "#BBBBBB",
  },
  planDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  currentPlanButton: {
    backgroundColor: "#3A3B3C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  currentPlanText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  upgradeButton: {
    backgroundColor: "#10A37F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  upgradeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  features: {
    marginTop: 15,
    alignSelf: "flex-start",
  },
  featureText: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 5,
  },
});