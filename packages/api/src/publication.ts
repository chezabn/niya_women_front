import {
    Publication,
    PublicationCreate,
    PublicationListResponse, PublicationReport, PublicationReportResponse,
    PublicationUpdate,
} from "../../types";

import { apiFetch } from "./client";


export async function geAllPublications(
    accessToken: string,
    page = 1,
): Promise<PublicationListResponse> {
    return apiFetch<PublicationListResponse>(
        `/publications/publications/?page=${page}`,
        undefined,
        accessToken,
    );
}

export async function geAllPublicationsLiked(
    accessToken: string,
    page = 1,
): Promise<PublicationListResponse> {
    return apiFetch<PublicationListResponse>(
        `/publications/publications/liked/?page=${page}`,
        undefined,
        accessToken,
    );
}

export async function getUserPublications(
    userId: number,
    accessToken: string,
    page = 1,
): Promise<PublicationListResponse> {
    return apiFetch<PublicationListResponse>(
        `/publications/publications/user/${userId}/?page=${page}`,
        undefined,
        accessToken,
    );
}


export async function getMyPublications(
    accessToken: string,
    page = 1,
): Promise<PublicationListResponse> {
    return apiFetch<PublicationListResponse>(
        `/publications/publications/me/?page=${page}`,
        undefined,
        accessToken,
    );
}


export async function getMyPublication(
    accessToken: string,
    publicationId: number,
): Promise<Publication> {
    return apiFetch<Publication>(
        `/publications/publications/${publicationId}/`,
        undefined,
        accessToken,
    );
}


export async function updatePublication(
    accessToken: string,
    pageId: number,
    newPublication: PublicationUpdate,
): Promise<Publication> {
    return apiFetch<Publication>(
        `/publications/publications/${pageId}/`,
        {
            method: "PATCH",
            body: JSON.stringify(newPublication),
        },
        accessToken,
    );
}


export async function deletePublication(
    accessToken: string,
    publicationId: number,
): Promise<void> {
    await apiFetch(
        `/publications/publications/${publicationId}/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}


export async function createPublication(
    newPublication: PublicationCreate,
    accessToken: string,
): Promise<Publication> {
    return apiFetch<Publication>(
        "/publications/publications/",
        {
            method: "POST",
            body: JSON.stringify(newPublication),
        },
        accessToken,
    );
}


export async function likePublication(
    accessToken: string,
    publicationId: number,
): Promise<Publication> {
    return apiFetch<Publication>(
        `/publications/publications/${publicationId}/like/`,
        {
            method: "POST",
        },
        accessToken,
    );
}


export async function unlikePublication(
    accessToken: string,
    publicationId: number,
): Promise<Publication> {
    return apiFetch<Publication>(
        `/publications/publications/${publicationId}/like/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}

// ==================================
// Report
// ==================================
export async function reportPublication(
    publicationId: number,
    reason: PublicationReport,
    accessToken: string,
): Promise<PublicationReportResponse> {
    return apiFetch<PublicationReportResponse>(
        `/publications/publications/${publicationId}/report/`,
        {
            method: "POST",
            body: JSON.stringify(reason),
        },
        accessToken,
    )
}