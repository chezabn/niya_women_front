import { apiFetch } from "./client";
import {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from "../../types";



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

export const forgotPassword = (
    payload: ForgotPasswordRequest,
) => {
    return apiFetch<ForgotPasswordResponse>(
        "/auth/request-password-reset/",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    )
}

export const resetPassword = (
    payload: ResetPasswordRequest,
) => {
    return apiFetch<ResetPasswordResponse>(
        "/auth/confirm-password-reset/",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    )
}