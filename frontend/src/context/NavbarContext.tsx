import {createContext, ReactNode, SyntheticEvent, useContext, useState} from "react";

interface NavbarProps {
    activeKey: string;
    handleSelect: (eventKey: string | null, e: SyntheticEvent<unknown>) => void;
    setKey: (key: string) => void
}

const NavbarContext = createContext<NavbarProps | null>(null)

export const NavbarProvider = ({children}: { children: ReactNode }) => {
    const [activeKey, setActiveKey] = useState<string>("index")

    const handleSelect: (eventKey: string | null, _: SyntheticEvent<unknown>) => void = (eventKey: string | null, _: SyntheticEvent<unknown>) =>
    {
        setActiveKey(eventKey ? eventKey : "index")
    }

    const setKey = (key: string):void => {
        setActiveKey(key)
    }

    return <NavbarContext.Provider value={{activeKey, handleSelect, setKey}}>{children}</NavbarContext.Provider>
}

export const useNavbar: () => NavbarProps = (): NavbarProps => {
    const context = useContext(NavbarContext)

    if (context == null) {
        throw new Error("Erorr context Navbar")
    }
    return context
}