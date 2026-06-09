import React, {useState} from "react";
import {Alert, Image, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { submitIdentityVerification } from "@niyya/api";
import { useAuthStore } from "@/src/store/authStore";
import {Button} from "@/src/components/ui/Button";
import {colors} from "@/src/theme";
import {useImagePicker} from "@/src/hooks/useImagePicker";

export const IdentityVerificationScreen = () => {
    const [idCard, setIdCard] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const { takePhoto } = useImagePicker();

    const takeIdCard = async () => {
        const photo = await takePhoto();

        if (photo) {
            setIdCard(photo.uri);
        }
    };

    const takeSelfie = async () => {
        const photo = await takePhoto();

        if (photo) {
            setSelfie(photo.uri);
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

        try {
            const response =
                await submitIdentityVerification(
                    idCard,
                    selfie,
                    accessToken!,
                );

            Alert.alert(
                "Demande envoyée",
                response.message,
            );

        } catch (error: any) {
            Alert.alert(
                "Erreur",
                error.detail || "Impossible d'envoyer les documents.",
            );
        }
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
                    text="Prendre une photo de ma pièce d'identité"
                    onPress={takeIdCard}
                />

                {idCard && (
                    <Image
                        source={{ uri: idCard }}
                        style={styles.preview}
                    />
                )}

                <Button
                    text="Prendre un selfie"
                    onPress={takeSelfie}
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