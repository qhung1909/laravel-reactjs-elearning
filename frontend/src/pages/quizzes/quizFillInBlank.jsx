import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const QuizFillInBlank = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({}); // Lưu trữ đáp án cho mỗi câu hỏi
    const [error, setError] = useState(null); // Lưu trữ lỗi nếu có

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("access_token");

                // Fetch dữ liệu quiz
                const quizzesResponse = await axios.get(`${API_URL}/quizzes`, {
                    headers: { "x-api-secret": `${API_KEY}` }
                });

                console.log("Quizzes Response:", quizzesResponse.data); // Kiểm tra phản hồi từ API cho quizzes

                // Lấy câu hỏi cho từng quiz
                const questionsPromises = quizzesResponse.data.map(quiz =>
                    axios.get(`${API_URL}/quizzes/${quiz.quiz_id}/questions`, {
                        headers: { "x-api-secret": `${API_KEY}` }
                    })
                );

                const questionsResponses = await Promise.all(questionsPromises);

                // Log ra phản hồi câu hỏi
                console.log("Questions Responses:", questionsResponses);

                // Chỉ lọc các câu hỏi dạng Fill-in-the-Blank
                const fillInBlankQuestionsResponses = questionsResponses.flatMap((response) =>
                    response.data.filter(question => question.type === "fill_in_blank")
                );

                console.log("Filtered Fill-in-the-Blank Questions:", fillInBlankQuestionsResponses); // Kiểm tra câu hỏi dạng Fill-in-the-Blank

                setQuizzes(fillInBlankQuestionsResponses); // Cập nhật state với các câu hỏi dạng Fill-in-the-Blank

            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setError(error); // Lưu lỗi nếu có
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer // Lưu câu trả lời của người dùng
        }));
    };

    const handleSubmit = () => {
        console.log("Submitted Answers:", answers);
    };

    if (loading) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="flex justify-center p-6">
            <div className="max-w-3xl w-full">
                <h1 className="text-2xl font-bold mb-4">Danh sách Quiz (Fill in the Blank)</h1>
                <ul className="space-y-4">
                    {quizzes.length > 0 ? (
                        quizzes.map((question, index) => (
                            <li key={question.question_id} className="border p-4 rounded shadow-md bg-white">
                                <strong className="text-lg">
                                    {`${index + 1}. ${question.question}`}
                                </strong>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="Điền vào chỗ trống..."
                                        value={answers[question.question_id] || ""}
                                        onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                                        className="border border-gray-300 p-2 rounded w-full"
                                    />
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">
                            Không có câu hỏi điền vào chỗ trống nào. {error && <span>{error.message}</span>}
                        </li>
                    )}
                </ul>
                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
                    Nộp bài
                </button>
            </div>
        </div>
    );
};
