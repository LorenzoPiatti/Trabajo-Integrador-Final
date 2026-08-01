import { useState } from "react";
import "./Layout.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({
    children,
    title = "Dashboard",
    subtitle = "Bienvenido a VetControl"
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layout">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`layout-content ${
                    collapsed ? "expanded" : ""
                }`}
            >
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
