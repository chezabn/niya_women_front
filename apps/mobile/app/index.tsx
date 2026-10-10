import { Redirect, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { getStatusIdentityVerification } from "@niyya/api";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

export default function Index() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const [destination, setDestination] = useState<Href | null>(null);

    useEffect(() => {
        if (!hasHydrated) return;
        let active = true;

        const resolveDestination = async () => {
            if (!accessToken) {
                setDestination("/login");
                return;
            }
            if (!user?.email_verified) {
                setDestination("/verify-email");
                return;
            }
            if (user.identity_verified) {
                setDestination("/(tabs)");
                return;
            }

            try {
                const identityStatus = await getStatusIdentityVerification(accessToken);
                if (!active) return;
                if (identityStatus.status === "REJECTED") {
                    setDestination({
                        pathname: "/identity-rejected",
                        params: { reason: identityStatus.rejection_reason ?? "" },
                    });
                } else {
                    setDestination(identityStatus.has_request ? "/identity-pending" : "/identity-verification");
                }
            } catch (error) {
                console.warn("Impossible de vérifier le statut d'identité :", error);
                if (active) setDestination("/identity-verification");
            }
        };

        void resolveDestination();
        return () => { active = false; };
    }, [accessToken, hasHydrated, user]);

    if (!destination) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return <Redirect href={destination} />;
}

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
});
