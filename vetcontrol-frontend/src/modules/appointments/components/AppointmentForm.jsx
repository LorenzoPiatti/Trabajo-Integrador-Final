import { forwardRef, useEffect, useState } from "react";
import { CalendarDays, Save, X } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import { getAvailability } from "../../../services/appointmentService";

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
    onCancelEdit,
    title,
    subtitle,
    disablePetSelection = false
}, ref) => {

    const [formData, setFormData] = useState(
        getInitialFormData(selectedAppointment)
    );

    const [availability, setAvailability] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setFormData(
            getInitialFormData(selectedAppointment)
        );
        setFieldErrors({});
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

        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [name]: "",
            ...(
                name === "veterinarianId" || name === "date"
                    ? { time: "" }
                    : {}
            )
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.petId) {
            errors.petId = "Seleccioná una mascota.";
        }

        if (!formData.veterinarianId) {
            errors.veterinarianId = "Seleccioná un veterinario.";
        }

        if (!formData.date) {
            errors.date = "Seleccioná una fecha.";
        }

        if (!formData.time) {
            errors.time = "Seleccioná un horario.";
        }

        if (!formData.reason.trim()) {
            errors.reason = "Ingresá el motivo de la consulta.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
            setFieldErrors({});
        }
    };

    const isCurrentSelectedSlot = (slot) => {
        if (!selectedAppointment) {
            return false;
        }

        return slot.dateTime.substring(0, 16) ===
            `${formData.date}T${formData.time}`;
    };

    const availableSlots = availability.filter(slot =>
        slot.available || isCurrentSelectedSlot(slot)
    );

    const errorStyle = {
        color: "#C94C4C",
        fontSize: "0.78rem",
        marginTop: "4px"
    };

    const fieldErrorStyle = {
        borderColor: "#C94C4C"
    };

    return (
        <div ref={ref}>
            <Panel className="appointment-form-panel">
                <form
                    className="appointment-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="appointments-panel-header appointment-form-header">
                        <div>
                            <h2>
                                {
                                    title ??
                                    (selectedAppointment
                                        ? "Editar turno"
                                        : "Nuevo turno")
                                }
                            </h2>

                            <p>
                                {subtitle ?? "Complete los datos del turno"}
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
                            disabled={disablePetSelection}
                            required
                            aria-invalid={Boolean(fieldErrors.petId)}
                            style={
                                fieldErrors.petId
                                    ? fieldErrorStyle
                                    : undefined
                            }
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

                        {fieldErrors.petId && (
                            <small style={errorStyle}>
                                {fieldErrors.petId}
                            </small>
                        )}
                    </label>

                    <label>
                        Veterinario

                        <select
                            name="veterinarianId"
                            value={formData.veterinarianId}
                            onChange={handleChange}
                            required
                            aria-invalid={Boolean(fieldErrors.veterinarianId)}
                            style={
                                fieldErrors.veterinarianId
                                    ? fieldErrorStyle
                                    : undefined
                            }
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

                        {fieldErrors.veterinarianId && (
                            <small style={errorStyle}>
                                {fieldErrors.veterinarianId}
                            </small>
                        )}
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
                                aria-invalid={Boolean(fieldErrors.date)}
                                style={
                                    fieldErrors.date
                                        ? fieldErrorStyle
                                        : undefined
                                }
                            />

                            {fieldErrors.date && (
                                <small style={errorStyle}>
                                    {fieldErrors.date}
                                </small>
                            )}
                        </label>

                        <label>
                            Hora

                            <select
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                aria-invalid={Boolean(fieldErrors.time)}
                                style={
                                    fieldErrors.time
                                        ? fieldErrorStyle
                                        : undefined
                                }
                            >
                                <option value="">
                                    Seleccionar horario
                                </option>

                                {
                                    availableSlots.map(slot => (
                                        <option
                                            key={slot.dateTime}
                                            value={slot.dateTime.substring(11, 16)}
                                        >
                                            {slot.dateTime.substring(11, 16)}
                                        </option>
                                    ))
                                }
                            </select>

                            {fieldErrors.time && (
                                <small style={errorStyle}>
                                    {fieldErrors.time}
                                </small>
                            )}
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
                            aria-invalid={Boolean(fieldErrors.reason)}
                            style={
                                fieldErrors.reason
                                    ? fieldErrorStyle
                                    : undefined
                            }
                        />

                        {fieldErrors.reason && (
                            <small style={errorStyle}>
                                {fieldErrors.reason}
                            </small>
                        )}
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