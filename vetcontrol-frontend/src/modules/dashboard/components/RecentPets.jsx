import "./RecentPets.css";

import PetCard from "./PetCard";
import Panel from "../../../components/ui/Panel";
import PanelHeader from "../../../components/ui/PanelHeader";
import { useNavigate } from "react-router-dom";

const pets = [
    {
        id:1,
        name:"Luna",
        species:"Perro"
    },
    {
        id:2,
        name:"Misha",
        species:"Gato"
    },
   
];


function RecentPets(){

    const navigate = useNavigate();
    return (

        <Panel>

            <PanelHeader
                title="Mis mascotas"
                action="Administrar mascotas"
                onAction={() => navigate("/pets")}
            />


            <div className="pets-list">

                {
                    pets.map((pet)=>(

                        <PetCard
                            key={pet.id}
                            name={pet.name}
                            species={pet.species}
                        />

                    ))
                }

            </div>


        </Panel>

    );

}


export default RecentPets;