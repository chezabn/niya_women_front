// src/pages/LoginPage.tsx
import { LoginSection } from '../sections/auth/LoginSection';

export const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Partie Gauche : Message (Optionnel, caché sur mobile) */}
                <div className="hidden md:block text-center md:text-left p-6">
                    <h1 className="text-4xl font-extrabold text-pink-900 mb-4">
                        Heureuse de vous revoir.
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Retrouvez votre communauté, vos publications et vos inspirations en un clic.
                    </p>
                    <div className="mt-8 flex justify-center md:justify-start space-x-2">
                        <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                        <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                    </div>
                </div>

                {/* Partie Droite : Formulaire */}
                <div className="flex justify-center">
                    <LoginSection />
                </div>

            </div>
        </div>
    );
};