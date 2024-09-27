import { Link } from "react-router-dom";

function Header() {
    return (
        <>
            <header>
                {/* Menu */}
                <nav className="navbar  flex items-center w-[100%] mx-auto py-2 z-10 ps-3 xl:max-w-screen-2xl ms-auto">
                    {/* header - logo */}
                    <div className="navbar-logo mx-2 w-24">
                        <Link to="/">
                            <img
                                src="./src/assets/images/antlearn.png"
                                alt=""
                                className="w-40"
                            />
                        </Link>
                    </div>
                    {/* header - search */}
                    <div className="navbar-search xl:w-[50%] lg:px-20 md:px-12 xl:px-0 w-[100%] px-10">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="border rounded-full p-2 w-full hover:duration-300"
                        />
                    </div>
                    {/* header - content */}
                    <div
                        id="navbar-content"
                        className="navbar-content xl:static xl:min-h-fit absolute bg-white min-h-[40vh] left-0 top-[-200%] flex xl:items-center xl:flex-row flex-col px-10 max-xl:w-full gap-2 max-xl:py-5 max-xl:gap-6"
                    >
                        {/* header - ul */}
                        <ul className="items-center max-xl:pt-3 gap-3 xl:flex max-xl:flex-col text-base xl:text-base w-52">
                            <li className="max-xl:mb-4">
                                <Link
                                    to="/courses"
                                    className="hover:text-gray-500"
                                >
                                    Khóa học
                                </Link>
                            </li>
                            <li className="max-xl:mb-4">
                                <Link
                                    to="/contact"
                                    className="hover:text-gray-500"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/posts"
                                    className="hover:text-gray-500"
                                >
                                    Bài viết
                                </Link>
                            </li>
                        </ul>
                        {/* header - icons */}
                        <div className="navbar-icons flex items-center gap-2 xl:mx-3">
                            <div className="navbar-noti cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    style={{ fill: "rgba(0, 0, 0, 1)" }}
                                >
                                    <path d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a.996.996 0 0 0-.293-.707L19 14.586z"></path>
                                </svg>
                            </div>
                            <div className="navbar-language cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#000000"
                                >
                                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
                                </svg>
                            </div>
                        </div>
                        {/* header - login  */}
                        <div className="xl:flex max-xl:flex-col gap-2 items-center">
                            <div className="navbar-register  max-xl:mb-2">
                                <Link to="/register">
                                    <button className="w-32 me-3 border rounded-lg font-semibold border-black p-1 hover:border-1 hover:border-white hover:bg-yellow-300 hover:text-white duration-300">
                                        Đăng ký
                                    </button>
                                </Link>
                            </div>
                            <div className="navbar-login">
                                <Link to="/login">
                                    <button className="w-32 border rounded-lg font-semibold p-1 bg-yellow-300 hover:border-1 hover:border-black hover:bg-black hover:text-white duration-300">
                                        Đăng nhập
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div
                        id="toggle-btn"
                        className="button-toggle w-[92px] xl:w-auto hidden max-xl:block"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={40}
                            height={40}
                            viewBox="0 0 24 24"
                            style={{ fill: "rgba(0, 0, 0, 1)" }}
                        >
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                        </svg>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
