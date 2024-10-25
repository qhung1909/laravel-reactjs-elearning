import { useCallback, useEffect, useRef, useState } from 'react';
useRef
import { Video, File, X, GripVertical, PlayCircle, FileText, ListTodo, MenuSquare } from 'lucide-react';
import {
    Card
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Textarea } from '@/components/ui/textarea';

const LessonCreator = () => {
    // const debounceTimeout = useRef();


    const [sections, setSections] = useState([
        { id: 1, title: '', lessons: [{ id: 1, title: '', contents: [] }] }
    ]);

    const handleSectionTitleChange = (sectionId, newTitle) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return { ...section, title: newTitle };
            }
            return section;
        }));
    };

    const exportToJsonLog = () => {
        console.log(JSON.stringify(sections, null, 2));
        toast.success("Đã xuất dữ liệu ra log!");
    };

    const addSection = () => {
        const currentSection = sections[sections.length - 1];
        if (!currentSection.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề phần trước khi thêm phần mới.");
            return;
        }

        setSections([...sections, {
            id: sections.length + 1,
            title: '',
            lessons: [{ id: 1, title: '', contents: [] }]
        }]);
    };

    const addLesson = (sectionId) => {
        const section = sections.find(section => section.id === sectionId);
        const currentLesson = section.lessons[section.lessons.length - 1];

        if (!currentLesson.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề nội dung trước khi thêm nội dung mới.");
            return;
        }

        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: [...section.lessons, {
                        id: section.lessons.length + 1,
                        title: '',
                        contents: []
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
                    lessons: section.lessons.map(lesson => {
                        if (lesson.id === lessonId) {
                            return { ...lesson, title: newTitle };
                        }
                        return lesson;
                    })
                };
            }
            return section;
        }));
    };

    const handleContentChange = useCallback((sectionId, lessonId, contentId, newData) => {

        setSections(prevSections => {
            return prevSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map(lesson => {
                            if (lesson.id === lessonId) {
                                return {
                                    ...lesson,
                                    contents: lesson.contents.map(content => {
                                        if (content.id === contentId) {
                                            return {
                                                ...content,
                                                data: newData // Cập nhật dữ liệu đúng
                                            };
                                        }
                                        return content;
                                    })
                                };
                            }
                            return lesson;
                        })
                    };
                }
                return section;
            });
        });
    }, []);





    const addContent = (sectionId, lessonId, type) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson => {
                        if (lesson.id === lessonId) {
                            const newContentId = lesson.contents.length > 0
                                ? Math.max(...lesson.contents.map(content => content.id)) + 1
                                : 1; // Nếu không có nội dung nào thì bắt đầu từ 1

                            return {
                                ...lesson,
                                contents: [
                                    ...lesson.contents,
                                    {
                                        id: newContentId,
                                        type,
                                        data: getDefaultContentData(type)
                                    }
                                ]
                            };
                        }
                        return lesson;
                    })
                };
            }
            return section;
        }));
    };

    const getDefaultContentData = (type) => {
        switch (type) {
            case 'video':
                return { duration: '00:00', size: 0, file: null };
            case 'document':
                return { text: '' };
            case 'file':
                return { file: null };
            case 'quiz':
                return {
                    typequiz: '',
                    question: '',
                    answers: ['', '', '', ''],
                    correctAnswer: null,
                };
            default:
                return {};
        }
    };


    const deleteContent = (sectionId, lessonId, contentId) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson => {
                        if (lesson.id === lessonId) {
                            return {
                                ...lesson,
                                contents: lesson.contents.filter(content => content.id !== contentId)
                            };
                        }
                        return lesson;
                    })
                };
            }
            return section;
        }));
    };







    const ContentBlock = ({ type, contentId, sectionId, lessonId, initialValue, handleContentChange }) => {
        const [content, setContent] = useState(initialValue || getDefaultContentData(type));
        const textAreaRef = useRef(null);

        const previousContent = useRef(content); // Theo dõi giá trị trước đó

        console.log('Initial Value:', initialValue);
        console.log({ type, contentId, sectionId, lessonId, handleContentChange });

        useEffect(() => {
            setContent(initialValue || getDefaultContentData(type)); // Cập nhật nội dung khi initialValue thay đổi
        }, [initialValue, type]);

        useEffect(() => {
            if (JSON.stringify(previousContent.current) !== JSON.stringify(content)) {
                handleContentChange(sectionId, lessonId, contentId, content);
                previousContent.current = content; // Cập nhật giá trị trước đó
            }
        }, [content, sectionId, lessonId, contentId, handleContentChange]);



        switch (type) {
            case 'video':
                return (
                    <div className="border-2 border-dashed shadow-blue-300 shadow-md border-slate-400 rounded-md p-6 text-center">
                        <Video className="w-8 h-8 mx-auto mb-2" />
                        <Input id="picture" type="file" className='w-1/3 mx-auto mb-2' />
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                            <span>Thời lượng: 00:00</span>
                            <span>Dung lượng: 0 MB</span>
                        </div>
                    </div>
                );
            case 'document':
                return (
                    <div className="border-2 border-dashed shadow-green-300 shadow-md border-slate-400 rounded-md p-6 text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <Textarea
                            ref={textAreaRef}
                            value={content.text || ''} // Sử dụng giá trị từ content
                            onChange={(e) => setContent(prev => ({ ...prev, text: e.target.value }))}
                            className="w-full p-2 border rounded-md h-24 mt-2"
                            placeholder="Nhập nội dung bài học..."
                        />
                    </div>
                );
            case 'file':
                return (
                    <div className="border-2 border-dashed shadow-red-300 shadow-md border-slate-400 rounded-md p-6 text-center">
                        <File className="w-8 h-8 mx-auto mb-2" />
                        <Input id="fileUpload" type="file" className='w-1/3 mx-auto mb-2' />
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Nội dung khóa học</h2>

                <Accordion type="multiple" collapsible className="space-y-4">
                    {sections.map((section, sectionIndex) => (
                        <AccordionItem value={`section-${section.id}`} key={section.id} className="border-2 rounded-lg border-yellow-700 p-4 relative">
                            <div className="flex items-center gap-4 w-9/12 md:w-10/12 absolute ml-12 mt-2">
                                <div className="flex items-center gap-2">
                                    <MenuSquare className="w-4 h-4 text-gray-400 text-3xl" />
                                    <span className="font-medium text-gray-600">Bài {sectionIndex + 1}:</span>
                                </div>
                                <input
                                    type="text"
                                    className="flex-1 p-2 border rounded-md "
                                    placeholder={`Nhập tiêu đề bài ${sectionIndex + 1}`}
                                    onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <AccordionTrigger className="hover:no-underline border-2 rounded-lg border-yellow-600 p-5">

                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="space-y-4 mt-4 ">
                                    {section.lessons.map((lesson, lessonIndex) => (
                                        <Card key={lesson.id} className="p-4 border border-yellow-400 ml-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-600">Nội dung: {sectionIndex + 1}.{lessonIndex + 1}</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="flex-1 p-2 border rounded-md"
                                                        placeholder={`Nhập tiêu đề nội dung bài ${sectionIndex + 1}.${lessonIndex + 1}`}
                                                        value={lesson.title} // Đặt giá trị từ state
                                                        onChange={(e) => handleLessonTitleChange(section.id, lesson.id, e.target.value)} // Gọi hàm xử lý
                                                    />
                                                    <input type='file' placeholder='hellooo' />
                                                </div>

                                                {lesson.contents.map((content) => (
                                                    <div key={content.id} className="relative">
                                                        <ContentBlock
                                                            type={content.type}
                                                            contentId={content.id}
                                                            sectionId={section.id}
                                                            lessonId={lesson.id}
                                                            initialValue={content.data}
                                                            handleContentChange={handleContentChange}
                                                        />
                                                        <button
                                                            onClick={() => deleteContent(section.id, lesson.id, content.id)}
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                <div className="grid grid-cols-4 gap-4">
                                                    <button
                                                        onClick={() => addContent(section.id, lesson.id, 'video')}
                                                        className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center gap-2"
                                                    >
                                                        <PlayCircle className="w-6 h-6 text-blue-500" />
                                                        <span className="text-sm">Thêm video</span>
                                                    </button>
                                                    <button
                                                        onClick={() => addContent(section.id, lesson.id, 'document')}
                                                        className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center gap-2"
                                                    >
                                                        <FileText className="w-6 h-6 text-green-500" />
                                                        <span className="text-sm">Thêm nội dung</span>
                                                    </button>
                                                    <button
                                                        onClick={() => addContent(section.id, lesson.id, 'file')}
                                                        className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center gap-2"
                                                    >
                                                        <File className="w-6 h-6 text-orange-500" />
                                                        <span className="text-sm">Thêm tài liệu</span>
                                                    </button>
                                                    <button
                                                        onClick={() => addContent(section.id, lesson.id, 'quiz')}
                                                        className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center gap-2"
                                                    >
                                                        <ListTodo className="w-6 h-6 text-purple-500" />
                                                        <span className="text-sm">Thêm quiz</span>
                                                    </button>
                                                </div>
                                            </div>
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

    );
};
LessonCreator.propTypes = {
    initialData: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    contentId: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    lessonId: PropTypes.string.isRequired,
    initialValue: PropTypes.string,
    handleContentChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default LessonCreator;
