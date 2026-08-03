import { NavLink } from "react-router-dom";

import {
    CalendarDays,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    PawPrint,
    Syringe,
    UserRound
} from "lucide-react";

import "./Sidebar.css";

const navItems = [
    {
        to: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        label: "Inicio"
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

function Sidebar({ collapsed, setCollapsed }) {

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div>

                <div className="sidebar-header">

                    <button
                        type="button"
                        className="collapse-btn"
                        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
                        onClick={() => setCollapsed(!collapsed)}
                    >

                        <Menu size={22} />

                    </button>

                    {!collapsed && (

                        <div className="sidebar-logo">

                            <h2>VetControl</h2>

                            <span>Tu veterinaria digital</span>

                        </div>

                    )}

                </div>

                <nav className="sidebar-nav">

                    <ul>

                        {navItems.map((item) => (

                            <li key={item.to}>

                                <NavLink
                                    to={item.to}
                                    title={item.label}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "sidebar-link active"
                                            : "sidebar-link"
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

            <button
                type="button"
                className="logout-btn"
            >

                <LogOut size={20} />

                {!collapsed && (

                    <span>Cerrar sesión</span>

                )}

            </button>

        </aside>

    );

}

export default Sidebar;