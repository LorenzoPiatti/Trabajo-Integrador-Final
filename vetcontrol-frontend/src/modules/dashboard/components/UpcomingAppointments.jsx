import "./UpcomingAppointments.css";

import "./UpcomingAppointments.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Panel from "../../../components/ui/Panel";
import PanelHeader from "../../../components/ui/PanelHeader";
import AppointmentCard from "./AppointmentCard";

import { getAppointments } from "../../../services/appointmentService";

function UpcomingAppointments() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadAppointments = async () => {

            try {

                const data = await getAppointments();

                setAppointments(data);

            }
            catch (error) {

                console.error("Error al obtener turnos:", error);

            }
            finally {

                setLoading(false);

            }

        };

        loadAppointments();

    }, []);

    const upcomingAppointments = appointments
        .filter(
            appointment => new Date(appointment.dateTime) >= new Date()
        )
        .sort(
            (a, b) =>
                new Date(a.dateTime) - new Date(b.dateTime)
        )
        .slice(0, 2);

    const getDateHeader = (date) => {

        const today = new Date();

        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const current = new Date(date);

        if (current.toDateString() === today.toDateString()) {

            return "Hoy";

        }

        if (current.toDateString() === tomorrow.toDateString()) {

            return "Mañana";

        }

        return current.toLocaleDateString(
            "es-AR",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

    };

    const groupedAppointments = upcomingAppointments.reduce((groups, appointment) => {

        const dateHeader = getDateHeader(appointment.dateTime);

        if (!groups[dateHeader]) {

            groups[dateHeader] = [];

        }

        groups[dateHeader].push(appointment);

        return groups;

    }, {});

    return (

        <Panel>

            <PanelHeader
                title="Próximos turnos"
                action="Ver todos"
                onAction={() => navigate("/appointments")}
            />

            {loading ? (

                <p>Cargando turnos...</p>

            ) : upcomingAppointments.length === 0 ? (

                <p>No tenés turnos programados.</p>

            ) : (

                Object.entries(groupedAppointments).map(([date, appointments]) => (

                    <div
                        key={date}
                        className="appointment-group"
                    >

                        <div className="appointment-date">

                            {date}

                        </div>

                        {appointments.map((appointment) => {

                            const appointmentDate = new Date(appointment.dateTime);

                            return (

                                <AppointmentCard
                                    key={appointment.appointmentId}
                                    pet={appointment.petName}
                                    reason={appointment.reason}
                                    time={
                                        appointmentDate.toLocaleTimeString(
                                            "es-AR",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            }
                                        ) + " hs"
                                    }
                                    status={appointment.status}
                                />

                            );

                        })}

                    </div>

                ))

            )}

        </Panel>

    );

}

export default UpcomingAppointments;