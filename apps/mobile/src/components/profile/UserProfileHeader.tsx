import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    colors,
} from "@/src/theme";

interface Props {
    username: string;
    onBack: () => void;
}

export const UserProfileHeader = ({
                                      username,
                                      onBack,
                                  }: Props) => {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={onBack}
                hitSlop={8}
            >
                <Ionicons
                    name="arrow-back"
                    size={26}
                    color={colors.black}
                />
            </Pressable>

            <Text
                style={styles.username}
                numberOfLines={1}
            >
                {username}
            </Text>

            <View
                style={styles.placeholder}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    backButton: {
        width: 44,
        height: 44,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    username: {
        flex: 1,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "700",
        color: colors.black,
    },

    placeholder: {
        width: 44,
    },
});