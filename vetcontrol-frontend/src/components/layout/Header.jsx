import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import "./Header.css";

function Header({
    title = "Dashboard",
    subtitle = "Bienvenido a VetControl"
}) {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

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
                <h1>{title}</h1>

                <p>{subtitle}</p>

                <span>
                    {date} - {time} hs
                </span>
            </div>

            <div className="header-actions">
                <button type="button" className="header-icon">
                    <Bell size={20} />

                    <span className="notification-badge">
                        2
                    </span>
                </button>

                <div className="header-divider"></div>

                <button type="button" className="header-user">
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
