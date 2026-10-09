import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/theme";

export default function IdentityPendingScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Ionicons name="time-outline" size={42} color={colors.primary} />
                </View>

                <Text style={styles.title}>Vérification en cours</Text>
                <Text style={styles.message}>
                    Vos documents ont bien été envoyés. Notre équipe vérifie votre identité.
                    Merci de patienter, nous vous informerons dès que la vérification sera terminée.
                </Text>

                <View style={styles.notice}>
                    <Ionicons name="lock-closed-outline" size={19} color={colors.primary} />
                    <Text style={styles.noticeText}>
                        Vos documents restent confidentiels et sont consultés uniquement pour vérifier votre identité.
                    </Text>
                </View>

                <Pressable
                    style={styles.loginLink}
                    onPress={() => router.replace("/login")}
                    accessibilityRole="link"
                >
                    <Text style={styles.loginLinkText}>Retourner à la page de connexion</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5EBD2",
        marginBottom: 28,
    },
    title: {
        color: colors.black,
        fontSize: 25,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 14,
    },
    message: {
        color: colors.textSecondary,
        fontSize: 16,
        lineHeight: 25,
        textAlign: "center",
    },
    notice: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        marginTop: 32,
    },
    noticeText: {
        flex: 1,
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 21,
    },
    loginLink: {
        marginTop: 24,
        padding: 10,
    },
    loginLinkText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
});
