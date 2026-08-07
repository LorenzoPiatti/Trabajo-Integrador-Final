import API_URL from "./api";

const VACCINES_URL = `${API_URL}/vaccines`;

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
                : data?.message ?? "Ocurrio un error inesperado";

        throw new Error(message);
    }

    return data;
};

export const getVaccines = async () => {
    const response = await fetch(VACCINES_URL, {
        headers: getHeaders()
    });

    return await handleResponse(response);
};

export const getAdministeredVaccines = async () => {
    const response = await fetch(`${VACCINES_URL}/my`, {
        headers: getHeaders()
    });

    return await handleResponse(response);
};

export const createAdministeredVaccine = async (vaccine) => {
    const response = await fetch(`${VACCINES_URL}/my`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(vaccine)
    });

    return await handleResponse(response);
};

export const updateAdministeredVaccine = async (
    administeredVaccineId,
    vaccine
) => {
    const response = await fetch(
        `${VACCINES_URL}/my/${administeredVaccineId}`,
        {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(vaccine)
        }
    );

    return await handleResponse(response);
};

export const deleteAdministeredVaccine = async (
    administeredVaccineId
) => {
    const response = await fetch(
        `${VACCINES_URL}/my/${administeredVaccineId}`,
        {
            method: "DELETE",
            headers: getHeaders()
        }
    );

    return await handleResponse(response);
};
