import React from "react";

import {
    Alert,
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

import {colors} from "@/src/theme";
import {SettingsItem} from "@/src/components/settings/SettingsItem";
import {useAuthStore} from "@/src/store/authStore";
import {deleteMe} from "@niyya/api";

export const SettingsScreen = () => {
    const logout = useAuthStore(
        (state) => state.logout,
    );

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Souhaitez-vous vous déconnecter ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => {
                        logout();
                        router.replace("/login");
                    },
                },
            ],
        );
    };

    const deleteAccount = async () => {
        try {
            if (!accessToken) {
                return;
            }

            await deleteMe(
                accessToken,
            );

            logout();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Supprimer le compte",
            "Votre compte sera désactivé, vos amies ne pourront plus vos contacter sur NiWo. Après 30 jours, votre compte sera définitivement supprimé et toutes vos données seront perdues",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        deleteAccount();
                        router.replace("/login");
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={26}
                            color={colors.black}
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Paramètres
                    </Text>

                    <View
                        style={styles.headerSpacer}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Compte
                    </Text>

                    <SettingsItem
                        title="Modifier mon profil"
                        onPress={() =>
                            router.push(
                                "/profile/edit",
                            )
                        }
                    />

                    <SettingsItem
                        title="Changer mon mot de passe"
                        onPress={() =>
                            router.push(
                                "/reset-password",
                            )
                        }
                    />
                    <SettingsItem
                        title="Mon activité"
                        onPress={() =>
                            router.push(
                                "/publications/liked",
                            )
                        }
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Confidentialité et sécurité
                    </Text>

                    <SettingsItem
                        title="Notifications"
                        onPress={handleLogout}
                    />

                    <SettingsItem
                        title="Vérification d'identité"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="Confidentialité"
                        onPress={handleLogout}
                    />

                    <SettingsItem
                        title="Mes données"
                        onPress={handleLogout}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Assistance et commentaires
                    </Text>

                    <SettingsItem
                        title="Signaler un problème"
                        onPress={handleLogout}
                    />

                    <SettingsItem
                        title="Centre d'aide"
                        onPress={handleLogout}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Plus d'informations
                    </Text>

                    <SettingsItem
                        title="Politique de confidentalité"
                        onPress={handleLogout}
                    />

                    <SettingsItem
                        title="Conditions d'utilisation"
                        onPress={handleLogout}
                    />

                    <SettingsItem
                        title="À propos"
                        onPress={handleLogout}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Session
                    </Text>

                    <SettingsItem
                        title="Déconnexion"
                        danger
                        onPress={handleLogout}
                    />

                    <SettingsItem
                        title="Supprimer mon compte"
                        danger
                        onPress={handleDelete}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Niyya Women v1.0.0
                    </Text>

                    <Text style={styles.footerText}>
                        Conçu à Paris
                    </Text>
                </View>
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
        padding: 24,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
    },

    backButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    headerSpacer: {
        width: 44,
        height: 44,
    },

    title: {
        flex: 1,
        fontSize: 26,
        fontWeight: "700",
        textAlign: "center",
    },

    section: {
        marginBottom: 32,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 12,
        textTransform: "uppercase",
    },

    footer: {
        marginTop: 32,
        alignItems: "center",
        paddingBottom: 24,
    },

    footerText: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: "center",
    },
});