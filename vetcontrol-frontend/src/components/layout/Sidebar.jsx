import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    CalendarDays,
    PawPrint,
    Syringe,
    FileText,
    UserRound,
    LogOut
} from "lucide-react";

function Sidebar() {
    const navItems = [
        {
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard"
        },
        {
            to: "/appointments",
            icon: <CalendarDays size={20} />,
            label: "Turnos"
        },
        {
            to: "/pets",
            icon: <PawPrint size={20} />,
            label: "Mascotas"
        },
        {
            to: "/vaccines",
            icon: <Syringe size={20} />,
            label: "Vacunas"
        },
        {
            to: "/medical-records",
            icon: <FileText size={20} />,
            label: "Historial Médico"
        },
        {
            to: "/profile",
            icon: <UserRound size={20} />,
            label: "Perfil"
        }
    ];

    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-logo">
                    <h2>VetControl</h2>

                    <span>
                        Tu veterinaria digital
                    </span>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        isActive ? "active" : undefined
                                    }
                                >
                                    {item.icon}

                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <button className="logout-btn">
                <LogOut size={20} />

                <span>Cerrar sesión</span>
            </button>
        </aside>
    );
}

export default Sidebar;
