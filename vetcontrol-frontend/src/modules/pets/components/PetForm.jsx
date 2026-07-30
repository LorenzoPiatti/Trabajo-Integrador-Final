import { useState } from "react";

const emptyForm = {
    name: "",
    species: "",
    breed: "",
    birthDate: "",
    observations: ""
};

const toInputDate = (date) => {
    return date ? date.slice(0, 10) : "";
};

const getInitialFormData = (selectedPet) => {
    if (!selectedPet) {
        return emptyForm;
    }

    return {
        name: selectedPet.name,
        species: selectedPet.species,
        breed: selectedPet.breed,
        birthDate: toInputDate(selectedPet.birthDate),
        observations: selectedPet.observations ?? ""
    };
};

function PetForm({
    selectedPet,
    loading,
    onSubmit,
    onCancelEdit
}) {
    const [formData, setFormData] = useState(() =>
        getInitialFormData(selectedPet));

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const saved = await onSubmit({
            ...formData,
            birthDate: formData.birthDate
        });

        if (saved && !selectedPet) {
            setFormData(emptyForm);
        }
    };

    return (
        <form className="pet-form" onSubmit={handleSubmit}>
            <div className="pet-form__header">
                <div>
                    <span className="section-label">
                        Mascota
                    </span>

                    <h2>
                        {selectedPet
                            ? "Editar mascota"
                            : "Registrar mascota"}
                    </h2>
                </div>

                {selectedPet && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancelEdit}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            <label>
                Nombre
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength="100"
                    required
                />
            </label>

            <label>
                Especie
                <input
                    type="text"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    maxLength="50"
                    placeholder="Perro, gato, conejo..."
                    required
                />
            </label>

            <label>
                Raza
                <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    maxLength="100"
                    required
                />
            </label>

            <label>
                Fecha de nacimiento
                <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Observaciones
                <textarea
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Notas importantes, alergias o cuidados especiales"
                />
            </label>

            <button
                type="submit"
                className="primary-button"
                disabled={loading}
            >
                {loading
                    ? "Guardando..."
                    : selectedPet
                        ? "Actualizar mascota"
                        : "Guardar mascota"}
            </button>
        </form>
    );
}

export default PetForm;
