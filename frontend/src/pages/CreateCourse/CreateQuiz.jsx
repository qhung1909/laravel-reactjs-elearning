/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Type, Trash2 } from 'lucide-react';
import { BookOpen, Plus, ArrowLeft, Save } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SkeletonQuizCreator } from "../skeletonEffect/skeleton";
import toast, { Toaster } from "react-hot-toast";

const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                padding: '16px'
            }
        });
    } else {
        toast.error(message, {
            style: {
                padding: '16px'
            }
        })
    }
}
export const CreateQuiz = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('access_token');

    const location = useLocation();
    const lessonId = new URLSearchParams(location.search).get('lesson');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { course_id, quiz_id } = useParams();
    const navigate = useNavigate();
    const [isUpdated, setIsUpdated] = useState(false);

    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [focusedAnswers, setFocusedAnswers] = useState({});


    const handleNavigate = (path) => {
        // console.log("isUpdated:", isUpdated); // Kiểm tra giá trị của isUpdated
        if (location.pathname === path) {
            return;
        }
        if (!isUpdated) {
            notify("Vui lòng Cập nhật trước khi chuyển trang!");
            return; // Ngăn không cho chuyển route
        }
        navigate(path);
    };
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!isUpdated) {
                event.preventDefault();
                event.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isUpdated]);


    useEffect(() => {
        showQuizQuestions();
    }, []);

    const showQuizQuestions = async () => {
        // setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/quizzes/${quiz_id}/questions`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                const fetchedQuestions = response.data;

                if (!Array.isArray(fetchedQuestions)) {
                    console.error("Dữ liệu trả về không phải là một mảng:", fetchedQuestions);
                    setQuestions([]);
                    return;
                }

                const updatedQuestions = await Promise.all(fetchedQuestions.map(async (q) => {
                    try {
                        const optionsResponse = await axios.get(`${API_URL}/questions/${q.question_id}/options`, {
                            headers: {
                                'x-api-secret': API_KEY,
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });

                        let optionsData = optionsResponse.data || [];

                        if (q.question_type === "single_choice" || q.question_type === "mutiple_choice") {
                            const defaultOptionsCount = 4;
                            const currentOptionsCount = optionsData.length;

                            if (currentOptionsCount < defaultOptionsCount) {
                                const additionalOptions = Array(defaultOptionsCount - currentOptionsCount).fill().map(() => ({
                                    id: null,
                                    answer: "",
                                    is_correct: false
                                }));
                                optionsData = [...optionsData, ...additionalOptions];
                            }
                        }

                        // Xử lý đáp án
                        let answers;
                        if (q.question_type === 'fill_blank') {
                            answers = optionsData.length > 0 ? [optionsData[0].answer] : [""];
                        } else {
                            answers = optionsData
                                .filter(option => option.is_correct === 1)
                                .map(option => optionsData.indexOf(option));
                        }

                        return {
                            id: q.question_id,
                            question: q.question || "",
                            type: q.question_type || "",
                            options: optionsData.map(option => ({
                                id: option.option_id,
                                answer: option.answer,
                                isCorrect: option.is_correct === 1
                            })),
                            answers
                        };
                    } catch (error) {
                        console.error(`Không thể tải tùy chọn cho câu hỏi ${q.question_id}:`, error);
                        return {
                            id: q.question_id,
                            question: q.question || "",
                            type: q.question_type || "",
                            options: [],
                            answers: [""]
                        };
                    }
                }));

                setQuestions(updatedQuestions);
            }
        } catch (error) {
            console.error("Không thể tải câu hỏi:", error);
            // Swal.fire({
            //     toast: true,
            //     position: 'top-end',
            //     icon: 'error',
            //     title: 'Không thể tải câu hỏi',
            //     showConfirmButton: false,
            //     timer: 1500
            // });
        } finally {
            setLoading(false);
            setIsUpdated(true);
        }
    };


    // console.log('====================================');
    // console.log(isUpdated);
    // console.log('====================================');


    const addQuizQuestion = async (type) => {
        // if (!isUpdated) {
        //     const { isConfirmed } = await Swal.fire({
        //         title: "Cảnh báo",
        //         text: "Bạn có thay đổi chưa được lưu. Bạn có muốn tiếp tục mà không lưu không?",
        //         icon: "warning",
        //         showCancelButton: true,
        //         confirmButtonText: "Tiếp tục",
        //         cancelButtonText: "Hủy",
        //     });

        //     if (!isConfirmed) {
        //         return; // Hủy thêm quiz mới nếu người dùng chọn "Hủy"
        //     }
        // }
        try {
            const requestData = {
                questions: [
                    {
                        question: "",
                        question_type: type,
                    }
                ]
            };

            const response = await axios.post(
                `${API_URL}/quizzes/${quiz_id}/questions`,
                requestData,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                const newQuestionId = response.data[0].question_id;
                let newQuestion = {
                    id: newQuestionId,
                    question: "",
                    type: type,
                    options: [],
                    answers: []


                };

                // Khởi tạo `options` cho `single_choice` và `mutiple_choice`
                if (type === "single_choice" || type === "mutiple_choice") {
                    newQuestion.options = [
                        { id: null, answer: "", isCorrect: false },
                        { id: null, answer: "", isCorrect: false },
                        { id: null, answer: "", isCorrect: false },
                        { id: null, answer: "", isCorrect: false }
                    ];
                } else if (type === "true_false") {
                    newQuestion.options = [
                        { id: null, answer: "true", isCorrect: false },
                        { id: null, answer: "false", isCorrect: false }
                    ];
                } else if (type === "fill_blank") {
                    newQuestion.options = [];
                    newQuestion.answers = [""];
                }

                // Cập nhật danh sách `questions` mà không làm mất dữ liệu của các câu hỏi trước
                setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Đã thêm câu hỏi mới',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            // Swal.fire({
            //     toast: true,
            //     position: 'top-end',
            //     icon: 'error',
            //     title: 'Không thể thêm câu hỏi',
            //     showConfirmButton: false,
            //     timer: 1500
            // });
            console.error(error);
        }
        // finally {
        //     await showQuizQuestions(true);
        // }
    };


    useEffect(() => {
        const fetchStatusCourse = async () => {
            try {
                const res = await axios.get(`${API_URL}/teacher/courses/${course_id}`, {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                if (res.data.data.status === 'revision_requested' || res.data.data.status === 'draft') {
                    // Cho phép truy cập vào trang hiện tại
                } else {
                    notify(`Quiz của khóa học "${res.data.data.title}" không ở trạng thái nháp. Không có quyền truy cập !`)
                    navigate('/instructor/lesson');
                }

            } catch (error) {
                console.error(error);

            }
        }
        fetchStatusCourse();
    }, [API_KEY, API_URL, course_id, navigate])



    const update = async () => {
        // Kiểm tra nếu chưa có câu hỏi nào
        if (questions.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Vui lòng tạo ít nhất 1 câu hỏi.',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Array để chứa các lỗi
        let errors = [];

        // Kiểm tra từng câu hỏi
        questions.forEach((q, index) => {
            // Kiểm tra nội dung câu hỏi
            if (!q.question || !q.question.trim()) {
                errors.push(`Câu hỏi ${index + 1}: Vui lòng nhập nội dung câu hỏi`);
                return;
            }

            // Kiểm tra theo từng loại câu hỏi
            switch (q.type) {
                case 'single_choice':
                case 'mutiple_choice':
                    // Kiểm tra các lựa chọn
                    { const emptyOptions = q.options.filter(opt => !opt.answer || !opt.answer.trim());
                    if (emptyOptions.length > 0) {
                        errors.push(`Câu hỏi ${index + 1}: Vui lòng nhập đầy đủ nội dung cho tất cả các lựa chọn`);
                    }

                    // Kiểm tra đáp án được chọn
                    if (q.type === 'single_choice' && (!q.answers || q.answers.length === 0)) {
                        errors.push(`Câu hỏi ${index + 1}: Vui lòng chọn một đáp án đúng`);
                    } else if (q.type === 'mutiple_choice' && (!q.answers || q.answers.length === 0)) {
                        errors.push(`Câu hỏi ${index + 1}: Vui lòng chọn ít nhất một đáp án đúng`);
                    }
                    break; }

                case 'true_false':
                    // Kiểm tra xem đã chọn Đúng hoặc Sai chưa
                    if (!q.answers || q.answers.length === 0) {
                        errors.push(`Câu hỏi ${index + 1}: Vui lòng chọn Đúng hoặc Sai`);
                    }
                    break;

                case 'fill_blank':
                    // Kiểm tra đáp án điền vào chỗ trống
                    if (!q.answers || !q.answers[0] || !q.answers[0].trim()) {
                        errors.push(`Câu hỏi ${index + 1}: Vui lòng nhập đáp án cho câu hỏi điền vào chỗ trống`);
                    }
                    break;

                default:
                    errors.push(`Câu hỏi ${index + 1}: Loại câu hỏi không hợp lệ`);
            }
        });

        // Nếu có lỗi, hiển thị thông báo và dừng việc cập nhật
        if (errors.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng kiểm tra lại',
                html: errors.join('<br>'),
                confirmButtonText: 'OK',
            });
            return;
        }
        const loadingToast = toast.loading('Đang xử lý...');

        try {

            // Chuẩn bị dữ liệu để cập nhật tất cả các câu hỏi
            const requestData = questions.map(q => {
                const questionData = {
                    id: q.id,
                    question: q.question,
                    question_type: q.type,
                };

                // Thêm `options` cho `single_choice` và `mutiple_choice`
                if (q.type === 'single_choice' || q.type === 'mutiple_choice') {
                    questionData.options = q.options.map(option => ({
                        id: option.id,
                        answer: option.answer,
                        is_correct: option.isCorrect
                    }));
                }
                return questionData;
            });

            // Gửi yêu cầu API để cập nhật nhiều câu hỏi

            setLoadingUpdate(true);
            const response = await axios.put(
                `${API_URL}/quizzes/${quiz_id}/questions`,
                { questions: requestData },
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Swal.fire({
                //     toast: true,
                //     position: 'top-end',
                //     icon: 'success',
                //     title: 'Cập nhật câu hỏi thành công',
                //     showConfirmButton: false,
                //     timer: 1500,
                // });

                // Gửi yêu cầu cập nhật hoặc tạo mới đáp án cho từng câu hỏi
                await Promise.all(questions.map(async (q) => {
                    let hasExistingOptions = false;
                    try {
                        const response = await axios.get(`${API_URL}/questions/${q.id}/options`, {
                            headers: {
                                'x-api-secret': API_KEY,
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        hasExistingOptions = Array.isArray(response.data) && response.data.length > 0;
                    } catch (error) {
                        console.error(`Không thể kiểm tra đáp án cho câu hỏi ${q.id}:`, error);
                    }

                    let optionsData;

                    if (q.type === 'single_choice' || q.type === 'mutiple_choice') {
                        if (q.options && q.options.length > 0) {
                            const putOptions = q.options.filter(option => option.id);
                            const postOptions = q.options.filter(option => !option.id);

                            if (putOptions.length > 0) {
                                optionsData = {
                                    options: putOptions.map(option => ({
                                        id: option.id,
                                        answer: option.answer,
                                        is_correct: q.answers.includes(q.options.indexOf(option))
                                    }))
                                };
                            }
                            if (postOptions.length > 0) {
                                optionsData = {
                                    options: postOptions.map(option => ({
                                        answer: option.answer,
                                        is_correct: q.answers.includes(q.options.indexOf(option))
                                    }))
                                };
                            }
                        }
                    } else if (q.type === 'true_false') {
                        // Tìm các tùy chọn hiện tại hoặc khởi tạo nếu không tồn tại
                        const trueOption = q.options.find(option => option.answer === "true") || { id: null, is_correct: false };
                        const falseOption = q.options.find(option => option.answer === "false") || { id: null, is_correct: false };

                        // Nếu không có câu trả lời nào được chọn, mặc định chọn "true"
                        if (!q.answers || !Array.isArray(q.answers) || q.answers.length === 0) {
                            q.answers = ["true"];
                        }

                        // Xử lý trường hợp thêm mới và giữ trạng thái khi cập nhật
                        optionsData = {
                            options: [
                                {
                                    id: trueOption.id, // Dùng id hiện tại hoặc null nếu thêm mới
                                    answer: "true",
                                    is_correct: trueOption.id ? (q.answers[0] === "true" ? true : trueOption.is_correct) : q.answers[0] === "true"
                                },
                                {
                                    id: falseOption.id, // Dùng id hiện tại hoặc null nếu thêm mới
                                    answer: "false",
                                    is_correct: falseOption.id ? (q.answers[0] === "false" ? true : falseOption.is_correct) : q.answers[0] === "false"
                                }
                            ]
                        };
                    }
                    else if (q.type === 'fill_blank') {
                        const blankOption = q.options[0] || {};

                        if (!q.answers || !Array.isArray(q.answers) || q.answers.length === 0) {
                            q.answers = [blankOption.answer || ""];
                        }

                        optionsData = {
                            options: [
                                {
                                    id: blankOption.id || null,
                                    answer: q.answers[0],
                                    is_correct: true
                                }
                            ]
                        };
                    }

                    if (optionsData) {
                        if (!hasExistingOptions) {
                            await axios.post(`${API_URL}/questions/${q.id}/options`, optionsData, {
                                headers: {
                                    'x-api-secret': API_KEY,
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                        } else {
                            await axios.put(`${API_URL}/questions/${q.id}/options`, optionsData, {
                                headers: {
                                    'x-api-secret': API_KEY,
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                        }
                    }
                }));

                // Swal.fire({
                //     toast: true,
                //     position: 'top-end',
                //     icon: 'success',
                //     title: 'Cập nhật đáp án thành công',
                //     showConfirmButton: false,
                //     timer: 1500,
                // });
                notify('Quiz đã được cập nhật thành công', 'success');

            }
        } catch (error) {
            console.error("Không thể cập nhật câu hỏi:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Không thể cập nhật câu hỏi hoặc đáp án',
                showConfirmButton: false,
                timer: 1500,
            });
        } finally {
            toast.dismiss(loadingToast);

            setLoadingUpdate(false);
            await showQuizQuestions(true);
            setIsUpdated(true);
        }
    };



    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
        setIsUpdated(false);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        // Ensure the options array exists
        if (!updatedQuestions[qIndex].options) {
            updatedQuestions[qIndex].options = [];
        }
        // Update the specific option
        updatedQuestions[qIndex].options[optIndex] = {
            ...updatedQuestions[qIndex].options[optIndex], // Keep the existing object
            answer: value // Update the answer field
        };
        setQuestions(updatedQuestions);
        setIsUpdated(false);
    };

    const handleAnswerChange = (questionIndex, selectedAnswer) => {
        const updatedQuestions = [...questions];
        const question = updatedQuestions[questionIndex];

        // Kiểm tra loại câu hỏi để xử lý phù hợp
        if (question.type === 'mutiple_choice') {
            if (question.answers.includes(selectedAnswer)) {
                question.answers = question.answers.filter(ans => ans !== selectedAnswer);
            } else {
                question.answers.push(selectedAnswer);
            }
        } else if (question.type === 'single_choice' || question.type === 'true_false') {
            question.answers = [selectedAnswer]; // Chỉ lưu một đáp án
        } else if (question.type === 'fill_blank') {
            question.answers = [selectedAnswer]; // Cập nhật giá trị của đáp án
        }

        // Cập nhật lại giá trị `isCorrect` cho các lựa chọn trong câu hỏi True/False
        if (question.type === 'true_false') {
            question.options = question.options.map(option => ({
                ...option,
                isCorrect: option.answer === selectedAnswer
            }));
        }

        setFocusedAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedAnswer
        }));

        // Cập nhật lại state với danh sách câu hỏi đã thay đổi
        setQuestions(updatedQuestions);
    };






    const deleteQuestion = async (index, question_id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa quiz này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return; // Dừng lại nếu người dùng không xác nhận
        }

        try {
            // Thêm headers để xác thực yêu cầu
            const res = await axios.delete(`${API_URL}/quizzes/${quiz_id}/questions/${question_id}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Hiển thị thông báo thành công
            if (res.status === 200) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Xóa câu hỏi thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa câu hỏi:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Không thể xóa câu hỏi',
                showConfirmButton: false,
                timer: 1500
            });
            return; // Kết thúc nếu có lỗi
        }

        // Cập nhật lại state sau khi xóa
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };


    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            {loadingUpdate && (
                <div className='loading'>
                </div>
            )}
            {
                loading ? (
                    <>
                        <SkeletonQuizCreator />
                    </>
                ) : (
                    <>
                        <div className="max-w-4xl mx-auto p-6 space-y-6">
                            {/* Header */}
                            <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm shadow-sm z-50 p-4">
                                <div className="max-w-4xl mx-auto flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="text-gray-600" size={24} />
                                        <h2 className="text-2xl font-semibold text-gray-700">
                                            Tạo Quiz cho Lesson {lessonId || '...'}
                                        </h2>
                                    </div>
                                    <div className="flex space-x-3">

                                        {loadingUpdate ? (
                                            <>
                                                <Button
                                                    disabled
                                                    className="bg-gray-500 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                                                    style={{ cursor: 'not-allowed' }}
                                                >
                                                    <Save size={18} />
                                                    <span>Lưu Quiz</span>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={update}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                                                >
                                                    <Save size={18} />
                                                    <span>Lưu Quiz</span>
                                                </Button>
                                            </>
                                        )}


                                        <Button
                                            onClick={() => handleNavigate(`/course/manage/${course_id}/curriculum`)}
                                            variant="outline"
                                            className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                                        >
                                            <ArrowLeft size={18} />
                                            <span>Quay lại</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="pt-20 space-y-6">
                                {questions?.length > 0 ? (
                                    questions.map((q, questionIndex) => (
                                        <Card key={questionIndex} className="p-8 relative shadow-sm hover:shadow transition-shadow border-l-4 border-l-yellow-700">
                                            <div className="absolute top-4 right-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-gray-400 hover:text-red-400 hover:bg-gray-50 transition-colors"
                                                    onClick={() => deleteQuestion(questionIndex, q.id)}
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 mb-6">
                                                    <span className="text-base font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                        Câu hỏi {questionIndex + 1}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-900 bg-yellow-400 px-2 py-1 rounded-full">
                                                        {q.type === 'single_choice' ? 'Một Lựa Chọn' :
                                                            q.type === 'mutiple_choice' ? 'Nhiều Lựa Chọn' :
                                                                q.type === 'true_false' ? 'Đúng/Sai' :
                                                                    'Điền Vào Ô Trống'}
                                                    </span>
                                                </div>

                                                <div className="relative">
                                                    <Type className="absolute top-3 left-3 text-gray-400" size={20} />
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập câu hỏi của bạn"
                                                        value={q.question}
                                                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                                        className="pl-10 py-3 focus:ring-gray-400 focus:border-gray-400 text-base"
                                                    />
                                                </div>

                                                {/* Answer Options */}
                                                {(q.type === 'single_choice' || q.type === 'mutiple_choice') && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {q.options.map((option, optionIndex) => (
                                                            <div
                                                                key={optionIndex}
                                                                className={`flex items-center gap-3 p-4 border rounded-md transition-all duration-200 cursor-pointer
                                                        ${q.type === 'single_choice'
                                                                        ? q.answers[0] === optionIndex
                                                                            ? 'bg-gray-100 border-gray-300 shadow-sm'
                                                                            : 'bg-white hover:bg-gray-50'
                                                                        : q.answers.includes(optionIndex)
                                                                            ? 'bg-gray-100 border-gray-300 shadow-sm'
                                                                            : 'bg-white hover:bg-gray-50'
                                                                    }`}
                                                                onClick={() => handleAnswerChange(questionIndex, optionIndex)}
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    {q.type === 'single_choice' ? (
                                                                        <Circle
                                                                            size={20}
                                                                            className={`${q.answers[0] === optionIndex ? 'text-yellow-700 fill-yellow-600' : 'text-gray-400'}`}
                                                                        />
                                                                    ) : (
                                                                        <CheckCircle2
                                                                            size={20}
                                                                            className={`${q.answers.includes(optionIndex) ? 'text-yellow-600' : 'text-gray-400'}`}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    placeholder={`Tùy chọn ${optionIndex + 1}`}
                                                                    value={option.answer || ""}
                                                                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                                                    className="flex-1 border-0 bg-transparent focus:ring-0 placeholder-gray-400"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {q.type === 'true_false' ? (
                                                    <div className="flex gap-4">
                                                        <Button
                                                            type="button"
                                                            className={`flex-1 ${q.options.find(option => option.answer === 'true' && option.isCorrect)
                                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                                : 'bg-gray-200 hover:bg-green-500'
                                                                } ${focusedAnswers[questionIndex] === 'true'
                                                                    ? 'shadow-lg transform scale-105 bg-green-600' // Thêm hiệu ứng shadow và scale khi focus
                                                                    : ''
                                                                }`}
                                                            onClick={() => handleAnswerChange(questionIndex, 'true')}
                                                        >
                                                            Đúng
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            className={`flex-1 ${q.options.find(option => option.answer === 'false' && option.isCorrect)
                                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                                : 'bg-gray-200 hover:bg-red-500'
                                                                } ${focusedAnswers[questionIndex] === 'false'
                                                                    ? 'shadow-lg transform scale-105 bg-red-600' // Thêm hiệu ứng shadow và scale khi focus
                                                                    : ''
                                                                }`}
                                                            onClick={() => handleAnswerChange(questionIndex, 'false')}
                                                        >
                                                            Sai
                                                        </Button>
                                                    </div>
                                                ) : null}

                                                {q.type === 'fill_blank' && (
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập đáp án"
                                                        value={q.answers[0] || ''}
                                                        onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                                                        className="w-full border-gray-300 p-4 rounded-md focus:ring-1 focus:ring-gray-400 text-base"
                                                    />
                                                )}
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <div className="flex flex-col items-center space-y-4">
                                            <Plus size={48} className="text-gray-400" />
                                            <p className="text-gray-600 text-base">Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 justify-center py-6 bg-gray-50 rounded-lg">
                                <Button
                                    onClick={() => addQuizQuestion("single_choice")}
                                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    + Một Lựa Chọn
                                </Button>
                                <Button
                                    onClick={() => addQuizQuestion("mutiple_choice")}
                                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    + Nhiều Lựa Chọn
                                </Button>
                                <Button
                                    onClick={() => addQuizQuestion("true_false")}
                                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    + Đúng/Sai
                                </Button>
                                <Button
                                    onClick={() => addQuizQuestion("fill_blank")}
                                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    + Điền Vào Ô Trống
                                </Button>
                            </div>

                            {/* <div className="flex justify-end">
                                <Button
                                    onClick={() => console.log(JSON.stringify(questions, null, 2))}
                                    variant="outline"
                                    className="text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm transition-colors"
                                >
                                    Xuất JSON
                                </Button>
                            </div> */}
                        </div>
                    </>
                )
            }

            <Toaster />
        </>
    );


};
