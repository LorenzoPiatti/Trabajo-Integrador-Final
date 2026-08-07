import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
    AlertTriangle,
    CheckCircle2,
    Plus,
    Syringe
} from "lucide-react";

import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";

import { getPets } from "../../../services/petService";
import { getVeterinarians } from "../../../services/userService";

import {
    createAdministeredVaccine,
    deleteAdministeredVaccine,
    getAdministeredVaccines,
    getVaccines,
    updateAdministeredVaccine
} from "../../../services/vaccineService";

import VaccineCard from "../components/VaccineCard";
import VaccineForm from "../components/VaccineForm";

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
    const [vaccines, setVaccines] = useState([]);
    const [pets, setPets] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);

    const [selectedVaccine, setSelectedVaccine] = useState(null);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(Boolean(token));

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const formRef = useRef(null);

    const loadData = useCallback(async () => {
        setInitialLoading(true);

        try {
            const [
                administeredData,
                vaccinesData,
                petsData,
                veterinariansData
            ] = await Promise.all([
                getAdministeredVaccines(),
                getVaccines(),
                getPets(),
                getVeterinarians()
            ]);

            setError("");
            setAdministeredVaccines(administeredData ?? []);
            setVaccines(vaccinesData ?? []);
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
            if (selectedVaccine) {
                await updateAdministeredVaccine(
                    selectedVaccine.administeredVaccineId,
                    formData
                );

                setSuccess("Vacuna actualizada correctamente.");
            } else {
                await createAdministeredVaccine(formData);

                setSuccess("Vacuna registrada correctamente.");
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

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Desea eliminar esta vacuna aplicada?"
        );

        if (!confirmed) return;

        try {
            await deleteAdministeredVaccine(id);

            setSuccess("Vacuna eliminada correctamente.");

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

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

                    <h1>Mis vacunas</h1>

                    <p>
                        Inicia sesion para administrar las vacunas de tus mascotas.
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
            subtitle="Gestiona la vacunacion de tus mascotas"
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
                        title="Al dia"
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

                            <button
                                type="button"
                                className="vaccines-ghost-button"
                                onClick={() => {
                                    setSelectedVaccine(null);
                                    scrollToForm();
                                }}
                            >
                                <Plus size={18} />

                                <span>
                                    Nueva
                                </span>
                            </button>
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
                                                No hay vacunas registradas.
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
                                                        onEdit={(vaccine) => {
                                                            setSelectedVaccine(
                                                                vaccine
                                                            );

                                                            scrollToForm();
                                                        }}
                                                        onDelete={
                                                            handleDelete
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    )
                        }
                    </Panel>

                    <VaccineForm
                        ref={formRef}
                        selectedVaccine={selectedVaccine}
                        pets={pets}
                        vaccines={vaccines}
                        veterinarians={veterinarians}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancelEdit={() =>
                            setSelectedVaccine(null)
                        }
                    />
                </section>
            </div>
        </Layout>
    );
}

export default Vaccines;
