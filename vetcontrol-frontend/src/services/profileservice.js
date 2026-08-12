import API_URL from "./api";

const PROFILE_URL = `${API_URL}/profile`;

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
                : data?.message ??
                  "Ocurrió un error inesperado";

        throw new Error(message);
    }

    return data;
};

const getAuthorizationHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error(
            "No se encontró una sesión activa."
        );
    }

    return {
        Authorization: `Bearer ${token}`
    };
};

export const getProfile = async () => {
    const response = await fetch(PROFILE_URL, {
        method: "GET",
        headers: {
            ...getAuthorizationHeaders()
        }
    });

    return await handleResponse(response);
};

export const updateProfile = async (profileData) => {
    const response = await fetch(PROFILE_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthorizationHeaders()
        },
        body: JSON.stringify(profileData)
    });

    return await handleResponse(response);
};