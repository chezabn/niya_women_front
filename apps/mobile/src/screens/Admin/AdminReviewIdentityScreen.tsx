import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { colors } from "@/src/theme";

export const AdminReviewIdentityScreen = () => {
    const [rejectionReason, setRejectionReason] =
        useState("");

    const handleApprove = async () => {
        Alert.alert(
            "Validation",
            "Demande approuvée",
        );
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            Alert.alert(
                "Erreur",
                "Veuillez indiquer une raison."
            );

            return;
        }

        Alert.alert(
            "Rejet",
            "Demande rejetée",
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Vérification d'identité
                </Text>

                <Text style={styles.sectionTitle}>
                    Pièce d'identité
                </Text>

                <Image
                    source={{
                        uri: "https://via.placeholder.com/400",
                    }}
                    style={styles.image}
                />

                <Text style={styles.sectionTitle}>
                    Selfie
                </Text>

                <Image
                    source={{
                        uri: "https://via.placeholder.com/400",
                    }}
                    style={styles.image}
                />

                <Input
                    placeholder="Motif du rejet"
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                />

                <Button
                    text="Approuver"
                    onPress={handleApprove}
                />

                <View style={{ height: 12 }} />

                <Button
                    text="Rejeter"
                    onPress={handleReject}
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
        padding: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
        textAlign: "center",
    },

    sectionTitle: {
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 16,
    },

    image: {
        width: "100%",
        height: 250,
        borderRadius: 12,
    },
});