// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
    return (
        <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
          ${error
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200 bg-white'
                } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span> {error}
                </p>
            )}
        </div>
    );
};