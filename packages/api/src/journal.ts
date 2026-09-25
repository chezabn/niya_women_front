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