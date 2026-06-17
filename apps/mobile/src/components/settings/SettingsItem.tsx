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
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
}

export const SettingsItem = ({
                                 title,
                                 subtitle,
                                 onPress,
                                 danger = false,
                             }: Props) => {
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <View>
                <Text
                    style={[
                        styles.title,
                        danger && styles.danger,
                    ]}
                >
                    {title}
                </Text>

                {subtitle && (
                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>

            <Text style={styles.chevron}>
                ›
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFEF",
    },

    title: {
        fontSize: 13,
        fontWeight: "500",
        color: colors.textSecondary,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: colors.textSecondary,
    },

    chevron: {
        fontSize: 24,
        color: colors.textSecondary,
    },

    danger: {
        color: "#E53935",
    },
});