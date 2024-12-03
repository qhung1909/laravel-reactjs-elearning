/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/usercontext";

const TeacherRole = ({ element }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user === null) {
            return;
        }

        if (user.role !== "teacher") {
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

export default TeacherRole;
