// src/types/company.ts

export interface Company {
    id: number;
    name: string;
    description: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    logo: string | null; // URL de l'image
    // Le champ 'user' n'est généralement pas renvoyé ou nécessaire pour l'affichage public
}

export interface CreateCompanyPayload {
    name: string;
    description: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
}

export interface UpdateCompanyPayload extends Partial<CreateCompanyPayload> {}

export interface MessageResponse {
    message?: string;
    error?: string;
    [key: string]: any;
}