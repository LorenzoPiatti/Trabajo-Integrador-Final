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

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {

            await register(
                formData.email,
                formData.password
            );

            localStorage.setItem(
                "verificationEmail",
                formData.email
            );

            navigate("/verify-email");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>

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
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Apellido</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>

            <label>Email</label>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <div className="form-row">

                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Dirección</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>

            <label>Contraseña</label>

            <div className="input-password">

                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "🙈" : "👁"}
                </button>

            </div>

            <label>Confirmar contraseña</label>

            <div className="input-password">

                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? "🙈" : "👁"}
                </button>

            </div>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="login-btn"
            >
                Registrarme
            </button>

            <div className="login-contact">

                ¿Ya tienes cuenta?{" "}

                <Link to="/">
                    Iniciar sesión
                </Link>

            </div>

        </form>
    );
}

export default RegisterForm;