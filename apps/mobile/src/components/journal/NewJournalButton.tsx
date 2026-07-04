import React from "react";

import {
    StyleSheet,
    View,
} from "react-native";

import { Button } from "@/src/components/ui/Button";

interface Props {
    onPress: () => void;
}

export const NewJournalButton = ({
                                     onPress,
                                 }: Props) => {
    return (
        <View style={styles.container}>
        <Button
            text="Nouvelle page"
    onPress={onPress}
    />
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});