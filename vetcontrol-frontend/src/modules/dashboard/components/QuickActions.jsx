import {
    CalendarPlus,
    PawPrint,
    Syringe,
    UserPlus
} from "lucide-react";

import "./QuickActions.css";
import Panel from "../../../components/ui/Panel";

function QuickActions() {

    const actions = [
        {
            icon: <CalendarPlus size={22} />,
            title: "Nuevo turno"
        },
        {
            icon: <PawPrint size={22} />,
            title: "Registrar mascota"
        },
        {
            icon: <Syringe size={22} />,
            title: "Aplicar vacuna"
        },
        {
            icon: <UserPlus size={22} />,
            title: "Nuevo cliente"
        }
    ];

    return (

        <Panel>

            <h3>Acciones rápidas</h3>

            <div className="actions-grid">

                {
                    actions.map((action,index)=>(

                        <button
                            key={index}
                            className="action-card"
                        >

                            {action.icon}

                            <span>{action.title}</span>

                        </button>

                    ))
                }

            </div>

        </Panel>

    );
}

export default QuickActions;