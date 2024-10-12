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
import {Link} from 'react-router-dom'
export const Blog = () => {
    return (
        <>
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

                <section className="blog-content xl:max-w-screen-xl lg:max-w-screen-lg lg:px-5 md:px-5 sm:px-3 px-3 md:max-w-screen-md max-w-screen-sm  mx-auto">
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

                    {/* blog - list */}
                    <div className="blog-list xl:max-w-screen-xl mx-auto xl:my-20 md:my-5 my-5">
                        <div className="grid grid-cols-3 gap-5">

                            {/* blog - list - content */}
                            <div className="blog-list-content mb-5">
                                <div className="blog-img">
                                    <Link to="/blogdetail">
                                    <img
                                        src="./src/assets/images/blog-1.png"
                                        className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px] object-cover w-full"
                                        alt=""
                                    />
                                    </Link>

                                </div>
                                <div className="blog-title">
                                    <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                        Hướng dẫn cài đặt lại mật khẩu trên Antlearn
                                    </p>
                                </div>
                            </div>
                            <div className="blog-list-content mb-5">
                                <div className="blog-img">
                                    <Link to="/blogdetail">
                                        <img
                                            src="./src/assets/images/blog-2.png"
                                            className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px] object-cover w-full"
                                            alt=""
                                        />
                                    </Link>

                                </div>
                                <div className="blog-title">
                                    <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                        Hướng dẫn tách ngày tháng năm trong Excel nhanh chóng
                                    </p>
                                </div>
                            </div>
                            <div className="blog-list-content mb-5">
                                <div className="blog-img">
                                    <img
                                        src="./src/assets/images/blog-3.jpg"
                                        className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px]  object-cover w-full"
                                        alt=""
                                    />
                                </div>
                                <div className="blog-title">
                                    <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                        Các ký hiệu điện trong bản vẽ autocad bạn cần biết{" "}
                                    </p>
                                </div>
                            </div>
                            <div className="blog-list-content mb-5">
                                <div className="blog-img">
                                    <Link to="/blogdetail">
                                    <img
                                        src="./src/assets/images/blog-1.png"
                                        className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px] object-cover w-full"
                                        alt=""
                                    />
                                    </Link>

                                </div>
                                <div className="blog-title">
                                    <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                        Hướng dẫn cài đặt lại mật khẩu trên Antlearn
                                    </p>
                                </div>
                            </div>
                            <div className="blog-list-content mb-5">
                                <div className="blog-img">
                                    <Link to="/blogdetail">
                                        <img
                                            src="./src/assets/images/blog-2.png"
                                            className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px] object-cover w-full"
                                            alt=""
                                        />
                                    </Link>

                                </div>
                                <div className="blog-title">
                                    <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                        Hướng dẫn tách ngày tháng năm trong Excel nhanh chóng
                                    </p>
                                </div>
                            </div>
                            <div className="blog-list-content mb-5">
                                <div className="blog-img">
                                    <img
                                        src="./src/assets/images/blog-3.jpg"
                                        className="rounded-xl xl:h-[240px] lg:h-[210px] md:h-[180px] sm:h-[150px] h-[120px]  object-cover w-full"
                                        alt=""
                                    />
                                </div>
                                <div className="blog-title">
                                    <p className="xl:text-xl lg:text-base md:text-sm sm:text-xs text-[10px] font-semibold pt-2">
                                        Các ký hiệu điện trong bản vẽ autocad bạn cần biết{" "}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* blog - pagination */}
                    <div className="blog-pagination my-10">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                    </div>


                </section>
            </>

        </>
    )
}

