import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { acceptFriendRequest, getFriendRequests, getFriends, removeFriendRequest } from "@niyya/api";
import { UserPreview } from "@niyya/types";
import { colors } from "@/src/theme";
import { useAuthStore } from "@/src/store/authStore";

type ListMode = "friends" | "requests";

export function FriendsScreen() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [mode, setMode] = useState<ListMode>("friends");
    const [friends, setFriends] = useState<UserPreview[]>([]);
    const [requests, setRequests] = useState<UserPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [busyUserId, setBusyUserId] = useState<number | null>(null);
    const [error, setError] = useState(false);

    const loadLists = useCallback(async (refresh = false) => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        if (refresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(false);
        try {
            const [friendsResponse, requestsResponse] = await Promise.all([
                getFriends(accessToken),
                getFriendRequests(accessToken),
            ]);
            setFriends(friendsResponse.results);
            setRequests(requestsResponse.results);
        } catch (loadError) {
            console.error("Erreur lors du chargement des amies :", loadError);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken]);

    useFocusEffect(useCallback(() => {
        void loadLists();
    }, [loadLists]));

    const handleRequest = async (user: UserPreview, accept: boolean) => {
        if (!accessToken || busyUserId !== null) return;
        setBusyUserId(user.id);
        try {
            if (accept) {
                await acceptFriendRequest(user.id, accessToken);
                setFriends((current) => [...current, user]);
            } else {
                await removeFriendRequest(user.id, accessToken);
            }
            setRequests((current) => current.filter((item) => item.id !== user.id));
        } catch (actionError) {
            console.error("Erreur lors du traitement de la demande :", actionError);
            setError(true);
        } finally {
            setBusyUserId(null);
        }
    };

    const users = mode === "friends" ? friends : requests;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Amies</Text>
                    <Text style={styles.subtitle}>Retrouvez votre cercle Niyya</Text>
                </View>
                <Pressable style={styles.searchButton} onPress={() => router.push("/(tabs)/search")} accessibilityLabel="Rechercher des utilisatrices">
                    <Ionicons name="person-add-outline" size={21} color={colors.primary} />
                </Pressable>
            </View>

            <View style={styles.tabs}>
                <Pressable style={[styles.tab, mode === "friends" && styles.activeTab]} onPress={() => setMode("friends")}>
                    <Text style={[styles.tabText, mode === "friends" && styles.activeTabText]}>Mes amies ({friends.length})</Text>
                </Pressable>
                <Pressable style={[styles.tab, mode === "requests" && styles.activeTab]} onPress={() => setMode("requests")}>
                    <Text style={[styles.tabText, mode === "requests" && styles.activeTabText]}>Demandes ({requests.length})</Text>
                </Pressable>
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
            ) : error && users.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons name="cloud-offline-outline" size={38} color={colors.textSecondary} />
                    <Text style={styles.emptyTitle}>Chargement impossible</Text>
                    <Text style={styles.emptyText}>Vérifiez votre connexion puis actualisez la page.</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(user) => String(user.id)}
                    contentContainerStyle={users.length === 0 ? styles.emptyList : styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadLists(true)} tintColor={colors.primary} />}
                    renderItem={({ item }) => (
                        <View style={styles.userRow}>
                            <Pressable style={styles.userLink} onPress={() => router.push(`/profile/${item.id}`)}>
                                <View style={styles.avatar}><Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text></View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.username}>@{item.username}</Text>
                                    {!!(item.first_name || item.last_name) && <Text style={styles.fullName}>{[item.first_name, item.last_name].filter(Boolean).join(" ")}</Text>}
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                            </Pressable>
                            {mode === "requests" && (
                                <View style={styles.actions}>
                                    <Pressable style={styles.acceptButton} onPress={() => void handleRequest(item, true)} disabled={busyUserId !== null} accessibilityLabel={`Accepter la demande de ${item.username}`}>
                                        {busyUserId === item.id ? <ActivityIndicator size="small" color={colors.white} /> : <Ionicons name="checkmark" size={19} color={colors.white} />}
                                    </Pressable>
                                    <Pressable style={styles.rejectButton} onPress={() => void handleRequest(item, false)} disabled={busyUserId !== null} accessibilityLabel={`Refuser la demande de ${item.username}`}>
                                        <Ionicons name="close" size={19} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={(
                        <View style={styles.empty}>
                            <Ionicons name={mode === "friends" ? "people-outline" : "person-add-outline"} size={42} color={colors.textSecondary} />
                            <Text style={styles.emptyTitle}>{mode === "friends" ? "Votre cercle commence ici" : "Aucune demande en attente"}</Text>
                            <Text style={styles.emptyText}>{mode === "friends" ? "Recherchez des utilisatrices et ajoutez-les à vos amies." : "Les nouvelles demandes d’amitié apparaîtront ici."}</Text>
                            {mode === "friends" && <Pressable style={styles.findButton} onPress={() => router.push("/(tabs)/search")}><Text style={styles.findButtonText}>Trouver des amies</Text></Pressable>}
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20 },
    title: { color: colors.black, fontSize: 27, fontWeight: "700" },
    subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
    searchButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
    tabs: { flexDirection: "row", marginHorizontal: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
    tab: { paddingVertical: 12, paddingHorizontal: 10, marginRight: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
    activeTab: { borderBottomColor: colors.primary },
    tabText: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
    activeTabText: { color: colors.primary },
    list: { paddingHorizontal: 20, paddingBottom: 24 },
    userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    userLink: { flex: 1, flexDirection: "row", alignItems: "center" },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + "20", alignItems: "center", justifyContent: "center" },
    avatarText: { color: colors.primary, fontSize: 18, fontWeight: "700" },
    userInfo: { flex: 1, marginLeft: 12 },
    username: { color: colors.black, fontSize: 15, fontWeight: "600" },
    fullName: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
    actions: { flexDirection: "row", marginLeft: 8, gap: 8 },
    acceptButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
    rejectButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyList: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 32 },
    empty: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
    emptyTitle: { color: colors.black, fontSize: 17, fontWeight: "700", textAlign: "center", marginTop: 14 },
    emptyText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 7 },
    findButton: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 11, backgroundColor: colors.primary, borderRadius: 22 },
    findButtonText: { color: colors.white, fontWeight: "600" },
});
