import { apiFetch } from "./client";
import {
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