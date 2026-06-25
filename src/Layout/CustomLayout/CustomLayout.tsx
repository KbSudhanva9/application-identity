import { Button, Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
// import { MenuItems } from "../MenuItems";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Outlet } from "react-router-dom";
// import { BreadcrumbNav } from "../BreadcrumbNav";
// import { UserMenu } from "../UserMenu";
import { MenuList } from "../MenuList";
import { MenuItems } from "../MenuItems";
import { Content, Footer, Header } from "antd/es/layout/layout";

function CustomLayout({ menuitem }: any) {

    const role = localStorage.getItem("role") ?? "";

    const [collapsed, setCollapsed] = useState(false);


    return (
        <Layout className="main-layout">

    <Sider
        className="sidebar"
        collapsed={collapsed}
        collapsible
        trigger={null}
    >
        <div className="logo">
            AUTH
        </div>

        <MenuList 
            usermenuitem={MenuItems(role)}
        />

    </Sider>


    <Layout className="right-layout">

        <Header className="header">

            <Button
                className="toggle-btn"
                type="text"
                onClick={() => setCollapsed(!collapsed)}
                icon={
                    collapsed 
                    ? <MenuUnfoldOutlined/> 
                    : <MenuFoldOutlined/>
                }
            />

            <div className="header-title">
                Authentication Identity
            </div>

        </Header>


        <Content className="content-style">
            <div className="content-box">
                <Outlet/>
            </div>
        </Content>


        <Footer className="footer">
            Authentication-Identity
        </Footer>


    </Layout>

</Layout>
    );
}

export default CustomLayout;












// import { Button, Layout } from "antd";
// import Sider from "antd/es/layout/Sider";
// import { useState } from "react";
// // import { MenuItems } from "../MenuItems";
// import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
// import { Outlet } from "react-router-dom";
// // import { BreadcrumbNav } from "../BreadcrumbNav";
// // import { UserMenu } from "../UserMenu";
// import { MenuList } from "../MenuList";
// import { MenuItems } from "../MenuItems";
// import { Content, Footer, Header } from "antd/es/layout/layout";

// function CustomLayout( {menuitem} : any ) {

    
//     const [collapsed, setCollapsed] = useState(true);

//     return (
//         <Layout>
//             <Sider className="sidebar" collapsed={collapsed} collapsible trigger={null} >
//                 {/* <Logo /> */}
//                 <MenuList usermenuitem={MenuItems(menuitem)}/>
//                 {/* <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme}/> */}
//             </Sider>
//             <Layout>
//             {/* colorBgContainer */}
//                 <Header style={{ padding: 0, background: '#fff', position: 'sticky', }}>
//                     <Button type="text" className="toggle" onClick={() => { setCollapsed(!collapsed) }} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}></Button>

//                     {/* <BranchTree/> */}

//                     {/* <UserMenu firstLetter={firstLetter} />
//                     <label className="login-name">{name}</label>

//                     {shouldRenderComponent ? (
//                         <div className="login-name">
//                             <RegisterOrRequest />
//                         </div>
//                     ) : null} */}

//                     {/* <BranchTree className="branch-tree"/>  */}

//                 </Header>

//                 {/* <BreadcrumbNav /> */}
                
//                 {/* {menuitem === 'undefined' && isSpecialPath ? (
//                     <DemoComponent>
//                         <Content className="content-style">
//                             <Outlet />
//                         </Content>
//                     </DemoComponent>
//                 ) : ( */}
//                     <Content className="content-style">
//                     <Outlet />
//                     </Content>
//                 {/* // )} */}

//                 <Footer style={{ textAlign: 'center', background: '#ccc'}} >
//                     Authentation-Identity
//                     {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
//                     {/* Invoice Books ©{new Date().getFullYear()} */}
//                 </Footer>

//             </Layout>

//         </Layout>
//     );
// }

// export default CustomLayout;