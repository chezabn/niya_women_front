import {User, UserDelete} from "../../types";
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
    payload: User,
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
            body: JSON.stringify(accessToken),
        },
        accessToken,
    )
}