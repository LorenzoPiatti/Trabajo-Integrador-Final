import "./Header.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ReminderBell from "../../modules/reminders/components/ReminderBell";

function Header() {

    const location = useLocation();

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentDate(new Date());

        }, 60000);

        return () => clearInterval(interval);

    }, []);

    const pageInfo = {

        "/dashboard": {
            title: "Inicio",
            subtitle: "Bienvenido nuevamente 👋"
        },

        "/appointments": {
            title: "Turnos",
            subtitle: "Gestioná tus próximos turnos."
        },

        "/pets": {
            title: "Mis Mascotas",
            subtitle: "Administrá la información de tus mascotas."
        },

        "/vaccines": {
            title: "Vacunas",
            subtitle: "Consultá y administrá las vacunas."
        },

        "/medical-records": {
            title: "Historial Médico",
            subtitle: "Revisá el historial clínico de tus mascotas."
        },

        "/profile": {
            title: "Mi Perfil",
            subtitle: "Administrá tu información personal."
        },
        
        "/reminders": {
            title: "Recordatorios",
            subtitle: "Consultá tus notificaciones y avisos."
        }

    };

    const currentPage =
        pageInfo[location.pathname] || {
            title: "VetControl",
            subtitle: "Tu veterinaria digital."
        };

    const date = currentDate.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = currentDate.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (

        <header className="header">

            <div className="header-title">

                <h1>{currentPage.title}</h1>

                <p>{currentPage.subtitle}</p>

                <span>

                    {date} • {time} hs

                </span>

            </div>

            <div className="header-actions">

                <ReminderBell />

                <div className="header-divider"></div>

                <button
                    type="button"
                    className="header-user"
                >

                    <div className="avatar">

                        VG

                    </div>

                    <div className="header-user-info">

                        <strong>Valentino</strong>

                        <small>Administrador</small>

                    </div>

                </button>

            </div>

        </header>

    );

}

export default Header;