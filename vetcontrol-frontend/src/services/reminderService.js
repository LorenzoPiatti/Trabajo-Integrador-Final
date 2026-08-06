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

        throw new Error(
            message || "Ocurrió un error con los recordatorios."
        );

    }

    if (response.status === 204) {
        return null;
    }

    return response.json();

};

export const getReminders = (unreadOnly = false) => {

    return request(
        `${API_URL}/reminder?unreadOnly=${unreadOnly}`
    );

};

export const getUnreadReminderCount = () => {

    return request(
        `${API_URL}/reminder/unread-count`
    );

};

export const markReminderAsRead = (reminderId) => {

    return request(
        `${API_URL}/reminder/${reminderId}/read`,
        {
            method: "PATCH"
        }
    );

};

export const markAllRemindersAsRead = () => {

    return request(
        `${API_URL}/reminder/read-all`,
        {
            method: "PATCH"
        }
    );

};