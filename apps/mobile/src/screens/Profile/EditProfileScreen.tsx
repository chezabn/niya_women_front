import React, {
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
    updateMe,
} from "@niyya/api";

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
    useAuthStore,
} from "@/src/store/authStore";


export const EditProfileScreen = () => {
    const user = useAuthStore(
        (state) => state.user,
    );

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const setUser = useAuthStore(
        (state) => state.setUser,
    );


    const [
        firstName,
        setFirstName,
    ] = useState(
        user?.first_name ?? "",
    );

    const [
        lastName,
        setLastName,
    ] = useState(
        user?.last_name ?? "",
    );

    const [
        bio,
        setBio,
    ] = useState(
        user?.profile?.bio ?? "",
    );

    const [
        saving,
        setSaving,
    ] = useState(false,
    );


    const handleSave = async () => {
        if (
            !accessToken ||
            saving
        ) {
            return;
        }

        try {
            setSaving(true);

            const updatedUser =
                await updateMe(
                    {
                        first_name:
                            firstName.trim(),

                        last_name:
                            lastName.trim(),

                        bio: bio.trim(),
                    },
                    accessToken,
                );

            setUser(
                updatedUser,
            );

            router.replace(
                "/(tabs)/profile",
            );
        } catch (error) {
            console.error(
                "Erreur lors de la modification du profil :",
                error,
            );
        } finally {
            setSaving(false);
        }
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
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={
                        false
                    }
                >

                    {/* Header */}
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

                        <View
                            style={
                                styles.headerTitleContainer
                            }
                        >
                            <Text
                                style={
                                    styles.headerTitle
                                }
                            >
                                Modifier mon profil
                            </Text>

                            <Text
                                style={
                                    styles.headerSubtitle
                                }
                            >
                                Personnalisez votre espace
                            </Text>
                        </View>

                        <View
                            style={
                                styles.headerSpacer
                            }
                        />
                    </View>


                    {/* Introduction */}
                    <View
                        style={
                            styles.introCard
                        }
                    >
                        <View
                            style={
                                styles.introIcon
                            }
                        >
                            <Ionicons
                                name="person-outline"
                                size={21}
                                color={
                                    colors.primary
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.introContent
                            }
                        >
                            <Text
                                style={
                                    styles.introTitle
                                }
                            >
                                Votre profil, votre espace
                            </Text>

                            <Text
                                style={
                                    styles.introText
                                }
                            >
                                Gardez vos informations à jour
                                pour que votre profil vous
                                ressemble vraiment.
                            </Text>
                        </View>
                    </View>


                    {/* Informations personnelles */}
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
                                    styles.sectionIcon
                                }
                            >
                                <Ionicons
                                    name="person-outline"
                                    size={18}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.sectionHeaderText
                                }
                            >
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Informations personnelles
                                </Text>

                                <Text
                                    style={
                                        styles.sectionSubtitle
                                    }
                                >
                                    Quelques informations sur vous
                                </Text>
                            </View>
                        </View>


                        <View
                            style={
                                styles.formCard
                            }
                        >
                            <View
                                style={
                                    styles.inputGroup
                                }
                            >
                                <Text
                                    style={
                                        styles.inputLabel
                                    }
                                >
                                    Prénom
                                </Text>

                                <Input
                                    placeholder="Votre prénom"
                                    value={
                                        firstName
                                    }
                                    onChangeText={
                                        setFirstName
                                    }
                                />
                            </View>


                            <View
                                style={
                                    styles.inputGroup
                                }
                            >
                                <Text
                                    style={
                                        styles.inputLabel
                                    }
                                >
                                    Nom
                                </Text>

                                <Input
                                    placeholder="Votre nom"
                                    value={
                                        lastName
                                    }
                                    onChangeText={
                                        setLastName
                                    }
                                />
                            </View>


                            <View
                                style={
                                    styles.inputGroup
                                }
                            >
                                <Text
                                    style={
                                        styles.inputLabel
                                    }
                                >
                                    Adresse email
                                </Text>

                                <View
                                    style={
                                        styles.disabledInput
                                    }
                                >
                                    <Ionicons
                                        name="mail-outline"
                                        size={18}
                                        color={
                                            colors.textMuted
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.disabledInputText
                                        }
                                        numberOfLines={1}
                                    >
                                        {user?.email ??
                                            "Adresse email"}
                                    </Text>

                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={16}
                                        color={
                                            colors.textMuted
                                        }
                                    />
                                </View>

                                <Text
                                    style={
                                        styles.helperText
                                    }
                                >
                                    L'adresse email ne peut
                                    pas être modifiée ici.
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* À propos de moi */}
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
                                    styles.sectionIcon
                                }
                            >
                                <Ionicons
                                    name="heart-outline"
                                    size={18}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.sectionHeaderText
                                }
                            >
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    À propos de moi
                                </Text>

                                <Text
                                    style={
                                        styles.sectionSubtitle
                                    }
                                >
                                    Présentez-vous en quelques mots
                                </Text>
                            </View>
                        </View>


                        <View
                            style={
                                styles.bioCard
                            }
                        >
                            <View
                                style={
                                    styles.bioHeader
                                }
                            >
                                <Text
                                    style={
                                        styles.inputLabel
                                    }
                                >
                                    Ma bio
                                </Text>

                                <Text
                                    style={
                                        styles.characterCount
                                    }
                                >
                                    {bio.length}/500
                                </Text>
                            </View>

                            <Input
                                placeholder="Parlez un peu de vous..."
                                value={bio}
                                onChangeText={
                                    (value) => {
                                        if (
                                            value.length <=
                                            500
                                        ) {
                                            setBio(
                                                value,
                                            );
                                        }
                                    }
                                }
                                multiline
                                style={
                                    styles.bioInput
                                }
                            />

                            <View
                                style={
                                    styles.bioFooter
                                }
                            >
                                <Ionicons
                                    name="sparkles-outline"
                                    size={15}
                                    color={
                                        colors.primary
                                    }
                                />

                                <Text
                                    style={
                                        styles.bioFooterText
                                    }
                                >
                                    Quelques mots suffisent
                                    pour vous présenter.
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* Conseils */}
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
                                name="shield-checkmark-outline"
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
                                Votre profil vous appartient
                            </Text>

                            <Text
                                style={
                                    styles.reassuranceText
                                }
                            >
                                Vous pouvez modifier ces
                                informations à tout moment.
                            </Text>
                        </View>
                    </View>


                    {/* Bouton */}
                    <View
                        style={
                            styles.buttonContainer
                        }
                    >
                        <Button
                            text="Enregistrer les changements"
                            onPress={
                                handleSave
                            }
                            isLoading={
                                saving
                            }
                        />
                    </View>

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
            paddingBottom: 40,
        },

        /*
         * Header
         */
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
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

        headerTitleContainer: {
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 12,
        },

        headerTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.black,
        },

        headerSubtitle: {
            marginTop: 3,
            fontSize: 12,
            color: colors.textSecondary,
        },

        headerSpacer: {
            width: 44,
            height: 44,
        },

        /*
         * Introduction
         */
        introCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#FCF7EA",
            borderRadius: 18,
            padding: 16,
            marginBottom: 26,
            borderWidth: 1,
            borderColor:
                "#F0E4C5",
        },

        introIcon: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor:
            colors.white,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
        },

        introContent: {
            flex: 1,
        },

        introTitle: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 4,
        },

        introText: {
            fontSize: 12,
            lineHeight: 18,
            color: colors.textSecondary,
        },

        /*
         * Sections
         */
        section: {
            marginBottom: 24,
        },

        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            paddingHorizontal: 2,
        },

        sectionIcon: {
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        sectionHeaderText: {
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
            color: colors.textMuted,
        },

        /*
         * Formulaire
         */
        formCard: {
            backgroundColor:
            colors.white,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor:
            colors.border,
        },

        inputGroup: {
            marginBottom: 18,
        },

        inputGroupLast: {
            marginBottom: 0,
        },

        inputLabel: {
            fontSize: 12,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 7,
            marginLeft: 2,
        },

        /*
         * Email désactivé
         */
        disabledInput: {
            minHeight: 50,
            borderRadius: 13,
            backgroundColor:
                "#F3F4F6",
            borderWidth: 1,
            borderColor:
                "#E5E7EB",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
        },

        disabledInputText: {
            flex: 1,
            marginLeft: 10,
            marginRight: 8,
            fontSize: 14,
            color: "#9CA3AF",
        },

        helperText: {
            fontSize: 10,
            color: colors.textMuted,
            marginTop: 6,
            marginLeft: 2,
        },

        /*
         * Bio
         */
        bioCard: {
            backgroundColor:
            colors.white,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor:
            colors.border,
        },

        bioHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 7,
        },

        characterCount: {
            fontSize: 11,
            color: colors.textMuted,
        },

        bioInput: {
            minHeight: 140,
            textAlignVertical: "top",
        },

        bioFooter: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor:
                "#F0F0F0",
        },

        bioFooterText: {
            marginLeft: 6,
            fontSize: 11,
            color: colors.textMuted,
        },

        /*
         * Réassurance
         */
        reassuranceCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
            colors.white,
            borderRadius: 17,
            padding: 15,
            marginBottom: 24,
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

        /*
         * Bouton
         */
        buttonContainer: {
            marginTop: 2,
            marginBottom: 12,
        },
    });