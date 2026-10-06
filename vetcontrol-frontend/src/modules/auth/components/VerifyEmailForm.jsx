import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyEmail } from "../../../services/authService";

function VerifyEmailForm() {

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!success) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSuccess("");
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [success]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCode(e.target.value);

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanCode = code.trim();

        if (!cleanCode) {
            setError("Ingresá el código de verificación.");
            return;
        }

        const email = localStorage.getItem("verificationEmail");

        if (!email) {
            setError("No se encontró el email asociado al registro.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await verifyEmail(email, cleanCode);

            localStorage.removeItem("verificationEmail");

            setSuccess("Email verificado correctamente.");

            setTimeout(() => {
                navigate("/");
            }, 1200);

        }
        catch (err) {
            setError(
                err.message || "No pudimos verificar el código. Intentá nuevamente."
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

            <h2>Verificar Email</h2>

            <p className="login-subtitle">
                Ingresá el código recibido.
            </p>

            <label>Código de verificación</label>

            <input
                type="text"
                placeholder="Ingresá el código"
                value={code}
                onChange={handleChange}
                className={error ? "input-error" : ""}
                maxLength={6}
                disabled={loading || success}
            />

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {success && (
                <p className="success">
                    {success}
                </p>
            )}

            <button
                type="submit"
                className="login-btn"
                disabled={loading || success}
            >
                {loading ? "Verificando..." : "Validar código"}
            </button>

            <div className="login-contact">
                <Link to="/">
                    Volver al inicio de sesión
                </Link>
            </div>

        </form>
    );
}

export default VerifyEmailForm;