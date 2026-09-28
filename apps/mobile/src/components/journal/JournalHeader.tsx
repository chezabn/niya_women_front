import React from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "@/src/theme";

export const JournalHeader = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Mon journal
            </Text>

            <Text style={styles.subtitle}>
                Vos pensées restent privées.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 12,
        paddingBottom: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.black,
    },

    subtitle: {
        marginTop: 6,
        fontSize: 15,
        color: "#777",
    },
});