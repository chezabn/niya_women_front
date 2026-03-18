// src/sections/auth/RegisterSection.tsx
import { useState } from 'react';
import type {RegisterPayload} from "../../types/user.ts";
import {Input} from "../../composants/ui/Input.tsx";
import {Button} from "../../composants/ui/Button.tsx";

// Simulation de l'appel API (à remplacer par ton vrai service plus tard)
const registerUser = async (data: RegisterPayload) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
    console.log("Données envoyées au backend :", data);
    // Ici : return await api.post('/register', data);
    return { success: true };
};

const RegisterSection = () => {
    // État lié directement à notre DTO
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof RegisterPayload]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        // Validation simple côté front
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
            await registerUser(formData);
            alert("Inscription réussie ! (Voir console)");
            // Redirection ou reset du formulaire ici
        } catch (err) {
            setGlobalError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-pink-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Rejoignez Niyya 🌸</h2>
                <p className="text-gray-500 mt-2">Créez votre espace unique en quelques instants.</p>
            </div>

            {globalError && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Identité */}
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