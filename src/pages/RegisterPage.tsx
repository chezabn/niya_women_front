// src/pages/RegisterPage.tsx
import RegisterSection from '../sections/auth/RegisterSection';

export const RegisterPage = () => {
    return (
        // Fond doux avec un motif subtil ou un dégradé
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">

            {/* Conteneur optionnel pour ajouter un logo ou une illustration à côté sur grand écran */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                <div className="hidden md:block text-center md:text-left p-6">
                    <h1 className="text-4xl font-extrabold text-pink-900 mb-4">
                        Bien plus qu'un réseau social.
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Rejoignez une communauté bienveillante dédiée aux femmes.
                        Partagez, inspirez et connectez-vous dans un espace sûr.
                    </p>
                    <div className="mt-8 flex justify-center md:justify-start space-x-2">
                        {/* Petits cercles décoratifs */}
                        <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                        <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                    </div>
                </div>

                {/* Partie Droite : Notre Section d'inscription */}
                <div className="flex justify-center">
                    <RegisterSection />
                </div>

            </div>
        </div>
    );
};