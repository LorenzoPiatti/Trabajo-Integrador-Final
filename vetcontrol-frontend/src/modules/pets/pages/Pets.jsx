import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    ClipboardList,
    Edit3,
    PawPrint,
    Plus,
    Trash2
} from "lucide-react";
import Layout from "../../../components/layout/Layout";
import Panel from "../../../components/ui/Panel";
import StatCard from "../../../components/ui/StatCard";
import {
    createPet,
    deletePet,
    getPets,
    updatePet
} from "../../../services/petService";
import PetForm from "../components/PetForm";
import "../styles/Pets.css";

const formatDate = (date) => {
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(date));
};

function PetsPage() {
    const token = localStorage.getItem("token");

    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(Boolean(token));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadPets = useCallback(async () => {
        setInitialLoading(true);
        setError("");

        try {
            const data = await getPets();
            setPets(data ?? []);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }

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
            }
            else {
                await createPet(formData);
                setSuccess("Mascota registrada correctamente.");
            }

            setSelectedPet(null);
            await loadPets();

            return true;
        }
        catch (err) {
            setError(err.message);

            return false;
        }
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async (petId) => {
        const confirmed = window.confirm(
            "¿Querés eliminar esta mascota?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await deletePet(petId);
            setSuccess("Mascota eliminada correctamente.");

            if (selectedPet?.petId === petId) {
                setSelectedPet(null);
            }

            await loadPets();
        }
        catch (err) {
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
                        value="0"
                        color="#7FB3D5"
                        icon={<CalendarDays />}
                    />

                    <StatCard
                        title="Historias clínicas"
                        value="0"
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
                                        : `${pets.length} mascotas cargadas`}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="pets-ghost-button"
                                onClick={() => setSelectedPet(null)}
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
                                {pets.map((pet) => (
                                    <article
                                        className="pet-row"
                                        key={pet.petId}
                                    >
                                        <div className="pet-avatar">
                                            <PawPrint size={24} />
                                        </div>

                                        <div className="pet-info">
                                            <h3>{pet.name}</h3>

                                            <p>
                                                {pet.species} · {pet.breed}
                                            </p>

                                            <span>
                                                Nacimiento:{" "}
                                                {formatDate(pet.birthDate)}
                                            </span>

                                            {pet.observations && (
                                                <small>
                                                    {pet.observations}
                                                </small>
                                            )}
                                        </div>

                                        <div className="pet-row-actions">
                                            <button
                                                type="button"
                                                className="pet-icon-button"
                                                title="Editar mascota"
                                                onClick={() =>
                                                    setSelectedPet(pet)
                                                }
                                            >
                                                <Edit3 size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                className="pet-icon-button pet-icon-button--danger"
                                                title="Eliminar mascota"
                                                onClick={() =>
                                                    handleDelete(pet.petId)
                                                }
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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
        </Layout>
    );
}

export default PetsPage;
