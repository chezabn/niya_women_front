import React, { useState } from "react";

import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

import { colors } from "@/src/theme";

import { createPage } from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


export const NewJournalScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [saving, setSaving] =
        useState(false);


    const handleSave = async () => {
        if (!accessToken) {
            return;
        }

        if (!title.trim()) {
            Alert.alert(
                "Titre requis",
                "Veuillez renseigner un titre.",
            );
            return;
        }

        if (!content.trim()) {
            Alert.alert(
                "Contenu requis",
                "Veuillez renseigner le contenu de votre journal.",
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
                "Erreur",
                "Impossible de créer cette page de journal.",
            );
        } finally {
            setSaving(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
            >
                <Text style={styles.title}>
                    Nouvelle page
                </Text>

                <Input
                    placeholder="Titre"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>
                    Votre page
                </Text>

                <Input
                    placeholder="Écrivez librement ce que vous ressentez..."
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={12}
                    style={styles.textArea}
                />

                <Button
                    text="Enregistrer"
                    onPress={handleSave}
                    isLoading={saving}
                />
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
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
        color: colors.black,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 8,
        color: colors.black,
    },

    textArea: {
        minHeight: 220,
        textAlignVertical: "top",
    },
});