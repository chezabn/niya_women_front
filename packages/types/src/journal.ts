export interface Journal {
    id: number;
    title: string;
    page: string;
    date: string;
    created_at: string;
    updated_at: string;
}

export interface JournalListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Journal[];
}

export interface JournalUpdate {
    title: string;
    page: string;
    date: string;
}