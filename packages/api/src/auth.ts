import { apiFetch } from "./client";
import {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    ResetPasswordResponse, SendVerificationCodeRequest, SendVerificationCodeResponse,
    VerifyEmailRequest, VerifyEmailResponse,
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

export const sendVerificationEmail = (
    accessToken: string,
) => {
    return apiFetch<SendVerificationCodeResponse>(
        "/auth/send-verification-code/",
        {
            method: "POST",
        },
        accessToken,
    )
}

export const verifyEmail = (
    payload: VerifyEmailRequest,
    accessToken: string,
) => {
    return apiFetch<VerifyEmailResponse>(
        "/auth/verify-email/",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        accessToken,
    )
}

export const verifyIdentity = (
    accessToken: string,
) => {
    
}