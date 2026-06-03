import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/theme";

export const ResetPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleResetPassword = () => {
        console.log({
            email,
            code,
            new_password: newPassword,
            confirm_password: confirmPassword,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Réinitialisation
                </Text>

                <Text style={styles.subtitle}>
                    Saisissez le code reçu par email puis choisissez un nouveau mot de passe.
                </Text>

                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <Input
                    placeholder="Code reçu"
                    value={code}
                    onChangeText={setCode}
                />

                <Input
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                <Input
                    placeholder="Confirmation du mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <Button
                    text="Changer le mot de passe"
                    onPress={handleResetPassword}
                />

                <Link href="/login" style={styles.link}>
                    Retour à la connexion
                </Link>
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
        textAlign: "center",
        marginBottom: 12,
    },

    subtitle: {
        textAlign: "center",
        color: colors.textSecondary,
        marginBottom: 32,
    },

    link: {
        textAlign: "center",
        marginTop: 20,
        color: colors.primary,
        fontWeight: "600",
    },
});