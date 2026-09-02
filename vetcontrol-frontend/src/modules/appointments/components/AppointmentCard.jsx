import { CalendarDays, Clock3, Edit3, Stethoscope, Trash2, UserRound } from "lucide-react";

const statusLabels = {
    Confirmed: "Confirmado",
    Completed: "Atendido",
    Cancelled: "Cancelado"
};

function AppointmentCard({
    appointment,
    owner,
    canManage = false,
    showOwner = false,
    onEdit,
    onDelete
}) {

    const formattedDate = new Intl.DateTimeFormat(
        "es-AR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    ).format(new Date(appointment.dateTime));

    const formattedHour = new Intl.DateTimeFormat(
        "es-AR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(new Date(appointment.dateTime));

    const canEdit =
        appointment.status === "Confirmed" &&
        (owner || canManage);

    const statusClass =
        appointment.status?.toLowerCase() ?? "confirmed";

    return (

        <article className="appointment-row">

            <div className="appointment-row-main">

                <div className="appointment-avatar">
                    <CalendarDays size={24} />
                </div>

                <div className="appointment-info">

                    <div className="appointment-heading">

                        <h3>
                            {appointment.petName}
                        </h3>

                        <span className={`appointment-status appointment-status--${statusClass}`}>
                            {statusLabels[appointment.status] ?? appointment.status}
                        </span>

                    </div>

                    <div className="appointment-details">

                        <span>
                            <Stethoscope size={15} />
                            {appointment.veterinarianName}
                        </span>

                        {showOwner && appointment.ownerName && (

                            <span title={appointment.ownerEmail}>
                                <UserRound size={15} />
                                {appointment.ownerName}
                            </span>

                        )}

                        <span>
                            <CalendarDays size={15} />
                            {formattedDate}
                        </span>

                        <span>
                            <Clock3 size={15} />
                            {formattedHour}
                        </span>

                    </div>

                    {appointment.reason && (

                        <p className="appointment-reason">
                            {appointment.reason}
                        </p>

                    )}

                </div>

                {canEdit && (

                    <div className="appointment-actions">

                        <button
                            className="appointment-icon-button"
                            onClick={() => onEdit?.(appointment)}
                            title="Editar turno"
                        >
                            <Edit3 size={18} />
                        </button>

                        <button
                            className="appointment-icon-button appointment-icon-button--danger"
                            onClick={() =>
                                onDelete?.(
                                    appointment.appointmentId
                                )
                            }
                            title="Cancelar turno"
                        >
                            <Trash2 size={18} />
                        </button>

                    </div>

                )}

            </div>

        </article>

    );

}

export default AppointmentCard;
