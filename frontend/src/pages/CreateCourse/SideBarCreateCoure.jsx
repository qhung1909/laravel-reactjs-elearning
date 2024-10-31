import { Checkbox } from "@radix-ui/react-checkbox";
import { Link } from "react-router-dom";
import { Footer } from "../footer/footer";

export const SideBarCreateCoure = () => {
    return (
        <>
            <div className="w-3/12 mr-4 hidden lg:block">
                <div className="mx-3 my-5">
                    <div className="px-5">
                        <h2 className="font-medium">Tạo nội dung của bạn</h2>
                        <div className="flex items-center space-x-2 my-4 ">
                            <Checkbox
                                // checked={allInputsCourseFilled()} // Đảm bảo gọi đúng hàm
                                readOnly
                            />
                            <label
                                className='cursor-pointer'
                                onClick={() => {
                                    // setActiveSection("courseOverview");
                                }}
                            >
                                <Link to='/course/manage/course-overview'>
                                    Trang tổng quan khóa học
                                </Link>
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 mb-8 ">
                            <Checkbox
                                // checked={allInputsFilled()}
                                readOnly
                            />
                            <label
                                className='ursor-pointer'
                            // onClick={() => setActiveSection("curriculum")}
                            >
                                <Link to='/course/manage/curriculum'>
                                    Chương trình giảng dạy
                                </Link>

                            </label>
                        </div>


                        <h2 className="font-medium">Xuất bản khóa học của bạn</h2>
                        <div className="flex items-center space-x-2 my-4">
                            <Checkbox
                                // checked={allInputsValuationFilled()}
                                readOnly
                            />
                            <label
                                // onClick={() => setActiveSection("valuation")}
                                className="cursor-pointer"
                            >
                                <Link to='/course/manage/valuation'>
                                    Định giá
                                </Link>
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 my-4">
                            <Checkbox
                                id="terms"
                                // checked={isChecked}
                                readOnly
                            />
                            <label
                                onClick={() => {
                                    // setIsChecked(true); // Tự động tick vào checkbox
                                    // setActiveSection("promotion"); // Chuyển đến phần khuyến mại
                                }}
                                className="cursor-pointer"
                            >
                                <Link to='/course/manage/promotion'>
                                    Khuyến mại
                                </Link>
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 mb-8">
                            <Checkbox
                                // checked={allInputsCourseMessageFilled()}
                                readOnly
                            />
                            <label
                                // onClick={() => setActiveSection("courseMessage")}
                                className="cursor-pointer"
                            >
                                <Link to='/course/manage/course-message'>
                                    Tin nhắn khóa học
                                </Link>
                            </label>
                        </div>
                    </div>
                    <button
                        className="bg-yellow-400 w-full px-3 py-3"
                    // onClick={handleSubmit}
                    >
                        <h2 className="text-white font-bold">
                            Gửi đi để xem xét
                        </h2>
                    </button>

                </div>
            </div>


        </>
    )
}
