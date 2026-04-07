// src/services/company.service.ts
import apiClient from '../lib/axios';
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from '../types/company';
import {getCurrentUserId} from "../lib/auth.utils.ts";

export const companyService = {
    /**
     * Récupère toutes les entreprises (avec option de recherche)
     */
    getAllCompanies: async (searchQuery?: string): Promise<Company[]> => {
        const params = searchQuery ? { params: { search: searchQuery } } : {};
        const response = await apiClient.get<Company[]>('/company/companies/', params);
        const allCompanies = response.data
        const myId = getCurrentUserId();
        if (myId !== null) {
            return allCompanies.filter(company => company.owner_id !== myId);
        }
        return allCompanies;
    },

    /**
     * Récupère mon entreprise
     */
    getMyCompany: async (): Promise<Company> => {
        const response = await apiClient.get<Company>('/company/company/mine/');
        return response.data;
    },

    /**
     * Crée une nouvelle entreprise
     */
    createCompany: async (data: CreateCompanyPayload): Promise<Company> => {
        const response = await apiClient.post<Company>('/company/company/mine/', data);
        return response.data;
    },

    /**
     * Met à jour l'entreprise de l'utilisateur connecté
     */
    updateCompany: async (data: UpdateCompanyPayload): Promise<Company> => {
        const response = await apiClient.patch<Company>('/company/company/mine/', data);
        return response.data;
    },

    /**
     * Supprime l'entreprise
     */
    deleteCompany: async (): Promise<void> => {
        // Le backend demande un body { confirm: true }
        await apiClient.delete('/company/mine', { data: { confirm: true } });
    },

    /**
     * Récupère une entreprise par son ID
     */
    getCompanyById: async (id: number): Promise<Company> => {
        const response = await apiClient.get<Company>(`/company/companies/${id}/`);
        return response.data;
    },
};