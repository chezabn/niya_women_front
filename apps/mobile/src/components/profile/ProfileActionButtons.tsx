import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";

import { Button } from "@/src/components/ui/Button";

interface Props {
    onEditProfile: () => void;
    onSettings: () => void;
}

export const ProfileActionButtons = ({
                                         onEditProfile,
                                         onSettings,
                                     }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.button}>
                <Button
                    text="Modifier"
                    onPress={
                        onEditProfile
                    }
                />
            </View>

            <View style={styles.button}>
                <Button
                    text="Paramètres"
                    onPress={onSettings}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },

    button: {
        flex: 1,
    },
});