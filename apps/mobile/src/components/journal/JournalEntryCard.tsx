import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "@/src/theme";

interface Props {
    title: string;

    content: string;

    date: string;

    mood?: string;

    onPress: () => void;
}

export const JournalEntryCard = ({
                                     title,
                                     content,
                                     date,
                                     mood,
                                     onPress,
                                 }: Props) => {
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <Text style={styles.date}>
                {date}
            </Text>

            {!!mood && (
                <Text style={styles.mood}>
                    {mood}
                </Text>
            )}

            <Text style={styles.title}>
                {title}
            </Text>

            <Text
                numberOfLines={3}
                style={styles.content}
            >
                {content}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ECECEC",
    },

    date: {
        color: "#999",
        fontSize: 13,
    },

    mood: {
        marginTop: 8,
        fontSize: 24,
    },

    title: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "600",
        color: colors.black,
    },

    content: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
        color: "#555",
    },
});