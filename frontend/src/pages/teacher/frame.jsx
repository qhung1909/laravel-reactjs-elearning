import { Checkbox } from "@/components/ui/checkbox"
export const FrameTeacher = () => {

    return (
        <>
            <div className="flex max-w-7xl m-auto my-12">
                <div className="w-3/12 ">
                    <div className="mx-3 my-5">
                        <div className="px-5">
                            <h2 className="font-medium">
                                Lên kế hoạch cho khóa học của bạn
                            </h2>
                            <div className="flex items-center space-x-2 mt-4 mb-8">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Học viên mục tiêu
                                </label>
                            </div>
                            <h2 className="font-medium">
                                Tạo nội dung của bạn
                            </h2>
                            <div className="flex items-center space-x-2 mt-4 mb-8">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Chương trình giảng dạy
                                </label>
                            </div>
                            <h2 className="font-medium">
                                Xuất bản khóa học của bạn
                            </h2>
                            <div className="flex items-center space-x-2 my-4">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Trang tổng quan khóa học
                                </label>
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
                        <h1 className="text-xl px-10 p-4">Học viên và mục tiêu</h1>
                    </div>
                    <div className="border-b-2"></div>
                    <div className="p-10  pr-24">
                        <div className="content-start pb-6">
                            Các mô tả sau sẽ được hiển thị công khai trên Trang tổng quan khóa học của bạn và sẽ tác động trực tiếp đến thành tích khóa học, đồng thời giúp học viên quyết định xem khóa học đó có phù hợp hay không
                        </div>
                        <h3 className="">
                            Học viên sẽ học được gì trong khóa học của bạn?
                        </h3>
                    </div>

                </div>
            </div>

        </>
    )
}
