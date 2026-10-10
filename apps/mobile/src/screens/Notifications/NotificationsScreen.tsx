import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

import { getNotifications, markNotificationRead } from "@niyya/api";
import type { UserNotification } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";
import { PaginationButton } from "@/src/components/ui/PaginationButton";
import { LoginScreen } from "@/src/screens/Login/LoginScreen";

const notificationCopy: Record<UserNotification["notification_type"], {
    verb: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    tint: string;
}> = {
    like: { verb: "a aimé votre publication", icon: "heart", color: "#D66B78", tint: "#FBEDEF" },
    comment: { verb: "a commenté votre publication", icon: "chatbubble", color: "#7B61A8", tint: "#F1EDF7" },
    follow: { verb: "a commencé à vous suivre", icon: "person-add", color: "#43836D", tint: "#EAF4EF" },
};

const formatNotificationDate = (date: string) => new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
});

export function NotificationsScreen() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [notifications, setNotifications] = useState<UserNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [nextPage, setNextPage] = useState<number | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadNotifications = useCallback(async (page = 1, refresh = false) => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        if (page === 1) {
            refresh ? setRefreshing(true) : setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setErrorMessage(null);
        try {
            const response = await getNotifications(accessToken, page);
            setNotifications((current) => page === 1 ? response.results : [...current, ...response.results]);
            setNextPage(response.next ? page + 1 : null);
        } catch (error) {
            console.error("Erreur lors du chargement des notifications :", error);
            setErrorMessage("Impossible de charger vos notifications. Vérifiez votre connexion et réessayez.");
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [accessToken]);

    useFocusEffect(useCallback(() => {
        void loadNotifications();
    }, [loadNotifications]));

    const openNotification = (notification: UserNotification) => {
        if (!accessToken) return;

        if (!notification.is_read) {
            setNotifications((current) => current.map((item) => item.id === notification.id
                ? { ...item, is_read: true, read_at: new Date().toISOString() }
                : item));
            void markNotificationRead(notification.id, accessToken).catch((error: unknown) => {
                console.warn("Impossible de marquer la notification comme lue :", error);
            });
        }

        if (notification.notification_type === "follow") {
            router.push(`/profile/${notification.actor_id}` as never);
        } else if (notification.publication_id !== null) {
            router.push(`/publications/${notification.publication_id}` as never);
        }
    };

    if (!accessToken) return <LoginScreen />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Retour">
                    <Ionicons name="arrow-back" size={23} color={colors.black} />
                </Pressable>
                <View style={styles.headerCopy}>
                    <Text style={styles.eyebrow}>NIYYA</Text>
                    <Text style={styles.title}>Notifications</Text>
                </View>
                <View style={styles.headerIcon}>
                    <Ionicons name="notifications-outline" size={21} color={colors.primary} />
                </View>
            </View>

            {loading ? (
                <View style={styles.centerState}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.stateText}>Chargement des notifications…</Text>
                </View>
            ) : errorMessage && notifications.length === 0 ? (
                <View style={styles.centerState}>
                    <Ionicons name="cloud-offline-outline" size={36} color={colors.textMuted} />
                    <Text style={styles.stateText}>{errorMessage}</Text>
                    <Pressable style={styles.retryButton} onPress={() => void loadNotifications()}>
                        <Text style={styles.retryText}>Réessayer</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={[styles.list, notifications.length === 0 && styles.emptyList]}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadNotifications(1, true)} tintColor={colors.primary} />}
                    renderItem={({ item }) => {
                        const copy = notificationCopy[item.notification_type];
                        return (
                            <Pressable
                                style={({ pressed }) => [styles.notificationCard, !item.is_read && styles.unreadCard, pressed && styles.pressedCard]}
                                onPress={() => openNotification(item)}
                                accessibilityRole="button"
                                accessibilityLabel={`${item.actor_username} ${copy.verb}`}
                            >
                                <View style={[styles.typeIcon, { backgroundColor: copy.tint }]}>
                                    <Ionicons name={copy.icon} size={19} color={copy.color} />
                                </View>
                                <View style={styles.notificationCopy}>
                                    <Text style={styles.message}>
                                        <Text style={styles.username}>@{item.actor_username}</Text>{" "}{copy.verb}
                                    </Text>
                                    <Text style={styles.date}>{formatNotificationDate(item.created_at)}</Text>
                                </View>
                                {!item.is_read && <View style={styles.unreadDot} />}
                                <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
                            </Pressable>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="notifications-off-outline" size={30} color={colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Aucune notification</Text>
                            <Text style={styles.stateText}>Tes likes, commentaires et nouveaux abonnements apparaîtront ici.</Text>
                        </View>
                    }
                    ListFooterComponent={nextPage !== null ? (
                        <PaginationButton loading={loadingMore} onPress={() => void loadNotifications(nextPage)} />
                    ) : null}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, gap: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#F0ECE4" },
    backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
    headerCopy: { flex: 1 },
    eyebrow: { color: colors.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 2 },
    title: { color: colors.black, fontSize: 23, fontWeight: "700" },
    headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F5EBD2" },
    list: { padding: 16, paddingBottom: 32 },
    emptyList: { flexGrow: 1, justifyContent: "center" },
    notificationCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: "#F0ECE4", borderRadius: 16, padding: 14, marginBottom: 10, gap: 11 },
    unreadCard: { backgroundColor: "#FFFCF5", borderColor: "#EADCB9" },
    pressedCard: { opacity: 0.75 },
    typeIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    notificationCopy: { flex: 1 },
    message: { color: colors.text, fontSize: 14, lineHeight: 20 },
    username: { color: colors.black, fontWeight: "700" },
    date: { color: colors.textMuted, fontSize: 12, marginTop: 5 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    centerState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 12 },
    stateText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: "center" },
    retryButton: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 12, marginTop: 5 },
    retryText: { color: colors.white, fontWeight: "700", fontSize: 14 },
    emptyState: { alignItems: "center", paddingHorizontal: 12 },
    emptyIcon: { width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center", backgroundColor: "#F5EBD2", marginBottom: 15 },
    emptyTitle: { color: colors.black, fontSize: 17, fontWeight: "700", marginBottom: 7 },
});
