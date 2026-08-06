import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Plus, Stethoscope } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import { createAppointment, deleteAppointment, getAppointments, getCompletedAppointments, updateAppointment} from "../../../services/appointmentService";
import { getPets } from "../../../services/petService";
import { getVeterinarians } from "../../../services/userService";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentForm from "../components/AppointmentForm";
import { isOwner, isVeterinarian } from "../../../utils/authUtils";
import "../styles/Appointments.css";

function AppointmentsPage() {

    const token = localStorage.getItem("token");

    const owner = isOwner();
    const veterinarian = isVeterinarian();

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

            if (owner) {

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

            }

            if (veterinarian) {

                const data =
                    await getCompletedAppointments();

                setAppointments(data ?? []);

            }

        } catch (err) {

            setError(err.message);

        } finally {

            setInitialLoading(false);

        }

    }, [owner, veterinarian]);

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

                setSuccess(
                    "Turno actualizado correctamente."
                );

            } else {

                await createAppointment(formData);

                setSuccess(
                    "Turno registrado correctamente."
                );

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

        if (!window.confirm(
            "¿Desea cancelar este turno?"
        )) {
            return;
        }

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
                        <CalendarDays size={30}/>
                    </div>

                    <h1>Turnos</h1>

                    <p>
                        Iniciá sesión para continuar.
                    </p>

                    <Link
                        to="/"
                        className="appointments-primary-button"
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
            subtitle={
                owner
                    ? "Gestioná los turnos de tus mascotas"
                    : "Turnos atendidos"
            }
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
                        title={
                            owner
                                ? "Próximos"
                                : "Completados"
                        }
                        value={
                            appointments.filter(a =>
                                owner
                                    ? a.status === "Confirmed"
                                    : a.status === "Completed"
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

                                    {
                                        owner
                                            ? "Mis turnos"
                                            : "Turnos atendidos"
                                    }

                                </h2>

                                <p>

                                    {appointments.length} turno(s)

                                </p>

                            </div>

                            {
                                owner && (

                                    <button
                                        className="appointments-ghost-button"
                                        onClick={() => {

                                            setSelectedAppointment(null);

                                            scrollToForm();

                                        }}
                                    >

                                        <Plus size={18}/>

                                        <span>
                                            Nuevo
                                        </span>

                                    </button>

                                )
                            }

                        </div>

                        {

                            initialLoading

                                ? (
                                    <p>
                                        Cargando...
                                    </p>
                                )

                                : appointments.length === 0

                                    ? (
                                        <p>
                                            No hay turnos.
                                        </p>
                                    )

                                    : (

                                        <div className="appointments-record-list">

                                            {

                                                appointments.map(appointment => (

                                                    <AppointmentCard
                                                        key={appointment.appointmentId}
                                                        appointment={appointment}
                                                        owner={owner}
                                                        onEdit={() => {

                                                            setSelectedAppointment(
                                                                appointment
                                                            );

                                                            scrollToForm();

                                                        }}
                                                        onDelete={
                                                            handleDelete
                                                        }
                                                    />

                                                ))

                                            }

                                        </div>

                                    )

                        }

                    </Panel>

                    {

                        owner && (

                            <AppointmentForm
                                ref={formRef}
                                selectedAppointment={
                                    selectedAppointment
                                }
                                pets={pets}
                                veterinarians={veterinarians}
                                loading={loading}
                                onSubmit={handleSubmit}
                                onCancelEdit={() =>
                                    setSelectedAppointment(null)
                                }
                            />

                        )

                    }

                </section>

            </div>

        </Layout>

    );

}

export default AppointmentsPage;