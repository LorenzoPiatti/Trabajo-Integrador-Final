import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import {
    Menu,
    LayoutDashboard,
    CalendarDays,
    PawPrint,
    Syringe,
    FileText,
    UserRound,
    LogOut
} from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) {

    const getNavLinkClass = ({ isActive }) =>
        isActive
            ? "sidebar-link active"
            : "sidebar-link";

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div>

                <div className="sidebar-header">

                    <button
                        className="collapse-btn"
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

                    <NavLink
                        to="/dashboard"
                        className={getNavLinkClass}
                    >
                        <LayoutDashboard size={20} />
                        <span>Inicio</span>
                    </NavLink>

                    <NavLink
                        to="/appointments"
                        className={getNavLinkClass}
                    >
                        <CalendarDays size={20} />
                        <span>Turnos</span>
                    </NavLink>

                    <NavLink
                        to="/pets"
                        className={getNavLinkClass}
                    >
                        <PawPrint size={20} />
                        <span>Mascotas</span>
                    </NavLink>

                    <NavLink
                        to="/vaccines"
                        className={getNavLinkClass}
                    >
                        <Syringe size={20} />
                        <span>Vacunas</span>
                    </NavLink>

                    <NavLink
                        to="/medical-history"
                        className={getNavLinkClass}
                    >
                        <FileText size={20} />
                        <span>Historial Médico</span>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={getNavLinkClass}
                    >
                        <UserRound size={20} />
                        <span>Perfil</span>
                    </NavLink>

                </nav>

            </div>

            <button className="logout-btn">

                <LogOut size={20} />

                {!collapsed && (
                    <span>Cerrar sesión</span>
                )}

            </button>

        </aside>

    );

}

export default Sidebar;