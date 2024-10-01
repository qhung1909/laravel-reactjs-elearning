import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AdminRole = ({ element }) => {
    const user = localStorage.getItem('user');
    const getRole = user ? JSON.parse(user) : null;

    const isAdmin = getRole && getRole.role === 'admin';

    if (!isAdmin) {
        console.log('Not admin');
        return <Navigate to='/' />;
    }

    return element;
};

export default AdminRole;
