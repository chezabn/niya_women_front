import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    Switch, ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import {Input} from "@/src/components/ui/Input";
import {Button} from "@/src/components/ui/Button";
import {colors} from "@/src/theme";
import { register } from "@niyya/api";
import {useAuthStore} from "@/src/store/authStore";



export const RegisterScreen = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [acceptCgu, setAcceptCgu] = useState(false);

    const setTokens = useAuthStore(
        (state) => state.setTokens,
    );

    const handleRegister = async () => {
        try {
            const response = await register({
                username,
                email,
                first_name: firstName,
                last_name: lastName,
                password,
                password2,
                accept_cgu: acceptCgu,
            });

            setTokens(
                response.access,
                response.refresh,
            );

            router.replace("/identity-verification");

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                    <Text style={styles.title}>
                        Créer un compte
                    </Text>

                    <Text style={styles.subtitle}>
                        Rejoignez la communauté Niyya
                    </Text>

                    <Input
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <Input
                        placeholder="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <Input
                        placeholder="Nom"
                        value={lastName}
                        onChangeText={setLastName}
                    />

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

                    <Input
                        placeholder="Confirmation du mot de passe"
                        value={password2}
                        onChangeText={setPassword2}
                        secureTextEntry
                    />

                    <View style={styles.cguContainer}>
                        <Switch
                            value={acceptCgu}
                            onValueChange={setAcceptCgu}
                        />

                        <Text style={styles.cguText}>
                            J'accepte les CGU
                        </Text>
                    </View>

                    <Button
                        text="Créer mon compte"
                        onPress={handleRegister}
                    />

                    <Text style={styles.footer}>
                        Déjà un compte ?{" "}
                        <Link href="/login" style={styles.link}>
                            Connectez-vous
                        </Link>
                    </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },

    subtitle: {
        textAlign: "center",
        color: "#777",
        marginBottom: 24,
    },

    cguContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12,
    },

    cguText: {
        marginLeft: 8,
        color: "#555",
    },

    footer: {
        textAlign: "center",
        marginTop: 16,
        color: colors.textSecondary,
    },

    link: {
        color: "#C89A2D",
        fontWeight: "600",
    },
});