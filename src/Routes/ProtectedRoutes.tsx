import React from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    element: React.ReactElement<any>;
    allowedRole?: string[];
};

const ProtectedRoute = ({ element, allowedRole }: ProtectedRouteProps) => {

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    // console.log(role);

    if(!token ){
        return <Navigate to='/' />;
    }

    if(allowedRole && (!role || !allowedRole.includes(role))){
        if(role === 'test'){
            return <Navigate to='/test' />;
        }else if(role === 'ADMIN'){
            return <Navigate to='/admin' />;
        }else if(role === 'USER'){
            return <Navigate to='/home' />;
        }
    }
    return React.cloneElement(element, { role });
}

export default ProtectedRoute;