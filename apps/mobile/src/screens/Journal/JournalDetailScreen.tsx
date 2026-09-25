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
            "Supprimer la page",
            "Voulez-vous vraiment supprimer cette page de journal ?",
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
                                "Erreur",
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
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />
            </View>
        </SafeAreaView>
    );
}


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
    <SafeAreaView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>

            <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="arrow-back"
                    size={26}
                    color={colors.black}
                />
            </TouchableOpacity>


            <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDelete}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="trash-outline"
                    size={24}
                    color="#D9534F"
                />
            </TouchableOpacity>

        </View>


        {/* Content */}
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.date}>
                {journal.date}
            </Text>


            <Text style={styles.title}>
                {journal.title}
            </Text>


            <View style={styles.separator} />


            <Text style={styles.body}>
                {journal.page}
            </Text>

        </ScrollView>


        {/* Bottom action */}
        <View style={styles.bottom}>
            <Button
                text="Modifier"
                onPress={handleEdit}
            />
        </View>

    </SafeAreaView>
);
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 8,
    },

    headerButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
    },

    date: {
        color: "#999",
        fontSize: 14,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginTop: 12,
        color: colors.black,
    },

    separator: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginVertical: 24,
    },

    body: {
        fontSize: 17,
        lineHeight: 28,
        color: "#444",
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
