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
        const responseText = await response.text();
        let message = responseText || "Ocurrió un error.";

        try {
            const data = JSON.parse(responseText);

            if (data.message) {
                message = data.message;
            }
        } catch {
            // Si la respuesta no es JSON, usamos el texto original.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const getAppointments = () => {
    return request(`${API_URL}/appointment/my`);
};

export const getReceptionAppointments = () => {
    return request(`${API_URL}/appointment/reception`);
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

export const updateReceptionAppointment = (id, appointment) => {
    return request(`${API_URL}/appointment/reception/${id}`, {
        method: "PUT",
        body: JSON.stringify(appointment)
    });
};

export const deleteAppointment = (id) => {
    return request(`${API_URL}/appointment/${id}`, {
        method: "DELETE"
    });
};

export const deleteReceptionAppointment = (id) => {
    return request(`${API_URL}/appointment/reception/${id}`, {
        method: "DELETE"
    });
};

export const getPendingAppointments = () => {
    return request(`${API_URL}/appointment/veterinarian/pending`);
};

export const getCompletedAppointments = () => {
    return request(`${API_URL}/appointment/veterinarian/completed`);
};

export const getAvailability = (veterinarianId, date) => {
    return request(
        `${API_URL}/appointment/availability?veterinarianId=${veterinarianId}&date=${date}`
    );
};