import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext"; 

export default function RootLayout() {
  return (
    <UserProvider> 
      <Stack>
        <Stack.Screen name="index" options={{ title: "Bienvenida" }} />
        <Stack.Screen name="splashscreen" options={{ title: "Home" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} /> 
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
