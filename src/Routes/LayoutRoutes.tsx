// import { Children } from "react";
//import ProtectedRoute from "./ProtectedRoutes";

import NotFound from "../Utils/NotFound/NotFound";
import Login from "../pages/public/login/Login";
import Register from "../pages/public/Register";
import ResetPassword from "../pages/public/ResetPassword";
import AdminLogin from "../pages/public/login/AdminLogin";
import ProtectedRoute from "./ProtectedRoutes";
import CustomLayout from "../Layout/CustomLayout/CustomLayout";
import Profile from "../pages/private/Profile";
import UserList from "../pages/private/UserList";


export const LayoutRoutes = [

    {path: "", element: <Login />},
    {path: "/login", element: <Login />},
    {path: "register", element: <Register />},
    {path: "reset-password", element: <ResetPassword />},
    {path: "admin", element: <AdminLogin />},

    {path: "home", element: <ProtectedRoute element={<CustomLayout menuitem={'ADMIN'} />} allowedRole={['ADMIN', 'USER']} /> ,
          children : [
              // {path: "", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['ADMIN']}/>},
              // {path: "profile", element: <ProtectedRoute element={<p>asadasdasdsadsadsadsadasdsfd</p>} allowedRole={['ADMIN','USER']} />},
              {
                path: "profile",
                element: (
                <ProtectedRoute
                    element={<Profile/>}
                    allowedRole={['ADMIN', 'USER']}
                />
                )
            },
              // {path: "user-list", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['ADMIN']} />}

            {
                path: "user-list",
                element: (
                <ProtectedRoute
                    element={<UserList />}
                    allowedRole={['ADMIN']}
                />
                )
            }

      ]
    },

    {path: "*", element: <NotFound />}

]
