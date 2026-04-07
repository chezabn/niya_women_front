// src/sections/company/CompanyDetailSection.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '../../services/company.service';
import type { Company } from '../../types/company';
import { Button } from '../../components/ui/Button';

export const CompanyDetailSection = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) return;
            try {
                const data = await companyService.getCompanyById(Number(id));
                setCompany(data);
            } catch (err) {
                setError("Entreprise introuvable.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Chargement des détails...</p>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-purple-100">
                <p className="text-red-500 text-lg mb-4">⚠️ {error || "Entreprise non trouvée"}</p>
                <Link to="/companies">
                    <Button variant="outline" className="w-auto inline-block">Retour à la liste</Button>
                </Link>
            </div>
        );
    }

    // Fonction pour afficher les initiales si pas de logo
    const getInitials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100 max-w-4xl mx-auto">
            {/* Header avec Logo */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-48 w-full relative">
                <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-lg">
                    <div className="w-32 h-32 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 text-4xl font-bold border-4 border-white overflow-hidden">
                        {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(company.name)
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{company.name}</h2>
                        <p className="text-purple-600 font-medium mt-1">Fiche entreprise</p>
                    </div>
                    <Link to="/companies">
                        <Button variant="secondary" className="w-auto">← Retour</Button>
                    </Link>
                </div>

                <div className="prose max-w-none text-gray-600 mb-8">
                    <p className="text-lg leading-relaxed">{company.description}</p>
                </div>

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50 p-6 rounded-2xl">
                    {company.address && (
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <h4 className="font-bold text-gray-700 text-sm uppercase">Adresse</h4>
                                <p className="text-gray-600">{company.address}</p>
                            </div>
                        </div>
                    )}
                    {company.phone && (
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📞</span>
                            <div>
                                <h4 className="font-bold text-gray-700 text-sm uppercase">Téléphone</h4>
                                <p className="text-gray-600">{company.phone}</p>
                            </div>
                        </div>
                    )}
                    {company.email && (
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">✉️</span>
                            <div>
                                <h4 className="font-bold text-gray-700 text-sm uppercase">Email</h4>
                                <p className="text-gray-600 break-all">{company.email}</p>
                            </div>
                        </div>
                    )}
                    {company.website && (
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🌐</span>
                            <div>
                                <h4 className="font-bold text-gray-700 text-sm uppercase">Site Web</h4>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                                    {company.website}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {!company.address && !company.phone && !company.email && !company.website && (
                    <p className="text-center text-gray-400 italic mt-8">Aucune information de contact supplémentaire disponible.</p>
                )}
            </div>
        </div>
    );
};