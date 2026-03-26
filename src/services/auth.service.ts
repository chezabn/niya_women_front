// src/services/auth.service.ts
import apiClient from '../lib/axios';
import type {
    LoginPayload,
    LoginResponse, PasswordResetConfirmPayload,
    PasswordResetRequestPayload, PasswordResetResponse,
    RegisterPayload,
    RegisterResponse
} from "../types/user.ts";
import axios from "axios";

export const authService = {
    /**
     * Envoie les données d'inscription au backend Django
     */
    register: async (data: RegisterPayload): Promise<RegisterResponse> => {
        try {
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

    login: async (data: LoginPayload): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/users/login/', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || { message: 'Identifiants incorrects' };
            }
            throw error;
        }
    },

    requestPasswordReset: async (data: PasswordResetRequestPayload): Promise<PasswordResetResponse> => {
        try {
            const response = await apiClient.post<PasswordResetResponse>('/users/request-password-reset/', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // On renvoie toujours le même message pour ne pas divulguer si l'email existe ou non (sécurité)
                // Mais on laisse passer l'erreur si c'est un problème de format (ex: email invalide)
                const errorMsg = error.response?.data?.message || "Une erreur est survenue.";
                throw { message: errorMsg };
            }
            throw error;
        }
    },


    confirmPasswordReset: async (data: PasswordResetConfirmPayload): Promise<PasswordResetResponse> => {
        try {
            const response = await apiClient.post<PasswordResetResponse>('/users/confirm-password-reset/', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || { message: 'Code invalide ou expiré.' };
            }
            throw error;
        }
    },
};