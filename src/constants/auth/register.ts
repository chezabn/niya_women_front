// src/constants/auth/register.ts

export const REGISTER_PAGE = {
    // Titres et Descriptions
    TITLE: "Rejoignez Niyya 🌸",
    SUBTITLE: "Bien plus qu'un réseau social.",
    DESCRIPTION: "Rejoignez une communauté bienveillante dédiée aux femmes.\nPartagez, inspirez et connectez-vous dans un espace sûr.",
    REGISTER_DESCRIPTION: "Créez votre espace unique.",

    // Labels de formulaire
    LABEL: {
        FIRST_NAME: "Prénom",
        LAST_NAME: "Nom",
        USERNAME: "Nom d'utilisateur",
        EMAIL: "Email",
        PASSWORD: "Mot de passe",
        CONFIRMATION: "Confirmation",
    },

    // Placeholders (exemples dans les champs)
    PLACEHOLDERS: {
        FIRST_NAME: "Ex: Sarah",
        LAST_NAME: "Ex: Connor",
        USERNAME: "@sarah_dev",
        EMAIL: "sarah@exemple.com",
        PASSWORD: "••••••••",
    },

    // Boutons et Liens
    BUTTON_SUBMIT: "Créer mon compte",
    LINK_LOGIN_TEXT: "Déjà membre ?  ",
    LINK_LOGIN_LABEL: "Se connecter",

    // Messages de statut (Succès, Logs)
    SUCCESS: {
        ACCOUNT_CREATED: "Compte créé avec succès ! Redirection...",
        TOKEN_SAVED: "Token sauvegardé avec succès !",
        TOKEN_MISSING_WARNING: "Le backend n'a pas renvoyé de token. Une connexion manuelle sera nécessaire.",
    },

    LOGS: {
        REGISTRATION_ERROR: "Erreur inscription:",
    }
};

export const REGISTER_ERROR = {
    MISSING: {
        USERNAME: "Le nom d'utilisateur est requis",
        EMAIL: "L'adresse email est requise",
        PASSWORD: "Le mot de passe est requis",
        CONFIRMATION: "La confirmation du mot de passe est requise",
        FIRST_NAME: "Le prénom est requis",
        LAST_NAME: "Le nom est requis",
    },
    INVALID: {
        EMAIL: "Email invalide",
        USERNAME: "Nom d'utilisateur invalide",
    },
    PASSWORD: {
        TOO_SHORT: "Min 8 caractères",
        NO_MATCH: "Les mots de passe ne correspondent pas",
        WEAK: "Le mot de passe doit contenir des chiffres et des lettres",
    },
    SERVER: {
        USERNAME_EXISTS: "Ce nom d'utilisateur est déjà pris",
        EMAIL_EXISTS: "Cet email est déjà enregistré",
        NETWORK: "Une erreur réseau est survenue. Veuillez réessayer.",
        UNKNOWN: "Une erreur est survenue. Veuillez réessayer.",
        DEFAULT: "Une erreur est survenue. Veuillez réessayer.",
    }
};