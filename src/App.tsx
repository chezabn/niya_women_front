import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage'; // <--- Import ajouté

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Accueil */}
                <Route path="/" element={
                    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
                        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-8 text-center px-4">
                            Niyya Women Network 🌸
                        </h1>
                        <div className="flex gap-4">
                            <Link to="/register" className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                                Inscription
                            </Link>
                            {/* Lien direct vers le profil pour tester (à protéger plus tard par un Login) */}
                            <Link to="/profile" className="px-6 py-3 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50">
                                Mon Profil
                            </Link>
                        </div>
                    </div>
                } />

                {/* Inscription */}
                <Route path="/register" element={<RegisterPage />} />

                {/* Profil (Nouvelle Route) */}
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;