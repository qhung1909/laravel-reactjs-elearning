export const UserNotiDetail = () => {
    return (
        <>
            <section className="userprofile my-10 px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-3xl  shadow-xl max-w-screen-sm mx-auto">

                    {/* header */}
                    <div className="px-10 py-5">
                        <div className="space-y-5 border-b-2 border-yellow-500 pb-8">
                            <div className="flex items-center gap-3">
                                <div className="">
                                    <img src="/src/assets/images/antlearn.png" className="w-16" alt="" />
                                </div>
                                <div className="text-2xl font-bold text-yellow-400">
                                    <p>AntLearn - Cùng học trực tuyến tại nhà</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-yellow-500">
                                Thông báo chi tiết
                            </div>
                        </div>

                    </div>

                    {/* content */}
                    <div className=" px-10 py-5">
                        <div className="space-y-3">
                            <div className="space-y-1">

                                {/* title */}
                                <div className="">
                                    <p className="text-xl font-semibold">Tiêu đề: </p>
                                </div>

                                {/* detail title */}
                                <div className="">
                                    <span className="">Thông báo nhắc nhở hoàn thành bài tập</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                {/* content */}
                                <div className="">
                                    <p className="text-xl font-semibold">Nội dung:</p>
                                </div>
                                {/* detail content */}
                                <div className="space-y-3">
                                    <span className="">
                                        Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,Mày nhớ làm bài cho tao,
                                    </span>
                                    <img src="/src/assets/images/doremon.jpg" className=" w-72" alt="" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* footer */}
                    <div className="">
                        <button className="w-full bg-gray-200 p-4 font-semibold rounded-br-2xl rounded-bl-2xl hover:bg-yellow-500 hover:text-white duration-300">Quay về trang thông báo</button>
                    </div>
                </div>

            </section>
        </>
    )
}
