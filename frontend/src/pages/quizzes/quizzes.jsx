import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Award, BrainCog, CheckSquare, Loader2, PenSquare, RefreshCw, Star, Trophy } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export const Quizzes = ({ quiz_id, contentId, onComplete, onClose }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const [lesson, setLesson] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [userResults, setUserResults] = useState({});
    const [quizResults, setQuizResults] = useState(null);
    const [countdown, setCountdown] = useState(30);
    const [showCountdown, setShowCountdown] = useState(false);
    //clear countdown khi reset quiz
    const [countdownTimer, setCountdownTimer] = useState(null);
    const { slug } = useParams();
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    useEffect(() => {
        let timer;
        if (showCountdown && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [countdown, showCountdown]);

    const fetchLesson = async () => {
        try {
            const res = await axios.get(`${API_URL}/lessons/${slug}`, {
                headers: { "x-api-secret": API_KEY },
            });
            if (res.data?.lesson_id) {
                setLesson(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải bài học:", error);
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
            toast.success("Hãy bắt đầu hành trình khám phá kiến thức của bạn nào! 📚", {
                style: {
                    padding: '15px'
                }
            });
        } catch (error) {
            console.error("Lỗi khi tải câu hỏi:", error);
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
            console.error("Lỗi khi bắt đầu quiz:", error);
            toast.error("Không thể bắt đầu quiz");
        }
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("Chưa có token");
                return;
            }

            const res = await axios.get(`${API_URL}/progress`, {
                headers: {
                    "x-api-secret": `${API_KEY}`,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data) {
                // Sau khi fetch xong progress mới, gọi onComplete
                await onComplete();
            }
        } catch (error) {
            console.error("Lỗi khi gọi API tiến độ:", error);
        }
    };
    const handleSubmit = async () => {
        setIsSubmitting(true);
        const totalQuestions = quizzes[0]?.questions.length || 0;
        // Kiểm tra câu trả lời trống
        const emptyAnswers = quizzes[0]?.questions.filter(question => {
            const answer = answers[question.question_id];
            if (!answer) return true;
            if (Array.isArray(answer) && answer.length === 0) return true;
            if (typeof answer === 'string' && answer.trim() === '') return true;
            return false;
        });
        if (emptyAnswers && emptyAnswers.length > 0) {
            setIsSubmitting(false);
            toast.error(`Vui lòng trả lời câu ${emptyAnswers.map(q =>
                quizzes[0].questions.findIndex(question =>
                    question.question_id === q.question_id
                ) + 1
            ).join(', ')}`);
            return;
        }
        // Kiểm tra số lượng câu trả lời
        const answeredQuestions = Object.keys(answers).length;
        if (answeredQuestions < totalQuestions) {
            setIsSubmitting(false);
            toast.error(`Còn ${totalQuestions - answeredQuestions} câu chưa trả lời!`);
            return;
        }
        const token = localStorage.getItem("access_token");
        const numberOfQuestions = quizzes[0]?.questions.length || 0; //đếm số lượng câu hỏi để countdown
        try {
            // 1. Submit answers
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

            // 2. Get score and results
            const scoreResponse = await axios.get(`${API_URL}/quiz/score`, {
                headers: {
                    'x-api-secret': API_KEY,
                    Authorization: `Bearer ${token}`,
                },
            });

            // Lưu kết quả từ API
            setScore(scoreResponse.data.score);
            setQuizResults(scoreResponse.data.results);

            // Xử lý kết quả từ API để tạo maps
            const correctAnswersMap = {};
            const resultsMap = {};

            scoreResponse.data.results.forEach(result => {
                if (result.question_type === 'fill_blank') {
                    correctAnswersMap[result.question_id] = result.correct_answer;
                } else {
                    correctAnswersMap[result.question_id] = result.correct_answers;
                }

                // Kiểm tra đáp án đúng/sai cho từng câu
                const userAnswer = answers[result.question_id];
                if (result.question_type === 'fill_blank') {
                    resultsMap[result.question_id] = userAnswer === result.correct_answer;
                } else if (result.question_type === 'mutiple_choice') {
                    resultsMap[result.question_id] =
                        userAnswer?.length === result.correct_answers.length &&
                        userAnswer.every(ans => result.correct_answers.includes(ans));
                } else {
                    resultsMap[result.question_id] = userAnswer === result.correct_answers[0];
                }
            });
            setCorrectAnswers(correctAnswersMap);
            setUserResults(resultsMap);
            setQuizCompleted(true);
            //Countdown đóng quiz
            let timeoutDuration;
            if (numberOfQuestions <= 4) {
                timeoutDuration = 30000; // 30s cho 4 câu trở xuống
            } else if (numberOfQuestions <= 8) {
                timeoutDuration = 45000; // 45s cho 5-8 câu
            } else {
                timeoutDuration = 60000; // 1 phút cho trên 8 câu
            }
            setShowCountdown(true);
            setCountdown(timeoutDuration / 1000);
            toast.success(`Quiz sẽ tự động đóng sau ${timeoutDuration / 1000} giây để bạn xem lại kết quả`, {
                duration: 5000,
            });
            const timer = setTimeout(async () => {
                await fetchProgress();
                toast.success("Đã lưu kết quả của bạn");
            }, timeoutDuration);
            setCountdownTimer(timer);
        } catch (error) {
            console.error("Lỗi khi nộp bài:", error);
            toast.error("Có lỗi xảy ra khi nộp bài!");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleResetQuiz = () => {
        // Clear countdown timer nếu tồn tại
        if (countdownTimer) {
            clearTimeout(countdownTimer);
            setCountdownTimer(null);
        }

        // Reset countdown UI
        setShowCountdown(false);
        setCountdown(0);

        // Reset các state khác
        setScore(null);
        setAnswers({});
        setQuizCompleted(false);
        setCorrectAnswers({});
        setUserResults({});
        setHasStarted(false);

        toast.success("Quiz đã được tải lại!");
    };

    const handleAnswerChange = (questionId, selectedOption, questionType) => {
        if (quizCompleted) return;

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

    const getAnswerStyle = (question, option) => {
        if (!quizCompleted) {
            const isSelected = question.question_type === 'mutiple_choice'
                ? answers[question.question_id]?.includes(option.answer)
                : answers[question.question_id] === option.answer;
            return isSelected ? "bg-yellow-400 text-white" : "bg-white hover:bg-yellow-50 border border-gray-200";
        }

        const isCorrect = option.is_correct;
        const isSelected = question.question_type === 'mutiple_choice'
            ? answers[question.question_id]?.includes(option.answer)
            : answers[question.question_id] === option.answer;

        if (isSelected) {
            return isCorrect
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600";
        }
        if (isCorrect) {
            return "bg-green-500 text-white hover:bg-green-600";
        }
        return "bg-white hover:bg-gray-50 border border-gray-200";
    };

    const getAnswerText = (question, option) => {
        if (!quizCompleted) return option.answer;

        const isCorrect = option.is_correct;
        const isSelected = question.question_type === 'mutiple_choice'
            ? answers[question.question_id]?.includes(option.answer)
            : answers[question.question_id] === option.answer;

        let text = option.answer;
        if (isSelected) {
            text += isCorrect ? ' ✓' : ' ✗';
        } else if (isCorrect) {
            text += ' (Đáp án đúng)';
        }
        return text;
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
            console.error("Lỗi khi tải điểm số:", error);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchLesson();
        }
    }, [slug]);

    useEffect(() => {
        fetchScore();
    }, []);

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
        <div className="container mx-auto px-4 py-1 max-w-4xl">
            {!hasStarted ? (
                <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <PenSquare className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text font-bold">
                            Trắc nghiệm
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Kiểm tra kiến thức của bạn với bài trắc nghiệm này
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button
                                            onClick={startQuiz}
                                            className="group relative bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-xl"
                                        >
                                            <span className="flex items-center gap-3">
                                                <BrainCog className="w-5 h-5 transition-transform group-hover:rotate-12" />
                                                Bắt đầu làm bài
                                            </span>
                                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200"></div>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl mx-auto py-6 px-4">
                                        <div className="space-y-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-center md:text-start">
                                                        {quizCompleted ? "Kết quả bài kiểm tra" : "Bài kiểm tra đang diễn ra"}
                                                    </CardTitle>
                                                    <CardDescription className="text-center md:text-start">
                                                        {quizCompleted ? "Xem lại đáp án đúng sai bên dưới" : "Hoàn thành tất cả câu hỏi bên dưới"}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent>
                                                    <div className="space-y-6">
                                                        {quizzes.map((quiz) => (
                                                            <div key={quiz.quiz_id} className="space-y-4">
                                                                {quiz.questions?.map((question, index) => (
                                                                    <Card key={question.question_id}
                                                                        className={`border-l-4 ${quizCompleted
                                                                            ? userResults[question.question_id]
                                                                                ? 'border-green-500'
                                                                                : 'border-red-500'
                                                                            : 'border-yellow-400'
                                                                            }`}
                                                                    >
                                                                        <CardContent className="pt-6">
                                                                            <div className="flex justify-between items-start mb-4">
                                                                                <p className="font-medium">
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
                                                                                {quizCompleted && (
                                                                                    <span className={`px-3 py-1 rounded-full text-sm ${userResults[question.question_id]
                                                                                        ? 'bg-green-100 text-green-800'
                                                                                        : 'bg-red-100 text-red-800'
                                                                                        }`}>
                                                                                        {userResults[question.question_id] ? 'Đúng' : 'Sai'}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="grid gap-3">
                                                                                {question.question_type === 'fill_blank' ? (
                                                                                    <div>
                                                                                        <input
                                                                                            type="text"
                                                                                            className={`p-2 border rounded-lg w-full ${quizCompleted
                                                                                                ? userResults[question.question_id]
                                                                                                    ? 'border-green-500 bg-green-50'
                                                                                                    : 'border-red-500 bg-red-50'
                                                                                                : ''
                                                                                                }`}
                                                                                            value={answers[question.question_id] || ''}
                                                                                            onChange={(e) => handleAnswerChange(
                                                                                                question.question_id,
                                                                                                e.target.value,
                                                                                                question.question_type
                                                                                            )}
                                                                                            placeholder="Nhập câu trả lời của bạn"
                                                                                            disabled={quizCompleted}
                                                                                        />
                                                                                        {quizCompleted && (
                                                                                            <div className="mt-2 text-sm">
                                                                                                <p className="text-gray-600">
                                                                                                    Câu trả lời của bạn: <span className="font-medium">
                                                                                                        {answers[question.question_id] || 'Chưa trả lời'}
                                                                                                    </span>
                                                                                                </p>
                                                                                                <p className="text-green-600 font-medium mt-1">
                                                                                                    Đáp án đúng: {
                                                                                                        // Tìm kết quả tương ứng với câu hỏi
                                                                                                        quizResults?.find(result =>
                                                                                                            result.question_id === question.question_id
                                                                                                        )?.correct_answer
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    question.options?.map((option, optionIndex) => {
                                                                                        const isSelected = question.question_type === 'mutiple_choice'
                                                                                            ? answers[question.question_id]?.includes(option.answer)
                                                                                            : answers[question.question_id] === option.answer;

                                                                                        return (
                                                                                            <button
                                                                                                key={option.option_id}
                                                                                                className={`p-2 rounded-lg text-left transition-all flex items-center justify-between ${quizCompleted
                                                                                                    ? isSelected
                                                                                                        ? option.is_correct
                                                                                                            ? 'bg-green-500 text-white'
                                                                                                            : 'bg-red-500 text-white'
                                                                                                        : option.is_correct
                                                                                                            ? 'bg-green-100 text-green-800'
                                                                                                            : 'bg-white text-gray-800 border border-gray-200'
                                                                                                    : isSelected
                                                                                                        ? 'bg-yellow-400 text-black'
                                                                                                        : 'bg-white hover:bg-yellow-50 border border-gray-200'
                                                                                                    }`}
                                                                                                onClick={() => handleAnswerChange(
                                                                                                    question.question_id,
                                                                                                    option.answer,
                                                                                                    question.question_type
                                                                                                )}
                                                                                                disabled={quizCompleted}
                                                                                            >
                                                                                                <span className="flex items-center gap-3">
                                                                                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full
                                                                                    ${quizCompleted
                                                                                                            ? "bg-white/80 text-current"
                                                                                                            : "bg-white border border-gray-300"
                                                                                                        }`}
                                                                                                    >
                                                                                                        {String.fromCharCode(65 + optionIndex)}
                                                                                                    </span>
                                                                                                    <span>{option.answer}</span>
                                                                                                </span>
                                                                                                {quizCompleted && (
                                                                                                    <span className="flex items-center">
                                                                                                        {isSelected && option.is_correct && (
                                                                                                            <span className="text-white">✓ Đúng</span>
                                                                                                        )}
                                                                                                        {isSelected && !option.is_correct && (
                                                                                                            <span className="text-white">✗ Sai</span>
                                                                                                        )}
                                                                                                        {!isSelected && option.is_correct && (
                                                                                                            <span className="text-green-800">(Đáp án đúng)</span>
                                                                                                        )}
                                                                                                    </span>
                                                                                                )}
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
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <p className="text-sm text-gray-500 italic">
                                    Hãy đọc kỹ câu hỏi trước khi trả lời
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center md:text-start">
                                {quizCompleted ? "Kết quả bài kiểm tra" : "Bài kiểm tra đang diễn ra"}
                            </CardTitle>
                            <CardDescription className="text-center md:text-start">
                                {quizCompleted ? "Xem lại đáp án đúng sai bên dưới" : "Hoàn thành tất cả câu hỏi bên dưới"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {quizzes.map((quiz) => (
                                    <div key={quiz.quiz_id} className="space-y-4">
                                        {quiz.questions?.map((question, index) => (
                                            <Card key={question.question_id}
                                                className={`border-l-4 ${quizCompleted
                                                    ? userResults[question.question_id]
                                                        ? 'border-green-500'
                                                        : 'border-red-500'
                                                    : 'border-yellow-400'
                                                    }`}
                                            >
                                                <CardContent className="pt-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <p className="font-medium">
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
                                                        {quizCompleted && (
                                                            <span className={`px-3 py-1 rounded-full text-sm ${userResults[question.question_id]
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {userResults[question.question_id] ? 'Đúng' : 'Sai'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid gap-3">
                                                        {question.question_type === 'fill_blank' ? (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    className={`p-2 border rounded-lg w-full ${quizCompleted
                                                                        ? userResults[question.question_id]
                                                                            ? 'border-green-500 bg-green-50'
                                                                            : 'border-red-500 bg-red-50'
                                                                        : ''
                                                                        }`}
                                                                    value={answers[question.question_id] || ''}
                                                                    onChange={(e) => handleAnswerChange(
                                                                        question.question_id,
                                                                        e.target.value,
                                                                        question.question_type
                                                                    )}
                                                                    placeholder="Nhập câu trả lời của bạn"
                                                                    disabled={quizCompleted}
                                                                />
                                                                {quizCompleted && (
                                                                    <div className="mt-2 text-sm">
                                                                        <p className="text-gray-600">
                                                                            Câu trả lời của bạn: <span className="font-medium">
                                                                                {answers[question.question_id] || 'Chưa trả lời'}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-green-600 font-medium mt-1">
                                                                            Đáp án đúng: {
                                                                                // Tìm kết quả tương ứng với câu hỏi
                                                                                quizResults?.find(result =>
                                                                                    result.question_id === question.question_id
                                                                                )?.correct_answer
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            question.options?.map((option, optionIndex) => {
                                                                const isSelected = question.question_type === 'mutiple_choice'
                                                                    ? answers[question.question_id]?.includes(option.answer)
                                                                    : answers[question.question_id] === option.answer;

                                                                return (
                                                                    <button
                                                                        key={option.option_id}
                                                                        className={`p-2 rounded-lg text-left transition-all flex items-center justify-between ${quizCompleted
                                                                            ? isSelected
                                                                                ? option.is_correct
                                                                                    ? 'bg-green-500 text-white'
                                                                                    : 'bg-red-500 text-white'
                                                                                : option.is_correct
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : 'bg-white text-gray-800 border border-gray-200'
                                                                            : isSelected
                                                                                ? 'bg-yellow-400 text-black'
                                                                                : 'bg-white hover:bg-yellow-50 border border-gray-200'
                                                                            }`}
                                                                        onClick={() => handleAnswerChange(
                                                                            question.question_id,
                                                                            option.answer,
                                                                            question.question_type
                                                                        )}
                                                                        disabled={quizCompleted}
                                                                    >
                                                                        <span className="flex items-center gap-3">
                                                                            <span className={`w-8 h-8 flex items-center justify-center rounded-full
                                                                                ${quizCompleted
                                                                                    ? "bg-white/80 text-current"
                                                                                    : "bg-white border border-gray-300"
                                                                                }`}
                                                                            >
                                                                                {String.fromCharCode(65 + optionIndex)}
                                                                            </span>
                                                                            <span>{option.answer}</span>
                                                                        </span>
                                                                        {quizCompleted && (
                                                                            <span className="flex items-center">
                                                                                {isSelected && option.is_correct && (
                                                                                    <span className="text-white">✓ Đúng</span>
                                                                                )}
                                                                                {isSelected && !option.is_correct && (
                                                                                    <span className="text-white">✗ Sai</span>
                                                                                )}
                                                                                {!isSelected && option.is_correct && (
                                                                                    <span className="text-green-800">(Đáp án đúng)</span>
                                                                                )}
                                                                            </span>
                                                                        )}
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
                    <div className="flex flex-col items-center mt-8">
                        {quizCompleted && score !== null && (
                            <div className="flex justify-center mt-8 mb-4">
                                <div className="relative bg-white/50 backdrop-blur-lg shadow-lg rounded-2xl px-8 py-6 w-full max-w-lg">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-full shadow-md">
                                            <Award className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-extrabold text-gray-800 text-center mt-6">Điểm số của bạn</h2>
                                    <div className="flex items-center justify-center mt-4">
                                        <span className="text-4xl font-bold text-yellow-500">
                                            {score}/{quizzes[0]?.questions.length}
                                        </span>
                                    </div>
                                </div>
                            </div>



                        )}

                        <div className="flex justify-center">
                            {quizCompleted ? (
                                <button
                                    onClick={handleResetQuiz}
                                    className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Làm lại Quiz
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`bg-gradient-to-tr from-amber-400 to-yellow-200  text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang nộp bài...
                                        </>
                                    ) : (
                                        <>
                                            <CheckSquare className="w-5 h-5" />
                                            Nộp bài
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showCountdown && (
                <div className="fixed bottom-6 right-6">
                    <div className="bg-white/95 backdrop-blur shadow-2xl rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <svg className="w-12 h-12 transform -rotate-90">
                                    <circle
                                        className="text-gray-200"
                                        strokeWidth="3"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="22"
                                        cx="24"
                                        cy="24"
                                    />
                                    <circle
                                        className="text-blue-500"
                                        strokeWidth="3"
                                        strokeDasharray={22 * 2 * Math.PI}
                                        strokeDashoffset={22 * 2 * Math.PI * (1 - countdown / 60)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="22"
                                        cx="24"
                                        cy="24"
                                    />
                                </svg>
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                                    {formatTime(countdown)}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-base font-semibold text-gray-800">
                                    Tự động đóng sau
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};
export default Quizzes;



