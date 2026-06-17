import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { colors } from "@/src/theme";
import {getMe, sendVerificationEmail, verifyEmail} from "@niyya/api";
import { useAuthStore } from "@/src/store/authStore";
import { router } from "expo-router";


export const VerifyEmailScreen = () => {
    const [codeSent, setCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const [remainingTime, setRemainingTime] = useState(15 * 60);

    useEffect(() => {
        if (!codeSent) return;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [codeSent]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const {
        setUser,
    } = useAuthStore();
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const handleSendCode = async () => {
        try {
            if (!accessToken) {
                throw new Error("Utilisateur non authentifié");
            }

            const response = await sendVerificationEmail(
                accessToken,
            );

            console.log(response.detail);

            setCodeSent(true);
            setRemainingTime(15 * 60);

        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyCode = async () => {
        try {
            if (!accessToken) {
                throw new Error("Utilisateur non authentifié");
            }

            await verifyEmail(
                {
                    code: verificationCode,
                },
                accessToken,
            );

            const user = await getMe(accessToken)

            setUser(user)

            router.replace("/identity-verification");

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Vérification de l'email
                </Text>

                {!codeSent ? (
                    <>
                        <Text style={styles.subtitle}>
                            Afin de sécuriser votre compte, veuillez
                            vérifier votre adresse email.
                        </Text>

                        <Button
                            text="Envoyer le code de vérification"
                            onPress={handleSendCode}
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.subtitle}>
                            Un code de vérification a été envoyé à votre
                            adresse email.
                        </Text>

                        <Input
                            placeholder="Code de vérification"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="number-pad"
                        />

                        <Text style={styles.timer}>
                            Temps restant : {formatTime(remainingTime)}
                        </Text>

                        <Button
                            text="Vérifier mon email"
                            onPress={handleVerifyCode}
                        />
                    </>
                )}
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
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: colors.textSecondary,
        marginBottom: 32,
        lineHeight: 22,
    },

    timer: {
        textAlign: "center",
        marginVertical: 16,
        color: colors.primary,
        fontWeight: "600",
        fontSize: 16,
    },
});