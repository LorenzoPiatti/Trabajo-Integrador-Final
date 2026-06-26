import ResetPasswordForm from "../components/ResetPasswordForm";
import "../styles/Auth.css";
import petsImage from "../../../assets/pets.png";

function ResetPassword() {
    return (
        <div className="login-container">
            <div className="login-left">
                <img
                    src={petsImage}
                    alt="gato y perro"
                    className="login-image"
                />

                <p className="login-workspace">
                    Your Digital Workspace
                </p>

                <h1 className="login-brand">
                    VetControl
                </h1>
            </div>

            <div className="login-right">
                <ResetPasswordForm />
            </div>
        </div>
    );
}

export default ResetPassword;