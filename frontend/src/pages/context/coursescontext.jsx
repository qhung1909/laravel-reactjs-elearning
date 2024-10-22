import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px',
                textAlign:'center',
                width:'310px'
            }
        })
    }
}
export const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const navigate = useNavigate();

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const allCourses = response.data;

            setCourses(allCourses)
        } catch (error) {
            console.log('Error fetching categories', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <CoursesContext.Provider value={{ loading, courses,error }}>
            {children}
            <Toaster />
        </CoursesContext.Provider>
    );
};
CoursesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
