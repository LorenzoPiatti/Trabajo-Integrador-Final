import "./Layout.css";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
    return (
        <div className="layout">

            <Sidebar />

            <div className="layout-content">

                <Header />

                <main className="layout-main">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;