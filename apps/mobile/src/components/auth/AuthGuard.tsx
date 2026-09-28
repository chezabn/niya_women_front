import { Redirect } from "expo-router";
import { ReactNode } from "react";
import { useAuthStore } from "@/src/store/authStore";

interface Props {
    children: ReactNode;
}

export const AuthGuard = ({
                              children,
                          }: Props) => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const user = useAuthStore(
        (state) => state.user,
    );

    if (!accessToken) {
        return <Redirect href="/login" />;
    }

    if (!user?.email_verified) {
        return <Redirect href="/verify-email" />;
    }

    if (!user?.identity_verified) {
        return <Redirect href="/identity-verification" />;
    }

    return <>{children}</>;
};