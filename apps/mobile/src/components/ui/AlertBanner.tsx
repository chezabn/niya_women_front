import React from "react";

import {
    View,
    Text,
    StyleSheet,
} from "react-native";


type AlertType =
    | "error"
    | "success"
    | "warning"
    | "info";

interface Props {
    type?: AlertType;

    message: string;

    visible: boolean;
}

export const AlertBanner = ({
                                type = "error",
                                message,
                                visible,
                            }: Props) => {
    if (!visible || !message) {
        return null;
    }

    return (
        <View
            style={[
                styles.container,
                stylesByType[type],
            ]}
        >
            <Text style={styles.text}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
    },

    text: {
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 22,
    },
});

const stylesByType = StyleSheet.create({
    error: {
        backgroundColor: "#FEECEC",
        borderColor: "#F5C2C7",
    },

    success: {
        backgroundColor: "#ECFDF3",
        borderColor: "#A6F4C5",
    },

    warning: {
        backgroundColor: "#FFF8E6",
        borderColor: "#F9D976",
    },

    info: {
        backgroundColor: "#EEF4FF",
        borderColor: "#B6CCFF",
    },
});