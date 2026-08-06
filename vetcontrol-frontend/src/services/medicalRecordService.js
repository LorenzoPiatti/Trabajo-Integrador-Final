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

export const createMedicalRecord = (medicalRecord) => {

    return request(`${API_URL}/medicalrecord`, {
        method: "POST",
        body: JSON.stringify(medicalRecord)
    });

};

export const getMedicalRecordByAppointment = (appointmentId) => {

    return request(
        `${API_URL}/medicalrecord/appointment/${appointmentId}`
    );

};

export const getPetHistory = (petId) => {

    return request(
        `${API_URL}/medicalrecord/pet/${petId}`
    );

};

export const getMedicalRecordPets = () => {

    return request(
        `${API_URL}/medicalrecord/pets`
    );

};