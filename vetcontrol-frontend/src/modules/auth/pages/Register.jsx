import RegisterForm from "../components/RegisterForm";
import "../styles/Auth.css";
import petsImage from "../../../assets/pets.png";

function RegisterPage() {
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
                <RegisterForm />
            </div>
        </div>
    );
}

export default RegisterPage;