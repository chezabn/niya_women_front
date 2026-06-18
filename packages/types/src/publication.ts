import { UserPreview } from "./user";

export type MediaType = "IMAGE" | "VIDEO";

export interface PublicationMedia {
    id: number;
    file: string;
    media_type: MediaType;
    order: number;
}

export interface Publication {
    id: number;

    author: UserPreview;

    caption: string;

    medias: PublicationMedia[];

    likes_count: number;
    comments_count: number;

    is_liked: boolean;

    comments_enabled?: boolean;

    is_edited: boolean;

    created_at: string;
    updated_at?: string;
}

export interface PublicationCreate {
    caption: string;
    comments_enabled?: boolean;
}

export interface PublicationUpdate {
    caption?: string;
    comments_enabled?: boolean;
}

export interface PublicationLikeResponse {
    detail: string;
}

export interface Comment {
    id: number;

    description: string;

    author: UserPreview;

    created_at: string;
}

export interface CommentCreate {
    description: string;
}

export interface CursorPaginationResponse<T> {
    next: string | null;
    previous: string | null;
    results: T[];
}