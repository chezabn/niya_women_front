import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
    usePushNotifications();
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const [minimumSplashTimeElapsed, setMinimumSplashTimeElapsed] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setMinimumSplashTimeElapsed(true), 2500);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (hasHydrated && minimumSplashTimeElapsed) {
            void SplashScreen.hideAsync();
        }
    }, [hasHydrated, minimumSplashTimeElapsed]);

    return (
        <SafeAreaProvider>
            {hasHydrated ? (
                <Stack screenOptions={{ headerShown: false }} />
            ) : (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
});
