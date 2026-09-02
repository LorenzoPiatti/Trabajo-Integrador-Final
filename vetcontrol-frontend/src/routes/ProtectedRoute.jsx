import { Navigate, useLocation } from "react-router-dom";
import { getUserRole } from "../utils/authUtils";

function ProtectedRoute({
    children,
    roles = []
}) {

    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    const role = getUserRole();

    if (!role) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    if (roles.length > 0 && !roles.includes(role)) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;
