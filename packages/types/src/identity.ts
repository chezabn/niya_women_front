export interface SubmitIdentityVerificationResponse {
    message: string;
    id: number;
}

export interface ReviewIdentityRequest {
    action: "approve" | "reject";
    rejection_reason?: string;
}

export interface ReviewIdentityResponse {
    message: string;
}


export interface IdentityReviewUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface IdentityReviewResponse {
    id: number;

    user: IdentityReviewUser;

    id_card_front: string;
    selfie_with_id: string;

    status: string;

    ai_score: number | null;
    ai_details: Record<string, any> | null;

    reviewed_by: number | null;
    reviewed_at: string | null;

    rejection_reason: string;

    created_at: string;
    updated_at: string;
}