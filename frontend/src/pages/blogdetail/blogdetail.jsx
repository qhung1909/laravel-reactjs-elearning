import './blogdetail.css'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Link} from 'react-router-dom'
function Blogdetail() {
    return (
        <>
            <section className="blogdetail xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm mx-auto">
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

                <div className="grid grid-cols-3 gap-10">
                    <div className="blog-left col-span-2">
                        <div className="blogdetail-heading my-5">
                            <div className="blogdetail-title ">
                                <span className="text-5xl font-bold">
                                    Hướng dẫn cài lại mật khẩu trên Edumall
                                </span>
                            </div>
                            <div className="blogdetail-date flex items-center gap-2">
                                <div className="rounded-full">
                                    <img
                                        src="./src/assets/images/blog-miniimg.webp"
                                        className="rounded-full w-12 h-11 object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="my-5">
                                    <strong>Antlearn</strong>
                                    <p>28 tháng 9 2024</p>
                                </div>
                            </div>
                            <div className="blogdetail-img">
                                <img
                                    src="./src/assets/images/blog-1.png"
                                    className="rounded-3xl"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="blog-right my-5">
                        <div className="blog-right-title">
                            <span className="text-2xl font-semibold">Bài viết liên quan</span>
                        </div>
                        <div className="border-right-list">
                            <div className="border-b-2 py-5">
                                <div className="flex gap-3">
                                    <div className="blog-img">
                                        <img
                                            src="./src/assets/images/blog-2.png"
                                            className="rounded-xl object-cover"
                                            width={105}
                                            height={65}
                                            alt=""
                                        />
                                    </div>
                                    <div className="blog-content">
                                        <div className="blog-title">
                                            <p className="text-lg font-semibold">Tựa đề</p>
                                        </div>
                                        <div className="blog-date">
                                            <p>28 tháng 9 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b-2 py-5">
                                <div className="flex gap-3">
                                    <div className="blog-img">
                                        <img
                                            src="./src/assets/images/blog-3.jpg"
                                            className="rounded-xl object-cover"
                                            width={105}
                                            height={65}
                                            alt=""
                                        />
                                    </div>
                                    <div className="blog-content">
                                        <div className="blog-title">
                                            <p className="text-lg font-semibold">Tựa đề</p>
                                        </div>
                                        <div className="blog-date">
                                            <p>28 tháng 9 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b-2 py-5">
                                <div className="flex gap-3">
                                    <div className="blog-img">
                                        <img
                                            src="./src/assets/images/blog-4.png"
                                            className="rounded-xl object-cover"
                                            width={105}
                                            height={65}
                                            alt=""
                                        />
                                    </div>
                                    <div className="blog-content">
                                        <div className="blog-title">
                                            <p className="text-lg font-semibold">Tựa đề</p>
                                        </div>
                                        <div className="blog-date">
                                            <p>28 tháng 9 2024</p>
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

export default Blogdetail
