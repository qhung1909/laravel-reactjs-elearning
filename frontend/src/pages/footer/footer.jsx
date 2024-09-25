function Footer() {
    return (
        <>
            <footer className="bg-gray-200 h-auto rounded-tl-[100px] rounded-tr-[100px] py-5">
                <section className="max-w-screen-xl mx-auto pt-[50px]">
                    <div className="grid xl:grid-cols-4">
                        <div className="footer-start">
                            <img
                                src="images/Antlearn-logo.png"
                                alt=""
                                className="w-52 ml-[-50px] mt-[-30px]"
                            />
                        </div>
                        <div className="footer-mid-left">
                            <ul>
                                <span className="font-semibold text-lg  text-[#344054]">
                                    Sản phẩm
                                </span>
                                <li className="font-medium text-base leading-10">Khóa học</li>
                                <li className="font-medium text-base leading-10">Bài viết</li>
                                <li className="font-medium text-base leading-10">Liên hệ</li>
                            </ul>
                        </div>
                        <div className="footer-mid-right ">
                            <ul className="">
                                <span className="font-semibold text-[#344054] text-lg">
                                    Chính sách chung &amp; Hỗ trợ
                                </span>
                                <li className="font-medium text-base leading-10">
                                    Điều khoản dịch vụ
                                </li>
                                <li className="font-medium text-base leading-10">Bài viết</li>
                                <li className="font-medium text-base leading-10">
                                    Chính sách bảo mật thông tin
                                </li>
                            </ul>
                        </div>
                        <div className="footer-end">
                            <div className="footer-end-head">
                                <p className="text-[#344054] font-semibold mb-5">
                                    Nhận cập nhật mới nhất
                                </p>
                            </div>
                            <div className="footer-end-mid flex">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className=" px-2 w-[220px] py-0  rounded-xl"
                                />
                                <button className="bg-yellow-400 rounded-xl py-2 px-3 ms-3 font-semibold">
                                    Đăng ký
                                </button>
                            </div>
                            <div className="hotline mt-5 font-semibold">
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
