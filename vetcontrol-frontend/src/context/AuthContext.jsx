import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {


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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {

    return useContext(AuthContext);

}
