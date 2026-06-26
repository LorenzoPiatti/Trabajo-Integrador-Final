import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../services/authService";

function ForgotPasswordForm() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await forgotPassword(email);

            localStorage.setItem(
                "verificationEmail",
                email
            );

            navigate("/reset-password");

        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>

            <h2>Recuperar contraseña</h2>

            <p className="login-subtitle">
                Ingresá tu correo electrónico y te enviaremos un código.
            </p>

            <label>Email</label>

            <input
                type="email"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Enviar código
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