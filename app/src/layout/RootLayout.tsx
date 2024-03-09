import { Outlet } from "react-router-dom";
import Is1abNavbar from "./Navbar";

function RootLayout(){
    return (
        <>
            <Is1abNavbar/>
            <Outlet/>
        </>
    )
}

export default RootLayout;