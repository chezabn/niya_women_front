// src/sections/user/AllUsersSection.tsx
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { UserCard } from '../../components/user/UserCard';
import type { UserProfile } from '../../types/user';

export const AllUsersSection = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                setUsers(data);
            } catch (err) {
                setError("Impossible de charger la liste des membres.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Recherche de nouvelles amies...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl">
                ⚠️ {error}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-lg">Aucune autre utilisatrice pour le moment. 🌸</p>
                <p className="text-sm mt-2">Soyez la première à inviter des amies !</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
};