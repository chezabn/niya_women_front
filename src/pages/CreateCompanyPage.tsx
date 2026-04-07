// src/pages/CreateCompanyPage.tsx
import { Navigate } from 'react-router-dom';
import { CreateCompanySection } from '../sections/company/CreateCompanySection';

export const CreateCompanyPage = () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <CreateCompanySection />

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Une fois créée, vous pourrez modifier les informations depuis votre tableau de bord.
                    </p>
                </div>
            </div>
        </div>
    );
};