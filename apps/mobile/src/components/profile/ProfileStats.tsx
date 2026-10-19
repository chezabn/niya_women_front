import React from "react";
import {
    Pressable,
    View,
    Text,
    StyleSheet,
} from "react-native";

interface Props {
    posts: number;
    followers: number;
    following: number;
    onFollowersPress?: () => void;
    onFollowingPress?: () => void;
}

export const ProfileStats = ({
                                 posts,
                                 followers,
                                 following,
                                 onFollowersPress,
                                 onFollowingPress,
                             }: Props) => {
    const Stat = ({
                      value,
                      label,
                      onPress,
                  }: {
        value: number;
        label: string;
        onPress?: () => void;
    }) => (
        <Pressable style={styles.item} onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? "button" : undefined}>
            <Text style={styles.value}>
                {value}
            </Text>

            <Text style={styles.label}>
                {label}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Stat
                value={posts}
                label="Posts"
            />

            <Stat
                value={followers}
                label="Abonnées"
                onPress={onFollowersPress}
            />

            <Stat
                value={following}
                label="Abonnements"
                onPress={onFollowingPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    item: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
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
