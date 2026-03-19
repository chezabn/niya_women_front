// src/sections/user/ProfileSection.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { getCurrentUserId } from '../../lib/auth.utils'; // Pour vérifier qui est-ce
import type { UpdateProfilePayload, UserProfile } from "../../types/user";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

// --- Icônes ---
const MailIcon = () => (
    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const EditIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
);

// --- Props du composant ---
interface ProfileSectionProps {
    userId?: number; // Si fourni, on affiche le profil de cet ID. Si undefined, c'est mon profil.
}

export const ProfileSection = ({ userId }: ProfileSectionProps) => {
    const navigate = useNavigate();
    const myId = getCurrentUserId();

    // Déterminer si l'utilisatrice actuelle est propriétaire du profil affiché
    const isOwner = userId === undefined || userId === myId;
    const targetUserId = userId || myId; // L'ID à charger (le mien ou celui passé en prop)

    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState<UpdateProfilePayload>({});

    useEffect(() => {
        const fetchProfile = async () => {
            if (!targetUserId) {
                setError("ID utilisateur manquant.");
                setIsLoading(false);
                return;
            }

            try {
                let data: UserProfile | null;

                if (isOwner) {
                    // Si c'est moi, j'utilise l'endpoint sécurisé de mon profil
                    data = await userService.getProfile();
                } else {
                    data = await userService.getUserById(targetUserId);
                }

                setUser(data);
                setFormData({
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    bio: data.bio,
                });
            } catch (err) {
                setError(isOwner
                    ? "Impossible de charger votre profil. Êtes-vous connectée ?"
                    : "Profil introuvable.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [targetUserId, isOwner]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (successMsg) setSuccessMsg(null);
    };

    const handleSave = async () => {
        if (!isOwner) return; // Sécurité supplémentaire

        setIsSaving(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const updatedUser = await userService.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
            setSuccessMsg("Vos informations ont été mises à jour avec succès ! ✨");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner) return;
        if (!window.confirm("⚠️ Attention : Cette action est irréversible. Êtes-vous sûre de vouloir supprimer votre compte ?")) {
            return;
        }
        try {
            await userService.deleteProfile();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/');
        } catch (err) {
            setError("Impossible de supprimer le compte pour le moment.");
        }
    };

    const getInitials = (first: string, last: string) => {
        if (!first && !last) return "U";
        return `${(first?.[0] || '')}${(last?.[0] || '')}`.toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Chargement du profil...</p>
            </div>
        );
    }

    if (!user) return <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl">{error}</div>;

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
            {/* --- En-tête Décoratif --- */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-32 w-full relative">
                <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full shadow-md">
                    <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-3xl font-bold border-2 border-white">
                        {getInitials(user.first_name, user.last_name)}
                    </div>
                </div>
            </div>

            <div className="pt-16 px-8 pb-8">
                {/* Titre et Action */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isOwner ? "Mon Profil" : `${user.first_name} ${user.last_name}`}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isOwner ? "Gérez vos informations personnelles" : "Membre de la communauté Niyya"}
                        </p>
                    </div>

                    {/* Le bouton Modifier n'apparaît QUE si c'est le propriétaire */}
                    {isOwner && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium text-sm"
                        >
                            <EditIcon />
                            Modifier
                        </button>
                    )}
                </div>

                {/* Messages Feedback */}
                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center animate-fade-in">
                        <span className="mr-2">✅</span> {successMsg}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {/* Grille du Formulaire */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Nom d'utilisateur
                        </label>
                        <div className="flex items-center text-lg font-medium text-gray-800">
                            <span className="text-pink-500 mr-2">@</span> {user.username}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Prénom"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleChange}
                            disabled={!isEditing} // Désactivé si pas en mode édition
                            className={`transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`}
                        />
                        <Input
                            label="Nom"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`}
                        />
                    </div>

                    {/* Champ Bio (si tu l'as ajouté au type) */}
                    {formData.bio !== undefined && (
                        <Input
                            label="Bio"
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`}
                        />
                    )}

                    <div className="relative">
                        <Input
                            label="Adresse Email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            disabled={!isEditing} // Toujours désactivé pour les autres, et pour soi sauf en édition
                            className={`pl-10 transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`}
                        />
                        <div className="absolute left-3 top-9">
                            <MailIcon />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                    {isEditing ? (
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    if (user) {
                                        setFormData({ email: user.email, first_name: user.first_name, last_name: user.last_name, bio: user.bio });
                                    }
                                    setError(null);
                                    setSuccessMsg(null);
                                }}
                                className="flex-1 md:flex-none px-6"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleSave}
                                isLoading={isSaving}
                                className="flex-1 md:flex-none px-6 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 border-none"
                            >
                                Enregistrer les modifications
                            </Button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400 italic flex items-center">
                            {isOwner ? (
                                <>
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                    Vos informations sont à jour
                                </>
                            ) : (
                                <span className="text-pink-500 font-medium">Profil public</span>
                            )}
                        </div>
                    )}

                    {/* Le bouton Supprimer n'apparaît QUE si c'est le propriétaire */}
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="text-sm text-red-400 hover:text-red-600 hover:underline transition-colors px-4 py-2"
                        >
                            Supprimer mon compte
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};