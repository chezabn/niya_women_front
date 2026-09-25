import {apiFetch} from "./client";
import {Journal, JournalListResponse} from "../../types";

export async function getMyJournals(
    accessToken: string,
): Promise<Journal[]> {
    const response = await apiFetch<JournalListResponse>(
        "/journal/journals/",
        undefined,
        accessToken,
    );
    return response.results
}

export async function getPage(
    accessToken: string,
    pageId: number,
): Promise<Journal> {
    return apiFetch<Journal>(
        `/journal/journals/${pageId}/`,
        undefined,
        accessToken,
    )
}