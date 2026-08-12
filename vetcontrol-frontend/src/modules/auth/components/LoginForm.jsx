
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login as loginRequest } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

function LoginForm() {

    const navigate = useNavigate();

    const { login: saveAuthenticatedUser } = useAuth();

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

    const decodeToken = (token) => {

        try {

            const payload = token.split(".")[1];

            if (!payload) {
                return null;
            }

            const normalizedPayload = payload
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedPayload = normalizedPayload.padEnd(
                normalizedPayload.length +
                ((4 - normalizedPayload.length % 4) % 4),
                "="
            );

            const decodedPayload = decodeURIComponent(
                atob(paddedPayload)
                    .split("")
                    .map(character =>
                        `%${character
                            .charCodeAt(0)
                            .toString(16)
                            .padStart(2, "0")}`
                    )
                    .join("")
            );

            return JSON.parse(decodedPayload);

        }
        catch (error) {

            console.error(
                "No se pudo decodificar el token:",
                error
            );

            return null;

        }

    };

    const getClaim = (tokenData, possibleNames) => {

        for (const name of possibleNames) {

            if (tokenData?.[name] !== undefined) {
                return tokenData[name];
            }

        }

        return null;

    };

    const handleSubmit = async () => {

        setApiError("");

        if (!validate()) {
            return;
        }

        try {

            const token = await loginRequest(
                email,
                password
            );

            localStorage.setItem(
                "token",
                token
            );

            const tokenData = decodeToken(token);

            const fullName = getClaim(
                tokenData,
                [
                    "name",
                    "unique_name",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ]
            ) ?? "";

            const firstNameClaim = getClaim(
                tokenData,
                [
                    "firstName",
                    "given_name",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
                ]
            );

            const lastNameClaim = getClaim(
                tokenData,
                [
                    "lastName",
                    "family_name",
                    "surname",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
                ]
            );

            const nameParts = fullName
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            const firstName =
                firstNameClaim ??
                nameParts[0] ??
                "Usuario";

            const lastName =
                lastNameClaim ??
                nameParts.slice(1).join(" ");

            const userId = getClaim(
                tokenData,
                [
                    "userId",
                    "UserId",
                    "sub",
                    "nameid",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ]
            );

            const userEmail = getClaim(
                tokenData,
                [
                    "email",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ]
            ) ?? email;

            const role = getClaim(
                tokenData,
                [
                    "role",
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ]
            ) ?? "";

            saveAuthenticatedUser({
                id: userId,
                firstName,
                lastName,
                email: userEmail,
                role,
                photo: null
            });

            navigate("/dashboard");

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
                onChange={(event) =>
                    setEmail(event.target.value)
                }
            />

            {errors.email && (

                <span className="error">

                    {errors.email}

                </span>

            )}

            <label>Contraseña</label>

            <div className="input-password">

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese contraseña"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowPassword(currentValue => !currentValue)
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

