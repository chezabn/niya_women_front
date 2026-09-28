import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

interface Props {
    posts: number;
    followers: number;
    following: number;
}

export const ProfileStats = ({
                                 posts,
                                 followers,
                                 following,
                             }: Props) => {
    const Stat = ({
                      value,
                      label,
                  }: {
        value: number;
        label: string;
    }) => (
        <View style={styles.item}>
            <Text style={styles.value}>
                {value}
            </Text>

            <Text style={styles.label}>
                {label}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stat
                value={posts}
                label="Posts"
            />

            <Stat
                value={followers}
                label="Abonnés"
            />

            <Stat
                value={following}
                label="Abonnements"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 24,
    },

    item: {
        alignItems: "center",
    },

    value: {
        fontSize: 18,
        fontWeight: "700",
    },

    label: {
        fontSize: 14,
        color: "#777",
    },
});