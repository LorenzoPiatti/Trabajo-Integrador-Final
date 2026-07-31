import "./Header.css";
import { Bell, CircleUserRound } from "lucide-react";

function Header({
    title = "Dashboard",
    subtitle = "Bienvenido a VetControl"
}) {
    return (
        <header className="header">

            <div className="header-title">

                <h1>{title}</h1>

                <p>
                    {subtitle}
                </p>

            </div>

            <div className="header-actions">

                <button className="header-icon">
                    <Bell size={22} />
                </button>

                <button className="header-user">

                    <CircleUserRound size={28} />

                    <span>Administrador</span>

                </button>

            </div>

        </header>
    );
}

export default Header;
