import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet, Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { SocialButton } from "@/src/components/ui/SocialButton";
import {colors} from "@/src/theme";
import {login, getMe, reactivateAccount} from "@niyya/api";
import {useAuthStore} from "@/src/store/authStore";

export const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {
        setTokens,
        setUser,
    } = useAuthStore();

    const handleLogin = async () => {
        try {
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
                router.replace("/identity-verification");
                return;
            }

            router.replace("/(tabs)");

        } catch (error: any) {

            if (
                error?.code === "ACCOUNT_DEACTIVATED"
            ) {
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
                                    await reactivateAccount(
                                        {
                                            username,
                                            password,
                                        }
                                    )

                                    Alert.alert(
                                        "Compte réactivé",
                                        "Vous pouvez maintenant vous reconnecter."
                                    );
                                } catch (e) {
                                    console.error(e);
                                }
                            },
                        },
                    ],
                );

                return;
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

                <Input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                />

                <Input
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    text="Connexion"
                    onPress={handleLogin}
                />

                <Link href="/forgot-password" style={styles.link}>
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
                    <Link href="/register" style={styles.link}>
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