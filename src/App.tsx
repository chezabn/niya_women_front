import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import {Navbar} from "./components/layout/Navbar.tsx";
import {AllUsersPage} from "./pages/AllUsersPage.tsx";
import {UserDetailPage} from "./pages/UserDetailPage.tsx";
import {ResetPasswordPage} from "./pages/ResetPasswordPage.tsx";
import {CompaniesPage} from "./pages/CompaniesPage.tsx";

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
                <Navbar />

                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {/* Route pour tout ce qui concerne le service USER */}
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />

                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/all-users" element={<AllUsersPage />} />
                        <Route path="/users/:id" element={<UserDetailPage />} />

                        <Route path="/companies" element={<CompaniesPage />} />

                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;