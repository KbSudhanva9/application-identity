import {
  UserOutlined,
  TeamOutlined
} from "@ant-design/icons";

export const MenuItems = (role: string) => {

  const menu = [];

  if (role === "ADMIN") {

    menu.push(
      {
        key: "profile",
        label: "Profile",
        icon: <UserOutlined />
      },
      {
        key: "user-list",
        label: "User List",
        icon: <TeamOutlined />
      }
    );

  } else if (role === "USER") {

    menu.push(
      {
        key: "profile",
        label: "Profile",
        icon: <UserOutlined />
      }
    );

  }

  return menu;
};