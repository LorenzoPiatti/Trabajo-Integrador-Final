import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Package, Plus, Syringe } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import { createVaccine, deleteVaccine, getAdministeredVaccines, getVaccines, updateVaccine } from "../../../services/vaccineService";
import { isAdmin } from "../../../utils/authUtils";
import AdminVaccineCard from "../components/AdminVaccineCard";
import AdminVaccineForm from "../components/AdminVaccineForm";
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

    const admin = isAdmin();

    const [administeredVaccines, setAdministeredVaccines] =
        useState([]);

    const [vaccines, setVaccines] = useState([]);

    const [selectedVaccine, setSelectedVaccine] = useState(null);

    const [initialLoading, setInitialLoading] =
        useState(Boolean(token));

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    useEffect(() => {

        if (!success) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSuccess("");
        }, 3000);

        return () => window.clearTimeout(timeoutId);

    }, [success]);


    const loadData = useCallback(async () => {

        setInitialLoading(true);

        setError("");

        try {

            if (admin) {

                const data =
                    await getVaccines();

                setVaccines(
                    data ?? []
                );

                return;
            }

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

    }, [admin]);


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


    const totalStock =
        vaccines.reduce(
            (total, vaccine) => total + vaccine.stock,
            0
        );


    const lowStockCount =
        vaccines.filter(vaccine =>
            vaccine.stock <= 2
        ).length;


    const availableVaccinesCount =
        vaccines.filter(vaccine =>
            vaccine.stock > 0
        ).length;


    const handleAdminSubmit = async (formData) => {

        setLoading(true);

        setError("");

        setSuccess("");

        try {

            if (selectedVaccine) {

                await updateVaccine(
                    selectedVaccine.vaccineId,
                    formData
                );

                setSuccess(
                    "Vacuna actualizada correctamente."
                );

            } else {

                await createVaccine(formData);

                setSuccess(
                    "Vacuna creada correctamente."
                );
            }

            setSelectedVaccine(null);

            await loadData();

            return true;

        } catch (err) {

            setError(err.message);

            return false;

        } finally {

            setLoading(false);
        }
    };


    const handleAdminDelete = async (vaccineId) => {

        if (!window.confirm(
            "¿Desea eliminar esta vacuna del catálogo?"
        )) {
            return;
        }

        setError("");

        setSuccess("");

        try {

            await deleteVaccine(vaccineId);

            setSuccess(
                "Vacuna eliminada correctamente."
            );

            if (selectedVaccine?.vaccineId === vaccineId) {
                setSelectedVaccine(null);
            }

            await loadData();

        } catch (err) {

            setError(err.message);
        }
    };


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


    if (admin) {

        return (

            <Layout
                title="Vacunas"
                subtitle="Administrá el catálogo y stock disponible"
            >

                <div className="vaccines-dashboard">

                    <section className="vaccines-summary-grid">

                        <StatCard
                            title="Catálogo"
                            value={vaccines.length}
                            color="#A3C1AD"
                            icon={<Syringe />}
                        />

                        <StatCard
                            title="Stock total"
                            value={totalStock}
                            color="#7FB3D5"
                            icon={<Package />}
                        />

                        <StatCard
                            title="Stock bajo"
                            value={lowStockCount}
                            color="#E57373"
                            icon={<AlertTriangle />}
                        />

                    </section>


                    {(error || success) && (

                        <section
                            className={
                                error
                                    ? "vaccines-status vaccines-status--error"
                                    : "vaccines-status vaccines-status--success"
                            }
                        >
                            {error || success}
                        </section>

                    )}


                    <section className="vaccines-content-grid vaccines-content-grid--admin">

                        <Panel className="vaccines-list-panel">

                            <div className="vaccines-panel-header">

                                <div>

                                    <h2>
                                        Catálogo de vacunas
                                    </h2>

                                    <p>
                                        {availableVaccinesCount} disponible(s) de {vaccines.length}
                                    </p>

                                </div>

                                <button
                                    className="vaccines-ghost-button"
                                    type="button"
                                    onClick={() =>
                                        setSelectedVaccine(null)
                                    }
                                >
                                    <Plus size={18} />
                                    <span>Nueva</span>
                                </button>

                            </div>


                            {
                                initialLoading

                                    ? (
                                        <p className="vaccines-empty-state">
                                            Cargando catálogo...
                                        </p>
                                    )

                                    : vaccines.length === 0

                                        ? (
                                            <div className="vaccines-empty-state vaccines-empty-state--center">

                                                <Syringe size={34} />

                                                <p>
                                                    No hay vacunas cargadas en el catálogo.
                                                </p>

                                            </div>
                                        )

                                        : (
                                            <div className="vaccines-record-list">

                                                {vaccines.map(vaccine => (

                                                    <AdminVaccineCard
                                                        key={vaccine.vaccineId}
                                                        vaccine={vaccine}
                                                        onEdit={setSelectedVaccine}
                                                        onDelete={handleAdminDelete}
                                                    />

                                                ))}

                                            </div>
                                        )
                            }

                        </Panel>


                        <AdminVaccineForm
                            key={selectedVaccine?.vaccineId ?? "new-vaccine"}
                            selectedVaccine={selectedVaccine}
                            loading={loading}
                            onSubmit={handleAdminSubmit}
                            onCancelEdit={() =>
                                setSelectedVaccine(null)
                            }
                        />

                    </section>

                </div>

            </Layout>
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