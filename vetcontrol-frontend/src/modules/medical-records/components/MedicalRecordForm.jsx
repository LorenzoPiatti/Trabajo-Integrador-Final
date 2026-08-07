import { useEffect, useState } from "react";
import { FileText, Save} from "lucide-react";
import Panel from "../../../components/ui/Panel";
import { createMedicalRecord } from "../../../services/medicalRecordService";

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

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setFormData(emptyForm);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [selectedAppointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppointment) {
            onError("Seleccione un turno pendiente.");
            return;
        }
        try {
            await createMedicalRecord({
                appointmentId: selectedAppointment.appointmentId,
                description: formData.description,
                diagnosis: formData.diagnosis,
                treatment: formData.treatment
            });
            setFormData(emptyForm);
            onSuccess(
                "Atención médica registrada correctamente."
            );

        } catch (err) {

            onError(err.message);
        }
    };
    return (
        <Panel className="medical-record-form-panel">
            <form
                className="medical-record-form"
                onSubmit={handleSubmit}
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
                    />

                </label>

                <label>

                    Diagnóstico

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
                    />

                </label>

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
