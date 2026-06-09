import { User } from "../../types";
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