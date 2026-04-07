import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/company.service';
import { getCurrentUserId } from '../../lib/auth.utils'; // Pour vérifier si c'est moi
import type { Company, UpdateCompanyPayload } from '../../types/company';
import {Button} from "../../components/ui/Button.tsx";
import {Input} from "../../components/ui/Input.tsx";

export const CompanyDetailSection = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const myUserId = getCurrentUserId();

    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États pour l'édition
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // État local du formulaire (copie des données de l'entreprise)
    const [formData, setFormData] = useState<UpdateCompanyPayload>({});

    // Vérifier si je suis le propriétaire
    const isOwner = company && myUserId !== null && company.owner_id === myUserId;

    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await companyService.getCompanyById(Number(id));
                setCompany(data);
                setFormData({
                    name: data.name,
                    description: data.description,
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    website: data.website || '',
                    logo: data.logo || ''
                });
            } catch (err) {
                setError("Entreprise introuvable.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSave = async () => {
        if (!isOwner) return;
        setIsSaving(true);
        setError(null);
        try {
            const updatedCompany = await companyService.updateCompany(formData);
            setCompany(updatedCompany);
            setIsEditing(false);
            // Optionnel : Afficher un message de succès temporaire
        } catch (err: any) {
            setError(err.message || "Erreur lors de la sauvegarde.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner) return;
        const confirmMsg = `Êtes-vous sûre de vouloir supprimer "${company?.name}" ?\n\nCette action est irréversible.`;
        if (!window.confirm(confirmMsg)) return;

        setIsDeleting(true);
        try {
            await companyService.deleteCompany();
            // Redirection vers la liste après suppression
            navigate('/companies', { state: { successMessage: "Entreprise supprimée avec succès." } });
        } catch (err: any) {
            setError(err.message || "Impossible de supprimer l'entreprise.");
            setIsDeleting(false);
        }
    };

    const getInitials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Chargement des détails...</p>
            </div>
        );
    }

    if (error && !company) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-purple-100 max-w-2xl mx-auto">
                <p className="text-red-500 text-lg mb-4">⚠️ {error}</p>
                <Link to="/companies">
                    <Button variant="outline" className="w-auto inline-block">Retour à la liste</Button>
                </Link>
            </div>
        );
    }

    if (!company) return null;

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 max-w-4xl mx-auto relative">

            {/* Header avec Logo */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-48 w-full relative">
                <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-lg">
                    <div className="w-32 h-32 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 text-4xl font-bold border-4 border-white overflow-hidden">
                        {formData.logo ? (
                            <img src={formData.logo} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(company.name)
                        )}
                    </div>
                </div>

                {/* Badge Propriétaire (Visible seulement par moi) */}
                {isOwner && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-700 shadow-sm">
                        👑 Votre entreprise
                    </div>
                )}
            </div>

            <div className="pt-20 px-8 pb-8">
                {/* En-tête avec Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        {isEditing ? (
                            <Input
                                label="Nom de l'entreprise"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-3xl font-bold p-1 border-b-2 border-purple-300 rounded-none bg-transparent"
                            />
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">{company.name}</h2>
                                <p className="text-purple-600 font-medium mt-1">Fiche entreprise</p>
                            </>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Link to="/companies">
                            <Button variant="secondary" className="w-auto">← Retour</Button>
                        </Link>

                        {isOwner && !isEditing && (
                            <Button onClick={() => setIsEditing(true)} className="w-auto bg-purple-600 hover:bg-purple-700 border-none">
                                Modifier
                            </Button>
                        )}
                    </div>
                </div>

                {/* Messages d'erreur globaux */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {/* Description (Toujours éditable si mode édition) */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    {isEditing ? (
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        />
                    ) : (
                        <p className="text-lg leading-relaxed text-gray-600 bg-purple-50 p-4 rounded-xl">{company.description}</p>
                    )}
                </div>

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50 p-6 rounded-2xl mb-8">
                    {/* Adresse */}
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📍</span>
                        <div className="flex-grow">
                            <h4 className="font-bold text-gray-700 text-xs uppercase mb-1">Adresse</h4>
                            {isEditing ? (
                                <Input
                                    label="Adresse"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Adresse complète" />
                            ) : (
                                <p className="text-gray-600">{company.address || '-'}</p>
                            )}
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📞</span>
                        <div className="flex-grow">
                            <h4 className="font-bold text-gray-700 text-xs uppercase mb-1">Téléphone</h4>
                            {isEditing ? (
                                <Input
                                    label="Numéro de téléphone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+33..." />
                            ) : (
                                <p className="text-gray-600">{company.phone || '-'}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">✉️</span>
                        <div className="flex-grow">
                            <h4 className="font-bold text-gray-700 text-xs uppercase mb-1">Email</h4>
                            {isEditing ? (
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contact@..." />
                            ) : (
                                <p className="text-gray-600 break-all">{company.email || '-'}</p>
                            )}
                        </div>
                    </div>

                    {/* Site Web */}
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🌐</span>
                        <div className="flex-grow">
                            <h4 className="font-bold text-gray-700 text-xs uppercase mb-1">Site Web</h4>
                            {isEditing ? (
                                <Input
                                    label="Site Web"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://..." />
                            ) : company.website ? (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                                    {company.website}
                                </a>
                            ) : (
                                <p className="text-gray-600">-</p>
                            )}
                        </div>
                    </div>

                    {/* Logo URL (Seulement en édition) */}
                    {isEditing && (
                        <div className="col-span-1 md:col-span-2 flex items-start gap-3">
                            <span className="text-2xl">🖼️</span>
                            <div className="flex-grow">
                                <h4 className="font-bold text-gray-700 text-xs uppercase mb-1">URL du Logo</h4>
                                <Input
                                    label="Logo"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="https://exemple.com/logo.png" />
                                <p className="text-xs text-gray-500 mt-1">Collez l'URL directe d'une image.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions (Sauvegarder / Annuler / Supprimer) */}
                {isOwner && (
                    <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                        {isEditing ? (
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form
                                        setFormData({
                                            name: company.name,
                                            description: company.description,
                                            address: company.address || '',
                                            phone: company.phone || '',
                                            email: company.email || '',
                                            website: company.website || '',
                                            logo: company.logo || ''
                                        });
                                        setError(null);
                                    }}
                                    className="flex-1 md:flex-none"
                                    disabled={isSaving}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    isLoading={isSaving}
                                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 border-none"
                                >
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 italic">
                                Connectée en tant que propriétaire
                            </div>
                        )}

                        {/* Bouton Supprimer (Toujours visible pour le proprio, mais dangereux) */}
                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || isEditing}
                                className="text-sm text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 disabled:no-underline transition-colors px-4 py-2"
                            >
                                {isDeleting ? "Suppression en cours..." : "🗑️ Supprimer cette entreprise"}
                            </button>
                        )}
                    </div>
                )}

                {!isOwner && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400 italic">Vous consultez cette fiche en tant que visiteuse.</p>
                    </div>
                )}
            </div>
        </div>
    );
};