import { forwardRef, useEffect, useState } from "react";
import { CalendarDays, Save, X } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import { getAvailability} from "../../../services/appointmentService";

const emptyForm = {
    petId: "",
    veterinarianId: "",
    date: "",
    time: "",
    reason: ""
};

const getInitialFormData = (selectedAppointment) => {
    if (!selectedAppointment) {
        return {
            ...emptyForm
        };
    }

    const date = new Date(
        selectedAppointment.dateTime
    );

    return {
        petId: selectedAppointment.petId,
        veterinarianId: selectedAppointment.veterinarianId,
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().slice(0, 5),
        reason: selectedAppointment.reason
    };

};

const AppointmentForm = forwardRef(({
    selectedAppointment,
    pets,
    veterinarians,
    loading,
    onSubmit,
    onCancelEdit
}, ref) => {

    const [formData, setFormData] = useState(
        getInitialFormData(selectedAppointment)
    );

    const [availability, setAvailability] = useState([]);


    useEffect(() => {

        setFormData(
            getInitialFormData(selectedAppointment)
        );

    }, [selectedAppointment]);


    useEffect(() => {

        const loadAvailability = async () => {

            if (
                !formData.veterinarianId ||
                !formData.date
            ) {
                setAvailability([]);
                return;
            }

            try {

                const data = await getAvailability(
                    formData.veterinarianId,
                    formData.date
                );

                setAvailability(data ?? []);

            } catch {

                setAvailability([]);

            }

        };

        loadAvailability();

    }, [
        formData.veterinarianId,
        formData.date
    ]);


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value,
            ...(name === "veterinarianId" || name === "date"
                ? { time: "" }
                : {})
        });
    };
    const handleSubmit = async (e) => {

        e.preventDefault();

        const appointment = {
            petId: Number(formData.petId),
            veterinarianId: Number(formData.veterinarianId),
            dateTime: `${formData.date}T${formData.time}:00`,
            reason: formData.reason
        };
        const saved = await onSubmit(
            appointment
        );

        if (saved && !selectedAppointment) {

            setFormData({
                ...emptyForm
            });
        }
    };
    return (
        <div ref={ref}>

            <Panel className="appointment-form-panel">

                <form
                    className="appointment-form"
                    onSubmit={handleSubmit}
                >

                    <div className="appointments-panel-header appointment-form-header">

                        <div>

                            <h2>
                                {
                                    selectedAppointment
                                        ? "Editar turno"
                                        : "Nuevo turno"
                                }
                            </h2>

                            <p>
                                Complete los datos del turno
                            </p>

                        </div>

                        <div className="appointment-form-badge">
                            <CalendarDays size={22} />
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

                            {
                                pets.map(pet => (

                                    <option
                                        key={pet.petId}
                                        value={pet.petId}
                                    >
                                        {pet.name}
                                    </option>

                                ))
                            }

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

                            {
                                veterinarians.map(vet => (

                                    <option
                                        key={vet.id}
                                        value={vet.id}
                                    >
                                        {vet.name}
                                    </option>

                                ))
                            }

                        </select>

                    </label>


                    <div className="appointment-form-grid">

                        <label>
                            Fecha

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />

                        </label>


                        <label>
                            Hora
                            <select
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Seleccionar horario
                                </option>

                                {
                                    availability
                                        .filter(slot => slot.available)
                                        .map(slot => (

                                            <option
                                                key={slot.dateTime}
                                                value={slot.dateTime.substring(11, 16)}
                                            >
                                                {slot.dateTime.substring(11, 16)}
                                            </option>
                                        ))
                                }
                            </select>
                        </label>

                    </div>


                    <label>
                        Motivo

                        <textarea
                            name="reason"
                            rows="5"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Describa el motivo de la consulta"
                            required
                        />

                    </label>


                    <div className="appointment-form-actions">

                        {
                            selectedAppointment && (

                                <button
                                    type="button"
                                    className="appointments-secondary-button"
                                    onClick={onCancelEdit}
                                >

                                    <X size={18} />

                                    <span>
                                        Cancelar
                                    </span>

                                </button>

                            )
                        }


                        <button
                            type="submit"
                            className="appointments-primary-button"
                            disabled={loading}
                        >

                            <Save size={18} />

                            <span>
                                {
                                    loading
                                        ? "Guardando..."
                                        : selectedAppointment
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


AppointmentForm.displayName = "AppointmentForm";


export default AppointmentForm;