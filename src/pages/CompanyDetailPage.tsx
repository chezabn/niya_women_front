// src/pages/CompanyDetailPage.tsx
import { Navigate } from 'react-router-dom';
import { CompanyDetailSection } from '../sections/company/CompanyDetailSection';

export const CompanyDetailPage = () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-10 px-4">
            <CompanyDetailSection />
            </div>
    );
};