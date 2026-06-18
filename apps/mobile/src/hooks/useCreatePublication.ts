import { useState } from "react";

export const useCreatePublication = () => {
    const [loading, setLoading] = useState(false);

    return {
        loading,
        setLoading,
    };
};