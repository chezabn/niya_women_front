import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAllReports } from "@niyya/api";
import type { UserReportDetail } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";
import { LoginScreen } from "@/src/screens/Login/LoginScreen";
import { AccessDeniedScreen } from "@/src/screens/Admin/AccessDeniedScreen";

export function AdminReportsScreen() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const [reports, setReports] = useState<UserReportDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadReports = useCallback(async (refresh = false) => {
        if (!accessToken) return;
        refresh ? setRefreshing(true) : setLoading(true);
        try {
            const response = await getAllReports(accessToken);
            setReports(response.results);
        } catch (error) {
            console.error("Erreur lors du chargement des signalements :", error);
            Alert.alert("Erreur", "Impossible de charger les signalements.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken]);

    useFocusEffect(useCallback(() => {
        void loadReports();
    }, [loadReports]));

    if (!accessToken) return <LoginScreen />;
    if (!user?.is_staff && !user?.is_superuser) return <AccessDeniedScreen />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => void loadReports(true)}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Retour"
                    >
                        <Ionicons name="arrow-back" size={23} color={colors.black} />
                    </Pressable>
                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>ESPACE ADMIN</Text>
                        <Text style={styles.title}>Signalements</Text>
                    </View>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{reports.length}</Text>
                    </View>
                </View>

                <Text style={styles.description}>
                    Consultez les signalements transmis par les utilisatrices.
                </Text>

                {loading ? (
                    <View style={styles.stateCard}>
                        <ActivityIndicator color={colors.primary} />
                        <Text style={styles.stateText}>Chargement des signalements…</Text>
                    </View>
                ) : reports.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="shield-checkmark-outline" size={29} color={colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Aucun signalement</Text>
                        <Text style={styles.stateText}>Les signalements reçus apparaîtront ici.</Text>
                    </View>
                ) : reports.map((report) => (
                    <View key={report.id} style={styles.reportCard}>
                        <View style={styles.reportHeader}>
                            <View style={styles.avatar}>
                                <Ionicons name="flag-outline" size={19} color={colors.primary} />
                            </View>
                            <View style={styles.reportPeople}>
                                <Text style={styles.reported}>Utilisatrice signalée : {report.reported}</Text>
                                <Text style={styles.reporter}>Signalé par : {report.reporter}</Text>
                            </View>
                        </View>
                        <Text style={styles.reason}>{report.reason}</Text>
                        <Text style={styles.date}>
                            {new Date(report.created_at).toLocaleString("fr-FR", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 22, paddingBottom: 36 },
    header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
    backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
    headerCopy: { flex: 1 },
    eyebrow: { color: colors.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 3 },
    title: { color: colors.black, fontSize: 27, fontWeight: "700" },
    countBadge: { minWidth: 34, height: 34, borderRadius: 17, backgroundColor: "#F5EBD2", alignItems: "center", justifyContent: "center", paddingHorizontal: 9 },
    countText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
    description: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginBottom: 19 },
    reportCard: { backgroundColor: colors.white, borderRadius: 16, padding: 15, marginBottom: 11, borderWidth: 1, borderColor: "#F0ECE4" },
    reportHeader: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F5EBD2", alignItems: "center", justifyContent: "center", marginRight: 11 },
    reportPeople: { flex: 1 },
    reported: { color: colors.black, fontSize: 13, fontWeight: "700" },
    reporter: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
    reason: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: 14 },
    date: { color: colors.textMuted, fontSize: 11, marginTop: 10, textAlign: "right" },
    stateCard: { backgroundColor: colors.white, borderRadius: 16, padding: 22, alignItems: "center", gap: 10 },
    stateText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, textAlign: "center" },
    emptyCard: { backgroundColor: colors.white, borderRadius: 18, padding: 27, alignItems: "center", marginTop: 4 },
    emptyIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#F5EBD2", alignItems: "center", justifyContent: "center", marginBottom: 14 },
    emptyTitle: { color: colors.black, fontSize: 17, fontWeight: "700", marginBottom: 7 },
});
