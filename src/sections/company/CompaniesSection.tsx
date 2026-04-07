// src/sections/company/CompaniesSection.tsx
import { useState, useEffect } from 'react';
import { companyService } from '../../services/company.service';
import { CompanyCard } from '../../components/company/CompanyCard';
import { SearchBar } from '../../components/ui/SearchBar';
import type { Company } from '../../types/company';

export const CompaniesSection = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Effet pour charger les données (au montage et quand la recherche change)
    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Petit délai pour éviter de spammer l'API si on tape vite (optionnel, géré par le backend aussi)
                const timer = setTimeout(async () => {
                    const data = await companyService.getAllCompanies(searchQuery);
                    setCompanies(data);
                }, 300); // 300ms de debounce
                return () => clearTimeout(timer);
            } catch (err) {
                setError("Impossible de charger les entreprises.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, [searchQuery]);

    if (isLoading && companies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Recherche d'entreprises inspirantes...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Barre de recherche */}
            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher une entreprise par nom ou description..."
            />

            {error && (
                <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl mb-6">
                    ⚠️ {error}
                </div>
            )}

            {!error && companies.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-lg">Aucune entreprise trouvée pour "{searchQuery}". 🌸</p>
                    <p className="text-sm mt-2">Essayez avec d'autres mots-clés.</p>
                </div>
            )}

            {/* Grille des entreprises */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                ))}
            </div>
        </div>
    );
};