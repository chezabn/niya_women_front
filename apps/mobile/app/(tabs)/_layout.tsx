import {Tabs, router} from "expo-router";
import {useEffect, useRef, useState} from "react";
import {Animated, DeviceEventEmitter, Pressable, Text, View, type ColorValue} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {getUnreadMessageNotifications} from "@niyya/api";
import {colors} from "@/src/theme";
import {AuthGuard} from "@/src/components/auth/AuthGuard";
import {useSegments} from "expo-router";
import {useAuthStore} from "@/src/store/authStore";

function MessageTabIcon({color, size, unread, recent}: {color: ColorValue; size: number; unread: boolean; recent: boolean}) {
    const scale = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (!recent) { scale.setValue(1); return; }
        Animated.sequence([
            Animated.spring(scale, {toValue: 2.1, speed: 36, bounciness: 9, useNativeDriver: true}),
            Animated.timing(scale, {toValue: 1, duration: 650, useNativeDriver: true}),
        ]).start();
    }, [recent, scale]);
    return <View style={{width: size + 4, height: size + 4}}>
        <Ionicons name="chatbubbles-outline" size={size} color={color}/>
        {unread && <Animated.View style={{position: "absolute", right: -1, top: -1, width: 9, height: 9, borderRadius: 5, backgroundColor: "#E53935", borderWidth: 1, borderColor: colors.white, transform: [{scale}]}}/>}
    </View>;
}

export default function TabsLayout() {
    const segments = useSegments();
    const showingFriendLists = segments.includes("friends" as never);
    const accessToken = useAuthStore((state) => state.accessToken);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [recentMessage, setRecentMessage] = useState(false);
    const [toastConversationId, setToastConversationId] = useState<number | null>(null);
    const activeSegments = useRef(segments);
    useEffect(() => { activeSegments.current = segments; }, [segments]);

    useEffect(() => {
        if (!accessToken) { setHasUnreadMessages(false); return; }
        let active = true;
        const refresh = async () => {
            try {
                const unread = await getUnreadMessageNotifications(accessToken);
                if (active) setHasUnreadMessages(unread.length > 0);
            } catch (error) {
                console.error("Erreur lors du chargement du badge de messagerie :", error);
            }
        };
        void refresh();
        const received = DeviceEventEmitter.addListener("messaging:new-message", () => {
            setHasUnreadMessages(true);
            setRecentMessage(true);
            setTimeout(() => setRecentMessage(false), 1000);
            void refresh();
        });
        const showToast = DeviceEventEmitter.addListener("messaging:notify-user", (conversationId: number) => {
            if (activeSegments.current[0] === "messaging") return;
            setToastConversationId(conversationId);
            setTimeout(() => setToastConversationId((current) => current === conversationId ? null : current), 5000);
        });
        const read = DeviceEventEmitter.addListener("messaging:read", () => void refresh());
        const interval = setInterval(() => void refresh(), 30000);
        return () => { active = false; received.remove(); showToast.remove(); read.remove(); clearInterval(interval); };
    }, [accessToken]);
    return (
        <AuthGuard>
            <View style={{flex: 1}}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,

                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: "#999",

                    tabBarStyle: {
                        height: 70,
                        paddingTop: 8,
                        paddingBottom: 8,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Accueil",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="home-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="search"
                    options={{
                        title: "Recherche",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="search-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="new-publication"
                    options={{
                        title: "Publier",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="add-circle-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="friends"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen
                    name="messages"
                    options={{
                        title: "Messages",
                        tabBarIcon: ({ color, size }) => (
                            <MessageTabIcon color={color} size={size} unread={hasUnreadMessages} recent={recentMessage}/>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profil",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="person-outline"
                                size={size}
                                color={showingFriendLists ? colors.primary : color}
                            />
                        ),
                    }}
                />
            </Tabs>
            {toastConversationId !== null && <Pressable
                style={{position: "absolute", alignSelf: "center", bottom: 82, width: "90%", minHeight: 68, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 13, backgroundColor: "#2B2330", flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8}}
                onPress={() => {
                    const conversationId = toastConversationId;
                    setToastConversationId(null);
                    router.push(`/messaging/${conversationId}` as any);
                }}
                accessibilityRole="button"
                accessibilityLabel="Nouveau message. Ouvrir la conversation"
            >
                <View style={{width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, marginRight: 13}}>
                    <Ionicons name="chatbubble-ellipses" size={23} color={colors.white}/>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: "700"}}>Nouveau message</Text>
                    <Text style={{color: "#E6DFE8", fontSize: 13, marginTop: 3}}>Touchez pour ouvrir la conversation</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.white}/>
            </Pressable>}
            </View>
        </AuthGuard>
    );
}
