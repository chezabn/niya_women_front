// src/components/auth/ForgotPasswordModal.tsx
import {useState} from 'react';
import {authService} from '../../services/auth.service';
import {Input} from '../ui/Input';
import {Button} from '../ui/Button';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (email: string) => void; // Callback pour rediriger vers la page de reset
}

export const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        if (!email.includes('@')) {
            setError("Veuillez entrer une adresse email valide.");
            setIsLoading(false);
            return;
        }

        try {
            await authService.requestPasswordReset({ email });
            setSuccessMsg("Si cet email est enregistré chez nous, vous recevrez un code sous peu.");

            // Petite pause pour lire le message avant de rediriger
            setTimeout(() => {
                onSuccess(email);
            }, 2000);
        } catch (err: any) {
            // Pour la sécurité, on affiche souvent un message générique même si l'email n'existe pas
            // Mais ici on affiche l'erreur technique si c'est un format invalide
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Mot de passe oublié ?</h3>
                    <p className="text-gray-500 text-sm mt-2">Entrez votre email pour recevoir un code de réinitialisation.</p>
                </div>

                {successMsg ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center animate-pulse">
                        ✅ {successMsg}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

                        <Input
                            label="Adresse Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemple@email.com"
                            error={error ? " " : undefined} // Astuce pour garder le style rouge si besoin
                        />

                        <div className="mt-6">
                            <Button type="submit" isLoading={isLoading}>
                                Envoyer le code
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};