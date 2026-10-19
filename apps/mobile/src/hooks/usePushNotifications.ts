import { useEffect, useRef } from "react";
import { DeviceEventEmitter, Platform } from "react-native";
import Constants, { AppOwnership } from "expo-constants";
import * as Notifications from "expo-notifications";
import { router, useSegments } from "expo-router";

import { registerPushToken } from "@niyya/api";
import { useAuthStore } from "@/src/store/authStore";

const isAndroidExpoGo = Platform.OS === "android" && Constants.appOwnership === AppOwnership.Expo;

const notificationRoute = (data: Record<string, unknown>): string | null => {
    const type = String(data.type ?? data.target_type ?? data.entity_type ?? "").toLowerCase();
    if (type === "daily_journal_reminder") return "/journal";
    if (type === "identity_verification_reminder") return "/identity-pending";
    if (type === "identity_request") return "/admin-review";
    if (type === "identity_approved") return "/(tabs)";
    if (type === "identity_rejected") return "/identity-rejected";
    const conversationId = data.conversation_id;
    if (type === "message" && (typeof conversationId === "string" || typeof conversationId === "number") && /^\d+$/.test(String(conversationId))) {
        return `/messaging/${conversationId}`;
    }
    const publicationId = data.publication_id ?? (type.includes("publication") ? data.id : undefined);
    const userId = data.user_id ?? (type.includes("profile") || type.startsWith("user") ? data.id : undefined);

    if ((typeof publicationId === "string" || typeof publicationId === "number") && /^\d+$/.test(String(publicationId))) {
        return `/publications/${publicationId}`;
    }
    if ((typeof userId === "string" || typeof userId === "number") && /^\d+$/.test(String(userId))) {
        return `/profile/${userId}`;
    }
    return null;
};

export const usePushNotifications = (): void => {
    const segments = useSegments();
    const isConversationOpen = useRef(false);
    useEffect(() => {
        isConversationOpen.current = segments[0] === "messaging";
    }, [segments]);

    const accessToken = useAuthStore((state) => state.accessToken);
    const isEmailVerified = useAuthStore((state) => Boolean(state.user?.email_verified));
    const isFullyVerified = useAuthStore((state) => Boolean(state.user?.email_verified && state.user.identity_verified));
    const shouldRemindIdentity = useAuthStore((state) => Boolean(state.user?.email_verified && !state.user.identity_verified));

    useEffect(() => {
        // Expo Go on Android no longer includes the native remote push module.
        // Skip all native notification calls there so the root route can still load.
        if (isAndroidExpoGo) return;

        Notifications.setNotificationHandler({
            handleNotification: async (notification) => {
                const data = notification.request.content.data ?? {};
                const type = String(data.type ?? data.target_type ?? data.entity_type ?? "").toLowerCase();
                if (type === "message" && isConversationOpen.current) {
                    return {
                        shouldShowBanner: false,
                        shouldShowList: false,
                        shouldPlaySound: false,
                        shouldSetBadge: false,
                    };
                }
                return {
                    shouldShowBanner: true,
                    shouldShowList: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                };
            },
        });

        let lastResponseId: string | null = null;
        const handleResponse = (response: Notifications.NotificationResponse) => {
            const responseId = response.notification.request.identifier;
            if (responseId === lastResponseId) return;
            lastResponseId = responseId;

            const route = notificationRoute(response.notification.request.content.data ?? {});
            if (route) router.push(route as never);
        };

        const received = Notifications.addNotificationReceivedListener((notification) => {
            // setNotificationHandler displays the banner and sound while the app is active.
            console.info("Push notification reçue", notification.request.content.data);
            const data = notification.request.content.data ?? {};
            const conversationId = data.conversation_id;
            if (String(data.type ?? "").toLowerCase() === "message" && /^\d+$/.test(String(conversationId ?? ""))) {
                const id = Number(conversationId);
                DeviceEventEmitter.emit("messaging:new-message", id);
                if (!isConversationOpen.current) DeviceEventEmitter.emit("messaging:notify-user", id);
            }
        });
        const response = Notifications.addNotificationResponseReceivedListener(handleResponse);

        void Notifications.getLastNotificationResponseAsync()
            .then((lastResponse) => {
                if (lastResponse) handleResponse(lastResponse);
            })
            .catch((error: unknown) => console.warn("Impossible de lire la dernière notification :", error));

        return () => {
            received.remove();
            response.remove();
        };
    }, []);

    useEffect(() => {
        if (isAndroidExpoGo) return;

        let cancelled = false;
        const syncNotifications = async () => {
            try {
                if (Platform.OS === "android") {
                    await Notifications.setNotificationChannelAsync("default", {
                        name: "Notifications",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#8A6BAF",
                    });
                }

                const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
                if (cancelled) return;
                const reminderTypes = ["daily_journal_reminder", "identity_verification_reminder"];
                await Promise.all(scheduledNotifications
                    .filter((item) => reminderTypes.includes(String(item.content.data?.type)))
                    .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));
                if (cancelled) return;
                if (!accessToken) return;

                const permissions = await Notifications.getPermissionsAsync();
                let permissionStatus = permissions.status;
                if (permissionStatus !== "granted") {
                    if (!permissions.canAskAgain) return;
                    permissionStatus = (await Notifications.requestPermissionsAsync()).status;
                }
                if (cancelled || permissionStatus !== "granted") return;

                const scheduleDailyReminder = async (type: string, title: string, body: string) => {
                    await Notifications.scheduleNotificationAsync({
                        content: { title, body, data: { type } },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                            hour: 18,
                            minute: 23,
                            repeats: true,
                        },
                    });
                };

                if (shouldRemindIdentity) {
                    await scheduleDailyReminder(
                        "identity_verification_reminder",
                        "Confirmation d’identité",
                        "Votre identité n’est pas encore confirmée. Pensez à terminer votre démarche de vérification.",
                    );
                }
                if (isFullyVerified) {
                    await scheduleDailyReminder(
                        "daily_journal_reminder",
                        "Un moment pour votre journal",
                        "Pensez à remplir la page du jour de votre journal.",
                    );
                }

                if (!isEmailVerified || cancelled) return;
                const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
                if (!projectId) {
                    console.warn("Expo projectId absent : impossible de récupérer le token push.");
                    return;
                }

                const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
                if (!cancelled) await registerPushToken(token, accessToken);
            } catch (error) {
                // Notification setup must never block access to the app.
                console.warn("Impossible de configurer les notifications :", error);
            }
        };

        void syncNotifications();
        return () => { cancelled = true; };
    }, [accessToken, isEmailVerified, isFullyVerified, shouldRemindIdentity]);
};
