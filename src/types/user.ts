// Use for GET, PATCH
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UpdateProfilePayload {
    email?: string;
    first_name?: string;
    last_name?: string;
}

export type UpdateProfileResponse = UserProfile;

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
}

export interface RegisterResponse {
    message: string;
    access_token: string;
    refresh_token: string;
}