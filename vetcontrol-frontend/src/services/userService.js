import API_URL from "./api";

const USERS_URL = `${API_URL}/users`;

const getToken = () => localStorage.getItem("token");

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

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            Authorization: `Bearer ${getToken()}`,
            ...(options.headers ?? {})
        }
    });

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

export const getVeterinarians = () => {
    return request(`${USERS_URL}/veterinarians`);
};

export const getUsers = () => {
    return request(USERS_URL);
};

export const getUserById = (userId) => {
    return request(`${USERS_URL}/${userId}`);
};

export const updateUserRole = (userId, role) => {
    return request(`${USERS_URL}/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role })
    });
};

export const updateUserStatus = (userId, active) => {
    return request(`${USERS_URL}/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ active })
    });
};
