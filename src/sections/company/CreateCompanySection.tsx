import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../services/company.service';
import type { CreateCompanyPayload } from '../../types/company';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const CreateCompanySection = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    // État du formulaire
    const [formData, setFormData] = useState<CreateCompanyPayload>({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        logo: '' // Pour l'instant on gère juste l'URL texte, l'upload d'image est une étape suivante
    });

    // Erreurs par champ
    const [errors, setErrors] = useState<Partial<Record<keyof CreateCompanyPayload, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Nettoyer l'erreur quand l'utilisateur tape
        if (errors[name as keyof CreateCompanyPayload]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        if (globalError) setGlobalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        // Validation simple côté front
        const newErrors: Partial<Record<keyof CreateCompanyPayload, string>> = {};
        if (!formData.name.trim()) newErrors.name = "Le nom de l'entreprise est requis";
        if (!formData.description.trim()) newErrors.description = "La description est requise";
        if (formData.website && !formData.website.startsWith('http')) {
            newErrors.website = "L'URL doit commencer par http:// ou https://";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await companyService.createCompany(formData);

            // Succès : Redirection vers la liste des entreprises avec un message
            // On pourrait passer un state pour afficher un toast, mais ici on redirige simplement
            navigate('/companies', { state: { successMessage: "Entreprise créée avec succès ! 🎉" } });

        } catch (err: any) {
            console.error("Erreur création entreprise:", err);

            // Gestion des erreurs spécifiques Django (ex: "User has already a company")
            if (err.non_field_errors) {
                setGlobalError(err.non_field_errors[0]);
            } else if (err.name) {
                setErrors(prev => ({ ...prev, name: err.name[0] }));
            } else if (err.description) {
                setErrors(prev => ({ ...prev, description: err.description[0] }));
            } else {
                setGlobalError(err.message || "Une erreur est survenue lors de la création.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-purple-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Créer votre page entreprise 🚀</h2>
                <p className="text-gray-500 mt-2">Présentez votre activité à toute la communauté Niyya.</p>
                <p className="text-xs text-orange-500 mt-2 font-medium">
                    ⚠️ Attention : Vous ne pouvez créer qu'une seule entreprise.
                </p>
            </div>

            {globalError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center">
                    <span className="mr-2">⚠️</span> {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Champs Obligatoires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Nom de l'entreprise *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Ex: Niyya Tech"
                    />
                    <Input
                        label="Email professionnel"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="contact@entreprise.com"
                    />
                </div>

                <Input
                    label="Description courte *"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    placeholder="Décrivez votre activité en quelques mots..."
                />

                {/* Champs Optionnels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Site Web"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        error={errors.website}
                        placeholder="https://www.monsite.com"
                    />
                    <Input
                        label="Téléphone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="+33 6 00 00 00 00"
                    />
                </div>

                <Input
                    label="Adresse physique"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="123 Rue de l'Innovation, Paris"
                />

                <Input
                    label="URL du Logo (Optionnel)"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    error={errors.logo}
                    placeholder="https://..."
                />

                <div className="pt-6 flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/companies')}
                        type="button"
                        className="flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none"
                    >
                        Créer ma page
                    </Button>
                </div>
            </form>
        </div>
    );
};