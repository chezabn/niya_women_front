import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { SocialButton } from "@/src/components/ui/SocialButton";
import {colors} from "@/src/theme";

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log(email, password);
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
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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