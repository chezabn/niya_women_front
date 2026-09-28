import React, {
    useState,
} from "react";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    Input,
} from "@/src/components/ui/Input";

import {
    Button,
} from "@/src/components/ui/Button";

import {
    colors,
} from "@/src/theme";

import {
    resetPassword,
} from "@niyya/api";


export const ResetPasswordScreen = () => {
    const [
        email,
        setEmail,
    ] = useState("");

    const [
        code,
        setCode,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");


    const handleResetPassword = async () => {
        try {
            await resetPassword({
                email: email,
                code: code,
                new_password: newPassword,
            });
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <SafeAreaView
            style={styles.container}
        >
            <View
                style={styles.content}
            >

                {/* Bouton retour */}
                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={() =>
                        router.back()
                    }
                    activeOpacity={0.7}
                    hitSlop={8}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={
                            colors.black
                        }
                    />
                </TouchableOpacity>


                {/* Contenu */}
                <View
                    style={
                        styles.formContainer
                    }
                >
                    <Text
                        style={
                            styles.title
                        }
                    >
                        Réinitialisation
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Saisissez le code reçu par
                        email puis choisissez un
                        nouveau mot de passe.
                    </Text>


                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={
                            setEmail
                        }
                        keyboardType="email-address"
                    />


                    <Input
                        placeholder="Code reçu"
                        value={code}
                        onChangeText={
                            setCode
                        }
                    />


                    <Input
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChangeText={
                            setNewPassword
                        }
                        secureTextEntry
                    />


                    <Input
                        placeholder="Confirmation du mot de passe"
                        value={
                            confirmPassword
                        }
                        onChangeText={
                            setConfirmPassword
                        }
                        secureTextEntry
                    />


                    <View
                        style={
                            styles.buttonContainer
                        }
                    >
                        <Button
                            text="Changer le mot de passe"
                            onPress={
                                handleResetPassword
                            }
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
            colors.background,
        },

        content: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 4,
        },

        /*
         * Bouton retour
         */
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor:
            colors.white,
            borderWidth: 1,
            borderColor:
            colors.border,
            alignItems: "center",
            justifyContent: "center",
        },

        /*
         * Formulaire
         */
        formContainer: {
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 8,
            paddingBottom: 60,
        },

        title: {
            fontSize: 30,
            fontWeight: "700",
            textAlign: "center",
            color: colors.black,
            marginBottom: 12,
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 21,
            textAlign: "center",
            color: colors.textSecondary,
            marginBottom: 32,
        },

        buttonContainer: {
            marginTop: 12,
        },
    });