import { apiFetch } from "./client";

import type {
    ApiDetailResponse,
    Comment,
    CommentCreate,
    FeedResponse,
    Publication,
    PublicationCreate,
    PublicationDetail,
    PublicationUpdate,
} from "../../types";



export async function getFeed(
    accessToken: string,
    cursor?: string,
): Promise<FeedResponse> {
    let endpoint = "/publications/publications/";

    if (cursor) {
        endpoint += `?cursor=${cursor}`;
    }

    return apiFetch<FeedResponse>(
        endpoint,
        {
            method: "GET",
        },
        accessToken,
    );
}



export async function getPublication(
    publicationId: number,
    accessToken: string,
): Promise<PublicationDetail> {
    return apiFetch<PublicationDetail>(
        `/publications/publications/${publicationId}/`,
        {
            method: "GET",
        },
        accessToken,
    );
}


export async function getMyPublications(
    accessToken: string,
): Promise<Publication[]> {
    return apiFetch<Publication[]>(
        "/publications/publications/me/",
        {
            method: "GET",
        },
        accessToken,
    );
}



export async function createPublication(
    data: PublicationCreate,
    accessToken: string,
): Promise<PublicationDetail> {
    const formData = new FormData();

    formData.append(
        "caption",
        data.caption,
    );

    formData.append(
        "comments_enabled",
        String(data.comments_enabled),
    );

    if (data.files) {
        data.files.forEach((file) => {
            formData.append(
                "files",
                file,
            );
        });
    }

    return apiFetch<PublicationDetail>(
        "/publications/publications/",
        {
            method: "POST",
            body: formData,
        },
        accessToken,
    );
}



export async function updatePublication(
    publicationId: number,
    data: PublicationUpdate,
    accessToken: string,
): Promise<PublicationDetail> {
    return apiFetch<PublicationDetail>(
        `/publications/publications/${publicationId}/`,
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
        `/publications/publications/${publicationId}/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}



export async function likePublication(
    publicationId: number,
    accessToken: string,
): Promise<ApiDetailResponse> {
    return apiFetch<ApiDetailResponse>(
        `/publications/publications/${publicationId}/like/`,
        {
            method: "POST",
        },
        accessToken,
    );
}



export async function unlikePublication(
    publicationId: number,
    accessToken: string,
): Promise<ApiDetailResponse> {
    return apiFetch<ApiDetailResponse>(
        `/publications/publications/${publicationId}/unlike/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}



export async function getComments(
    publicationId: number,
    accessToken: string,
): Promise<Comment[]> {
    return apiFetch<Comment[]>(
        `/publications/publications/${publicationId}/comments/`,
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
    return apiFetch<Comment>(
        `/publications/publications/${publicationId}/comments/`,
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        accessToken,
    );
}