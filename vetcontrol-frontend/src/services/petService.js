import API_URL from "./api";

const PETS_URL = `${API_URL}/pets`;

const getToken = () => {
    return localStorage.getItem("token");
};

const getHeaders = () => {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

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

export const getPets = async () => {
    const response = await fetch(PETS_URL, {
        headers: getHeaders()
    });

    return await handleResponse(response);
};

export const createPet = async (pet) => {
    const response = await fetch(PETS_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(pet)
    });

    return await handleResponse(response);
};

export const updatePet = async (petId, pet) => {
    const response = await fetch(`${PETS_URL}/${petId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(pet)
    });

    return await handleResponse(response);
};

export const deletePet = async (petId) => {
    const response = await fetch(`${PETS_URL}/${petId}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    return await handleResponse(response);
};
