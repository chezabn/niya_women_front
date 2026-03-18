// src/sections/user/ProfileSection.tsx
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import type {UpdateProfilePayload, UserProfile} from "../../types/user.ts";
import {Button} from "../../composants/ui/Button.tsx";
import {Input} from "../../composants/ui/Input.tsx";

export const ProfileSection = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // État local pour le formulaire d'édition
    const [formData, setFormData] = useState<UpdateProfilePayload>({});

    // 1. Charger les données au montage
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setUser(data);
                setFormData({
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                });
            } catch (err) {
                setError("Impossible de charger le profil.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // 2. Gérer la saisie
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Sauvegarder (PATCH)
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const updatedUser = await userService.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
            alert("Profil mis à jour avec succès ! 🌸");
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour.");
        } finally {
            setIsSaving(false);
        }
    };

    // 4. Supprimer le compte
    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûre de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            return;
        }

        try {
            await userService.deleteProfile();
            alert("Compte supprimé. À bientôt.");
            // Ici, il faudrait déconnecter l'utilisateur et rediriger vers /login ou /
            window.location.href = "/";
        } catch (err) {
            setError("Impossible de supprimer le compte.");
        }
    };

    if (isLoading) return <div className="text-center py-10">Chargement de votre profil...</div>;
    if (!user) return <div className="text-center py-10 text-red-500">{error || "Utilisateur non trouvé"}</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full border border-pink-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Mon Profil</h2>
                {!isEditing && (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="w-auto px-6"
                    >
                        Modifier
                    </Button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Username (Souvent non modifiable, affiché simplement) */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nom d'utilisateur</label>
                    <div className="text-lg font-semibold text-gray-800">@{user.username}</div>
                </div>

                {/* Champs modifiables */}
                <Input
                    label="Prénom"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50 border-transparent' : ''}
                />

                <Input
                    label="Nom"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50 border-transparent' : ''}
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50 border-transparent' : ''}
                />
            </div>

            {/* Actions Footer */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t">
                {isEditing ? (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsEditing(false);
                                // Reset form data to original user data
                                setFormData({
                                    email: user.email,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                });
                                setError(null);
                            }}
                            className="flex-1 sm:flex-none"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            isLoading={isSaving}
                            className="flex-1 sm:flex-none"
                        >
                            Enregistrer
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 italic">
                        Vos informations sont à jour.
                    </div>
                )}

                {/* Bouton Supprimer (Toujours visible mais discret) */}
                <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                    Supprimer mon compte
                </Button>
            </div>
        </div>
    );
};