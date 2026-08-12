import "./Profile.css";

import { useEffect, useState } from "react";

import Layout from "../../../components/layout/Layout";

import ProfileSummary from "../components/ProfileSummary";
import ProfileInfoForm from "../components/ProfileInfoForm";
import ProfileAccountStatus from "../components/ProfileAccountStatus";

import {
    getProfile,
    updateProfile
} from "../../../services/profileService";

import { useAuth } from "../../../context/AuthContext";

function Profile() {

    const { login: updateAuthenticatedUser } = useAuth();

    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getProfile();

                setProfile(data);

                setFormData({
                    name: data?.name ?? "",
                    firstName: data?.owner?.firstName ?? "",
                    lastName: data?.owner?.lastName ?? "",
                    phone: data?.owner?.phone ?? "",
                    address: data?.owner?.address ?? ""
                });

            }
            catch (error) {

                console.error(
                    "Error al obtener el perfil:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "No se pudo cargar el perfil."
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadProfile();

    }, []);

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(currentData => ({
            ...currentData,
            [name]: value
        }));

    };

    const handleEdit = () => {

        setError("");
        setSuccess("");

        setEditing(true);

    };

    const handleCancel = () => {

        if (!profile) {
            return;
        }

        setFormData({
            name: profile.name ?? "",
            firstName: profile.owner?.firstName ?? "",
            lastName: profile.owner?.lastName ?? "",
            phone: profile.owner?.phone ?? "",
            address: profile.owner?.address ?? ""
        });

        setError("");
        setSuccess("");

        setEditing(false);

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.name.trim()) {

            setError(
                "El nombre es obligatorio."
            );

            return;

        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await updateProfile({
                name: formData.name.trim(),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim()
            });

            const updatedProfile = await getProfile();

            setProfile(updatedProfile);

            setFormData({
                name: updatedProfile?.name ?? "",
                firstName: updatedProfile?.owner?.firstName ?? "",
                lastName: updatedProfile?.owner?.lastName ?? "",
                phone: updatedProfile?.owner?.phone ?? "",
                address: updatedProfile?.owner?.address ?? ""
            });

            updateAuthenticatedUser({
                id: updatedProfile.userId,

                firstName:
                    updatedProfile.owner?.firstName ||
                    updatedProfile.name ||
                    "Usuario",

                lastName:
                    updatedProfile.owner?.lastName ||
                    "",

                email:
                    updatedProfile.email ||
                    "",

                role:
                    updatedProfile.role ||
                    "",

                photo: null
            });

            setSuccess(
                "Perfil actualizado correctamente."
            );

            setEditing(false);

        }
        catch (error) {

            console.error(
                "Error al actualizar el perfil:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el perfil."
            );

        }
        finally {

            setSaving(false);

        }

    };



    if (loading) {

        return (

            <Layout>

                <div className="profile-page">

                    <div className="profile-page-state">

                        Cargando perfil...

                    </div>

                </div>

            </Layout>

        );

    }

    if (error && !profile) {

        return (

            <Layout>

                <div className="profile-page">

                    <div className="profile-page-state error">

                        {error}

                    </div>

                </div>

            </Layout>

        );

    }

    return (

        <Layout>

            <div className="profile-page">

                <ProfileSummary
                    profile={profile}
                    editing={editing}
                    onEdit={handleEdit}
                />

                {success && (

                    <div className="profile-page-message success">

                        {success}

                    </div>

                )}

                {error && profile && (

                    <div className="profile-page-message error">

                        {error}

                    </div>

                )}

                <ProfileInfoForm
                    profile={profile}
                    formData={formData}
                    editing={editing}
                    saving={saving}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

                <ProfileAccountStatus
                    profile={profile}
                />

            </div>

        </Layout>

    );

}

export default Profile;