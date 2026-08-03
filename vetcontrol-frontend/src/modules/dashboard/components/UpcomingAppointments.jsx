import "./UpcomingAppointments.css";
import Panel from "../../../components/ui/Panel";
import PanelHeader from "../../../components/ui/PanelHeader";
import AppointmentCard from "./AppointmentCard";
import { useNavigate } from "react-router-dom";
const appointments = [
    {
        id: 1,
        pet: "Luna",
        reason: "Control general",
        dateHeader: "Lunes 18 de agosto",
        date: "18 Ago 2026",
        time: "10:30 hs",
        status: "confirmed"
    },
   
    
];



// Agrupa automáticamente los turnos por fecha
const groupedAppointments = appointments.reduce((groups, appointment) => {

    if (!groups[appointment.dateHeader]) {
        groups[appointment.dateHeader] = [];
    }

    groups[appointment.dateHeader].push(appointment);

    return groups;

}, {});

function UpcomingAppointments() {
    
    const navigate = useNavigate();

    return (

        <Panel>

            <PanelHeader
                title="Próximos turnos"
                action="Ver todos"
                onAction={() => navigate("/appointments")}
            />

            {Object.entries(groupedAppointments).map(([date, appointments]) => (

                <div
                    key={date}
                    className="appointment-group"
                >

                    <div className="appointment-date">

                        {date}

                    </div>

                    {appointments.map((appointment) => (

                        <AppointmentCard
                            key={appointment.id}
                            pet={appointment.pet}
                            reason={appointment.reason}
                            date={appointment.date}
                            time={appointment.time}
                            status={appointment.status}
                        />

                    ))}

                </div>

            ))}

        </Panel>

    );

}

export default UpcomingAppointments;