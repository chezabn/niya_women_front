import {Journal, Publication, PublicationListResponse} from "../../types";
import {apiFetch} from "./client";

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