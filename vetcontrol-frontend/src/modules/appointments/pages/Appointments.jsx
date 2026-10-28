import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Plus, Stethoscope } from "lucide-react";

import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";

import {
    createAppointment,
    deleteAppointment,
    deleteReceptionAppointment,
    getAppointments,
    getCompletedAppointments,
    getPendingAppointments,
    getReceptionAppointments,
    updateReceptionAppointment
} from "../../../services/appointmentService";

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
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const [receptionDateFilter, setReceptionDateFilter] = useState("");
    const [receptionStatusFilter, setReceptionStatusFilter] = useState("");

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(Boolean(token));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const formRef = useRef(null);

    useEffect(() => {
        if (!success) return;

        const timeoutId = window.setTimeout(() => {
            setSuccess("");
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [success]);

    const loadData = useCallback(async () => {
        setInitialLoading(true);
        setError("");

        try {
            if (owner) {
                const [appointmentsData, petsData, veterinariansData] = await Promise.all([
                    getAppointments(),
                    getPets(),
                    getVeterinarians()
                ]);

                setAppointments(appointmentsData ?? []);
                setPets(petsData ?? []);
                setVeterinarians(veterinariansData ?? []);
            }

            if (veterinarian) {
                const [pendingData, completedData] = await Promise.all([
                    getPendingAppointments(),
                    getCompletedAppointments()
                ]);

                setPendingAppointments(pendingData ?? []);
                setAppointments(completedData ?? []);
            }

            if (reception) {
                const [appointmentsData, veterinariansData] = await Promise.all([
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
            if (selectedAppointment && reception) {
                await updateReceptionAppointment(
                    selectedAppointment.appointmentId,
                    formData
                );

                setSuccess("Turno actualizado correctamente.");
            } else {
                const createdAppointment = await createAppointment(formData);

                if (createdAppointment?.appointmentId) {
                    setSuccess(
                        `Turno registrado correctamente. N.º de turno: ${createdAppointment.appointmentId}.`
                    );
                } else {
                    setSuccess("Turno registrado correctamente.");
                }
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

    const handleDelete = (id) => {
        const appointment = appointments.find(
            item => item.appointmentId === id
        );

        setError("");
        setSuccess("");
        setAppointmentToCancel(appointment ?? { appointmentId: id });
    };

    const handleConfirmDelete = async () => {
        if (!appointmentToCancel) return;

        const id = appointmentToCancel.appointmentId;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (reception) {
                await deleteReceptionAppointment(id);
            } else {
                await deleteAppointment(id);
            }

            if (selectedAppointment?.appointmentId === id) {
                setSelectedAppointment(null);
            }

            setSuccess("Turno cancelado correctamente.");
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setAppointmentToCancel(null);
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
    }, [appointments, receptionDateFilter, receptionStatusFilter]);

    const now = new Date();

    const ownerUpcomingAppointments = owner
        ? appointments
            .filter(appointment =>
                appointment.status === "Confirmed" &&
                new Date(appointment.dateTime) >= now
            )
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        : [];

    const ownerPastAppointments = owner
        ? appointments
            .filter(appointment =>
                appointment.status === "Completed" ||
                appointment.status === "Cancelled"
            )
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
        : [];

    const confirmedAppointments =
        appointments.filter(a => a.status === "Confirmed").length;

    const completedAppointments =
        appointments.filter(a => a.status === "Completed").length;

    const cancelledAppointments =
        appointments.filter(a => a.status === "Cancelled").length;

    const totalAppointments = veterinarian
        ? pendingAppointments.length + appointments.length
        : appointments.length;

    const ownerActiveAppointments =
        ownerUpcomingAppointments.length + completedAppointments;

    const selectedReceptionPet = selectedAppointment
        ? [{
            petId: selectedAppointment.petId,
            name: selectedAppointment.petName
        }]
        : [];

    if (!token) {
        return (
            <main className="appointments-auth-page">
                <section className="appointments-auth-card">
                    <div className="appointments-auth-icon">
                        <CalendarDays size={30} />
                    </div>

                    <h1>Turnos</h1>
                    <p>Iniciá sesión para continuar.</p>

                    <Link to="/" className="appointments-primary-button">
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
                        value={owner ? ownerActiveAppointments : totalAppointments}
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
                                ? ownerUpcomingAppointments.length
                                : reception
                                    ? confirmedAppointments
                                    : pendingAppointments.length
                        }
                        color="#7FB3D5"
                        icon={<Clock3 />}
                    />

                    <StatCard
                        title={reception ? "Cancelados" : "Atendidos"}
                        value={reception ? cancelledAppointments : completedAppointments}
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
                                    <h2>Agenda general</h2>
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
                                            onChange={e => setReceptionDateFilter(e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Estado
                                        <select
                                            value={receptionStatusFilter}
                                            onChange={e => setReceptionStatusFilter(e.target.value)}
                                        >
                                            <option value="">Todos</option>
                                            <option value="Confirmed">Confirmados</option>
                                            <option value="Completed">Atendidos</option>
                                            <option value="Cancelled">Cancelados</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            {initialLoading ? (
                                <p>Cargando agenda...</p>
                            ) : visibleReceptionAppointments.length === 0 ? (
                                <p>No hay turnos para los filtros seleccionados.</p>
                            ) : (
                                <div className="appointments-record-list">
                                    {visibleReceptionAppointments.map(appointment => (
                                        <AppointmentCard
                                            key={appointment.appointmentId}
                                            appointment={appointment}
                                            owner={false}
                                            canManage
                                            showOwner
                                            onEdit={() => {
                                                setSelectedAppointment(appointment);
                                                scrollToForm();
                                            }}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
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
                                onCancelEdit={() => setSelectedAppointment(null)}
                            />
                        ) : (
                            <Panel className="appointment-form-panel appointments-selection-panel">
                                <div className="appointments-selection-icon">
                                    <CalendarDays size={24} />
                                </div>

                                <h2>Seleccioná un turno</h2>

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
                                    <h2>Mis turnos</h2>
                                    <p>{appointments.length} turno(s) registrado(s)</p>
                                </div>

                                <button
                                    type="button"
                                    className="appointments-ghost-button"
                                    onClick={() => {
                                        setSelectedAppointment(null);
                                        scrollToForm();
                                    }}
                                >
                                    <Plus size={18} />
                                    <span>Nuevo</span>
                                </button>
                            </div>

                            {initialLoading ? (
                                <p>Cargando...</p>
                            ) : appointments.length === 0 ? (
                                <p>No hay turnos registrados.</p>
                            ) : (
                                <div className="appointments-owner-sections">
                                    <section className="appointments-owner-section">
                                        <div className="appointments-owner-section-header">
                                            <div>
                                                <h3>Próximos turnos</h3>
                                                <p>Turnos confirmados pendientes de atención</p>
                                            </div>

                                            <span>{ownerUpcomingAppointments.length}</span>
                                        </div>

                                        {ownerUpcomingAppointments.length === 0 ? (
                                            <p className="appointments-empty-message">
                                                No tenés turnos próximos.
                                            </p>
                                        ) : (
                                            <div className="appointments-record-list">
                                                {ownerUpcomingAppointments.map(appointment => (
                                                    <AppointmentCard
                                                        key={appointment.appointmentId}
                                                        appointment={appointment}
                                                        owner
                                                        onDelete={handleDelete}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <section className="appointments-owner-section">
                                        <div className="appointments-owner-section-header">
                                            <div>
                                                <h3>Turnos pasados</h3>
                                                <p>Turnos atendidos y cancelados</p>
                                            </div>

                                            <span>{ownerPastAppointments.length}</span>
                                        </div>

                                        {ownerPastAppointments.length === 0 ? (
                                            <p className="appointments-empty-message">
                                                No tenés turnos pasados.
                                            </p>
                                        ) : (
                                            <div className="appointments-record-list">
                                                {ownerPastAppointments.map(appointment => (
                                                    <AppointmentCard
                                                        key={appointment.appointmentId}
                                                        appointment={appointment}
                                                        owner
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </div>
                            )}
                        </Panel>

                        <AppointmentForm
                            ref={formRef}
                            selectedAppointment={selectedAppointment}
                            pets={pets}
                            veterinarians={veterinarians}
                            loading={loading}
                            onSubmit={handleSubmit}
                            onCancelEdit={() => setSelectedAppointment(null)}
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
                                            <h2>Turnos pendientes</h2>
                                            <p>
                                                Seleccioná un turno para registrar la atención médica.
                                            </p>
                                        </div>
                                    </div>

                                    {initialLoading ? (
                                        <p>Cargando turnos...</p>
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
                                    onError={message => {
                                        setError(message);
                                        setSuccess("");
                                    }}
                                />
                            </div>
                        </section>

                        <section className="appointments-content-grid appointments-content-grid--full">
                            <Panel className="appointments-list-panel">
                                <div className="appointments-panel-header">
                                    <div>
                                        <h2>Turnos atendidos</h2>
                                        <p>{appointments.length} turno(s)</p>
                                    </div>
                                </div>

                                {initialLoading ? (
                                    <p>Cargando...</p>
                                ) : appointments.length === 0 ? (
                                    <p>No hay turnos atendidos.</p>
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

                {appointmentToCancel && (
                    <div className="appointments-modal-backdrop">
                        <div
                            className="appointments-confirm-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="appointments-confirm-title"
                        >
                            <div className="appointments-confirm-icon">
                                <CalendarDays size={28} />
                            </div>

                            <h3 id="appointments-confirm-title">
                                Cancelar turno
                            </h3>

                            <p>
                                ¿Querés cancelar este turno
                                {appointmentToCancel.petName
                                    ? ` de ${appointmentToCancel.petName}`
                                    : ""}?
                            </p>

                            <small className="appointments-confirm-help">
                                El turno quedará registrado como cancelado y el horario volverá a estar disponible.
                            </small>

                            <div className="appointments-confirm-actions">
                                <button
                                    type="button"
                                    className="appointments-confirm-button appointments-confirm-button--cancel"
                                    onClick={() => setAppointmentToCancel(null)}
                                    disabled={loading}
                                >
                                    Volver
                                </button>

                                <button
                                    type="button"
                                    className="appointments-confirm-button appointments-confirm-button--danger"
                                    onClick={handleConfirmDelete}
                                    disabled={loading}
                                >
                                    {loading ? "Cancelando..." : "Cancelar turno"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default AppointmentsPage;