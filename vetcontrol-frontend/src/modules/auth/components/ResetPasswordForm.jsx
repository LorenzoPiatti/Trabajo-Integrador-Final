import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/authService";

function ResetPasswordForm() {

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {

            const email =
                localStorage.getItem(
                    "verificationEmail"
                );

            await resetPassword(
                email,
                code,
                password
            );

            alert(
                "Contraseña actualizada correctamente"
            );

            navigate("/");

        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>

            <h2>Nueva contraseña</h2>

            <p className="login-subtitle">
                Ingresá el código y tu nueva contraseña.
            </p>

            <label>Código de recuperación</label>

            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
            />

            <label>Nueva contraseña</label>

            <div className="input-password">

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
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

            <label>Confirmar contraseña</label>

            <div className="input-password">

                <input
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                    required
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowConfirmPassword(
                            !showConfirmPassword
                        )
                    }
                >
                    {showConfirmPassword
                        ? "🙈"
                        : "👁"}
                </button>

            </div>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {success && (
                <p className="success">
                    Contraseña actualizada correctamente
                </p>
            )}

            <button
                type="submit"
                className="login-btn"
            >
                Guardar contraseña
            </button>

            <div className="login-contact">

                <Link to="/">
                    Volver al inicio de sesión
                </Link>

            </div>

        </form>
    );
}

export default ResetPasswordForm;