import { useState } from "react";
import { Save, Syringe, X } from "lucide-react";
import Panel from "../../../components/ui/Panel";

const emptyForm = {
    name: "",
    description: "",
    frequencyMonths: "",
    stock: ""
};

const getInitialFormData = (selectedVaccine) => {
    if (!selectedVaccine) {
        return {
            ...emptyForm
        };
    }

    return {
        name: selectedVaccine.name,
        description: selectedVaccine.description ?? "",
        frequencyMonths: selectedVaccine.frequencyMonths,
        stock: 0
    };
};

function AdminVaccineForm({
    selectedVaccine,
    loading,
    onSubmit,
    onCancelEdit
}) {
    const [formData, setFormData] = useState(
        getInitialFormData(selectedVaccine)
    );

    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

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
            errors.name = "Ingresá el nombre de la vacuna.";
        }

        if (
            formData.frequencyMonths === "" ||
            Number(formData.frequencyMonths) <= 0
        ) {
            errors.frequencyMonths =
                "Ingresá una frecuencia válida.";
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {
            errors.stock = selectedVaccine
                ? "Ingresá la cantidad a agregar."
                : "Ingresá el stock inicial.";
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
            name: formData.name,
            description: formData.description,
            frequencyMonths: Number(formData.frequencyMonths),
            stock: Number(formData.stock)
        });

        if (saved && !selectedVaccine) {
            setFormData({
                ...emptyForm
            });

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
        <Panel className="vaccine-form-panel">

            <form
                className="vaccine-form"
                onSubmit={handleSubmit}
                noValidate
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
                            Administrá el catálogo y stock disponible
                        </p>

                    </div>

                    <div className="vaccine-form-badge">
                        <Syringe size={22} />
                    </div>

                </div>

                <label>
                    Nombre

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Antirrábica"
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

                <div className="vaccine-form-grid">

                    <label>
                        Frecuencia

                        <input
                            type="number"
                            min="1"
                            name="frequencyMonths"
                            value={formData.frequencyMonths}
                            onChange={handleChange}
                            placeholder="Meses"
                            required
                            aria-invalid={Boolean(
                                fieldErrors.frequencyMonths
                            )}
                            style={
                                fieldErrors.frequencyMonths
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.frequencyMonths && (
                            <small style={errorStyle}>
                                {fieldErrors.frequencyMonths}
                            </small>
                        )}

                    </label>

                    <label>
                        {
                            selectedVaccine
                                ? "Cantidad a agregar"
                                : "Stock inicial"
                        }

                        <input
                            type="number"
                            min="0"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder={
                                selectedVaccine
                                    ? "Cantidad"
                                    : "Stock inicial"
                            }
                            required
                            aria-invalid={Boolean(fieldErrors.stock)}
                            style={
                                fieldErrors.stock
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.stock && (
                            <small style={errorStyle}>
                                {fieldErrors.stock}
                            </small>
                        )}

                    </label>

                </div>

                <label>
                    Descripción

                    <textarea
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Indicaciones o detalle de la vacuna"
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
                            <span>Cancelar</span>
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
    );
}

export default AdminVaccineForm;