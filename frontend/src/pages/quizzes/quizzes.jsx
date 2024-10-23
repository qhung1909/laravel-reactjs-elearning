import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';
import { ArrowLeft, Trophy, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const [lesson, setLesson] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const { slug, quiz_id } = useParams();

    const fetchLesson = async () => {
        try {
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: { "x-api-secret": API_KEY },
            });
            if (res.data?.lesson_id) {
                setLesson(res.data);
            }
        } catch (error) {
            console.error("Error fetching lesson:", error);
            toast.error("Không thể tải thông tin bài học");
        }
    };

    const fetchQuestions = async (quizId) => {
        const token = localStorage.getItem("access_token");
        try {
            const quizzesResponse = await axios.get(`${API_URL}/quizzes/${quiz_id}`, {
                headers: { "x-api-secret": `${API_KEY}` },
            });

            const quizData = quizzesResponse.data;

            const questionsResponse = await axios.get(`${API_URL}/quizzes/${quizData.quiz_id}/questions`, {
                headers: { "x-api-secret": `${API_KEY}` },
            });

            await axios.post(`${API_URL}/quizzes/start/${quizData.quiz_id}/`, {}, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            const optionsPromises = questionsResponse.data.map((question) =>
                axios.get(`${API_URL}/questions/${question.question_id}/options`, {
                    headers: { "x-api-secret": `${API_KEY}` },
                }).then((res) => ({
                    question,
                    options: res.data,
                }))
            );

            const optionsResponses = await Promise.all(optionsPromises);

            const quizWithQuestionsAndOptions = {
                ...quizData,
                questions: questionsResponse.data.map((question) => {
                    const optionsData = optionsResponses.find(
                        (option) => option.question.question_id === question.question_id
                    );
                    return { ...question, options: optionsRes.data };
                })
            );

            setQuizzes([{ quiz_id: quizId, questions: questionsWithOptions }]);
            toast.success("Đã tải dữ liệu quiz thành công");
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Không thể tải dữ liệu câu hỏi");
        }
    };

    const startQuiz = async () => {
        if (quizCompleted) {
            toast.error("Quiz này đã hoàn thành!");
            return;
        }

        const token = localStorage.getItem("access_token");
        try {
            await axios.post(
                `${API_URL}/quizzes/start/${quiz_id}`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                    },
                }
            );
            setHasStarted(true);
            fetchQuestions(quiz_id);
        } catch (error) {
            console.error("Error starting quiz:", error);
            toast.error("Không thể bắt đầu quiz");
        }
    };

    const handleSubmit = async () => {
        const totalQuestions = quizzes[0]?.questions.length || 0;
        const answeredQuestions = Object.keys(answers).length;

        if (answeredQuestions < totalQuestions) {
            toast.error(`Còn ${totalQuestions - answeredQuestions} câu chưa trả lời!`);
            return;
        }

        const formattedAnswers = Object.keys(answers).map((questionId) => {
            const question = quizzes
                .flatMap((quiz) => quiz.questions)
                .find((q) => q.question_id === parseInt(questionId));

            const selectedOption = question.options.find(
                (option) => option.answer === answers[questionId]
            );

            return {
                question_id: questionId,
                option_id: selectedOption ? selectedOption.option_id : null,
            };
        });

            await axios.post(
                `${API_URL}/quizzes/submit`,
                { answers: formattedAnswers },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "x-api-secret": API_KEY,
                    },
                }
            );

            setQuizCompleted(true);
            toast.success("Nộp bài thành công!");
        } catch (error) {
            console.error("Error submitting answers:", error);
            toast.error("Có lỗi xảy ra khi nộp bài!");
        }
    };

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

    const handleConfirmExit = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn thoát?',
            text: "Dữ liệu của bạn sẽ mất tất cả?.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, thoát ngay!',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/lessons/${slug}`;
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <Link to={`/lessons/${slug}`} className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2" onClick={(e) => {
                    e.preventDefault();
                    handleConfirmExit();
                }}>
                    <ArrowLeft className="w-5 h-5" />
                    Trở về bài học
                </Link>
            </div>

            <Toaster position="top-right" />

            {!hasStarted ? (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">Bài tập</CardTitle>
                        <CardDescription>
                            Hãy chuẩn bị sẵn sàng trước khi bắt đầu làm bài
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <button
                                    onClick={handleStartQuiz}
                                    className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <Trophy className="w-5 h-5" />
                                    Bắt đầu làm bài
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bài kiểm tra đang diễn ra</CardTitle>
                            <CardDescription>
                                Hoàn thành tất cả câu hỏi bên dưới
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {quizzes.map((quiz) => (
                                    <div key={quiz.quiz_id} className="space-y-4">
                                        {quiz.questions?.map((question, index) => (
                                            <Card key={question.question_id} className="border-l-3 border-yellow-400">
                                                <CardContent className="pt-6">
                                                    <p className="font-medium mb-4">
                                                        <span className="bg-yellow-100 px-2 py-1 rounded-md mr-2">
                                                            Câu {index + 1}:
                                                        </span>
                                                        {question.question}
                                                    </p>
                                                    <div className="grid gap-3">
                                                        {question.question_type === 'fill_blank' ? (
                                                            <input
                                                                type="text"
                                                                className="p-2 border rounded-lg"
                                                                onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                                                                placeholder="Nhập câu trả lời của bạn"
                                                            />
                                                        ) : (
                                                            question.options?.map((option, optionIndex) => (
                                                                <button
                                                                    key={option.option_id}
                                                                    className={`p-2 rounded-lg text-left transition-all ${
                                                                        answers[question.question_id] === option.answer
                                                                            ? "bg-yellow-400 text-white"
                                                                            : "bg-white hover:bg-yellow-50 border border-gray-200"
                                                                    }`}
                                                                    onClick={() => handleAnswerChange(question.question_id, option.answer)}
                                                                >
                                                                    <span className="flex items-center gap-3">
                                                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                                                            answers[question.question_id] === option.answer
                                                                                ? "bg-white text-yellow-500"
                                                                                : "border-gray-300"
                                                                        }`}>
                                                                            {String.fromCharCode(65 + optionIndex)}
                                                                        </span>
                                                                        {option.answer}
                                                                    </span>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSubmit}
                            className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-2"
                            disabled={quizCompleted}
                        >
                            <Trophy className="w-5 h-5" />
                            Nộp bài
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quizzes;

export default Quizzes;
