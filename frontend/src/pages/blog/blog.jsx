import './blog.css'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import axios from "axios";

export const Blog = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const [blogs, setBlogs] = useState([]);
    const [randomBlog, setRandomBlog] = useState([]);
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    })
    const fetchBlogs = async (page = 1) => {
        try {

            setLoading(true)
            const response = await axios.get(`${API_URL}/blogs?page=${page}`, {
                headers: {
                    'x-api-secret': API_KEY
                },

            })

            const { data } = response.data

            if (data && data.data) {
                setBlogs(data.data)
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    total: data.total
                })
            }
        } catch (error) {
            console.error('Error fetching blogs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handlePageChange = (page) => {
        fetchBlogs(page)
    }

    const renderBlogs = () => {
        if (loading) {
            return <p>Đang tải...</p>
        }

        if (!blogs.length) {
            return <p>Không có bài viết nào.</p>
        }

        return (
            <div className="grid grid-cols-3 gap-5">
                {blogs.map((blog) => (
                    <div key={blog.blog_id} className="blog-list-content mb-5">
                        <div className="blog-img">
                            <Link to={`/blogs/${blog.slug}`}>
                                <img
                                    src={blog.image || './src/assets/images/blog-1.png'}
                                    className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px] object-cover w-full"
                                    alt={blog.title}
                                />
                            </Link>
                        </div>
                        <div className="blog-title">
                            <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                {blog.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            {/* banner */}
            <section
                className="blog-banner flex items-center justify-center xl:h-[340px] lg:h-[295px] md:h-[250px] sm:h-[170px] h-[150px] w-full"
                style={{
                    backgroundImage: "url(./src/assets/images/bannerblog.png)",
                    objectFit: "cover"
                }}
            >
                <div className="blog-banner-title">
                    <h1 className="lg:text-5xl md:text-4xl text-3xl font-title">
                        <span className="italic font-title text-yellow-500">Bài viết </span>của
                        chúng tôi
                    </h1>
                </div>
            </section>
            {/* blog content */}


            <section className="blog-content xl:max-w-screen-xl lg:max-w-screen-lg lg:px-5 md:px-5 sm:px-3 px-3 md:max-w-screen-md max-w-screen-sm mx-auto">
                {/* blog - main */}

                <div className="blog-main  md:my-10 my-10">
                        <div className="grid grid-cols-2 xl:gap-20 lg:gap-10 md:gap-8 sm:gap-7 gap-6">
                            {/* blog - main -left */}

                            <div className="blog-main-left">
                                <span className="xl:text-3xl lg:text-2xl md:text-xl sm:text-base text-[15px] leading-none font-bold">
                                    Hướng dẫn cách lấy nhạc tiktok làm nhạc chuông trong 3 giây
                                </span>
                                <p className="xl:my-5 md:my-3 sm:my-2 my-1 xl:text-base lg:text-sm md:text-xs sm:text-[7px] text-[11px]">
                                    Nếu bạn chưa biết cách sử dụng nhạc tiktok làm nhạc chuông, đọc ngay
                                    bài viết này của Edumall để thực hiện nhé!
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full">
                                        <img
                                            src="./src/assets/images/blog-miniimg.webp"
                                            className="rounded-full xl:w-12 xl:h-11 lg:w-10 lg:h-11 md:w-7 md:h-7 sm:w-6 sm:h8 w-6 h-7 object-cover"
                                            alt=""
                                        />
                                    </div>
                                    <div className="mb-2 md:mb-2 lg:mb-0">
                                        <strong className='xl:text-xl lg:text-sm md:text-[12px] sm:text-[9px] text-[12px]'>Antlearn</strong>
                                        <p className='xl:test-base lg:text-sm md:text-[8px] sm:text-[6px] text-[10px]'>28 tháng 9 2024</p>
                                    </div>
                                </div>
                            </div>

                            {/* blog - main - right */}
                            <div className="blog-main-right">
                                <img
                                    src="./src/assets/images/blog-imgmain.png"
                                    className="rounded-tl-2xl rounded-tr-2xl h-40 sm:h-full object-cover "
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                <div className="blog-list xl:max-w-screen-xl mx-auto xl:my-20 md:my-5 my-5">
                    {renderBlogs()}
                </div>

                <div className="blog-pagination my-10">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>

                            {pagination.lastPage <= 3 ? (
                                [...Array(pagination.lastPage)].map((_, index) => (
                                    <PaginationItem key={index + 1} className="cursor-pointer">
                                        <PaginationLink
                                            onClick={() => handlePageChange(index + 1)}
                                            isActive={pagination.currentPage === index + 1}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))
                            ) : (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => handlePageChange(1)}
                                            isActive={pagination.currentPage === 1}
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>

                                    {pagination.currentPage > 2 && <PaginationEllipsis />}

                                    {pagination.currentPage !== 1 && pagination.currentPage !== pagination.lastPage && (
                                        <PaginationItem>
                                            <PaginationLink
                                                onClick={() => handlePageChange(pagination.currentPage)}
                                                isActive
                                            >
                                                {pagination.currentPage}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {pagination.currentPage < pagination.lastPage - 1 && <PaginationEllipsis />}

                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => handlePageChange(pagination.lastPage)}
                                            isActive={pagination.currentPage === pagination.lastPage}
                                        >
                                            {pagination.lastPage}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.lastPage}
                                    className="cursor-pointer"

                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </section>
        </>

    )
}

