import React from "react";

import { LoginScreen } from "../Login/LoginScreen";
import { AccessDeniedScreen } from "./AccessDeniedScreen";
import { AdminReviewIdentityScreen } from "./AdminReviewIdentityScreen";

export const AdminGuardScreen = () => {
    const accessToken = null;

    const isAdmin = false;

    if (!accessToken) {
        return <LoginScreen />;
    }

    if (!isAdmin) {
        return <AccessDeniedScreen />;
    }

    return (
        <AdminReviewIdentityScreen />
    );
};