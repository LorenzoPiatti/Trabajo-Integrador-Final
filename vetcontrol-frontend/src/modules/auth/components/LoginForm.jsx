import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/authService";

function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const validate = () => {

        const newErrors = {};

        if (!email) {
            newErrors.email = "El email es obligatorio";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "El email no tiene un formato válido";
        }

        if (!password) {
            newErrors.password = "La contraseña es obligatoria";
        }
        else if (password.length < 6) {
            newErrors.password =
                "La contraseña debe tener al menos 6 caracteres";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {

        setApiError("");

        if (!validate()) {
            return;
        }

        try {

            const token = await login(
                email,
                password
            );

            localStorage.setItem(
                "token",
                token
            );

            navigate("/home");
        }
        catch (error) {

            setApiError(
                error instanceof Error
                    ? error.message
                    : "Error al iniciar sesión"
            );
        }
    };

    return (
        <div className="login-form">

            <h2>¡Bienvenido!</h2>

            <p className="login-subtitle">
                Iniciá sesión para administrar tus mascotas,
                gestionar turnos, ver su historial médico
                y mucho más.
            </p>

            <label>Email</label>

            <input
                type="email"
                placeholder="Ingrese mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {errors.email &&
                <span className="error">
                    {errors.email}
                </span>
            }

            <label>Contraseña</label>

            <div className="input-password">

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    placeholder="Ingrese contraseña"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                >
                    {showPassword ? "🙈" : "👁"}
                </button>

            </div>

            {errors.password &&
                <span className="error">
                    {errors.password}
                </span>
            }

            {apiError &&
                <span className="error">
                    {apiError}
                </span>
            }

            <div className="login-links">

                <span>
                    ¿No tenés cuenta?{" "}
                    <Link to="/register">
                        Registrarse
                    </Link>
                </span>

                <Link to="/forgot-password">
                    ¿Olvidaste tu contraseña?
                </Link>

            </div>

            <button
                className="login-btn"
                type="button"
                onClick={handleSubmit}
            >
                Iniciar sesión
            </button>

            <div className="login-contact">

                <p>— Contactanos —</p>

                <div className="login-icons">

                    <a
                        href="https://wa.me/5493412345678"
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp"
                    >
                        💬
                    </a>

                    <a
                        href="tel:+5493416789012"
                        title="Teléfono"
                    >
                        📞
                    </a>

                    <a
                        href="https://www.google.com/maps/search/San+Lorenzo+3458+Rosario"
                        target="_blank"
                        rel="noreferrer"
                        title="Ubicación"
                    >
                        📍
                    </a>

                </div>

            </div>

        </div>
    );
}

export default LoginForm;
