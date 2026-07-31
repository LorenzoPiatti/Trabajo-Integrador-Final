import "./Layout.css";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({
    children,
    title = "Dashboard",
    subtitle = "Bienvenido a VetControl"
}) {
    return (
        <div className="layout">

            <Sidebar />

            <div className="layout-content">

                <Header
                    title={title}
                    subtitle={subtitle}
                />

                <main className="layout-main">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;
