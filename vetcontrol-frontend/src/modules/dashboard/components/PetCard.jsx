import "./PetCard.css";

import {
    Dog,
    Cat,
    Rabbit,
    ChevronRight
} from "lucide-react";

function PetCard({
    name,
    species
}) {

    const getIcon = () => {

        switch (species.toLowerCase()) {

            case "perro":
                return <Dog size={22} />;

            case "gato":
                return <Cat size={22} />;

            case "conejo":
                return <Rabbit size={22} />;

            default:
                return <Dog size={22} />;
        }

    };

    return (

        <div className="pet-card">

            <div className="pet-info">

                <div className="pet-icon">

                    {getIcon()}

                </div>

                <div>

                    <h4>{name}</h4>

                    <span>{species}</span>

                </div>

            </div>

            <ChevronRight size={20} />

        </div>

    );

}

export default PetCard;