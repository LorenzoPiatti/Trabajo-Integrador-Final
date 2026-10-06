import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/authService";

function ResetPasswordForm() {

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
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

    const handleCodeChange = (e) => {
        setCode(e.target.value);

        setErrors((prev) => ({
            ...prev,
            code: ""
        }));

        setApiError("");
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

        setErrors((prev) => ({
            ...prev,
            password: "",
            confirmPassword: ""
        }));

        setApiError("");
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);

        setErrors((prev) => ({
            ...prev,
            password: "",
            confirmPassword: ""
        }));

        setApiError("");
    };

    const validate = () => {
        const newErrors = {};

        if (!code.trim()) {
            newErrors.code = "Ingresá el código de recuperación.";
        }

        if (!password) {
            newErrors.password = "Ingresá una nueva contraseña.";
        }
        else if (password.length < 6) {
            newErrors.password =
                "La contraseña debe tener al menos 6 caracteres.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Confirmá la nueva contraseña.";
        }
        else if (password !== confirmPassword) {
            newErrors.password =
                "Las contraseñas no coinciden.";
            newErrors.confirmPassword =
                "Las contraseñas no coinciden.";
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

        const email =
            localStorage.getItem("verificationEmail");

        if (!email) {
            setApiError(
                "No se encontró el email asociado a la recuperación."
            );
            return;
        }

        try {
            setLoading(true);

            await resetPassword(
                email,
                code.trim(),
                password
            );

            localStorage.removeItem("verificationEmail");

            setSuccess(
                "Contraseña actualizada correctamente."
            );

            setTimeout(() => {
                navigate("/");
            }, 1200);
        }
        catch (err) {

            const message =
                err.message ||
                "No pudimos actualizar la contraseña. Intentá nuevamente.";

            const normalizedMessage =
                message.toLowerCase();

            if (
                normalizedMessage.includes("código") ||
                normalizedMessage.includes("codigo")
            ) {
                setErrors((prev) => ({
                    ...prev,
                    code: message
                }));
            }
            else {
                setApiError(message);
            }
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

            <h2>Nueva contraseña</h2>

            <p className="login-subtitle">
                Ingresá el código y tu nueva contraseña.
            </p>

            <label>Código de recuperación</label>

            <input
                type="text"
                placeholder="Ingresá el código"
                value={code}
                onChange={handleCodeChange}
                className={errors.code ? "input-error" : ""}
                maxLength={6}
                disabled={loading || success}
            />

            {errors.code && (
                <p className="error">
                    {errors.code}
                </p>
            )}

            <label>Nueva contraseña</label>

            <div
                className={`input-password ${errors.password ? "input-error" : ""
                    }`}
            >

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading || success}
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

            {errors.password && (
                <p className="error">
                    {errors.password}
                </p>
            )}

            <label>Confirmar contraseña</label>

            <div
                className={`input-password ${errors.confirmPassword ? "input-error" : ""
                    }`}
            >

                <input
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={loading || success}
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

            {errors.confirmPassword && (
                <p className="error">
                    {errors.confirmPassword}
                </p>
            )}

            {apiError && (
                <p className="error">
                    {apiError}
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
                {loading
                    ? "Guardando..."
                    : "Guardar contraseña"}
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