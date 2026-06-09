export interface User {
    id: number;

    username: string;
    first_name: string;
    last_name: string;
    email: string;

    email_verified: boolean;
    identity_verified: boolean;
    is_active: boolean;

    is_staff: boolean;
    is_superuser: boolean;

    profile: unknown;
}