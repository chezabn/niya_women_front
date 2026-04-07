// src/pages/CompaniesPage.tsx
import { Navigate, useLocation, Link } from 'react-router-dom';
import { CompaniesSection } from '../sections/company/CompaniesSection';
import { useState, useEffect } from 'react';
import { companyService } from '../services/company.service';

export const CompaniesPage = () => {
    const token = localStorage.getItem('access_token');
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [myCompany, setMyCompany] = useState<number | null>(null); // Stocke juste l'ID de ma boite
    const [isLoadingCheck, setIsLoadingCheck] = useState(true);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        // 1. Gestion du message de succès
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            window.history.replaceState({}, document.title);
        }

        // 2. Vérifier si j'ai déjà une entreprise
        const checkMyCompany = async () => {
            try {
                const company = await companyService.getMyCompany();
                if (company) {
                    setMyCompany(company.id);
                }
            } catch (err) {
                console.log("Utilisateur sans entreprise ou erreur de vérification");
            } finally {
                setIsLoadingCheck(false);
            }
        };

        checkMyCompany();
    }, [location]);

    // Détermination du lien et du texte du bouton
    const actionButton = myCompany ? (
        <Link
            to={`/companies/${myCompany}`}
            className="whitespace-nowrap px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-full shadow-md hover:bg-purple-50 transition-all transform flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Voir mon entreprise
        </Link>
    ) : (
        <Link
            to="/companies/create"
            className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer ma page entreprise
        </Link>
    );

    if (isLoadingCheck) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* En-tête de page avec Bouton dynamique */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
                            Nos Entreprises Partenaires 🚀
                        </h1>
                        <p className="text-gray-600 max-w-xl">
                            Découvrez les sociétés fondées par les membres de notre communauté.
                        </p>
                    </div>

                    {actionButton}
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