import {
    CalendarDays,
    Edit3,
    PawPrint,
    Stethoscope,
    Syringe,
    Trash2
} from "lucide-react";

const formatDate = (value) => {
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(value));
};

const getDueState = (nextDueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today
        ? "Vencida"
        : "Al dia";
};

function VaccineCard({
    administeredVaccine,
    onEdit,
    onDelete
}) {
    const dueState = getDueState(
        administeredVaccine.nextDueDate
    );

    return (
        <article className="vaccine-row">
            <div className="vaccine-row-main">
                <div className="vaccine-avatar">
                    <Syringe size={24} />
                </div>

                <div className="vaccine-info">
                    <div className="vaccine-heading">
                        <h3>
                            {administeredVaccine.vaccineName}
                        </h3>

                        <span
                            className={
                                dueState === "Vencida"
                                    ? "vaccine-status vaccine-status--overdue"
                                    : "vaccine-status"
                            }
                        >
                            {dueState}
                        </span>
                    </div>

                    <div className="vaccine-details">
                        <span>
                            <PawPrint size={15} />
                            {administeredVaccine.petName}
                        </span>

                        <span>
                            <Stethoscope size={15} />
                            {administeredVaccine.veterinarianName}
                        </span>

                        <span>
                            <CalendarDays size={15} />
                            Aplicada:{" "}
                            {formatDate(
                                administeredVaccine.applicationDate
                            )}
                        </span>

                        <span>
                            <CalendarDays size={15} />
                            Proxima:{" "}
                            {formatDate(
                                administeredVaccine.nextDueDate
                            )}
                        </span>
                    </div>

                    {administeredVaccine.observations && (
                        <p className="vaccine-observation">
                            {administeredVaccine.observations}
                        </p>
                    )}
                </div>

                <div className="vaccine-actions">
                    <button
                        type="button"
                        className="vaccine-icon-button"
                        onClick={() => onEdit(administeredVaccine)}
                        title="Editar vacuna"
                    >
                        <Edit3 size={18} />
                    </button>

                    <button
                        type="button"
                        className="vaccine-icon-button vaccine-icon-button--danger"
                        onClick={() =>
                            onDelete(
                                administeredVaccine.administeredVaccineId
                            )
                        }
                        title="Eliminar vacuna"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default VaccineCard;
