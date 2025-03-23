import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState} from 'react';
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function welcome(){
    const router = useRouter();
    const [step, setStep] = useState(1);
    const nextStep = () => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        router.navigate("/dashboard"); 
      }
    };
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/Vector.png")} />
      <Text style={styles.title}>Welcome to ChatGPT</Text>
      <Text style={styles.subtitle}>Ask anything, get your answer</Text>
      {step === 1 && (
        <View style={styles.section}>
          <Feather name="sun" size={20} color="#FFFFFF" />
          <Text style={styles.sectionTitle}>Examples</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>"Explain quantum computing in simple terms"</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>"Got any creative ideas for a 10-year-old’s birthday?"</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>"How do I make an HTTP request in Javascript?"</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 2 && (
        <View style={styles.section}>
          <Feather name="zap" size={20} color="#FFFFFF" />
          <Text style={styles.sectionTitle}>Capabilities</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Remembers what user said earlier in the conversation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Allows user to provide follow-up corrections</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Trained to decline inappropriate requests</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 3 && (
        <View style={styles.section}>
          <Feather name="alert-circle" size={20} color="#FFFFFF" />
          <Text style={styles.sectionTitle}>Limitations</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}> May occasionally generate incorrect information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>May occasionally produce harmful instructions or biased content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Limited knowledge of world and events after 2021</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.pagination}>
        <View style={[styles.progressStep, step === 1 && styles.activeStep]} />
        <View style={[styles.progressStep, step === 2 && styles.activeStep]} />
        <View style={[styles.progressStep, step === 3 && styles.activeStep]} />
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>
          {step < 3 ? "Next" : "Get Started"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 30,
  },
  section: {
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  optionButton: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
  },
  progressStep: {
    width: 30,
    height: 4,
    backgroundColor: "#555",
    borderRadius: 2,
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: "#10A37F",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#10A37F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});