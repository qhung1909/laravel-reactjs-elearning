import './blogdetail.css'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from 'react-router-dom'
export const Blogdetail = () => {
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
                            <BreadcrumbPage>Bài viết chi tiết</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid sm:grid-cols-3 grid-cols-1 gap-10">
                    <div className="blog-left col-span-2 border-b-2 sm:border-b-0">
                        <div className="blogdetail-heading my-5">
                            {/* title */}
                            <div className="blogdetail-title ">
                                <span className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold">
                                    Hướng dẫn cài lại mật khẩu trên Edumall
                                </span>
                            </div>
                            {/* date - author - mini img */}
                            <div className="blogdetail-date flex items-center gap-2 md:my-5 my-3">
                                <div className="rounded-full">
                                    <img
                                        src="./src/assets/images/blog-miniimg.webp"
                                        className="rounded-full xl:w-12 xl:h-11 lg:w-11 lg:h-10 md:w-10 md:h-9 sm:w-9 sm:h-8 w-30 h-7 object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="">
                                    <strong className='xl:text-base lg:text-sm md:text-xs sm:text-[14px] text-[12px]'>Antlearn</strong>
                                    <p className='xl:text-base lg:text-sm md:text-xs sm:text-[10px] text-[8px]'>28 tháng 9 2024</p>
                                </div>
                            </div>
                            {/* main img */}
                            <div className="blogdetail-img">
                                <img
                                    src="./src/assets/images/blog-1.png"
                                    className="rounded-3xl xl:h-[480px] lg:h-[430px] md:h-[380px] sm:h-[330px] h-[280px] w-full object-cover"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="blog-right my-5">
                        <div className="blog-right-title">
                            <span className="xl:text-2xl lg:text-xl md:text-base sm:text-sm text-xl font-semibold">Bài viết khác</span>
                        </div>
                        <div className="border-right-list">
                            <div className="border-b-2 py-5">
                                <div className="md:flex gap-3 items-start">
                                    <div className="blog-img">
                                        <img
                                            src="./src/assets/images/blog-2.png"
                                            className="rounded-xl xl:w-[350px] lg:w-[400px] md:w-[450px] w-full xl:h-20 lg:h-20 md:h-16 object-cover "
                                            alt=""
                                        />
                                    </div>
                                    <div className="blog-content md:mt-0 mt-3">
                                        <div className="blog-title">
                                            <p className="xl:text-xl lg:text-lg md:text-base sm:text-xs text-[16px] font-bold line-clamp-2">Hướng dẫn tách ngày tháng năm trong Excel nhanh chóng</p>
                                        </div>
                                        <div className="xl:text-base lg:text-sm md:text-xs sm:text-[12px] text-[15px] blog-date mt-1">
                                            <p>28 tháng 9 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b-2 py-5">
                                <div className="md:flex gap-3 items-start">
                                    <div className="blog-img">
                                        <img
                                            src="./src/assets/images/blog-3.jpg"
                                            className="rounded-xl xl:w-[350px] lg:w-[400px] md:w-[450px] w-full xl:h-20 lg:h-20 md:h-16 object-cover "
                                            alt=""
                                        />
                                    </div>
                                    <div className="blog-content md:mt-0 mt-3">
                                        <div className="blog-title">
                                            <p className="xl:text-xl lg:text-lg md:text-base sm:text-xs text-[16px] font-bold line-clamp-2">Các ký hiệu điện trong bản vẽ autocad bạn cần biết</p>
                                        </div>
                                        <div className="xl:text-base lg:text-sm md:text-xs sm:text-[12px] text-[15px] blog-date mt-1">
                                            <p>20 tháng 8 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </>
    )
}

