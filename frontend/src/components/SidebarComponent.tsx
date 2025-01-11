import {ComponentType, ReactNode, useEffect, useState} from "react";
import {Container, Nav, NavDropdown} from "react-bootstrap";
import {Navigate, Outlet} from "react-router-dom";
import {useNavbar} from "../context/NavbarContext.tsx";
import {User, Vote} from "lucide-react";
import {useAuth} from "../context/AuthContext.tsx";
import {apiService} from "../utils/api-service.ts";

interface Props {
    children?: ReactNode | null;
}

interface MenuListProps {
    label: string;
    text: string;
    href: string;
    icon: ComponentType;
}

interface UserResponse {
    firstName: string;
    lastName: string;
}

const menuList: MenuListProps[] = [
    {
        label: "index",
        text: "Vote",
        href: "/~",
        icon: Vote
    }, {
        label: "user",
        text: "User",
        href: "/User",
        icon: User
    },
]

export const SidebarComponent = ({children = null}: Props) => {
    const [user, setUser] = useState<UserResponse>({
        firstName: "User",
        lastName: ""
    })
    const [isLogout, setLogout] = useState<boolean>(false)
    const {handleSelect, activeKey} = useNavbar()
    const {token, logout} = useAuth()

    useEffect(() => {
        apiService.get<UserResponse>("Auth/Me", token).then((res) => {
            setUser(res.data)
        })
    }, []);

    if (isLogout) return <Navigate to={"/"}/>

    return (<div className="d-flex">
        <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark vh-100 position-fixed top-0 "
             style={{width: "280px"}}>
            <a href="/"
               className="d-flex mt-2 align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <Container>
                    <span className="fs-4">Pemilihan Apps</span>
                </Container>
            </a>
            <Nav className="nav-pills flex-column mb-auto mt-4" activeKey={activeKey} onSelect={handleSelect}>
                {menuList.map((item, index) => (
                    <Nav.Item key={index} className={index != 0 ? "mt-2" : ""}>
                        <Nav.Link eventKey={item.label} className="text-white" href={item.href}>
                            <item.icon/>
                            {item.text}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <hr/>
            <div className="d-flex gap-2">
                <User/>
                <NavDropdown title={`${user.firstName} ${user.lastName}`} menuVariant="dark">
                    <NavDropdown.Item onClick={() => {
                        logout()
                        setLogout(true)
                    }}>
                        Log out
                    </NavDropdown.Item>
                </NavDropdown>
            </div>
        </div>
        {children != null ? children : <Outlet/>}
    </div>)
}