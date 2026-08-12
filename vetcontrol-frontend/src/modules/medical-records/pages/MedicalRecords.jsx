import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import Layout from "../../../components/layout/Layout";
import { isVeterinarian } from "../../../utils/authUtils";
import MedicalHistoryList from "../components/MedicalHistoryList";

import "../styles/MedicalRecords.css";

function MedicalRecords() {

    const token = localStorage.getItem("token");
    const veterinarian = isVeterinarian();

    if (!token) {

        return (

            <main className="appointments-auth-page">

                <section className="appointments-auth-card">

                    <div className="appointments-auth-icon">
                        <FileText size={30} />
                    </div>

                    <h1>
                        Historial Médico
                    </h1>

                    <p>
                        Iniciá sesión para acceder.
                    </p>

                    <Link
                        to="/"
                        className="appointments-primary-button"
                    >
                        Ir al inicio
                    </Link>

                </section>

            </main>
        );
    }

    return (

        <Layout
            title="Historial Médico"
            subtitle={
                veterinarian
                    ? "Consultá el historial clínico de las mascotas atendidas"
                    : "Consultá el historial clínico de tus mascotas"
            }
        >

            <div className="medical-records-dashboard">

                <section className="medical-record-section">

                    <MedicalHistoryList
                        veterinarian={veterinarian}
                    />

                </section>

            </div>

        </Layout>
    );
}

export default MedicalRecords;