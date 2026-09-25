import {
    Publication, PublicationCreate,
    PublicationListResponse,
    PublicationUpdate
} from "../../types";
import {apiFetch} from "./client";


export async function geAllPublications(
    accessToken: string,
): Promise<PublicationListResponse> {
    return apiFetch<PublicationListResponse>(
        "/publications/publications/",
        undefined,
        accessToken,
    );
}

export async function getMyPublications(
    accessToken: string,
): Promise<PublicationListResponse> {
    return apiFetch<PublicationListResponse>(
        "/publications/publications/me/",
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
    )
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
    )
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