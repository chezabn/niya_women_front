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