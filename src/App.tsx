import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage'; // Assure-toi que le chemin est correct

function App() {
    return (
        // Le BrowserRouter doit envelopper toute l'application pour que le routing fonctionne
        <BrowserRouter>
            <Routes>
                {/* Route 1 : La page d'accueil */}
                <Route path="/" element={
                    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
                        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-8 text-center px-4">
                            Niyya Women Network 🌸
                        </h1>

                        <p className="text-gray-600 mb-8 text-lg text-center max-w-md">
                            Le réseau social bienveillant dédié aux femmes.
                        </p>

                        {/* Le composant Link remplace la balise <a> pour ne pas recharger la page */}
                        <Link
                            to="/register"
                            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white transition-all duration-200 bg-pink-600 rounded-full hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-lg hover:shadow-xl"
                        >
                            Rejoindre l'aventure
                            {/* Petite flèche décorative qui bouge au survol */}
                            <svg
                                className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </Link>
                    </div>
                } />

                {/* Route 2 : La page d'inscription */}
                <Route path="/register" element={<RegisterPage />} />

                {/* Tu pourras ajouter d'autres routes ici plus tard (ex: /login, /profile) */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;