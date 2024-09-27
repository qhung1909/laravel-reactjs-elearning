function Footer() {
    return (
        <>
            <footer className="bg-gray-200 h-auto lg:rounded-tl-[100px] lg:rounded-tr-[100px] md:rounded-tl-[50px] md:rounded-tr-[50px] py-5 lg:px-8 xl:px-0">
                <section className="xl:max-w-screen-2xl lg:max-w-screen-lg mx-auto pt-[50px] lg:px-10 md:px-3 ">
                    <div className="grid lg:grid-cols-4  md:grid-cols-5 md:gap-5">

                        {/* start */}
                        <div className="footer-start md:col-span-5">
                            <img
                                src="./src/assets/images/antlearn.png"
                                alt=""
                                className="w-52  md:w-60 ml-[-50px] mt-[-30px]"
                            />
                        </div>

                        {/* mid-left */}
                        <div className="footer-mid-left">
                            <ul className="">
                                <span className="font-semibold text-lg text-[#344054] lg:text-[px] xl:text-[20px]">
                                    Sản phẩm
                                </span>

                                <li className="font-medium text-base leading-10 xl:text-[16px] lg:text-[14px]">Khóa học</li>
                                <li className="font-medium text-base leading-10 xl:text-[16px] lg:text-[14px]">Bài viết</li>
                                <li className="font-medium text-base leading-10 xl:text-[16px] lg:text-[14px]">Liên hệ</li>
                            </ul>
                        </div>

                        {/* mid-right */}
                        <div className="footer-mid-right ">
                            <ul className="">
                                <span className="font-semibold text-[#344054] text-lg lg:text-[16px] xl:text-[20px]">
                                    Chính sách chung &amp; Hỗ trợ
                                </span>
                                <li className="font-medium text-base leading-10 xl:text-[16px] lg:text-[14px]">
                                    Điều khoản dịch vụ
                                </li>
                                <li className="font-medium text-base leading-10 xl:text-[16px] lg:text-[14px]">
                                    Bài viết
                                </li>
                                <li className="font-medium text-base leading-10 xl:text-[16px] lg:text-[14px]">
                                    Chính sách bảo mật thông tin
                                </li>
                            </ul>
                        </div>

                        {/* end */}
                        <div className="footer-end">
                            <div className="footer-end-head">
                                <p className="text-[#344054] font-semibold mb-5 lg:text-[16px] xl:text-[20px]">
                                    Nhận cập nhật mới nhất
                                </p>
                            </div>
                            <div className="footer-end-mid flex">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="px-2 py-2 lg:w-[150px] rounded-xl lg:text-[14px]"
                                />
                                <button className="bg-yellow-400 rounded-xl py-2 px-2 ms-3 font-semibold lg:text-[10px] xl:text-[12px]">
                                    Đăng ký
                                </button>
                            </div>
                            <div className="hotline mt-5 font-semibold xl:text-[16px] lg:text-[14px]">
                                <p>Đường dây nóng: 0123 456 789</p>
                            </div>
                        </div>

                    </div>
                </section>
            </footer>

        </>
    )
}

export default Footer
