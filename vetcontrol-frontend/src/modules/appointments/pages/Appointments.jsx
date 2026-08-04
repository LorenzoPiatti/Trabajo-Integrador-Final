import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
    CalendarDays,
    Clock3,
    Plus,
    Stethoscope
} from "lucide-react";

import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";

import {
    createAppointment,
    deleteAppointment,
    getAppointments,
    updateAppointment
} from "../../../services/appointmentService";

import { getPets } from "../../../services/petService";
import { getVeterinarians } from "../../../services/userService";

import AppointmentCard from "../components/AppointmentCard";
import AppointmentForm from "../components/AppointmentForm";

import "../styles/Appointments.css";


function AppointmentsPage() {

    const token = localStorage.getItem("token");

    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(Boolean(token));

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const formRef = useRef(null);


    const loadData = useCallback(async () => {

        setInitialLoading(true);
        setError("");

        try {

            const [
                appointmentsData,
                petsData,
                veterinariansData
            ] = await Promise.all([
                getAppointments(),
                getPets(),
                getVeterinarians()
            ]);

            setAppointments(appointmentsData ?? []);
            setPets(petsData ?? []);
            setVeterinarians(veterinariansData ?? []);

        } catch (err) {

            setError(err.message);

        } finally {

            setInitialLoading(false);

        }

    }, []);


    useEffect(() => {

        if (!token) return;

        loadData();

    }, [token, loadData]);


    const scrollToForm = () => {

        setTimeout(() => {

            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    };


    const handleSubmit = async (formData) => {

        setLoading(true);
        setError("");
        setSuccess("");

        try {

            if (selectedAppointment) {

                await updateAppointment(
                    selectedAppointment.appointmentId,
                    formData
                );

                setSuccess("Turno actualizado correctamente.");

            } else {

                await createAppointment(formData);

                setSuccess("Turno registrado correctamente.");

            }

            setSelectedAppointment(null);

            await loadData();

            return true;

        } catch (err) {

            setError(err.message);

            return false;

        } finally {

            setLoading(false);

        }

    };


    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "¿Desea cancelar este turno?"
        );

        if (!confirmed) return;

        try {

            await deleteAppointment(id);

            setSuccess(
                "Turno cancelado correctamente."
            );

            await loadData();

        } catch (err) {

            setError(err.message);

        }

    };


    if (!token) {

        return (

            <main className="appointments-auth-page">

                <section className="appointments-auth-card">

                    <div className="appointments-auth-icon">
                        <CalendarDays size={30} />
                    </div>

                    <h1>Mis turnos</h1>

                    <p>
                        Iniciá sesión para administrar tus turnos.
                    </p>

                    <Link
                        className="appointments-primary-button"
                        to="/"
                    >
                        Ir al inicio
                    </Link>

                </section>

            </main>

        );

    }


    return (

        <Layout
            title="Turnos"
            subtitle="Gestioná los turnos de tus mascotas"
        >

            <div className="appointments-dashboard">

                <section className="appointments-summary-grid">

                    <StatCard
                        title="Turnos"
                        value={appointments.length}
                        color="#A3C1AD"
                        icon={<CalendarDays />}
                    />

                    <StatCard
                        title="Próximos"
                        value={
                            appointments.filter(
                                a => a.status === "Confirmed"
                            ).length
                        }
                        color="#7FB3D5"
                        icon={<Clock3 />}
                    />

                    <StatCard
                        title="Atendidos"
                        value={
                            appointments.filter(
                                a => a.status === "Completed"
                            ).length
                        }
                        color="#A3C1AD"
                        icon={<Stethoscope />}
                    />

                </section>


                {(error || success) && (

                    <section
                        className={
                            error
                                ? "appointments-status appointments-status--error"
                                : "appointments-status appointments-status--success"
                        }
                    >
                        {error || success}
                    </section>

                )}


                <section className="appointments-content-grid">

                    <Panel className="appointments-list-panel">

                        <div className="appointments-panel-header">

                            <div>

                                <h2>
                                    Mis turnos
                                </h2>

                                <p>
                                    {appointments.length} turno(s)
                                </p>

                            </div>


                            <button
                                className="appointments-ghost-button"
                                onClick={() => {

                                    setSelectedAppointment(null);
                                    scrollToForm();

                                }}
                            >

                                <Plus size={18} />

                                <span>
                                    Nuevo
                                </span>

                            </button>

                        </div>


                        {
                            initialLoading

                                ? (
                                    <p>
                                        Cargando turnos...
                                    </p>
                                )

                                : appointments.length === 0

                                    ? (
                                        <p>
                                            No hay turnos registrados.
                                        </p>
                                    )

                                    : (

                                        <div className="appointments-record-list">

                                            {
                                                appointments.map(
                                                    appointment => (

                                                        <AppointmentCard
                                                            key={
                                                                appointment.appointmentId
                                                            }
                                                            appointment={
                                                                appointment
                                                            }
                                                            onEdit={(appointment) => {

                                                                setSelectedAppointment(
                                                                    appointment
                                                                );

                                                                scrollToForm();

                                                            }}
                                                            onDelete={
                                                                handleDelete
                                                            }
                                                        />

                                                    )
                                                )
                                            }

                                        </div>

                                    )
                        }

                    </Panel>


                    <AppointmentForm
                        ref={formRef}
                        selectedAppointment={selectedAppointment}
                        pets={pets}
                        veterinarians={veterinarians}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancelEdit={() =>
                            setSelectedAppointment(null)
                        }
                    />

                </section>

            </div>

        </Layout>

    );

}


export default AppointmentsPage;