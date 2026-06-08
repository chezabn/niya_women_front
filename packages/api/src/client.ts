import {API_BASE_URL} from "../../constants";


export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit,
    accessToken?: string,
): Promise<T> {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken && {
                    Authorization: `Bearer ${accessToken}`,
                }),
            },
            ...options,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}