import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import type { RegisterPayload } from "../../types/user.ts";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { REGISTER_ERROR, REGISTER_PAGE } from "../../constants/auth/register";

export const RegisterSection = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterPayload>({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterPayload, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegisterPayload]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        if (globalError) setGlobalError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);
        setSuccessMessage(null);

        const newErrors: Partial<Record<keyof RegisterPayload, string>> = {};

        if (!formData.username)
            newErrors.username = REGISTER_ERROR.MISSING.USERNAME;

        if (!formData.email.includes('@'))
            newErrors.email = REGISTER_ERROR.INVALID.EMAIL;

        if (formData.password.length < 8)
            newErrors.password = REGISTER_ERROR.PASSWORD.TOO_SHORT;

        if (formData.password !== formData.password2)
            newErrors.password2 = REGISTER_ERROR.PASSWORD.NO_MATCH;

        if (!formData.first_name)
            newErrors.first_name = REGISTER_ERROR.MISSING.FIRST_NAME;

        if (!formData.last_name)
            newErrors.last_name = REGISTER_ERROR.MISSING.LAST_NAME;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const responseData = await authService.register(formData);

            if (responseData.access_token) {
                localStorage.setItem('access_token', responseData.access_token);
                localStorage.setItem('refresh_token', responseData.refresh_token);
                console.log(REGISTER_PAGE.SUCCESS.TOKEN_SAVED);
            } else {
                console.warn(REGISTER_PAGE.SUCCESS.TOKEN_MISSING_WARNING);
            }

            setSuccessMessage(REGISTER_PAGE.SUCCESS.ACCOUNT_CREATED);

            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err: any) {
            console.error(REGISTER_PAGE.LOGS.REGISTRATION_ERROR, err);

            if (err.email) {
                setErrors(prev => ({ ...prev, email: Array.isArray(err.email) ? err.email[0] : err.email }));
            } else if (err.username) {
                setErrors(prev => ({ ...prev, username: Array.isArray(err.username) ? err.username[0] : err.username }));
            } else if (err.message) {
                setGlobalError(err.message);
            } else {
                setGlobalError(REGISTER_ERROR.SERVER.DEFAULT);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-pink-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">{REGISTER_PAGE.TITLE}</h2>
                <p className="text-gray-500 mt-2">{REGISTER_PAGE.REGISTER_DESCRIPTION}</p>
            </div>

            {successMessage && (
                <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center font-medium animate-pulse">
                    ✨ {successMessage}
                </div>
            )}

            {globalError && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    ⚠️ {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={REGISTER_PAGE.LABEL.FIRST_NAME}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                        placeholder={REGISTER_PAGE.PLACEHOLDERS.FIRST_NAME}
                    />
                    <Input
                        label={REGISTER_PAGE.LABEL.LAST_NAME}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                        placeholder={REGISTER_PAGE.PLACEHOLDERS.LAST_NAME}
                    />
                </div>

                <Input
                    label={REGISTER_PAGE.LABEL.USERNAME}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder={REGISTER_PAGE.PLACEHOLDERS.USERNAME}
                />

                <Input
                    label={REGISTER_PAGE.LABEL.EMAIL}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder={REGISTER_PAGE.PLACEHOLDERS.EMAIL}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={REGISTER_PAGE.LABEL.PASSWORD}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder={REGISTER_PAGE.PLACEHOLDERS.PASSWORD}
                    />
                    <Input
                        label={REGISTER_PAGE.LABEL.CONFIRMATION}
                        name="password2"
                        type="password"
                        value={formData.password2}
                        onChange={handleChange}
                        error={errors.password2}
                        placeholder={REGISTER_PAGE.PLACEHOLDERS.PASSWORD}
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" isLoading={isLoading}>
                        {REGISTER_PAGE.BUTTON_SUBMIT}
                    </Button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                {REGISTER_PAGE.LINK_LOGIN_TEXT}
                <a href="/login" className="text-pink-600 font-semibold hover:underline">
                    {REGISTER_PAGE.LINK_LOGIN_LABEL}
                </a>
            </p>
        </div>
    );
};

export default RegisterSection;