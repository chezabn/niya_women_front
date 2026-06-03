import { apiFetch } from "./client";
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "../../types";



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

export const login = (
    payload: LoginRequest,
) => {
    return apiFetch<LoginResponse>(
        "/auth/login/",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    )
}