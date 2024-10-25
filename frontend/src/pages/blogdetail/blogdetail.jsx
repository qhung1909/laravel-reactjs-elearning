import './blogdetail.css'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'


export const Blogdetail = () => {
    const API_KEY = import.meta.env.VITE_API_KEY
    const API_URL = import.meta.env.VITE_API_URL
    const { slug } = useParams();
    const [blog, setBlog] = useState(null)
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const fetchBlogDetail = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/blogs/${slug}`, {
                headers: {
                    'x-api-secret': API_KEY
                }
            })
            if (response.data.status) {
                setBlog(response.data.data.blog) // Thay vì response.data.data
            }
        } catch (error) {
            console.error('Error fetching blog detail:', error)
            setError('Không thể tải thông tin bài viết')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (slug) {
            fetchBlogDetail()
        }
    }, [slug])
    if (loading) {
        return <div className="text-center py-10">Đang tải...</div>
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>
    }

    if (!blog) {
        return <div className="text-center py-10">Không tìm thấy bài viết</div>
    }
    return (
        <>
           <section className="blogdetail xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm mx-auto sm:px-10 px-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/blog">
                                <BreadcrumbLink>Bài viết</BreadcrumbLink>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{blog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid sm:grid-cols-3 grid-cols-1 gap-10">
                    <div className="blog-left col-span-2 border-b-2 sm:border-b-0">
                        <div className="blogdetail-heading my-5">
                            {/* title */}
                            <div className="blogdetail-title ">
                                <span className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">
                                    {blog.title}

                                </span>
                            </div>
                            {/* date - author - mini img */}
                            <div className="blogdetail-date flex items-center gap-2 md:my-5 my-3">
                                <div className="rounded-full">
                                    <img
                                        src="/src/assets/images/blog-miniimg.webp"
                                        className="rounded-full xl:w-12 xl:h-11 lg:w-11 lg:h-10 md:w-10 md:h-9 sm:w-9 sm:h-8 w-30 h-7 object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="">
                                    <strong className='xl:text-base lg:text-sm md:text-xs sm:text-[14px] text-[12px]'>Antlearn</strong>
                                    <p className='xl:text-base lg:text-sm md:text-xs sm:text-[10px] text-[8px]'>
                                        {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            {/* main img */}
                            <div className="blogdetail-img">
                                <img
                                    src={blog.image}
                                    className="rounded-3xl xl:h-[480px] lg:h-[430px] md:h-[380px] sm:h-[330px] h-[280px] w-full object-cover"
                                />
                            </div>
                            {/* content */}
                            <div className="blog-content mt-8"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    </div>
                    <div className="blog-right my-5">
                        <div className="blog-right-title">
                            <span className="xl:text-2xl lg:text-xl md:text-base sm:text-sm text-xl font-semibold">
                                Bài viết khác
                            </span>
                        </div>
                        <div className="border-right-list">
                            {relatedBlogs.map((relatedBlog) => (
                                <div key={relatedBlog.blog_id} className="border-b-2 py-5">
                                    <div className="md:flex gap-3 items-start">
                                        <div className="blog-img">
                                            <Link to={`/blogdetail/${relatedBlog.slug}`}>
                                                <img
                                                    src={relatedBlog.image || "/src/assets/images/blog-2.png"}
                                                    className="rounded-xl xl:w-[350px] lg:w-[400px] md:w-[450px] w-full xl:h-20 lg:h-20 md:h-16 object-cover"
                                                    alt={relatedBlog.title}
                                                />
                                            </Link>
                                        </div>
                                        <div className="blog-content md:mt-0 mt-3">
                                            <div className="blog-title">
                                                <Link to={`/blogdetail/${relatedBlog.slug}`}>
                                                    <p className="xl:text-xl lg:text-lg md:text-base sm:text-xs text-[16px] font-bold line-clamp-2">
                                                        {relatedBlog.title}
                                                    </p>
                                                </Link>
                                            </div>
                                            <div className="xl:text-base lg:text-sm md:text-xs sm:text-[12px] text-[15px] blog-date mt-1">
                                                <p>{new Date(relatedBlog.created_at).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

