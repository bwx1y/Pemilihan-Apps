import {Role, useAuth} from "../context/AuthContext.tsx";
import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

interface Props {
    role: Role;
    component: ReactNode
}

const WithRoleBasedComponent = ({item}: {item: Props[]}) => {
    const {isRole} = useAuth()

    if (item.find(f => f.role == isRole) != undefined) return item.find(f => f.role == isRole)!.component;
    else return <Navigate to={"/"}/>
}

export default WithRoleBasedComponent