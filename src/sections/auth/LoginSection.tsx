// src/sections/auth/LoginSection.tsx
import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Input} from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import {authService} from '../../services/auth.service';
import type {LoginPayload} from "../../types/user.ts";

interface LoginSectionProps {
    onForgotPassword?: () => void
}

export const LoginSection = ({onForgotPassword}: LoginSectionProps) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginPayload>({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LoginPayload, string>>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        // Nettoyer les erreurs quand l'utilisateur tape
        if (errors[name as keyof LoginPayload]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
        if (globalError) setGlobalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        // Validation simple
        const newErrors: Partial<Record<keyof LoginPayload, string>> = {};
        if (!formData.username) newErrors.username = "Le nom d'utilisateur est requis";
        if (!formData.password) newErrors.password = "Le mot de passe est requis";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            // ✅ APPEL AU BACKEND
            const responseData = await authService.login(formData);

            // ✅ SAUVEGARDE DES TOKENS
            if (responseData.access && responseData.refresh) {
                localStorage.setItem('access_token', responseData.access);
                localStorage.setItem('refresh_token', responseData.refresh);

                console.log("Connexion réussie ! Tokens sauvegardés.");

                // Redirection vers le profil ou la page précédente
                navigate('/profile');
            } else {
                throw new Error("Réponse invalide du serveur (tokens manquants)");
            }

        } catch (err: any) {
            console.error("Erreur connexion:", err);

            // Gestion des erreurs spécifiques (ex: "Invalid credentials")
            if (err.detail) {
                // Erreur globale venant souvent de Django DRF/SimpleJWT
                setGlobalError(err.detail);
            } else if (err.username) {
                setErrors(prev => ({...prev, username: Array.isArray(err.username) ? err.username[0] : err.username}));
            } else if (err.password) {
                setErrors(prev => ({...prev, password: Array.isArray(err.password) ? err.password[0] : err.password}));
            } else {
                setGlobalError(err.message || "Échec de la connexion. Vérifiez vos identifiants.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-pink-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Bon retour parmi vous 🌸</h2>
                <p className="text-gray-500 mt-2">Connectez-vous pour accéder à votre espace.</p>
            </div>

            {globalError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center animate-fade-in">
                    <span className="mr-2">⚠️</span> {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Nom d'utilisateur"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="@votre_pseudo"
                    autoComplete="username"
                />

                <Input
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                    autoComplete="current-password"
                />

                <div className="pt-2">
                    <Button type="submit" isLoading={isLoading}>
                        Se connecter
                    </Button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-pink-600 font-semibold hover:underline hover:text-pink-700">
                        Créer un compte
                    </Link>
                </p>
                <div className="mt-4 text-center">
                    <button
                        onClick={onForgotPassword}
                        className="text-xs text-pink-600 hover:underline font-medium"
                    >
                        Mot de passe oublié ?
                    </button>
                </div>
            </div>
        </div>
    );
};