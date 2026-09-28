import React, {
    useEffect,
    useState,
} from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    router,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    Button,
} from "@/src/components/ui/Button";

import {
    Input,
} from "@/src/components/ui/Input";

import {
    colors,
} from "@/src/theme";

import {
    getMe,
    sendVerificationEmail,
    verifyEmail,
} from "@niyya/api";

import {
    useAuthStore,
} from "@/src/store/authStore";


export const VerifyEmailScreen = () => {
    const [
        codeSent,
        setCodeSent,
    ] = useState(false);

    const [
        verificationCode,
        setVerificationCode,
    ] = useState("");

    const [
        remainingTime,
        setRemainingTime,
    ] = useState(15 * 60);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const {
        setUser,
    } = useAuthStore();

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    useEffect(() => {
        if (!codeSent) {
            return;
        }

        const interval =
            setInterval(() => {
                setRemainingTime(
                    (prev) => {
                        if (prev <= 1) {
                            clearInterval(
                                interval,
                            );

                            return 0;
                        }

                        return prev - 1;
                    },
                );
            }, 1000);

        return () =>
            clearInterval(interval);
    }, [codeSent]);

    const formatTime = (
        seconds: number,
    ) => {
        const minutes =
            Math.floor(
                seconds / 60,
            );

        const secs =
            seconds % 60;

        return `${minutes}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleSendCode =
        async () => {
            if (loading) {
                return;
            }

            try {
                if (!accessToken) {
                    throw new Error(
                        "Utilisateur non authentifié",
                    );
                }

                setLoading(true);

                const response =
                    await sendVerificationEmail(
                        accessToken,
                    );

                console.log(
                    response.detail,
                );

                setCodeSent(true);
                setRemainingTime(
                    15 * 60,
                );
            } catch (error) {
                console.error(
                    "Erreur lors de l'envoi du code :",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };

    const handleVerifyCode =
        async () => {
            if (loading) {
                return;
            }

            if (
                !verificationCode.trim()
            ) {
                return;
            }

            try {
                if (!accessToken) {
                    throw new Error(
                        "Utilisateur non authentifié",
                    );
                }

                setLoading(true);

                await verifyEmail(
                    {
                        code: verificationCode.trim(),
                    },
                    accessToken,
                );

                const user =
                    await getMe(
                        accessToken,
                    );

                setUser(user);

                router.replace(
                    "/identity-verification",
                );
            } catch (error) {
                console.error(
                    "Erreur lors de la vérification de l'email :",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };

    const handleResendCode =
        async () => {
            if (
                remainingTime > 0 ||
                loading
            ) {
                return;
            }

            await handleSendCode();
        };

    return (
        <SafeAreaView
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={styles.header}
                    >
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
                    </View>

                    <View
                        style={styles.hero}
                    >
                        <View
                            style={
                                styles.heroIcon
                            }
                        >
                            <Ionicons
                                name={
                                    codeSent
                                        ? "mail-open-outline"
                                        : "mail-outline"
                                }
                                size={28}
                                color={
                                    colors.primary
                                }
                            />
                        </View>

                        <Text
                            style={styles.title}
                        >
                            Vérification de l'email
                        </Text>

                        <Text
                            style={styles.subtitle}
                        >
                            {codeSent
                                ? "Un code de vérification vous a été envoyé par email. Saisissez-le ci-dessous pour continuer."
                                : "Afin de sécuriser votre compte, vérifiez votre adresse email avant de continuer."}
                        </Text>
                    </View>

                    {!codeSent ? (
                        <>
                            <View
                                style={
                                    styles.infoCard
                                }
                            >
                                <View
                                    style={
                                        styles.infoIcon
                                    }
                                >
                                    <Ionicons
                                        name="shield-checkmark-outline"
                                        size={20}
                                        color={
                                            colors.primary
                                        }
                                    />
                                </View>

                                <View
                                    style={
                                        styles.infoContent
                                    }
                                >
                                    <Text
                                        style={
                                            styles.infoTitle
                                        }
                                    >
                                        Une étape importante
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoText
                                        }
                                    >
                                        La vérification de votre
                                        email permet de protéger
                                        votre compte et de vous
                                        garantir un espace plus
                                        sécurisé.
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.buttonContainer
                                }
                            >
                                <Button
                                    text="Envoyer le code de vérification"
                                    onPress={
                                        handleSendCode
                                    }
                                    isLoading={
                                        loading
                                    }
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <View
                                style={
                                    styles.formCard
                                }
                            >
                                <View
                                    style={
                                        styles.formHeader
                                    }
                                >
                                    <View
                                        style={
                                            styles.formIcon
                                        }
                                    >
                                        <Ionicons
                                            name="keypad-outline"
                                            size={19}
                                            color={
                                                colors.primary
                                            }
                                        />
                                    </View>

                                    <View
                                        style={
                                            styles.formHeaderContent
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.formTitle
                                            }
                                        >
                                            Votre code
                                        </Text>

                                        <Text
                                            style={
                                                styles.formSubtitle
                                            }
                                        >
                                            Entrez le code reçu par
                                            email.
                                        </Text>
                                    </View>
                                </View>

                                <Input
                                    placeholder="Code de vérification"
                                    value={
                                        verificationCode
                                    }
                                    onChangeText={
                                        setVerificationCode
                                    }
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                />

                                <View
                                    style={
                                        styles.timerCard
                                    }
                                >
                                    <Ionicons
                                        name="time-outline"
                                        size={18}
                                        color={
                                            remainingTime > 0
                                                ? colors.primary
                                                : colors.textMuted
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.timerText
                                        }
                                    >
                                        {remainingTime >
                                        0
                                            ? `Code valable encore ${formatTime(
                                                remainingTime,
                                            )}`
                                            : "Le code a expiré"}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.buttonContainer
                                }
                            >
                                <Button
                                    text="Vérifier mon email"
                                    onPress={
                                        handleVerifyCode
                                    }
                                    isLoading={
                                        loading
                                    }
                                />
                            </View>

                            {remainingTime ===
                                0 && (
                                    <TouchableOpacity
                                        style={
                                            styles.resendButton
                                        }
                                        onPress={
                                            handleResendCode
                                        }
                                        activeOpacity={
                                            0.7
                                        }
                                    >
                                        <Ionicons
                                            name="refresh-outline"
                                            size={17}
                                            color={
                                                colors.primary
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.resendText
                                            }
                                        >
                                            Renvoyer un nouveau code
                                        </Text>
                                    </TouchableOpacity>
                                )}
                        </>
                    )}

                    <View
                        style={
                            styles.reassuranceCard
                        }
                    >
                        <View
                            style={
                                styles.reassuranceIcon
                            }
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={19}
                                color={
                                    colors.primary
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.reassuranceContent
                            }
                        >
                            <Text
                                style={
                                    styles.reassuranceTitle
                                }
                            >
                                Vos informations restent protégées
                            </Text>

                            <Text
                                style={
                                    styles.reassuranceText
                                }
                            >
                                Votre code est personnel.
                                Ne le partagez avec personne.
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.bottomSpace
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
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

        keyboardContainer: {
            flex: 1,
        },

        content: {
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 30,
        },

        header: {
            marginBottom: 18,
        },

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

        hero: {
            alignItems: "center",
            paddingHorizontal: 12,
            marginBottom: 28,
        },

        heroIcon: {
            width: 64,
            height: 64,
            borderRadius: 21,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
        },

        title: {
            fontSize: 28,
            fontWeight: "700",
            color: colors.black,
            textAlign: "center",
            marginBottom: 9,
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 21,
            color: colors.textSecondary,
            textAlign: "center",
            maxWidth: 330,
        },

        infoCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#FCF7EA",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor:
                "#F0E4C5",
            marginBottom: 20,
        },

        infoIcon: {
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor:
            colors.white,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
        },

        infoContent: {
            flex: 1,
        },

        infoTitle: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 3,
        },

        infoText: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
        },

        formCard: {
            backgroundColor:
            colors.white,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor:
            colors.border,
            marginBottom: 20,
        },

        formHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
        },

        formIcon: {
            width: 40,
            height: 40,
            borderRadius: 13,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        formHeaderContent: {
            flex: 1,
        },

        formTitle: {
            fontSize: 15,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 2,
        },

        formSubtitle: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textMuted,
        },

        timerCard: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor:
                "#FCF7EA",
        },

        timerText: {
            marginLeft: 7,
            fontSize: 12,
            fontWeight: "600",
            color: colors.textSecondary,
        },

        buttonContainer: {
            marginBottom: 16,
        },

        resendButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
        },

        resendText: {
            marginLeft: 6,
            fontSize: 13,
            fontWeight: "700",
            color: colors.primary,
        },

        reassuranceCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
            colors.white,
            borderRadius: 18,
            padding: 15,
            borderWidth: 1,
            borderColor:
            colors.border,
        },

        reassuranceIcon: {
            width: 40,
            height: 40,
            borderRadius: 13,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        reassuranceContent: {
            flex: 1,
        },

        reassuranceTitle: {
            fontSize: 12,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 3,
        },

        reassuranceText: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
        },

        bottomSpace: {
            height: 10,
        },
    });