import React from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";

import { colors } from "@/src/theme";

export type ProfileTab =
    | "posts"
    | "saved";

interface Props {
    activeTab: ProfileTab;
    onChange: (
        tab: ProfileTab,
    ) => void;
}

export const ProfileTabs = ({
                                activeTab,
                                onChange,
                            }: Props) => {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.tab}
                onPress={() =>
                    onChange("posts")
                }
            >
                <Text
                    style={[
                        styles.text,
                        activeTab ===
                        "posts" &&
                        styles.activeText,
                    ]}
                >
                    Publications
                </Text>
            </Pressable>

            <Pressable
                style={styles.tab}
                onPress={() =>
                    onChange("saved")
                }
            >
                <Text
                    style={[
                        styles.text,
                        activeTab ===
                        "saved" &&
                        styles.activeText,
                    ]}
                >
                    Enregistrés
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#EEE",
    },

    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
    },

    text: {
        color: "#888",
        fontWeight: "500",
    },

    activeText: {
        color: colors.primary,
        fontWeight: "700",
    },
});