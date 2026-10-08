import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    Bell,
    CalendarDays,
    ClipboardList,
    FileText,
    PawPrint,
    ShieldCheck,
    Stethoscope,
    Syringe,
    UserCheck,
    Users,
    UserX
} from "lucide-react";

import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";

import {
    getAppointments,
    getCompletedAppointments,
    getPendingAppointments,
    getReceptionAppointments
} from "../../../services/appointmentService";

import { getMedicalRecordPets } from "../../../services/medicalRecordService";
import { getPets } from "../../../services/petService";
import { getUnreadReminderCount } from "../../../services/reminderService";

import {
    getUsers,
    getVeterinarians
} from "../../../services/userService";

import {
    getAdministeredVaccines,
    getVaccines
} from "../../../services/vaccineService";

import { getUserRole } from "../../../utils/authUtils";

import "../styles/Dashboard.css";

const isToday = (date) => {

    const currentDate = new Date(date);
    const today = new Date();

    return (
        currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getDate() === today.getDate()
    );

};

const isCancelled = (status) => {

    const normalizedStatus = status?.toLowerCase();

    return (
        normalizedStatus === "cancelled" ||
        normalizedStatus === "cancelado"
    );

};

const isConfirmed = (status) => {

    const normalizedStatus = status?.toLowerCase();

    return (
        normalizedStatus === "confirmed" ||
        normalizedStatus === "confirmado"
    );

};

const isVaccineDue = (nextDueDate) => {

    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate <= today;

};

const LOW_STOCK_LIMIT = 2;

const getUpcomingAppointments = (appointments, limit = 3) => {

    return appointments
        .filter((appointment) => {
            return (
                new Date(appointment.dateTime) >= new Date() &&
                !isCancelled(appointment.status)
            );
        })
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .slice(0, limit);

};

const formatAppointmentDate = (date) => {

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));

};

function DashboardActions({
    title = "Acciones rápidas",
    actions
}) {

    const navigate = useNavigate();

    return (

        <Panel>

            <h3 className="dashboard-panel-title">
                {title}
            </h3>

            <div className="dashboard-actions-grid">

                {actions.map((action) => (

                    <button
                        key={action.title}
                        type="button"
                        className="dashboard-action-card"
                        onClick={() => navigate(action.path)}
                    >

                        {action.icon}

                        <span>
                            {action.title}
                        </span>

                    </button>

                ))}

            </div>

        </Panel>

    );

}

function AppointmentPreview({
    title,
    appointments,
    emptyText,
    actionPath = "/appointments",
    showOwner = false
}) {

    const navigate = useNavigate();

    return (

        <Panel>

            <div className="dashboard-panel-header">

                <div>

                    <h3>
                        {title}
                    </h3>

                    <p>
                        {appointments.length} turno(s)
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate(actionPath)}
                >
                    Ver todos
                </button>

            </div>

            {appointments.length === 0 ? (

                <p className="dashboard-empty">
                    {emptyText}
                </p>

            ) : (

                <div className="dashboard-preview-list">

                    {appointments.map((appointment) => (

                        <article
                            key={appointment.appointmentId}
                            className="dashboard-preview-row"
                        >

                            <div className="dashboard-preview-icon">

                                <CalendarDays size={18} />

                            </div>

                            <div>

                                <strong>
                                    {appointment.petName}
                                </strong>

                                <span>
                                    {
                                        showOwner &&
                                        appointment.ownerName
                                            ? `${appointment.ownerName} · ${appointment.reason || "Sin motivo"}`
                                            : appointment.reason
                                    }
                                </span>

                            </div>

                            <small>
                                {formatAppointmentDate(
                                    appointment.dateTime
                                )}
                            </small>

                        </article>

                    ))}

                </div>

            )}

        </Panel>

    );

}

function OwnerDashboard() {

    const [stats, setStats] = useState({
        pets: 0,
        appointmentsToday: 0,
        pendingVaccines: 0,
        reminders: 0
    });

    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const [
                    petsData,
                    appointmentsData,
                    vaccinesData,
                    unreadReminders
                ] = await Promise.all([
                    getPets(),
                    getAppointments(),
                    getAdministeredVaccines(),
                    getUnreadReminderCount()
                ]);

                setPets(petsData ?? []);
                setAppointments(appointmentsData ?? []);

                setStats({
                    pets: petsData?.length ?? 0,

                    appointmentsToday: (appointmentsData ?? [])
                        .filter((appointment) =>
                            isToday(appointment.dateTime) &&
                            !isCancelled(appointment.status)
                        ).length,

                    pendingVaccines: (vaccinesData ?? [])
                        .filter((vaccine) =>
                            isVaccineDue(vaccine.nextDueDate)
                        ).length,

                    reminders:
                        typeof unreadReminders === "number"
                            ? unreadReminders
                            : unreadReminders?.unreadCount ??
                            unreadReminders?.count ??
                            0
                });

            }
            catch (error) {

                console.error(
                    "Error al cargar inicio owner:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    const upcomingAppointments =
        useMemo(
            () => getUpcomingAppointments(
                appointments,
                3
            ),
            [appointments]
        );

    return (
        <>

            <section className="dashboard-cards">

                <StatCard
                    title="Mascotas"
                    value={loading ? "..." : stats.pets}
                    color="#A3C1AD"
                    icon={<PawPrint />}
                />

                <StatCard
                    title="Turnos hoy"
                    value={
                        loading
                            ? "..."
                            : stats.appointmentsToday
                    }
                    color="#7FB3D5"
                    icon={<CalendarDays />}
                />

                <StatCard
                    title="Vacunas pendientes"
                    value={
                        loading
                            ? "..."
                            : stats.pendingVaccines
                    }
                    color="#E8B86D"
                    icon={<Syringe />}
                />

                <StatCard
                    title="Recordatorios"
                    value={
                        loading
                            ? "..."
                            : stats.reminders
                    }
                    color="#E57373"
                    icon={<Bell />}
                />

            </section>

            <section className="dashboard-grid">

                <AppointmentPreview
                    title="Próximos turnos"
                    appointments={upcomingAppointments}
                    emptyText="No tenés turnos programados."
                />

                <DashboardActions
                    actions={[
                        {
                            title: "Nuevo turno",
                            path: "/appointments",
                            icon: <CalendarDays size={22} />
                        },
                        {
                            title: "Mis mascotas",
                            path: "/pets",
                            icon: <PawPrint size={22} />
                        },
                        {
                            title: "Vacunas",
                            path: "/vaccines",
                            icon: <Syringe size={22} />
                        },
                        {
                            title: "Historial",
                            path: "/medical-records",
                            icon: <FileText size={22} />
                        }
                    ]}
                />

            </section>

            <Panel>

                <div className="dashboard-panel-header">

                    <div>

                        <h3>
                            Mis mascotas
                        </h3>

                        <p>
                            {pets.length} mascota(s)
                        </p>

                    </div>

                </div>

                {pets.length === 0 ? (

                    <p className="dashboard-empty">
                        No tenés mascotas registradas.
                    </p>

                ) : (

                    <div className="dashboard-preview-list dashboard-preview-list--grid">

                        {pets.slice(0, 4).map((pet) => (

                            <article
                                key={pet.petId}
                                className="dashboard-preview-row"
                            >

                                <div className="dashboard-preview-icon">

                                    <PawPrint size={18} />

                                </div>

                                <div>

                                    <strong>
                                        {pet.name}
                                    </strong>

                                    <span>
                                        {pet.species}
                                        {pet.breed
                                            ? ` · ${pet.breed}`
                                            : ""
                                        }
                                    </span>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </Panel>

        </>
    );

}

function VeterinarianDashboard() {

    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [completedAppointments, setCompletedAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const [
                    pendingData,
                    completedData,
                    patientsData
                ] = await Promise.all([
                    getPendingAppointments(),
                    getCompletedAppointments(),
                    getMedicalRecordPets()
                ]);

                setPendingAppointments(pendingData ?? []);
                setCompletedAppointments(completedData ?? []);
                setPatients(patientsData ?? []);

            }
            catch (error) {

                console.error(
                    "Error al cargar inicio veterinario:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    const appointmentsToday =
        pendingAppointments.filter((appointment) =>
            isToday(appointment.dateTime)
        ).length;

    return (
        <>

            <section className="dashboard-cards">

                <StatCard
                    title="Turnos hoy"
                    value={
                        loading
                            ? "..."
                            : appointmentsToday
                    }
                    color="#7FB3D5"
                    icon={<CalendarDays />}
                />

                <StatCard
                    title="Pendientes"
                    value={
                        loading
                            ? "..."
                            : pendingAppointments.length
                    }
                    color="#E8B86D"
                    icon={<ClipboardList />}
                />

                <StatCard
                    title="Atendidos"
                    value={
                        loading
                            ? "..."
                            : completedAppointments.length
                    }
                    color="#A3C1AD"
                    icon={<Stethoscope />}
                />

                <StatCard
                    title="Pacientes"
                    value={
                        loading
                            ? "..."
                            : patients.length
                    }
                    color="#8E7CC3"
                    icon={<PawPrint />}
                />

            </section>

            <section className="dashboard-grid">

                <AppointmentPreview
                    title="Próximas atenciones"
                    appointments={
                        getUpcomingAppointments(
                            pendingAppointments,
                            4
                        )
                    }
                    emptyText="No hay atenciones pendientes."
                />

                <DashboardActions
                    actions={[
                        {
                            title: "Turnos",
                            path: "/appointments",
                            icon: <CalendarDays size={22} />
                        },
                        {
                            title: "Historial médico",
                            path: "/medical-records",
                            icon: <FileText size={22} />
                        }
                    ]}
                />

            </section>

        </>
    );

}

function ReceptionDashboard() {

    const [appointments, setAppointments] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

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
            catch (error) {

                console.error(
                    "Error al cargar inicio recepción:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    const confirmedTodayAppointments =
        useMemo(
            () => appointments
                .filter((appointment) =>
                    isToday(appointment.dateTime) &&
                    isConfirmed(appointment.status)
                )
                .sort((a, b) =>
                    new Date(a.dateTime) -
                    new Date(b.dateTime)
                ),
            [appointments]
        );

    const upcomingAppointments =
        useMemo(
            () => appointments
                .filter((appointment) =>
                    isConfirmed(appointment.status) &&
                    new Date(appointment.dateTime) >= new Date()
                ),
            [appointments]
        );

    return (
        <>

            <section className="dashboard-cards dashboard-cards--three">

                <StatCard
                    title="Confirmados hoy"
                    value={
                        loading
                            ? "..."
                            : confirmedTodayAppointments.length
                    }
                    color="#7FB3D5"
                    icon={<CalendarDays />}
                />

                <StatCard
                    title="Próximos"
                    value={
                        loading
                            ? "..."
                            : upcomingAppointments.length
                    }
                    color="#E8B86D"
                    icon={<ClipboardList />}
                />

                <StatCard
                    title="Veterinarios"
                    value={
                        loading
                            ? "..."
                            : veterinarians.length
                    }
                    color="#A3C1AD"
                    icon={<Stethoscope />}
                />

            </section>

            <section className="dashboard-grid">

                <AppointmentPreview
                    title="Turnos confirmados de hoy"
                    appointments={confirmedTodayAppointments}
                    emptyText="No hay turnos confirmados para hoy."
                    showOwner
                />

                <DashboardActions
                    actions={[
                        {
                            title: "Turnos",
                            path: "/appointments",
                            icon: <CalendarDays size={22} />
                        },
                        {
                            title: "Perfil",
                            path: "/profile",
                            icon: <UserCheck size={22} />
                        }
                    ]}
                />

            </section>

        </>
    );

}

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const [
                    usersData,
                    vaccinesData
                ] = await Promise.all([
                    getUsers(),
                    getVaccines()
                ]);

                setUsers(usersData ?? []);
                setVaccines(vaccinesData ?? []);

            }
            catch (error) {

                console.error(
                    "Error al cargar inicio admin:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    const activeUsers =
        users.filter((user) => user.active).length;

    const inactiveUsers =
        users.length - activeUsers;

    const lowStockVaccines =
        vaccines.filter((vaccine) =>
            vaccine.stock <= LOW_STOCK_LIMIT
        );

    return (
        <>

            <section className="dashboard-cards">

                <StatCard
                    title="Usuarios"
                    value={
                        loading
                            ? "..."
                            : users.length
                    }
                    color="#A3C1AD"
                    icon={<Users />}
                />

                <StatCard
                    title="Activos"
                    value={
                        loading
                            ? "..."
                            : activeUsers
                    }
                    color="#7FB3D5"
                    icon={<UserCheck />}
                />

                <StatCard
                    title="Inactivos"
                    value={
                        loading
                            ? "..."
                            : inactiveUsers
                    }
                    color="#E57373"
                    icon={<UserX />}
                />

                <StatCard
                    title="Stock bajo"
                    value={
                        loading
                            ? "..."
                            : lowStockVaccines.length
                    }
                    color="#E8B86D"
                    icon={<Syringe />}
                />

            </section>

            <section className="dashboard-grid">

                <Panel>

                    <div className="dashboard-panel-header">

                        <div>

                            <h3>
                                Vacunas con stock bajo
                            </h3>

                            <p>
                                {lowStockVaccines.length} alerta(s)
                            </p>

                        </div>

                    </div>

                    {lowStockVaccines.length === 0 ? (

                        <p className="dashboard-empty">
                            No hay vacunas con stock bajo.
                        </p>

                    ) : (

                        <div className="dashboard-preview-list">

                            {lowStockVaccines
                                .slice(0, 4)
                                .map((vaccine) => (

                                    <article
                                        key={vaccine.vaccineId}
                                        className="dashboard-preview-row"
                                    >

                                        <div className="dashboard-preview-icon">

                                            <Syringe size={18} />

                                        </div>

                                        <div>

                                            <strong>
                                                {vaccine.name}
                                            </strong>

                                            <span>
                                                Stock actual: {vaccine.stock}
                                            </span>

                                        </div>

                                    </article>

                                ))}

                        </div>

                    )}

                </Panel>

                <DashboardActions
                    actions={[
                        {
                            title: "Usuarios",
                            path: "/users",
                            icon: <ShieldCheck size={22} />
                        },
                        {
                            title: "Perfil",
                            path: "/profile",
                            icon: <UserCheck size={22} />
                        }
                    ]}
                />

            </section>

        </>
    );

}

function FallbackDashboard() {

    return (

        <Panel>

            <div className="dashboard-panel-header">

                <div>

                    <h3>
                        Inicio
                    </h3>

                    <p>
                        Tu veterinaria digital
                    </p>

                </div>

            </div>

            <p className="dashboard-empty">
                No se pudo identificar el rol del usuario.
            </p>

        </Panel>

    );

}

function Dashboard() {

    const role = getUserRole();

    const contentByRole = {
        Owner: <OwnerDashboard />,
        Veterinarian: <VeterinarianDashboard />,
        Reception: <ReceptionDashboard />,
        Admin: <AdminDashboard />
    };

    return (

        <Layout>

            <div className="dashboard">

                {contentByRole[role] ?? <FallbackDashboard />}

            </div>

        </Layout>

    );

}

export default Dashboard;