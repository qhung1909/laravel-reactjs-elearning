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
    const [lesson, setLesson] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);
    const { slug } = useParams();

    const fetchLesson = async () => {
        try {
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                },
            });
            if (res.data && res.data.lesson_id) {
                setLesson(res.data);
            } else {
                console.error("Dữ liệu không hợp lệ:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài học:", error);
        }
    };

    const fetchAllData = async () => {
        const token = localStorage.getItem("access_token");
        setLoading(true);
        try {
            const quizzesResponse = await axios.get(`${API_URL}/quizzes`, {
                headers: { "x-api-secret": `${API_KEY}` },
            });

            const questionsPromises = quizzesResponse.data.map((quiz) =>
                axios.get(`${API_URL}/quizzes/${quiz.quiz_id}/questions`, {
                    headers: { "x-api-secret": `${API_KEY}` },
                })
            );
            const startQuiz = quizzesResponse.data.map((quiz) =>
                axios.post(`${API_URL}/quizzes/start/${quiz.quiz_id}/`, {}, {
                    headers: {
                        "x-api-secret": `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                })
            );


            const questionsResponses = await Promise.all(questionsPromises, startQuiz);

            const optionsPromises = questionsResponses.flatMap(
                (response, index) =>
                    response.data.map((question) =>
                        axios
                            .get(
                                `${API_URL}/questions/${question.question_id}/options`,
                                {
                                    headers: {
                                        "x-api-secret": `${API_KEY}`,
                                    },
                                }
                            )
                            .then((res) => ({
                                question,
                                options: res.data,
                            }))
                    )
            );

            const optionsResponses = await Promise.all(optionsPromises);

            const quizzesWithQuestionsAndOptions = quizzesResponse.data.map(
                (quiz, index) => ({
                    ...quiz,
                    questions: questionsResponses[index].data.map((question) => {
                        const optionsData = optionsResponses.filter(
                            (option) =>
                                option.question.question_id ===
                                question.question_id
                        );
                        return {
                            ...question,
                            options:
                                optionsData.length > 0
                                    ? optionsData[0].options
                                    : [],
                        };
                    }),
                })
            );

            setQuizzes(quizzesWithQuestionsAndOptions);
            toast.success("Đã tải dữ liệu quiz thành công!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            toast.error(
                "Không thể tải dữ liệu quiz. Vui lòng thử lại sau!",
                {
                    duration: 3000,
                    position: "top-right",
                }
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchLesson();
        }
    }, [slug]);

    const handleStartQuiz = () => {
        Swal.fire({
            title: 'Bắt đầu bài kiểm tra?',
            text: 'Bạn sẽ có 30 phút để hoàn thành bài kiểm tra',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#EAB308',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Bắt đầu',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                setHasStarted(true);
                fetchAllData();
            }
        });
    };

    const handleSubmit = async () => {
        const totalQuestions = quizzes.reduce(
            (acc, quiz) => acc + quiz.questions.length,
            0
        );
        const answeredQuestions = Object.keys(answers).length;

        if (answeredQuestions < totalQuestions) {
            toast.error(
                `Còn ${totalQuestions - answeredQuestions} câu chưa trả lời!`,
                {
                    duration: 2000,
                    position: "top-right",
                }
            );
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

        try {
            const token = localStorage.getItem("access_token");
            console.log("API_URL:", API_URL);
            const response = await axios.post(
                `${API_URL}/quizzes/submit`,
                { answers: formattedAnswers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-secret": `${API_KEY}`,
                    },
                }
            );

            toast.success("Nộp bài thành công!", {
                duration: 2000,
                position: "top-right",
            });
            console.log("Submission Response:", response.data);
        } catch (error) {
            console.error("Error submitting answers:", error.response ? error.response.data : error.message);
            toast.error("Có lỗi xảy ra khi nộp bài!", {
                duration: 2000,
                position: "top-right",
            });
        }
    };


    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

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

    const handleConfirmExit = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn thoát?',
            text: "Dữ liệu của bạn có thể bị mất.",
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
                                    className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-2">
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
                                {quizzes.map((quiz, quizIndex) => (
                                    <div key={quiz.quiz_id} className="space-y-4">
                                        <h3 className="text-xl font-semibold">{quiz.title}</h3>
                                        {quiz.questions && quiz.questions.length > 0 ? (
                                            quiz.questions.map((question, questionIndex) => (
                                                <Card key={question.question_id} className="border-l-3 border-yellow-400">
                                                    <CardContent className="pt-6">
                                                        <p className="font-medium mb-4">
                                                            <span className="bg-yellow-100 px-2 py-1 rounded-md mr-2">Câu
                                                                {quizIndex * quiz.questions.length + questionIndex + 1}:
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
                                                                question.options && question.options.length > 0 ? (
                                                                    question.options.map((option, index) => (
                                                                        <button key={option.id}
                                                                            className={`p-2 rounded-lg text-left transition-all ${answers[question.question_id] === option.answer
                                                                                    ? "bg-yellow-400 text-white"
                                                                                    : "bg-white hover:bg-yellow-50 border border-gray-200"
                                                                                }`}
                                                                            onClick={() => handleAnswerChange(question.question_id, option.answer)}>
                                                                            <span className="flex items-center gap-3">
                                                                                <span className={`w-8 h-8 flex items-center justify-center rounded-full ${answers[question.question_id] === option.answer
                                                                                        ? "bg-white text-yellow-500"
                                                                                        : "border-gray-300"
                                                                                    }`}>
                                                                                    {String.fromCharCode(65 + index)}
                                                                                </span>
                                                                                {option.answer}
                                                                            </span>
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-gray-500">Không có tùy chọn nào.</p>
                                                                )
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Không có câu hỏi nào.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSubmit}
                            className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Nộp bài
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
