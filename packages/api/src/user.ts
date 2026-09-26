import {User, UserDelete, UserSearchResponse, UserUpdate} from "../../types";
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