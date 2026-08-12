import "./ProfileInfoForm.css";

import {
    Mail,
    MapPin,
    Phone,
    Save,
    UserRound,
    X
} from "lucide-react";

function ProfileInfoForm({
    profile,
    formData,
    editing,
    saving,
    onChange,
    onSubmit,
    onCancel
}) {

    return (

        <form
            className="profile-info-form"
            onSubmit={onSubmit}
        >

            <div className="profile-info-header">

                <div>

                    <h3>
                        Información personal
                    </h3>

                    <p>
                        Administrá los datos asociados a tu cuenta.
                    </p>

                </div>

                <UserRound size={22} />

            </div>

            <div className="profile-info-fields">

                <div className="profile-info-field">

                    <label>
                        Nombre de usuario
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        disabled={!editing}
                        maxLength={100}
                    />

                </div>

                <div className="profile-info-field">

                    <label>
                        Nombre
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={onChange}
                        disabled={!editing}
                        maxLength={50}
                    />

                </div>

                <div className="profile-info-field">

                    <label>
                        Apellido
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={onChange}
                        disabled={!editing}
                        maxLength={50}
                    />

                </div>

                <div className="profile-info-field">

                    <label>
                        Teléfono
                    </label>

                    <div className="profile-info-input-icon">

                        <Phone size={17} />

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            disabled={!editing}
                            maxLength={30}
                        />

                    </div>

                </div>

                <div className="profile-info-field profile-info-full">

                    <label>
                        Dirección
                    </label>

                    <div className="profile-info-input-icon">

                        <MapPin size={17} />

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={onChange}
                            disabled={!editing}
                            maxLength={150}
                        />

                    </div>

                </div>

                <div className="profile-info-field profile-info-full">

                    <label>
                        Email
                    </label>

                    <div className="profile-info-input-icon">

                        <Mail size={17} />

                        <input
                            type="email"
                            value={profile?.email ?? ""}
                            disabled
                        />

                    </div>

                    <small>
                        El email no puede modificarse desde el perfil.
                    </small>

                </div>

            </div>

            {editing && (

                <div className="profile-info-actions">

                    <button
                        type="button"
                        className="profile-info-cancel"
                        onClick={onCancel}
                        disabled={saving}
                    >

                        <X size={18} />

                        Cancelar

                    </button>

                    <button
                        type="submit"
                        className="profile-info-save"
                        disabled={saving}
                    >

                        <Save size={18} />

                        {saving
                            ? "Guardando..."
                            : "Guardar cambios"
                        }

                    </button>

                </div>

            )}

        </form>

    );

}

export default ProfileInfoForm;