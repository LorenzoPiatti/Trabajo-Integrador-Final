import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, Edit3, PawPrint, Plus, Trash2 } from "lucide-react";

import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";

import { createPet, deletePet, getPets, updatePet } from "../../../services/petService";
import { getAppointments } from "../../../services/appointmentService";
import { getPetHistory } from "../../../services/medicalRecordService";

import PetForm from "../components/PetForm";

import "../styles/Pets.css";

const formatDate = (date) => {
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(date));
};

const isConfirmed = (status) => {
    const normalizedStatus = status?.toLowerCase();

    return (
        normalizedStatus === "confirmed" ||
        normalizedStatus === "confirmado"
    );
};

function PetsPage() {
    const token = localStorage.getItem("token");

    const [pets, setPets] = useState([]);
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        medicalRecords: 0
    });

    const [selectedPet, setSelectedPet] = useState(null);
    const [petToDelete, setPetToDelete] = useState(null);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(Boolean(token));

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!success) return;

        const timeoutId = window.setTimeout(() => {
            setSuccess("");
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [success]);

    const loadPets = useCallback(async () => {
        setInitialLoading(true);
        setError("");

        try {
            const petsData = await getPets();
            const petList = petsData ?? [];

            setPets(petList);

            const appointmentsData = await getAppointments();

            const upcomingAppointments = (appointmentsData ?? []).filter(
                appointment =>
                    isConfirmed(appointment.status) &&
                    new Date(appointment.dateTime) >= new Date()
            ).length;

            const histories = await Promise.all(
                petList.map(pet => getPetHistory(pet.petId))
            );

            const medicalRecords = histories.reduce(
                (total, history) =>
                    total + (Array.isArray(history) ? history.length : 0),
                0
            );

            setStats({
                upcomingAppointments,
                medicalRecords
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        const timeoutId = window.setTimeout(() => {
            loadPets();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [token, loadPets]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (selectedPet) {
                await updatePet(selectedPet.petId, formData);
                setSuccess("Mascota actualizada correctamente.");
            } else {
                await createPet(formData);
                setSuccess("Mascota registrada correctamente.");
            }

            setSelectedPet(null);
            await loadPets();

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleNewPet = () => {
        setError("");
        setSuccess("");
        setSelectedPet(null);
    };

    const handleEditPet = (pet) => {
        setError("");
        setSuccess("");
        setSelectedPet(pet);
    };

    const handleDelete = (pet) => {
        setError("");
        setSuccess("");
        setPetToDelete(pet);
    };

    const handleConfirmDelete = async () => {
        if (!petToDelete) return;

        setError("");
        setSuccess("");

        try {
            await deletePet(petToDelete.petId);
            setSuccess("Mascota eliminada correctamente.");

            if (selectedPet?.petId === petToDelete.petId) {
                setSelectedPet(null);
            }

            setPetToDelete(null);
            await loadPets();
        } catch (err) {
            setPetToDelete(null);
            setError(err.message);
        }
    };

    if (!token) {
        return (
            <main className="pets-auth-page">
                <section className="pets-auth-card">
                    <div className="pets-auth-icon">
                        <PawPrint size={30} />
                    </div>

                    <h1>Mis mascotas</h1>

                    <p>
                        Iniciá sesión para registrar y consultar tus mascotas.
                    </p>

                    <Link className="pets-primary-button" to="/">
                        Ir al inicio de sesión
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <Layout
            title="Mascotas"
            subtitle="Gestioná las mascotas registradas"
        >
            <div className="pets-dashboard">
                <section className="pets-summary-grid">
                    <StatCard
                        title="Mascotas"
                        value={pets.length}
                        color="#A3C1AD"
                        icon={<PawPrint />}
                    />

                    <StatCard
                        title="Próximos turnos"
                        value={stats.upcomingAppointments}
                        color="#7FB3D5"
                        icon={<CalendarDays />}
                    />

                    <StatCard
                        title="Atenciones registradas"
                        value={stats.medicalRecords}
                        color="#E8B86D"
                        icon={<ClipboardList />}
                    />
                </section>

                {(error || success) && (
                    <section
                        className={
                            error
                                ? "pets-status pets-status--error"
                                : "pets-status pets-status--success"
                        }
                    >
                        {error || success}
                    </section>
                )}

                <section className="pets-content-grid">
                    <Panel className="pets-list-panel">
                        <div className="pets-panel-header">
                            <div>
                                <h2>Mis mascotas</h2>

                                <p>
                                    {pets.length === 1
                                        ? "1 mascota cargada"
                                        : `${pets.length} mascotas cargadas`
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                className="pets-ghost-button"
                                onClick={handleNewPet}
                            >
                                <Plus size={18} />
                                <span>Nueva</span>
                            </button>
                        </div>

                        {initialLoading ? (
                            <p className="pets-empty-state">
                                Cargando mascotas...
                            </p>
                        ) : pets.length === 0 ? (
                            <div className="pets-empty-state pets-empty-state--center">
                                <PawPrint size={42} />
                                <p>Todavía no registraste mascotas.</p>
                            </div>
                        ) : (
                            <div className="pets-record-list">
                                {pets.map(pet => (
                                    <article
                                        className="pet-row"
                                        key={pet.petId}
                                    >
                                        <div className="pet-row-main">
                                            <div className="pet-card-main">
                                                <div className="pet-avatar">
                                                    <PawPrint size={24} />
                                                </div>

                                                <div className="pet-info">
                                                    <div className="pet-card-heading">
                                                        <h3>{pet.name}</h3>

                                                        <span className="pet-species-badge">
                                                            {pet.species}
                                                        </span>
                                                    </div>

                                                    <div className="pet-details">
                                                        <span>{pet.breed}</span>

                                                        <span className="pet-detail-date">
                                                            <CalendarDays size={14} />
                                                            Nacimiento:{" "}
                                                            {formatDate(pet.birthDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pet-row-actions">
                                                <button
                                                    type="button"
                                                    className="pet-icon-button"
                                                    title="Editar mascota"
                                                    onClick={() => handleEditPet(pet)}
                                                >
                                                    <Edit3 size={18} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="pet-icon-button pet-icon-button--danger"
                                                    title="Eliminar mascota"
                                                    onClick={() => handleDelete(pet)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {pet.observations && (
                                            <div className="pet-note-row">
                                                <p className="pet-note">
                                                    {pet.observations}
                                                </p>
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <PetForm
                        key={selectedPet?.petId ?? "new-pet"}
                        selectedPet={selectedPet}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancelEdit={() => setSelectedPet(null)}
                    />
                </section>
            </div>

            {petToDelete && (
                <div
                    className="pets-modal-backdrop"
                    onClick={() => setPetToDelete(null)}
                >
                    <div
                        className="pets-confirm-modal"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="pets-confirm-icon">
                            <Trash2 size={26} />
                        </div>

                        <h3>Eliminar mascota</h3>

                        <p>
                            ¿Querés eliminar a <strong>{petToDelete.name}</strong>?
                        </p>

                        <span>
                            Esta acción no se puede deshacer.
                        </span>

                        <div className="pets-confirm-actions">
                            <button
                                type="button"
                                className="pets-secondary-button"
                                onClick={() => setPetToDelete(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="pets-danger-button"
                                onClick={handleConfirmDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default PetsPage;