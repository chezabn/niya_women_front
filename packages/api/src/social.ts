import { UserPreviewListResponse } from "../../types";
import { apiFetch } from "./client";

const FOLLOWER_API = "/followers";

export function isFollowing(userId: number, accessToken: string) {
    return apiFetch<{ is_following: boolean }>(
        `${FOLLOWER_API}/follow/${userId}/`,
        undefined,
        accessToken,
    );
}

export function followUser(userId: number, accessToken: string) {
    return apiFetch<{ message: string }>(
        `${FOLLOWER_API}/follow/${userId}/`,
        { method: "POST" },
        accessToken,
    );
}

export function unfollowUser(userId: number, accessToken: string) {
    return apiFetch<void>(
        `${FOLLOWER_API}/follow/${userId}/`,
        { method: "DELETE" },
        accessToken,
    );
}

export function getFollowers(userId: number, accessToken: string) {
    return apiFetch<UserPreviewListResponse>(
        `${FOLLOWER_API}/followers/${userId}/`,
        undefined,
        accessToken,
    );
}

export function getFollowing(userId: number, accessToken: string) {
    return apiFetch<UserPreviewListResponse>(
        `${FOLLOWER_API}/following/${userId}/`,
        undefined,
        accessToken,
    );
}
