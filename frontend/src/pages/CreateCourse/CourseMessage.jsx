import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Link } from "react-router-dom"
import { SideBarCreateCoure } from "./SideBarCreateCoure"
import { Footer } from "../footer/footer"
import { useState } from 'react';

export const CourseMessage = () => {

    const [welcomeText, setWelcomeText] = useState('');
    const [congratulationsText, setCongratulationsText] = useState('');const [courseDescriptionText, setCourseDescriptionText] = useState("");


    return (
        <>
            <div className="bg-yellow-500 h-12">
                <Link className='absolute top-3 left-6 lg:left-0 xl:top-3 xl:left-8' to='/'>
                    <div className="flex items-center gap-3">
                        <box-icon name='arrow-back' color='black' ></box-icon>
                        <p className="text-slate-900">Quay lại khóa học</p>
                    </div>
                </Link>
                <div className="block lg:hidden text-right pt-3 pr-6">
                    <box-icon name='menu-alt-left'></box-icon>
                </div>

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
                <SideBarCreateCoure />
                <div className="w-full lg:w-10/12 shadow-lg">


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

                </div>
            </div>
            <Footer />
        </>
    )
}
