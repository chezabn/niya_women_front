// src/pages/ResetPasswordPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { PasswordResetConfirmPayload } from '../types/user';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const emailFromState = (location.state as any)?.email || '';

    const [formData, setFormData] = useState<PasswordResetConfirmPayload>({
        email: emailFromState,
        code: '',
        new_password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<Partial<Record<keyof PasswordResetConfirmPayload | 'confirm_password', string>>>({});
    const [globalError, setGlobalError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: undefined }));
        if (globalError) setGlobalError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError('');

        // Validations
        const newErrors: any = {};
        if (!formData.email) newErrors.email = "L'email est requis";
        if (!formData.code || formData.code.length !== 6) newErrors.code = "Le code doit faire 6 chiffres";
        if (formData.new_password.length < 8) newErrors.new_password = "Min 8 caractères";
        if (formData.new_password !== confirmPassword) newErrors.confirm_password = "Les mots de passe ne correspondent pas";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await authService.confirmPasswordReset(formData);
            setSuccess(true);
            // Redirection vers login après 3 secondes
            setTimeout(() => {
                navigate('/login', { state: { message: "Mot de passe modifié avec succès ! Connectez-vous." } });
            }, 3000);
        } catch (err: any) {
            setGlobalError(err.message || "Échec de la réinitialisation. Vérifiez le code.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-pink-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Succès ! </h2>
                    <p className="text-gray-600">Votre mot de passe a été modifié.</p>
                    <p className="text-sm text-gray-400 mt-4">Redirection vers la connexion...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-pink-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Nouveau mot de passe 🔒</h2>
                    <p className="text-gray-500 mt-2">Entrez le code reçu et choisissez votre nouveau mot de passe.</p>
                </div>

                {globalError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center">
                        <span className="mr-2">⚠️</span> {globalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!emailFromState && (
                        <Input
                            label="Adresse Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="exemple@email.com"
                        />
                    )}

                    <Input
                        label="Code de vérification"
                        name="code"
                        type="text"
                        value={formData.code}
                        onChange={handleChange}
                        error={errors.code}
                        placeholder="000000"
                        maxLength={6}
                        className="text-center tracking-widest font-mono"
                    />

                    <Input
                        label="Nouveau mot de passe"
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                        error={errors.new_password}
                        placeholder="••••••••"
                    />

                    <Input
                        label="Confirmer le mot de passe"
                        name="confirm_password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirm_password) setErrors(prev => ({ ...prev, confirm_password: undefined }));
                        }}
                        error={errors.confirm_password}
                        placeholder="••••••••"
                    />

                    <div className="pt-4">
                        <Button type="submit" isLoading={isLoading}>
                            Modifier le mot de passe
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-pink-600 hover:underline">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
};