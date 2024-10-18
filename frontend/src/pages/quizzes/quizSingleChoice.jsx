import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const QuizSingleChoice = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({}); // State để lưu trữ câu trả lời

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");

                // Fetch dữ liệu quiz
                const quizzesResponse = await axios.get(`${API_URL}/quizzes`, {
                    headers: { "x-api-secret": `${API_KEY}` }
                });

                // Lấy câu hỏi cho từng quiz
                const questionsPromises = quizzesResponse.data.map(quiz =>
                    axios.get(`${API_URL}/quizzes/${quiz.quiz_id}/questions`, {
                        headers: { "x-api-secret": `${API_KEY}` }
                    })
                );

                const questionsResponses = await Promise.all(questionsPromises);

                // Lấy tùy chọn cho từng câu hỏi
                const optionsPromises = questionsResponses.flatMap((response, index) =>
                    response.data.map(question =>
                        axios.get(`${API_URL}/questions/${question.question_id}/options`, {
                            headers: { "x-api-secret": `${API_KEY}` }
                        }).then(res => ({
                            question,
                            options: res.data
                        }))
                    )
                );

                const optionsResponses = await Promise.all(optionsPromises);

                // Kết hợp thông tin câu hỏi và tùy chọn vào quiz
                const quizzesWithQuestionsAndOptions = quizzesResponse.data.map((quiz, index) => ({
                    ...quiz,
                    questions: questionsResponses[index].data.map((question) => {
                        const optionsData = optionsResponses.filter(option => option.question.question_id === question.question_id);
                        return {
                            ...question,
                            options: optionsData.length > 0 ? optionsData[0].options : [] // Thêm tùy chọn cho câu hỏi
                        };
                    })
                }));

                setQuizzes(quizzesWithQuestionsAndOptions); // Cập nhật state với quiz, câu hỏi và tùy chọn

            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setLoading(false); // Dừng trạng thái loading dù thành công hay lỗi
            }
        };

        fetchAllData();
    }, []); // Chỉ chạy một lần khi component mount

    const handleSubmit = () => {
        // Xử lý nộp bài ở đây (gửi câu trả lời lên server hoặc xử lý tùy ý)
        console.log("Submitted Answers:", answers);
    };

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption, // Lưu trữ câu trả lời cho từng câu hỏi
        }));
    };

    if (loading) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="flex justify-center p-6">
            <div className="max-w-3xl w-full">
                <h1 className="text-2xl font-bold mb-4">Danh sách Quiz</h1>
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li key={quiz.quiz_id} className="border p-4 rounded shadow-md bg-white">
                            <strong className="text-lg">{quiz.title}</strong>
                            <span className="text-gray-500">
                                (Course ID: {quiz.course_id}, Lesson ID: {quiz.lesson_id})
                            </span>
                            <ul className="mt-2 space-y-4"> {/* Thay đổi space-y-2 thành space-y-4 để tạo khoảng cách giữa các câu hỏi */}
                                {quiz.questions && quiz.questions.length > 0 ? (
                                    quiz.questions.map((question, questionIndex) => (
                                        <li key={question.question_id} className="border-l-4 border-yellow-500 bg-gray-50 p-2 rounded mb-2"> {/* Thêm mb-2 để tạo khoảng cách giữa các câu hỏi */}
                                            <span className="font-medium ml-3">{`${questionIndex + 1}. ${question.question}`}</span>
                                            <ul className="mt-2 space-y-1">
                                                {question.options && question.options.length > 0 ? (
                                                    question.options.map((option, index) => (
                                                        <li
                                                            key={option.id}
                                                            className={`bg-gray-100 rounded p-2 flex items-center cursor-pointer ${answers[question.question_id] === option.answer ? 'bg-yellow-200' : ''}`}
                                                            onClick={() => handleAnswerChange(question.question_id, option.answer)}
                                                        >
                                                            <span className="flex-1">
                                                                {String.fromCharCode(65 + index)}. {option.answer}
                                                            </span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500">Không có tùy chọn nào.</li>
                                                )}
                                            </ul>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">Không có câu hỏi nào.</li>
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">
                    Nộp bài
                </button>
            </div>
        </div>
    );






};
