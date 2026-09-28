import React, { useCallback, useState } from "react";

import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useFocusEffect,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";

import { JournalHeader } from "@/src/components/journal/JournalHeader";
import { JournalEntryCard } from "@/src/components/journal/JournalEntryCard";
import { JournalEmptyState } from "@/src/components/journal/JournalEmptyState";
import { NewJournalButton } from "@/src/components/journal/NewJournalButton";

import { getMyJournals } from "@niyya/api";
import { Journal } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";

export const JournalScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [entries, setEntries] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadJournals = useCallback(
        async (isRefresh = false) => {
            if (!accessToken) {
                return;
            }

            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const journals = await getMyJournals(
                    accessToken,
                );

                setEntries(journals);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des journaux :",
                    error,
                );
            } finally {
                if (isRefresh) {
                    setRefreshing(false);
                } else {
                    setLoading(false);
                }
            }
        },
        [accessToken],
    );

    useFocusEffect(
        useCallback(() => {
            loadJournals();
        }, [loadJournals]),
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={entries}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={({ item }) => (
                    <View style={styles.entryWrapper}>
                        <JournalEntryCard
                            title={item.title}
                            content={item.page}
                            date={item.date}
                            onPress={() =>
                                router.push(
                                    `/journal/${item.id}`,
                                )
                            }
                        />
                    </View>
                )}
                ListHeaderComponent={
                    <View>
                        {/* Retour */}
                        <TouchableOpacity
                            style={styles.backButton}
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

                        {/* En-tête */}
                        <JournalHeader />

                        {/* Invitation */}
                        <View style={styles.introCard}>
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
                                    Un espace rien qu'à vous
                                </Text>

                                <Text
                                    style={
                                        styles.introText
                                    }
                                >
                                    Vos pensées, vos émotions,
                                    vos souvenirs... Écrivez
                                    librement, sans jugement.
                                </Text>
                            </View>
                        </View>

                        {entries.length > 0 && (
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
                                        Mes pages
                                    </Text>

                                    <Text
                                        style={
                                            styles.sectionSubtitle
                                        }
                                    >
                                        Retrouvez vos moments
                                        en toute simplicité.
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.countBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.countText
                                        }
                                    >
                                        {entries.length}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    !loading ? (
                        <JournalEmptyState />
                    ) : null
                }
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() =>
                            loadJournals(true)
                        }
                        tintColor={colors.primary}
                    />
                }
            />

            {/* Bouton nouvelle page */}
            <NewJournalButton
                onPress={() =>
                    router.push("/journal/new")
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 110,
        flexGrow: 1,
    },

    /*
     * Retour
     */

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
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
        marginTop: 18,
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
     * Section des pages
     */

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 3,
    },

    sectionSubtitle: {
        fontSize: 12,
        color: colors.textMuted,
    },

    countBadge: {
        minWidth: 32,
        height: 32,
        paddingHorizontal: 9,
        borderRadius: 16,
        backgroundColor: "#F8F0DE",
        alignItems: "center",
        justifyContent: "center",
    },

    countText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary,
    },

    /*
     * Pages
     */

    entryWrapper: {
        marginBottom: 14,
    },
});