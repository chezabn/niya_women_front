import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, DeviceEventEmitter, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getConversations, getUnreadMessageNotifications } from "@niyya/api";
import type { Conversation, MessagingUser } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

const displayUsername = (user?: MessagingUser) => user?.username ?? "Utilisateur";

function UnreadDot({ emphasized }: { emphasized: boolean }) {
    const scale = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (!emphasized) { scale.setValue(1); return; }
        Animated.sequence([
            Animated.spring(scale, { toValue: 2, speed: 35, bounciness: 8, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 650, useNativeDriver: true }),
        ]).start();
    }, [emphasized, scale]);
    return <Animated.View style={[styles.unreadDot, { transform: [{ scale }] }]} />;
}

export function ConversationsScreen() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const currentUserId = useAuthStore((state) => state.user?.id);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [unreadConversations, setUnreadConversations] = useState<Set<number>>(() => new Set());
    const [recentConversationId, setRecentConversationId] = useState<number | null>(null);
    const previousConversations = useRef<Conversation[]>([]);

    const load = useCallback(async (refresh = false, quiet = false, fromPush = false) => {
        if (!accessToken) { setLoading(false); return; }
        if (refresh) setRefreshing(true);
        else if (!quiet) setLoading(true);
        setError(false);
        try {
            const response = await getConversations(accessToken);
            const nextConversations = Array.isArray(response) ? response : (response as unknown as { results: Conversation[] }).results ?? [];
            const previousById = new Map(previousConversations.current.map((conversation) => [conversation.id, conversation]));
            const newlyMessaged = nextConversations.find((conversation) => {
                const previous = previousById.get(conversation.id);
                return previous !== undefined
                    && conversation.last_message !== null
                    && conversation.last_message !== undefined
                    && conversation.last_message.id !== previous.last_message?.id
                    && conversation.last_message?.sender?.id !== currentUserId;
            });
            previousConversations.current = nextConversations;
            setConversations(nextConversations);
            if (newlyMessaged) {
                setRecentConversationId(newlyMessaged.id);
                setTimeout(() => setRecentConversationId((current) => current === newlyMessaged.id ? null : current), 1000);
                if (!fromPush) {
                    DeviceEventEmitter.emit("messaging:new-message", newlyMessaged.id);
                    DeviceEventEmitter.emit("messaging:notify-user", newlyMessaged.id);
                }
            }
            try {
                const unreadMessages = await getUnreadMessageNotifications(accessToken);
                setUnreadConversations(new Set(unreadMessages.map((item) => item.conversation_id).filter((conversationId): conversationId is number => typeof conversationId === "number")));
            } catch (unreadError) {
                console.error("Erreur lors du chargement des messages non lus :", unreadError);
            }
        } catch (e) {
            console.error("Erreur lors du chargement des conversations :", e);
            setError(true);
        } finally { setLoading(false); setRefreshing(false); }
    }, [accessToken, currentUserId]);

    useFocusEffect(useCallback(() => {
        void load();
        const interval = setInterval(() => void load(false, true), 10000);
        const subscription = DeviceEventEmitter.addListener("messaging:new-message", (conversationId: number) => {
            setRecentConversationId(conversationId);
            setTimeout(() => setRecentConversationId((current) => current === conversationId ? null : current), 1000);
            void load(false, true, true);
        });
        return () => { clearInterval(interval); subscription.remove(); };
    }, [load]));

    const getOtherUser = (item: Conversation) => item.other_user ?? item.other_participant ?? item.user ?? item.participants?.[0];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
            {loading ? <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View> : error ? (
                <View style={styles.center}>
                    <Text style={styles.emptyTitle}>Impossible de charger les conversations</Text>
                    <Pressable onPress={() => void load()} style={styles.retry}><Text style={styles.retryText}>Réessayer</Text></Pressable>
                </View>
            ) : <FlatList
                data={conversations}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={conversations.length ? styles.list : styles.emptyList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.primary} />}
                renderItem={({ item }) => {
                    const user = getOtherUser(item);
                    return <Pressable
                        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                        onPress={() => router.push(`/messaging/${item.id}?username=${encodeURIComponent(user?.username ?? "")}&otherUserId=${user?.id ?? ""}` as any)}
                    >
                        <View style={styles.avatar}><Text style={styles.avatarText}>{displayUsername(user).slice(0, 1).toUpperCase()}</Text></View>
                        <View style={styles.rowContent}>
                            <Text style={styles.name}>@{displayUsername(user)}</Text>
                            <Text style={styles.preview} numberOfLines={1}>{item.last_message?.content ?? "Démarrez la conversation"}</Text>
                        </View>
                        {unreadConversations.has(item.id) && <UnreadDot emphasized={recentConversationId === item.id} />}
                        <Ionicons name="chevron-forward" size={18} color="#AAA" />
                    </Pressable>;
                }}
                ListEmptyComponent={<View style={styles.center}>
                    <View style={styles.emptyIcon}><Ionicons name="chatbubbles-outline" size={32} color={colors.primary} /></View>
                    <Text style={styles.emptyTitle}>Aucune conversation</Text>
                    <Text style={styles.emptyText}>Vos échanges privés apparaîtront ici.</Text>
                </View>}
            />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#EEE" },
    title: { fontSize: 28, fontWeight: "700", color: colors.black },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
    list: { paddingHorizontal: 16 },
    emptyList: { flexGrow: 1 },
    row: { minHeight: 78, flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F1F1F1" },
    pressed: { opacity: 0.65 },
    unreadDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, marginHorizontal: 10 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#F3EAF2", alignItems: "center", justifyContent: "center", marginRight: 13 },
    avatarText: { color: colors.primary, fontWeight: "700", fontSize: 18 },
    rowContent: { flex: 1 },
    name: { color: colors.black, fontSize: 16, fontWeight: "600" },
    preview: { color: "#888", fontSize: 13, marginTop: 5 },
    emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F8F1F7", alignItems: "center", justifyContent: "center", marginBottom: 16 },
    emptyTitle: { color: colors.black, fontSize: 17, fontWeight: "600", textAlign: "center" },
    emptyText: { color: "#888", textAlign: "center", marginTop: 7 },
    retry: { marginTop: 14, padding: 10 },
    retryText: { color: colors.primary, fontWeight: "600" },
});
