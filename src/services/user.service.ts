// src/services/user.service.ts
import apiClient from '../lib/axios';
import type {
    MessageResponse,
    UpdateProfilePayload,
    UpdateProfileResponse,
    UserProfile,
    VerifyEmailPayload
} from "../types/user.ts";
import {getCurrentUserId} from "../lib/auth.utils.ts";

export const userService = {
    /**
     * GET all users
     */
    getAllUsers: async (): Promise<UserProfile[]> => {
        const response = await apiClient.get<UserProfile[]>('/users/users/');
        const allUsers = response.data;
        const myId = getCurrentUserId();
        if (myId !== null) {
            return allUsers.filter(user => user.id !== myId);
        }
        return allUsers;
    },

    /**
     * GET one user by ID
     */
    getUserById: async (id: number): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>(`/users/users/${id}`);
        return response.data;
    },

    /**
     * GET my profile
     */
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/users/user/');
        return response.data;
    },

    postSendVerificationEmail: async (): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/users/send-verification-code/');
        return response.data
    },

    postVerifyEmail: async (data: VerifyEmailPayload): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/users/verify-email/', data);
        return response.data
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