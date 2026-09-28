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

export interface UserPreview {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    identity_verified?: boolean;
}

export interface UserPreviewListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: UserPreview[];
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
    followers_count: number;
    following_count: number;
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

export interface UserBlockedResponse {
    blocked: boolean;
}

export interface UserReport {
    user_id: number;
    reason: string;
}

export interface UserReportResponse {
    id: number;
    detail: string;
}
