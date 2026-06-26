import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyEmail } from "../../../services/authService";

function VerifyEmailForm() {

    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const email =
                localStorage.getItem(
                    "verificationEmail"
                );

            if (!email) {
                setError("No se encontró el email.");
                return;
            }

            await verifyEmail(
                email,
                code
            );

            alert("Email verificado correctamente");

            navigate("/");

        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>

            <h2>Verificar Email</h2>

            <p className="login-subtitle">
                Ingresá el código recibido.
            </p>

            <label>Código de verificación</label>

            <input
                type="text"
                placeholder="Ingrese el código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="login-btn"
            >
                Validar código
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