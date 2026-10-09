import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Pressable,
} from "react-native";
import { Link, router } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { SocialButton } from "@/src/components/ui/SocialButton";
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
            <View style={styles.content}>
                <Text style={styles.title}>
                    Bienvenue
                </Text>

                <Text style={styles.subtitle}>
                    Connectez-vous à votre compte
                </Text>

                <AlertBanner
                    type="error"
                    visible={!!errorMessage}
                    message={errorMessage}
                />

                <Input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                />

                <View style={styles.passwordContainer}>
                    <Input
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />

                    <Pressable
                        style={styles.passwordToggle}
                        onPress={() =>
                            setShowPassword((previous) => !previous)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={
                            showPassword
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                        }
                    >
                        <Text style={styles.passwordToggleText}>
                            {showPassword ? "Masquer" : "Afficher"}
                        </Text>
                    </Pressable>
                </View>

                <Button
                    text="Connexion"
                    onPress={handleLogin}
                />

                <Link
                    href="/forgot-password"
                    style={styles.link}
                >
                    Mot de passe oublié ?
                </Link>

                <Text style={styles.secondary}>
                    OU
                </Text>

                <SocialButton
                    platform="google"
                    onPress={() => {}}
                />

                <SocialButton
                    platform="apple"
                    onPress={() => {}}
                />

                <Text style={styles.secondary}>
                    Vous n'avez pas de compte ?{" "}
                    <Link
                        href="/register"
                        style={styles.link}
                    >
                        Inscrivez-vous maintenant
                    </Link>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 32,
    },

    passwordContainer: {
        position: "relative",
    },

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
        fontSize: 14,
        fontWeight: "600",
    },

    secondary: {
        textAlign: "center",
        marginVertical: 16,
        color: colors.textSecondary,
    },

    link: {
        color: colors.primary,
        fontWeight: "600",
    },
});
