// src/pages/AllUsersPage.tsx
import { Navigate } from 'react-router-dom';
import { AllUsersSection } from '../sections/user/AllUsersSection';

export const AllUsersPage = () => {
    const token = localStorage.getItem('access_token');

    // Protection de la route : uniquement pour les connectées
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* En-tête de page */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-pink-900 mb-2">
                        Notre Communauté 🌸
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Découvrez les profils des autres membres de Niyya. Connectez-vous et échangez dans un environnement bienveillant.
                    </p>
                </div>

                {/* Grille des utilisateurs */}
                <AllUsersSection />

            </div>
        </div>
    );
};