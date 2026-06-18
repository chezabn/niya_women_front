import { apiFetch } from "./client";

import type {
    Publication,
    PublicationCreate,
    PublicationUpdate,
    PublicationLikeResponse,
    Comment,
    CommentCreate,
    CursorPaginationResponse,
} from "../../types";



/**
 * Publications
 */

export async function getFeed(
    accessToken: string,
): Promise<CursorPaginationResponse<Publication>> {
    return apiFetch(
        "/publications/",
        {
            method: "GET",
        },
        accessToken,
    );
}

export async function getPublication(
    publicationId: number,
    accessToken: string,
): Promise<Publication> {
    return apiFetch(
        `/publications/${publicationId}/`,
        {
            method: "GET",
        },
        accessToken,
    );
}

export async function createPublication(
    data: PublicationCreate,
    accessToken: string,
): Promise<Publication> {
    return apiFetch(
        "/publications/",
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        accessToken,
    );
}

export async function updatePublication(
    publicationId: number,
    data: PublicationUpdate,
    accessToken: string,
): Promise<Publication> {
    return apiFetch(
        `/publications/${publicationId}/`,
        {
            method: "PATCH",
            body: JSON.stringify(data),
        },
        accessToken,
    );
}

export async function deletePublication(
    publicationId: number,
    accessToken: string,
): Promise<void> {
    await apiFetch(
        `/publications/${publicationId}/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}



/**
 * Likes
 */

export async function likePublication(
    publicationId: number,
    accessToken: string,
): Promise<PublicationLikeResponse> {
    return apiFetch(
        `/publications/${publicationId}/like/`,
        {
            method: "POST",
        },
        accessToken,
    );
}

export async function unlikePublication(
    publicationId: number,
    accessToken: string,
): Promise<PublicationLikeResponse> {
    return apiFetch(
        `/publications/${publicationId}/unlike/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}



/**
 * Comments
 */

export async function getComments(
    publicationId: number,
    accessToken: string,
): Promise<Comment[]> {
    return apiFetch(
        `/publications/${publicationId}/comments/`,
        {
            method: "GET",
        },
        accessToken,
    );
}

export async function createComment(
    publicationId: number,
    data: CommentCreate,
    accessToken: string,
): Promise<Comment> {
    return apiFetch(
        `/publications/${publicationId}/comments/`,
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        accessToken,
    );
}

export async function updateComment(
    publicationId: number,
    commentId: number,
    data: CommentCreate,
    accessToken: string,
): Promise<Comment> {
    return apiFetch(
        `/publications/${publicationId}/comments/${commentId}/`,
        {
            method: "PATCH",
            body: JSON.stringify(data),
        },
        accessToken,
    );
}

export async function deleteComment(
    publicationId: number,
    commentId: number,
    accessToken: string,
): Promise<void> {
    await apiFetch(
        `/publications/${publicationId}/comments/${commentId}/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}