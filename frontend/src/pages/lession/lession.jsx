// import './detail.css'
// import './style.css'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
export const Lession = () => {
    function toggleDropdown(event) {
        const element = event.currentTarget;
        const submenu = element.nextElementSibling;
        const icon = element.querySelector("box-icon");

        if (submenu.style.maxHeight) {
            submenu.style.maxHeight = null;
            icon.setAttribute("name", "chevron-down");
        } else {
            submenu.style.maxHeight = submenu.scrollHeight + "px";
            icon.setAttribute("name", "chevron-up");
        }
    }

    function toggleMenu() {
        const menu = document.getElementById("menuContent");
        menu.classList.toggle("show");
    }

    return (
        <>
            <body className="bg-gray-100">
                <div className="bg-gray-800 flex items-center justify-between py-1 px-6 fixed z-20 right-0 left-0">
                    <button
                        className="text-white lg:hidden"
                        onClick={toggleMenu}
                    >
                        <box-icon color="white" name="menu" />
                    </button>
                    <button className="text-white">
                        <box-icon color="white" name="chevron-left" />
                    </button>
                    <div className="text-white font-bold flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center text-white mr-4">
                            <img
                                alt=""
                                className="w-full h-full object-contain"
                                src="./images/Antlearn-logo-footer.png"
                            />
                        </div>
                        <h1 className="text-xl">Kiến Thức Nhập Môn IT</h1>
                    </div>
                    <div className="ml-auto flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <span className="border-2 border-gray-700 text-gray-300 text-sm md:text-base w-10 h-10 flex items-center justify-center rounded-full">
                                <span className="text-gray-300">0%</span>
                            </span>
                            <span className="text-gray-400 text-sm md:text-base">
                                0/12 bài học
                            </span>
                        </div>
                        <button className="p-2 rounded text-white">
                            <box-icon color="white" name="chat" />
                        </button>
                        <button className="p-2 rounded text-white">
                            <box-icon
                                color="white"
                                name="message-square-dots"
                            />
                        </button>
                    </div>
                </div>
                <div className="content-main py-14">
                    <div className="flex flex-1 h-screen flex-col md:flex-row">
                        <div className="flex-1 bg-white-900 flex flex-col">
                            <div className="relative w-full h-[400px] md:h-[500px]">
                                <iframe
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full"
                                    frameBorder="0"
                                    src="https://www.youtube.com/embed/db3IA7Dq8vY?si=LuMXo8BHQbdbpL8v"
                                />
                            </div>
                            <div className="p-6 text-black">
                                <h2 className="text-2xl font-bold mb-2">
                                    Mô hình Client - Server là gì?
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Cập nhật tháng 11 năm 2022
                                </p>
                                <p className="mt-4">
                                    Tham gia các cộng đồng để cùng học hỏi, chia
                                    sẻ và thám thính xem F8 sắp có gì mới nhé!
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <a
                                            className="text-orange-400 hover:underline"
                                            href="https://www.facebook.com/f8vnofficial"
                                        >
                                            Fanpage:
                                            https://www.facebook.com/f8vnofficial
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="text-orange-400 hover:underline"
                                            href="https://www.facebook.com/groups/649972919142215"
                                        >
                                            Group:
                                            https://www.facebook.com/groups/649972919142215
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="text-orange-400 hover:underline"
                                            href="https://www.youtube.com/F8VNOfficial"
                                        >
                                            Youtube:
                                            https://www.youtube.com/F8VNOfficial
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="text-orange-400 hover:underline"
                                            href="https://www.facebook.com/sondnf8"
                                        >
                                            Sơn Đặng:
                                            https://www.facebook.com/sondnf8
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-full md:w-[350px] bg-white overflow-y-auto hidden lg:block">
                            <div className="p-4 mb-10">
                                <h3 className="font-semibold mb-2">
                                    Nội dung khóa học
                                </h3>
                                <div className="pt-1 " />
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>
                                            Is it styled?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It comes with default styles
                                            that matches the other
                                            components&apos; aesthetic.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>
                                            Is it animated?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. Its animated by default, but
                                            you can disable it if you prefer.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu-content" id="menuContent">
                    <button className="p-4 " onClick={toggleMenu}>
                        Close Menu
                    </button>
                    <ul className="accordion-menu max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                        <li className="link border-b bg-gray-100">
                            <div
                                className="dropdown cursor-pointer block px-4 py-3 text-lg relative transition-all duration-400 ease-out hover:bg-gradient-to-b bg-gray-200 to-[#273a47]"
                                onClick={toggleDropdown}
                            >
                                <i className="fa-brands fa-python absolute left-4 top-4" />
                                <h4 className="font-medium">
                                    1. Khái niệm kỹ thuật cần biết
                                </h4>
                                <p className="text-sm text-gray-500">
                                    0/3 | 23:09
                                </p>
                                <box-icon
                                    class="icon fa fa-chevron-down absolute right-4 top-4 transition-transform duration-200 ease-in-out"
                                    name="chevron-down"
                                />
                            </div>
                            <ul className="submenuItems bg-gray-100 transition-all duration-200 ease-in-out max-h-0 overflow-hidden">
                                <li>
                                    <a
                                        className="block font-semibold px-4 py-3 bg-gray-100"
                                        href="#"
                                    >
                                        <h5>
                                            1. Mô hình Client - Server là gì?
                                        </h5>
                                        <p className="text-sm text-gray-500">
                                            11:11
                                        </p>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="block font-semibold px-4 py-3 bg-gray-100"
                                        href="#"
                                    >
                                        2. Domain là gì? tên miền là gì?
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="link border-b bg-gray-100">
                            <div
                                className="dropdown cursor-pointer block px-4 py-3 text-lg relative transition-all duration-400 ease-out hover:bg-gradient-to-b bg-gray-200 to-[#273a47]"
                                onClick={toggleDropdown}
                            >
                                <i className="fa-brands fa-python absolute left-4 top-4" />
                                <h4 className="font-medium">
                                    2. Môi trường, con người IT?
                                </h4>
                                <p className="text-sm text-gray-500">
                                    0/3 | 23:09
                                </p>
                                <box-icon
                                    class="icon fa fa-chevron-down absolute right-4 top-4 transition-transform duration-200 ease-in-out"
                                    name="chevron-down"
                                />
                            </div>
                            <ul className="submenuItems bg-gray-100 transition-all duration-200 ease-in-out max-h-0 overflow-hidden">
                                <li>
                                    <a
                                        className="block font-semibold px-4 py-3 bg-gray-100"
                                        href="#"
                                    >
                                        1. Mô hình Client - Server là gì?
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="block font-semibold px-4 py-3 bg-gray-100"
                                        href="#"
                                    >
                                        2. Python Level 2
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="border-b bg-gray-100">
                            <div
                                className="cursor-pointer block px-4 py-3 text-lg relative transition-all duration-400 ease-out hover:bg-gradient-to-b bg-gray-200 to-[#273a47]"
                                onClick={toggleDropdown}
                            >
                                <i className="fa-brands fa-python absolute left-4 top-4" />
                                <h4 className="font-medium">
                                    2. Môi trường, con người IT?
                                </h4>
                                <p className="text-sm text-gray-500">
                                    0/3 | 23:09
                                </p>
                                <box-icon
                                    class="absolute right-4 top-4 transition-transform duration-200 ease-in-out"
                                    name="chevron-down"
                                />
                            </div>
                            <ul className="submenuItems transition-all duration-200 ease-in-out max-h-0 overflow-hidden bg-gray-100">
                                <li>
                                    <a
                                        className="block font-semibold px-4 py-3 bg-gray-100"
                                        href="#"
                                    >
                                        1. Mô hình Client - Server là gì?
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="block font-semibold px-4 py-3 bg-gray-100"
                                        href="#"
                                    >
                                        2. Python Level 2
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <footer className="fixed left-0 right-0 bottom-0 z-20 flex items-center justify-center h-12 bg-[#f0f0f0] shadow-md">
                    <button className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 text-sm md:text-base transition-all">
                        <box-icon class="mr-2" name="chevron-left" />
                        <span>BÀI TRƯỚC</span>
                    </button>
                    <button className="flex items-center bg-gradient-to-r from-teal-400 to-teal-500 text-white px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 text-sm md:text-base transition-all ml-4">
                        <span className="mr-2">BÀI TIẾP THEO</span>
                        <box-icon name="chevron-right" />
                    </button>
                </footer>
            </body>
        </>
    );
};
