// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import {Navbar} from "./composants/layout/Navbar.tsx";

// Composant simple pour la page d'accueil
const HomePage = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-6 text-center drop-shadow-sm">
            Niyya Women Network 🌸
        </h1>
        <p className="text-xl text-gray-600 mb-10 text-center max-w-2xl leading-relaxed">
            Le réseau social bienveillant dédié aux femmes. <br/>
            Partagez, inspirez et connectez-vous dans un espace sûr et élégant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
            <a href="/register" className="px-8 py-4 bg-pink-600 text-white text-lg font-bold rounded-full shadow-xl hover:bg-pink-700 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Commencer l'aventure
            </a>
            <a href="/login" className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-100 text-lg font-bold rounded-full shadow-md hover:border-pink-300 hover:bg-pink-50 transition-all">
                Déjà membre ?
            </a>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 font-sans">
                {/* La Navbar s'affiche ici */}
                <Navbar />

                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        {/* Tu ajouteras /login ici plus tard */}
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;