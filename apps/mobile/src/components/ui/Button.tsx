import React from 'react';
import { TouchableOpacity, Text, StyleSheet, DimensionValue, ActivityIndicator } from 'react-native';

interface ButtonProps {
    text: string;
    onPress: () => void;
    color?: string;
    textColor?: string;
    width?: DimensionValue;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                        text,
                                                        onPress,
                                                        color = '#C89A2D',
                                                        textColor = '#FFFFFF',
                                                        width = '100%',
                                                        isLoading = false,
                                                    }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color, width }]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        // Petit ombrage léger pour faire pro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});