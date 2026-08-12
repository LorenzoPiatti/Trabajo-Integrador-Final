import "./ProfileAccountStatus.css";

import {
    CheckCircle2,
    ShieldCheck,
    XCircle
} from "lucide-react";

function ProfileAccountStatus({
    profile
}) {

    const isActive = profile?.active;
    const isVerified = profile?.emailVerified;

    return (

        <section className="profile-account-status">

            <div className="profile-account-header">

                <div>

                    <h3>
                        Estado de la cuenta
                    </h3>

                    <p>
                        Información general de tu acceso a VetControl.
                    </p>

                </div>

                <ShieldCheck size={22} />

            </div>

            <div className="profile-account-grid">

                <div className="profile-account-item">

                    <span className="profile-account-label">
                        Estado
                    </span>

                    <div
                        className={`profile-account-value ${
                            isActive
                                ? "active"
                                : "inactive"
                        }`}
                    >

                        {isActive ? (

                            <CheckCircle2 size={17} />

                        ) : (

                            <XCircle size={17} />

                        )}

                        <strong>

                            {isActive
                                ? "Activa"
                                : "Inactiva"
                            }

                        </strong>

                    </div>

                </div>

                <div className="profile-account-item">

                    <span className="profile-account-label">
                        Email
                    </span>

                    <div
                        className={`profile-account-value ${
                            isVerified
                                ? "verified"
                                : "not-verified"
                        }`}
                    >

                        {isVerified ? (

                            <CheckCircle2 size={17} />

                        ) : (

                            <XCircle size={17} />

                        )}

                        <strong>

                            {isVerified
                                ? "Verificado"
                                : "Sin verificar"
                            }

                        </strong>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default ProfileAccountStatus;