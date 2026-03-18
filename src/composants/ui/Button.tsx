// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
}

export const Button = ({
                           children,
                           variant = 'primary',
                           isLoading,
                           className,
                           disabled,
                           ...props
                       }: ButtonProps) => {

    const baseStyles = "w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 flex justify-center items-center";

    const variants = {
        primary: "bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-lg disabled:bg-pink-400",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        outline: "border-2 border-pink-600 text-pink-600 hover:bg-pink-50"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {children}
        </button>
    );
};