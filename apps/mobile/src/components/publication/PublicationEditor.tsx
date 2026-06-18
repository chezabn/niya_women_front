import React from "react";
import {
    TextInput,
    StyleSheet,
} from "react-native";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export const PublicationEditor = ({
                                      value,
                                      onChange,
                                  }: Props) => {
    return (
        <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Partage quelque chose..."
            multiline
            style={styles.input}
            maxLength={2200}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        minHeight: 150,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        textAlignVertical: "top",
    },
});