import { useState } from 'react';
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



const LessonCreator = () => {
    const [sections, setSections] = useState([
        { id: 1, title: '', lessons: [{ id: 1, title: '', contents: [] }] }
    ]);

    const addSection = () => {
        const currentSection = sections[sections.length - 1];

        console.log('Current Section Title:', currentSection.title); // Ghi lại tiêu đề hiện tại

        
        if (!currentSection.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề bài, trước khi thêm phần mới.");
            return;
        }
        setSections([...sections, {
            id: sections.length + 1,
            title: '',
            lessons: [{ id: 1, title: '', contents: [] }]
        }]);
    };
    const addLesson = (sectionId) => {
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

    const addContent = (sectionId, lessonId, type) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson => {
                        if (lesson.id === lessonId) {
                            return {
                                ...lesson,
                                contents: [...lesson.contents, {
                                    id: lesson.contents.length + 1,
                                    type,
                                    data: ''
                                }]
                            };
                        }
                        return lesson;
                    })
                };
            }
            return section;
        }));
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

    // eslint-disable-next-line react/prop-types
    const QuizTypeSelector = ({ onChange }) => (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Chọn loại câu hỏi" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="single">Chọn một đáp án</SelectItem>
                <SelectItem value="multiple">Chọn nhiều đáp án</SelectItem>
                <SelectItem value="trueFalse">Đúng/Sai</SelectItem>
                <SelectItem value="fillBlank">Điền vào chỗ trống</SelectItem>
            </SelectContent>
        </Select>
    );

    const SingleChoiceQuiz = () => (
        <div className="space-y-4">
            <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Nhập câu hỏi..."
            />
            <div className="space-y-2">
                {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="answer"
                            className="w-4 h-4"
                        />
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-md"
                            placeholder={`Đáp án ${num}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const MultipleChoiceQuiz = () => (
        <div className="space-y-4">
            <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Nhập câu hỏi..."
            />
            <div className="space-y-2">
                {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="w-4 h-4"
                        />
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-md"
                            placeholder={`Đáp án ${num}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const TrueFalseQuiz = () => (
        <div className="space-y-4">
            <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Nhập câu hỏi..."
            />
            <div className="space-y-2">
                {['Đúng', 'Sai'].map((option) => (
                    <div key={option} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="answer"
                            className="w-4 h-4"
                        />
                        <span className="text-gray-700">{option}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const FillBlankQuiz = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm text-gray-600">Câu hỏi (sử dụng [...] để đánh dấu chỗ trống)</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Ví dụ: Thủ đô của Việt Nam là [...]"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm text-gray-600">Đáp án đúng</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Nhập đáp án..."
                />
            </div>
        </div>
    );

    const [quizTypes, setQuizTypes] = useState({});

    const handleQuizTypeChange = (contentId, type) => {
        setQuizTypes(prev => ({
            ...prev,
            [contentId]: type
        }));
    };

    // eslint-disable-next-line react/prop-types
    const ContentBlock = ({ type, contentId }) => {
        switch (type) {
            case 'video':
                return (
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
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
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <textarea
                            className="w-full p-2 border rounded-md h-24 mt-2"
                            placeholder="Nhập nội dung bài học..."
                        />
                    </div>
                );
            case 'file':
                return (
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <File className="w-8 h-8 mx-auto mb-2" />
                        <Input id="picture" type="file" className='w-1/3 mx-auto mb-2' />
                    </div>
                );
            case 'quiz':
                return (
                    <div className="border-2 border-dashed rounded-md p-6">
                        <div className="text-center mb-4">
                            <ListTodo className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Tạo câu hỏi trắc nghiệm</p>
                        </div>
                        <QuizTypeSelector
                            onChange={(type) => handleQuizTypeChange(contentId, type)}
                        />
                        {quizTypes[contentId] === 'single' && <SingleChoiceQuiz />}
                        {quizTypes[contentId] === 'multiple' && <MultipleChoiceQuiz />}
                        {quizTypes[contentId] === 'trueFalse' && <TrueFalseQuiz />}
                        {quizTypes[contentId] === 'fillBlank' && <FillBlankQuiz />}
                    </div>
                );
            default:
                return null;
        }
    };

    // ... giữ nguyên phần return của component

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Nội dung khóa học</h2>

                <Accordion type="single" collapsible className="space-y-4">
                    {sections.map((section, sectionIndex) => (
                        <AccordionItem value={`section-${section.id}`} key={section.id} className="border-2 rounded-lg border-yellow-700 p-4">
                            <AccordionTrigger className="hover:no-underline border-2 rounded-lg border-yellow-600 p-3">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="flex items-center gap-2">
                                        <MenuSquare className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-gray-600">Bài {sectionIndex + 1}:</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border rounded-md"
                                        placeholder={`Nhập tiêu đề bài ${sectionIndex + 1}`}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
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
                                                        placeholder={`Nhập nội dung bài ${sectionIndex + 1}.${lessonIndex + 1}`}
                                                    />
                                                </div>

                                                {lesson.contents.map((content) => (
                                                    <div key={content.id} className="relative">
                                                        <ContentBlock type={content.type} contentId={content.id} />
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
                                        className="w-full p-2 border-2 border-dashed rounded-md text-gray-600 hover:bg-gray-50"
                                    >
                                        + Thêm bài bài học con mới
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
            </div>
            <Toaster />
        </div>

    );
};

export default LessonCreator;
