import React from "react";
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";

interface Props {
    uri?: string;
    onPress: () => void;
}

export const ProfileAvatarPicker = ({
                                        uri,
                                        onPress,
                                    }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            {uri ? (
                <Image
                    source={{ uri }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatar}>
                    <Text>
                        📷
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 24,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
    },
});