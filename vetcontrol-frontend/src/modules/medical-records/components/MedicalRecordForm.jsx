import { useEffect, useState } from "react";
import { FileText, Save } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import { createMedicalRecord } from "../../../services/medicalRecordService";
import { getVaccines } from "../../../services/vaccineService";

const emptyForm = {
    description: "",
    diagnosis: "",
    treatment: ""
};

function MedicalRecordForm({
    selectedAppointment,
    loading,
    onSuccess,
    onError
}) {
    const [formData, setFormData] = useState(emptyForm);

    const [appliedVaccine, setAppliedVaccine] = useState(false);
    const [vaccines, setVaccines] = useState([]);
    const [selectedVaccine, setSelectedVaccine] = useState("");
    const [vaccineObservations, setVaccineObservations] = useState("");
    const [loadingVaccines, setLoadingVaccines] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setFormData(emptyForm);
            setAppliedVaccine(false);
            setSelectedVaccine("");
            setVaccineObservations("");
            setFieldErrors({});
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [selectedAppointment]);

    useEffect(() => {
        if (!appliedVaccine) {
            return;
        }

        const loadVaccines = async () => {
            setLoadingVaccines(true);

            try {
                const data = await getVaccines();

                setVaccines(data ?? []);
            } catch (err) {
                setVaccines([]);
                onError(err.message);
            } finally {
                setLoadingVaccines(false);
            }
        };

        loadVaccines();
    }, [appliedVaccine, onError]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [name]: ""
        }));
    };

    const handleVaccineChange = (e) => {
        const value = e.target.value === "yes";

        setAppliedVaccine(value);

        if (!value) {
            setSelectedVaccine("");
            setVaccineObservations("");

            setFieldErrors((currentErrors) => ({
                ...currentErrors,
                vaccine: ""
            }));
        }
    };

    const handleSelectedVaccineChange = (e) => {
        setSelectedVaccine(e.target.value);

        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            vaccine: ""
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.description.trim()) {
            errors.description =
                "Ingresá la descripción de la atención.";
        }

        if (!formData.treatment.trim()) {
            errors.treatment =
                "Ingresá el tratamiento indicado.";
        }

        if (appliedVaccine && !selectedVaccine) {
            errors.vaccine =
                "Seleccioná la vacuna aplicada.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAppointment) {
            onError("Seleccione un turno pendiente.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            await createMedicalRecord({
                appointmentId: selectedAppointment.appointmentId,
                description: formData.description,
                diagnosis: formData.diagnosis,
                treatment: formData.treatment,
                vaccineId: appliedVaccine
                    ? Number(selectedVaccine)
                    : null,
                vaccineObservations: appliedVaccine
                    ? vaccineObservations
                    : null
            });

            setFormData(emptyForm);
            setAppliedVaccine(false);
            setSelectedVaccine("");
            setVaccineObservations("");
            setFieldErrors({});

            onSuccess(
                "Atención médica registrada correctamente."
            );

        } catch (err) {
            onError(err.message);
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
        <Panel className="medical-record-form-panel">

            <form
                className="medical-record-form"
                onSubmit={handleSubmit}
                noValidate
            >

                <div className="medical-record-panel-header">

                    <div>

                        <h2>
                            Registrar atención médica
                        </h2>

                        <p>
                            {
                                selectedAppointment
                                    ? `Mascota: ${selectedAppointment.petName}`
                                    : "Seleccione un turno pendiente para comenzar."
                            }
                        </p>

                    </div>

                    <div className="appointment-form-badge">
                        <FileText size={22} />
                    </div>

                </div>

                <label>
                    Descripción

                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.description)}
                        style={
                            fieldErrors.description
                                ? fieldErrorStyle
                                : undefined
                        }
                    />

                    {fieldErrors.description && (
                        <small style={errorStyle}>
                            {fieldErrors.description}
                        </small>
                    )}
                </label>

                <label>
                    Diagnóstico (opcional)

                    <textarea
                        name="diagnosis"
                        rows="3"
                        value={formData.diagnosis}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Tratamiento

                    <textarea
                        name="treatment"
                        rows="4"
                        value={formData.treatment}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.treatment)}
                        style={
                            fieldErrors.treatment
                                ? fieldErrorStyle
                                : undefined
                        }
                    />

                    {fieldErrors.treatment && (
                        <small style={errorStyle}>
                            {fieldErrors.treatment}
                        </small>
                    )}
                </label>

                <label>
                    ¿Se aplicó una vacuna durante la atención?

                    <select
                        value={appliedVaccine ? "yes" : "no"}
                        onChange={handleVaccineChange}
                    >
                        <option value="no">
                            No
                        </option>

                        <option value="yes">
                            Sí
                        </option>
                    </select>
                </label>

                {appliedVaccine && (
                    <>
                        <label>
                            Vacuna aplicada

                            <select
                                value={selectedVaccine}
                                onChange={handleSelectedVaccineChange}
                                required
                                aria-invalid={Boolean(fieldErrors.vaccine)}
                                style={
                                    fieldErrors.vaccine
                                        ? fieldErrorStyle
                                        : undefined
                                }
                            >
                                <option value="">
                                    {
                                        loadingVaccines
                                            ? "Cargando vacunas..."
                                            : "Seleccionar vacuna"
                                    }
                                </option>

                                {vaccines.map((vaccine) => (
                                    <option
                                        key={vaccine.vaccineId}
                                        value={vaccine.vaccineId}
                                        disabled={vaccine.stock <= 0}
                                    >
                                        {vaccine.name} - Stock: {vaccine.stock}
                                        {vaccine.stock <= 0
                                            ? " (Sin stock)"
                                            : ""
                                        }
                                    </option>
                                ))}
                            </select>

                            {fieldErrors.vaccine && (
                                <small style={errorStyle}>
                                    {fieldErrors.vaccine}
                                </small>
                            )}
                        </label>

                        <label>
                            Observaciones de la vacuna (opcional)

                            <textarea
                                rows="3"
                                value={vaccineObservations}
                                onChange={(e) =>
                                    setVaccineObservations(e.target.value)
                                }
                            />
                        </label>
                    </>
                )}

                <button
                    type="submit"
                    className="appointments-primary-button"
                    disabled={
                        loading ||
                        !selectedAppointment
                    }
                >
                    <Save size={18} />

                    <span>
                        {
                            loading
                                ? "Guardando..."
                                : "Guardar atención"
                        }
                    </span>
                </button>

            </form>

        </Panel>
    );
}

export default MedicalRecordForm;