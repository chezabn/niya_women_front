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