import API_URL from "./api";

const getToken = () => {
    return localStorage.getItem("token");
};

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            ...options.headers
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Ocurrió un error.");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const getAppointments = () => {
    return request(`${API_URL}/appointment/my`);
};

export const createAppointment = (appointment) => {
    return request(`${API_URL}/appointment`, {
        method: "POST",
        body: JSON.stringify(appointment)
    });
};

export const updateAppointment = (id, appointment) => {
    return request(`${API_URL}/appointment/${id}`, {
        method: "PUT",
        body: JSON.stringify(appointment)
    });
};

export const deleteAppointment = (id) => {
    return request(`${API_URL}/appointment/${id}`, {
        method: "DELETE"
    });
};

export const getAvailability = (veterinarianId, date) => {
    return request(
        `${API_URL}/appointment/availability?veterinarianId=${veterinarianId}&date=${date}`
    );
};