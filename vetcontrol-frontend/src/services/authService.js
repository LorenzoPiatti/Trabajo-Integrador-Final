import API_URL from "./api";

const AUTH_URL = `${API_URL}/auth`;

const readResponse = async (response) => {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
};

const handleResponse = async (response) => {
    const data = await readResponse(response);

    if (!response.ok) {
        const message =
            typeof data === "string"
                ? data
                : data?.message ?? "Ocurrió un error inesperado";

        throw new Error(message);
    }

    return data;
};

export const login = async (email, password) => {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await handleResponse(response);

    return data.token;
};

export const register = async (userData) => {
    const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return await handleResponse(response);
};

export const verifyEmail = async (
    email,
    verificationCode
) => {
    const response = await fetch(`${AUTH_URL}/verify-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            verificationCode
        })
    });

    return await handleResponse(response);
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${AUTH_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    });

    return await handleResponse(response);
};

export const resetPassword = async (
    email,
    verificationCode,
    newPassword
) => {
    const response = await fetch(`${AUTH_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            verificationCode,
            newPassword
        })
    });
    
    return await handleResponse(response);
};

    export const getUserFromToken = (token) => {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];

        const normalized = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const data = JSON.parse(atob(normalized));

        const name =
            data.unique_name ||
            data[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ] ||
            "";

        const role =
            data.role ||
            data[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ||
            "";

        const nameParts = name.trim().split(" ");

        return {
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" "),
            role
        };
    }
    catch {
        return null;
    }
};
