// src/lib/auth.utils.ts

/**
 * Extrait l'ID utilisateur depuis le token JWT stocké en localStorage.
 * Retourne null si le token est absent ou invalide.
 */
export const getCurrentUserId = (): number | null => {
    const token = localStorage.getItem('access_token');

    if (!token) return null;

    try {
        // Un token JWT est composé de 3 parties séparées par des points : header.payload.signature
        // On s'intéresse à la partie du milieu (payload)
        const base64Url = token.split('.')[1];

        // Conversion base64url vers base64 standard pour que atob() fonctionne
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Décodage et parsing JSON
        const payload = JSON.parse(window.atob(base64));

        // Django REST Framework SimpleJWT stocke l'ID dans 'user_id'
        return payload.user_id || null;
    } catch (error) {
        console.error("Erreur lors de la lecture du token JWT:", error);
        return null;
    }
};