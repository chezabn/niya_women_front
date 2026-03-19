import axios from 'axios';

// L'URL de ton API Django (à mettre dans .env plus tard)
const API_BASE_URL = 'https://nabia.alwaysdata.net/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optionnel : Intercepteur pour ajouter le token automatiquement si tu en as un en stockage
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;