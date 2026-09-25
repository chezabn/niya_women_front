import React, { useCallback, useEffect, useState } from "react";

import {
    FlatList,
    StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { colors } from "@/src/theme";

import { JournalHeader } from "@/src/components/journal/JournalHeader";
import { JournalEntryCard } from "@/src/components/journal/JournalEntryCard";
import { JournalEmptyState } from "@/src/components/journal/JournalEmptyState";
import { NewJournalButton } from "@/src/components/journal/NewJournalButton";

import { getMyJournals } from "@niyya/api";
import { Journal } from "@niyya/types"
import { useAuthStore } from "@/src/store/authStore";

export const JournalScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const [entries, setEntries] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);

    const loadJournals = useCallback(async () => {
        if (!accessToken) return;

        try {
            setLoading(true);

            const journals = await getMyJournals(accessToken);

            setEntries(journals);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des journaux :",
                error
            );
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        loadJournals();
    }, [loadJournals]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={entries}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={({ item }) => (
                    <JournalEntryCard
                        title={item.title}
                        content={item.page}
                        date={item.date}
                        onPress={() =>
                            router.push(
                                `/journal/${item.id}`
                            )
                        }
                    />
                )}
                ListHeaderComponent={
                    <JournalHeader />
                }
                ListEmptyComponent={
                    !loading ? (
                        <JournalEmptyState />
                    ) : null
                }
                contentContainerStyle={
                    styles.content
                }
            />

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
        backgroundColor: colors.white,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
        flexGrow: 1,
    },
});