import React from "react";

import {
    StyleSheet,
    View,
} from "react-native";

import { Button } from "@/src/components/ui/Button";

interface Props {
    onJournal: () => void;
}

export const ProfileActionButtons = ({
                                         onJournal,
                                     }: Props) => {
    return (
        <View style={styles.container}>
            <Button
                text="Mon journal"
                onPress={onJournal}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
});