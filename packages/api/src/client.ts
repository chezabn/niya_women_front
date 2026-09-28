import { API_BASE_URL } from "../../constants";

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

    if (options?.body instanceof FormData) {
        return new Promise<T>((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open(options.method ?? "GET", `${API_BASE_URL}${endpoint}`);

            for (const [name, value] of Object.entries(headers)) {
                request.setRequestHeader(name, value);
            }

            request.onload = () => {
                if (request.status === 204) {
                    resolve(undefined as T);
                    return;
                }

                let data: unknown;
                try {
                    data = JSON.parse(request.responseText);
                } catch {
                    data = { detail: request.responseText };
                }

                if (request.status < 200 || request.status >= 300) {
                    reject(data);
                    return;
                }

                resolve(data as T);
            };

            request.onerror = () => reject(new Error("Network request failed"));
            request.onabort = () => reject(new Error("Request aborted"));
            request.ontimeout = () => reject(new Error("Request timed out"));
            request.send(options.body);
        });
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        },
    );

    if (response.status === 204) {
        return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}
