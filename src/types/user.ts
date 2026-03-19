// Use for GET, PATCH
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    bio: string;
}

export interface UpdateProfilePayload {
    email?: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
}

export type UpdateProfileResponse = UserProfile;

// Login Part
export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    refresh: string;
    access: string;
}


// Register Part
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