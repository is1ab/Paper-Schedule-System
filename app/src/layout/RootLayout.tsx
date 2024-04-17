import { Outlet } from "react-router-dom";
import Is1abNavbar from "./Navbar";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

function RootLayout(){
    return (
        <>
            <Layout>
                <Is1abNavbar/>
                <Content className="bg-white overflow-auto" style={{maxHeight: "90vh"}}>
                    <Outlet/>
                </Content>
            </Layout>
        </>
    )
}

export default RootLayout;