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
    const [isCheckedCM, setCheckedCM] = useLocalStorage('FA-CM');
    const [isCheckedPR, setCheckedPR] = useLocalStorage('FA-PR'); 

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

    const handlePromotionClick = () => {
        // Nếu checkbox "Khuyến mại" chưa được tick, tick nó
        if (!isCheckedPR) {
            setCheckedPR(true);
        }
    };

    return (
        <div className="w-3/12 mr-4 hidden lg:block">
            <div className="mx-3 my-5">
                <div className="px-5">
                    <h2 className="font-medium">Tạo nội dung của bạn</h2>
                    <div className="flex items-center space-x-2 my-4">
                        <Checkbox
                            checked={isCheckedCO}
                            onCheckedChange={setCheckedCO}
                            readOnly={isCheckedCO}
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
                            readOnly={isCheckedCU}
                        />
                        <label className="cursor-pointer">
                            <Link to="/course/manage/curriculum">
                                Chương trình giảng dạy
                            </Link>
                        </label>
                    </div>

                    <h2 className="font-medium">Xuất bản khóa học của bạn</h2>
                    <div className="flex items-center space-x-2 my-4">
                        <Checkbox
                            checked={isCheckedPR} // Sử dụng state cho checkbox "Khuyến mại"
                            readOnly={true} // Không cho phép bỏ tick
                        />
                        <label className="cursor-pointer" onClick={handlePromotionClick}>
                            <Link to="/course/manage/promotion">Khuyến mại</Link>
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 mb-8">
                        <Checkbox
                            checked={isCheckedCM}
                            onCheckedChange={setCheckedCM}
                            readOnly={isCheckedCM}
                        />
                        <label className="cursor-pointer">
                            <Link to="/course/manage/course-message">
                                Tin nhắn khóa học
                            </Link>
                        </label>
                    </div>
                </div>
                <button className="bg-yellow-400 w-full px-3 py-3">
                    <h2 className="text-white font-bold">Gửi đi để xem xét</h2>
                </button>
            </div>
        </div>
    );
};
