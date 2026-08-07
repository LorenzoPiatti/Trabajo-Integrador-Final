import "./ReminderBell.css";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ReminderDropdown from "./ReminderDropdown";

import {
    getReminders,
    getUnreadReminderCount,
    markReminderAsRead,
    markAllRemindersAsRead
} from "../../../services/reminderService";

function ReminderBell() {

    const reminderContainerRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const [reminders, setReminders] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        const loadUnreadCount = async () => {

            try {

                const data = await getUnreadReminderCount();

                setUnreadCount(
                    typeof data === "number"
                        ? data
                        : data.unreadCount ?? data.count ?? 0
                );

            }
            catch (error) {

                console.error(
                    "Error al obtener el contador de recordatorios:",
                    error
                );

            }

        };

        loadUnreadCount();

    }, []);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                reminderContainerRef.current &&
                !reminderContainerRef.current.contains(event.target)
            ) {

                setIsOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    const loadReminders = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await getReminders();

            setReminders(
                Array.isArray(data) ? data : []
            );

        }
        catch (error) {

            console.error(
                "Error al obtener los recordatorios:",
                error
            );

            setError(
                "No se pudieron cargar las notificaciones."
            );

        }
        finally {

            setLoading(false);

        }

    };

    const handleToggleDropdown = async () => {

        const nextIsOpen = !isOpen;

        setIsOpen(nextIsOpen);

        if (nextIsOpen) {

            await loadReminders();

        }

    };

    const handleMarkAsRead = async (reminderId) => {

        try {

            await markReminderAsRead(reminderId);

            setReminders(currentReminders =>
                currentReminders.map(reminder =>
                    reminder.reminderId === reminderId
                        ? {
                            ...reminder,
                            isRead: true
                        }
                        : reminder
                )
            );

            setUnreadCount(currentCount =>
                Math.max(currentCount - 1, 0)
            );

        }
        catch (error) {

            console.error(
                "Error al marcar el recordatorio como leído:",
                error
            );

            setError(
                "No se pudo marcar la notificación como leída."
            );

        }

    };

    const handleMarkAllAsRead = async () => {

        try {

            await markAllRemindersAsRead();

            setReminders(currentReminders =>
                currentReminders.map(reminder => ({
                    ...reminder,
                    isRead: true
                }))
            );

            setUnreadCount(0);

        }
        catch (error) {

            console.error(
                "Error al marcar todos los recordatorios como leídos:",
                error
            );

            setError(
                "No se pudieron marcar todas como leídas."
            );

        }

    };

    const badgeText =
        unreadCount > 9
            ? "9+"
            : unreadCount;

    return (

        <div
            className="reminder-bell-container"
            ref={reminderContainerRef}
        >

            <button
                type="button"
                className={`header-icon ${
                    isOpen ? "active" : ""
                }`}
                onClick={handleToggleDropdown}
                aria-label="Abrir notificaciones"
                aria-expanded={isOpen}
            >

                <Bell size={20} />

                {unreadCount > 0 && (

                    <span className="notification-badge">

                        {badgeText}

                    </span>

                )}

            </button>

            {isOpen && (

                <ReminderDropdown
                    reminders={reminders}
                    loading={loading}
                    error={error}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                />

            )}

        </div>

    );

}

export default ReminderBell;