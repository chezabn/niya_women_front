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

        if (!caption.trim()) {
            Alert.alert(
                "Votre publication est vide",
                "Ajoutez quelques mots avant d'enregistrer vos modifications.",
            );
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
                "Une erreur est survenue",
                "Impossible d'enregistrer les modifications de cette publication.",
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
                    "Une erreur est survenue",
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
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <View style={styles.loadingIcon}>
                        <Ionicons
                            name="create-outline"
                            size={25}
                            color={colors.primary}
                        />
                    </View>

                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                        style={styles.loadingIndicator}
                    />

                    <Text style={styles.loadingText}>
                        Ouverture de votre publication...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }


    /*
     * Publication introuvable
     */
    if (!publication) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                        <Ionicons
                            name="document-text-outline"
                            size={28}
                            color={colors.primary}
                        />
                    </View>

                    <Text style={styles.errorTitle}>
                        Publication introuvable
                    </Text>

                    <Text style={styles.errorText}>
                        Cette publication n'est plus
                        disponible.
                    </Text>

                    <TouchableOpacity
                        style={styles.errorButton}
                        onPress={() =>
                            router.back()
                        }
                        activeOpacity={0.8}
                    >
                        <Text
                            style={
                                styles.errorButtonText
                            }
                        >
                            Retour
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }


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

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() =>
                            router.back()
                        }
                        activeOpacity={0.7}
                        hitSlop={8}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={colors.black}
                        />
                    </TouchableOpacity>

                    <View
                        style={
                            styles.headerCenter
                        }
                    >
                        <Ionicons
                            name="create-outline"
                            size={19}
                            color={colors.primary}
                        />

                        <Text
                            style={
                                styles.headerTitle
                            }
                        >
                            Modifier la publication
                        </Text>
                    </View>

                    <View
                        style={
                            styles.headerSpacer
                        }
                    />
                </View>


                {/* Contenu */}
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
                                name="sparkles-outline"
                                size={20}
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
                                Votre publication, vos mots
                            </Text>

                            <Text
                                style={
                                    styles.introText
                                }
                            >
                                Modifiez votre texte comme
                                vous le souhaitez avant de
                                retrouver votre publication
                                dans votre fil.
                            </Text>
                        </View>
                    </View>


                    {/* Composition */}
                    <View
                        style={
                            styles.compositionSection
                        }
                    >
                        <View
                            style={
                                styles.sectionHeader
                            }
                        >
                            <View>
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Modifier votre publication
                                </Text>

                                <Text
                                    style={
                                        styles.sectionSubtitle
                                    }
                                >
                                    Partagez ce que vous
                                    souhaitez exprimer.
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.sectionIcon
                                }
                            >
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={19}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>
                        </View>


                        <View
                            style={
                                styles.composer
                            }
                        >
                            <TextInput
                                style={
                                    styles.captionInput
                                }
                                value={caption}
                                onChangeText={
                                    setCaption
                                }
                                placeholder="Qu'avez-vous envie de partager ?"
                                placeholderTextColor={
                                    colors.textMuted
                                }
                                multiline
                                textAlignVertical="top"
                                maxLength={2000}
                            />

                            <View
                                style={
                                    styles.composerFooter
                                }
                            >
                                <View
                                    style={
                                        styles.footerHint
                                    }
                                >
                                    <Ionicons
                                        name="heart-outline"
                                        size={15}
                                        color={
                                            colors.textMuted
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.footerHintText
                                        }
                                    >
                                        Prenez votre temps...
                                    </Text>
                                </View>

                                <Text
                                    style={
                                        styles.counter
                                    }
                                >
                                    {caption.length}/2000
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* Options */}
                    <View
                        style={
                            styles.optionsSection
                        }
                    >
                        <View
                            style={
                                styles.optionsHeader
                            }
                        >
                            <Text
                                style={
                                    styles.optionsTitle
                                }
                            >
                                Options de publication
                            </Text>

                            <Text
                                style={
                                    styles.optionsSubtitle
                                }
                            >
                                Personnalisez la façon dont
                                votre publication est visible.
                            </Text>
                        </View>


                        {/* Commentaires */}
                        <View
                            style={
                                styles.optionCard
                            }
                        >
                            <View
                                style={
                                    styles.optionIcon
                                }
                            >
                                <Ionicons
                                    name="chatbubbles-outline"
                                    size={20}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.optionContent
                                }
                            >
                                <Text
                                    style={
                                        styles.optionTitle
                                    }
                                >
                                    Autoriser les commentaires
                                </Text>

                                <Text
                                    style={
                                        styles.optionDescription
                                    }
                                >
                                    Les autres utilisatrices
                                    pourront répondre à votre
                                    publication.
                                </Text>
                            </View>

                            <Switch
                                value={
                                    commentsEnabled
                                }
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
                            style={
                                styles.optionCard
                            }
                        >
                            <View
                                style={[
                                    styles.optionIcon,
                                    isArchived &&
                                    styles.archivedIcon,
                                ]}
                            >
                                <Ionicons
                                    name="archive-outline"
                                    size={20}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.optionContent
                                }
                            >
                                <Text
                                    style={
                                        styles.optionTitle
                                    }
                                >
                                    Archiver cette publication
                                </Text>

                                <Text
                                    style={
                                        styles.optionDescription
                                    }
                                >
                                    Elle ne sera plus visible
                                    dans votre contenu actif.
                                </Text>
                            </View>

                            <Switch
                                value={
                                    isArchived
                                }
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
                    </View>


                    {/* Message final */}
                    <View
                        style={
                            styles.reassurance
                        }
                    >
                        <View
                            style={
                                styles.reassuranceIcon
                            }
                        >
                            <Ionicons
                                name="people-outline"
                                size={17}
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
                                Un espace pour échanger
                            </Text>

                            <Text
                                style={
                                    styles.reassuranceText
                                }
                            >
                                Vos publications sont là
                                pour créer des échanges,
                                partager vos expériences et
                                vous rapprocher des autres.
                            </Text>
                        </View>
                    </View>

                </ScrollView>


                {/* Bouton */}
                <View style={styles.bottom}>
                    <Button
                        text="Enregistrer les changements"
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

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: 10,
    },

    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    headerCenter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    headerTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textSecondary,
    },

    headerSpacer: {
        width: 44,
        height: 44,
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
    },

    /*
     * Introduction
     */
    introCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FDF8ED",
        borderRadius: 18,
        padding: 15,
        marginBottom: 28,
    },

    introIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
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
     * Composition
     */
    compositionSection: {
        marginBottom: 28,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 4,
    },

    sectionSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.textMuted,
    },

    sectionIcon: {
        width: 38,
        height: 38,
        borderRadius: 13,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
    },

    composer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 16,
    },

    captionInput: {
        minHeight: 230,
        padding: 0,
        fontSize: 16,
        lineHeight: 27,
        color: colors.black,
    },

    composerFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 11,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    footerHint: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    footerHintText: {
        fontSize: 11,
        fontStyle: "italic",
        color: colors.textMuted,
    },

    counter: {
        fontSize: 11,
        color: colors.textMuted,
    },

    /*
     * Options
     */
    optionsSection: {
        marginBottom: 24,
    },

    optionsHeader: {
        marginBottom: 12,
    },

    optionsTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 4,
    },

    optionsSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.textMuted,
    },

    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        padding: 14,
        marginBottom: 10,
    },

    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    archivedIcon: {
        backgroundColor: "#F4ECEB",
    },

    optionContent: {
        flex: 1,
        paddingRight: 10,
    },

    optionTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 3,
    },

    optionDescription: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.textSecondary,
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
     * Bottom
     */
    bottom: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.white,
    },

    /*
     * Loading
     */
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    loadingIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    loadingIndicator: {
        marginBottom: 10,
    },

    loadingText: {
        fontSize: 13,
        color: colors.textSecondary,
    },

    /*
     * Erreur
     */
    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    errorIcon: {
        width: 64,
        height: 64,
        borderRadius: 21,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 7,
    },

    errorText: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 22,
    },

    errorButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: colors.primary,
    },

    errorButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.white,
    },
});