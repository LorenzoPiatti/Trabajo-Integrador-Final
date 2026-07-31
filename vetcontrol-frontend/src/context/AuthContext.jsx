import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    // Datos simulados.
    // Cuando conectemos el login,
    // este objeto vendrá del backend.

    const [user, setUser] = useState({

        id: 1,

        firstName: "Valentino",

        lastName: "Gentiletti",

        role: "Administrador",

        email: "valentino@mail.com",

        notifications: 2,

        photo: null

    });

    const login = (userData) => {

        setUser(userData);

    };

    const logout = () => {

        setUser(null);

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

export function useAuth() {

    return useContext(AuthContext);

}