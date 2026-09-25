import { PublicationListResponse} from "../../types";
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