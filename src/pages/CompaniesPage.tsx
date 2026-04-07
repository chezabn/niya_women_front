// src/pages/CompaniesPage.tsx
import { Navigate, useLocation, Link } from 'react-router-dom'; // Ajout de Link et useLocation
import { CompaniesSection } from '../sections/company/CompaniesSection';
import { useState, useEffect } from 'react';

export const CompaniesPage = () => {
    const token = localStorage.getItem('access_token');
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Afficher le message de succès venant de la page de création
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            // Nettoyer le state pour ne pas réafficher le message si on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* En-tête de page avec Bouton d'action */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
                            Nos Entreprises Partenaires 🚀
                        </h1>
                        <p className="text-gray-600 max-w-xl">
                            Découvrez les sociétés fondées par les membres de notre communauté.
                        </p>
                    </div>

                    {/* Bouton Créer */}
                    <Link
                        to="/companies/create"
                        className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Créer ma page entreprise
                    </Link>
                </div>

                {/* Message de succès */}
                {successMessage && (
                    <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl flex items-center justify-center animate-fade-in">
                        <span className="mr-2 text-xl">✨</span> {successMessage}
                    </div>
                )}

                {/* Section avec recherche et grille */}
                <CompaniesSection />

            </div>
        </div>
    );
};