import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/usercontext";

// eslint-disable-next-line react/prop-types
const AdminRole = ({ element }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user === null) {
            return;
        }

        if (user.role !== "admin") {
            console.log('Not admin');
            navigate('/');
        } else {
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return null;
    }

    return element;
};

export default AdminRole;
