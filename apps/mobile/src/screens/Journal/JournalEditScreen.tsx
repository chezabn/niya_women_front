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
                "Un petit titre",
                "Donnez un titre à cette page de votre journal.",
            );
            return;
        }

        if (!page.trim()) {
            Alert.alert(
                "Prenez un moment pour vous",
                "Écrivez quelques mots avant d'enregistrer votre page.",
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
                "Une erreur est survenue",
                "Impossible d'enregistrer les modifications de cette page.",
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
                    "Une erreur est survenue",
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
                    <View
                        style={
                            styles.loadingIcon
                        }
                    >
                        <Ionicons
                            name="book-outline"
                            size={24}
                            color={colors.primary}
                        />
                    </View>

                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                        style={
                            styles.loadingIndicator
                        }
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Ouverture de votre page...
                    </Text>
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
                <View
                    style={
                        styles.errorContainer
                    }
                >
                    <View
                        style={
                            styles.errorIcon
                        }
                    >
                        <Ionicons
                            name="book-outline"
                            size={27}
                            color={colors.primary}
                        />
                    </View>

                    <Text
                        style={
                            styles.errorTitle
                        }
                    >
                        Page introuvable
                    </Text>

                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        Cette page de votre journal
                        n'est plus disponible.
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.errorButton
                        }
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
                            size={18}
                            color={colors.primary}
                        />

                        <Text
                            style={
                                styles.headerLabel
                            }
                        >
                            Modifier ma page
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
                                name="heart-outline"
                                size={19}
                                color={colors.primary}
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
                                Prenez le temps de vous relire
                            </Text>

                            <Text
                                style={
                                    styles.introText
                                }
                            >
                                Vous pouvez modifier cette page
                                comme vous le souhaitez. Vos mots
                                restent les vôtres.
                            </Text>
                        </View>
                    </View>


                    {/* Titre */}

                    <View
                        style={
                            styles.titleSection
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
                                        styles.label
                                    }
                                >
                                    Le titre de votre page
                                </Text>

                                <Text
                                    style={
                                        styles.hint
                                    }
                                >
                                    Donnez un nom à ce moment.
                                </Text>
                            </View>

                            <Ionicons
                                name="text-outline"
                                size={21}
                                color={colors.primary}
                            />
                        </View>

                        <View
                            style={
                                styles.titleCard
                            }
                        >
                            <TextInput
                                style={
                                    styles.titleInput
                                }
                                value={title}
                                onChangeText={
                                    setTitle
                                }
                                placeholder="Comment appeler ce moment ?"
                                placeholderTextColor={
                                    colors.textMuted
                                }
                                maxLength={100}
                            />

                            <Text
                                style={
                                    styles.counter
                                }
                            >
                                {title.length}/100
                            </Text>
                        </View>
                    </View>


                    {/* Journal */}

                    <View
                        style={
                            styles.journalSection
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
                                        styles.label
                                    }
                                >
                                    Votre espace
                                </Text>

                                <Text
                                    style={
                                        styles.hint
                                    }
                                >
                                    Relisez, ajoutez ou changez
                                    ce que vous ressentez.
                                </Text>
                            </View>

                            <Ionicons
                                name="heart-outline"
                                size={21}
                                color={colors.primary}
                            />
                        </View>

                        <View
                            style={
                                styles.paper
                            }
                        >
                            <TextInput
                                style={
                                    styles.pageInput
                                }
                                value={page}
                                onChangeText={
                                    setPage
                                }
                                placeholder="Écrivez ce que vous ressentez..."
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
                                <Text
                                    style={
                                        styles.helperText
                                    }
                                >
                                    Prenez votre temps...
                                </Text>

                                <Text
                                    style={
                                        styles.counter
                                    }
                                >
                                    {page.length}/5000
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* Réassurance */}

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
                                Vous pouvez revenir sur vos
                                mots et les faire évoluer au
                                fil du temps.
                            </Text>
                        </View>
                    </View>

                </ScrollView>


                {/* Bouton */}

                <View
                    style={styles.bottom}
                >
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


    /*
     * Header
     */

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

    headerLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textSecondary,
    },

    headerSpacer: {
        width: 44,
        height: 44,
    },


    /*
     * Scroll
     */

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 35,
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
        marginBottom: 26,
    },

    introIcon: {
        width: 38,
        height: 38,
        borderRadius: 13,
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
     * Sections
     */

    titleSection: {
        marginBottom: 26,
    },

    journalSection: {
        marginBottom: 24,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    label: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 4,
    },

    hint: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.textMuted,
    },


    /*
     * Titre
     */

    titleCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        paddingTop: 3,
        paddingBottom: 8,
    },

    titleInput: {
        height: 50,
        padding: 0,
        fontSize: 17,
        color: colors.black,
    },

    counter: {
        alignSelf: "flex-end",
        marginTop: 5,
        fontSize: 11,
        color: colors.textMuted,
    },


    /*
     * Journal
     */

    paper: {
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
    },

    pageInput: {
        minHeight: 285,
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
        width: 54,
        height: 54,
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
     * Error
     */

    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    errorIcon: {
        width: 62,
        height: 62,
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