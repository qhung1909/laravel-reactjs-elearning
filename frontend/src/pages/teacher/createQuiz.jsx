import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Import các component cần thiết
import { Input } from '@/components/ui/input';
const CreateQuiz = () => {
    const [questions, setQuestions] = useState([]);

    const addQuestion = () => {
        setQuestions([...questions, { type: '', question: '', options: ['', ''], answers: [] }]);
    };

    const handleTypeChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].type = value;
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.push('');
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (index, value) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[index].type === 'multiplechoice') {
            if (updatedQuestions[index].answers.includes(value)) {
                updatedQuestions[index].answers = updatedQuestions[index].answers.filter(answer => answer !== value);
            } else {
                updatedQuestions[index].answers.push(value);
            }
        } else {
            updatedQuestions[index].answers = [value]; // Chỉ có một đáp án cho single choice
        }
        setQuestions(updatedQuestions);
    };

    const handleSubmit = () => {
        console.log(questions);
        // Gửi dữ liệu lên server hoặc xử lý tiếp
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-xl font-semibold">Tạo Quiz</h2>
            {questions.map((q, index) => (
                <div key={index} className="mb-4 border p-4 rounded">
                    <select
                        value={q.type}
                        onChange={(e) => handleTypeChange(index, e.target.value)}
                        className="mb-2 border p-2"
                    >
                        <option value="">Chọn loại câu hỏi</option>
                        <option value="singlechoice">Single Choice</option>
                        <option value="multiplechoice">Multiple Choice</option>
                        <option value="truefalse">True/False</option>
                        <option value="fillblank">Fill in the Blank</option>
                    </select>

                    {q.type && (
                        <>
                            <Input
                                type="text"
                                placeholder="Nhập câu hỏi"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                className="mb-2 border p-2 w-full"
                            />

                            {q.type === 'singlechoice' ? (
                                <>
                                    {q.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center mb-2">
                                            <input
                                                type="radio"
                                                name={`question_${index}`} // Đảm bảo radio buttons thuộc cùng nhóm
                                                checked={q.answers[0] === option}
                                                onChange={() => handleAnswerChange(index, option)}
                                                className="mr-2"
                                            />
                                            <Input
                                                type="text"
                                                placeholder={`Option ${optIndex + 1}`}
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                                className="border p-2 w-full"
                                            />
                                        </div>
                                    ))}
                                    <Button onClick={() => addOption(index)}>Thêm tùy chọn</Button>

                                </>
                            ) : q.type === 'multiplechoice' ? (
                                <>
                                    {q.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                checked={q.answers.includes(option)}
                                                onChange={() => handleAnswerChange(index, option)}
                                                className="mr-2"
                                            />
                                            <Input
                                                type="text"
                                                placeholder={`Option ${optIndex + 1}`}
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                                className="border p-2 w-full"
                                            />
                                        </div>
                                    ))}
                                    <Button onClick={() => addOption(index)}>Thêm tùy chọn</Button>
                                </>
                            ) : q.type === 'truefalse' ? (
                                <select
                                    value={q.answers[0] || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="mb-2 border p-2"
                                >
                                    <option value="">Chọn đáp án</option>
                                    <option value="true">Đúng</option>
                                    <option value="false">Sai</option>
                                </select>
                            ) : q.type === 'fillblank' ? (
                                <Input
                                    type="text"
                                    placeholder="Nhập đáp án"
                                    value={q.answers[0] || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="mb-2 border p-2 w-full"
                                />
                            ) : null}
                        </>
                    )}
                </div>
            ))}

            <Button onClick={addQuestion}>Thêm câu hỏi</Button>
            <Button onClick={handleSubmit} className="ml-2 mt-4">Lưu Quiz</Button>
        </div>
    );
};


export default CreateQuiz;
