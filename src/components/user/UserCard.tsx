// src/components/user/UserCard.tsx
import { Link } from 'react-router-dom';
import type { UserProfile } from '../../types/user';

interface UserCardProps {
    user: UserProfile;
}

export const UserCard = ({ user }: UserCardProps) => {

    // Fonction pour générer les initiales (identique à ProfileSection)
    const getInitials = (first: string, last: string) => {
        if (!first && !last) return "U";
        return `${(first?.[0] || '')}${(last?.[0] || '')}`.toUpperCase();
    };

    return (
        <Link
            to={`/users/${user.id}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 flex flex-col h-full transform hover:-translate-y-1"
        >
            {/* Header Dégradé (Identique au profil) */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-24 w-full relative">
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full shadow-md">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xl font-bold border-2 border-white group-hover:scale-105 transition-transform">
                        {getInitials(user.first_name, user.last_name)}
                    </div>
                </div>
            </div>

            {/* Contenu de la carte */}
            <div className="pt-10 pb-6 px-4 text-center flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                        {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                        @{user.username}
                    </p>
                </div>

                <div className="mt-4">
          <span className="inline-block px-4 py-2 bg-pink-50 text-pink-600 text-xs font-semibold rounded-full group-hover:bg-pink-600 group-hover:text-white transition-all">
            Voir le profil
          </span>
                </div>
            </div>
        </Link>
    );
};