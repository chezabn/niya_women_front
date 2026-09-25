import React, {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";
import { Button } from "@/src/components/ui/Button";

import { Journal } from "@niyya/types";
import {
    getPage,
    updatePage,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


export const JournalEditScreen = () => {
    const { id } =
        useLocalSearchParams<{
            id: string;
        }>();

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );


    const [journal, setJournal] =
        useState<Journal | null>(null);

    const [title, setTitle] =
        useState("");

    const [page, setPage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    const handleSave = async () => {
        if (!journal || !accessToken) {
            return;
        }

        if (!title.trim()) {
            Alert.alert(
                "Titre requis",
                "Veuillez renseigner un titre.",
            );
            return;
        }

        if (!page.trim()) {
            Alert.alert(
                "Contenu requis",
                "Veuillez renseigner le contenu de votre journal.",
            );
            return;
        }

        try {
            setSaving(true);

            await updatePage(
                accessToken,
                journal.id,
                {
                    title: title.trim(),
                    page: page.trim(),
                },
            );

            router.back();
        } catch (error) {
            console.error(
                "Erreur lors de la modification du journal :",
                error,
            );

            Alert.alert(
                "Erreur",
                "Impossible de modifier cette page de journal.",
            );
        } finally {
            setSaving(false);
        }
    };

    /*
     * Chargement du journal
     */
    useEffect(() => {
        const loadJournal = async () => {
            if (!id || !accessToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const data = await getPage(
                    accessToken,
                    Number(id),
                );

                setJournal(data);

                setTitle(data.title);
                setPage(data.page);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement du journal :",
                    error,
                );

                Alert.alert(
                    "Erreur",
                    "Impossible de charger cette page de journal.",
                    [
                        {
                            text: "Retour",
                            onPress: () =>
                                router.back(),
                        },
                    ],
                );
            } finally {
                setLoading(false);
            }
        };

        loadJournal();
    }, [id, accessToken]);




    /*
     * Chargement
     */
    if (loading) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View style={styles.loading}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                </View>
            </SafeAreaView>
        );
    }


    /*
     * Journal introuvable
     */
    if (!journal) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View style={styles.loading}>
                    <Text>
                        Page de journal introuvable.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={
                            styles.headerButton
                        }
                        onPress={() =>
                            router.back()
                        }
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={26}
                            color={colors.black}
                        />
                    </TouchableOpacity>

                    <Text
                        style={styles.headerTitle}
                    >
                        Modifier
                    </Text>

                    <View
                        style={
                            styles.headerSpacer
                        }
                    />
                </View>


                {/* Formulaire */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={
                        styles.content
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    {/* Titre */}
                    <View
                        style={styles.field}
                    >
                        <Text
                            style={styles.label}
                        >
                            Titre
                        </Text>

                        <TextInput
                            style={styles.titleInput}
                            value={title}
                            onChangeText={
                                setTitle
                            }
                            placeholder="Titre de votre journal"
                            placeholderTextColor="#999"
                            multiline
                        />
                    </View>


                    {/* Contenu */}
                    <View
                        style={styles.field}
                    >
                        <Text
                            style={styles.label}
                        >
                            Journal
                        </Text>

                        <TextInput
                            style={styles.pageInput}
                            value={page}
                            onChangeText={
                                setPage
                            }
                            placeholder="Écrivez votre journal..."
                            placeholderTextColor="#999"
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>


                {/* Bouton */}
                <View
                    style={styles.bottom}
                >
                    <Button
                        text="Enregistrer"
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
        backgroundColor: colors.white,
    },

    keyboard: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },

    headerButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.black,
    },

    headerSpacer: {
        width: 44,
        height: 44,
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
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

    titleInput: {
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 18,
        color: colors.black,
        backgroundColor: colors.white,
    },

    pageInput: {
        minHeight: 260,
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

    bottom: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#ECECEC",
        backgroundColor: colors.white,
    },

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});