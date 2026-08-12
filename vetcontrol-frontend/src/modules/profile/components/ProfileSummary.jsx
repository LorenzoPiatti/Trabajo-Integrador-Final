import "./ProfileSummary.css";

import {
    CheckCircle2,
    Edit3,
    Mail,
    ShieldCheck
} from "lucide-react";

function ProfileSummary({
    profile,
    editing,
    onEdit
}) {

    const firstName =
        profile?.owner?.firstName ||
        profile?.name ||
        "Usuario";

    const lastName =
        profile?.owner?.lastName ||
        "";

    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`
            .toUpperCase();

    const isAdmin =
        profile?.role?.toLowerCase() === "admin" ||
        profile?.role?.toLowerCase() === "administrador";

    return (

        <section className="profile-summary">

            <div className="profile-summary-avatar">

                {initials || "U"}

            </div>

            <div className="profile-summary-info">

                <h2>

                    {firstName} {lastName}

                </h2>

                <span className="profile-summary-email">

                    <Mail size={16} />

                    {profile?.email}

                </span>

                <div className="profile-summary-statuses">

                    {isAdmin && (

                        <span className="profile-summary-role">

                            <ShieldCheck size={15} />

                            Administrador

                        </span>

                    )}

                    {profile?.emailVerified && (

                        <span className="profile-summary-verified">

                            <CheckCircle2 size={15} />

                            Email verificado

                        </span>

                    )}

                </div>

            </div>

            {!editing && (

                <button
                    type="button"
                    className="profile-summary-edit"
                    onClick={onEdit}
                >

                    <Edit3 size={18} />

                    Editar perfil

                </button>

            )}

        </section>

    );

}

export default ProfileSummary;