import { CalendarDays,Clock3, PawPrint, Stethoscope } from "lucide-react";

function MedicalRecordList({
    appointments,
    onSelect
}) {

    if (appointments.length === 0) {
        return (
            <div className="medical-record-empty">
                <p>No hay turnos pendientes de atención.</p>
            </div>
        );
    }

    return (
        <div className="medical-record-list">

            {appointments.map((appointment) => {

                const date = new Date(appointment.dateTime);

                return (
                    <article
                        key={appointment.appointmentId}
                        className="medical-record-card"
                    >

                        <div className="medical-record-info">

                            <h3>
                                <PawPrint size={18} />
                                {appointment.petName}
                            </h3>

                            <p>
                                <Stethoscope size={16} />
                                {appointment.veterinarianName}
                            </p>

                            <p>
                                <CalendarDays size={16} />
                                {date.toLocaleDateString("es-AR")}
                            </p>

                            <p>
                                <Clock3 size={16} />
                                {date.toLocaleTimeString("es-AR", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>

                            <p>
                                <strong>Motivo:</strong>
                                {appointment.reason}
                            </p>

                        </div>

                        <div className="medical-record-actions">

                            <button
                                type="button"
                                className="appointments-primary-button"
                                onClick={() => onSelect(appointment)}
                            >
                                Registrar atención
                            </button>

                        </div>

                    </article>
                );

            })}

        </div>
    );

}

export default MedicalRecordList;