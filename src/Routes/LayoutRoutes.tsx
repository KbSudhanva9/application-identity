// import { Children } from "react";
import ProtectedRoute from "./ProtectedRoutes";

import NotFound from "../Utils/NotFound/NotFound";
import Login from "../pages/public/login/Login";


export const LayoutRoutes = [

    {path: "", element: <Login />},
    {path: "home", element: <ProtectedRoute element={<p>admin</p>} allowedRole={['ADMIN']} /> ,
        children : [
            {path: "", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['ADMIN']}/>},
            {path: "buyer-list", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['ADMIN']} />},
            {path: "seller-list", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['ADMIN']} />}
        ]
    },

    {path: "home", element: <ProtectedRoute element={<p>home</p>} allowedRole={['BUYER', 'SELLER']} /> ,
        children : [
            {path: "buyer", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['BUYER']}/>},
            {path: "seller", element: <ProtectedRoute element={<p>asfd</p>} allowedRole={['SELLER']} />},
        ]
    },

    {path: "*", element: <NotFound />}

]
