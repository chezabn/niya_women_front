// src/services/company.service.ts
import apiClient from '../lib/axios';
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from '../types/company';

export const companyService = {
    /**
     * Récupère toutes les entreprises (avec option de recherche)
     */
    getAllCompanies: async (searchQuery?: string): Promise<Company[]> => {
        const params = searchQuery ? { params: { search: searchQuery } } : {};
        const response = await apiClient.get<Company[]>('/company/', params);
        return response.data;
    },

    /**
     * Crée une nouvelle entreprise
     */
    createCompany: async (data: CreateCompanyPayload): Promise<Company> => {
        const response = await apiClient.post<Company>('/company/', data);
        return response.data;
    },

    /**
     * Met à jour l'entreprise de l'utilisateur connecté
     */
    updateCompany: async (data: UpdateCompanyPayload): Promise<Company> => {
        const response = await apiClient.patch<Company>('/company/', data);
        return response.data;
    },

    /**
     * Supprime l'entreprise
     */
    deleteCompany: async (): Promise<void> => {
        // Le backend demande un body { confirm: true }
        await apiClient.delete('/company/', { data: { confirm: true } });
    },

    /**
     * Récupère une entreprise par son ID
     */
    getCompanyById: async (id: number): Promise<Company> => {
        const response = await apiClient.get<Company>(`/company/${id}/`);
        return response.data;
    },
};