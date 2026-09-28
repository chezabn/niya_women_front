import {
    CommentCreate,
    CommentListResponse,
    CommentUpdate,
} from "../../types";
import {apiFetch} from "./client";

export async function getComments(
    publicationId: number,
    accessToken: string,
): Promise<CommentListResponse> {
    return apiFetch<CommentListResponse>(
        `/publications/publications/${publicationId}/comments/`,
        undefined,
        accessToken,
    );
}

export async function updateComment(
    accessToken: string,
    commentId: number,
    newComment: CommentUpdate,
): Promise<Comment> {
    return apiFetch<Comment>(
        `/publications/comments/${commentId}/`,
        {
            method: "PATCH",
            body: JSON.stringify(newComment),
        },
        accessToken,
    )
}

export async function deleteComment(
    accessToken: string,
    commentId: number,
): Promise<void> {
    await apiFetch(
        `/publications/comments/${commentId}/`,
        {
            method: "DELETE",
        },
        accessToken,
    );
}

export async function createComment(
    newComment: CommentCreate,
    accessToken: string,
): Promise<Comment> {
    return apiFetch<Comment>(
        "/publications/comments/",
        {
            method: "POST",
            body: JSON.stringify(newComment),
        },
        accessToken,
    );
}