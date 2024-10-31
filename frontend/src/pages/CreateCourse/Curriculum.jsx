import { useState, useEffect } from 'react';
import { Video, File, X, GripVertical, PlayCircle, FileText, ListTodo, MenuSquare } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import CryptoJS from 'crypto-js';
import { SideBarCreateCoure } from './SideBarCreateCoure';


const secretKey = '*dodoanduocmatkhau****';

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const Curriculum = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState(() => {
        const savedSections = sessionStorage.getItem('lessonSections');
        return savedSections ? decryptData(savedSections) : [{ id: 1, title: '', lessons: [{ id: 1, title: '', selectedOption: '', videoLink: '', content: '', fileName: '' }] }];
    });

    useEffect(() => {
        sessionStorage.setItem('lessonSections', encryptData(sections));
    }, [sections]);

    const handleSectionTitleChange = (sectionId, newTitle) => {
        setSections(sections.map(section => section.id === sectionId ? { ...section, title: newTitle } : section));
    };

    const addSection = () => {
        if (sections.length > 0 && !sections[sections.length - 1].title.trim()) {
            toast.error("Vui lòng nhập tiêu đề cho Bài học trước khi thêm Bài học mới.");
            return;
        }
        setSections([...sections, { id: sections.length + 1, title: '', lessons: [{ id: 1, title: '', selectedOption: '', videoLink: '', content: '', fileName: '' }] }]);
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
                return { ...section, lessons: [...section.lessons, { id: section.lessons.length + 1, title: '', selectedOption: '', videoLink: '', content: '', fileName: '' }] };
            }
            return section;
        }));
    };

    const handleLessonTitleChange = (sectionId, lessonId, newTitle) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson)
                };
            }
            return section;
        }));
    };

    const handleSelectChange = (sectionId, lessonId, value) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, selectedOption: value } : lesson)
                };
            }
            return section;
        }));
    };

    const handleVideoLinkChange = (sectionId, lessonId, value) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, videoLink: value } : lesson)
                };
            }
            return section;
        }));
    };

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
                    lessons: section.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, fileName: file.name } : lesson)
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

    const deleteSection = (sectionId) => {
        const updatedSections = sections.filter(section => section.id !== sectionId);
        const resetSections = resetIds(updatedSections);
        setSections(resetSections);
        toast.success("Đã xóa Bài học thành công!");
    };

    const deleteContent = (sectionId, lessonId) => {
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
                            <h1 className="text-xl font-medium px-10 p-4">Chương trình giảng dạy</h1>
                        </div>
                        <div className="border-b-2"></div>
                    </div>

                    
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Nội dung khóa học</h2>
                            <Accordion type="multiple" collapsible="true" className="space-y-4 relative">
                                {sections.map((section, sectionIndex) => (
                                    <AccordionItem value={`section-${section.id}`} key={section.id} className="border-2 rounded-lg border-yellow-700 p-4 relative">
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
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Button className='bg-yellow-500 hover:bg-yellow-600' onClick={() => openPageQuiz(section.id)}>Tạo quiz</Button>
                                        </div>

                                        <AccordionTrigger className="hover:no-underline border-2 rounded-lg border-yellow-600 p-5 mt-1 ml-3" />
                                        {sectionIndex > 0 && (<X onClick={() => deleteSection(section.id)} className='absolute text-red-600 cursor-pointer left-1 top-1' />)}

                                        <AccordionContent>
                                            <div className="space-y-4 mt-4">
                                                {section.lessons.map((lesson, lessonIndex) => (
                                                    <Card key={lesson.id} className="relative p-4 border border-yellow-400 ml-6">
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4 mt-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-600">Nội dung: {sectionIndex + 1}.{lessonIndex + 1}</span>
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    className="flex-1 p-2 border rounded-md"
                                                                    placeholder={`Nhập tiêu đề nội dung bài ${sectionIndex + 1}.${lessonIndex + 1}`}
                                                                    value={lesson.title}
                                                                    onChange={(e) => handleLessonTitleChange(section.id, lesson.id, e.target.value)}
                                                                />
                                                            </div>

                                                            <select onChange={(e) => handleSelectChange(section.id, lesson.id, e.target.value)} value={lesson.selectedOption} className="border p-2 rounded-md mb-4">
                                                                <option value="">Chọn loại nội dung</option>
                                                                <option value="videoUrl">Dạng video URL</option>
                                                                <option value="videoFile">Dạng video File</option>
                                                                <option value="content">Dạng nội dung</option>
                                                            </select>

                                                            {lesson.selectedOption === 'videoUrl' && (
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <PlayCircle className="text-green-500 h-5 w-5" />
                                                                        <label className="font-medium">Nhập link video:</label>
                                                                    </div>
                                                                    <Input
                                                                        className='my-3 border p-2 w-full'
                                                                        type='text'
                                                                        placeholder='Link VIDEO'
                                                                        value={lesson.videoLink}
                                                                        onChange={(e) => handleVideoLinkChange(section.id, lesson.id, e.target.value)}
                                                                    />
                                                                </div>
                                                            )}

                                                            {lesson.selectedOption === 'videoFile' && (
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Video className="text-red-500 h-5 w-5" />
                                                                        <label className="font-medium">Tải lên video:</label>
                                                                    </div>
                                                                    <Input
                                                                        className='mt-2'
                                                                        type='file'
                                                                        onChange={(e) => handleFileChange(section.id, lesson.id, e.target.files[0])}
                                                                    />
                                                                </div>
                                                            )}

                                                            {lesson.selectedOption === 'content' && (
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <FileText className="text-purple-500 h-5 w-5" />
                                                                        <label className="font-medium">Nhập nội dung:</label>
                                                                    </div>

                                                                    <ReactQuill
                                                                        className="mt-2 pb-2"
                                                                        value={lesson.content || ''} // Đảm bảo có giá trị mặc định
                                                                        onChange={(value) => handleContentChange(section.id, lesson.id, value)}
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
                                                                    <Input
                                                                        className='mt-2'
                                                                        type='file'
                                                                        onChange={(e) => handleFileChange(section.id, lesson.id, e.target.files[0])}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {lessonIndex > 0 && (
                                                            <X onClick={() => deleteContent(section.id, lesson.id)} className='absolute top-1 left-2 text-red-400' />
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
                        </div>
                        <Toaster />
                    </div>

                </div>
            </div>

        </>

    );
};
