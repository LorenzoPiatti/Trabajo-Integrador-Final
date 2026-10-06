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

    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Ingresá el nombre de la mascota.";
        }

        if (!formData.species.trim()) {
            errors.species = "Ingresá la especie.";
        }

        if (!formData.breed.trim()) {
            errors.breed = "Ingresá la raza.";
        }

        if (!formData.birthDate) {
            errors.birthDate = "Seleccioná la fecha de nacimiento.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const saved = await onSubmit({
            ...formData,
            birthDate: formData.birthDate
        });

        if (saved && !selectedPet) {
            setFormData(emptyForm);
            setFieldErrors({});
        }
    };

    const errorStyle = {
        color: "#C94C4C",
        fontSize: "0.78rem",
        marginTop: "4px"
    };

    const fieldErrorStyle = {
        borderColor: "#C94C4C"
    };

    return (
        <Panel className="pet-form-panel">
            <form
                className="pet-form"
                onSubmit={handleSubmit}
                noValidate
            >
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
                            aria-invalid={Boolean(fieldErrors.name)}
                            style={
                                fieldErrors.name
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.name && (
                            <small style={errorStyle}>
                                {fieldErrors.name}
                            </small>
                        )}
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
                            aria-invalid={Boolean(fieldErrors.species)}
                            style={
                                fieldErrors.species
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.species && (
                            <small style={errorStyle}>
                                {fieldErrors.species}
                            </small>
                        )}
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
                            aria-invalid={Boolean(fieldErrors.breed)}
                            style={
                                fieldErrors.breed
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.breed && (
                            <small style={errorStyle}>
                                {fieldErrors.breed}
                            </small>
                        )}
                    </label>

                    <label>
                        Fecha de nacimiento

                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                            aria-invalid={Boolean(fieldErrors.birthDate)}
                            style={
                                fieldErrors.birthDate
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.birthDate && (
                            <small style={errorStyle}>
                                {fieldErrors.birthDate}
                            </small>
                        )}
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