import { Stack } from "expo-router";
import { DataProvider, } from "../../context/DataContext";
import { UserProvider } from "../../context/UserContext"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }}/>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="conversation" options={{ headerShown: false }} />
        <Stack.Screen name="upgrade" options={{ headerShown: false }} />
        <Stack.Screen name="faq" options={{ headerShown: false }} />
      </Stack>
    </DataProvider>
  );
}
