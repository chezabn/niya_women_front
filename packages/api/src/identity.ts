import { apiFetch } from "./client";

import {
    IdentityReviewResponse, ReviewIdentityRequest,
    ReviewIdentityResponse,
    SubmitIdentityVerificationResponse,
} from "../../types";

export const submitIdentityVerification = async (
    idCardUri: string,
    selfieUri: string,
    accessToken: string,
) => {
    const formData = new FormData();

    formData.append(
        "id_card_front",
        {
            uri: idCardUri,
            name: "id-card.jpg",
            type: "image/jpeg",
        } as any,
    );

    formData.append(
        "selfie_with_id",
        {
            uri: selfieUri,
            name: "selfie.jpg",
            type: "image/jpeg",
        } as any,
    );

    return apiFetch<SubmitIdentityVerificationResponse>(
        "/identification/identity/submit/",
        {
            method: "POST",
            body: formData,
        },
        accessToken,
    );
};

export const getIdentityReview = (
    pk: number,
    accessToken: string,
) => {
    return apiFetch<IdentityReviewResponse>(
        `/identification/identity/${pk}/`,
        {
            method: "GET",
        },
        accessToken,
    );
};

export const reviewIdentity = (
    pk: number,
    payload: ReviewIdentityRequest,
    accessToken: string,
) => {
    return apiFetch<ReviewIdentityResponse>(
        `/identification/admin/identity/${pk}/review/`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        accessToken,
    );
};