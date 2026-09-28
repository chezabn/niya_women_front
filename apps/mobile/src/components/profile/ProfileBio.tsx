import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import { colors } from "@/src/theme";

interface Props {
    firstName: string;
    lastName: string;
    bio?: string;
    showName?: boolean;
}

export const ProfileBio = ({
   firstName,
   lastName,
   bio,
   showName = true,
}: Props) => {
    return (
        <View style={styles.container}>
            {showName && (
                <Text style={styles.name}>
                    {firstName} {lastName}
                </Text>
            )}

            {!!bio && (
                <Text style={styles.bio}>
                    {bio}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },

    name: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 6,
    },

    bio: {
        color: colors.textSecondary,
        lineHeight: 20,
    },
});