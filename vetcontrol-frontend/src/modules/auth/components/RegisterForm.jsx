import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../../services/authService";

function RegisterForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(currentData => ({
            ...currentData,
            [name]: value
        }));

        setErrors(currentErrors => ({
            ...currentErrors,
            [name]: "",
            ...(name === "password"
                ? { confirmPassword: "" }
                : {})
        }));

        setApiError("");
    };

    const validate = () => {

        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "El nombre es obligatorio";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "El apellido es obligatorio";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "El email no tiene un formato válido";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "El teléfono es obligatorio";
        }

        if (!formData.address.trim()) {
            newErrors.address = "La dirección es obligatoria";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        }
        else if (formData.password.length < 6) {
            newErrors.password =
                "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword =
                "Confirmá tu contraseña";
        }
        else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword =
                "Las contraseñas no coinciden";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setApiError("");

        if (!validate()) {
            return;
        }

        try {

            setLoading(true);

            await register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                password: formData.password
            });

            localStorage.setItem(
                "verificationEmail",
                formData.email.trim()
            );

            navigate("/verify-email");

        }
        catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "";

            const normalizedMessage =
                message.toLowerCase();

            if (
                normalizedMessage.includes(
                    "email ya se encuentra registrado"
                )
            ) {

                setErrors(currentErrors => ({
                    ...currentErrors,
                    email: "El email ya se encuentra registrado"
                }));

                return;
            }

            if (
                normalizedMessage.includes("smtp") ||
                normalizedMessage.includes("579") ||
                normalizedMessage.includes("webloginrequired") ||
                normalizedMessage.includes("verificación")
            ) {

                setApiError(
                    "No pudimos enviar el código de verificación. Intentá nuevamente."
                );

                return;
            }

            if (
                normalizedMessage.includes("failed to fetch")
            ) {

                setApiError(
                    "No pudimos conectar con el servidor. Intentá nuevamente."
                );

                return;
            }

            setApiError(
                "No pudimos completar el registro. Intentá nuevamente."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
        >

            <h2>Crear cuenta</h2>

            <p className="login-subtitle">
                Registrate para acceder a VetControl
            </p>

            <div className="form-row">

                <div className="form-group">

                    <label>Nombre</label>

                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={
                            errors.firstName
                                ? "input-error"
                                : ""
                        }
                    />

                    {errors.firstName && (
                        <span className="error">
                            {errors.firstName}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>Apellido</label>

                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={
                            errors.lastName
                                ? "input-error"
                                : ""
                        }
                    />

                    {errors.lastName && (
                        <span className="error">
                            {errors.lastName}
                        </span>
                    )}

                </div>

            </div>

            <label>Email</label>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={
                    errors.email
                        ? "input-error"
                        : ""
                }
            />

            {errors.email && (
                <span className="error">
                    {errors.email}
                </span>
            )}

            <div className="form-row">

                <div className="form-group">

                    <label>Teléfono</label>

                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={
                            errors.phone
                                ? "input-error"
                                : ""
                        }
                    />

                    {errors.phone && (
                        <span className="error">
                            {errors.phone}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>Dirección</label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={
                            errors.address
                                ? "input-error"
                                : ""
                        }
                    />

                    {errors.address && (
                        <span className="error">
                            {errors.address}
                        </span>
                    )}

                </div>

            </div>

            <label>Contraseña</label>

            <div
                className={
                    `input-password ${errors.password
                        ? "input-error"
                        : ""
                    }`
                }
            >

                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowPassword(
                            currentValue => !currentValue
                        )
                    }
                >
                    {showPassword ? "🙈" : "👁"}
                </button>

            </div>

            {errors.password && (
                <span className="error">
                    {errors.password}
                </span>
            )}

            <label>Confirmar contraseña</label>

            <div
                className={
                    `input-password ${errors.confirmPassword
                        ? "input-error"
                        : ""
                    }`
                }
            >

                <input
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowConfirmPassword(
                            currentValue => !currentValue
                        )
                    }
                >
                    {showConfirmPassword ? "🙈" : "👁"}
                </button>

            </div>

            {errors.confirmPassword && (
                <span className="error">
                    {errors.confirmPassword}
                </span>
            )}

            {apiError && (
                <p className="error">
                    {apiError}
                </p>
            )}

            <button
                type="submit"
                className="login-btn"
                disabled={loading}
            >
                {loading ? "Registrando..." : "Registrarme"}
            </button>

            <div className="login-contact">

                ¿Ya tenés cuenta?{" "}

                <Link to="/">
                    Iniciar sesión
                </Link>

            </div>

        </form>
    );
}

export default RegisterForm;