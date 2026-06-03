import { apiFetch } from "./client";
import {RegisterRequest, RegisterResponse} from "../../types/src";



export const register = (
    payload: RegisterRequest,
) => {
    return apiFetch<RegisterResponse>(
        "/auth/register/",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
};