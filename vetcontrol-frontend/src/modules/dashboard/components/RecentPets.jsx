import "./RecentPets.css";

import PetCard from "./PetCard";
import Panel from "../../../components/ui/Panel";
import PanelHeader from "../../../components/ui/PanelHeader";


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

    return (

        <Panel>

            <PanelHeader
                title="Mis mascotas"
                action="Administrar mascotas"
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