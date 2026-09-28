import React, { useCallback, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";
import { Button } from "@/src/components/ui/Button";

import { Journal } from "@niyya/types";

import {
    getPage,
    deletePage,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";


const getJournalById = async (
    id: string,
    accessToken: string,
): Promise<Journal> => {
    return getPage(
        accessToken,
        Number(id),
    );
};


const deleteJournalById = async (
    id: number,
    accessToken: string,
): Promise<void> => {
    await deletePage(
        accessToken,
        id,
    );
};


const formatJournalDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    );
};


export const JournalDetailScreen = () => {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [journal, setJournal] =
        useState<Journal | null>(null);

    const [loading, setLoading] =
        useState(true);


    useFocusEffect(
        useCallback(() => {
            const loadJournal = async () => {
                if (!id || !accessToken) {
                    setLoading(false);
                    return;
                }

                try {
                    setLoading(true);

                    const data = await getJournalById(
                        id,
                        accessToken,
                    );

                    setJournal(data);
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement du journal :",
                        error,
                    );
                } finally {
                    setLoading(false);
                }
            };

            loadJournal();
        }, [id, accessToken]),
    );


    const handleDelete = () => {
        if (!journal || !accessToken) {
            return;
        }

        Alert.alert(
            "Supprimer cette page ?",
            "Cette page sera définitivement supprimée de votre journal.",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteJournalById(
                                journal.id,
                                accessToken,
                            );

                            router.back();
                        } catch (error) {
                            console.error(
                                "Erreur lors de la suppression du journal :",
                                error,
                            );

                            Alert.alert(
                                "Une erreur est survenue",
                                "Impossible de supprimer cette page de journal.",
                            );
                        }
                    },
                },
            ],
        );
    };


    const handleEdit = () => {
        if (!journal) {
            return;
        }

        router.push(
            `/journal/${journal.id}/edit`,
);
};


if (loading) {
    return (
        <SafeAreaView
            style={styles.container}
        >
            <View style={styles.loading}>
                <View style={styles.loadingIcon}>
                    <Ionicons
                        name="book-outline"
                        size={24}
                        color={colors.primary}
                    />
                </View>

                <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.loadingIndicator}
                />

                <Text style={styles.loadingText}>
                    Votre page arrive...
                </Text>
            </View>
        </SafeAreaView>
    );
}


if (!journal) {
    return (
        <SafeAreaView
            style={styles.container}
        >
            <View style={styles.errorContainer}>
                <View style={styles.errorIcon}>
                    <Ionicons
                        name="book-outline"
                        size={27}
                        color={colors.primary}
                    />
                </View>

                <Text style={styles.errorTitle}>
                    Page introuvable
                </Text>

                <Text style={styles.errorText}>
                    Cette page de votre journal
                    n'est plus disponible.
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


            <View style={styles.headerCenter}>
                <Ionicons
                    name="book-outline"
                    size={18}
                    color={colors.primary}
                />

                <Text
                    style={
                        styles.headerLabel
                    }
                >
                    Mon journal
                </Text>
            </View>


            <TouchableOpacity
                style={[
                    styles.headerButton,
                    styles.deleteButton,
                ]}
                onPress={handleDelete}
                activeOpacity={0.7}
                hitSlop={8}
            >
                <Ionicons
                    name="trash-outline"
                    size={21}
                    color="#D9534F"
                />
            </TouchableOpacity>

        </View>


        {/* Content */}
        <ScrollView
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={false}
        >

            {/* Date */}
            <View style={styles.dateRow}>
                <View
                    style={
                        styles.dateDot
                    }
                />

                <Text style={styles.date}>
                    {formatJournalDate(
                        journal.date,
                    )}
                </Text>
            </View>


            {/* Page */}
            <View style={styles.page}>

                {/* Petit élément décoratif */}
                <View
                    style={
                        styles.pageDecoration
                    }
                >
                    <Ionicons
                        name="heart-outline"
                        size={19}
                        color={colors.primary}
                    />
                </View>


                {/* Titre */}
                <Text style={styles.title}>
                    {journal.title}
                </Text>


                <View
                    style={
                        styles.separator
                    }
                />


                {/* Contenu */}
                <Text style={styles.body}>
                    {journal.page}
                </Text>


                {/* Fin de page */}
                <View
                    style={
                        styles.pageEnd
                    }
                >
                    <View
                        style={
                            styles.pageEndLine
                        }
                    />

                    <Ionicons
                        name="heart-outline"
                        size={16}
                        color={colors.primary}
                    />

                    <View
                        style={
                            styles.pageEndLine
                        }
                    />
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
                        size={16}
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
                        Cette page vous appartient.
                        Revenez-y quand vous en avez
                        envie.
                    </Text>
                </View>
            </View>

        </ScrollView>


        {/* Bottom action */}
        <View style={styles.bottom}>
            <Button
                text="Modifier cette page"
                onPress={handleEdit}
            />
        </View>

    </SafeAreaView>
);
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
        backgroundColor: colors.background,
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

    deleteButton: {
        borderColor: "#F1D6D4",
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


    /*
     * Content
     */

    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 35,
    },


    /*
     * Date
     */

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    dateDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginRight: 8,
    },

    date: {
        fontSize: 13,
        fontWeight: "500",
        color: colors.textSecondary,
        textTransform: "capitalize",
    },


    /*
     * Page
     */

    page: {
        backgroundColor: colors.white,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 22,
        paddingTop: 22,
        paddingBottom: 28,
    },

    pageDecoration: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    title: {
        fontSize: 29,
        lineHeight: 36,
        fontWeight: "700",
        color: colors.black,
    },

    separator: {
        height: 1,
        backgroundColor: "#EEEAE2",
        marginVertical: 22,
    },

    body: {
        fontSize: 17,
        lineHeight: 29,
        color: "#3F3F3F",
    },


    /*
     * Fin de page
     */

    pageEnd: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 35,
        paddingHorizontal: 20,
    },

    pageEndLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#EEEAE2",
    },


    /*
     * Réassurance
     */

    reassurance: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDF8ED",
        borderRadius: 17,
        padding: 14,
        marginTop: 18,
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
