import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    getIdentityReview,
    reviewIdentity,
} from "@niyya/api";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

import { colors } from "@/src/theme";
import {useAuthStore} from "@/src/store/authStore";

interface Props {
    verificationId: number;
}

export const AdminReviewIdentityScreen = ({
                                              verificationId,
                                          }: Props) => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [verification, setVerification] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [rejectionReason, setRejectionReason] =
        useState("");

    useEffect(() => {
        loadVerification();
    }, []);

    const loadVerification = async () => {
        try {
            const response =
                await getIdentityReview(
                    verificationId,
                    accessToken!,
                );

            setVerification(response);
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Erreur",
                "Impossible de charger la demande.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const response =
                await reviewIdentity(
                    verificationId,
                    {
                        action: "approve",
                    },
                    accessToken!,
                );

            Alert.alert(
                "Succès",
                response.message,
            );
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Erreur",
                "Impossible de valider la demande.",
            );
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            Alert.alert(
                "Erreur",
                "Veuillez indiquer une raison de rejet.",
            );

            return;
        }

        try {
            const response =
                await reviewIdentity(
                    verificationId,
                    {
                        action: "reject",
                        rejection_reason:
                        rejectionReason,
                    },
                    accessToken!,
                );

            Alert.alert(
                "Succès",
                response.message,
            );
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Erreur",
                "Impossible de rejeter la demande.",
            );
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text>
                        Chargement...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!verification) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text>
                        Demande introuvable.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>
                    Vérification d'identité
                </Text>

                <Text style={styles.username}>
                    {verification.user?.username}
                </Text>

                <Text style={styles.sectionTitle}>
                    Pièce d'identité
                </Text>

                <Image
                    source={{
                        uri: verification.id_card_front,
                    }}
                    style={styles.image}
                />

                <Text style={styles.sectionTitle}>
                    Selfie
                </Text>

                <Image
                    source={{
                        uri: verification.selfie_with_id,
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

                <View style={styles.spacing} />

                <Button
                    text="Rejeter"
                    onPress={handleReject}
                />
            </ScrollView>
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
        textAlign: "center",
        marginBottom: 8,
    },

    username: {
        textAlign: "center",
        color: colors.textSecondary,
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },

    image: {
        width: "100%",
        height: 250,
        borderRadius: 12,
    },

    spacing: {
        height: 12,
    },
});