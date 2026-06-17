import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { colors } from "@/src/theme";
import { SettingsItem } from "@/src/components/settings/SettingsItem";
import { useAuthStore } from "@/src/store/authStore";

export const SettingsScreen = () => {
    const logout = useAuthStore(
        (state) => state.logout,
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
            >
                <Text style={styles.title}>
                    Paramètres
                </Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Compte
                    </Text>

                    <SettingsItem
                        title="Modifier mon profil"
                        onPress={() =>
                            router.push("/profile/edit")
                        }
                    />

                    <SettingsItem
                        title="Changer mon mot de passe"
                        onPress={() =>
                            router.push("/reset-password") // TODO A changer
                        }
                    />

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Confidentialité et sécurité
                    </Text>

                    <SettingsItem
                        title="Notifications"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="Vérification d'identité"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="Confidentialité"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="Mes données"
                        onPress={handleLogout} // TODO A changer
                    />

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Assistance et commentaires
                    </Text>

                    <SettingsItem
                        title="Signaler un problème"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="Centre d'aide"
                        onPress={handleLogout} // TODO A changer
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Plus d'informations
                    </Text>

                    <SettingsItem
                        title="Politique de confidentalité"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="Conditions d'utilisation"
                        onPress={handleLogout} // TODO A changer
                    />

                    <SettingsItem
                        title="À propos"
                        onPress={handleLogout} // TODO A changer
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
                        onPress={handleLogout}
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

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 32,
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