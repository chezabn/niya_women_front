// src/pages/ProfilePage.tsx
import { Navigate } from 'react-router-dom';
import { ProfileSection } from '../sections/user/ProfileSection';

export const ProfilePage = () => {
    const token = localStorage.getItem('access_token');

    // Si pas de token, on renvoie vers l'accueil (ou /login)
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <ProfileSection />
            </div>
        </div>
    );
};