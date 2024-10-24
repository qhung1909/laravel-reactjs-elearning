import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/usercontext";

// eslint-disable-next-line react/prop-types
const AdminRole = () => {
    const { admin, user } = useContext(UserContext)

    const isAdmin = admin?.role === "admin";
    console.log(user?.name);

    console.log(admin?.role, 'xem role');

    if (!isAdmin) {
        console.log('Not admin');
        return <Navigate to='/' />;
    }
};

export default AdminRole;
