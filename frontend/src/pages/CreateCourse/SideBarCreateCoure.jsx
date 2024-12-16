import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px'
            }
        })
    }
}


// eslint-disable-next-line react/prop-types
export const SideBarCreateCoure = ({ isUpdated, hasChanges, setIsPublished, isPublished }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const { course_id } = useParams();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        if (location.pathname === path) {
            return; // Không làm gì nếu người dùng đã ở đúng route
        }
        if (hasChanges && !isUpdated) {
            notify("Vui lòng cập nhật trước khi chuyển trang!");
            return; // Ngăn không cho chuyển route nếu có thay đổi
        }
        navigate(path);
    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (hasChanges) {
                event.preventDefault();
                event.returnValue = ""; // Hiển thị cảnh báo trước khi tải lại
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasChanges]);



    useEffect(() => {
        const elements = document.querySelectorAll('.focusable');

        elements.forEach((element) => {
            element.addEventListener('focus', (event) => {
                // Ngừng focus nếu có thay đổi chưa được lưu
                if (hasChanges && !isUpdated) {
                    event.preventDefault(); // Ngừng focus vào phần tử nếu có thay đổi chưa được lưu
                    // Nếu muốn bỏ focus, có thể thêm dòng này:
                    element.blur();
                }
            });
        });

        // Clean up listeners khi component unmount
        return () => {
            elements.forEach((element) => {
                element.removeEventListener('focus', (event) => {
                    if (hasChanges && !isUpdated) {
                        event.preventDefault();
                        element.blur();
                    }
                });
            });
        };
    }, [hasChanges, isUpdated]);


    useEffect(() => {
        const fetchStatusCourse = async () => {
            try {
                const res = await axios.get(`${API_URL}/teacher/courses/${course_id}`, {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (res.data.data.status === 'published') {
                    setIsPublished(true);
                } else
                    if (res.data.data.status === 'revision_requested' || res.data.data.status === 'draft' || res.data.data.status === 'published') {
                        // Cho phép truy cập vào trang hiện tại
                    } else {
                        setTimeout(() => {
                            notify(`Khóa học "${res.data.data.title}" không ở trạng thái nháp. Không có quyền truy cập !`)
                        }, 500)
                        navigate('/instructor/lesson');

                    }




            } catch (error) {
                console.error(error);

            }
        }
        fetchStatusCourse();
    }, [API_KEY, API_URL, course_id, navigate, setIsPublished])

    // Hàm gửi khóa học để xem xét
    const handleSentDone = async () => {
        if (hasChanges && !isUpdated) {
            notify("Vui lòng cập nhật trước khi gửi!");
            return;
        }


        try {
            const response = await axios.get(`${API_URL}/teacher/courses/${course_id}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.data.data.title === 'Chưa có tên khóa học' || response.data.data.price === null || response.data.data.description === null) {
                notify('Phải nhập đầy đủ thông tin trước khi gửi')
                return false;
            }
        } catch {
            notify('Phải nhập đầy đủ thông tin trước khi gửi')
            return false;
        }


        try {
            const responsee = await axios.get(
                `${API_URL}/teacher/content/${course_id}`,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );


            if (!responsee.data?.data?.contents[0].name_content) {
                notify("Phải nhập đầy đủ thông tin trước khi gửi");
                return false;
            }

        } catch {
            notify("Phải nhập đầy đủ thông tin trước khi gửi");
            return false;
        }

        // Hiển thị thông báo xác nhận trước khi gửi
        const result = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn gửi khóa học này để xem xét không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Gửi",
            cancelButtonText: "Hủy",
        });





        if (result.isConfirmed) {
            setLoading(true);

            try {
                const response = await axios.post(`${API_URL}/teacher/update-pending/${course_id}`, null, {
                    headers: {
                        "x-api-secret": API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: "Thành công!",
                        text: "Khóa học đã được gửi đi để xem xét.",
                        icon: "success",
                        confirmButtonText: "Đóng",
                    });
                } else {
                    throw new Error("Có lỗi xảy ra khi gửi khóa học.");
                }
            } catch (error) {
                Swal.fire({
                    title: "Thất bại!",
                    text: error.message || "Không thể gửi khóa học để xem xét.",
                    icon: "error",
                    confirmButtonText: "Đóng",
                });
            } finally {
                navigate('/instructor/lesson');
                setLoading(false);
            }
        }
    };


    const [selectedItem, setSelectedItem] = useState(() => {
        if (location.pathname.includes('course-overview')) return 'overview';
        if (location.pathname.includes('curriculum')) return 'curriculum';
        return '';
    });

    // console.log(isPublished, 'kiem tra trang thai publish');
    // console.log(isUpdated, 'kiem tra trang thai update');

    return (
        <>
            {/* <div className="w-3/12 mr-4 hidden lg:block"> */}
            <div className="mx-3 my-5">
                <div className="px-5">
                    <h2 className="font-medium">Tạo nội dung của bạn</h2>
                    <div
                        className={`flex items-center space-x-2 my-4 ml-2 p-2 rounded-lg cursor-pointer transition-all duration-200
                            ${selectedItem === 'overview'
                                ? 'bg-yellow-100 text-yellow-800 font-medium shadow-sm'
                                : 'hover:bg-gray-100'}`}
                        onClick={() => {
                            setSelectedItem('overview');
                            handleNavigate(`/course/manage/${course_id}/course-overview`);
                        }}
                    >
                        <label className="cursor-pointer w-full">
                            <div>Trang tổng quan khóa học</div>
                        </label>
                    </div>
                    <div
                        className={`flex items-center space-x-2 mt-4 mb-8 ml-2 p-2 rounded-lg cursor-pointer transition-all duration-200
                            ${selectedItem === 'curriculum'
                                ? 'bg-yellow-100 text-yellow-800 font-medium shadow-sm'
                                : 'hover:bg-gray-100'}`}
                        onClick={() => {
                            setSelectedItem('curriculum');
                            handleNavigate(`/course/manage/${course_id}/curriculum`);
                        }}
                    >
                        <label className="cursor-pointer w-full">
                            <div>Chương trình giảng dạy</div>
                        </label>
                    </div>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={handleSentDone}
                        className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                            ${loading || isPublished
                                ? "bg-yellow-500 text-white border border-gray-200 cursor-not-allowed"
                                : "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-300 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl"}`}
                        disabled={loading || isPublished}
                    >
                        {loading ? "Đang gửi..." : "Gửi đi để xem xét"}
                    </button>
                    {isPublished ? (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg w-full">
                            <div className="p-3">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-yellow-700 font-medium truncate">
                                            Khóa học đã được công khai
                                        </p>
                                        <p className="text-sm text-yellow-600 mt-1">
                                            Chỉ có thể xem nội dung
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <Toaster />
            {/* </div> */}
        </>
    );
};
