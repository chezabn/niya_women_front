import { UserPreviewListResponse } from "../../types";
import { apiFetch } from "./client";

const FOLLOWER_API = "/followers";

export type FriendshipStatus = "pending" | "accepted" | null;

export function getFriendshipStatus(userId: number, accessToken: string) {
    return apiFetch<{ status: FriendshipStatus }>(
        `${FOLLOWER_API}/friends/${userId}/`,
        undefined,
        accessToken,
    );
}

export function sendFriendRequest(userId: number, accessToken: string) {
    return apiFetch<{ status: Exclude<FriendshipStatus, null> }>(
        `${FOLLOWER_API}/friends/${userId}/`,
        { method: "POST" },
        accessToken,
    );
}

export function deleteFriendship(userId: number, accessToken: string) {
    return apiFetch<void>(
        `${FOLLOWER_API}/friends/${userId}/`,
        { method: "DELETE" },
        accessToken,
    );
}

export function getFriends(accessToken: string) {
    return apiFetch<UserPreviewListResponse>(
        `${FOLLOWER_API}/friends/`,
        undefined,
        accessToken,
    );
}

export function getFriendRequests(accessToken: string) {
    return apiFetch<UserPreviewListResponse>(
        `${FOLLOWER_API}/friend-requests/`,
        undefined,
        accessToken,
    );
}

export function acceptFriendRequest(userId: number, accessToken: string) {
    return apiFetch<{ status: "pending" | "accepted" }>(
        `${FOLLOWER_API}/friends/${userId}/`,
        { method: "PATCH" },
        accessToken,
    );
}

export function removeFriendRequest(userId: number, accessToken: string) {
    return apiFetch<void>(
        `${FOLLOWER_API}/friends/${userId}/`,
        { method: "DELETE" },
        accessToken,
    );
}
