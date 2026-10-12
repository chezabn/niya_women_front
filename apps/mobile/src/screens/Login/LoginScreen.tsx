import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    View,
    Text,
    StyleSheet,
    Alert,
    Pressable,
} from "react-native";
import { Link, router } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/theme";
import {
    login,
    getMe,
    getStatusIdentityVerification,
    reactivateAccount,
} from "@niyya/api";
import { useAuthStore } from "@/src/store/authStore";
import { AlertBanner } from "@/src/components/ui/AlertBanner";

export const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        setTokens,
        setUser,
    } = useAuthStore();

    const handleLogin = async () => {
        if (!username.trim() || !password) {
            setErrorMessage("Nom d'utilisateur ou Mot de passe vide");
            return;
        }

        try {
            setErrorMessage("");

            const tokens = await login({
                username,
                password,
            });

            setTokens(
                tokens.access,
                tokens.refresh,
            );

            const user = await getMe(
                tokens.access,
            );

            setUser(user);

            if (!user.email_verified) {
                router.replace("/verify-email");
                return;
            }

            if (!user.identity_verified) {
                const identityStatus =
                    await getStatusIdentityVerification(tokens.access);

                if (identityStatus.status === "REJECTED") {
                    router.replace({
                        pathname: "/identity-rejected",
                        params: {
                            reason: identityStatus.rejection_reason ?? "",
                        },
                    });
                } else {
                    router.replace(
                        identityStatus.has_request
                            ? "/identity-pending"
                            : "/identity-verification",
                    );
                }

                return;
            }

            router.replace("/(tabs)");

        } catch (error: any) {
            console.error(error);

            if (error?.code === "ACCOUNT_LOCKED" || error?.status === 423) {
                const lockedUntil = Date.parse(error?.detail?.locked_until ?? "");
                const retryTime = Number.isNaN(lockedUntil)
                    ? ""
                    : ` Vous pourrez réessayer à ${new Date(lockedUntil).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}.`;

                setErrorMessage(
                    `Votre compte est temporairement bloqué après plusieurs tentatives de connexion.${retryTime}`,
                );
                return;
            }

            if (error?.code === "ACCOUNT_DEACTIVATED") {
                Alert.alert(
                    "Compte désactivé",
                    "Vous avez précédemment désactivé votre compte. Souhaitez-vous le réactiver ?",
                    [
                        {
                            text: "Annuler",
                            style: "cancel",
                        },
                        {
                            text: "Réactiver",
                            onPress: async () => {
                                try {
                                    await reactivateAccount({
                                        username,
                                        password,
                                    });

                                    Alert.alert(
                                        "Compte réactivé",
                                        "Vous pouvez maintenant vous reconnecter.",
                                    );
                                } catch (e) {
                                    console.error(e);

                                    setErrorMessage(
                                        "Impossible de réactiver votre compte.",
                                    );
                                }
                            },
                        },
                    ],
                );

                return;
            }

            if (error?.code === "AUTHENTICATION_FAILED") {
                setErrorMessage(
                    "Nom d'utilisateur ou mot de passe incorrect"
                )
                return
            }

            const detail = error?.detail;
            if (typeof detail === "string") {
                setErrorMessage(detail);
            } else if (detail && typeof detail === "object") {
                const detailMessage = detail.message;
                if (typeof detailMessage === "string") {
                    setErrorMessage(detailMessage);
                } else {
                    const messages = Object.values(detail)
                        .flatMap((value: unknown) => Array.isArray(value) ? value : [value])
                        .filter((value: unknown): value is string => typeof value === "string");
                    setErrorMessage(messages.join("\n") || "Une erreur est survenue lors de la connexion.");
                }
            } else {
                setErrorMessage(
                    error?.message || "Une erreur est survenue lors de la connexion.",
                );
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.hero}>
                        <Image
                            source={require("../../../assets/images/logo-foreground.png")}
                            style={styles.brandLogo}
                            resizeMode="contain"
                            accessibilityLabel="Logo Niyya"
                            accessible
                        />
                        <Text style={styles.title}>Bienvenue</Text>
                        <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
                    </View>

                    <View style={styles.form}>
                        <AlertBanner
                            type="error"
                            visible={!!errorMessage}
                            message={errorMessage}
                        />

                        <Text style={styles.inputLabel}>Nom d’utilisateur</Text>
                        <Input
                            placeholder="Votre nom d’utilisateur"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />

                        <Text style={styles.inputLabel}>Mot de passe</Text>
                        <View style={styles.passwordContainer}>
                            <Input
                                placeholder="Votre mot de passe"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />

                            <Pressable
                                style={styles.passwordToggle}
                                onPress={() => setShowPassword((previous) => !previous)}
                                accessibilityRole="button"
                                accessibilityLabel={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                <Text style={styles.passwordToggleText}>
                                    {showPassword ? "Masquer" : "Afficher"}
                                </Text>
                            </Pressable>
                        </View>

                        <Link href="/forgot-password" style={styles.forgotLink}>
                            Mot de passe oublié ?
                        </Link>

                        <Button text="Se connecter" onPress={handleLogin} />
                    </View>

                    <Text style={styles.secondary}>
                        Pas encore de compte ?{" "}
                        <Link href="/register" style={styles.link}>S’inscrire</Link>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: { flex: 1 },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 28,
        justifyContent: "center",
    },
    hero: { alignItems: "center", marginBottom: 28 },
    brandLogo: { width: 170, height: 170, marginBottom: 10 },
    title: {
        color: colors.black,
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 7,
    },
    form: {
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F0ECE4",
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 16,
    },
    inputLabel: { color: colors.text, fontSize: 13, fontWeight: "600", marginTop: 8 },
    passwordContainer: { position: "relative" },
    passwordToggle: {
        position: "absolute",
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        zIndex: 1,
    },

    passwordToggleText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: "600",
    },
    forgotLink: {
        alignSelf: "flex-end",
        color: colors.primary,
        fontSize: 13,
        fontWeight: "600",
        marginTop: 2,
        marginBottom: 8,
    },
    secondary: {
        textAlign: "center",
        marginTop: 22,
        color: colors.textSecondary,
        fontSize: 14,
    },
    link: {
        color: colors.primary,
        fontWeight: "600",
    },
});
