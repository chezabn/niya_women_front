import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getIdentityReview, reviewIdentity } from "@niyya/api";
import type { IdentityReviewResponse } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

interface Props { verificationId: number }

export const AdminReviewIdentityScreen = ({ verificationId }: Props) => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [verification, setVerification] = useState<IdentityReviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!accessToken) return;
            try {
                setVerification(await getIdentityReview(verificationId, accessToken));
            } catch (error) {
                console.error(error);
                Alert.alert("Erreur", "Impossible de charger cette demande.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [accessToken, verificationId]);

    const submitReview = async (action: "approve" | "reject") => {
        if (!accessToken || submitting) return;
        if (action === "reject" && !rejectionReason.trim()) {
            Alert.alert("Motif requis", "Veuillez indiquer la raison du refus.");
            return;
        }
        setSubmitting(true);
        try {
            const response = await reviewIdentity(verificationId, {
                action,
                ...(action === "reject" ? { rejection_reason: rejectionReason.trim() } : {}),
            }, accessToken);
            Alert.alert(action === "approve" ? "Identité approuvée" : "Demande refusée", response.message, [
                { text: "Retour aux demandes", onPress: () => router.replace("/admin-review") },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", action === "approve" ? "Impossible d'approuver cette demande." : "Impossible de refuser cette demande.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !verification) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerState}>
                    <Text style={styles.stateText}>{loading ? "Chargement de la demande…" : "Demande introuvable."}</Text>
                    {!loading && <Pressable onPress={() => router.back()}><Text style={styles.backLink}>Retour</Text></Pressable>}
                </View>
            </SafeAreaView>
        );
    }

    const applicant = [verification.user.first_name, verification.user.last_name].filter(Boolean).join(" ") || verification.user.username;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Retour">
                        <Ionicons name="arrow-back" size={23} color={colors.black} />
                    </Pressable>
                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>ESPACE ADMIN</Text>
                        <Text style={styles.title}>Revue d'identité</Text>
                    </View>
                </View>

                <View style={styles.applicantCard}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{applicant.slice(0, 1).toUpperCase()}</Text></View>
                    <View style={styles.applicantCopy}>
                        <Text style={styles.applicantName}>{applicant}</Text>
                        <Text style={styles.applicantMeta}>@{verification.user.username}</Text>
                        <Text style={styles.applicantMeta}>{verification.user.email}</Text>
                    </View>
                    <View style={styles.pendingBadge}><Text style={styles.pendingText}>À vérifier</Text></View>
                </View>

                <Text style={styles.sectionTitle}>Documents transmis</Text>
                <Text style={styles.sectionHint}>Vérifiez que le document est lisible et correspond au selfie.</Text>

                <View style={styles.documentCard}>
                    <Text style={styles.documentTitle}>Pièce d'identité</Text>
                    <Image source={{ uri: verification.id_card_front }} style={styles.documentImage} resizeMode="contain" />
                </View>
                <View style={styles.documentCard}>
                    <Text style={styles.documentTitle}>Selfie</Text>
                    <Image source={{ uri: verification.selfie_with_id }} style={styles.documentImage} resizeMode="contain" />
                </View>

                <View style={styles.decisionCard}>
                    <Text style={styles.decisionTitle}>Décision</Text>
                    <Text style={styles.sectionHint}>En cas de refus, indiquez à l'utilisatrice ce qu'elle doit corriger.</Text>
                    <TextInput
                        value={rejectionReason}
                        onChangeText={setRejectionReason}
                        placeholder="Motif du refus (obligatoire pour refuser)"
                        placeholderTextColor={colors.textMuted}
                        multiline
                        textAlignVertical="top"
                        style={styles.reasonInput}
                    />
                    <Pressable disabled={submitting} style={[styles.approveButton, submitting && styles.disabled]} onPress={() => void submitReview("approve")}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                        <Text style={styles.approveText}>{submitting ? "Traitement…" : "Approuver l'identité"}</Text>
                    </Pressable>
                    <Pressable disabled={submitting} style={[styles.rejectButton, submitting && styles.disabled]} onPress={() => void submitReview("reject")}>
                        <Ionicons name="close-circle-outline" size={20} color="#B42318" />
                        <Text style={styles.rejectText}>Refuser la demande</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 36 },
    header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
    backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
    headerCopy: { flex: 1 },
    eyebrow: { color: colors.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 3 },
    title: { color: colors.black, fontSize: 24, fontWeight: "700" },
    applicantCard: { flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 16, backgroundColor: colors.white, marginBottom: 24 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#F5EBD2", alignItems: "center", justifyContent: "center", marginRight: 12 },
    avatarText: { color: colors.primary, fontSize: 18, fontWeight: "700" },
    applicantCopy: { flex: 1 },
    applicantName: { color: colors.black, fontSize: 15, fontWeight: "700", marginBottom: 3 },
    applicantMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
    pendingBadge: { backgroundColor: "#FFF5D9", borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6 },
    pendingText: { color: "#8B6508", fontWeight: "600", fontSize: 11 },
    sectionTitle: { color: colors.black, fontSize: 18, fontWeight: "700", marginBottom: 5 },
    sectionHint: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 14 },
    documentCard: { backgroundColor: colors.white, borderRadius: 16, padding: 14, marginBottom: 13 },
    documentTitle: { color: colors.black, fontSize: 14, fontWeight: "700", marginBottom: 10 },
    documentImage: { width: "100%", height: 240, backgroundColor: "#F7F7F7", borderRadius: 10 },
    decisionCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginTop: 10 },
    decisionTitle: { color: colors.black, fontSize: 17, fontWeight: "700", marginBottom: 5 },
    reasonInput: { minHeight: 94, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 13, color: colors.text, fontSize: 14, marginBottom: 13 },
    approveButton: { minHeight: 50, borderRadius: 12, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 },
    approveText: { color: colors.white, fontSize: 14, fontWeight: "700" },
    rejectButton: { minHeight: 50, borderRadius: 12, backgroundColor: "#FFF1F0", borderWidth: 1, borderColor: "#F4C7C4", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    rejectText: { color: "#B42318", fontSize: 14, fontWeight: "700" },
    disabled: { opacity: 0.55 },
    centerState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    stateText: { color: colors.textSecondary, textAlign: "center", fontSize: 15 },
    backLink: { color: colors.primary, fontWeight: "700", marginTop: 14 },
});
