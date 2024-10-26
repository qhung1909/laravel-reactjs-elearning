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

export const Courses = () => {
    const { courses, setCourses, fetchSearchResults, fetchCoursesByCategory,fetchCourses,fetchTopPurchasedProduct,hotProducts } = useContext(CoursesContext);
    const { categories } = useContext(CategoriesContext);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [coursesPerPage] = useState(4);
    const [loading, setLoading] = useState(false)
    const location = useLocation();
    const [hotInstructor, setHotInstructor] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const navigate = useNavigate();

    // phân trang
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1;
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categorySlug = queryParams.get('category');

        if (categorySlug) {
            fetchCoursesByCategory(categorySlug);
            setSelectedCategory(categorySlug);
        } else {
            fetchCourses();
        }
        fetchTopPurchasedProduct();
    }, [location.search]);


    const handleCategoryClick = (slug) => {
        fetchCoursesByCategory(slug);
        setSelectedCategory(slug);
        navigate(`/courses?category=${slug}`);
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
                        <Skeleton className="h-4 w-5/12 md:w-9/12 " />
                    </div>
                </div>

            ))}
        </>
    ) :
        Array.isArray(hotInstructor) && hotInstructor.length > 0 ? (
            hotInstructor.map((item, index) => (
                <div key={index} className="bg-white border my-3 sm:my-0 border-gray-200 rounded-md p-5 pl-8 pr-2 flex items-center justify-start w-full">
                    <img
                        alt="Example"
                        className="w-16 h-16 object-cover rounded-full mr-4"
                        src={`${item.avatar}`} />
                    <div>
                        <h3 className="xl:text-lg md:text-base sm:text-sm text-lg font-semibold text-gray-800">
                            {item.name}
                        </h3>
                        <p className="text-yellow-500 text-sm">
                            <strong>4,8</strong> ★★★★☆ (297)
                        </p>
                        <p className="text-gray-700 text-sm">
                            <strong>Tổng khóa học đã bán:</strong> {item.max_is_buy}
                        </p>
                    </div>
                </div>
            ))
        ) : (
            <p>Không có giảng viên nào phù hợp ngay lúc này, thử lại</p>
        )


    const paginate = (pageNumber) => {
        navigate(`?page=${pageNumber}`);
    };

    const totalPages = Math.ceil(courses.length / coursesPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <PaginationItem key={i} className={i === currentPage ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(i)} href="#">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            if (currentPage > 1) {
                pageNumbers.push(
                    <PaginationItem key={1} className={currentPage === 1 ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(1)} href="#">
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (currentPage > 3) {
                    pageNumbers.push(<PaginationItem key="left-dots"><PaginationEllipsis /></PaginationItem>);
                }
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(currentPage + 1, totalPages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <PaginationItem key={i} className={i === currentPage ? 'active' : ''}>
                        <PaginationLink onClick={() => paginate(i)} href="#">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push(<PaginationItem key="right-dots"><PaginationEllipsis /></PaginationItem>);
            }

            pageNumbers.push(
                <PaginationItem key={totalPages} className={currentPage === totalPages ? 'active' : ''}>
                    <PaginationLink onClick={() => paginate(totalPages)} href="#">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pageNumbers;
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
                    <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-lg flex flex-col lg:flex-row group lg:my-5 md:my-3 my-0">
                        <img alt="Best-selling course" className="w-full custom-img-height md:h-82 lg:h-60 lg:w-96 object-cover mb-4 lg:mb-0 lg:mr-4 border" src={`${item.img}`} />
                        <div className="bg-white p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 my-1">
                                    {item.title}
                                </h3>
                                <p className="text-gray-700 my-1">
                                    {item.description}
                                </p>
                                <p className="text-gray-500 text-xs my-1">
                                    {item.user?.name || "Không thấy tên giảng viên"}
                                </p>
                                <p className="font-thin text-xs text-green-600 my-1">
                                    Cập nhật ngày {" "}
                                    <span className="text-green-800 font-bold">
                                        {formatDateNoTime(item.updated_at)}
                                    </span>
                                </p>
                                <p className="text-lg text-gray-800 font-semibold">
                                    <span className="bg-yellow-200 text-gray-700 text-sm px-2 py-1">
                                        {item.is_buy} Lượt bán
                                    </span>
                                </p>
                            </div>
                            <p className="text-lg font-bold text-black my-1">
                                {formatCurrency(item.price_discount)}
                            </p>
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
                <Link to={`/detail/${item.slug}`} className="relative bg-white p-4 rounded-lg flex items-center group my-5">
                    <img alt={item.title} className="w-44 h-28 sm:w-64 sm:h-40 md:w-72 md:h-40 sm:object-cover mr-4 " src={`${item.img}`} />
                    <div className="flex-1">
                        <h3 className="text-md md:text-lg font-semibold text-gray-800 line-clamp-2">
                            <a className="hover:underline" href="#">
                                {item.title}
                            </a>
                        </h3>
                        <p className="text-sm text-black pr-5 line-clamp-2">
                            {item.description}
                        </p>
                        <p className="text-xs text-gray-500 my-1 line-clamp-1">
                            <span className='font-semibold text-xs sm:text-base'>Đăng bởi: </span>{item.user?.name || "Không thấy tên giảng viên"}
                        </p>

                        <p className="text-xs text-gray-500 my-1">
                            <span className='font-semibold text-xs sm:text-base'>Lượt xem:</span> {item.views}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <p className="text-sm sm:text-lg font-bold text-black">
                            {formatCurrency(item.price_discount)}
                        </p>
                        <p className="text-sm sm:text-lg text-gray-500 line-through">
                            {formatCurrency(item.price)}
                        </p>
                    </div>
                </Link>
            </div>
        ))
    )

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (searchQuery) {
                    const results = await fetchSearchResults(searchQuery);
                    setCourses(results.length > 0 ? results : []);
                } else {
                    const response = await axios.get(`${API_URL}/courses`);
                    if (response.status === 200 && Array.isArray(response.data)) {
                        setCourses(response.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                fetchCourses();
            }
        }, 300);
        fetchHotInstructor();
        return () => clearTimeout(timeoutId);
    }, [searchQuery, API_URL, setCourses]);

    return (

        <section className='courses'>
            <div className="max-w-custom mx-auto px-4 pt-5 ">
                {/* Khóa học nổi bật */}
                <div className="hot-courses shadow-md  p-3">
                    <h1 className="text-2xl font-medium mb-2 text-center lg:text-start">
                        Khóa học nổi bật
                    </h1>
                    <p className="text-gray-600 lg:mb-4 text-center lg:text-start">
                        Nhiều học viên thích khóa học được đánh giá cao này vì nội
                        dung hấp dẫn của nó.
                    </p>
                    <Carousel>
                        <CarouselContent>
                            <CarouselItem>
                                {render_course_hot[0]} {/* Hiển thị item đầu tiên */}
                            </CarouselItem>
                            <CarouselItem>
                                {render_course_hot[1]} {/* Hiển thị item thứ hai */}
                            </CarouselItem>
                            <CarouselItem>
                                {render_course_hot[2]} {/* Hiển thị item thứ ba */}
                            </CarouselItem>
                        </CarouselContent>
                        {/* Đặt nút điều hướng bên ngoài CarouselContent */}
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
                                className={`p-3 rounded-lg duration-300 ${selectedCategory === category.slug
                                    ? 'bg-yellow-400 text-white'
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
                                className={`p-3 rounded-lg duration-300 ${selectedCategory === category.slug
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
                        <h1 className="text-2xl font-bold">
                            Tất cả các khóa học Phát triển web
                        </h1>
                        <p className="text-gray-500 mt-2">
                            <i className="bx bx-error-alt" /> Bạn không biết
                            chắc? Tất cả các khóa học đều được đảm bảo hoàn tiền
                            trong 30 ngày
                        </p>
                    </div>
                    {/* filter */}
                    <div className="flex justify-between items-center my-3 border-b pb-3">
                        <div className="flex items-center">
                            <div className="lg:hidden block">

                                {/* bộ lộc */}
                                <Sheet>
                                    <SheetTrigger>
                                        <button
                                            className="flex items-center bg-white text-gray-800 border-2 px-4 py-2 rounded mr-3"
                                            id="openButton">
                                            <i className="bx bx-slider" /> Bộ lọc
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle>Bộ lọc</SheetTitle>
                                            <SheetDescription>
                                                <Accordion type="single" collapsible defaultValue="item-1">
                                                    <AccordionItem value="item-1">
                                                        <AccordionTrigger className="text-xl font-bold">Xếp hạng</AccordionTrigger>
                                                        <AccordionContent>
                                                            <input className="mr-2" name="rating" type="radio" />
                                                            <span className="text-yellow-500 ">
                                                                <i className="bx bxs-star " />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star-half" />
                                                            </span>
                                                            <span className="text-sm text-gray-800">
                                                                {" "}
                                                                Từ 4.5 trở lên
                                                                <span className="text-gray-600">
                                                                    {courses.length}
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="rating"
                                                                type="radio" />
                                                            <span className="text-yellow-500 ">
                                                                <i className="bx bxs-star " />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bx-star" />
                                                            </span>
                                                            <span className="text-sm text-gray-800">
                                                                {" "}
                                                                Từ 4.0 trở lên
                                                                <span className="text-gray-600">
                                                                    (10.000)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="rating"
                                                                type="radio" />
                                                            <span className="text-yellow-500">
                                                                <i className="bx bxs-star " />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star-half" />
                                                                <i className="bx bx-star" />
                                                            </span>
                                                            <span className="text-sm text-gray-800">
                                                                {" "}
                                                                Từ 3.5 trở lên
                                                                <span className="text-gray-600">
                                                                    (10.000)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="rating"
                                                                type="radio" />
                                                            <span className="text-yellow-500">
                                                                <i className="bx bxs-star " />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bxs-star" />
                                                                <i className="bx bx-star" />
                                                                <i className="bx bx-star" />
                                                            </span>
                                                            <span className="text-sm text-gray-800">
                                                                {" "}
                                                                Từ 3.0 trở lên
                                                                <span className="text-gray-600">
                                                                    (10.000)
                                                                </span>
                                                            </span>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                                <hr />
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-1">
                                                        <AccordionTrigger className="text-xl font-bold">Chủ đề</AccordionTrigger>
                                                        <AccordionContent>
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                Python{" "}
                                                                <span className="text-gray-600">
                                                                    (2.433)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                JavaScript{" "}
                                                                <span className="text-gray-600">
                                                                    (1.105)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                Java{" "}
                                                                <span className="text-gray-600">
                                                                    (1.088)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                Unity{" "}
                                                                <span className="text-gray-600">
                                                                    (960)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                Phát triển web{" "}
                                                                <span className="text-gray-600">
                                                                    (933)
                                                                </span>
                                                            </span>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                                <hr />
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="item-1">
                                                        <AccordionTrigger className="text-xl font-bold">Giá</AccordionTrigger>
                                                        <AccordionContent>
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                Có trả phí{" "}
                                                                <span className="text-gray-600">
                                                                    (68)
                                                                </span>
                                                            </span>
                                                            <br />
                                                            <input
                                                                className="mr-2"
                                                                name="duration"
                                                                type="checkbox" />
                                                            <span className="text-sm text-black">
                                                                Miễn phí{" "}
                                                                <span className="text-gray-600">
                                                                    (23)
                                                                </span>
                                                            </span>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <div className="">
                                <div className="">
                                    <Select >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sắp xếp theo" className="py-3" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="Hot" className="cursor-pointer">Phổ biến nhất</SelectItem>
                                            <SelectItem value="TopRank" className="cursor-pointer">Thứ hạng cao nhất</SelectItem>
                                            <SelectItem value="New" className="cursor-pointer">Mới nhất</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="lg:block hidden">
                            <div className="ml-auto">
                                <p className=" text-gray-500  font-bold">
                                    {courses.length} kết quả
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:grid lg:grid-cols-12 gap-10 pt-3">
                        {/* Bộ lọc */}
                        <div className="lg:block hidden col-span-3 transition-all ease-in-out duration-500 " id="filterContent">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Xếp hạng</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Từ 4.5 trở lên
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Từ 4.0 trở lên
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Từ 3.5 trở lên
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
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
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Chủ đề</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Python
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Javascript
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Reactjs
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Angular
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Css
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Nextjs
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Html
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    ASP.NET
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    NodeJs
                                                </span>
                                            </Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr />
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl font-bold">Giá</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
                                            <Label>
                                                <span className="text-sm lg:text-base font-normal text-gray-800">
                                                    {" "}
                                                    Tăng dần
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 items-center my-1">
                                            <Checkbox></Checkbox>
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
                        </div>

                        {/*Danh sách khóa học nơi hiển thị sản phẩm đã được search */}
                        <div className="col-span-9 transition-all ease-in-out duration-500 mb-5" id="courseCol">
                            {loading ? (
                                <div className="text-center py-8">
                                    <p>Đang tải...</p>
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

