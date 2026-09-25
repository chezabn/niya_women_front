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
    Switch,
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

import { Publication } from "@niyya/types";

import {
    getMyPublication,
    updatePublication,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


export const PublicationEditScreen = () => {
    const { id } =
        useLocalSearchParams<{
            id: string;
        }>();

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );


    const [publication, setPublication] =
        useState<Publication | null>(null);

    const [caption, setCaption] =
        useState("");

    const [commentsEnabled, setCommentsEnabled] =
        useState(true);

    const [isArchived, setIsArchived] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    /*
     * Sauvegarde
     */
    const handleSave = async () => {
        if (!publication || !accessToken) {
            return;
        }

        try {
            setSaving(true);

            await updatePublication(
                accessToken,
                publication.id,
                {
                    caption: caption.trim(),
                    comments_enabled: commentsEnabled,
                    is_archived: isArchived,
                },
            );

            router.back();
        } catch (error) {
            console.error(
                "Erreur lors de la modification de la publication :",
                error,
            );

            Alert.alert(
                "Erreur",
                "Impossible de modifier cette publication.",
            );
        } finally {
            setSaving(false);
        }
    };


    /*
     * Chargement de la publication
     */
    useEffect(() => {
        const loadPublication = async () => {
            if (!id || !accessToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const data = await getMyPublication(
                    accessToken,
                    Number(id),
                );

                setPublication(data);

                setCaption(data.caption);
                setCommentsEnabled(
                    data.comments_enabled,
                );
                setIsArchived(
                    data.is_archived,
                );
            } catch (error) {
                console.error(
                    "Erreur lors du chargement de la publication :",
                    error,
                );

                Alert.alert(
                    "Erreur",
                    "Impossible de charger cette publication.",
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

        loadPublication();
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
     * Publication introuvable
     */
    if (!publication) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View style={styles.loading}>
                    <Text>
                        Publication introuvable.
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
                    {/* Description */}
                    <View
                        style={styles.field}
                    >
                        <Text
                            style={styles.label}
                        >
                            Publication
                        </Text>

                        <TextInput
                            style={styles.captionInput}
                            value={caption}
                            onChangeText={
                                setCaption
                            }
                            placeholder="Écrivez votre publication..."
                            placeholderTextColor="#999"
                            multiline
                            textAlignVertical="top"
                        />
                    </View>


                    {/* Commentaires */}
                    <View
                        style={styles.setting}
                    >
                        <View
                            style={
                                styles.settingText
                            }
                        >
                            <Text
                                style={
                                    styles.settingTitle
                                }
                            >
                                Commentaires
                            </Text>

                            <Text
                                style={
                                    styles.settingDescription
                                }
                            >
                                Autoriser les autres utilisateurs à commenter cette publication.
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
                            thumbColor={
                                colors.white
                            }
                        />
                    </View>


                    {/* Archivage */}
                    <View
                        style={styles.setting}
                    >
                        <View
                            style={
                                styles.settingText
                            }
                        >
                            <Text
                                style={
                                    styles.settingTitle
                                }
                            >
                                Archiver la publication
                            </Text>

                            <Text
                                style={
                                    styles.settingDescription
                                }
                            >
                                Une publication archivée n'apparaît plus dans votre contenu actif.
                            </Text>
                        </View>

                        <Switch
                            value={isArchived}
                            onValueChange={
                                setIsArchived
                            }
                            trackColor={{
                                false: "#D9D9D9",
                                true: colors.primary,
                            }}
                            thumbColor={
                                colors.white
                            }
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

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
