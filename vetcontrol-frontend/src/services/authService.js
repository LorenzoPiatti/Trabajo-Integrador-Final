const API_URL = "https://localhost:7052/api/auth";

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.json();
};

export const register = async (email, password) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.text();
};

export const verifyEmail = async (
    email,
    verificationCode
) => {
    const response = await fetch(
        `${API_URL}/verify-email`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                verificationCode
            })
        });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.text();
};

export const forgotPassword = async (email) => {
    const response = await fetch(
        `${API_URL}/forgot-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.text();
};

export const resetPassword = async (
    email,
    verificationCode,
    newPassword
) => {
    const response = await fetch(
        `${API_URL}/reset-password`,
        {
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

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.text();
};