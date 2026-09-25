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
                    <Text style={styles.title}>
                        Nouvelle publication
                    </Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Publication
                        </Text>

                        <TextInput
                            style={styles.captionInput}
                            value={caption}
                            onChangeText={setCaption}
                            placeholder="Écrivez votre publication..."
                            placeholderTextColor="#999"
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.setting}>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>
                                Commentaires
                            </Text>

                            <Text
                                style={
                                    styles.settingDescription
                                }
                            >
                                Autoriser les autres utilisateurs
                                à commenter cette publication.
                            </Text>
                        </View>

                        <Switch
                            value={commentsEnabled}
                            onValueChange={
                                setCommentsEnabled
                            }
                            trackColor={{
                                false: "#D9D9D9",
                                true: colors.primary,
                            }}
                            thumbColor={colors.white}
                        />
                    </View>
                </ScrollView>

                {/* Bouton toujours en bas */}
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
        backgroundColor: colors.white,
    },

    keyboard: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 24,
    },

    field: {
        marginBottom: 24,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.black,
        marginBottom: 10,
    },

    captionInput: {
        minHeight: 220,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 17,
        lineHeight: 26,
        color: colors.black,
        backgroundColor: colors.white,
    },

    setting: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#ECECEC",
    },

    settingText: {
        flex: 1,
        paddingRight: 16,
    },

    settingTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.black,
        marginBottom: 4,
    },

    settingDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: "#888",
    },

    bottom: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#ECECEC",
        backgroundColor: colors.white,
    },
});