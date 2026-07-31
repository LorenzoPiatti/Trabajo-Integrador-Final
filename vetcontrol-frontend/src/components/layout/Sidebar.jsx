import "./Sidebar.css";

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

                    <ul>

                        <li className="active">
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </li>

                        <li>
                            <CalendarDays size={20} />
                            <span>Turnos</span>
                        </li>

                        <li>
                            <PawPrint size={20} />
                            <span>Mascotas</span>
                        </li>

                        <li>
                            <Syringe size={20} />
                            <span>Vacunas</span>
                        </li>

                        <li>
                            <FileText size={20} />
                            <span>Historial Médico</span>
                        </li>

                        <li>
                            <UserRound size={20} />
                            <span>Perfil</span>
                        </li>

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