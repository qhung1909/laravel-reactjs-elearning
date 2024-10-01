import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const TeachRole = ({ element }) => {
    const user = localStorage.getItem('user');
    const getRole = user ? JSON.parse(user) : null;

    const isTeach = getRole && getRole.role === 'teach';

    if (!isTeach) {
        console.log('Not teach');
        return <Navigate to='/' />;
    }

    return element;
};

export default TeachRole;
