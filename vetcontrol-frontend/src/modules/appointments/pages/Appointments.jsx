import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Plus, Stethoscope } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import { createAppointment, deleteAppointment, deleteReceptionAppointment, getAppointments, getCompletedAppointments, getPendingAppointments, getReceptionAppointments, updateAppointment, updateReceptionAppointment } from "../../../services/appointmentService";
import { getPets } from "../../../services/petService";
import { getVeterinarians } from "../../../services/userService";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentForm from "../components/AppointmentForm";
import MedicalRecordList from "../../medical-records/components/MedicalRecordList";
import MedicalRecordForm from "../../medical-records/components/MedicalRecordForm";
import { isOwner, isReception, isVeterinarian } from "../../../utils/authUtils";

import "../styles/Appointments.css";
import "../../medical-records/styles/MedicalRecords.css";

function AppointmentsPage() {

    const token = localStorage.getItem("token");

    const owner = isOwner();
    const veterinarian = isVeterinarian();
    const reception = isReception();

    const [appointments, setAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);

    const [pets, setPets] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedMedicalAppointment, setSelectedMedicalAppointment] = useState(null);
    const [receptionDateFilter, setReceptionDateFilter] = useState("");
    const [receptionStatusFilter, setReceptionStatusFilter] = useState("");

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

                const [
                    pendingData,
                    completedData
                ] = await Promise.all([
                    getPendingAppointments(),
                    getCompletedAppointments()
                ]);

                setPendingAppointments(pendingData ?? []);
                setAppointments(completedData ?? []);
            }

            if (reception) {

                const [
                    appointmentsData,
                    veterinariansData
                ] = await Promise.all([
                    getReceptionAppointments(),
                    getVeterinarians()
                ]);

                setAppointments(appointmentsData ?? []);
                setVeterinarians(veterinariansData ?? []);
            }

        } catch (err) {

            setError(err.message);

        } finally {

            setInitialLoading(false);
        }

    }, [owner, veterinarian, reception]);

    useEffect(() => {

        if (!token) return;

        const timeoutId = window.setTimeout(() => {
            loadData();
        }, 0);

        return () => window.clearTimeout(timeoutId);

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

                if (reception) {

                    await updateReceptionAppointment(
                        selectedAppointment.appointmentId,
                        formData
                    );

                } else {

                    await updateAppointment(
                        selectedAppointment.appointmentId,
                        formData
                    );
                }

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

            if (reception) {

                await deleteReceptionAppointment(id);

            } else {

                await deleteAppointment(id);
            }

            setSuccess(
                "Turno cancelado correctamente."
            );

            await loadData();

        } catch (err) {

            setError(err.message);
        }
    };

    const handleSelectMedicalAppointment = (appointment) => {

        setSelectedMedicalAppointment(appointment);
        setError("");
        setSuccess("");
    };

    const handleMedicalSuccess = async (message) => {

        setSuccess(message);
        setError("");

        setSelectedMedicalAppointment(null);

        await loadData();
    };

    const visibleReceptionAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            const matchesDate =
                !receptionDateFilter ||
                appointment.dateTime.substring(0, 10) === receptionDateFilter;

            const matchesStatus =
                !receptionStatusFilter ||
                appointment.status === receptionStatusFilter;

            return matchesDate && matchesStatus;
        });
    }, [
        appointments,
        receptionDateFilter,
        receptionStatusFilter
    ]);

    const totalAppointments =
        veterinarian
            ? pendingAppointments.length + appointments.length
            : appointments.length;

    const confirmedAppointments =
        appointments.filter(a => a.status === "Confirmed").length;

    const completedAppointments =
        appointments.filter(a => a.status === "Completed").length;

    const cancelledAppointments =
        appointments.filter(a => a.status === "Cancelled").length;

    const selectedReceptionPet = selectedAppointment
        ? [
            {
                petId: selectedAppointment.petId,
                name: selectedAppointment.petName
            }
        ]
        : [];

    if (!token) {

        return (

            <main className="appointments-auth-page">

                <section className="appointments-auth-card">

                    <div className="appointments-auth-icon">
                        <CalendarDays size={30} />
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
                    : veterinarian
                        ? "Consultá tus turnos y registrá las atenciones médicas"
                        : "Gestioná la agenda general de turnos"
            }
        >

            <div className="appointments-dashboard">

                <section className="appointments-summary-grid">

                    <StatCard
                        title="Turnos"
                        value={totalAppointments}
                        color="#A3C1AD"
                        icon={<CalendarDays />}
                    />

                    <StatCard
                        title={
                            owner
                                ? "Próximos"
                                : reception
                                    ? "Confirmados"
                                    : "Pendientes"
                        }
                        value={
                            owner
                                ? confirmedAppointments
                                : reception
                                    ? confirmedAppointments
                                    : pendingAppointments.length
                        }
                        color="#7FB3D5"
                        icon={<Clock3 />}
                    />

                    <StatCard
                        title={
                            reception
                                ? "Cancelados"
                                : "Atendidos"
                        }
                        value={
                            reception
                                ? cancelledAppointments
                                : completedAppointments
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

                {reception && (

                    <section className="appointments-content-grid">

                        <Panel className="appointments-list-panel">

                            <div className="appointments-panel-header appointments-panel-header--filters">

                                <div>

                                    <h2>
                                        Agenda general
                                    </h2>

                                    <p>
                                        {visibleReceptionAppointments.length} de {appointments.length} turno(s)
                                    </p>

                                </div>

                                <div className="appointments-filters">

                                    <label>
                                        Fecha

                                        <input
                                            type="date"
                                            value={receptionDateFilter}
                                            onChange={(e) =>
                                                setReceptionDateFilter(e.target.value)
                                            }
                                        />

                                    </label>

                                    <label>
                                        Estado

                                        <select
                                            value={receptionStatusFilter}
                                            onChange={(e) =>
                                                setReceptionStatusFilter(e.target.value)
                                            }
                                        >

                                            <option value="">
                                                Todos
                                            </option>

                                            <option value="Confirmed">
                                                Confirmados
                                            </option>

                                            <option value="Completed">
                                                Atendidos
                                            </option>

                                            <option value="Cancelled">
                                                Cancelados
                                            </option>

                                        </select>

                                    </label>

                                </div>

                            </div>

                            {
                                initialLoading

                                    ? (
                                        <p>
                                            Cargando agenda...
                                        </p>
                                    )

                                    : visibleReceptionAppointments.length === 0

                                        ? (
                                            <p>
                                                No hay turnos para los filtros seleccionados.
                                            </p>
                                        )

                                        : (

                                            <div className="appointments-record-list">

                                                {visibleReceptionAppointments.map(appointment => (

                                                    <AppointmentCard
                                                        key={appointment.appointmentId}
                                                        appointment={appointment}
                                                        owner={false}
                                                        canManage
                                                        showOwner
                                                        onEdit={() => {

                                                            setSelectedAppointment(
                                                                appointment
                                                            );

                                                            scrollToForm();
                                                        }}
                                                        onDelete={handleDelete}
                                                    />

                                                ))}

                                            </div>
                                        )
                            }

                        </Panel>

                        {selectedAppointment ? (

                            <AppointmentForm
                                ref={formRef}
                                selectedAppointment={selectedAppointment}
                                pets={selectedReceptionPet}
                                veterinarians={veterinarians}
                                loading={loading}
                                title="Reprogramar turno"
                                subtitle="Modificá fecha, horario, veterinario o motivo"
                                disablePetSelection
                                onSubmit={handleSubmit}
                                onCancelEdit={() =>
                                    setSelectedAppointment(null)
                                }
                            />

                        ) : (

                            <Panel className="appointment-form-panel appointments-selection-panel">

                                <div className="appointments-selection-icon">
                                    <CalendarDays size={24} />
                                </div>

                                <h2>
                                    Seleccioná un turno
                                </h2>

                                <p>
                                    Desde la agenda podés reprogramar o cancelar turnos confirmados.
                                </p>

                            </Panel>
                        )}

                    </section>
                )}

                {owner && (

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

                                                {appointments.map(appointment => (

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
                                                        onDelete={handleDelete}
                                                    />

                                                ))}

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
                )}

                {veterinarian && (

                    <>
                        <section className="medical-record-section">

                            <div className="medical-record-grid">

                                <Panel className="medical-record-list-panel">

                                    <div className="medical-record-panel-header">

                                        <div>

                                            <h2>
                                                Turnos pendientes
                                            </h2>

                                            <p>
                                                Seleccioná un turno para registrar la atención médica.
                                            </p>

                                        </div>

                                    </div>

                                    {initialLoading ? (

                                        <p>
                                            Cargando turnos...
                                        </p>

                                    ) : (

                                        <MedicalRecordList
                                            appointments={pendingAppointments}
                                            onSelect={handleSelectMedicalAppointment}
                                        />

                                    )}

                                </Panel>

                                <MedicalRecordForm
                                    selectedAppointment={selectedMedicalAppointment}
                                    onSuccess={handleMedicalSuccess}
                                    onError={(message) => {
                                        setError(message);
                                        setSuccess("");
                                    }}
                                />

                            </div>

                        </section>

                        <section className="appointments-content-grid">

                            <Panel className="appointments-list-panel">

                                <div className="appointments-panel-header">

                                    <div>

                                        <h2>
                                            Turnos atendidos
                                        </h2>

                                        <p>
                                            {appointments.length} turno(s)
                                        </p>

                                    </div>

                                </div>

                                {initialLoading ? (

                                    <p>
                                        Cargando...
                                    </p>

                                ) : appointments.length === 0 ? (

                                    <p>
                                        No hay turnos atendidos.
                                    </p>

                                ) : (

                                    <div className="appointments-record-list">

                                        {appointments.map(appointment => (

                                            <AppointmentCard
                                                key={appointment.appointmentId}
                                                appointment={appointment}
                                                owner={false}
                                            />

                                        ))}

                                    </div>

                                )}

                            </Panel>

                        </section>
                    </>
                )}

            </div>

        </Layout>
    );
}

export default AppointmentsPage;
