import { forwardRef, useEffect, useState } from "react";

import {
    Save,
    Syringe,
    X
} from "lucide-react";

import Panel from "../../../components/ui/Panel";

const emptyForm = {
    petId: "",
    vaccineId: "",
    veterinarianId: "",
    applicationDate: "",
    observations: ""
};

const toInputDate = (value) => {
    if (!value) {
        return "";
    }

    return new Date(value).toISOString().split("T")[0];
};

const getInitialFormData = (selectedVaccine) => {
    if (!selectedVaccine) {
        return {
            ...emptyForm
        };
    }

    return {
        petId: selectedVaccine.petId,
        vaccineId: selectedVaccine.vaccineId,
        veterinarianId: selectedVaccine.veterinarianId,
        applicationDate: toInputDate(
            selectedVaccine.applicationDate
        ),
        observations: selectedVaccine.observations ?? ""
    };
};

const VaccineForm = forwardRef(({
    selectedVaccine,
    pets,
    vaccines,
    veterinarians,
    loading,
    onSubmit,
    onCancelEdit
}, ref) => {
    const [formData, setFormData] = useState(
        getInitialFormData(selectedVaccine)
    );

    useEffect(() => {
        setFormData(
            getInitialFormData(selectedVaccine)
        );
    }, [selectedVaccine]);

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            petId: Number(formData.petId),
            vaccineId: Number(formData.vaccineId),
            veterinarianId: Number(formData.veterinarianId),
            applicationDate: `${formData.applicationDate}T00:00:00`,
            observations: formData.observations
        };

        const saved = await onSubmit(payload);

        if (saved && !selectedVaccine) {
            setFormData({
                ...emptyForm
            });
        }
    };

    return (
        <div ref={ref}>
            <Panel className="vaccine-form-panel">
                <form
                    className="vaccine-form"
                    onSubmit={handleSubmit}
                >
                    <div className="vaccines-panel-header vaccine-form-header">
                        <div>
                            <h2>
                                {
                                    selectedVaccine
                                        ? "Editar vacuna"
                                        : "Nueva vacuna"
                                }
                            </h2>

                            <p>
                                Complete los datos de aplicacion
                            </p>
                        </div>

                        <div className="vaccine-form-badge">
                            <Syringe size={22} />
                        </div>
                    </div>

                    <label>
                        Mascota

                        <select
                            name="petId"
                            value={formData.petId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccionar mascota
                            </option>

                            {pets.map(pet => (
                                <option
                                    key={pet.petId}
                                    value={pet.petId}
                                >
                                    {pet.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Vacuna

                        <select
                            name="vaccineId"
                            value={formData.vaccineId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccionar vacuna
                            </option>

                            {vaccines.map(vaccine => (
                                <option
                                    key={vaccine.vaccineId}
                                    value={vaccine.vaccineId}
                                >
                                    {vaccine.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Veterinario

                        <select
                            name="veterinarianId"
                            value={formData.veterinarianId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccionar veterinario
                            </option>

                            {veterinarians.map(vet => (
                                <option
                                    key={vet.id}
                                    value={vet.id}
                                >
                                    {vet.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Fecha de aplicacion

                        <input
                            type="date"
                            name="applicationDate"
                            value={formData.applicationDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Observaciones

                        <textarea
                            name="observations"
                            rows="5"
                            value={formData.observations}
                            onChange={handleChange}
                            placeholder="Detalle opcional de la aplicacion"
                        />
                    </label>

                    <div className="vaccine-form-actions">
                        {selectedVaccine && (
                            <button
                                type="button"
                                className="vaccines-secondary-button"
                                onClick={onCancelEdit}
                            >
                                <X size={18} />

                                <span>
                                    Cancelar
                                </span>
                            </button>
                        )}

                        <button
                            type="submit"
                            className="vaccines-primary-button"
                            disabled={loading}
                        >
                            <Save size={18} />

                            <span>
                                {
                                    loading
                                        ? "Guardando..."
                                        : selectedVaccine
                                            ? "Actualizar"
                                            : "Guardar"
                                }
                            </span>
                        </button>
                    </div>
                </form>
            </Panel>
        </div>
    );
});

VaccineForm.displayName = "VaccineForm";

export default VaccineForm;
