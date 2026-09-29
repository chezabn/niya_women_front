import {
    User,
    UserBlockedResponse,
    UserDelete,
    UserPreviewListResponse, UserReport, UserReportListResponse, UserReportResponse,
    UserSearchResponse,
    UserUpdate
} from "../../types";
import { apiFetch } from "./client";


export const getMe = (
    accessToken: string,
) => {
    return apiFetch<User>(
        "/users/me/",
        {
            method: "GET",
        },
        accessToken,
    );
};

export const updateMe = (
    payload: UserUpdate,
    accessToken: string,
) => {
    return apiFetch<User>(
        "/users/me/",
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
        accessToken,
    )
}

export const deleteMe = (
    accessToken: string,
) => {
    return apiFetch<UserDelete>(
        "/users/me/",
        {
            method: "DELETE",
        },
        accessToken,
    )
}

export const searchUser = (
    search: string,
    accessToken: string,
) => {
    return apiFetch<UserSearchResponse>(
        `/users/search/?q=${search}`,
        {
            method: "GET",
        },
        accessToken,
    )
}

export const getUser = (
    userId: number,
    accessToken: string,
) => {
    return apiFetch<User>(
        `/users/${userId}/`,
        {
            method: "GET",
        },
        accessToken,
    )
}

export const blockUser = (
    userId: number,
    accessToken: string,
) => {
    return apiFetch<UserBlockedResponse>(
        `/users/${userId}/block/`,
        {
            method: "POST",
        },
        accessToken,
    )
}

export const deblockUser = (
    userId: number,
    accessToken: string,
) => {
    return apiFetch<void>(
        `/users/${userId}/block/`,
        {
            method: "DELETE",
        },
        accessToken,
    )
}

export const getAllBlockedUsers = (
    accessToken: string,
) => {
    return apiFetch<UserPreviewListResponse>(
        `/users/block/`,
        {
            method: "GET",
        },
        accessToken,
    )
}

export const reportUser = (
    data: UserReport,
    accessToken: string,
) => {
    return apiFetch<UserReportResponse>(
        `/users/reports/`,
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        accessToken,
    )
}

export const getAllReports = (
    accessToken: string,
) => {
    return apiFetch<UserReportListResponse>(
        "/users/reports/all/",
        {
            method: "GET",
        },
        accessToken,
    )
}