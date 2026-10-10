import { useEffect } from "react";
import { Platform } from "react-native";
import Constants, { AppOwnership } from "expo-constants";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

import { registerPushToken } from "@niyya/api";
import { useAuthStore } from "@/src/store/authStore";

const isAndroidExpoGo = Platform.OS === "android" && Constants.appOwnership === AppOwnership.Expo;

const notificationRoute = (data: Record<string, unknown>): string | null => {
    const type = String(data.type ?? data.target_type ?? data.entity_type ?? "").toLowerCase();
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
    const accessToken = useAuthStore((state) => state.accessToken);
    const isFullyVerified = useAuthStore((state) => Boolean(state.user?.email_verified && state.user.identity_verified));

    useEffect(() => {
        // Expo Go on Android no longer includes the native remote push module.
        // Skip all native notification calls there so the root route can still load.
        if (isAndroidExpoGo) return;

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
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
        if (!accessToken || !isFullyVerified) return;

        let cancelled = false;
        const register = async () => {
            try {
                if (Platform.OS === "android") {
                    await Notifications.setNotificationChannelAsync("default", {
                        name: "Notifications",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#8A6BAF",
                    });
                }

                const permissions = await Notifications.getPermissionsAsync();
                let permissionStatus = permissions.status;
                if (permissionStatus !== "granted") {
                    if (!permissions.canAskAgain) return;
                    permissionStatus = (await Notifications.requestPermissionsAsync()).status;
                }
                if (cancelled || permissionStatus !== "granted") return;

                const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
                if (!projectId) {
                    console.warn("Expo projectId absent : impossible de récupérer le token push.");
                    return;
                }

                const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
                if (!cancelled) await registerPushToken(token, accessToken);
            } catch (error) {
                // A push registration problem must never block access to the app.
                console.warn("Impossible d'enregistrer le token push :", error);
            }
        };

        void register();
        return () => { cancelled = true; };
    }, [accessToken, isFullyVerified]);
};
