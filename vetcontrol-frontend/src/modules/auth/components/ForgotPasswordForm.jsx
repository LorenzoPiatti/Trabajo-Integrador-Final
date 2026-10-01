import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../../services/authService";

function ForgotPasswordForm() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError("Ingresá tu email.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            setError("Ingresá un email válido.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await forgotPassword(cleanEmail);

            localStorage.setItem(
                "verificationEmail",
                cleanEmail
            );

            navigate("/reset-password");
        }
        catch (err) {
            setError(
                err.message ||
                "No pudimos enviar el código. Intentá nuevamente."
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

            <h2>Recuperar contraseña</h2>

            <p className="login-subtitle">
                Ingresá tu correo electrónico y te enviaremos un código.
            </p>

            <label>Email</label>

            <input
                type="email"
                placeholder="Ingresá tu email"
                value={email}
                onChange={handleChange}
                className={error ? "input-error" : ""}
                disabled={loading}
            />

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="login-btn"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Enviar código"}
            </button>

            <div className="login-contact">
                <Link to="/">
                    Volver al inicio de sesión
                </Link>
            </div>

        </form>
    );
}

export default ForgotPasswordForm;