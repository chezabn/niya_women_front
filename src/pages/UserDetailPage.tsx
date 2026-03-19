// src/pages/UserDetailPage.tsx
import { useParams, Navigate, Link } from 'react-router-dom';
import ProfileSection from '../sections/user/ProfileSection';

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const userId = Number(id);
    if (isNaN(userId)) {
        return <div className="py-20 text-center text-red-500">ID utilisateur invalide.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Bouton Retour */}
                <Link to="/all-users" className="inline-flex items-center text-pink-600 hover:underline mb-6 font-medium">
                    ← Retour à la communauté
                </Link>

                {/* Props userId = Mode Lecture Seule (Édition désactivée) */}
                <ProfileSection userId={userId} />
            </div>
        </div>
    );
};