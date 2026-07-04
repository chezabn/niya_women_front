import React from "react";

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

const entries = [
    {
        id: 1,
        title: "Une belle journée",
        content:
            "Aujourd'hui je me suis sentie beaucoup plus sereine. J'ai pris du temps pour moi et cela m'a fait énormément de bien.",
        date: "24 juin 2026",
        mood: "😊",
    },
    {
        id: 2,
        title: "Fatigue",
        content:
            "Une journée un peu difficile mais je garde confiance pour demain.",
        date: "22 juin 2026",
        mood: "😔",
    },
];

export const JournalScreen = () => {
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
                        content={item.content}
                        date={item.date}
                        mood={item.mood}
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
                    <JournalEmptyState />
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