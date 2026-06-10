import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";

import { colors } from "@/src/theme";

interface Props {
    username: string;
    avatar?: string;
}

export const ProfileHeader = ({
                                  username,
                                  avatar,
                              }: Props) => {
    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri:
                        avatar ??
                        "https://via.placeholder.com/150",
                }}
                style={styles.avatar}
            />

            <Text style={styles.username}>
                @{username}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 20,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },

    username: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.text,
    },
});