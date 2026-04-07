// src/components/company/CompanyCard.tsx
import { Link } from 'react-router-dom';
import type { Company } from '../../types/company';

interface CompanyCardProps {
    company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
    // Si pas de logo, on affiche les initiales du nom de l'entreprise
    const getInitials = (name: string) => {
        if (!name) return "C";
        return name
            .split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <Link
            to={`/companies/${company.id}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 flex flex-col h-full transform hover:-translate-y-1"
        >
            {/* Header Dégradé */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-24 w-full relative">
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full shadow-md">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold border-2 border-white group-hover:scale-105 transition-transform overflow-hidden">
                        {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(company.name)
                        )}
                    </div>
                </div>
            </div>

            {/* Contenu de la carte */}
            <div className="pt-10 pb-6 px-4 text-center flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                        {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[2.5rem]">
                        {company.description || "Aucune description disponible."}
                    </p>
                </div>

                <div className="mt-4">
          <span className="inline-block px-4 py-2 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all">
            Voir l'entreprise
          </span>
                </div>
            </div>
        </Link>
    );
};