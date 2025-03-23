import { useRouter } from "expo-router";
import { Button, View, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Button title = "Screen" onPress={() => router.navigate("/splashscreen")}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});