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

export const Quizzes = ({ quiz_id }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const [lesson, setLesson] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const { slug } = useParams();

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
            const questionsRes = await axios.get(`${API_URL}/quizzes/${quizId}/questions`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-api-secret": API_KEY
                },
            });

            const questionsWithOptions = await Promise.all(
                questionsRes.data.map(async (question) => {
                    const optionsRes = await axios.get(
                        `${API_URL}/questions/${question.question_id}/options`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "x-api-secret": API_KEY
                            },
                        }
                    );
                    return { ...question, options: optionsRes.data };
                })
            );

            setQuizzes([{ quiz_id: quizId, questions: questionsWithOptions }]);
            toast.success("Hãy bắt đầu hành trình khám phá kiến thức của bạn nào! 📚");
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

        const token = localStorage.getItem("access_token");
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
                const question = quizzes[0].questions.find(
                    q => q.question_id.toString() === questionId
                );

                if (question.question_type === 'fill_blank') {
                    return {
                        question_id: parseInt(questionId),
                        text_answer: answer
                    };
                } else if (question.question_type === 'mutiple_choice') {
                    const selectedOptions = question.options.filter(opt => answer.includes(opt.answer));
                    const optionIds = selectedOptions.map(opt => opt.option_id);
                    return {
                        question_id: parseInt(questionId),
                        option_ids: optionIds
                    };
                } else if (['single_choice', 'true_false'].includes(question.question_type)) {
                    const option = question.options.find(opt => opt.answer === answer);
                    return {
                        question_id: parseInt(questionId),
                        option_id: option ? option.option_id : null
                    };
                }

                return null;
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

    const handleAnswerChange = (questionId, selectedOption, questionType) => {
        setAnswers(prev => {
            if (questionType === 'mutiple_choice') {
                const currentAnswers = prev[questionId] || [];
                if (currentAnswers.includes(selectedOption)) {
                    return {
                        ...prev,
                        [questionId]: currentAnswers.filter(ans => ans !== selectedOption)
                    };
                } else {
                    return {
                        ...prev,
                        [questionId]: [...currentAnswers, selectedOption]
                    };
                }
            } else {
                return {
                    ...prev,
                    [questionId]: selectedOption,
                };
            }
        });
    };

    const handleRetakeQuiz = () => {
        setAnswers({});
        setQuizCompleted(false);
        startQuiz();
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

    const handleStartQuiz = () => {
        startQuiz();
    };


    const [score, setScore] = useState(null);
    const fetchScore = async () => {
        try {
            const response = await axios.get(`${API_URL}/quiz/score`, {
                headers: {
                    'x-api-secret': `${API_KEY}`,
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            setScore(response.data.score);

        } catch (error) {
            console.error("Error fetching score:", error);
            toast.error("Không thể lấy điểm số!");
        }
    };

    useEffect(() => {
        fetchScore();
    }, []);



    useEffect(() => {
        if (slug) {
            fetchLesson();
        }
    }, [slug]);



    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                    <p className="text-gray-600">Đang tải bài kiểm tra...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                                                        {question.question_type === 'mutiple_choice' && (
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                (Chọn nhiều đáp án)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="grid gap-3">
                                                        {question.question_type === 'fill_blank' ? (
                                                            <input
                                                                type="text"
                                                                className="p-2 border rounded-lg"
                                                                onChange={(e) => handleAnswerChange(question.question_id, e.target.value, question.question_type)}
                                                                placeholder="Nhập câu trả lời của bạn"
                                                            />
                                                        ) : (
                                                            question.options?.map((option, optionIndex) => {
                                                                const isSelected = question.question_type === 'mutiple_choice'
                                                                    ? answers[question.question_id]?.includes(option.answer)
                                                                    : answers[question.question_id] === option.answer;

                                                                return (
                                                                    <button
                                                                        key={option.option_id}
                                                                        className={`p-2 rounded-lg text-left transition-all ${isSelected
                                                                            ? "bg-yellow-400 text-white"
                                                                            : "bg-white hover:bg-yellow-50 border border-gray-200"
                                                                            }`}
                                                                        onClick={() => handleAnswerChange(
                                                                            question.question_id,
                                                                            option.answer,
                                                                            question.question_type
                                                                        )}
                                                                    >
                                                                        <span className="flex items-center gap-3">
                                                                            <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isSelected
                                                                                ? "bg-white text-yellow-500"
                                                                                : "border-gray-300"
                                                                                }`}>
                                                                                {String.fromCharCode(65 + optionIndex)}
                                                                            </span>
                                                                            {option.answer}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })
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
                    {/* Hiển thị điểm số sau khi nộp bài */}
                    {quizCompleted && (
                        <div className="mt-6">
                            <h2 className="text-lg font-bold">Điểm số của bạn: {score !== null ? score : 'Đang tải...'}/{quizzes[0]?.questions.length}</h2>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
