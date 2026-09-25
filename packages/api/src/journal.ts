import {apiFetch} from "./client";
import {
    Journal,
    JournalCreate,
    JournalListResponse,
    JournalUpdate,
    type PublicationCreate,
    type PublicationDetail
} from "../../types";

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

export async function updatePage(
    accessToken: string,
    pageId: number,
    newPage: JournalUpdate,
): Promise<Journal> {
    return apiFetch<Journal>(
        `/journal/journals/${pageId}/`,
        {
            method: "PATCH",
            body: JSON.stringify(newPage),
        },
        accessToken,
    )
}

export async function deletePage(
    accessToken: string,
    pageId: number,
): Promise<void> {
    await apiFetch(
        `/journal/journals/${pageId}/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}

export async function createPage(
    newPage: JournalCreate,
    accessToken: string,
): Promise<Journal> {
    return apiFetch<Journal>(
        "/journal/journals/",
        {
            method: "POST",
            body: JSON.stringify(newPage),
        },
        accessToken,
    );
}
