import {API_BASE_URL} from "../../constants";


export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit,
    accessToken?: string,
): Promise<T> {

    const headers: Record<string, string> = {};

    if (!(options?.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}