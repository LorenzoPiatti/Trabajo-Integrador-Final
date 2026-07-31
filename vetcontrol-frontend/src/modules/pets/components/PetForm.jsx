import { useState } from "react";
import { PawPrint, Save, X } from "lucide-react";
import Panel from "../../../components/ui/Panel";

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
        <Panel className="pet-form-panel">
            <form className="pet-form" onSubmit={handleSubmit}>
                <div className="pets-panel-header pet-form-header">
                    <div>
                        <h2>
                            {selectedPet
                                ? "Editar mascota"
                                : "Registrar mascota"}
                        </h2>

                        <p>Datos principales</p>
                    </div>

                    <div className="pet-form-badge">
                        <PawPrint size={22} />
                    </div>
                </div>

                <div className="pet-form-grid">
                    <label>
                        Nombre
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength="100"
                            placeholder="Ej: Felipe"
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
                            placeholder="Perro, gato..."
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
                            placeholder="Mestizo"
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
                </div>

                <label>
                    Observaciones
                    <textarea
                        name="observations"
                        value={formData.observations}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Alergias, cuidados especiales o notas"
                    />
                </label>

                <div className="pet-form-actions">
                    {selectedPet && (
                        <button
                            type="button"
                            className="pets-secondary-button"
                            onClick={onCancelEdit}
                        >
                            <X size={18} />

                            <span>Cancelar</span>
                        </button>
                    )}

                    <button
                        type="submit"
                        className="pets-primary-button"
                        disabled={loading}
                    >
                        <Save size={18} />

                        <span>
                            {loading
                                ? "Guardando..."
                                : selectedPet
                                    ? "Actualizar"
                                    : "Guardar"}
                        </span>
                    </button>
                </div>
            </form>
        </Panel>
    );
}

export default PetForm;
