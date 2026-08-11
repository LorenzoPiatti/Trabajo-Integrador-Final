import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Syringe } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import { getAdministeredVaccines } from "../../../services/vaccineService";
import VaccineCard from "../components/VaccineCard";
import "../styles/Vaccines.css";

const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
};

const isOverdue = (nextDueDate) => {
    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < getToday();
};

function Vaccines() {

    const token = localStorage.getItem("token");

    const [administeredVaccines, setAdministeredVaccines] =
        useState([]);

    const [initialLoading, setInitialLoading] =
        useState(Boolean(token));

    const [error, setError] = useState("");

    const loadData = useCallback(async () => {

        setInitialLoading(true);
        setError("");

        try {

            const data =
                await getAdministeredVaccines();

            setAdministeredVaccines(
                data ?? []
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setInitialLoading(false);
        }

    }, []);

    useEffect(() => {

        if (!token) return;

        const timeoutId = window.setTimeout(() => {
            loadData();
        }, 0);

        return () => window.clearTimeout(timeoutId);

    }, [token, loadData]);

    const overdueCount =
        administeredVaccines.filter(vaccine =>
            isOverdue(vaccine.nextDueDate)
        ).length;

    const activeCount =
        administeredVaccines.length - overdueCount;

    if (!token) {

        return (

            <main className="vaccines-auth-page">

                <section className="vaccines-auth-card">

                    <div className="vaccines-auth-icon">
                        <Syringe size={30} />
                    </div>

                    <h1>
                        Mis vacunas
                    </h1>

                    <p>
                        Iniciá sesión para consultar las vacunas de tus mascotas.
                    </p>

                    <Link
                        className="vaccines-primary-button"
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
            title="Vacunas"
            subtitle="Consultá las vacunas aplicadas a tus mascotas"
        >

            <div className="vaccines-dashboard">

                <section className="vaccines-summary-grid">

                    <StatCard
                        title="Aplicadas"
                        value={administeredVaccines.length}
                        color="#A3C1AD"
                        icon={<Syringe />}
                    />

                    <StatCard
                        title="Al día"
                        value={activeCount}
                        color="#7FB3D5"
                        icon={<CheckCircle2 />}
                    />

                    <StatCard
                        title="Vencidas"
                        value={overdueCount}
                        color="#E57373"
                        icon={<AlertTriangle />}
                    />

                </section>

                {error && (

                    <section className="vaccines-status vaccines-status--error">
                        {error}
                    </section>

                )}

                <section className="vaccines-content-grid">

                    <Panel className="vaccines-list-panel">

                        <div className="vaccines-panel-header">

                            <div>

                                <h2>
                                    Vacunas aplicadas
                                </h2>

                                <p>
                                    {administeredVaccines.length} registro(s)
                                </p>

                            </div>

                        </div>

                        {
                            initialLoading

                                ? (
                                    <p className="vaccines-empty-state">
                                        Cargando vacunas...
                                    </p>
                                )

                                : administeredVaccines.length === 0

                                    ? (
                                        <div className="vaccines-empty-state vaccines-empty-state--center">

                                            <Syringe size={34} />

                                            <p>
                                                No hay vacunas aplicadas registradas.
                                            </p>

                                        </div>
                                    )

                                    : (
                                        <div className="vaccines-record-list">

                                            {administeredVaccines.map(
                                                administeredVaccine => (

                                                    <VaccineCard
                                                        key={
                                                            administeredVaccine.administeredVaccineId
                                                        }
                                                        administeredVaccine={
                                                            administeredVaccine
                                                        }
                                                    />

                                                )
                                            )}

                                        </div>
                                    )
                        }

                    </Panel>

                </section>

            </div>

        </Layout>
    );
}

export default Vaccines;