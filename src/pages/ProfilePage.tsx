// src/pages/ProfilePage.tsx
import { ProfileSection } from '../sections/user/ProfileSection';

export const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* En-tête de page optionnel */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-pink-900">Espace Membre</h1>
                    <p className="text-gray-600">Gérez vos informations personnelles en toute sécurité.</p>
                </div>

                <ProfileSection />

                {/* Lien retour pratique */}
                <div className="mt-8 text-center">
                    <a href="/" className="text-pink-600 hover:underline text-sm">
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
};