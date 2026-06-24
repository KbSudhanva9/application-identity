// import { Children } from "react";
//import ProtectedRoute from "./ProtectedRoutes";

import NotFound from "../Utils/NotFound/NotFound";
import Login from "../pages/public/login/Login";
import Register from "../pages/public/Register";


export const LayoutRoutes = [

    {path: "", element: <Login />},
    {path: "/login", element: <Login />},
    {path: "register", element: <Register />},


    {path: "*", element: <NotFound />}

]
