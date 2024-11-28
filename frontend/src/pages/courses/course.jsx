import './courses.css'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label'
import { formatCurrency } from "@/components/Formatcurrency/formatCurrency";
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { CoursesContext } from "../context/coursescontext";
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesContext } from '../context/categoriescontext';
import { formatDateNoTime } from '@/components/FormatDay/Formatday';
import { Badge } from '@/components/ui/badge';
import { Book, Users, WifiOff, Wifi, Crown, Calendar, ShoppingCart, Tag } from 'lucide-react';
import { Medal, BookOpen, Star, TrendingUp } from 'lucide-react';

export const Courses = () => {
    const { courses, setCourses, fetchSearchResults, fetchCoursesByCategory, fetchCourses, fetchTopPurchasedProduct, hotProducts } = useContext(CoursesContext);
    const { categories } = useContext(CategoriesContext);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [coursesPerPage] = useState(4);
    const [loading, setLoading] = useState(false)
    const location = useLocation();
    const [hotInstructor, setHotInstructor] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [onlineFilter, setOnlineFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const navigate = useNavigate();

    // hàm lọc sản phẩm
    const getSortedCourses = () => {
        if (!courses) return [];
        let filteredCourses = [...courses];

        // Apply online/offline filter first
        if (onlineFilter !== '') {
            filteredCourses = filteredCourses.filter(course =>
                course.is_online_meeting === parseInt(onlineFilter)
            );
        }

        // Apply rating filter to already filtered courses
        if (ratingFilter) {
            filteredCourses = filteredCourses.filter(course => {
                const rating = course.comments && course.comments.length > 0
                    ? parseFloat(course.comments[0].rating)
                    : 'Chưa có dữ liệu';
                return rating >= parseFloat(ratingFilter);
            });
        }

        // Apply sorting criteria to filtered courses
        if (sortCriteria) {
            switch (sortCriteria) {
                case 'New':
                    filteredCourses.sort((a, b) => {
                        const dateA = new Date(a.created_at || 0);
                        const dateB = new Date(b.created_at || 0);
                        return dateB - dateA;
                    });
                    break;
                case 'Hot':
                    filteredCourses.sort((a, b) => (b.views || 0) - (a.views || 0));
                    break;
                case 'Buy':
                    filteredCourses.sort((a, b) => (b.is_buy || 0) - (a.is_buy || 0));
                    break;
                case 'priceAsc':
                    filteredCourses.sort((a, b) => (a.price_discount || 0) - (b.price_discount || 0));
                    break;
                case 'priceDesc':
                    filteredCourses.sort((a, b) => (b.price_discount || 0) - (a.price_discount || 0));
                    break;
            }
        }

        return filteredCourses;
    };


    const sortedCourses = getSortedCourses();
    const totalFilteredCourses = sortedCourses.length;
    const totalPages = Math.ceil(totalFilteredCourses / coursesPerPage);

    // Ensure current page doesn't exceed maximum pages after filtering
    const adjustedCurrentPage = Math.min(currentPage, totalPages || 1);
    const indexOfLastCourse = adjustedCurrentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);


    // thao tác xử lý lọc mới/hot/new
    const handleSortChange = (checked, value) => {
        if (checked) {
            setSortCriteria(value);
        } else {
            setSortCriteria('');
        }
    };

    // Hàm clear tất cả các filter
    const clearFilters = () => {
        setSortCriteria('');
        setRatingFilter('');
        setSelectedCategory(null);
        setOnlineFilter(''); // Clear online filter
        fetchCourses(); // Lấy lại tất cả sản phẩm
    };

    const handleOnlineFilter = (checked, value) => {
        if (checked) {
            setOnlineFilter(value);
        } else {
            setOnlineFilter('');
        }
    };


    // thao tác xử lý lọc giá
    const handlePriceSort = (checked, value) => {
        if (checked) {
            setSortCriteria(value);
        } else {
            setSortCriteria('');
        }
    };

    // thao tác xử lý lọc rating
    const handleRatingFilter = (checked, value) => {
        if (checked) {
            setRatingFilter(value);
        } else {
            setRatingFilter('');
        }
    };

    // useEffect(() => {
    //     const queryParams = new URLSearchParams(location.search);
    //     const categorySlug = queryParams.get('category');

    //     if (categorySlug) {
    //         fetchCoursesByCategory(categorySlug);
    //         setSelectedCategory(categorySlug);
    //     } else {
    //         fetchCourses();
    //     }
    //     fetchTopPurchasedProduct();
    // }, [location.search, sortCriteria]);

    const handleCategoryClick = (slug) => {
        fetchCoursesByCategory(slug);
        setSelectedCategory(slug);
        navigate(`/courses?category=${slug}`);
        window.scrollBy({
            top: 600,
            behavior: 'smooth'
        })
    };

    // giảng viên hot
    const fetchHotInstructor = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/instructors/top`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                },
            });
            const hotInstructor = response.data
            setHotInstructor(hotInstructor.slice(0, 4));
        } catch (error) {
            console.log('Error fetching hot instructor', error)
        } finally {
            setLoading(false);
        }
    }

    const renderHotInstructor = loading ? (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <div className="flex flex-col space-y-3" key={index}>
                    <Skeleton className="h-[125px] w-11/12 rounded-xl" />
                    <div className="flex flex-col space-y-2 items-center md:items-start">
                        <Skeleton className="h-4 w-8/12 md:w-11/12" />
                        <Skeleton className="h-4 w-5/12 md:w-9/12" />
                    </div>
                </div>
            ))}
        </>
    ) : Array.isArray(hotInstructor) && hotInstructor.length > 0 ? (
        hotInstructor.map((item, index) => (
            <div
                key={index}
                className="bg-white my-3 sm:my-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 group"
            >
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-full ring-4 ring-amber-100 group-hover:ring-amber-200 transition-all"
                            src={item.avatar}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1">
                            <Star className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {item.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-1">
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {item.max_is_buy} khóa học đã bán
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div className="text-center p-8 bg-amber-50 rounded-lg">
            <Users className="mx-auto h-12 w-12 text-amber-500 mb-3" />
            <p className="text-gray-600">Không có giảng viên nào phù hợp ngay lúc này, thử lại sau nhé!</p>
        </div>
    )


    // xử lý phân trang và render


    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <PaginationItem key={i} className={i === adjustedCurrentPage ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(i)} href="#">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            if (adjustedCurrentPage > 1) {
                pageNumbers.push(
                    <PaginationItem key={1} className={adjustedCurrentPage === 1 ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(1)} href="#">
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (adjustedCurrentPage > 3) {
                    pageNumbers.push(<PaginationItem key="left-dots"><PaginationEllipsis /></PaginationItem>);
                }
            }

            const startPage = Math.max(2, adjustedCurrentPage - 1);
            const endPage = Math.min(adjustedCurrentPage + 1, totalPages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <PaginationItem key={i} className={i === adjustedCurrentPage ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(i)} href="#">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (adjustedCurrentPage < totalPages - 2) {
                pageNumbers.push(<PaginationItem key="right-dots"><PaginationEllipsis /></PaginationItem>);
            }

            pageNumbers.push(
                <PaginationItem key={totalPages} className={adjustedCurrentPage === totalPages ? 'active' : ''}>
                    <PaginationLink onClick={() => paginate(totalPages)} href="#">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pageNumbers;
    };

    const paginate = (pageNumber) => {
        const maxPage = Math.ceil(sortedCourses.length / coursesPerPage);
        const safePageNumber = Math.min(pageNumber, maxPage);
        setCurrentPage(safePageNumber); // Update current page in state
        const currentParams = new URLSearchParams(location.search);
        currentParams.set('page', safePageNumber);
        navigate(`?${currentParams.toString()}`);
    };

    // Khóa học nổi bật
    const render_course_hot = loading ? (
        // Skeleton cho khóa học nổi bật
        Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="my-5">
                <Link className="relative bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row group">
                    <Skeleton className="w-full custom-img-height md:h-82 lg:h-60 lg:w-96 object-cover mb-4 lg:mb-0 lg:mr-4 border" />
                    <div className="bg-white p-6 flex flex-col justify-between w-full">
                        <div className="flex-1">
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-1/4 mb-1" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <Skeleton className="h-6 w-1/3 mb-2" />
                        </div>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                    </div>
                </Link>
            </div>
        ))
    ) : (
        hotProducts.map((item, index) => (
            <div key={index}>
                <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-xl flex flex-col lg:flex-row group lg:my-5 md:my-3 my-0 hover:shadow-xl transition-all duration-300 border border-amber-100">
                    <div className="relative flex-shrink-0 lg:w-[400px]">
                        <img
                            alt={item.title}
                            className="w-full h-[300px] lg:h-full object-contain mb-4 lg:mb-0 lg:mr-4 rounded-lg shadow-sm"
                            src={item.img}
                        />
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                            <Crown size={16} className="animate-pulse" />
                            <span className="font-semibold">Bán chạy nhất</span>
                        </Badge>
                    </div>
                    <div className="bg-white p-6 flex flex-col justify-between flex-grow">
                        <div className="flex-1 space-y-4">
                            <Badge
                                variant="secondary"
                                className={`mb-2 px-4 py-2 text-sm font-bold shadow-lg ${item.is_online_meeting === 1
                                    ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white"
                                    : "bg-gradient-to-r from-emerald-400 to-teal-400 text-white"
                                    } rounded-lg`}
                            >
                                {item.is_online_meeting === 1
                                    ? "👨‍🏫 Face-to-Face - Tương tác trực tiếp"
                                    : "🎓 E-Learning - Học mọi lúc mọi nơi"}
                            </Badge>

                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight group-hover:text-amber-500 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-base text-gray-600 leading-relaxed">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-sm px-3 py-1.5 rounded-lg">
                                    <span className="font-medium">🎓 Giảng viên:</span> {item.user?.name || "Đang cập nhật"}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 flex items-center gap-2 border border-amber-200 text-sm font-medium px-3 py-1.5 rounded-lg">
                                    <ShoppingCart size={16} />
                                    <span>{item.is_buy} Học viên đã đăng ký</span>
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-amber-700">
                                <Calendar size={16} />
                                <span>Cập nhật ngày {" "}
                                    <span className="font-semibold">{formatDateNoTime(item.updated_at)}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Tag className="w-6 h-6 text-blue-500" />
                                <span className="text-2xl font-bold text-blue-500">
                                    {formatCurrency(item.price_discount)}
                                </span>
                            </div>
                            {item.price_discount < item.price && (
                                <>
                                    <span className="text-base text-gray-500 line-through">
                                        {formatCurrency(item.price)}
                                    </span>
                                    <Badge className="bg-gradient-to-r from-blue-300 to-blue-400 text-white text-sm font-medium px-3 py-1 rounded-full">
                                        Giảm {Math.round((1 - item.price_discount / item.price) * 100)}%
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

        ))
    );
    // Danh sách khóa học
    const render = loading ? (
        Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="my-5">
                <Link className="relative bg-white p-4 rounded-lg shadow flex group">
                    <Skeleton className="w-30 h-20 md:w-50 md:h-40 object-cover mr-4" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-1" />
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="ml-auto">
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-6 w-20 line-through" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 bg-white border border-gray-300 shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 px-6 py-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                    </div>
                </Link>
            </div>
        ))
    ) : (
        currentCourses.map((item, index) => (
            <div key={index} >
                <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-lg flex items-center group my-5 hover:shadow-lg transition-shadow">
                    <img alt={item.title} className="w-44 h-28 sm:w-64 sm:h-40 md:w-72 md:h-40 sm:object-cover mr-4 rounded-lg" src={item.img} />
                    <div className="flex-1 ml-4">
                        <Badge
                            variant="secondary"
                            className={`mb-2 px-3 py-1.5 text-sm font-bold shadow-md ${item.is_online_meeting === 1
                                ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white"
                                : "bg-gradient-to-r from-green-500 to-cyan-500 text-white"
                                }`}
                        >
                            {item.is_online_meeting === 1
                                ? "👨‍🏫 Face-to-Face - Tương tác trực tiếp"
                                : "🎓 E-Learning - Học mọi lúc mọi nơi"}
                        </Badge>
                        <h3 className="text-md md:text-lg font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 pr-5 line-clamp-2 mb-3">
                            {item.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                            <Users size={16} className="mr-1" />
                            <span className="font-medium mr-1">Đăng bởi:</span>
                            {item.user?.name || "Không thấy tên giảng viên"}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Book size={16} className="mr-1" />
                            <span className="font-medium mr-1">Lượt xem:</span>
                            {item.views}
                        </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                        <p className="text-sm sm:text-lg font-bold text-blue-600 mb-1">
                            {formatCurrency(item.price_discount)}
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                            {formatCurrency(item.price)}
                        </p>
                    </div>
                </Link>

            </div>
        ))
    )

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const queryParams = new URLSearchParams(location.search);
                const categorySlug = queryParams.get('category');
                const searchQuery = queryParams.get('search');

                if (searchQuery) {
                    // Nếu có search query, ưu tiên search
                    const results = await fetchSearchResults(searchQuery, null);
                    setCourses(results.length > 0 ? results : []);
                } else if (categorySlug) {
                    // Nếu không có search nhưng có category
                    await fetchCoursesByCategory(categorySlug);
                    setSelectedCategory(categorySlug);
                } else {
                    // Nếu không có cả search và category
                    await fetchCourses();
                }

                await Promise.all([
                    fetchTopPurchasedProduct(),
                    fetchHotInstructor()
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
                setCourses([]);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [location.search]);
    return (

        <section className='courses'>
            <div className="max-w-custom mx-auto px-4 pt-5 ">
                {/* Khóa học nổi bật */}
                <div className="hot-courses shadow-md p-3">
                    <div className="relative mb-6">
                        <Badge className=" w-full relative overflow-hidden text-2xl py-4 px-6 rounded-xl shadow-sm font-bold text-gray-700 bg-gradient-to-r from-orange-50 via-amber-100 to-yellow-100 hover:shadow-md transform transition-all duration-500 hover:scale-105 border border-amber-200 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-100/40 via-amber-100/40 to-yellow-100/40"></div>
                            <div className="relative flex items-center justify-center gap-3">
                                <BookOpen className="w-7 h-7 text-amber-600" />
                                <span>Khóa học nổi bật</span>
                                <Medal className="w-7 h-7 text-amber-600" />
                            </div>
                        </Badge>
                        <p className="text-gray-600 mt-4 mb-6 text-center lg:text-start">
                            Nhiều học viên thích khóa học được đánh giá cao này vì nội dung hấp dẫn của nó.
                        </p>
                    </div>

                    <Carousel>
                        <CarouselContent>
                            {render_course_hot.slice(0, 3).map((course, index) => (
                                <CarouselItem key={index}>
                                    {course}
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-between items-center absolute w-full top-1/2 transform -translate-y-1/2">
                            <CarouselPrevious className="z-10" />
                            <CarouselNext className="z-10" />
                        </div>
                    </Carousel>
                </div>


                {/* Các danh mục bài học*/}
                <div className="hotcategories p-3 my-5 border rounded-lg">
                    <h1 className="text-2xl font-bold py-5 text-center lg:text-start">Các danh mục bài học</h1>
                    {/* Hàng 1 */}
                    <div className="flex w-full gap-3 justify-center my-3">
                        {categories.slice(0, 5).map((category) => (
                            <button
                                key={category.slug}
                                onClick={() => handleCategoryClick(category.slug)}
                                className={`lg:w-52 md:w-40 w-28 py-4 rounded-lg duration-300 sm:text-base text-sm ${selectedCategory === category.slug
                                    ? 'bg-yellow-400 text-black font-bold'
                                    : 'bg-gray-100 hover:bg-white hover:border-yellow-400 border'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    {/* Hàng 2 */}
                    <div className="flex w-full gap-3 justify-center my-3">
                        {categories.slice(5, 9).map((category) => (
                            <button
                                key={category.slug}
                                onClick={() => handleCategoryClick(category.slug)}
                                className={`lg:w-52 md:w-40 w-28 py-4 rounded-lg duration-300 sm:text-base text-sm ${selectedCategory === category.slug
                                    ? 'bg-yellow-400 text-white'
                                    : 'bg-gray-100 hover:bg-white hover:border-yellow-400 border'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Giảng viên */}
                <div className="">
                    <h1 className="text-2xl font-bold pt-10 text-center lg:text-start">
                        Giảng viên nổi tiếng
                    </h1>
                    <p className="text-gray-500 py-2 text-center lg:text-start">
                        Các chuyên gia trong ngành này được đánh giá cao bởi những
                        học viên như bạn.
                    </p>

                    <div className="sm:grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2">
                        {renderHotInstructor}
                    </div>

                </div>


                {/* Tất cả các khóa học Phát triển web */}
                <div className="mb-10">
                    {/* header */}
                    <div className="my-3 pt-8">
                        <h1 className="text-2xl font-bold text-center lg:text-start">
                            Tất cả các khóa học Phát triển web
                        </h1>
                        <p className="text-gray-500 mt-2">
                            <i className="bx bx-error-alt" />
                            <p className='text-center lg:text-start'>
                                Bạn không biết ? Tất cả các khóa học đều được đảm bảo về chất lượng kiểm duyệt.
                            </p>
                        </p>
                    </div>
                    {/* filter */}
                    <div className="flex justify-center lg:justify-between items-center my-3 border-b pb-3">
                        <div className="flex items-center">
                            <div className="lg:hidden block">

                                {/* bộ lộc reponsive */}
                                <Sheet>
                                    <SheetTrigger>
                                        <button
                                            className="flex items-center bg-white text-gray-800 border-2 px-4 py-2 rounded mr-3"
                                            id="openButton">
                                            <i className="bx bx-slider " /> Bộ lọc
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent className="w-72">
                                        <SheetHeader>
                                            <SheetTitle className="text-xl">Bộ lọc</SheetTitle>
                                            <SheetDescription>
                                                {/* mua,xem nhiều */}
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-1">
                                                        <AccordionTrigger className="text-xl font-bold">Sắp xếp theo</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="new"
                                                                    checked={sortCriteria === 'New'}
                                                                    onCheckedChange={(checked) => handleSortChange(checked, 'New')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Mới nhất
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="Buy"
                                                                    checked={sortCriteria === 'Buy'}
                                                                    onCheckedChange={(checked) => handleSortChange(checked, 'Buy')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Mua nhiều
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                                {/* xếp hạng */}
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-2">
                                                        <AccordionTrigger className="text-xl font-bold">Xếp hạng</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="rating5"
                                                                    checked={ratingFilter === '5.00'}
                                                                    onCheckedChange={(checked) => handleRatingFilter(checked, '5.00')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Từ 5.0
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="rating4.00"
                                                                    checked={ratingFilter === '4.00'}
                                                                    onCheckedChange={(checked) => handleRatingFilter(checked, '4.00')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Từ 4.0 trở lên
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="rating3.0"
                                                                    checked={ratingFilter === '3.0'}
                                                                    onCheckedChange={(checked) => handleRatingFilter(checked, '3.0')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Từ 3.0 trở lên
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                                <hr />
                                                {/* giá */}
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-3">
                                                        <AccordionTrigger className="text-xl font-bold">Giá</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="priceAsc"
                                                                    checked={sortCriteria === 'priceAsc'}
                                                                    onCheckedChange={(checked) => handlePriceSort(checked, 'priceAsc')}

                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Tăng dần
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="priceDesc"
                                                                    checked={sortCriteria === 'priceDesc'}
                                                                    onCheckedChange={(checked) => handlePriceSort(checked, 'priceDesc')}

                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        {" "}
                                                                        Giảm dần
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                                <hr />
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-4">
                                                        <AccordionTrigger className="text-xl font-bold">Hình thức học</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="online"
                                                                    checked={onlineFilter === '1'}
                                                                    onCheckedChange={(checked) => handleOnlineFilter(checked, '1')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        Online
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="flex gap-2 items-center my-1">
                                                                <Checkbox
                                                                    id="offline"
                                                                    checked={onlineFilter === '0'}
                                                                    onCheckedChange={(checked) => handleOnlineFilter(checked, '0')}
                                                                />
                                                                <Label>
                                                                    <span className="text-sm lg:text-base font-normal text-gray-800">
                                                                        Offline
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        <div className="lg:block hidden">
                            <div className="ml-auto">
                                <p className=" text-gray-500  font-bold">
                                    {sortedCourses.length} kết quả
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:grid lg:grid-cols-12 gap-10 pt-3">
                        {/* Bộ lọc desktop */}
                        <div className="lg:block hidden col-span-3 transition-all ease-in-out duration-500 " id="filterContent">

                            {/* mua,xem nhiều */}
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Sắp xếp theo</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="new"
                                                checked={sortCriteria === 'New'}
                                                onCheckedChange={(checked) => handleSortChange(checked, 'New')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Mới nhất
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="Buy"
                                                checked={sortCriteria === 'Buy'}
                                                onCheckedChange={(checked) => handleSortChange(checked, 'Buy')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Mua nhiều
                                                </span>
                                            </Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* xếp hạng */}
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-xl font-bold">Xếp hạng</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="rating5"
                                                checked={ratingFilter === '5.00'}
                                                onCheckedChange={(checked) => handleRatingFilter(checked, '5.00')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Từ 5.0
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="rating4.00"
                                                checked={ratingFilter === '4.00'}
                                                onCheckedChange={(checked) => handleRatingFilter(checked, '4.00')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Từ 4.0 trở lên
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="rating3.0"
                                                checked={ratingFilter === '3.0'}
                                                onCheckedChange={(checked) => handleRatingFilter(checked, '3.0')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Từ 3.0 trở lên
                                                </span>
                                            </Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* giá */}
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-xl font-bold">Giá</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="priceAsc"
                                                checked={sortCriteria === 'priceAsc'}
                                                onCheckedChange={(checked) => handlePriceSort(checked, 'priceAsc')}

                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Tăng dần
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="priceDesc"
                                                checked={sortCriteria === 'priceDesc'}
                                                onCheckedChange={(checked) => handlePriceSort(checked, 'priceDesc')}

                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Giảm dần
                                                </span>
                                            </Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-xl font-bold">Hình thức học</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="online"
                                                checked={onlineFilter === '1'}
                                                onCheckedChange={(checked) => handleOnlineFilter(checked, '1')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    Online
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox
                                                id="offline"
                                                checked={onlineFilter === '0'}
                                                onCheckedChange={(checked) => handleOnlineFilter(checked, '0')}
                                            />
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    Offline
                                                </span>
                                            </Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <div className="bg-gray-300 py-2 px-4 rounded-full font-semibold mt-5 w-28">
                                <button onClick={clearFilters} className='flex items-center'>
                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/remove.svg" className='w-7' alt="" />
                                    <p>Bỏ lọc</p></button>
                            </div>
                        </div>

                        {/*Danh sách khóa học nơi hiển thị sản phẩm đã được search */}
                        <div className="col-span-9 transition-all ease-in-out duration-500 mb-5" id="courseCol">
                            {loading ? (
                                <div className="flex flex-col items-center  mt-5">
                                    <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                        </path>
                                        <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                    </svg>
                                    <p className="text-gray-500 font-semibold text-lg mt-5">
                                        <p>Đang tải khóa học...</p>
                                    </p>
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="courses-list  shadow">
                                    {render}
                                    {/* Chuyển trang */}
                                    <Pagination>
                                        <PaginationContent>
                                            {renderPageNumbers()}
                                        </PaginationContent>
                                    </Pagination>
                                </div>

                            ) : (
                                <div className="py-5 text-center">
                                    <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                        </path>
                                        <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                    </svg>
                                    <p className="text-gray-600 font-semibold text-lg mt-4">
                                        {searchQuery
                                            ? `Không tìm thấy khóa học nào cho "${searchQuery}"`
                                            : "Không có khóa học nào"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
};

