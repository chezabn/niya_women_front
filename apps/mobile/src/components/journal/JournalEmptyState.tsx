import React from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "@/src/theme";

export const JournalEmptyState = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>
                📖
            </Text>

            <Text style={styles.title}>
                Votre journal est vide
            </Text>

            <Text style={styles.description}>
                Chaque page est un espace pour déposer
                vos pensées, vos émotions ou vos
                souvenirs.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 80,
        alignItems: "center",
    },

    icon: {
        fontSize: 52,
    },

    title: {
        marginTop: 24,
        fontWeight: "700",
        fontSize: 22,
        color: colors.black,
    },

    description: {
        marginTop: 12,
        textAlign: "center",
        color: "#777",
        fontSize: 15,
        lineHeight: 22,
        paddingHorizontal: 32,
    },
});