import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../footer/footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
export const FrameTeacher = () => {

    // alert reload
    const handleBeforeUnload = (event) => {
        const message = "Bạn có chắc chắn muốn rời khỏi trang? Tất cả nội dung đã nhập sẽ bị mất!";
        event.returnValue = message; // Trình duyệt sẽ hiển thị thông báo này
        return message; // Một số trình duyệt vẫn cần giá trị trả về
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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

    const [activeSection, setActiveSection] = useState("targetStudents");

    // courseMessage
    const [welcomeText, setWelcomeText] = useState('');
    const [congratulationsText, setCongratulationsText] = useState('');

    // course overview
    const [courseDescriptionText, setCourseDescriptionText] = useState('');



    // promotion
    const inputRef = useRef(null);
    const [copyText, setCopyText] = useState('Sao chép');

    const copyToClipboard = () => {
        if (inputRef.current) {
            inputRef.current.select();
            document.execCommand('copy');
            setCopyText('Đã sao chép');
            setTimeout(() => setCopyText('Sao chép'), 1500);
        }
    };

    const targetStudents = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Học viên mục tiêu</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>

                <div className="p-10 lg:pr-32">
                    <p className="pb-10">
                        Các mô tả sau sẽ hiển thị công khai trên Trang tổng quan khóa học của bạn và sẽ tác động trực tiếp đến thành tích khóa học, đồng thời giúp học viên quyết định xem khóa học đó có phù hợp với họ hay không
                    </p>
                    <div className="content-start pb-6">

                        <h3 className="pb-3 text-lg font-medium">Học viên sẽ học được gì trong khóa học của bạn?</h3>
                        <p className="pb-3">
                            Bạn phải nhập ít nhất 4 mục tiêu hoặc kết quả học tập mà học viên có thể mong đợi đạt được sau khi hoàn thành khóa học
                        </p>
                        {inputs.map((placeholder, index) => (
                            <input
                                key={index}
                                className="w-10/12 mb-2 border-slate-500 border-2 py-2 pl-3"
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
                                className="w-10/12 mb-2 border-slate-500 border-2 py-2 pl-3"
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
                                className="w-10/12 mb-2 border-slate-500 border-2 py-2 pl-3"
                                placeholder={placeholder}
                                value={audienceValues[index]}
                                onChange={(e) => handleAudienceInputChange(index, e.target.value)}
                            />
                        ))}
                        <button onClick={handleAddAudienceInput} className="text-yellow-500 font-medium pt-3">+ Thêm nội dung vào phản hồi của bạn</button>
                    </div>


                </div>
            </>
        )
    }

    const curriculum = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Chương trình giảng dạy</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>

                <div className="p-10">
                    <h2 className="pb-6 font-medium text-lg">đây là chương trình giảng dạy</h2>
                </div>

            </>
        )
    }


    const courseOverview = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Tổng quan khóa học</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>
                <div className="p-10">
                    <p className="pb-10">
                        Trang tổng quan khóa học của bạn rất quan trọng đối với thành công của bạn trên AntLearn. Nếu được thực hiện đúng, trang này cũng có thể giúp bạn hiển thị trong các công cụ tìm kiếm như Google. Khi bạn hoàn thành phần này, hãy nghĩ đến việc tạo  Trang tổng quan khóa học hấp dẫn thể hiện lý do ai đó muốn ghi danh khóa học của bạn. Tìm hiểu về cách tạo trang tổng quan khóa học của bạn và các tiêu chuẩn tiêu đề khóa học.
                    </p>
                    <div className="pb-6">
                        <h2 className="pb-1 text-lg font-medium">
                            Tiêu đề khóa học
                        </h2>
                        <input
                            className="w-full mb-2 border-slate-300 border-2 py-2 pl-3"
                            placeholder='Chèn tiêu đề khóa học'
                        />
                        <p className="text-sm text-gray-400">
                            Tiêu đề của bạn không những phải thu hút sự chú ý, chứa nhiều thông tin mà còn được tối ưu hóa dễ tìm kiếm
                        </p>
                    </div>

                    <div className="pb-6">
                        <h2 className="pb-1 text-lg font-medium">
                            Phụ đề khóa học
                        </h2>
                        <input
                            className="w-full mb-2 border-slate-300 border-2 py-2 pl-3"
                            placeholder='Chèn phụ đề khóa học'
                        />
                        <p className="text-sm text-gray-400">
                            Sử dụng 1 hoặc  2 từ khóa có liên quan và đề cập đến 3 - 4 lĩnh vực quan trọng nhất mà bạn đã đề cập trong khóa học học của bạn
                        </p>
                    </div>

                    <div className="pb-6">
                        <h2 className="pb-1 text-lg font-medium">
                            Mô tả khóa học
                        </h2>
                        <ReactQuill
                            className="pb-2"
                            value={courseDescriptionText} // Sử dụng state cho mô tả khóa học
                            onChange={setCourseDescriptionText} // Cập nhật state
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'image', 'code-block'],
                                    ['clean']
                                ],
                            }}
                            formats={[
                                'header', 'bold', 'italic', 'underline',
                                'list', 'bullet', 'link', 'image', 'code-block'
                            ]}
                        />
                        <p className="text-sm text-gray-400">
                            Mô tả phải dài ít nhất 200 từ
                        </p>
                    </div>


                    <div className="pb-6">
                        <h2 className="pb-1 text-lg font-medium">
                            Thông tin cơ bản
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="-- Chọn ngôn ngữ --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Ngôn ngữ</SelectLabel>
                                        <SelectItem value="english">Tiếng Anh</SelectItem>
                                        <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>


                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="-- Chọn trình độ --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Trình độ</SelectLabel>
                                        <SelectItem value="beginner">Người mới bắt đầu</SelectItem>
                                        <SelectItem value="intermediate">Trung cấp</SelectItem>
                                        <SelectItem value="advanced">Nâng cao</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="-- Chọn thể loại khóa học --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Thể loại khóa học</SelectLabel>
                                        <SelectItem value="frontend">Frontend Development</SelectItem>
                                        <SelectItem value="backend">Backend Development</SelectItem>
                                        <SelectItem value="fullstack">Fullstack Development</SelectItem>
                                        <SelectItem value="devops">DevOps</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <div className="col-end-4">
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Chọn chủ đề khóa học --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Chủ đề khóa học</SelectLabel>
                                            <SelectItem value="web-design">Thiết kế web</SelectItem>
                                            <SelectItem value="data-visualization">Trực quan hóa dữ liệu</SelectItem>
                                            <SelectItem value="mobile-development">Phát triển ứng dụng di động</SelectItem>
                                            <SelectItem value="machine-learning">Học máy</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </div>


                    <div className="pb-6">
                        <h2 className="pb-1 text-lg font-medium">
                            Khóa học của bạn chủ yếu giảng dạy nội dung nào ?
                        </h2>
                        <input className="w-7/12 mb-2 border-slate-300 border-2 py-2 pl-3" placeholder="Ví dụ ReactJS" />

                    </div>

                    <div className="pb-6">
                        <h2 className="pb-1 text-lg font-medium">
                            Hình ảnh khóa học
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-100">
                                <img className="bg-red-100" />

                            </div>
                            <div className=" ml-12">
                                <p className="pb-4">
                                    Tải hình ảnh  lên đây. Để được chấp nhận, hình ảnh phải đáp ứng tiêu chuẩn chất lượng hình ảnh khóa học. Hướng dẫn quan trọng 750x422 pixel, jqg, jpeg, gif hoặc png và không có nhu cầu trên hình ảnh.
                                </p>
                                <input type="file" className="w-7/12 mb-2 border-slate-300 border-2 py-2 pl-3" placeholder="Ví dụ ReactJS" />
                            </div>


                        </div>

                    </div>







                </div>
            </>
        )
    }


    const valuation = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Định giá</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>
                <div className="p-10">
                    <h2 className="pb-6 font-medium text-lg">Đặt giá cho khóa học của bạn</h2>
                    <p>Vui lòng chọn đơn vị tiền tệ và mức giá cho khóa học của bạn. Nếu muốn cung cấp miễn phí khóa học của mình thì khóa học đó phải có tổng thời lượng video dưới 2 giờ. Ngoài ra, các khóa học có bài kiểm tra thực hành không thể miễn phí.</p>
                    <form>


                        <div className="flex flex-cols-2 gap-4 pt-6 pb-3">
                            <div className="">
                                <p className="pb-1 font-medium">
                                    Tiền tệ
                                </p>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vnd">VND</SelectItem>
                                        <SelectItem value="usd">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="">
                                <p className="pb-1 font-medium">
                                    Mức giá
                                </p>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="free">Miễn phí</SelectItem>
                                        <SelectItem value="basic">Cơ bản (100.000 VNĐ)</SelectItem>
                                        <SelectItem value="standard">Tiêu chuẩn (300.000 VNĐ)</SelectItem>
                                        <SelectItem value="premium">Nâng cao (500.000 VNĐ)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                        <button className="w-16 h-10 bg-yellow-500 text-white font-bold">Lưu</button>
                    </form>
                </div>

            </>
        )
    }

    const promotion = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Khuyến mại</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>
                <div className="p-10">
                    <div className="border border-slate-400 px-3 py-5 mb-6">
                        <div className="">
                            <h2 className="font-medium text-lg">Giới thiệu cho học viên</h2>
                        </div>
                        <p className="pb-3">
                            Bất cứ khi nào học viên sử dụng đường liên kết này để mua khóa học. Chúng tôi sẽ tính doanh thu cho bạn.
                        </p>
                        <div className="flex w-11/12 pb-3 relative">
                            <input
                                ref={inputRef}
                                className="border border-slate-600 w-full p-2"
                                placeholder="Nhập đường dẫn"
                            />
                            <button onClick={copyToClipboard} className="border border-slate-600 w-32 p-2">
                                {copyText}
                            </button>
                        </div>

                    </div>


                    <h2 className="font-medium text-lg pb-1">Coupon</h2>
                    <div className="border border-slate-400 px-3 py-5 mb-6">
                        <p className="font-medium">Tháng 10 coupon</p>
                        <p>Bạn không thể tạo coupon cho khóa học miễn phí</p>
                    </div>

                    <div className="flex flex-cols-2">
                        <h2 className="flex-1 font-medium pb-2">Coupon đang hoạt động/đã lên lịch phát hành</h2>
                        <Link to="">
                            <p className="flex-0 text-right underline underline-offset-2 text-blue-700">Tạo nhiều coupon</p>
                        </Link>
                    </div>


                    <div className="border border-slate-400 p-3 text-center mb-6">
                        <p>Không tìm thấy coupon</p>
                    </div>


                    <div className="pb-3 flex items-end relative">
                        <h2 className="flex-1 font-medium">Coupon đã hết hạn</h2>
                        <div className="flex-1 text-right">
                            <div className="flex justify-end">
                                <input className="border border-slate-500 h-10 px-3" placeholder="Tìm kiếm mã coupon" />
                                <button className="bg-slate-800 w-10 h-10">
                                    <box-icon name='search' color='#ffffff'></box-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border border-slate-400 p-3 text-center mb-6">
                        <p>Không tìm thấy coupon</p>
                    </div>

                </div>
            </>
        )
    }
    const courseMessage = () => {
        return (
            <>
                <div>
                    <div className="m-2">
                        <h1 className="text-xl font-medium px-10 p-4">Tin nhắn khóa học</h1>
                    </div>
                    <div className="border-b-2"></div>
                </div>
                <div>
                    <div>

                    </div>
                    <div className="p-10 lg:pr-32">

                        <div className="pb-6">
                            <p>Bạn có thể viết tin nhắn cho học viên (tùy chọn) để khuyến khích học viên tương tác với nội dung khóa học. Tin nhắn này sẽ được tự động gửi đi khi họ tham gia hoặc hoàn thành khóa học. Nếu bạn không muốn gửi tin nhắn chào mừng hoặc chúc mừng. Hãy để trống ô văn bản này</p>
                        </div>

                        <p className="pb-3 font-medium">Tin nhắn chào mừng</p>
                        <ReactQuill
                            className="pb-6"
                            value={welcomeText}
                            onChange={setWelcomeText}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'image', 'code-block'],
                                    ['clean']
                                ],
                            }}
                            formats={[
                                'header', 'bold', 'italic', 'underline',
                                'list', 'bullet', 'link', 'image', 'code-block'
                            ]}
                        />

                        <p className="pb-3 font-medium">Tin nhắn chúc mừng</p>
                        <ReactQuill
                            className="pb-6"
                            value={congratulationsText}
                            onChange={setCongratulationsText}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'image', 'code-block'],
                                    ['clean']
                                ],
                            }}
                            formats={[
                                'header', 'bold', 'italic', 'underline',
                                'list', 'bullet', 'link', 'image', 'code-block'
                            ]}
                        />
                    </div>
                </div>

            </>
        )
    }



    return (
        <>
            <div className="bg-yellow-500 h-12">
                <Link className='absolute top-1 left-0 xl:top-3 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='black' ></box-icon>
                        <p className="text-slate-900">Quay lại khóa học</p>
                    </div>
                </Link>
            </div>
            <div className="w-96 h-100 bg-red-100"></div>
            <div className="w-full h-100 bg-red-100">
                {/* <Link className='absolute top-1 left-0 xl:top-8 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='gray' ></box-icon>
                        <p className="text-gray-600">Trang chủ</p>
                    </div>
                </Link> */}
            </div>
            <div className="flex max-w-7xl m-auto pt-10 pb-36">
                <div className="w-3/12 mr-4 hidden lg:block">
                    <div className="mx-3 my-5">
                        <div className="px-5">
                            <h2 className="font-medium">Lên kế hoạch cho khóa học của bạn</h2>
                            <div className="flex items-center space-x-2 mt-4 mb-8">
                                <Checkbox
                                    checked={allInputsFilled()}
                                    readOnly
                                />
                                <label
                                    className='cursor-pointer'
                                    onClick={() => setActiveSection("targetStudents")}
                                >
                                    Học viên mục tiêu
                                </label>
                            </div>

                            <h2 className="font-medium">Tạo nội dung của bạn</h2>
                            <div className="flex items-center space-x-2 mt-4 mb-8">
                                <Checkbox
                                    checked={allInputsFilled()}
                                    readOnly

                                />
                                <label
                                    className='ursor-pointer'
                                    onClick={() => setActiveSection("curriculum")}
                                >
                                    Chương trình giảng dạy
                                </label>
                            </div>
                            <h2 className="font-medium">Xuất bản khóa học của bạn</h2>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    checked={allInputsFilled()}
                                    readOnly

                                />
                                <label
                                    className='cursor-pointer'
                                    onClick={() => setActiveSection("courseOverview")}
                                >
                                    Trang tổng quan khóa học
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    checked={allInputsFilled()}
                                    readOnly
                                />
                                <label
                                    onClick={() => setActiveSection("valuation")}
                                    className="cursor-pointer"
                                >
                                    Định giá
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox
                                    id="terms"
                                    checked={allInputsFilled()}
                                    readOnly
                                />
                                <label
                                    onClick={() => setActiveSection("promotion")}
                                    className="cursor-pointer"
                                >
                                    Khuyến mại
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 mb-8">
                                <Checkbox
                                    checked={allInputsFilled()}
                                    readOnly
                                />
                                <label
                                    onClick={() => setActiveSection("courseMessage")}
                                    className="cursor-pointer"
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
                <div className="w-full lg:w-10/12 shadow-lg">
                    {activeSection === "targetStudents" && targetStudents()}
                    {activeSection === "curriculum" && curriculum()}
                    {activeSection === "courseOverview" && courseOverview()}
                    {activeSection === "valuation" && valuation()}
                    {activeSection === "promotion" && promotion()}
                    {activeSection === "courseMessage" && courseMessage()}
                </div>
            </div>
            <Footer />

        </>
    )
}
