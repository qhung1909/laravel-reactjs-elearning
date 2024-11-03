import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const useLocalStorage = (key) => {
    const [isChecked, setIsChecked] = useState(() => {
        return localStorage.getItem(key) !== null;
    });

    const setChecked = (value) => {
        if (value) {
            localStorage.setItem(key, "1");
        } else {
            localStorage.removeItem(key);
        }
        setIsChecked(value);
    };

    useEffect(() => {
        const checkStorage = () => {
            const exists = localStorage.getItem(key) !== null;
            if (isChecked !== exists) {
                setIsChecked(exists);
            }
        };

        const interval = setInterval(checkStorage, 100);
        return () => clearInterval(interval);
    }, [key, isChecked]);

    return [isChecked, setChecked];
};

export const SideBarCreateCoure = () => {
    const [isCheckedCO, setCheckedCO] = useLocalStorage('FA-CO');
    const [isCheckedCU, setCheckedCU] = useLocalStorage('FA-CU');

    const handleBeforeUnload = (event) => {
        const message = "Bạn có chắc chắn muốn rời khỏi trang? Tất cả nội dung đã nhập sẽ bị mất!";
        event.returnValue = message;
        return message;
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    return (
        <div className="w-3/12 mr-4 hidden lg:block">
            <div className="mx-3 my-5">
                <div className="px-5">
                    <h2 className="font-medium">Tạo nội dung của bạn</h2>
                    <div className="flex items-center space-x-2 my-4">
                        <Checkbox
                            checked={isCheckedCO}
                            onCheckedChange={setCheckedCO}
                            disabled
                        />
                        <label className="cursor-pointer">
                            <Link to="/course/manage/course-overview">
                                Trang tổng quan khóa học
                            </Link>
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 mb-8">
                        <Checkbox
                            checked={isCheckedCU}
                            onCheckedChange={setCheckedCU}
                            disabled
                        />
                        <label className="cursor-pointer">
                            <Link to="/course/manage/curriculum">
                                Chương trình giảng dạy
                            </Link>
                        </label>
                    </div>


                </div>
                <div className="space-y-3">
                    {/* Nút Lưu - secondary button */}
                    <button className="w-full px-4 py-3 bg-white border-2 border-yellow-500 hover:bg-yellow-50 focus:ring-4 focus:outline-none focus:ring-yellow-300 text-yellow-600 font-semibold rounded-lg text-sm transition-all duration-200">
                        Lưu bản nháp
                    </button>
                    {/* Nút Gửi đi để xem xét - primary button */}
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-300 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl">
                        Gửi đi để xem xét
                    </button>
                </div>
            </div>
        </div>
    );
};
