import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    placeholder: string;
    secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
                                                      placeholder,
                                                      secureTextEntry = false,
                                                      ...rest // Permet de récupérer onChangeText, value, keyboardType, etc.
                                                  }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#A0A0A0"
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                {...rest}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 15,
        backgroundColor: '#FAFAFA',
        color: '#333333',
    },
});