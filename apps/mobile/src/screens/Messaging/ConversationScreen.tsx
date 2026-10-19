import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deleteConversationMessage, getConversationMessages, getConversations, getMessagingWebSocketUrl, markConversationMessagesRead } from "@niyya/api";
import type { Conversation, Message } from "@niyya/types";
import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

export function ConversationScreen() {
    const { conversationId, username: initialUsername, otherUserId: initialOtherUserId } = useLocalSearchParams<{ conversationId: string; username?: string; otherUserId?: string }>();
    const id = Number(conversationId);
    const accessToken = useAuthStore((state) => state.accessToken);
    const currentUser = useAuthStore((state) => state.user);
    const [messages, setMessages] = useState<Message[]>([]);
    const [olderPage, setOlderPage] = useState<number | null>(null);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [username, setUsername] = useState(initialUsername ?? "");
    const [otherUserId, setOtherUserId] = useState(Number(initialOtherUserId) || null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const socket = useRef<WebSocket | null>(null);
    const messagesList = useRef<FlatList<Message>>(null);
    const shouldScrollToEnd = useRef(true);
    const userId = currentUser?.id;

    const loadMessages = useCallback(async () => {
        if (!accessToken || !Number.isFinite(id)) { setLoading(false); return; }
        try {
            const firstPage = await getConversationMessages(id, accessToken, 1);
            const latestMessages = [...(firstPage.results ?? [])].reverse();
            setOlderPage(firstPage.next ? 2 : null);
            shouldScrollToEnd.current = true;
            setMessages((current) => {
                const byId = new Map<number, Message>();
                for (const message of [...latestMessages, ...current]) byId.set(message.id, message);
                return [...byId.values()].sort((first, second) =>
                    new Date(first.created_at).getTime() - new Date(second.created_at).getTime()
                    || first.id - second.id,
                );
            });
        } catch (e) {
            console.error("Erreur lors du chargement des messages :", e);
            setError("Impossible de charger les messages.");
        } finally { setLoading(false); }
    }, [accessToken, id]);

    const loadOlderMessages = async () => {
        if (!accessToken || olderPage === null || loadingOlder) return;
        setLoadingOlder(true);
        shouldScrollToEnd.current = false;
        try {
            const result = await getConversationMessages(id, accessToken, olderPage);
            setMessages((current) => {
                const byId = new Map<number, Message>();
                for (const message of [...(result.results ?? [])].reverse().concat(current)) byId.set(message.id, message);
                return [...byId.values()].sort((first, second) =>
                    new Date(first.created_at).getTime() - new Date(second.created_at).getTime()
                    || first.id - second.id,
                );
            });
            setOlderPage(result.next ? olderPage + 1 : null);
        } catch (e) {
            console.error("Erreur lors du chargement des anciens messages :", e);
            Alert.alert("Chargement impossible", "Les messages précédents n’ont pas pu être chargés.");
        } finally { setLoadingOlder(false); }
    };

    useEffect(() => { void loadMessages(); }, [loadMessages]);

    const markUnreadAsRead = useCallback(() => {
        if (!accessToken || !Number.isFinite(id)) return;
        void markConversationMessagesRead(id, accessToken)
            .then(() => DeviceEventEmitter.emit("messaging:read"))
            .catch((e) => console.error("Erreur lors du marquage des messages comme lus :", e));
    }, [accessToken, id]);

    useEffect(() => { markUnreadAsRead(); }, [markUnreadAsRead]);

    useEffect(() => {
        if (initialUsername) {
            setUsername(initialUsername);
        }
        if (initialOtherUserId) setOtherUserId(Number(initialOtherUserId) || null);
        if (initialUsername && initialOtherUserId) return;
        if (!accessToken || !Number.isFinite(id)) return;
        void getConversations(accessToken).then((response) => {
            const conversations = Array.isArray(response) ? response : (response as unknown as { results: Conversation[] }).results ?? [];
            const conversation = conversations.find((item) => item.id === id);
            const otherUser = conversation?.other_user ?? conversation?.other_participant ?? conversation?.user ?? conversation?.participants?.[0];
            if (otherUser?.username) setUsername(otherUser.username);
            if (otherUser?.id) setOtherUserId(otherUser.id);
        }).catch((e) => console.error("Erreur lors du chargement du nom de la conversation :", e));
    }, [accessToken, id, initialUsername, initialOtherUserId]);

    useEffect(() => {
        if (!accessToken || !Number.isFinite(id)) return;
        const websocketUrl = getMessagingWebSocketUrl(id, accessToken);
        const ws = new WebSocket(websocketUrl);
        socket.current = ws;
        ws.onopen = () => {
            console.log("WebSocket messagerie connecté");
            setConnected(true);
            setError("");
        };
        ws.onerror = (error) => {
            // Do not log websocketUrl: it contains the access token.
            const url = new URL(websocketUrl);
            console.error("Erreur WebSocket messagerie", `${url.protocol}//${url.host}${url.pathname}`, error);
            setError("Connexion à la messagerie impossible. Vérifiez l’adresse du serveur et sa disponibilité depuis cet appareil.");
        };
        ws.onclose = (event) => {
            console.log("WebSocket messagerie fermé", { code: event.code, reason: event.reason, wasClean: event.wasClean });
            setConnected(false);
            if (event.code === 4401) setError("Votre session ou votre compte ne permet pas d’accéder à la messagerie.");
            else if (event.code === 4403) setError("Cette conversation n’est pas accessible.");
            else if (event.code !== 1000 && event.code !== 1001) setError("Connexion à la messagerie interrompue.");
        };
        ws.onmessage = (event) => {
            try {
                const incoming = JSON.parse(event.data) as Message & { type?: string; detail?: string };
                if (incoming.type === "error") { setError(incoming.detail ?? "Le message n’a pas pu être envoyé."); return; }
                if (incoming.type === "message_deleted") {
                    setMessages((current) => current.filter((message) => message.id !== incoming.id));
                    return;
                }
                if (incoming.type === "conversation_hidden") {
                    router.back();
                    return;
                }
                if (incoming.type === "message") {
                    shouldScrollToEnd.current = true;
                    setMessages((current) => current.some((message) => message.id === incoming.id) ? current : [...current, incoming]);
                    if (incoming.sender?.id !== userId) markUnreadAsRead();
                }
            } catch { setError("Réponse du serveur invalide."); }
        };
        return () => { ws.close(); socket.current = null; };
    }, [accessToken, id, markUnreadAsRead, userId]);

    const sendMessage = () => {
        const trimmed = content.trim();
        if (!trimmed || trimmed.length > 5000 || !connected || sending) return;
        setError("");
        setSending(true);
        socket.current?.send(JSON.stringify({ type: "message", content: trimmed }));
        setContent("");
        setSending(false);
    };

    const confirmDeleteMessage = (message: Message) => {
        if (!accessToken || message.sender?.id !== userId) return;
        Alert.alert("Supprimer ce message ?", "Cette action est définitive.", [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: () => {
                void deleteConversationMessage(id, message.id, accessToken).then(() => {
                    setMessages((current) => current.filter((item) => item.id !== message.id));
                }).catch((e) => {
                    console.error("Erreur lors de la suppression du message :", e);
                    Alert.alert("Suppression impossible", "Le message n’a pas pu être supprimé.");
                });
            } },
        ]);
    };

    return <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}><Ionicons name="arrow-back" size={24} color={colors.black} /></Pressable>
                <Pressable
                    style={styles.headerText}
                    disabled={!otherUserId}
                    onPress={() => otherUserId && router.push(`/profile/${otherUserId}` as any)}
                    accessibilityRole="button"
                    accessibilityLabel={username ? `Voir le profil de ${username}` : "Voir le profil"}
                >
                    <Text style={styles.title}>{username ? `@${username}` : "Conversation"}</Text>
                </Pressable>
            </View>
            {loading ? <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View> : <FlatList
                ref={messagesList}
                data={messages}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.messages}
                onContentSizeChange={() => {
                    if (shouldScrollToEnd.current) messagesList.current?.scrollToEnd({ animated: true });
                }}
                ListHeaderComponent={olderPage !== null ? (
                    <Pressable style={styles.loadOlderButton} onPress={() => void loadOlderMessages()} disabled={loadingOlder}>
                        {loadingOlder ? <ActivityIndicator size="small" color={colors.primary} /> : <Text style={styles.loadOlderText}>Voir plus</Text>}
                    </Pressable>
                ) : null}
                renderItem={({ item }) => {
                    const mine = item.sender?.id === userId;
                    return <Pressable onLongPress={mine ? () => confirmDeleteMessage(item) : undefined} delayLongPress={500} style={[styles.bubble, mine ? styles.ownBubble : styles.otherBubble]}>
                        <Text style={[styles.messageText, mine && styles.ownText]}>{item.content}</Text>
                        <Text style={[styles.time, mine && styles.ownTime]}>{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                    </Pressable>;
                }}
                ListEmptyComponent={<View style={styles.center}><Text style={styles.empty}>Envoyez le premier message.</Text></View>}
            />}
            {!!error && <Text style={styles.error}>{error}</Text>}
            {!connected && !loading && <Text style={styles.connectionHint}>Connexion à la messagerie…</Text>}
            <View style={styles.composer}>
                <TextInput value={content} onChangeText={setContent} placeholder="Écrire un message…" placeholderTextColor="#999" multiline maxLength={5000} style={styles.input} />
                <Pressable onPress={sendMessage} disabled={!connected || !content.trim() || sending} style={({ pressed }) => [styles.send, (!connected || !content.trim()) && styles.disabled, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Envoyer le message">
                    <Ionicons name="send" size={19} color={colors.white} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.white },
    container: { flex: 1 },
    header: { minHeight: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: "#EEE" },
    back: { padding: 6, marginRight: 10 },
    headerText: { flex: 1 },
    title: { fontSize: 18, fontWeight: "700", color: colors.black },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    messages: { padding: 16, flexGrow: 1, justifyContent: "flex-end" },
    loadOlderButton: { alignSelf: "center", minHeight: 40, justifyContent: "center", paddingHorizontal: 14, marginBottom: 8 },
    loadOlderText: { color: colors.primary, fontSize: 13, fontWeight: "600" },
    bubble: { maxWidth: "82%", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginVertical: 5 },
    ownBubble: { alignSelf: "flex-end", backgroundColor: colors.primary, borderBottomRightRadius: 5 },
    otherBubble: { alignSelf: "flex-start", backgroundColor: "#F1F1F1", borderBottomLeftRadius: 5 },
    messageText: { fontSize: 15, color: colors.black, lineHeight: 21 },
    ownText: { color: colors.white },
    time: { fontSize: 10, color: "#888", alignSelf: "flex-end", marginTop: 4 },
    ownTime: { color: "#EEE" },
    empty: { color: "#888" },
    error: { color: "#B42318", fontSize: 12, paddingHorizontal: 16, paddingBottom: 6 },
    connectionHint: { color: "#888", textAlign: "center", fontSize: 12, paddingBottom: 4 },
    composer: { flexDirection: "row", alignItems: "flex-end", gap: 10, borderTopWidth: 1, borderTopColor: "#EEE", padding: 12, paddingBottom: 14 },
    input: { flex: 1, maxHeight: 110, minHeight: 42, backgroundColor: "#F6F6F6", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: colors.black, fontSize: 15 },
    send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
    disabled: { opacity: 0.45 },
    pressed: { opacity: 0.75 },
});
