import {createContext, ReactElement, useContext, useEffect, useState} from "react";

export enum Role {
    Admin = "Admin",
    User = "User",
}

interface AuthContextProps {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLogin: boolean;
    isRole: Role | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({children}: { children: ReactElement }) => {
    const [token, setToken] = useState<string | null>(()=> {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem("_Key_Token_");
        }
        return null
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("_Key_Token_", token);
        }
    }, [token])

    const login = (token: string) => {
        setToken(token);
    }

    const logout = () => {
        localStorage.removeItem("_Key_Token_");
        setToken(null);
    }

    const isLogin: () => boolean = (): boolean => {
        return token !== null;
    }

    const isRole: () => Role | null = (): Role | null => {
        if (token == null) return null

        const profider = JSON.parse(atob(token.split(".")[1]))

        return profider["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    }

    return <AuthContext.Provider value={{
        token: token, login, logout, isLogin:isLogin(), isRole: isRole()
    }}>{children}</AuthContext.Provider>
}

export const useAuth:() => AuthContextProps = () => {
    const auth = useContext(AuthContext);
    if (auth == undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth;
}