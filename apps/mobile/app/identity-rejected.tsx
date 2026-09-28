import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/src/theme";

export default function IdentityRejectedScreen() {
    const { reason } = useLocalSearchParams<{ reason?: string }>();
    const rejectionReason = Array.isArray(reason) ? reason[0] : reason;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Ionicons name="close-circle-outline" size={44} color="#B42318" />
                </View>

                <Text style={styles.title}>Demande rejetée</Text>
                <Text style={styles.message}>
                    Nous n’avons pas pu confirmer votre identité avec les documents transmis. Vous pouvez corriger votre dossier et envoyer une nouvelle demande.
                </Text>

                {!!rejectionReason?.trim() && (
                    <View style={styles.reasonCard}>
                        <Text style={styles.reasonTitle}>Motif du rejet</Text>
                        <Text style={styles.reasonText}>{rejectionReason}</Text>
                    </View>
                )}

                <Pressable style={styles.button} onPress={() => router.replace("/identity-verification")}>
                    <Ionicons name="refresh-outline" size={19} color={colors.white} />
                    <Text style={styles.buttonText}>Refaire une demande</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 26 },
    iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#FDECEC", alignItems: "center", justifyContent: "center", marginBottom: 26 },
    title: { color: colors.black, fontSize: 25, fontWeight: "700", textAlign: "center", marginBottom: 13 },
    message: { color: colors.textSecondary, fontSize: 15, lineHeight: 23, textAlign: "center" },
    reasonCard: { width: "100%", backgroundColor: colors.white, borderRadius: 14, padding: 16, marginTop: 23, borderWidth: 1, borderColor: "#F1E5E4" },
    reasonTitle: { color: colors.black, fontSize: 14, fontWeight: "700", marginBottom: 6 },
    reasonText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
    button: { width: "100%", minHeight: 52, borderRadius: 13, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 28 },
    buttonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
