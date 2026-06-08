export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    accept_cgu: boolean;
}

export interface RegisterResponse {
    "message": string;
    "access": string;
    "refresh": string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    "message": string;
    "access": string;
    "refresh": string;
}

export interface ForgotPasswordRequest {
    "email": string;
}

export interface ForgotPasswordResponse {
    "detail": string;
}
export interface ResetPasswordRequest {
    email: string;
    code: string;
    new_password: string;
}

export interface ResetPasswordResponse {
    detail: string;
}

export interface SendVerificationCodeRequest {
    detail: string;
}

export interface SendVerificationCodeResponse {
    detail: string;
}

export interface VerifyEmailRequest {
    code: string;
}

export interface VerifyEmailResponse {
    detail: string;
}