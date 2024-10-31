import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import  { useState } from 'react';

const CreateQuiz = () => {
    const [questions, setQuestions] = useState([]);

    const addQuestion = () => {
        setQuestions([...questions, { type: '', question: '', options: ['', ''], answer: '' }]);
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleTypeChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].type = value;
        updatedQuestions[index].options = value === 'singlechoice' || value === 'multiplechoice' ? ['', ''] : [];
        updatedQuestions[index].answer = '';
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = value;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = () => {
        console.log(JSON.stringify(questions, null, 2));
        // Xử lý lưu dữ liệu ở đây
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

                    <Input
                        type="text"
                        placeholder="Nhập câu hỏi"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="mb-2 border p-2 w-full"
                    />

                    {q.type === 'singlechoice' || q.type === 'multiplechoice' ? (
                        <>
                            {q.options.map((option, optIndex) => (
                                <Input
                                    key={optIndex}
                                    type="text"
                                    placeholder={`Option ${optIndex + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                    className="mb-2 border p-2 w-full"
                                />
                            ))}
                            <Button onClick={() => addOption(index)}>Thêm tùy chọn</Button>
                        </>
                    ) : q.type === 'truefalse' ? (
                        <div>
                            <select
                                value={q.answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                className="mb-2 border p-2"
                            >
                                <option value="">Chọn đáp án</option>
                                <option value="true">Đúng</option>
                                <option value="false">Sai</option>
                            </select>
                        </div>
                    ) : q.type === 'fillblank' ? (
                        <Input
                            type="text"
                            placeholder="Nhập đáp án"
                            value={q.answer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="mb-2 border p-2 w-full"
                        />
                    ) : null}
                </div>
            ))}

            <Button onClick={addQuestion}>Thêm câu hỏi</Button>
            <Button onClick={handleSubmit} className="mt-4">Lưu Quiz</Button>
        </div>
    );
};

export default CreateQuiz;
