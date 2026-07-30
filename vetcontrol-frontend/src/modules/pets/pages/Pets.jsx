import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
            <main className="pets-page pets-page--centered">
                <section className="auth-required">
                    <span className="section-label">
                        Sesión requerida
                    </span>

                    <h1>Mis mascotas</h1>

                    <p>
                        Iniciá sesión para registrar y consultar tus
                        mascotas.
                    </p>

                    <Link className="primary-button" to="/">
                        Ir al inicio de sesión
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="pets-page">
            <section className="pets-hero">
                <div>
                    <span className="section-label">
                        VetControl
                    </span>

                    <h1>Gestión de mascotas</h1>

                    <p>
                        Registrá, consultá y actualizá las mascotas
                        asociadas a tu cuenta.
                    </p>
                </div>

                <Link className="secondary-button" to="/dashboard">
                    Volver al dashboard
                </Link>
            </section>

            {(error || success) && (
                <section
                    className={
                        error
                            ? "status-message status-message--error"
                            : "status-message status-message--success"
                    }
                >
                    {error || success}
                </section>
            )}

            <section className="pets-workspace">
                <div className="pets-list-panel">
                    <div className="pets-list-header">
                        <div>
                            <span className="section-label">
                                Listado
                            </span>

                            <h2>Mis mascotas</h2>
                        </div>

                        <strong>{pets.length}</strong>
                    </div>

                    {initialLoading ? (
                        <p className="empty-state">
                            Cargando mascotas...
                        </p>
                    ) : pets.length === 0 ? (
                        <p className="empty-state">
                            Todavía no registraste mascotas.
                        </p>
                    ) : (
                        <div className="pets-list">
                            {pets.map((pet) => (
                                <article
                                    className="pet-card"
                                    key={pet.petId}
                                >
                                    <div>
                                        <h3>{pet.name}</h3>

                                        <p>
                                            {pet.species} · {pet.breed}
                                        </p>

                                        <span>
                                            Nacimiento:{" "}
                                            {formatDate(pet.birthDate)}
                                        </span>

                                        {pet.observations && (
                                            <p className="pet-observations">
                                                {pet.observations}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pet-actions">
                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                setSelectedPet(pet)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="danger-button"
                                            onClick={() =>
                                                handleDelete(pet.petId)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                <PetForm
                    key={selectedPet?.petId ?? "new-pet"}
                    selectedPet={selectedPet}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancelEdit={() => setSelectedPet(null)}
                />
            </section>
        </main>
    );
}

export default PetsPage;
