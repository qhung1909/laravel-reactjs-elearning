import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const QuizMultipleChoice = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const maxSelections = 3;

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const quizzesResponse = await axios.get(`${API_URL}/quizzes`, {
                    headers: { "x-api-secret": `${API_KEY}` }
                });

                const questionsPromises = quizzesResponse.data.map(quiz =>
                    axios.get(`${API_URL}/quizzes/${quiz.quiz_id}/questions`, {
                        headers: { "x-api-secret": `${API_KEY}` }
                    })
                );

                const questionsResponses = await Promise.all(questionsPromises);

                const optionsPromises = questionsResponses.flatMap((response) =>
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

                const quizzesWithQuestionsAndOptions = quizzesResponse.data.map((quiz, index) => ({
                    ...quiz,
                    questions: questionsResponses[index].data.map((question) => {
                        const optionsData = optionsResponses.filter(option => option.question.question_id === question.question_id);
                        return {
                            ...question,
                            options: optionsData.length > 0 ? optionsData[0].options : []
                        };
                    })
                }));

                setQuizzes(quizzesWithQuestionsAndOptions);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                toast.error("Không thể tải dữ liệu quiz. Vui lòng thử lại sau!", {
                    duration: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prev => {
            const currentSelections = prev[questionId] || [];

            if (currentSelections.includes(selectedOption)) {
                return {
                    ...prev,
                    [questionId]: currentSelections.filter(option => option !== selectedOption)
                };
            }

            if (currentSelections.length < maxSelections) {
                return {
                    ...prev,
                    [questionId]: [...currentSelections, selectedOption]
                };
            }

            toast.error(`Chỉ được chọn tối đa ${maxSelections} đáp án!`, {
                duration: 2000,
                position: 'top-right',
                style: {
                    backgroundColor: '#FF4B4B',
                    color: 'white',
                }
            });
            return prev;
        });
    };

    const handleSubmit = () => {
        const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
        const answeredQuestions = Object.keys(answers).length;

        if (answeredQuestions < totalQuestions) {
            toast.error(`Còn ${totalQuestions - answeredQuestions} câu chưa trả lời!`, {
                duration: 2000,
                position: 'top-right',
                style: {
                    backgroundColor: '#FF4B4B',
                    color: 'white',
                }
            });
            return;
        }

        console.log("Submitted Answers:", answers);
        toast.success("Nộp bài thành công!", {
            duration: 2000,
            position: 'top-right',
            style: {
                backgroundColor: '#48BB78',
                color: 'white',
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-6">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                }}
            />
            <div className="max-w-3xl w-full">
                <h1 className="text-2xl font-bold mb-4">Danh sách Quiz (Multiple Choice)</h1>
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li key={quiz.quiz_id} className="border p-4 rounded shadow-md bg-white">
                            <strong className="text-lg">{quiz.title}</strong>
                            <ul className="mt-2 space-y-4">
                                {quiz.questions && quiz.questions.length > 0 ? (
                                    quiz.questions.map((question, questionIndex) => (
                                        <li key={question.question_id} className="border-l-4 border-blue-500 bg-gray-50 p-2 rounded mb-2">
                                            <span className="font-medium ml-3">{`${questionIndex + 1}. ${question.question}`}</span>
                                            <ul className="mt-2 space-y-2">
                                                {question.options && question.options.length > 0 ? (
                                                    question.options.map((option, index) => (
                                                        <li
                                                            key={option.id}
                                                            onClick={() => handleAnswerChange(question.question_id, option.answer)}
                                                            className={`
                                                                p-3 rounded-lg cursor-pointer
                                                                transition-colors duration-200
                                                                ${answers[question.question_id]?.includes(option.answer)
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-white hover:bg-gray-100 border border-gray-200'}
                                                            `}
                                                        >
                                                            {String.fromCharCode(65 + index)}. {option.answer}
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
                    className="mt-4 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg
                             hover:bg-blue-600 transition-colors duration-200">
                    Nộp bài
                </button>
            </div>
        </div>
    );
};
