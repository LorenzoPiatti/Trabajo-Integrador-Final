import { NavLink, useNavigate } from "react-router-dom";
import {
    Bell,
    CalendarDays,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    PawPrint,
    Syringe,
    UserRound,
    Users
} from "lucide-react";
import { getUserRole } from "../../utils/authUtils";
import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

const navItems = [
    {
        to: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        label: "Inicio",
        roles: ["Owner", "Veterinarian", "Reception", "Admin"]
    },
    {
        to: "/appointments",
        icon: <CalendarDays size={20} />,
        label: "Turnos",
        roles: ["Owner", "Veterinarian", "Reception"]
    },
    {
        to: "/pets",
        icon: <PawPrint size={20} />,
        label: "Mascotas",
        roles: ["Owner"]
    },
    {
        to: "/vaccines",
        icon: <Syringe size={20} />,
        label: "Vacunas",
        roles: ["Owner", "Admin"]
    },
    {
        to: "/medical-records",
        icon: <FileText size={20} />,
        label: "Historial Médico",
        roles: ["Owner", "Veterinarian"]
    },
    {
        to: "/reminders",
        icon: <Bell size={20} />,
        label: "Recordatorios",
        roles: ["Owner"]
    },
    {
        to: "/profile",
        icon: <UserRound size={20} />,
        label: "Perfil",
        roles: ["Owner", "Veterinarian", "Reception", "Admin"]
    },
    {
        to: "/users",
        icon: <Users size={20} />,
        label: "Usuarios",
        roles: ["Admin"]
    }
];

function Sidebar({
    collapsed,
    setCollapsed
}) {

    const role = getUserRole();

    const visibleItems = navItems.filter((item) =>
        item.roles.includes(role)
    );

    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div>

                <div className="sidebar-header">

                    <button
                        type="button"
                        className="collapse-btn"
                        aria-label={
                            collapsed
                                ? "Expandir menú"
                                : "Colapsar menú"
                        }
                        onClick={() => setCollapsed(!collapsed)}
                    >

                        <Menu size={22} />

                    </button>

                    {!collapsed && (

                        <div className="sidebar-logo">

                            <h2>VetControl</h2>

                            <span>
                                Tu veterinaria digital
                            </span>

                        </div>

                    )}

                </div>

                <nav className="sidebar-nav">

                    <ul>

                        {visibleItems.map((item) => (

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

                                    {!collapsed && (

                                        <span>
                                            {item.label}
                                        </span>

                                    )}

                                </NavLink>

                            </li>

                        ))}

                    </ul>

                </nav>

            </div>

            <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
            >

                <LogOut size={20} />

                {!collapsed && (

                    <span>
                        Cerrar sesión
                    </span>

                )}

            </button>

        </aside>

    );

}

export default Sidebar;
