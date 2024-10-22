import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { debounce } from 'lodash';

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
                textAlign: 'center',
                width: '310px'
            }
        })
    }
}
export const CoursesContext = createContext();

// Trong coursescontext.jsx
export const CoursesProvider = ({ children }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

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


    const fetchSearchResults = async (query, limit = null) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/courses/search`, {
                params: { query: query.trim() }
            });
            if (response.status === 200 && Array.isArray(response.data)) {
                const results = limit ? response.data.slice(0, limit) : response.data;
                setFilteredProducts(results);
                return results;
            }
            setFilteredProducts([]);
            return [];
        } catch (error) {
            console.error('Error fetching search results:', error);
            setFilteredProducts([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchSearchResults = useCallback(
        debounce((value, limit) => {
            if (value.trim() !== '') {
                fetchSearchResults(value, limit);
                setIsOpen(true);
            } else {
                setFilteredProducts([]);
                setIsOpen(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        fetchCourses();
    }, []);
    return (
        <CoursesContext.Provider value={{
            courses, setCourses, searchValue,
            setSearchValue,
            filteredProducts,
            isOpen,
            setIsOpen,
            debouncedFetchSearchResults,
            fetchSearchResults
        }}>
            {children}
        </CoursesContext.Provider>
    );
};
CoursesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
