export interface Comment {
    id: number;
    publication: number;
    author: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
    description: string;
    created_at: string;
}

export interface CommentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
}

export interface CommentUpdate {
    description: string;
}

export interface CommentCreate {
    publication: number;
    description: string;
}