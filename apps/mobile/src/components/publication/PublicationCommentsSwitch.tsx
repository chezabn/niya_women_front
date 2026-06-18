import React from "react";
import {
    View,
    Text,
    Switch,
    StyleSheet,
} from "react-native";

interface Props {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const PublicationCommentsSwitch = ({
                                              value,
                                              onChange,
                                          }: Props) => {
    return (
        <View style={styles.container}>
            <Text>
                Autoriser les commentaires
            </Text>

            <Switch
                value={value}
                onValueChange={onChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16,
    },
});