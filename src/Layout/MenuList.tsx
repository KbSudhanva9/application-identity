import { Menu } from "antd";
// import { EditOutlined , UserOutlined, FileTextOutlined} from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from "react";

interface MenuListProps {
    usermenuitem: any;
}

export const MenuList = ({ usermenuitem }: MenuListProps) => {

    const nav = useNavigate();

    const clickedmenu = (key : any) => {
        console.log(key);
        nav(key);
    }

    const [uMenu, setUMenu] = useState(usermenuitem);
    

    return (
        <Menu
            mode="inline"
            theme="dark"
            items={uMenu}
            defaultOpenKeys={['main']}
            // defaultSelectedKeys={['home']}
            onClick={(e) => clickedmenu(e.key)}
            className="menu-bar"
        />
            // {/* <Outlet/> */}
        // </Menu>         
        
    );
}

// export default MenuList;