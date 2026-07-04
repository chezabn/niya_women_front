import React from "react";

import {
    View,
    StyleSheet,
} from "react-native";

import { Button } from "@/src/components/ui/Button";

interface Props {
    onEditProfile: () => void;
    onJournal: () => void;
    onSettings: () => void;
}

export const ProfileActionButtons = ({
                                         onEditProfile,
                                         onJournal,
                                         onSettings,
                                     }: Props) => {
    return (
        <View style={styles.container}>
            <Button
                text="Mon journal"
                onPress={onJournal}
            />

            <View style={styles.row}>
                <View style={styles.button}>
                    <Button
                        text="Modifier"
                        onPress={onEditProfile}
                    />
                </View>

                <View style={styles.button}>
                    <Button
                        text="Paramètres"
                        onPress={onSettings}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
        marginBottom: 24,
    },

    row: {
        flexDirection: "row",
        gap: 12,
    },

    button: {
        flex: 1,
    },
});