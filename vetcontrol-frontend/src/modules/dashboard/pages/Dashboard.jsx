import Layout from "../../../components/layout/Layout";
import StatCard from "../../../components/ui/StatCard";

import QuickActions from "../components/QuickActions";
import UpcomingAppointments from "../components/UpcomingAppointments";
import RecentPets from "../components/RecentPets";

import "../styles/Dashboard.css";

import {
    PawPrint,
    CalendarDays,
    Syringe,
    Bell
} from "lucide-react";

function Dashboard() {
    return (
        <Layout>

            <div className="dashboard">

                {/* Cards superiores */}

                <div className="dashboard-cards">

                    <StatCard
                        title="Mascotas"
                        value="128"
                        color="#A3C1AD"
                        icon={<PawPrint />}
                    />

                    <StatCard
                        title="Turnos Hoy"
                        value="12"
                        color="#7FB3D5"
                        icon={<CalendarDays />}
                    />

                    <StatCard
                        title="Vacunas Pendientes"
                        value="31"
                        color="#E8B86D"
                        icon={<Syringe />}
                    />

                    <StatCard
                        title="Recordatorios"
                        value="8"
                        color="#E57373"
                        icon={<Bell />}
                    />

                </div>

                {/* Primera fila */}

                <div className="dashboard-grid">

                    <UpcomingAppointments />

                    <QuickActions />

                </div>

                {/* Segunda fila */}

                <div className="dashboard-grid">

                    <RecentPets />

                </div>

            </div>

        </Layout>
    );
}

export default Dashboard;