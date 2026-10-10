import type { NotificationListResponse } from "../../types";
import { apiFetch } from "./client";

export const getNotifications = (
    accessToken: string,
    page = 1,
    unreadOnly = false,
) => {
    const unreadFilter = unreadOnly ? "&unread=true" : "";
    return apiFetch<NotificationListResponse>(
        `/notifications/?page=${page}${unreadFilter}`,
        { method: "GET" },
        accessToken,
    );
};

export const markNotificationRead = (
    notificationId: number,
    accessToken: string,
) => {
    return apiFetch<{ is_read: boolean }>(
        `/notifications/${notificationId}/read/`,
        { method: "PATCH" },
        accessToken,
    );
};
