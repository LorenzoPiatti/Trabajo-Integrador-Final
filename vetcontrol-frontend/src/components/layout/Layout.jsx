import { useState } from "react";

import "./Layout.css";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {

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

                <Header />

                <main className="layout-main">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;