import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/theme";

export const IdentityVerificationScreen = () => {
    const [idCard, setIdCard] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);

    const pickImage = async (
        setter: React.Dispatch<React.SetStateAction<string | null>>,
    ) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: true,
        });

        if (!result.canceled) {
            setter(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!idCard || !selfie) {
            Alert.alert(
                "Documents manquants",
                "Veuillez sélectionner les deux photos.",
            );
            return;
        }

        console.log({
            idCard,
            selfie,
        });

        // TODO:
        // submitIdentityVerification(...)
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Vérification d'identité
                </Text>

                <Text style={styles.subtitle}>
                    Pour sécuriser la communauté Niyya,
                    nous devons vérifier votre identité.
                </Text>

                <Button
                    text="Choisir ma pièce d'identité"
                    onPress={() => pickImage(setIdCard)}
                />

                {idCard && (
                    <Image
                        source={{ uri: idCard }}
                        style={styles.preview}
                    />
                )}

                <Button
                    text="Choisir mon selfie"
                    onPress={() => pickImage(setSelfie)}
                />

                {selfie && (
                    <Image
                        source={{ uri: selfie }}
                        style={styles.preview}
                    />
                )}

                <Button
                    text="Envoyer ma demande"
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: colors.textSecondary,
        marginBottom: 32,
        lineHeight: 22,
    },

    preview: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginVertical: 12,
    },
});