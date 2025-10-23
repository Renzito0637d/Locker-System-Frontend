// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../lib/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [auth, setAuth] = useState({ checked: false, authorized: false });

    useEffect(() => {
        const verify = async () => {
            try {
                const user = await getMe();
                const userRoles = user.roles || [];
                const authorized = allowedRoles.some((role) => userRoles.includes(role));
                setAuth({ checked: true, authorized });
            } catch (err) {
                setAuth({ checked: true, authorized: false });
            }
        };
        verify();
    }, [allowedRoles]);

    if (!auth.checked) return <div>Cargando...</div>;
    if (!auth.authorized) return <Navigate to="/" replace />;
    return children;
};

export default ProtectedRoute;
