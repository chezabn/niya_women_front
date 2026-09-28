export interface Publication {
    id: number;
    author: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
    caption: string;
    created_at: string;
    updated_at: string;
    is_edited: boolean;
    comments_enabled: boolean;
    is_archived: boolean;
    like_count: number;
    is_liked: boolean;
}

export interface PublicationListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Publication[];
}

export interface PublicationUpdate {
    caption: string;
    comments_enabled: boolean;
    is_archived: boolean;
}

export interface PublicationCreate {
    caption: string;
    comments_enabled: boolean;
}