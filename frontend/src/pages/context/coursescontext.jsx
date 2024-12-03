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
    const [hotProducts, setHotProducts] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const [averageRatings, setAverageRatings] = useState({});
    const [totalReviews, setTotalReviews] = useState({});

    // Hàm lấy tất cả khóa học
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const allCourses = response.data;

            const newAverageRatings = {};
            const newTotalReviews = {};

            allCourses.forEach((course) => {
                // Khởi tạo giá trị mặc định
                newAverageRatings[course.course_id] = 0;
                newTotalReviews[course.course_id] = 0;

                // Kiểm tra comments có tồn tại và có phải array không
                if (course.comments && Array.isArray(course.comments)) {
                    // Lọc ra các comments có rating hợp lệ
                    const validComments = course.comments.filter(comment =>
                        comment && comment.rating && !isNaN(Number(comment.rating))
                    );

                    // Cập nhật số lượng đánh giá
                    newTotalReviews[course.course_id] = validComments.length;

                    if (validComments.length > 0) {
                        // Tính tổng rating từ các comments hợp lệ
                        const totalRating = validComments.reduce((sum, comment) => {
                            return sum + Number(comment.rating);
                        }, 0);

                        // Tính trung bình và làm tròn đến 1 chữ số thập phân
                        newAverageRatings[course.course_id] =
                            Number((totalRating / validComments.length).toFixed(1));
                    }
                }

            });

            setAverageRatings(newAverageRatings);
            setTotalReviews(newTotalReviews);
            setCourses(allCourses);

        } catch (error) {
            console.error('Lỗi khi tải danh sách khóa học:', error);
        } finally {
            setLoading(false);
        }
    };

    // khóa học theo danh mục
    const fetchCoursesByCategory = async (slug) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/categories/${slug}`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const categoryCourses = response.data.courses;
            setCourses(categoryCourses);
        } catch (error) {
            console.log('Error fetching courses by category', error);
        } finally {
            setLoading(false);
        }
    };

    // search khóa học
    const fetchSearchResults = async (query, limit = null) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/courses/search`, {
                params: {
                    query: query.trim(),
                    pattern: 'partial', // hoặc 'exact' tùy nhu cầu
                    limit: limit
                }
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

    // khóa học nổi bật
    const fetchTopPurchasedProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/top-purchased-courses`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            setHotProducts(response.data);
        } catch (error) {
            console.log('Error fetching API:', error);
        } finally {
            setLoading(false);
        }
    }


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
    return (
        <CoursesContext.Provider value={{
            courses, setCourses, searchValue,
            setSearchValue,
            filteredProducts,
            isOpen,
            setIsOpen,
            debouncedFetchSearchResults,
            fetchSearchResults,
            fetchCoursesByCategory,
            fetchCourses,
            fetchTopPurchasedProduct,
            hotProducts,
            averageRatings,
            totalReviews

        }}>
            {children}
        </CoursesContext.Provider>
    );
};
CoursesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
