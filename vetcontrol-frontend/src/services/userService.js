import API_URL from "./api";

const getToken = () => localStorage.getItem("token");

const request = async (url) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
};

export const getVeterinarians = () => {
    return request(`${API_URL}/users/veterinarians`);
};