const getTokenPayload = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];
        const normalized = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(atob(normalized));
    } catch {
        return null;
    }
};

export const getUserRole = () => {
    const payload = getTokenPayload();

    if (!payload) {
        return null;
    }

    return (
        payload.role ||
        payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        null
    );
};

export const isOwner = () => {
    return getUserRole() === "Owner";
};

export const isVeterinarian = () => {
    return getUserRole() === "Veterinarian";
};