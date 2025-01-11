import {Role, useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";
import {ReactNode} from "react";


interface Props {
    children?: ReactNode | null;
    role?: Role | null;
}

export const Authorize = ({children = null, role = null}: Props) => {
    const {isRole, isLogin} = useAuth()

    if (!isLogin) return <Navigate to={'/'}/>

    if (role != null && isRole != role) return <Navigate to={"/"}/>

    if (children != null) return children
    return <Outlet/>
}