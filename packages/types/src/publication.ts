import { User } from "./user";

export interface PublicationMedia {
    id: number;
    file: string;
    media_type: "IMAGE" | "VIDEO";
    order: number;
}

export interface Publication {
    id: number;

    author: User;

    caption: string;

    medias: PublicationMedia[];

    likes_count: number;
    comments_count: number;

    is_liked: boolean;

    is_edited: boolean;

    created_at: string;
}

export interface PublicationDetail {
    id: number;

    author: User;

    caption: string;

    medias: PublicationMedia[];

    likes_count: number;
    comments_count: number;

    is_liked: boolean;

    comments_enabled: boolean;

    is_edited: boolean;

    created_at: string;
    updated_at: string;
}

export interface PublicationCreate {
    caption: string;
    comments_enabled: boolean;

    files?: File[];
}

export interface PublicationUpdate {
    caption?: string;
    comments_enabled?: boolean;
}

export interface Comment {
    id: number;

    description: string;

    author: User;

    created_at: string;
}

export interface CommentCreate {
    description: string;
}

export interface FeedResponse {
    next: string | null;
    previous: string | null;
    results: Publication[];
}

export interface ApiDetailResponse {
    detail: string;
}