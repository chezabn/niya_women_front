import type { Conversation, Message, PaginatedMessages, NotificationListResponse } from "../../types";
import { API_BASE_URL } from "../../constants";
import { apiFetch } from "./client";
import { getNotifications, markNotificationRead } from "./notifications";

export const getConversations = (accessToken: string) =>
    apiFetch<Conversation[]>("/messaging/conversations/", { method: "GET" }, accessToken);

export const getOrCreateConversation = (otherUserId: number, accessToken: string) =>
    apiFetch<Conversation>("/messaging/conversations/", {
        method: "POST",
        body: JSON.stringify({ other_user_id: otherUserId }),
    }, accessToken);

export const getConversationMessages = (conversationId: number, accessToken: string, page = 1) =>
    apiFetch<PaginatedMessages>(`/messaging/conversations/${conversationId}/messages/?page=${page}`, { method: "GET" }, accessToken);

export const sendConversationMessage = (conversationId: number, content: string, accessToken: string) =>
    apiFetch<Message>(`/messaging/conversations/${conversationId}/send/`, {
        method: "POST",
        body: JSON.stringify({ content }),
    }, accessToken);

export const deleteConversationMessage = (conversationId: number, messageId: number, accessToken: string) =>
    apiFetch<void>(`/messaging/conversations/${conversationId}/messages/${messageId}/`, { method: "DELETE" }, accessToken);

export const getUnreadMessageNotifications = async (accessToken: string, conversationId?: number) => {
    const unread: NotificationListResponse["results"] = [];
    let page = 1;
    let hasNext = true;
    while (hasNext) {
        const response = await getNotifications(accessToken, page, true);
        unread.push(...response.results.filter((item) => item.notification_type === "message" && (conversationId === undefined || item.conversation_id === conversationId)));
        hasNext = Boolean(response.next);
        page += 1;
    }
    return unread;
};

export const markConversationMessagesRead = async (conversationId: number, accessToken: string) => {
    const unread = await getUnreadMessageNotifications(accessToken, conversationId);
    await Promise.all(unread.map((notification) => markNotificationRead(notification.id, accessToken)));
};

export const getMessagingWebSocketUrl = (conversationId: number, accessToken: string) => {
    const url = new URL(API_BASE_URL);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}/ws/messaging/${conversationId}/?token=${encodeURIComponent(accessToken)}`;
};
