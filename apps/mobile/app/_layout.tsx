import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

export default function RootLayout() {
    usePushNotifications();
    const hasHydrated = useAuthStore((state) => state.hasHydrated);

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
