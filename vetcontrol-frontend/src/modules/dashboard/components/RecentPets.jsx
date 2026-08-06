import "./RecentPets.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PetCard from "./PetCard";
import Panel from "../../../components/ui/Panel";
import PanelHeader from "../../../components/ui/PanelHeader";

import { getPets } from "../../../services/petService";

function RecentPets() {

    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadPets = async () => {

            try {

                const data = await getPets();

                setPets(data);

            }
            catch (error) {

                console.error("Error al obtener mascotas:", error);

            }
            finally {

                setLoading(false);

            }

        };

        loadPets();

    }, []);

    return (

        <Panel>

            <PanelHeader
                title="Mis mascotas"
                action="Administrar mascotas"
                onAction={() => navigate("/pets")}
            />

            {loading ? (

                <p>Cargando mascotas...</p>

            ) : pets.length === 0 ? (

                <p>No tenés mascotas registradas.</p>

            ) : (

                <div className="pets-list">

                    {pets.slice(0, 2).map((pet) => (

                        <PetCard
                            key={pet.petId}
                            name={pet.name}
                            species={pet.species}
                        />

                    ))}

                </div>

            )}

        </Panel>

    );

}

export default RecentPets;