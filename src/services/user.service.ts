// src/services/user.service.ts
import apiClient from '../lib/axios';
import type {UpdateProfilePayload, UpdateProfileResponse, UserProfile} from "../types/user.ts";

export const userService = {
    /**
     * GET all users
     */
    getAllUsers: async (): Promise<UserProfile[]> => {
        const response = await apiClient.get<UserProfile[]>('/users/users/');
        return response.data;
    },

    /**
     * GET my profile
     */
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/users/user/');
        return response.data;
    },

    /**
     * PATCH my profile
     */
    updateProfile: async (data: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
        const response = await apiClient.patch<UpdateProfileResponse>('/users/user/', data);
        return response.data;
    },

    /**
     * DELETE my profile
     */
    deleteProfile: async (): Promise<void> => {
        await apiClient.delete('/users/user/');
    },
};