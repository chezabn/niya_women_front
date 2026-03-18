// src/services/user.service.ts
import apiClient from '../lib/axios';
import type {UpdateProfilePayload, UpdateProfileResponse, UserProfile} from "../types/user.ts";

export const userService = {
    /**
     * Récupère le profil de l'utilisateur connecté
     */
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/users/user/'); // Adapte l'URL si besoin
        return response.data;
    },

    /**
     * Met à jour le profil (PATCH)
     * Envoie uniquement les champs modifiés
     */
    updateProfile: async (data: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
        const response = await apiClient.patch<UpdateProfileResponse>('/users/user/', data);
        return response.data;
    },

    /**
     * Supprime le compte utilisateur
     */
    deleteProfile: async (): Promise<void> => {
        await apiClient.delete('/users/user/');
    },
};