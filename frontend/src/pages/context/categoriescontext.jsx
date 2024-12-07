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
export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [categoryLoading, setCategoriesLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const navigate = useNavigate();

    const fetchCategories = async () => {
        setCategoriesLoading(true)
        try {
            const response = await axios.get(`${API_URL}/categories`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const allCategories = response.data;

            setCategories(allCategories)
        } catch (error) {
            console.log('Error fetching categories', error)
        } finally {
            setCategoriesLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoriesContext.Provider value={{ categoryLoading, categories,error,setCategoriesLoading }}>
            {children}
            <Toaster />
        </CategoriesContext.Provider>
    );
};
CategoriesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
