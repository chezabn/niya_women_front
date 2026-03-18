// src/services/auth.service.ts
import apiClient from '../lib/axios';
import type {RegisterPayload, RegisterResponse} from "../types/user.ts";
import axios from "axios";

export const authService = {
    /**
     * Envoie les données d'inscription au backend Django
     */
    register: async (data: RegisterPayload): Promise<RegisterResponse> => {
        try {
            // Remplace '/auth/register/' par l'URL réelle de ton endpoint Django
            const response = await apiClient.post<RegisterResponse>('/users/register/', data);
            return response.data;
        } catch (error) {
            // Gestion des erreurs spécifique
            if (axios.isAxiosError(error)) {
                // Tu peux lancer l'erreur ou la formater pour l'UI
                throw error.response?.data || { message: 'Erreur réseau lors de l\'inscription' };
            }
            throw error;
        }
    },

    // Tu ajouteras login, logout, etc. ici plus tard
};