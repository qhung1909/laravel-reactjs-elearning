import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";

export const FrameTeacher = () => {

    console.log("Rendering StudyTarget");

    const [inputs, setInputs] = useState([
        "Ví dụ: Xác định vai trò và trách nhiệm của người quản lý dự án",
        "Ví dụ: Ước tính tiến độ và ngân sách dự án",
        "Ví dụ: Xác định và quản lý rủi ro dự án",
    ]);
    const [values, setValues] = useState(["", "", ""]);

    const [requirementInputs, setRequirementInputs] = useState([
        "Ví dụ: Không cần kinh nghiệm lập trình. Bạn sẽ học mọi thứ mà bạn cần biết."
    ]);
    const [requirementValues, setRequirementValues] = useState([""]);

    const [audienceInputs, setAudienceInputs] = useState([
        "Ví dụ: Các nhà phát triển Python sơ cấp muốn tìm hiểu về khoa học dữ liệu"
    ]);
    const [audienceValues, setAudienceValues] = useState([""]);

    const handleAddInput = () => {
        setInputs([...inputs, `Nhập mục tiêu học tập thứ ${inputs.length + 1}`]);
        setValues([...values, ""]);
    };

    const handleInputChange = (index, value) => {
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
    };

    const handleAddRequirementInput = () => {
        setRequirementInputs([...requirementInputs, `Nhập yêu cầu thứ ${requirementInputs.length + 1}`]);
        setRequirementValues([...requirementValues, ""]);
    };

    const handleRequirementInputChange = (index, value) => {
        const newValues = [...requirementValues];
        newValues[index] = value;
        setRequirementValues(newValues);
    };

    const handleAddAudienceInput = () => {
        setAudienceInputs([...audienceInputs, `Nhập mô tả đối tượng học viên thứ ${audienceInputs.length + 1}`]);
        setAudienceValues([...audienceValues, ""]);
    };

    const handleAudienceInputChange = (index, value) => {
        const newValues = [...audienceValues];
        newValues[index] = value;
        setAudienceValues(newValues);
    };

    const allInputsFilled = () => {
        return values.every(value => value.trim() !== "") &&
            requirementValues.every(value => value.trim() !== "") &&
            audienceValues.every(value => value.trim() !== "");
    };


    return (
        <>
            <div className="flex max-w-7xl m-auto my-12">
                <div className="w-3/12 mr-4 hidden lg:block">
                    <div className="mx-3 my-5">
                        <div className="px-5">
                            <h2 className="font-medium">Lên kế hoạch cho khóa học của bạn</h2>
                            <div className="flex items-center space-x-2 mt-4 mb-8">
                                <Checkbox
                                    id="studyTargetCheckbox"
                                    checked={allInputsFilled()}

                                    readOnly
                                />
                                <label htmlFor="studyTargetCheckbox">Học viên mục tiêu</label>
                            </div>




                            <h2 className="font-medium">Tạo nội dung của bạn</h2>
                            <div className="flex items-center space-x-2 mt-4 mb-8">
                                <Checkbox
                                    id="curriculum"

                                />
                                <label>Chương trình giảng dạy</label>
                            </div>
                            <h2 className="font-medium">Xuất bản khóa học của bạn</h2>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    id="courseOverview"

                                />
                                <label>Trang tổng quan khóa học</label>
                            </div>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Định giá
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Khuyến mại
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 mb-8">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Tin nhắn khóa học
                                </label>
                            </div>
                        </div>
                        <button className="bg-yellow-400 w-full px-3 py-3">
                            <h2 className="text-white font-bold">
                                Gửi đi để xem xét
                            </h2>
                        </button>

                    </div>
                </div>
                <div className="w-10/12 shadow-lg">
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Học viên mục tiêu</h1>
                    </div>
                    <div className="border-b-2"></div>
                    <div className="p-10 pr-32">
                        <div className="content-start pb-6">
                            <h3 className="pb-3 text-lg font-medium">Học viên sẽ học được gì trong khóa học của bạn?</h3>
                            <p className="pb-3">
                                Bạn phải nhập ít nhất 4 mục tiêu hoặc kết quả học tập mà học viên có thể mong đợi đạt được sau khi hoàn thành khóa học
                            </p>
                            {inputs.map((placeholder, index) => (
                                <input
                                    key={index}
                                    className="w-10/12 mb-2 border-slate-900 border-2 py-2 pl-3"
                                    placeholder={placeholder}
                                    value={values[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                />
                            ))}
                            <button onClick={handleAddInput} className="text-yellow-500 font-medium pt-3">+ Thêm nội dung vào phản hồi của bạn</button>
                        </div>

                        <div className="pb-6">
                            <h3 className="pb-3 text-lg font-medium">Yêu cầu trước khi tham gia khóa học</h3>
                            <p className="pb-3">
                                Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị mà học viên bắt buộc phải có trước khi tham gia khóa học. <br />
                                Nếu bạn không có yêu cầu nào, hãy tận dụng phần này và coi đây là cơ hội để bạn hạ thấp tiêu chuẩn cho người mới bắt đầu.
                            </p>
                            {requirementInputs.map((placeholder, index) => (
                                <input
                                    key={index}
                                    className="w-10/12 mb-2 border-slate-900 border-2 py-2 pl-3"
                                    placeholder={placeholder}
                                    value={requirementValues[index]}
                                    onChange={(e) => handleRequirementInputChange(index, e.target.value)}
                                />
                            ))}
                            <button onClick={handleAddRequirementInput} className="text-yellow-500 font-medium pt-3">+ Thêm nội dung vào phản hồi của bạn</button>
                        </div>

                        <div className="pb-6">
                            <h3 className="pb-3 text-lg font-medium">Khóa học này dành cho đối tượng nào?</h3>
                            <p className="pb-3">
                                Viết mô tả rõ ràng về học viên mục tiêu cho khóa học, tức là những người sẽ thấy nội dung khóa học có giá trị. Điều này sẽ giúp bạn thu hút học viên phù hợp tham gia khóa học.
                            </p>
                            {audienceInputs.map((placeholder, index) => (
                                <input
                                    key={index}
                                    className="w-10/12 mb-2 border-slate-900 border-2 py-2 pl-3"
                                    placeholder={placeholder}
                                    value={audienceValues[index]}
                                    onChange={(e) => handleAudienceInputChange(index, e.target.value)}
                                />
                            ))}
                            <button onClick={handleAddAudienceInput} className="text-yellow-500 font-medium pt-3">+ Thêm nội dung vào phản hồi của bạn</button>
                        </div>


                    </div>
                </div>
            </div>

        </>
    )
}
