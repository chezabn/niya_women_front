import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getIdentityReviews } from "@niyya/api";
import type { IdentityReviewResponse } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";
import { PaginationButton } from "@/src/components/ui/PaginationButton";

const filters = [
    { value: "pending", label: "En attente", color: "#A36D00", background: "#FFF2CC" },
    { value: "approved", label: "Approuvé", color: "#18794E", background: "#E5F5EC" },
    { value: "rejected", label: "Refusé", color: "#B42318", background: "#FDECEC" },
] as const;

type Filter = typeof filters[number]["value"];

export function AdminIdentityRequestsScreen() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [status, setStatus] = useState<Filter>("pending");
    const [requests, setRequests] = useState<IdentityReviewResponse[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [nextPage, setNextPage] = useState<number | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadRequests = useCallback(async (page = 1, refresh = false) => {
        if (!accessToken) return;
        if (page === 1) {
            refresh ? setRefreshing(true) : setLoading(true);
        } else {
            setLoadingMore(true);
        }
        try {
            const response = await getIdentityReviews(accessToken, status, page);
            setRequests((current) => page === 1 ? response.results : [...current, ...response.results]);
            setCount(response.count);
            setNextPage(response.next ? page + 1 : null);
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible de charger les demandes de vérification.");
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [accessToken, status]);

    useFocusEffect(useCallback(() => {
        void loadRequests();
    }, [loadRequests]));

    const activeFilter = filters.find((item) => item.value === status)!;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadRequests(1, true)} tintColor={colors.primary} />}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Retour">
                        <Ionicons name="arrow-back" size={23} color={colors.black} />
                    </Pressable>
                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>ESPACE ADMIN</Text>
                        <Text style={styles.title}>Vérifications</Text>
                    </View>
                    <View style={styles.countBadge}><Text style={styles.countText}>{count}</Text></View>
                </View>

                <Text style={styles.description}>Consultez les demandes de vérification d’identité des utilisatrices.</Text>

                <View style={styles.filters}>
                    {filters.map((filter) => {
                        const selected = status === filter.value;
                        return (
                            <Pressable
                                key={filter.value}
                                onPress={() => setStatus(filter.value)}
                                style={[styles.filterButton, selected && { backgroundColor: filter.background, borderColor: filter.color }]}
                                accessibilityRole="button"
                                accessibilityState={{ selected }}
                            >
                                <Text style={[styles.filterText, selected && { color: filter.color }]}>{filter.label}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {loading ? (
                    <View style={styles.stateCard}><ActivityIndicator color={colors.primary} /><Text style={styles.stateText}>Chargement des demandes…</Text></View>
                ) : requests.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={[styles.emptyIcon, { backgroundColor: activeFilter.background }]}>
                            <Ionicons name={status === "approved" ? "checkmark-done-outline" : status === "rejected" ? "close-circle-outline" : "time-outline"} size={29} color={activeFilter.color} />
                        </View>
                        <Text style={styles.emptyTitle}>Aucune demande</Text>
                        <Text style={styles.stateText}>Il n’y a aucune vérification avec le statut « {activeFilter.label.toLowerCase()} ».</Text>
                    </View>
                ) : requests.map((item) => {
                    const name = [item.user.first_name, item.user.last_name].filter(Boolean).join(" ") || item.user.username;
                    const itemStatus = filters.find((filter) => filter.value === item.status.toLowerCase());
                    return (
                        <Pressable key={item.id} style={styles.requestCard} onPress={() => router.push(`/admin/review/${item.id}`)}>
                            <View style={styles.avatar}><Text style={styles.avatarText}>{name.slice(0, 1).toUpperCase()}</Text></View>
                            <View style={styles.requestCopy}>
                                <Text style={styles.requestName}>{name}</Text>
                                <Text style={styles.username}>@{item.user.username}</Text>
                                <Text style={styles.date}>Reçue le {new Date(item.created_at).toLocaleDateString("fr-FR")}</Text>
                            </View>
                            <View style={styles.rowEnd}>
                                <View style={[styles.statusBadge, { backgroundColor: itemStatus?.background ?? "#F1F1F1" }]}>
                                    <Text style={[styles.statusText, { color: itemStatus?.color ?? colors.textSecondary }]}>{itemStatus?.label ?? item.status}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                            </View>
                        </Pressable>
                    );
                })}
                {!loading && nextPage !== null && <PaginationButton loading={loadingMore} onPress={() => void loadRequests(nextPage)} />}
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
    filters: { flexDirection: "row", gap: 8, marginBottom: 20 },
    filterButton: { flex: 1, minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
    filterText: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
    requestCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 16, padding: 14, marginBottom: 11, borderWidth: 1, borderColor: "#F0ECE4" },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#F5EBD2", alignItems: "center", justifyContent: "center", marginRight: 12 },
    avatarText: { color: colors.primary, fontSize: 18, fontWeight: "700" },
    requestCopy: { flex: 1 },
    requestName: { color: colors.black, fontSize: 14, fontWeight: "700" },
    username: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
    date: { color: colors.textMuted, fontSize: 10, marginTop: 6 },
    rowEnd: { alignItems: "flex-end", gap: 7, marginLeft: 6 },
    statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
    statusText: { fontSize: 10, fontWeight: "700" },
    stateCard: { backgroundColor: colors.white, borderRadius: 16, padding: 22, alignItems: "center", gap: 10 },
    stateText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, textAlign: "center" },
    emptyCard: { backgroundColor: colors.white, borderRadius: 18, padding: 27, alignItems: "center", marginTop: 4 },
    emptyIcon: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", marginBottom: 14 },
    emptyTitle: { color: colors.black, fontSize: 17, fontWeight: "700", marginBottom: 7 },
});
