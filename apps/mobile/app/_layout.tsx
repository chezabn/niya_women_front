import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";

export default function RootLayout() {
    usePushNotifications();

    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
    );
}
