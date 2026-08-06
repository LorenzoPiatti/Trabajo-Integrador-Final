import "./ReminderDropdown.css";

import ReminderItem from "./ReminderItem";

function ReminderDropdown({
    reminders,
    loading,
    error,
    onMarkAsRead,
    onMarkAllAsRead
}) {

    const hasUnreadReminders = reminders.some(
        reminder => !reminder.isRead
    );

    return (

        <div className="reminder-dropdown">

            <div className="reminder-dropdown-header">

                <div>

                    <h3>Notificaciones</h3>

                    <span>
                        {reminders.length} recordatorio
                        {reminders.length !== 1 ? "s" : ""}
                    </span>

                </div>

                {hasUnreadReminders && (

                    <button
                        type="button"
                        className="reminder-mark-all-button"
                        onClick={onMarkAllAsRead}
                    >

                        Marcar todas como leídas

                    </button>

                )}

            </div>

            <div className="reminder-dropdown-content">

                {loading ? (

                    <p className="reminder-dropdown-message">
                        Cargando notificaciones...
                    </p>

                ) : error ? (

                    <p className="reminder-dropdown-message error">
                        {error}
                    </p>

                ) : reminders.length === 0 ? (

                    <p className="reminder-dropdown-message">
                        No tenés notificaciones.
                    </p>

                ) : (

                    reminders.map(reminder => (

                        <ReminderItem
                            key={reminder.reminderId}
                            reminder={reminder}
                            onMarkAsRead={onMarkAsRead}
                        />

                    ))

                )}

            </div>

        </div>

    );

}

export default ReminderDropdown;