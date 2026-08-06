import "./AppointmentCard.css";

import {
    Clock3,
    CircleCheckBig,
    PawPrint
} from "lucide-react";

function AppointmentCard({
    pet,
    reason,
    time,
    status
}) {

    const statusConfig = {
        confirmed: {
            text: "Confirmado",
            className: "confirmed"
        },
        completed: {
            text: "Completado",
            className: "completed"
        },
        cancelled: {
            text: "Cancelado",
            className: "cancelled"
        }
    };

    const currentStatus =
        statusConfig[status?.toLowerCase()] ??
        {
            text: status,
            className: "confirmed"
        };

    return (

        <div className="appointment-card">

            <div className={`appointment-status ${currentStatus.className}`}>

                <CircleCheckBig size={16} />

                <span>{currentStatus.text}</span>

            </div>

            <h4>{reason}</h4>

            <div className="appointment-pet">

                <PawPrint size={16} />

                <span>{pet}</span>

            </div>

            <div className="appointment-info">

                <span>

                    <Clock3 size={16} />

                    {time}

                </span>

            </div>

        </div>

    );

}

export default AppointmentCard;