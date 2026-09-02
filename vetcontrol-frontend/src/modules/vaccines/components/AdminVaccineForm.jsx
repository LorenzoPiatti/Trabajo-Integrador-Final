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
        stock: selectedVaccine.stock
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

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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
        }
    };

    return (

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
                    />

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
                        />

                    </label>

                    <label>
                        Stock

                        <input
                            type="number"
                            min="0"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Cantidad"
                            required
                        />

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
