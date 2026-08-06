import Layout from "../../../components/layout/Layout";
import StatCard from "../../../components/ui/StatCard";

import QuickActions from "../components/QuickActions";
import UpcomingAppointments from "../components/UpcomingAppointments";
import RecentPets from "../components/RecentPets";

import { getPets } from "../../../services/petService";
import { getAppointments } from "../../../services/appointmentService";

import { useEffect, useState } from "react";

import "../styles/Dashboard.css";

import {
    PawPrint,
    CalendarDays,
    Syringe,
    Bell
} from "lucide-react";

function Dashboard() {

    const [stats, setStats] = useState({
        pets: 0,
        appointmentsToday: 0,
        pendingVaccines: 0,
        reminders: 0
    });

    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {

        const loadDashboardStats = async () => {

            try {

                const [pets, appointments] = await Promise.all([
                    getPets(),
                    getAppointments()
                ]);

                const today = new Date();

                const appointmentsToday = appointments.filter((appointment) => {

                    const appointmentDate = new Date(appointment.dateTime);

                    const isToday =
                        appointmentDate.getFullYear() === today.getFullYear() &&
                        appointmentDate.getMonth() === today.getMonth() &&
                        appointmentDate.getDate() === today.getDate();

                    const status = appointment.status?.toLowerCase();

                    const isCancelled =
                        status === "cancelled" ||
                        status === "cancelado";

                    return isToday && !isCancelled;

                }).length;

                setStats({
                    pets: pets.length,
                    appointmentsToday,
                    pendingVaccines: 0,
                    reminders: 0
                });

            }
            catch (error) {

                console.error(
                    "Error al obtener las estadísticas del dashboard:",
                    error
                );

            }
            finally {

                setLoadingStats(false);

            }

        };

        loadDashboardStats();

    }, []);

    return (

        <Layout>

            <div className="dashboard">

                <div className="dashboard-cards">

                    <StatCard
                        title="Mascotas"
                        value={loadingStats ? "..." : stats.pets}
                        color="#A3C1AD"
                        icon={<PawPrint />}
                    />

                    <StatCard
                        title="Turnos Hoy"
                        value={
                            loadingStats
                                ? "..."
                                : stats.appointmentsToday
                        }
                        color="#7FB3D5"
                        icon={<CalendarDays />}
                    />

                    <StatCard
                        title="Vacunas Pendientes"
                        value={
                            loadingStats
                                ? "..."
                                : stats.pendingVaccines
                        }
                        color="#E8B86D"
                        icon={<Syringe />}
                    />

                    <StatCard
                        title="Recordatorios"
                        value={
                            loadingStats
                                ? "..."
                                : stats.reminders
                        }
                        color="#E57373"
                        icon={<Bell />}
                    />

                </div>

                <div className="dashboard-grid">

                    <div className="upcoming-section">

                        <UpcomingAppointments />

                    </div>

                    <div className="actions-section">

                        <QuickActions />

                    </div>

                </div>

                <div className="pets-section">

                    <RecentPets />

                </div>

            </div>

        </Layout>

    );

}

export default Dashboard;