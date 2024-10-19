import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const QuizTrueFalse = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({}); // Lưu trữ đáp án cho mỗi câu hỏi

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

                // Chỉ lọc các câu hỏi dạng True/False
                const trueFalseQuestionsResponses = questionsResponses.flatMap((response) =>
                    response.data.filter(question => question.type === "true_false")
                );

                setQuizzes(trueFalseQuestionsResponses); // Cập nhật state với các câu hỏi dạng True/False

            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer // Chỉ cho phép một đáp án (True hoặc False)
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
                <h1 className="text-2xl font-bold mb-4">Danh sách Quiz (True/False)</h1>
                <ul className="space-y-4">
                    {quizzes.length > 0 ? (
                        quizzes.map((question, index) => (
                            <li key={question.question_id} className="border p-4 rounded shadow-md bg-white">
                                <strong className="text-lg">
                                    {`${index + 1}. ${question.question}`}
                                </strong>
                                <div className="mt-2 space-y-1">
                                    <label className="block">
                                        <input
                                            type="radio"
                                            name={`question-${question.question_id}`}
                                            value="True"
                                            checked={answers[question.question_id] === "True"}
                                            onChange={() => handleAnswerChange(question.question_id, "True")}
                                        />
                                        <span className="ml-2">True</span>
                                    </label>
                                    <label className="block">
                                        <input
                                            type="radio"
                                            name={`question-${question.question_id}`}
                                            value="False"
                                            checked={answers[question.question_id] === "False"}
                                            onChange={() => handleAnswerChange(question.question_id, "False")}
                                        />
                                        <span className="ml-2">False</span>
                                    </label>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">Không có câu hỏi True/False nào.</li>
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
