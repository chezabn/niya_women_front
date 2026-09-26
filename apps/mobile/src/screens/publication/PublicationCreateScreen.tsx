import React, { useState } from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";
import { Button } from "@/src/components/ui/Button";

import { createPublication } from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


export const NewPublicationScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [caption, setCaption] = useState("");

    const [commentsEnabled, setCommentsEnabled] =
        useState(true);

    const [saving, setSaving] = useState(false);


    const handlePublish = async () => {
        if (!accessToken) {
            return;
        }

        if (!caption.trim()) {
            Alert.alert(
                "Publication vide",
                "Veuillez écrire quelque chose avant de publier.",
            );
            return;
        }

        try {
            setSaving(true);

            await createPublication(
                {
                    caption: caption.trim(),
                    comments_enabled: commentsEnabled,
                },
                accessToken,
            );

            router.back();
        } catch (error) {
            console.error(
                "Erreur lors de la création de la publication :",
                error,
            );

            Alert.alert(
                "Erreur",
                "Impossible de publier votre publication.",
            );
        } finally {
            setSaving(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={
                        styles.content
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerIcon}>
                            <Ionicons
                                name="create-outline"
                                size={22}
                                color={colors.primary}
                            />
                        </View>

                        <View style={styles.headerText}>
                            <Text style={styles.title}>
                                Nouvelle publication
                            </Text>

                            <Text style={styles.subtitle}>
                                Partagez ce que vous avez envie
                                d'exprimer aujourd'hui.
                            </Text>
                        </View>
                    </View>


                    {/* Zone d'écriture */}
                    <View style={styles.writeCard}>
                        <View style={styles.fieldHeader}>
                            <View>
                                <Text style={styles.label}>
                                    Votre publication
                                </Text>

                                <Text style={styles.hint}>
                                    Écrivez librement, sans pression.
                                </Text>
                            </View>

                            <Ionicons
                                name="heart-outline"
                                size={22}
                                color={colors.primary}
                            />
                        </View>

                        <TextInput
                            style={styles.captionInput}
                            value={caption}
                            onChangeText={setCaption}
                            placeholder="Qu'avez-vous envie de partager ?"
                            placeholderTextColor={
                                colors.textMuted
                            }
                            multiline
                            textAlignVertical="top"
                            maxLength={2000}
                        />

                        <View style={styles.inputFooter}>
                            <Text style={styles.helperText}>
                                Votre publication sera visible
                                par les autres utilisatrices.
                            </Text>

                            <Text style={styles.counter}>
                                {caption.length}/2000
                            </Text>
                        </View>
                    </View>


                    {/* Options */}
                    <View style={styles.optionsSection}>
                        <Text style={styles.sectionTitle}>
                            Options
                        </Text>

                        <View style={styles.settingCard}>
                            <View
                                style={
                                    styles.settingIconContainer
                                }
                            >
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={21}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.settingText}>
                                <Text
                                    style={
                                        styles.settingTitle
                                    }
                                >
                                    Autoriser les commentaires
                                </Text>

                                <Text
                                    style={
                                        styles.settingDescription
                                    }
                                >
                                    Les autres utilisatrices
                                    pourront commenter votre
                                    publication.
                                </Text>
                            </View>

                            <Switch
                                value={commentsEnabled}
                                onValueChange={
                                    setCommentsEnabled
                                }
                                trackColor={{
                                    false: colors.lightGray,
                                    true: colors.primary,
                                }}
                                thumbColor={colors.white}
                                ios_backgroundColor={
                                    colors.lightGray
                                }
                            />
                        </View>
                    </View>


                    {/* Petit rappel */}
                    <View style={styles.reassurance}>
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={19}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.reassuranceText}>
                            Prenez votre temps. Vous pouvez
                            modifier votre publication plus tard.
                        </Text>
                    </View>
                </ScrollView>


                {/* Bouton fixe en bas */}
                <View style={styles.bottom}>
                    <Button
                        text="Publier"
                        onPress={handlePublish}
                        isLoading={saving}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    keyboard: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 40,
    },


    /*
     * Header
     */

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    headerIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    headerText: {
        flex: 1,
    },

    title: {
        fontSize: 25,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 5,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
    },


    /*
     * Zone d'écriture
     */

    writeCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 26,
    },

    fieldHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    label: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 3,
    },

    hint: {
        fontSize: 13,
        color: colors.textMuted,
    },

    captionInput: {
        minHeight: 220,
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 14,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 16,
        lineHeight: 25,
        color: colors.black,
    },

    inputFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 10,
    },

    helperText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
        color: colors.textMuted,
        paddingRight: 12,
    },

    counter: {
        fontSize: 12,
        color: colors.textMuted,
    },


    /*
     * Options
     */

    optionsSection: {
        marginBottom: 22,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 12,
    },

    settingCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },

    settingIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    settingText: {
        flex: 1,
        paddingRight: 10,
    },

    settingTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.black,
        marginBottom: 4,
    },

    settingDescription: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.textSecondary,
    },


    /*
     * Réassurance
     */

    reassurance: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 6,
        marginTop: 2,
    },

    reassuranceText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 12,
        lineHeight: 18,
        color: colors.textSecondary,
    },


    /*
     * Bouton
     */

    bottom: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.white,
    },
});