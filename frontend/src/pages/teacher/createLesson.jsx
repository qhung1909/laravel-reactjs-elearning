import { useEffect, useRef, useState } from 'react';
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
    const debounceTimeout = useRef();

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

    const handleDocumentChange = (sectionId, lessonId, contentId, newText) => {
        setSections(prevSections => {
            const updatedSections = prevSections.map(section => {
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
                                                data: { text: newText }
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
            console.log("Updated sections:", updatedSections);
            return updatedSections;
        });
    };




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
                                        data:
                                            type === 'video' ? { duration: '00:00', size: 0, file: null } :
                                            type === 'document' ? { text: '' } :
                                            type === 'file' ? { file: null } :
                                            type === 'quiz' ? { typequiz: '', question: '', answers: [] } : {}
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

    const [quizTypes, setQuizTypes] = useState({});

    const handleQuizTypeChange = (contentId, type) => {
        setQuizTypes(prev => ({
            ...prev,
            [contentId]: type
        }));
    };

    const SingleChoiceQuiz = ({ onChange, initialData }) => {
        const [quizData, setQuizData] = useState({
            typequiz: 'single',
            question: '',
            answers: ['', '', '', ''],
            correctAnswer: null,
        });

        useEffect(() => {
            if (initialData && Object.keys(initialData).length > 0) {
                // Kiểm tra và sử dụng các giá trị từ initialData
                setQuizData((prevData) => ({
                    ...prevData,
                    ...initialData,
                    answers: initialData.answers || ['', '', '', ''], // Đảm bảo answers luôn là một mảng
                }));
            }
        }, [initialData]);

        const handleQuestionChange = (e) => {
            const newData = {
                ...quizData,
                question: e.target.value,
            };
            setQuizData(newData);
            onChange(newData);
        };

        const handleAnswerChange = (index, e) => {
            const newAnswers = [...quizData.answers];
            newAnswers[index] = e.target.value;
            const newData = {
                ...quizData,
                answers: newAnswers,
            };
            setQuizData(newData);
            onChange(newData);
        };

        const handleCorrectAnswerChange = (index) => {
            const newData = {
                ...quizData,
                correctAnswer: index,
            };
            setQuizData(newData);
            onChange(newData);
        };

        return (
            <div className="space-y-4">
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Nhập câu hỏi..."
                    value={quizData.question}
                    onChange={handleQuestionChange}
                />
                <div className="space-y-2">
                    {quizData.answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="answer"
                                className="w-4 h-4"
                                checked={quizData.correctAnswer === index}
                                onChange={() => handleCorrectAnswerChange(index)}
                            />
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-md"
                                placeholder={`Đáp án ${index + 1}`}
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };



    const MultipleChoiceQuiz = ({ onChange, initialData }) => {
        const [quizData, setQuizData] = useState({
            typequiz: 'multiple',
            question: '',
            answers: ['', '', '', ''],
            correctAnswers: []
        });

        useEffect(() => {
            if (initialData) {
                setQuizData(initialData);
            }
        }, [initialData]);

        const handleQuestionChange = (e) => {
            const newData = {
                ...quizData,
                question: e.target.value
            };
            setQuizData(newData);
            onChange(newData);
        };

        const handleAnswerChange = (index, e) => {
            const newAnswers = [...quizData.answers];
            newAnswers[index] = e.target.value;
            const newData = {
                ...quizData,
                answers: newAnswers
            };
            setQuizData(newData);
            onChange(newData);
        };

        const handleCorrectAnswerChange = (index) => {
            const newCorrectAnswers = Array.isArray(quizData.correctAnswers) ? [...quizData.correctAnswers] : [];
            const answerIndex = newCorrectAnswers.indexOf(index);
            if (answerIndex === -1) {
                newCorrectAnswers.push(index);
            } else {
                newCorrectAnswers.splice(answerIndex, 1);
            }
            const newData = {
                ...quizData,
                correctAnswers: newCorrectAnswers
            };
            setQuizData(newData);
            onChange(newData);
        };

        return (
            <div className="space-y-4">
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Nhập câu hỏi..."
                    value={quizData.question}
                    onChange={handleQuestionChange}
                />
                <div className="space-y-2">
                    {quizData.answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={Array.isArray(quizData.correctAnswers) && quizData.correctAnswers.includes(index)}
                                onChange={() => handleCorrectAnswerChange(index)}
                            />
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-md"
                                placeholder={`Đáp án ${index + 1}`}
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    const TrueFalseQuiz = ({ onChange, initialData }) => {
        const [quizData, setQuizData] = useState({
            typequiz: 'trueFalse',
            question: '',
            correctAnswer: null
        });

        useEffect(() => {
            if (initialData) {
                setQuizData(initialData);
            }
        }, [initialData]);

        const handleQuestionChange = (e) => {
            const newData = {
                ...quizData,
                question: e.target.value
            };
            setQuizData(newData);
            onChange(newData);
        };

        const handleAnswerChange = (value) => {
            const newData = {
                ...quizData,
                correctAnswer: value
            };
            setQuizData(newData);
            onChange(newData);
        };

        return (
            <div className="space-y-4">
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Nhập câu hỏi..."
                    value={quizData.question}
                    onChange={handleQuestionChange}
                />
                <div className="space-y-2">
                    {['true', 'false'].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="answer"
                                className="w-4 h-4"
                                checked={quizData.correctAnswer === option}
                                onChange={() => handleAnswerChange(option)}
                            />
                            <span className="text-gray-700">
                                {option === 'true' ? 'Đúng' : 'Sai'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const FillBlankQuiz = ({ onChange, initialData }) => {
        const [quizData, setQuizData] = useState({
            typequiz: 'fillBlank',
            question: '',
            correctAnswer: ''
        });

        useEffect(() => {
            if (initialData) {
                setQuizData(initialData);
            }
        }, [initialData]);

        const handleQuestionChange = (e) => {
            const newData = {
                ...quizData,
                question: e.target.value
            };
            setQuizData(newData);
            onChange(newData);
        };

        const handleAnswerChange = (e) => {
            const newData = {
                ...quizData,
                correctAnswer: e.target.value
            };
            setQuizData(newData);
            onChange(newData);
        };

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm text-gray-600">
                        Câu hỏi (sử dụng [...] để đánh dấu chỗ trống)
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Ví dụ: Thủ đô của Việt Nam là [...]"
                        value={quizData.question}
                        onChange={handleQuestionChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm text-gray-600">Đáp án đúng</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập đáp án..."
                        value={quizData.correctAnswer}
                        onChange={handleAnswerChange}
                    />
                </div>
            </div>
        );
    };




    const ContentBlock = ({ type, contentId, sectionId, lessonId, initialValue, handleDocumentChange }) => {
        const [textValue, setTextValue] = useState(initialValue);
        const [quizData, setQuizData] = useState(null);

        useEffect(() => {
            setTextValue(initialValue);
        }, [initialValue]);
        const handleTextChange = (e) => {
            const newValue = e.target.value;
            setTextValue(newValue);

            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            debounceTimeout.current = setTimeout(() => {
                handleDocumentChange(sectionId, lessonId, contentId, newValue);
            }, 1500);
        };

        const handleQuizTypeChange = (contentId, type) => {
            setQuizTypes(prev => ({
                ...prev,
                [contentId]: type
            }));
            // Reset quizData khi thay đổi loại quiz
            setQuizData(null);
        };

        const handleQuizDataChange = (quizData) => {
            handleDocumentChange(sectionId, lessonId, contentId, quizData);
            setQuizData(quizData); // Cập nhật quizData
        };

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
                    <div
                        className="border-2 border-dashed shadow-green-300 shadow-md border-slate-400 rounded-md p-6 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <Textarea
                            defaultValue={initialValue}
                            onChange={handleTextChange}
                            onFocus={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full p-2 border rounded-md h-24 mt-2"
                            placeholder="Nhập nội dung bài học..."
                        />
                    </div>
                );
            case 'file':
                return (
                    <div className="border-2 border-dashed shadow-red-300 shadow-md border-slate-400 rounded-md p-6 text-center">
                        <File className="w-8 h-8 mx-auto mb-2" />
                        <Input id="picture" type="file" className='w-1/3 mx-auto mb-2' />
                    </div>
                );
            case 'quiz':
                return (
                    <div className="border-2 border-dashed shadow-indigo-800 shadow-md border-slate-400 rounded-md p-6">
                        <div className="text-center mb-4">
                            <ListTodo className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Tạo câu hỏi trắc nghiệm</p>
                        </div>
                        <QuizTypeSelector
                            onChange={(type) => handleQuizTypeChange(contentId, type)}
                        />
                        {quizTypes[contentId] === 'single' && (
                            <SingleChoiceQuiz
                                onChange={handleQuizDataChange}
                                initialData={initialValue}
                            />
                        )}
                        {quizTypes[contentId] === 'multiple' && (
                            <MultipleChoiceQuiz
                                onChange={handleQuizDataChange}
                                initialData={initialValue}
                            />
                        )}
                        {quizTypes[contentId] === 'trueFalse' && (
                            <TrueFalseQuiz
                                onChange={handleQuizDataChange}
                                initialData={initialValue}
                            />
                        )}
                        {quizTypes[contentId] === 'fillBlank' && (
                            <FillBlankQuiz
                                onChange={handleQuizDataChange}
                                initialData={initialValue}
                            />
                        )}
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
                                                        placeholder={`Nhập nội dung bài ${sectionIndex + 1}.${lessonIndex + 1}`}
                                                        value={lesson.title} // Đặt giá trị từ state
                                                        onChange={(e) => handleLessonTitleChange(section.id, lesson.id, e.target.value)} // Gọi hàm xử lý
                                                    />
                                                </div>

                                                {lesson.contents.map((content) => (
                                                    <div key={content.id} className="relative">
                                                        <ContentBlock
                                                            type={content.type}
                                                            contentId={content.id}
                                                            sectionId={section.id}
                                                            lessonId={lesson.id}
                                                            initialValue={content.data.text}
                                                            handleDocumentChange={handleDocumentChange}
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
    handleDocumentChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default LessonCreator;
