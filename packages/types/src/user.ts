export interface UserProfile {
    bio: string;
    post_count: number;
}


export interface UserSearchResult {
    id: number;
    username: string;
    identity_verified: boolean;
    profile: number;
}

export interface UserSearchResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: UserSearchResult[];
}

export interface User {
    id: number;
    username: string;

    first_name: string;
    last_name: string;
    email: string;

    email_verified: boolean;
    identity_verified: boolean;

    is_active: boolean;
    account_deactivated_by_user: boolean;

    is_staff: boolean;
    is_superuser: boolean;

    profile: UserProfile;
}

export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    email?: string;
    bio?: string;
}

export interface UserDelete {
    details: string;
}