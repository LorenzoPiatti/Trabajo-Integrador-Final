import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    login,
    getUserFromToken
} from "../../../services/authService";

import { useAuth } from "../../../context/AuthContext";

function LoginForm() {

    const navigate = useNavigate();

    const { login: saveUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [credentialsError, setCredentialsError] = useState(false);

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

    const handleEmailChange = (event) => {

        setEmail(event.target.value);

        setErrors(currentErrors => ({
            ...currentErrors,
            email: ""
        }));

        setApiError("");
        setCredentialsError(false);

    };

    const handlePasswordChange = (event) => {

        setPassword(event.target.value);

        setErrors(currentErrors => ({
            ...currentErrors,
            password: ""
        }));

        setApiError("");
        setCredentialsError(false);

    };

    const handleSubmit = async () => {

        setApiError("");
        setCredentialsError(false);

        if (!validate()) {
            return;
        }

        try {

            setLoading(true);

            const token = await login(
                email,
                password
            );

            localStorage.setItem(
                "token",
                token
            );

            const userData = getUserFromToken(token);

            if (userData) {

                saveUser(userData);

            }

            navigate("/dashboard");

        }
        catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : "";

            const normalizedMessage =
                message.toLowerCase();

            const invalidCredentials =
                normalizedMessage.includes("usuario no encontrado") ||
                normalizedMessage.includes("contraseña incorrecta") ||
                normalizedMessage.includes("credencial");

            if (invalidCredentials) {

                setApiError(
                    "El email o la contraseña son incorrectos."
                );

                setCredentialsError(true);


            }
            else {

                setApiError(
                    message ||
                    "No se pudo iniciar sesión. Intentá nuevamente."
                );

            }

        }
        finally {
            setLoading(false);
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
                placeholder="Ingresá tu email"
                value={email}
                className={
                    errors.email || credentialsError
                        ? "input-error"
                        : ""
                }
                onChange={handleEmailChange}
            />

            {errors.email && (

                <span className="error">

                    {errors.email}

                </span>

            )}

            <label>Contraseña</label>

            <div
                className={
                    `input-password ${errors.password || credentialsError
                        ? "input-error"
                        : ""
                    }`
                }
            >

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    placeholder="Ingresá tu contraseña"
                    value={password}
                    onChange={handlePasswordChange}
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

            {apiError && (

                <span className="error">

                    {apiError}

                </span>

            )}

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
                disabled={loading}
            >
                {loading ? "Ingresando..." : "Iniciar sesión"}
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