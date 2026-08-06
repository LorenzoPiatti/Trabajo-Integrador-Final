import { useEffect, useState } from "react";
import { CalendarDays, FileText, PawPrint, Search, Stethoscope } from "lucide-react";
import Panel from "../../../components/ui/Panel";
import { getMedicalRecordPets, getPetHistory } from "../../../services/medicalRecordService";
import { getPets } from "../../../services/petService";

function MedicalHistoryList({
    veterinarian,
    refreshKey
}) {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPets = async () => {
            try {

                const data = veterinarian
                    ? await getMedicalRecordPets()
                    : await getPets();

                setPets(data ?? []);

            } catch (err) {

                setError(err.message);

            }
        };

        loadPets();
    }, [veterinarian]);

    useEffect(() => {

        if (!selectedPet) {
            return;
        }

        const loadHistory = async () => {

            setLoading(true);
            setError("");

            try {

                const data = await getPetHistory(selectedPet);

                setHistory(data ?? []);

            } catch (err) {

                setHistory([]);
                setError(err.message);

            } finally {

                setLoading(false);

            }
        };

        loadHistory();

    }, [selectedPet, refreshKey]);

    return (
        <Panel className="medical-history-panel">

            <div className="medical-record-panel-header">

                <div>

                    <h2>Consultar historial médico</h2>

                    <p>
                        Seleccioná una mascota para consultar su historial.
                    </p>

                </div>

                <div className="appointment-form-badge">
                    <Search size={22} />
                </div>

            </div>

            <div className="medical-history-search">

                <select
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                >

                    <option value="">
                        Seleccionar mascota
                    </option>

                    {pets.map((pet) => (

                        <option
                            key={pet.petId}
                            value={pet.petId}
                        >
                            {pet.name}
                        </option>

                    ))}

                </select>

            </div>

            {error && (
                <div className="medical-record-status medical-record-status--error">
                    {error}
                </div>
            )}

            {loading && (
                <p>Cargando historial...</p>
            )}

            {!loading &&
                selectedPet &&
                history.length === 0 &&
                !error && (

                    <div className="medical-history-empty">

                        <FileText size={40} />

                        <p>
                            No existen registros médicos.
                        </p>

                    </div>

                )}

            {!loading &&
                history.length > 0 && (

                    <div className="medical-history-list">

                        {history.map((record) => (

                            <article
                                key={record.medicalRecordId}
                                className="medical-history-item"
                            >

                                <h4>

                                    <CalendarDays size={16} />

                                    {new Date(record.date).toLocaleDateString("es-AR")}

                                </h4>

                                <p>
                                    <PawPrint size={15} />

                                    <strong>Mascota:</strong>
                                    {record.petName}

                                </p>

                                <p>
                                    <Stethoscope size={15} />
                                    <strong>Veterinario:</strong>
                                    {record.veterinarianName}
                                </p>

                                <p>

                                    <strong>Descripción:</strong>

                                    {record.description}
                                </p>
                                <p>
                                    <strong>Diagnóstico:</strong>

                                    {record.diagnosis || "No registrado"}

                                </p>

                                <p>

                                    <strong>Tratamiento:</strong>

                                    {record.treatment}
                                </p>

                            </article>
                        ))}
                    </div>
                )}
        </Panel>
    );
}

export default MedicalHistoryList;