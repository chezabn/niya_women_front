// src/pages/UserDetailPage.tsx
import { useParams, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import type { UserProfile } from '../types/user';

// On réutilise les icônes et le style visuel de ProfileSection
const MailIcon = () => (
    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        // Note: Tu devras peut-être ajouter une méthode getUserById dans ton service
        // ou filtrer depuis getAllUsers si tu n'as pas d'endpoint dédié.
        // Pour l'exemple, supposons que tu ajoutes getUserById(id) dans userService.
        // Si tu n'as pas l'endpoint, on peut simuler en filtrant une liste locale ou en adaptant le service.

        const fetchUser = async () => {
            try {
                // TODO: Implémenter userService.getUserById(id) dans ton service si ce n'est pas fait
                // const data = await userService.getUserById(Number(id));

                // SOLUTION TEMPORAIRE SI PAS D'ENDPOINT DÉDIÉ :
                // On récupère tout et on filtre (pas optimal pour la prod mais marche pour débugger)
                const allUsers = await userService.getAllUsers();
                const found = allUsers.find(u => u.id === Number(id));

                if (!found) throw new Error("Utilisatrice non trouvée");
                setUser(found);
            } catch (err) {
                setError("Profil introuvable ou erreur de chargement.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    if (!token) return <Navigate to="/login" replace />;
    if (isLoading) return <div className="py-20 text-center">Chargement du profil...</div>;
    if (error || !user) return <div className="py-20 text-center text-red-500">{error}</div>;

    const getInitials = (first: string, last: string) => {
        if (!first && !last) return "U";
        return `${(first?.[0] || '')}${(last?.[0] || '')}`.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Bouton Retour */}
                <Link to="/all-users" className="inline-flex items-center text-pink-600 hover:underline mb-6 font-medium">
                    ← Retour à la communauté
                </Link>

                {/* Carte Profil (Version Lecture Seule inspirée de ProfileSection) */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-32 w-full relative">
                        <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full shadow-md">
                            <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-3xl font-bold border-2 border-white">
                                {getInitials(user.first_name, user.last_name)}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">@{user.username}</p>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nom d'utilisateur</label>
                                <div className="flex items-center text-lg font-medium text-gray-800">
                                    <span className="text-pink-500 mr-2">@</span> {user.username}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Prénom</label>
                                    <div className="text-gray-700 font-medium">{user.first_name || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nom</label>
                                    <div className="text-gray-700 font-medium">{user.last_name || '-'}</div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5">
                                    <div className="absolute left-3 top-3"><MailIcon /></div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email (privé)</label>
                                    <div className="text-gray-700 font-medium">Visible uniquement par vous-même sur votre propre profil.</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-400 italic">Vous consultez le profil public de cette membre.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};