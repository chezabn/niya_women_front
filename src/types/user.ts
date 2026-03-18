export interface UserData {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
}
