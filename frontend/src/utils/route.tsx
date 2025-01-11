import {createBrowserRouter} from "react-router-dom";
import {HomePage} from "../pages/Home.tsx";
import {Authorize} from "../components/AuthorizeComponent.tsx";
import DashboardPage from "../pages/Dashboard.tsx";
import RegisterPage from "../pages/Register.tsx";
import {Role} from "../context/AuthContext.tsx";
import {SidebarComponent} from "../components/SidebarComponent.tsx";
import CreatVotePage from "../pages/vote/Create.tsx";
import WithRoleBasedComponent from "../components/WithRoleBasedComponent.tsx";
import EditVotePage from "../pages/vote/Edit.tsx";
import UserPage from "../pages/user/Index.tsx";
import CreateUserPage from "../pages/user/Create.tsx";
import EditUserPage from "../pages/user/Edit.tsx";
import ApplyVotePage from "../pages/vote/Apply.tsx";

const route = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>
    },
    {
        path: "/register",
        element: <RegisterPage/>
    },
    {
        path: "/~",
        element: <Authorize/>,
        children: [
            {
                index: true,
                element: <DashboardPage/>,
            }
        ]
    },
    {

        path: "/User",
        element: <Authorize role={Role.Admin}/>,
        children: [
            {
                index: true,
                element: <SidebarComponent><UserPage/></SidebarComponent>
            },
            {
                path: "/User/Create",
                element: <CreateUserPage/>
            },
            {
                path: "/User/:id",
                element: <EditUserPage/>
            }
        ]
    },
    {
        path: "/Vote/Create",
        element: <Authorize role={Role.Admin}><CreatVotePage/></Authorize>
    },
    {
        path: "/Vote/:id",
        element: <WithRoleBasedComponent item={[
            {
                role: Role.Admin,
                component: <EditVotePage/>
            },
            {
                role: Role.User,
                component: <ApplyVotePage/>
            }
        ]}/>
    }
])

export {route}