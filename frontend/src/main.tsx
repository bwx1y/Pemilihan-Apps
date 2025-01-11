import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {route} from "./utils/route.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import {NavbarProvider} from "./context/NavbarContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <NavbarProvider>
                <RouterProvider router={route}/>
            </NavbarProvider>
        </AuthProvider>
    </StrictMode>,
)
