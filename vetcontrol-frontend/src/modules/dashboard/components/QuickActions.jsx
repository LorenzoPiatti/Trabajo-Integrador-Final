import {
    CalendarPlus,
    PawPrint,
    Syringe,
    FileText
} from "lucide-react";

import "./QuickActions.css";
import Panel from "../../../components/ui/Panel";
import { useNavigate } from "react-router-dom";

function QuickActions() {

    const navigate = useNavigate();

    const actions = [
        {
            icon: <CalendarPlus size={22} />,
            title: "Nuevo turno",
            path: "/appointments"
        },
        {
            icon: <PawPrint size={22} />,
            title: "Mis mascotas",
            path: "/pets"
        },
        {
            icon: <Syringe size={22} />,
            title: "Ver vacunas",
            path: "/vaccines"
        },
        {
            icon: <FileText size={22} />,
            title: "Historial médico",
            path: "/medical-records"
        }
    ];

    return (

        <Panel>

            <h3>Acciones rápidas</h3>

            <div className="actions-grid">

                {actions.map((action, index) => (

                    <button
                        key={index}
                        className="action-card"
                        onClick={() => navigate(action.path)}
                    >

                        {action.icon}

                        <span>{action.title}</span>

                    </button>

                ))}

            </div>

        </Panel>

    );

}

export default QuickActions;