// src/sections/user/ProfileSection.tsx
import { useState, useEffect, useRef } from 'react'; // Ajout de useRef
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { getCurrentUserId } from '../../lib/auth.utils';
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
const CheckCircleIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ClockIcon = () => (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const XIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

interface ProfileSectionProps {
    userId?: number;
}

const ProfileSection = ({ userId }: ProfileSectionProps) => {
    const navigate = useNavigate();
    const myId = getCurrentUserId();
    const isOwner = userId === undefined || userId === myId;
    const targetUserId = userId || myId;

    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateProfilePayload>({});

    // --- États pour la vérification Email ---
    const [isVerifying, setIsVerifying] = useState(false); // Modal ouverte/fermée
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'success' | 'error'>('idle');
    const [verifyMessage, setVerifyMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes en secondes
    const timerRef = useRef<number | null>(null);

    // Chargement du profil
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
                    data = await userService.getProfile();
                } else {
                    data = await userService.getUserById(targetUserId);
                }
                if (!data) throw new Error("Données introuvables");
                setUser(data);
                setFormData({ email: data.email, first_name: data.first_name, last_name: data.last_name, bio: data.bio });
            } catch (err) {
                setError(isOwner ? "Impossible de charger votre profil." : "Profil introuvable.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [targetUserId, isOwner]);

    // Gestion du Chronomètre
    useEffect(() => {
        if (isVerifying && verifyStatus === 'sent' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && verifyStatus === 'sent') {
            setVerifyStatus('idle'); // Temps écoulé, on reset
            setVerifyMessage("Le code a expiré. Veuillez en demander un nouveau.");
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isVerifying, verifyStatus, timeLeft]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (successMsg) setSuccessMsg(null);
    };

    // --- Fonctions de Vérification Email ---

    const handleSendVerificationCode = async () => {
        setVerifyStatus('sending');
        try {
            await userService.postSendVerificationEmail();
            setVerifyStatus('sent');
            setVerifyMessage("Un code à 6 chiffres a été envoyé à votre adresse email.");
            setTimeLeft(15 * 60); // Reset timer
        } catch (err: any) {
            setVerifyStatus('error');
            setVerifyMessage(err.message || "Erreur lors de l'envoi du code.");
        }
    };

    const handleVerifyCode = async () => {
        if (verificationCode.length !== 6) {
            setVerifyMessage("Le code doit contenir 6 chiffres.");
            return;
        }
        setVerifyStatus('verifying');
        try {
            await userService.postVerifyEmail({ code: verificationCode});
            setVerifyStatus('success');
            setVerifyMessage("Email vérifié avec succès ! ✨");

            // Mettre à jour l'état local de l'utilisateur pour afficher le badge immédiatement
            if (user) setUser({ ...user, email_verified: true });

            // Fermer la modal après 2 secondes
            setTimeout(() => {
                setIsVerifying(false);
                setVerifyStatus('idle');
                setVerificationCode('');
            }, 2000);
        } catch (err: any) {
            setVerifyStatus('error');
            setVerifyMessage(err.message || "Code incorrect. Veuillez réessayer.");
        }
    };

    const openVerificationModal = () => {
        setIsVerifying(true);
        setVerifyStatus('idle');
        setVerificationCode('');
        setVerifyMessage('');
        setTimeLeft(15 * 60);
        handleSendVerificationCode(); // Envoi automatique à l'ouverture
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSave = async () => {
        if (!isOwner) return;
        setIsSaving(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const updatedUser = await userService.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
            setSuccessMsg("Informations mises à jour ! ✨");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la sauvegarde.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner) return;
        if (!window.confirm("⚠️ Attention : Action irréversible. Confirmer ?")) return;
        try {
            await userService.deleteProfile();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/');
        } catch (err) {
            setError("Impossible de supprimer le compte.");
        }
    };

    const getInitials = (first: string, last: string) => {
        if (!first && !last) return "U";
        return `${(first?.[0] || '')}${(last?.[0] || '')}`.toUpperCase();
    };

    if (isLoading) return <div className="flex flex-col items-center justify-center py-20"><div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div><p className="text-gray-500">Chargement...</p></div>;
    if (!user) return <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl">{error}</div>;

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100 relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-32 w-full relative">
                <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full shadow-md">
                    <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-3xl font-bold border-2 border-white">
                        {getInitials(user.first_name, user.last_name)}
                    </div>
                </div>
            </div>

            <div className="pt-16 px-8 pb-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{isOwner ? "Mon Profil" : `${user.first_name} ${user.last_name}`}</h2>
                        <p className="text-gray-500 text-sm mt-1">{isOwner ? "Gérez vos informations personnelles" : "Membre de la communauté Niyya"}</p>
                    </div>
                    {isOwner && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium text-sm">
                            <EditIcon /> Modifier
                        </button>
                    )}
                </div>

                {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center"><span className="mr-2">✅</span> {successMsg}</div>}
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center"><span className="mr-2">⚠️</span> {error}</div>}

                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nom d'utilisateur</label>
                        <div className="flex items-center text-lg font-medium text-gray-800"><span className="text-pink-500 mr-2">@</span> {user.username}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Prénom" name="first_name" value={formData.first_name || ''} onChange={handleChange} disabled={!isEditing} className={`transition-all ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`} />
                        <Input label="Nom" name="last_name" value={formData.last_name || ''} onChange={handleChange} disabled={!isEditing} className={`transition-all ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`} />
                    </div>

                    {formData.bio !== undefined && (
                        <Input label="Bio" name="bio" value={formData.bio || ''} onChange={handleChange} disabled={!isEditing} className={`transition-all ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`} />
                    )}

                    {/* Section Email avec Badge et Bouton */}
                    <div className="relative">
                        <Input
                            label="Adresse Email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`pl-10 transition-all ${!isEditing ? 'bg-gray-50 border-transparent text-gray-600' : 'bg-white'}`}
                        />
                        <div className="absolute left-3 top-9"><MailIcon /></div>

                        {/* Badge et Action (Seulement si propriétaire) */}
                        {isOwner && (
                            <div className="mt-2 flex items-center justify-between">
                                {user.email_verified ? (
                                    <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                                        <CheckCircleIcon />
                                        <span className="ml-1">Email vérifié</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={openVerificationModal}
                                        className="text-sm text-pink-600 font-medium hover:text-pink-800 hover:underline flex items-center"
                                    >
                                        🔒 Vérifier mon adresse email
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                    {isEditing ? (
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="secondary" onClick={() => { setIsEditing(false); if(user) setFormData({ email: user.email, first_name: user.first_name, last_name: user.last_name, bio: user.bio }); setError(null); setSuccessMsg(null); }} className="flex-1 md:flex-none px-6">Annuler</Button>
                            <Button onClick={handleSave} isLoading={isSaving} className="flex-1 md:flex-none px-6 bg-gradient-to-r from-pink-600 to-rose-500 border-none">Enregistrer</Button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400 italic flex items-center">
                            {isOwner ? (<><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Vos informations sont à jour</>) : (<span className="text-pink-500 font-medium">Profil public</span>)}
                        </div>
                    )}
                    {isOwner && <button onClick={handleDelete} className="text-sm text-red-400 hover:text-red-600 hover:underline transition-colors px-4 py-2">Supprimer mon compte</button>}
                </div>
            </div>

            {/* --- MODAL DE VÉRIFICATION EMAIL --- */}
            {isVerifying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative transform transition-all scale-100">
                        {/* Bouton Fermer */}
                        <button onClick={() => setIsVerifying(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <XIcon />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MailIcon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Vérification de l'email</h3>
                            <p className="text-gray-500 text-sm mt-1">Entrez le code à 6 chiffres reçu par email.</p>
                        </div>

                        {/* Messages d'état */}
                        {verifyMessage && (
                            <div className={`mb-4 p-3 rounded-lg text-sm text-center ${verifyStatus === 'error' ? 'bg-red-50 text-red-600' : verifyStatus === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                {verifyMessage}
                            </div>
                        )}

                        {/* Chronomètre */}
                        {verifyStatus === 'sent' && timeLeft > 0 && (
                            <div className="flex items-center justify-center text-gray-600 text-sm font-mono bg-gray-100 py-2 rounded-lg mb-4">
                                <ClockIcon />
                                Expire dans : {formatTime(timeLeft)}
                            </div>
                        )}

                        {/* Input Code */}
                        {verifyStatus !== 'success' && (
                            <>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    disabled={verifyStatus === 'sending' || verifyStatus === 'verifying'}
                                    className="w-full text-center text-2xl tracking-[0.5em] font-bold border-2 border-pink-200 rounded-xl py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:bg-gray-100"
                                />

                                <div className="mt-6 flex gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsVerifying(false)}
                                        className="flex-1"
                                        disabled={verifyStatus === 'sending' || verifyStatus === 'verifying'}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        onClick={handleVerifyCode}
                                        isLoading={verifyStatus === 'verifying'}
                                        disabled={verificationCode.length !== 6 || verifyStatus === 'sending'}
                                        className="flex-1 bg-gradient-to-r from-pink-600 to-rose-500 border-none"
                                    >
                                        Valider
                                    </Button>
                                </div>

                                {verifyStatus === 'error' && timeLeft <= 0 && (
                                    <button onClick={handleSendVerificationCode} className="w-full mt-3 text-sm text-pink-600 hover:underline">
                                        Renvoyer le code
                                    </button>
                                )}
                            </>
                        )}

                        {/* Succès */}
                        {verifyStatus === 'success' && (
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircleIcon />
                                </div>
                                <p className="text-green-600 font-bold">Validé !</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProfileSection