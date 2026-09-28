import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Inclus dans Expo par défaut

interface SocialButtonProps {
    platform: 'google' | 'apple';
    onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ platform, onPress }) => {
    const isGoogle = platform === 'google';

    return (
        <TouchableOpacity
            style={[styles.button, isGoogle ? styles.googleButton : styles.appleButton]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <AntDesign
                    name={isGoogle ? "google" : "apple"}
                    size={20}
                    color={isGoogle ? "#DB4437" : "#FFFFFF"}
                    style={styles.icon}
                />
                <Text style={[styles.text, isGoogle ? styles.googleText : styles.appleText]}>
                    Continue with {isGoogle ? 'Google' : 'Apple'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        width: '100%',
        borderWidth: 1,
    },
    googleButton: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    appleButton: {
        backgroundColor: '#000000',
        borderColor: '#000000',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
    },
    googleText: {
        color: '#555555',
    },
    appleText: {
        color: '#FFFFFF',
    },
});