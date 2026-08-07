import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {

            return JSON.parse(storedUser);

        }
        catch (error) {

            console.error(
                "No se pudo recuperar el usuario guardado:",
                error
            );

            localStorage.removeItem("user");

            return null;

        }

    });

    const login = (userData) => {

        setUser(userData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

    };

    const logout = () => {

        setUser(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {

    return useContext(AuthContext);

}