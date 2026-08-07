import "./ReminderItem.css";

import {
    CalendarDays,
    Syringe,
    Bell,
    CircleCheck
} from "lucide-react";

function ReminderItem({
    reminder,
    onMarkAsRead
}) {

    const getIcon = () => {

        switch (reminder.type?.toLowerCase()) {

            case "appointment":
            case "turno":
                return <CalendarDays size={19} />;

            case "vaccine":
            case "vacuna":
                return <Syringe size={19} />;

            default:
                return <Bell size={19} />;

        }

    };

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "es-AR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };

    const handleMarkAsRead = () => {

        if (!reminder.isRead) {
            onMarkAsRead(reminder.reminderId);
        }

    };

    return (

        <div
            className={`reminder-item ${
                reminder.isRead ? "read" : "unread"
            }`}
        >

            <div className="reminder-item-icon">

                {getIcon()}

            </div>

            <div className="reminder-item-content">

                <div className="reminder-item-header">

                    <h4>{reminder.title}</h4>

                    {!reminder.isRead && (

                        <span className="reminder-unread-dot"></span>

                    )}

                </div>

                <p>{reminder.message}</p>

                <span className="reminder-item-date">

                    {formatDate(
                        reminder.createdAt || reminder.reminderDate
                    )}

                </span>

            </div>

            {!reminder.isRead && (

                <button
                    type="button"
                    className="reminder-read-button"
                    onClick={handleMarkAsRead}
                    title="Marcar como leída"
                >

                    <CircleCheck size={18} />

                </button>

            )}

        </div>

    );

}

export default ReminderItem;