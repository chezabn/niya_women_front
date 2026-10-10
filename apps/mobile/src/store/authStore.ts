import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { User } from "@niyya/types";

const secureStorage: StateStorage = {
    getItem: async (name) => {
        if (Platform.OS === "web") return null;
        return SecureStore.getItemAsync(name);
    },
    setItem: async (name, value) => {
        if (Platform.OS === "web") return;
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name) => {
        if (Platform.OS === "web") return;
        await SecureStore.deleteItemAsync(name);
    },
};

interface AuthStore {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    hasHydrated: boolean;

    setTokens: (
        accessToken: string,
        refreshToken: string,
    ) => void;

    setUser: (
        user: User,
    ) => void;

    setHasHydrated: (hasHydrated: boolean) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            hasHydrated: false,

            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            setUser: (user) => set({ user }),
            setHasHydrated: (hasHydrated) => set({ hasHydrated }),
            logout: () => set({ accessToken: null, refreshToken: null, user: null }),
        }),
        {
            name: "niyya-auth-session",
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
            }),
            onRehydrateStorage: () => (state, error) => {
                if (error) console.error("Impossible de restaurer la session :", error);
                state?.setHasHydrated(true);
            },
        },
    ),
);
