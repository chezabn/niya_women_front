import React, { useState } from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/src/components/ui/Button";

import { colors } from "@/src/theme";

import { createPage } from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


export const NewJournalScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [saving, setSaving] = useState(false);


    const handleSave = async () => {
        if (!accessToken) {
            return;
        }

        if (!title.trim()) {
            Alert.alert(
                "Un petit titre",
                "Donnez un titre à cette page de votre journal.",
            );
            return;
        }

        if (!content.trim()) {
            Alert.alert(
                "Prenez un moment pour vous",
                "Écrivez quelques mots avant d'enregistrer votre page.",
            );
            return;
        }

        const today = new Date();

        const date =
            `${today.getFullYear()}-` +
            `${String(
    today.getMonth() + 1,
).padStart(2, "0")}-` +
            `${String(
    today.getDate(),
).padStart(2, "0")}`;

        try {
            setSaving(true);

            await createPage(
                {
                    title: title.trim(),
                    page: content.trim(),
                    date,
                },
                accessToken,
            );

            router.back();
        } catch (error) {
            console.error(
                "Erreur lors de la création du journal :",
                error,
            );

            Alert.alert(
                "Une erreur est survenue",
                "Impossible d'enregistrer cette page de journal.",
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
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            hitSlop={8}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={25}
                                color={colors.black}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* En-tête */}
                    <View style={styles.header}>
                        <View style={styles.headerIcon}>
                            <Ionicons
                                name="book-outline"
                                size={23}
                                color={colors.primary}
                            />
                        </View>

                        <View style={styles.headerText}>
                            <Text style={styles.title}>
                                Un moment pour vous
                            </Text>

                            <Text style={styles.subtitle}>
                                Posez vos pensées, vos émotions
                                ou simplement les petits moments
                                de votre journée.
                            </Text>
                        </View>
                    </View>


                    {/* Petit message d'invitation */}
                    <View style={styles.introCard}>
                        <Ionicons
                            name="sparkles-outline"
                            size={20}
                            color={colors.primary}
                        />

                        <Text style={styles.introText}>
                            Il n'y a rien à réussir ici.
                            Écrivez simplement ce qui vous vient.
                        </Text>
                    </View>


                    {/* Titre */}
                    <View style={styles.titleSection}>
                        <Text style={styles.label}>
                            Le titre de votre page
                        </Text>

                        <TextInput
                            style={styles.titleInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Comment appeler ce moment ?"
                            placeholderTextColor={
                                colors.textMuted
                            }
                            maxLength={100}
                        />

                        <Text style={styles.counter}>
                            {title.length}/100
                        </Text>
                    </View>


                    {/* Journal */}
                    <View style={styles.journalSection}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.label}>
                                    Votre espace
                                </Text>

                                <Text style={styles.hint}>
                                    Écrivez comme si vous vous
                                    parliez à vous-même.
                                </Text>
                            </View>

                            <Ionicons
                                name="heart-outline"
                                size={22}
                                color={colors.primary}
                            />
                        </View>

                        <View style={styles.paper}>
                            <TextInput
                                style={styles.textArea}
                                value={content}
                                onChangeText={setContent}
                                placeholder="Qu'avez-vous sur le cœur aujourd'hui ?"
                                placeholderTextColor={
                                    colors.textMuted
                                }
                                multiline
                                textAlignVertical="top"
                                maxLength={5000}
                            />

                            <View
                                style={
                                    styles.textAreaFooter
                                }
                            >
                                <Text style={styles.helperText}>
                                    Prenez votre temps...
                                </Text>

                                <Text style={styles.counter}>
                                    {content.length}/5000
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* Réassurance */}
                    <View style={styles.reassurance}>
                        <View
                            style={
                                styles.reassuranceIcon
                            }
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={17}
                                color={colors.primary}
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
                                Votre espace personnel
                            </Text>

                            <Text
                                style={
                                    styles.reassuranceText
                                }
                            >
                                Ce journal est là pour vous
                                permettre de garder une trace
                                de ce que vous ressentez.
                            </Text>
                        </View>
                    </View>
                </ScrollView>


                {/* Bouton */}
                <View style={styles.bottom}>
                    <Button
                        text="Garder cette page"
                        onPress={handleSave}
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


    topBar: {
        height: 44,
        justifyContent: "center",
        marginBottom: 4,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    /*
     * En-tête
     */

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    headerIcon: {
        width: 50,
        height: 50,
        borderRadius: 17,
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
     * Introduction
     */

    introCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FDF8ED",
        borderRadius: 16,
        padding: 15,
        marginBottom: 26,
    },

    introText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        lineHeight: 20,
        color: colors.textSecondary,
    },


    /*
     * Titre
     */

    titleSection: {
        marginBottom: 26,
    },

    label: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 7,
    },

    titleInput: {
        height: 54,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.black,
    },

    counter: {
        alignSelf: "flex-end",
        marginTop: 6,
        fontSize: 11,
        color: colors.textMuted,
    },


    /*
     * Zone du journal
     */

    journalSection: {
        marginBottom: 24,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    hint: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.textMuted,
    },

    paper: {
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
    },

    textArea: {
        minHeight: 270,
        padding: 0,
        fontSize: 16,
        lineHeight: 27,
        color: colors.black,
    },

    textAreaFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    helperText: {
        fontSize: 12,
        fontStyle: "italic",
        color: colors.textMuted,
    },


    /*
     * Réassurance
     */

    reassurance: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        marginBottom: 10,
    },

    reassuranceIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    reassuranceContent: {
        flex: 1,
    },

    reassuranceTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.black,
        marginBottom: 3,
    },

    reassuranceText: {
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