import "./Reminders.css";

import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import Layout from "../../../components/layout/Layout";
import ReminderItem from "../components/ReminderItem";

import {
    getReminders,
    markReminderAsRead,
    markAllRemindersAsRead
} from "../../../services/reminderService";

function Reminders() {

    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadReminders = async () => {

            try {

                setLoading(true);
                setError("");

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
                    "No se pudieron cargar los recordatorios."
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadReminders();

    }, []);

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

        }
        catch (error) {

            console.error(
                "Error al marcar el recordatorio como leído:",
                error
            );

            setError(
                "No se pudo marcar el recordatorio como leído."
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

        }
        catch (error) {

            console.error(
                "Error al marcar todos los recordatorios como leídos:",
                error
            );

            setError(
                "No se pudieron marcar todos los recordatorios como leídos."
            );

        }

    };

    const unreadCount = reminders.filter(
        reminder => !reminder.isRead
    ).length;

    const hasUnreadReminders = unreadCount > 0;

    return (

        <Layout>

            <div className="reminders-page">

                <div className="reminders-page-header">

                    <div className="reminders-page-title">

                        <div className="reminders-page-icon">

                            <Bell size={24} />

                        </div>

                        <div>

                            <h2>Recordatorios</h2>

                            <p>
                                Tenés {unreadCount} recordatorio
                                {unreadCount !== 1 ? "s" : ""} sin leer.
                            </p>

                        </div>

                    </div>

                    {hasUnreadReminders && (

                        <button
                            type="button"
                            className="reminders-read-all-button"
                            onClick={handleMarkAllAsRead}
                        >

                            <CheckCheck size={18} />

                            Marcar todos como leídos

                        </button>

                    )}

                </div>

                <div className="reminders-page-content">

                    {loading ? (

                        <p className="reminders-page-message">
                            Cargando recordatorios...
                        </p>

                    ) : error ? (

                        <p className="reminders-page-message error">
                            {error}
                        </p>

                    ) : reminders.length === 0 ? (

                        <div className="reminders-empty">

                            <Bell size={34} />

                            <h3>No tenés recordatorios</h3>

                            <p>
                                Los avisos de turnos y vacunas aparecerán acá.
                            </p>

                        </div>

                    ) : (

                        reminders.map(reminder => (

                            <ReminderItem
                                key={reminder.reminderId}
                                reminder={reminder}
                                onMarkAsRead={handleMarkAsRead}
                            />

                        ))

                    )}

                </div>

            </div>

        </Layout>

    );

}

export default Reminders;