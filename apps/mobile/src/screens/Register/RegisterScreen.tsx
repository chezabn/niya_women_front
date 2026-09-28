import React, {
    useState,
} from "react";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Link,
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
    register,
} from "@niyya/api";

import {
    useAuthStore,
} from "@/src/store/authStore";

import {
    AlertBanner,
} from "@/src/components/ui/AlertBanner";


export const RegisterScreen = () => {
    const [
        username,
        setUsername,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        firstName,
        setFirstName,
    ] = useState("");

    const [
        lastName,
        setLastName,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        password2,
        setPassword2,
    ] = useState("");

    const [
        acceptCgu,
        setAcceptCgu,
    ] = useState(false);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    const setTokens =
        useAuthStore(
            (state) =>
                state.setTokens,
        );


    const handleRegister =
        async () => {
            if (loading) {
                return;
            }

            try {
                setErrorMessage("");
                setLoading(true);

                const response =
                    await register({
                        username,
                        email,
                        first_name:
                        firstName,
                        last_name:
                        lastName,
                        password,
                        password2,
                        accept_cgu:
                        acceptCgu,
                    });

                setTokens(
                    response.access,
                    response.refresh,
                );

                router.replace(
                    "/verify-email",
                );
            } catch (error: any) {
                console.error(
                    "Erreur lors de l'inscription :",
                    error,
                );

                const fieldLabels: Record<string, string> = {
                    username: "Nom d'utilisateur",
                    email: "Adresse email",
                    first_name: "Prénom",
                    last_name: "Nom",
                    password: "Mot de passe",
                    password2: "Confirmation du mot de passe",
                    accept_cgu: "Conditions d'utilisation",
                };

                const detail = error?.detail;
                if (typeof detail === "string") {
                    setErrorMessage(detail);
                } else if (detail && typeof detail === "object") {
                    const messages = Object.entries(detail).flatMap(([field, value]) => {
                        const fieldMessages = Array.isArray(value) ? value : [value];
                        return fieldMessages
                            .filter((message): message is string => typeof message === "string")
                            .map((message) => `${fieldLabels[field] ?? field} : ${message}`);
                    });
                    setErrorMessage(messages.join("\n") || "Vérifiez les informations saisies et réessayez.");
                } else {
                    setErrorMessage(error?.message || "Une erreur est survenue lors de l'inscription.");
                }
            } finally {
                setLoading(false);
            }
        };


    return (
        <SafeAreaView
            style={styles.container}
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
                            styles.headerSpacer
                        }
                    />
                </View>


                {/* En-tête */}
                <View
                    style={
                        styles.hero
                    }
                >
                    <View
                        style={
                            styles.heroIcon
                        }
                    >
                        <Ionicons
                            name="heart-outline"
                            size={27}
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
                        Créer un compte
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Rejoignez la communauté
                        Niyya et créez votre espace
                        personnel.
                    </Text>
                </View>

                <AlertBanner
                    type="error"
                    visible={!!errorMessage}
                    message={errorMessage}
                />


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
                                Vos informations
                            </Text>

                            <Text
                                style={
                                    styles.sectionSubtitle
                                }
                            >
                                Quelques informations pour
                                créer votre profil.
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
                                Nom d'utilisateur
                            </Text>

                            <Input
                                placeholder="Votre nom d'utilisateur"
                                value={
                                    username
                                }
                                onChangeText={
                                    setUsername
                                }
                                autoCapitalize="none"
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
                                styles.inputGroupLast
                            }
                        >
                            <Text
                                style={
                                    styles.inputLabel
                                }
                            >
                                Adresse email
                            </Text>

                            <Input
                                placeholder="Votre adresse email"
                                value={
                                    email
                                }
                                onChangeText={
                                    setEmail
                                }
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                </View>


                {/* Sécurité */}
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
                                name="lock-closed-outline"
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
                                Sécurisez votre compte
                            </Text>

                            <Text
                                style={
                                    styles.sectionSubtitle
                                }
                            >
                                Choisissez un mot de passe
                                personnel et sécurisé.
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
                                Mot de passe
                            </Text>

                            <Input
                                placeholder="Votre mot de passe"
                                value={
                                    password
                                }
                                onChangeText={
                                    setPassword
                                }
                                secureTextEntry
                            />
                        </View>


                        <View
                            style={
                                styles.inputGroupLast
                            }
                        >
                            <Text
                                style={
                                    styles.inputLabel
                                }
                            >
                                Confirmation du mot de passe
                            </Text>

                            <Input
                                placeholder="Confirmez votre mot de passe"
                                value={
                                    password2
                                }
                                onChangeText={
                                    setPassword2
                                }
                                secureTextEntry
                            />
                        </View>
                    </View>
                </View>


                {/* CGU */}
                <TouchableOpacity
                    style={
                        styles.cguCard
                    }
                    onPress={() =>
                        setAcceptCgu(
                            !acceptCgu,
                        )
                    }
                    activeOpacity={0.8}
                >
                    <View
                        style={[
                            styles.checkbox,
                            acceptCgu &&
                            styles.checkboxActive,
                        ]}
                    >
                        {acceptCgu && (
                            <Ionicons
                                name="checkmark"
                                size={17}
                                color={
                                    colors.white
                                }
                            />
                        )}
                    </View>

                    <View
                        style={
                            styles.cguContent
                        }
                    >
                        <Text
                            style={
                                styles.cguTitle
                            }
                        >
                            J'accepte les CGU
                        </Text>

                        <Text
                            style={
                                styles.cguText
                            }
                        >
                            En créant votre compte,
                            vous acceptez les conditions
                            d'utilisation de Niyya.
                        </Text>
                    </View>
                </TouchableOpacity>


                {/* Réassurance */}
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
                            Un espace pensé pour vous
                        </Text>

                        <Text
                            style={
                                styles.reassuranceText
                            }
                        >
                            Vos informations personnelles
                            restent protégées et votre
                            compte vous appartient.
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
                        text="Créer mon compte"
                        onPress={
                            handleRegister
                        }
                        isLoading={
                            loading
                        }
                    />
                </View>


                {/* Connexion */}
                <Text
                    style={
                        styles.footer
                    }
                >
                    Déjà un compte ?{" "}
                    <Link
                        href="/login"
                        style={
                            styles.link
                        }
                    >
                        Connectez-vous
                    </Link>
                </Text>


                <View
                    style={
                        styles.bottomSpace
                    }
                />
            </ScrollView>
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
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 30,
        },

        /*
         * Header
         */
        header: {
            flexDirection: "row",
            alignItems: "center",
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

        headerSpacer: {
            flex: 1,
        },

        /*
         * Hero
         */
        hero: {
            alignItems: "center",
            marginBottom: 28,
            paddingHorizontal: 12,
        },

        heroIcon: {
            width: 62,
            height: 62,
            borderRadius: 21,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
        },

        title: {
            fontSize: 29,
            fontWeight: "700",
            color: colors.black,
            textAlign: "center",
            marginBottom: 8,
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 21,
            color: colors.textSecondary,
            textAlign: "center",
            maxWidth: 310,
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
            lineHeight: 16,
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
         * CGU
         */
        cguCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
            colors.white,
            borderRadius: 18,
            padding: 15,
            borderWidth: 1,
            borderColor:
            colors.border,
            marginBottom: 16,
        },

        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 7,
            borderWidth: 1.5,
            borderColor:
            colors.border,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
            colors.white,
            marginRight: 12,
        },

        checkboxActive: {
            backgroundColor:
            colors.primary,
            borderColor:
            colors.primary,
        },

        cguContent: {
            flex: 1,
        },

        cguTitle: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 3,
        },

        cguText: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
        },

        /*
         * Réassurance
         */
        reassuranceCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#FCF7EA",
            borderRadius: 18,
            padding: 15,
            marginBottom: 20,
            borderWidth: 1,
            borderColor:
                "#F0E4C5",
        },

        reassuranceIcon: {
            width: 40,
            height: 40,
            borderRadius: 13,
            backgroundColor:
            colors.white,
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
        },

        /*
         * Footer
         */
        footer: {
            textAlign: "center",
            marginTop: 18,
            fontSize: 13,
            color: colors.textSecondary,
        },

        link: {
            color: colors.primary,
            fontWeight: "700",
        },

        bottomSpace: {
            height: 10,
        },
    });
