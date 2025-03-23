import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from "expo-router";

export default function splashScreen() {
  const router = useRouter(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      router.navigate("/login"); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/Vector.png")} style={styles.logo} />
      <Text style={styles.title}>ChatGPT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100, 
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});