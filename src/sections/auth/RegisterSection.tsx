import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import type {RegisterPayload} from "../../types/user.ts";
import {Input} from "../../composants/ui/Input.tsx";
import { Button } from "../../composants/ui/Button.tsx";

export const RegisterSection = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterPayload>({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterPayload, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // <--- État pour le succès

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegisterPayload]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        if (globalError) setGlobalError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);
        setSuccessMessage(null);

        // Validation simple
        const newErrors: Partial<Record<keyof RegisterPayload, string>> = {};
        if (!formData.username) newErrors.username = "Le nom d'utilisateur est requis";
        if (!formData.email.includes('@')) newErrors.email = "Email invalide";
        if (formData.password.length < 8) newErrors.password = "Min 8 caractères";
        if (formData.password !== formData.password2) newErrors.password2 = "Les mots de passe ne correspondent pas";
        if (!formData.first_name) newErrors.first_name = "Prénom requis";
        if (!formData.last_name) newErrors.last_name = "Nom requis";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await authService.register(formData);

            // ✅ SUCCÈS : Message visuel + Redirection douce
            setSuccessMessage("Compte créé avec succès ! Redirection en cours...");

            // Petite pause pour laisser l'utilisateur lire le message (optionnel)
            setTimeout(() => {
                navigate('/profile');
            }, 1500);

        } catch (err: any) {
            console.error("Erreur inscription:", err);

            // Gestion des erreurs spécifiques de Django
            if (err.email) {
                setErrors(prev => ({ ...prev, email: Array.isArray(err.email) ? err.email[0] : err.email }));
            } else if (err.username) {
                setErrors(prev => ({ ...prev, username: Array.isArray(err.username) ? err.username[0] : err.username }));
            } else if (err.message) {
                setGlobalError(err.message);
            } else {
                setGlobalError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-pink-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Rejoignez Niyya 🌸</h2>
                <p className="text-gray-500 mt-2">Créez votre espace unique.</p>
            </div>

            {/* Message de Succès (Vert) */}
            {successMessage && (
                <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center font-medium animate-pulse">
                    ✨ {successMessage}
                </div>
            )}

            {/* Message d'Erreur Globale (Rouge) */}
            {globalError && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    ⚠️ {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Prénom"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                        placeholder="Ex: Sarah"
                    />
                    <Input
                        label="Nom"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                        placeholder="Ex: Connor"
                    />
                </div>

                <Input
                    label="Nom d'utilisateur"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="@sarah_dev"
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="sarah@exemple.com"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="••••••••"
                    />
                    <Input
                        label="Confirmation"
                        name="password2"
                        type="password"
                        value={formData.password2}
                        onChange={handleChange}
                        error={errors.password2}
                        placeholder="••••••••"
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" isLoading={isLoading}>
                        Créer mon compte
                    </Button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Déjà membre ?{' '}
                <a href="/login" className="text-pink-600 font-semibold hover:underline">
                    Se connecter
                </a>
            </p>
        </div>
    );
};

export default RegisterSection