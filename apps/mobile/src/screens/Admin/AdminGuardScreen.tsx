import React from "react";

import { LoginScreen } from "../Login/LoginScreen";
import { AccessDeniedScreen } from "./AccessDeniedScreen";
import { AdminReviewIdentityScreen } from "./AdminReviewIdentityScreen";
import {useAuthStore} from "@/src/store/authStore";



interface Props {
    verificationId: number;
}

export const AdminGuardScreen = ({
                                     verificationId,
                                 }: Props) => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const user = useAuthStore(
        (state) => state.user,
    );

    const isAdmin =
        user?.is_staff ||
        user?.is_superuser;

    if (!accessToken) {
        return <LoginScreen />;
    }

    if (!isAdmin) {
        return <AccessDeniedScreen />;
    }

    return (
        <AdminReviewIdentityScreen
            verificationId={verificationId}
        />
    );
};