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

export const getUserId = () => {
    const payload = getTokenPayload();

    if (!payload) {
        return null;
    }

    const userId =
        payload.nameid ||
        payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        null;

    const parsedUserId = Number(userId);

    return Number.isNaN(parsedUserId)
        ? null
        : parsedUserId;
};

export const isOwner = () => {
    return getUserRole() === "Owner";
};

export const isVeterinarian = () => {
    return getUserRole() === "Veterinarian";
};

export const isReception = () => {
    return getUserRole() === "Reception";
};

export const isAdmin = () => {
    return getUserRole() === "Admin";
};
