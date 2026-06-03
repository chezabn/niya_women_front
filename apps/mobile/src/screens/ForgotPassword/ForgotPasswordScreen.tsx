import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/theme";

export const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");

    const handleRequestReset = () => {
        console.log(email);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Mot de passe oublié
                </Text>

                <Text style={styles.subtitle}>
                    Entrez votre adresse email afin de recevoir un code de réinitialisation.
                </Text>

                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <Button
                    text="Envoyer le code"
                    onPress={handleRequestReset}
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