/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/usercontext";

const AdminRole = ({ element }) => {
    const { admin } = useContext(UserContext);

    const isAdmin = admin?.role === "admin";
    console.log(admin?.role, 'xem role');

    if (!isAdmin) {
        console.log('Not admin');
        return <Navigate to='/' />;
    }

    return element; // Trả về phần tử nếu là admin
};

export default AdminRole;
