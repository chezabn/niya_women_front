// src/components/layout/Navbar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Vérifie si l'utilisatrice est connectée
    const isAuthenticated = !!localStorage.getItem('access_token');

    const handleLogout = () => {
        // 1. Vider le stockage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // 2. Rediriger vers l'accueil
        navigate('/');

        // Optionnel : Recharger la page pour reset complet des états globaux
        // window.location.reload();
    };

    // On cache la navbar sur la page d'accueil si tu veux un effet "Landing Page" pure
    // Sinon, retire cette condition pour l'afficher partout.
    if (location.pathname === '/') return null;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🌸</span>
                        <span className="font-bold text-xl text-gray-800 group-hover:text-pink-600 transition-colors">
                          Niyya Women
                        </span>
                    </Link>

                    {/* Liens de navigation */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/all-users"
                                    className="text-gray-600 hover:text-pink-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-pink-50"
                                >
                                    Amies
                                </Link>
                                <Link
                                    to="/companies"
                                    className="text-gray-600 hover:text-pink-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-pink-50"
                                >
                                    Entreprises
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-gray-600 hover:text-pink-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-pink-50"
                                >
                                    Mon Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Se déconnecter
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-pink-600 font-medium transition-colors px-3 py-2"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-pink-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Rejoindre
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};