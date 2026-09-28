import React, {
    useState,
} from "react";

import {
    Alert,
    Image,
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
    submitIdentityVerification,
} from "@niyya/api";

import {
    useAuthStore,
} from "@/src/store/authStore";

import {
    Button,
} from "@/src/components/ui/Button";

import {
    colors,
} from "@/src/theme";

import {
    useImagePicker,
} from "@/src/hooks/useImagePicker";


export const IdentityVerificationScreen = () => {
    const [
        idCard,
        setIdCard,
    ] = useState<string | null>(null);

    const [
        selfie,
        setSelfie,
    ] = useState<string | null>(null);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const accessToken =
        useAuthStore(
            (state) =>
                state.accessToken,
        );

    const {
        takePhoto,
    } = useImagePicker();

    const takeIdCard =
        async () => {
            const photo =
                await takePhoto();

            if (photo) {
                setIdCard(
                    photo.uri,
                );
            }
        };

    const takeSelfie =
        async () => {
            const photo =
                await takePhoto();

            if (photo) {
                setSelfie(
                    photo.uri,
                );
            }
        };

    const handleSubmit =
        async () => {
            if (
                !idCard ||
                !selfie
            ) {
                Alert.alert(
                    "Documents manquants",
                    "Veuillez ajouter une photo de votre pièce d'identité et un selfie.",
                );

                return;
            }

            if (!accessToken) {
                Alert.alert(
                    "Session expirée",
                    "Veuillez vous reconnecter pour continuer.",
                );

                return;
            }

            if (loading) {
                return;
            }

            try {
                setLoading(true);

                await submitIdentityVerification(
                    idCard,
                    selfie,
                    accessToken,
                );
                router.replace("/identity-pending");
            } catch (
                error: any
                ) {
                const message =
                    typeof error?.detail === "string"
                        ? error.detail
                        : typeof error?.message === "string"
                            ? error.message
                            : "Impossible d'envoyer les documents.";

                Alert.alert(
                    "Erreur",
                    message === "Network request failed"
                        ? "Le téléphone ne parvient pas à joindre le serveur. Vérifiez l'adresse IP et le port de l'API, que le serveur écoute sur le réseau (0.0.0.0), et que le pare-feu autorise la connexion."
                        : message,
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <SafeAreaView
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={
                    styles.keyboardContainer
                }
                behavior={
                    Platform.OS ===
                    "ios"
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
                            activeOpacity={
                                0.7
                            }
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
                                name="shield-checkmark-outline"
                                size={29}
                                color={
                                    colors.primary
                                }
                            />
                        </View>

                        <Text
                            style={
                                styles.title
                            }
                        >
                            Vérification d'identité
                        </Text>

                        <Text
                            style={
                                styles.subtitle
                            }
                        >
                            Pour sécuriser la communauté
                            Niyya, nous devons vérifier
                            votre identité.
                        </Text>
                    </View>

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
                                name="lock-closed-outline"
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
                                Vos documents restent confidentiels
                            </Text>

                            <Text
                                style={
                                    styles.infoText
                                }
                            >
                                Ils sont utilisés uniquement
                                pour vérifier votre identité
                                et sécuriser votre compte.
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.section
                        }
                    >
                        <View
                            style={
                                styles.sectionHeader
                            }
                        >
                            <View
                                style={
                                    styles.stepBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.stepNumber
                                    }
                                >
                                    1
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.sectionHeaderContent
                                }
                            >
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Votre pièce d'identité
                                </Text>

                                <Text
                                    style={
                                        styles.sectionSubtitle
                                    }
                                >
                                    Prenez une photo claire et
                                    lisible de votre document.
                                </Text>
                            </View>
                        </View>

                        <View
                            style={
                                styles.documentCard
                            }
                        >
                            {idCard ? (
                                <>
                                    <Image
                                        source={{
                                            uri: idCard,
                                        }}
                                        style={
                                            styles.preview
                                        }
                                    />

                                    <TouchableOpacity
                                        style={
                                            styles.retakeButton
                                        }
                                        onPress={
                                            takeIdCard
                                        }
                                        activeOpacity={
                                            0.7
                                        }
                                    >
                                        <Ionicons
                                            name="camera-outline"
                                            size={17}
                                            color={
                                                colors.primary
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.retakeText
                                            }
                                        >
                                            Reprendre la photo
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={
                                        styles.cameraPlaceholder
                                    }
                                    onPress={
                                        takeIdCard
                                    }
                                    activeOpacity={
                                        0.75
                                    }
                                >
                                    <View
                                        style={
                                            styles.cameraIcon
                                        }
                                    >
                                        <Ionicons
                                            name="camera-outline"
                                            size={25}
                                            color={
                                                colors.primary
                                            }
                                        />
                                    </View>

                                    <Text
                                        style={
                                            styles.cameraTitle
                                        }
                                    >
                                        Photographier ma pièce
                                    </Text>

                                    <Text
                                        style={
                                            styles.cameraText
                                        }
                                    >
                                        Assurez-vous que toutes
                                        les informations soient
                                        visibles.
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View
                        style={
                            styles.section
                        }
                    >
                        <View
                            style={
                                styles.sectionHeader
                            }
                        >
                            <View
                                style={
                                    styles.stepBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.stepNumber
                                    }
                                >
                                    2
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.sectionHeaderContent
                                }
                            >
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Votre selfie
                                </Text>

                                <Text
                                    style={
                                        styles.sectionSubtitle
                                    }
                                >
                                    Prenez une photo de votre
                                    visage avec votre téléphone.
                                </Text>
                            </View>
                        </View>

                        <View
                            style={
                                styles.documentCard
                            }
                        >
                            {selfie ? (
                                <>
                                    <Image
                                        source={{
                                            uri: selfie,
                                        }}
                                        style={
                                            styles.preview
                                        }
                                    />

                                    <TouchableOpacity
                                        style={
                                            styles.retakeButton
                                        }
                                        onPress={
                                            takeSelfie
                                        }
                                        activeOpacity={
                                            0.7
                                        }
                                    >
                                        <Ionicons
                                            name="camera-outline"
                                            size={17}
                                            color={
                                                colors.primary
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.retakeText
                                            }
                                        >
                                            Reprendre le selfie
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={
                                        styles.cameraPlaceholder
                                    }
                                    onPress={
                                        takeSelfie
                                    }
                                    activeOpacity={
                                        0.75
                                    }
                                >
                                    <View
                                        style={
                                            styles.cameraIcon
                                        }
                                    >
                                        <Ionicons
                                            name="person-outline"
                                            size={25}
                                            color={
                                                colors.primary
                                            }
                                        />
                                    </View>

                                    <Text
                                        style={
                                            styles.cameraTitle
                                        }
                                    >
                                        Prendre mon selfie
                                    </Text>

                                    <Text
                                        style={
                                            styles.cameraText
                                        }
                                    >
                                        Votre visage doit être
                                        clairement visible.
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

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
                                name="heart-outline"
                                size={20}
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
                                Une communauté plus sûre
                            </Text>

                            <Text
                                style={
                                    styles.reassuranceText
                                }
                            >
                                Cette vérification nous aide
                                à préserver un espace de
                                confiance pour toutes les
                                utilisatrices de Niyya.
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.buttonContainer
                        }
                    >
                        <Button
                            text="Envoyer ma demande"
                            onPress={
                                handleSubmit
                            }
                            isLoading={
                                loading
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.footerText
                        }
                    >
                        Vous pourrez suivre le statut de
                        votre demande depuis votre compte.
                    </Text>

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
            marginBottom: 26,
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
            marginBottom: 28,
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

        section: {
            marginBottom: 25,
        },

        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            paddingHorizontal: 2,
        },

        stepBadge: {
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        stepNumber: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.primary,
        },

        sectionHeaderContent: {
            flex: 1,
        },

        sectionTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 2,
        },

        sectionSubtitle: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textMuted,
        },

        documentCard: {
            backgroundColor:
            colors.white,
            borderRadius: 20,
            padding: 12,
            borderWidth: 1,
            borderColor:
            colors.border,
        },

        cameraPlaceholder: {
            minHeight: 175,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor:
            colors.border,
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
        },

        cameraIcon: {
            width: 52,
            height: 52,
            borderRadius: 17,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 11,
        },

        cameraTitle: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.black,
            textAlign: "center",
            marginBottom: 4,
        },

        cameraText: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textMuted,
            textAlign: "center",
            maxWidth: 250,
        },

        preview: {
            width: "100%",
            height: 210,
            borderRadius: 14,
            resizeMode: "cover",
        },

        retakeButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 12,
            paddingBottom: 3,
        },

        retakeText: {
            marginLeft: 6,
            fontSize: 12,
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
            marginBottom: 20,
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

        buttonContainer: {
            marginBottom: 10,
        },

        footerText: {
            fontSize: 11,
            lineHeight: 17,
            color: colors.textMuted,
            textAlign: "center",
            paddingHorizontal: 20,
        },

        bottomSpace: {
            height: 10,
        },
    });
