import  { useState } from 'react';
import toast from 'react-hot-toast';

const CourseManager = () => {
    const [sections, setSections] = useState([
        { id: 1, title: 'Phần 1', lessons: [{ id: 1, title: 'Bài 1', contents: [] }] }
    ]);

    const handleSectionTitleChange = (sectionId, newTitle) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return { ...section, title: newTitle };
            }
            return section;
        }));
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
                                        data: type === 'document' ? { text: '' } : {}
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

    const handleDocumentChange = (sectionId, lessonId, contentId, newText) => {
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
        });
    };

    return (
        <div>
            <h1>Quản lý khóa học</h1>
            {sections.map(section => (
                <div key={section.id}>
                    <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                        placeholder="Tiêu đề phần"
                    />
                    {section.lessons.map(lesson => (
                        <div key={lesson.id}>
                            <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => handleLessonTitleChange(section.id, lesson.id, e.target.value)}
                                placeholder="Tiêu đề bài học"
                            />
                            {lesson.contents.map(content => (
                                <div key={content.id}>
                                    <textarea
                                        value={content.data.text}
                                        onChange={(e) => handleDocumentChange(section.id, lesson.id, content.id, e.target.value)}
                                        placeholder="Nội dung tài liệu"
                                    />
                                </div>
                            ))}
                            <button onClick={() => addContent(section.id, lesson.id, 'document')}>Thêm nội dung</button>
                        </div>
                    ))}
                    <button onClick={() => addLesson(section.id)}>Thêm bài học</button>
                </div>
            ))}
            <button onClick={addSection}>Thêm phần</button>
        </div>
    );
};

export default CourseManager;
