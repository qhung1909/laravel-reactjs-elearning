import { useEffect, useState } from 'react';
import { Video, X, PlayCircle, FileText } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import axios from 'axios';
import { SideBarCreateCoure } from './SideBarCreateCoure';
import { Footer } from '../footer/footer';
import { Textarea } from '@/components/ui/textarea';

export const Curriculum = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [isDataFetched, setIsDataFetched] = useState(false);

    const { course_id } = useParams();

    const [sections, setSections] = useState([
        {
            id: 1,
            title: '',
            lessons: [{ id: 1, title: '', selectedOption: '', videoLink: '', content: '', fileName: '' }]
        }
    ]);

    const handleSectionTitleChange = (sectionId, newTitle) => {
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, title: newTitle } : section
        ));
    };

    const addSection = () => {
        if (sections.length > 0 && !sections[sections.length - 1].title.trim()) {
            toast.error("Vui lòng nhập tiêu đề cho Bài học trước khi thêm Bài học mới.");
            return;
        }
        setSections([...sections, {
            id: sections.length + 1,
            title: '',
            lessons: [{ id: 1, title: '', selectedOption: '', videoLink: '', content: '', fileName: '' }]
        }]);
    };

    const addLesson = (sectionId) => {
        const section = sections.find(section => section.id === sectionId);
        const currentLesson = section.lessons[section.lessons.length - 1];

        if (
            !currentLesson.title.trim() ||
            (currentLesson.selectedOption === 'content' && !currentLesson.content.trim()) ||
            (currentLesson.selectedOption === 'videoUrl' && !currentLesson.videoLink.trim()) ||
            (currentLesson.selectedOption === 'videoFile' && !currentLesson.fileName.trim())
        ) {
            toast.error("Vui lòng điền đầy đủ thông tin trước khi thêm nội dung mới.");
            return;
        }

        if (!currentLesson.selectedOption) {
            toast.error("Vui lòng Chọn loại nội dung.");
            return;
        }

        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: [...section.lessons, {
                        id: section.lessons.length + 1,
                        title: '',
                        selectedOption: '',
                        videoLink: '',
                        content: '',
                        fileName: ''
                    }]
                };
            }
            return section;
        }));
    };

    const handleLessonTitleChange = (sectionId, lessonId, newTitle) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson
                    )
                };
            }
            return section;
        }));
    };

    const handleSelectChange = (sectionId, lessonId, value) => {
        setSections(prevSections =>
            prevSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map(lesson => {
                            if (lesson.id === lessonId) {
                                if (value === "videoFile") {
                                    return {
                                        ...lesson,
                                        selectedOption: value,
                                        content: null, // Đặt content thành null
                                        fileName: lesson.fileName || null, // Giữ lại fileName hoặc đặt thành null
                                    };
                                } else if (value === "content") {
                                    return {
                                        ...lesson,
                                        selectedOption: value,
                                        videoLink: null, // Đặt videoLink thành null
                                        fileName: null, // Đặt fileName thành null
                                    };
                                }
                                return {
                                    ...lesson,
                                    selectedOption: value,
                                };
                            }
                            return lesson;
                        })
                    };
                }
                return section;
            })
        );
    };




    const handleVideoLinkChange = (sectionId, lessonId, value) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, videoLink: value } : lesson
                    )
                };
            }
            return section;
        }));
    };

    const handleLessonDescriptionChange = (sectionId, lessonId, newDescription) => {
        setSections(prevSections =>
            prevSections.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        lessons: section.lessons.map(lesson =>
                            lesson.id === lessonId ? { ...lesson, description: newDescription } : lesson
                        )
                    }
                    : section
            )
        )
    }

    const handleContentChange = (sectionId, lessonId, value) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, content: value } : lesson
                    )
                };
            }
            return section;
        }));
    };

    const handleFileChange = (sectionId, lessonId, file) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, fileName: file.name } : lesson
                    )
                };
            }
            return section;
        }));
    };

    const resetIds = (sections) => {
        return sections.map((section, sectionIndex) => ({
            ...section,
            id: sectionIndex + 1,
            lessons: section.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                id: lessonIndex + 1
            }))
        }));
    };

    useEffect(() => {
        fetchContent()
    }, []);
    const fetchContent = async () => {

        if (isDataFetched) {
            console.log("Dữ liệu đã được tải, không cần fetch lại");
            return;
        }
        try {
            const response = await axios.get(
                `${API_URL}/teacher/content/${course_id}`,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            if (response.data.success) {
                // Transform API data into sections format
                const apiContents = response.data.data.contents;
                apiContents.sort((a, b) => a.content_id - b.content_id)
                const transformedSections = apiContents.map((content, index) => ({
                    id: index + 1,
                    title: content.name_content,
                    content_id: content.content_id, // Store API content ID
                    lessons: [{ id: 1, title: '', selectedOption: '', videoLink: '', content: '', fileName: '' }]
                }));

                // If there are sections from API, use them; otherwise, keep default empty section
                if (transformedSections.length > 0) {
                    setSections(transformedSections);
                    setIsDataFetched(true);
                }
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            toast.error('Không thể tải nội dung khóa học');
        }
    };



    const deleteSection = async (contentId) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa bài này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return;
        }


        try {
            // Gửi yêu cầu xóa đến API
            const response = await axios.delete(`${API_URL}/teacher/courses/${course_id}/contents`, {
                data: { content_ids: [contentId] },
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Cập nhật state sau khi xóa thành công
                const updatedSections = sections.filter(section => section.id !== contentId);
                const resetSections = resetIds(updatedSections);
                setSections(resetSections);
                toast.success("Đã xóa Bài học thành công!");
            } else {
                toast.error("Có lỗi xảy ra khi xóa Bài học!");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Có lỗi xảy ra khi xóa Bài học!");
        } finally {
            fetchContent();
        }
    };




    const deleteContent = async (sectionId, lessonId) => {
        const updatedSections = sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
                };
            }
            return section;
        });

        const resetSections = resetIds(updatedSections);
        setSections(resetSections);
        toast.success("Nội dung đã được xóa!");
    };

    const exportToJsonLog = () => {
        console.log(JSON.stringify(sections, null, 2));
        toast.success("Đã xuất dữ liệu ra log!");
    };


    const openPageQuiz = (sectionId) => {
        navigate(`/course/manage/create-quiz?lesson=${sectionId}`);
    };




    const handleSubmit = async () => {
        const validSections = sections.filter(section => section.title.trim() !== '');

        if (validSections.length === 0) {
            toast.error('Vui lòng nhập ít nhất một tiêu đề bài học!');
            return;
        }

        const sectionsToAdd = validSections.filter(section => !section.content_id);
        const sectionsToUpdate = validSections.filter(section => section.content_id);

        const loadingToast = toast.loading('Đang xử lý...');

        try {
            const addPromises = sectionsToAdd.map(section =>
                axios.post(
                    `${API_URL}/teacher/content`,
                    {
                        course_id: course_id,
                        name_content: section.title.trim(),
                    },
                    {
                        headers: {
                            'x-api-secret': API_KEY,
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
            );

            const updateContentsData = sectionsToUpdate.map(section => ({
                content_id: section.content_id,
                name_content: section.title.trim(),
            }));

            let updatePromise = Promise.resolve(); // Default nếu không có gì để cập nhật
            if (updateContentsData.length > 0) {
                updatePromise = axios.put(
                    `${API_URL}/teacher/courses/${course_id}/contents`,
                    { contents: updateContentsData },
                    {
                        headers: {
                            'x-api-secret': API_KEY,
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            const [addResults, updateResult] = await Promise.all([
                Promise.all(addPromises),
                updatePromise,
            ]);

            let hasError = false; // Biến để kiểm tra nếu có lỗi

            // Kiểm tra kết quả của các yêu cầu thêm
            addResults.forEach(response => {
                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra khi thêm nội dung!');
                    hasError = true; // Đánh dấu có lỗi
                }
            });

            // Kiểm tra kết quả của yêu cầu cập nhật
            if (updateContentsData.length > 0 && updateResult.data.success) {
                // Không làm gì cả, thông báo thành công sẽ hiển thị sau
            } else if (updateContentsData.length > 0) {
                toast.error(updateResult.data.message || 'Không thể cập nhật nội dung khóa học!');
                hasError = true; // Đánh dấu có lỗi
            }

            // Cập nhật title-content cho các sections
            const titleContentPromises = validSections.map(section =>
                axios.post(
                    `${API_URL}/teacher/title-content/update/${section.content_id}`,
                    {
                        title_contents: section.lessons.map(lesson => ({
                            title_content_id: lesson.title_content_id || '',
                            body_content: lesson.title,
                            video_link: lesson.fileName,
                            document_link: lesson.content,
                            description: lesson.description,
                        })),
                    },
                    {
                        headers: {
                            'x-api-secret': API_KEY,
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
            );

            const titleContentResults = await Promise.all(titleContentPromises);
            titleContentResults.forEach(response => {
                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra khi cập nhật chi tiết tiêu đề!');
                    hasError = true; // Đánh dấu có lỗi
                }
            });

            // Hiển thị toast thành công chỉ nếu không có lỗi nào xảy ra
            if (!hasError) {
                toast.success('Đã lưu thành nội dung thành công!');
            }

        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại!');
                navigate('/login');
                return;
            }

            if (error.response?.status === 403) {
                toast.error('Bạn không có quyền thực hiện thao tác này!');
                return;
            }

            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xử lý nội dung!';
            toast.error(errorMessage);
            console.error('Error:', error);
        } finally {
            toast.dismiss(loadingToast);
            fetchContent();
        }
    };




    const handleAccordionClick = (contentId) => {

        const section = sections.find((s) => s.content_id === contentId);
        if (section && section.lessons.length > 0 && section.lessons[0].title !== '') {
            console.log("Dữ liệu đã được tải, không cần fetch lại");
            return;
        }
        console.log(contentId);

        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/teacher/title-content/${contentId}`, {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.success) {
                    const fetchedLessons = response.data.data.map((item) => {
                        return {
                            id: item.title_content_id,
                            title: item.body_content,
                            description: item.description,
                            fileName: item.video_link,
                            content: item.document_link,
                            selectedOption: item.video_link ? "videoFile" : item.document_link ? "content" : "",
                            title_content_id: item.title_content_id || null
                        };
                    });

                    // Update only the lessons of the section with the matching content_id
                    setSections((prevSections) =>
                        prevSections.map((section) =>
                            section.content_id === contentId
                                ? { ...section, lessons: fetchedLessons }
                                : section
                        )
                    );
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


        fetchData();
    };





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

            <div className="flex max-w-7xl m-auto pt-10 pb-36">
                <SideBarCreateCoure course_id={course_id} />

                <div className="w-full lg:w-10/12 shadow-lg">




                    <div>
                        <div className="m-2">
                            <h1 className="text-xl font-medium px-10 p-4">Chương trình giảng dạy</h1>
                        </div>
                        <div className="border-b-2"></div>
                    </div>


                    <div className="max-w-4xl mx-auto p-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Nội dung khóa học</h2>
                            <Accordion type="multiple"  collapsible="true" className="space-y-4 relative">
                                {sections.map((section, sectionIndex) => (
                                    <AccordionItem
                                        value={`section-${section.id}`}
                                        key={section.id}
                                        className="border-2 rounded-lg border-yellow-700 p-4 relative"
                                        onClick={() => handleAccordionClick(section.content_id)} // Thêm sự kiện onClick vào đây
                                    >
                                        <div className="flex items-center gap-4 w-[80%] md:w-[88%] absolute ml-14 mt-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-600">Bài {sectionIndex + 1}:</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="flex-1 p-2 border rounded-md"
                                                placeholder={`Nhập tiêu đề bài ${sectionIndex + 1}`}
                                                value={section.title}
                                                onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                                onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan truyền
                                            />
                                            <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => openPageQuiz(section.id)}>
                                                Tạo quiz
                                            </Button>
                                        </div>

                                        <AccordionTrigger className="hover:no-underline border-2 rounded-lg border-yellow-600 p-5 mt-1 ml-3" />
                                        {sections.length > 1 && (
                                            <X onClick={() => deleteSection(section.content_id)} className="absolute text-red-600 cursor-pointer left-1 top-1" />
                                        )}
                                        <AccordionContent>
                                            <div className="space-y-4 mt-4">
                                                {section.lessons.map((lesson, lessonIndex) => (
                                                    <Card key={lesson.id} className="relative p-4 border border-yellow-400 ml-6">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4 mt-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-600">
                                                                        Nội dung: {sectionIndex + 1}.{lessonIndex + 1}
                                                                    </span>
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    className="flex-1 p-2 border rounded-md"
                                                                    placeholder={`Nhập tiêu đề nội dung bài ${sectionIndex + 1}.${lessonIndex + 1}`}
                                                                    value={lesson.title}
                                                                    onChange={(e) => handleLessonTitleChange(section.id, lesson.id, e.target.value)}
                                                                />
                                                            </div>

                                                            <Textarea
                                                                placeholder="Nhập mô tả cho bài học này"
                                                                value={lesson.description}
                                                                onChange={(e) => handleLessonDescriptionChange(section.id, lesson.id, e.target.value)}
                                                                className="w-full"
                                                            />

                                                            <select
                                                                onChange={(e) => handleSelectChange(section.id, lesson.id, e.target.value)}
                                                                value={lesson.selectedOption}
                                                                className="border p-2 rounded-md mb-4"
                                                            >
                                                                <option value="">Chọn loại nội dung</option>
                                                                {/* <option value="videoUrl">Dạng video URL</option> */}
                                                                <option value="videoFile">Dạng Video file</option>
                                                                <option value="content">Dạng Nội dung</option>
                                                            </select>

                                                            {/* {lesson.selectedOption === "videoUrl" && (
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <PlayCircle className="text-green-500 h-5 w-5" />
                                                                        <label className="font-medium">Nhập link video:</label>
                                                                    </div>
                                                                    <Input
                                                                        className="my-3 border p-2 w-full"
                                                                        type="text"
                                                                        placeholder="Link VIDEO"
                                                                        value={lesson.videoLink}
                                                                        onChange={(e) => handleVideoLinkChange(section.id, lesson.id, e.target.value)}
                                                                    />
                                                                </div>
                                                            )} */}

                                                            {lesson.selectedOption === "videoFile" && (
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Video className="text-red-500 h-5 w-5" />
                                                                        <label className="font-medium">Tải lên video:</label>
                                                                    </div>

                                                                    {/* Hiển thị tên file từ cơ sở dữ liệu nếu có */}
                                                                    {lesson.fileName && (
                                                                        <p className="text-gray-600 mt-2">Tệp hiện tại: {lesson.fileName}</p>
                                                                    )}

                                                                    <Input
                                                                        className="mt-2"
                                                                        type="file"
                                                                        onChange={(e) => handleFileChange(section.id, lesson.id, e.target.files[0])}
                                                                    />
                                                                </div>
                                                            )}


                                                            {lesson.selectedOption === "content" && (
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <FileText className="text-purple-500 h-5 w-5" />
                                                                        <label className="font-medium">Nhập nội dung:</label>
                                                                    </div>
                                                                    <ReactQuill
                                                                        className="mt-2 pb-2"
                                                                        value={lesson.content || ""}
                                                                        onChange={(value) => handleContentChange(section.id, lesson.id, value)}
                                                                        modules={{
                                                                            toolbar: [
                                                                                [{ header: [1, 2, 3, false] }],
                                                                                ["bold", "italic", "underline"],
                                                                                [{ list: "ordered" }, { list: "bullet" }],
                                                                                ["link", "image", "code-block"],
                                                                                ["clean"],
                                                                            ],
                                                                        }}
                                                                        formats={[
                                                                            "header",
                                                                            "bold",
                                                                            "italic",
                                                                            "underline",
                                                                            "list",
                                                                            "bullet",
                                                                            "link",
                                                                            "image",
                                                                            "code-block",
                                                                        ]}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {section.lessons.length > 1 && (
                                                            <X onClick={() => deleteContent(section.id, lesson.id)} className="absolute top-1 left-2 text-red-400" />
                                                        )}
                                                    </Card>
                                                ))}

                                                <button
                                                    onClick={() => addLesson(section.id)}
                                                    className="w-full p-2 border-2 ml-6 border-dashed rounded-md text-gray-600 hover:bg-gray-50"
                                                >
                                                    + Thêm nội dung mới
                                                </button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>


                            <button
                                onClick={addSection}
                                className="w-full p-3 border-2 border-dashed border-slate-700 rounded-md text-gray-600 hover:bg-gray-50"
                            >
                                + Thêm Bài học mới
                            </button>

                            <button
                                onClick={exportToJsonLog}
                                className="w-full p-3 border-2 border-dashed border-green-700 rounded-md text-gray-600 hover:bg-gray-50"
                            >
                                Xuất dữ liệu ra log
                            </button>


                            {/* {appearData ? (
                                <Button onClick={updateContent}>Update Content</Button>
                            ) : ( */}
                            <Button onClick={handleSubmit}>Cập nhật Content</Button>
                            {/* )} */}

                        </div>
                        <Toaster />
                    </div>

                </div >
            </div >
            <Footer />
        </>

    );
};
