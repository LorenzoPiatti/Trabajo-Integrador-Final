import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, FileText, CheckCircle2 } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import { getPendingAppointments, getCompletedAppointments } from "../../../services/appointmentService";
import { isVeterinarian } from "../../../utils/authUtils";
import MedicalRecordList from "../components/MedicalRecordList";
import MedicalRecordForm from "../components/MedicalRecordForm";
import MedicalHistoryList from "../components/MedicalHistoryList";

import "../styles/MedicalRecords.css";

function MedicalRecords() {
    const token = localStorage.getItem("token");
    const veterinarian = isVeterinarian();

    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [completedAppointments, setCompletedAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [historyRefresh, setHistoryRefresh] = useState(0);

    const [initialLoading, setInitialLoading] = useState(Boolean(token));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = useCallback(async () => {
        if (!veterinarian) {
            setInitialLoading(false);
            return;
        }

        setInitialLoading(true);
        setError("");

        try {
            const [pending, completed] = await Promise.all([
                getPendingAppointments(),
                getCompletedAppointments()
            ]);

            setPendingAppointments(pending ?? []);
            setCompletedAppointments(completed ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setInitialLoading(false);
        }
    }, [veterinarian]);

    useEffect(() => {
        if (!token) return;

        const timeoutId = window.setTimeout(() => {
            loadData();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [token, loadData]);

    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setError("");
        setSuccess("");
    };

    const handleSuccess = async (message) => {
        setSuccess(message);
        setError("");
        setSelectedAppointment(null);

        await loadData();
        setHistoryRefresh((value) => value + 1);
    };

    if (!token) {
        return (
            <main className="appointments-auth-page">
                <section className="appointments-auth-card">
                    <div className="appointments-auth-icon">
                        <FileText size={30} />
                    </div>

                    <h1>Historial Médico</h1>
                    <p>Iniciá sesión para acceder.</p>

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
            title="Historial Médico"
            subtitle={
                veterinarian
                    ? "Registrá atenciones y consultá el historial clínico"
                    : "Consultá el historial clínico de tus mascotas"
            }
        >
            <div className="medical-records-dashboard">
                {veterinarian && (
                    <>
                        <section className="medical-records-summary">
                            <StatCard
                                title="Pendientes"
                                value={pendingAppointments.length}
                                color="#E8B86D"
                                icon={<ClipboardList />}
                            />

                            <StatCard
                                title="Atenciones"
                                value={completedAppointments.length}
                                color="#A3C1AD"
                                icon={<CheckCircle2 />}
                            />
                        </section>

                        {(error || success) && (
                            <section
                                className={
                                    error
                                        ? "medical-record-status medical-record-status--error"
                                        : "medical-record-status medical-record-status--success"
                                }
                            >
                                {error || success}
                            </section>
                        )}

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
                                            onSelect={handleSelectAppointment}
                                        />
                                    )}
                                </Panel>

                                <MedicalRecordForm
                                    selectedAppointment={selectedAppointment}
                                    onSuccess={handleSuccess}
                                    onError={(message) => {
                                        setError(message);
                                        setSuccess("");
                                    }}
                                />
                            </div>
                        </section>
                    </>
                )}
                <section className="medical-record-section">
                    <MedicalHistoryList
                        veterinarian={veterinarian}
                        refreshKey={historyRefresh}
                    />
                </section>
            </div>
        </Layout>
    );
}

export default MedicalRecords;
