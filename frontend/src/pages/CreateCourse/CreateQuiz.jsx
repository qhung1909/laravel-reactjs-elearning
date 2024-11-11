/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Type, Trash2 } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { QuizCreatorSkeleton } from "../skeletonEffect/skeleton";

export const CreateQuiz = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const lessonId = new URLSearchParams(location.search).get('lesson');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { course_id, quiz_id } = useParams();
    const navigate = useNavigate();

    const back = () => {
        navigate(`/course/manage/${course_id}/curriculum`)
    }

    useEffect(() => {
        showQuizQuestions();
    }, []);

    const showQuizQuestions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/quizzes/${quiz_id}/questions`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Không thể tải câu hỏi',
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setLoading(false);
        }
    };





    const addQuizQuestion = async (type) => {
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
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                const newQuestionId = response.data.questionId;
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
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Không thể thêm câu hỏi',
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        } finally {
            await showQuizQuestions(true);
        }
    };






    const update = async () => {
        // Validate tất cả câu hỏi trước khi gửi yêu cầu cập nhật
        const invalidQuestions = questions.filter(q => !q.type || !q.question.trim());

        if (invalidQuestions.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Vui lòng nhập đầy đủ loại câu hỏi và nội dung câu hỏi trước khi cập nhật.',
                confirmButtonText: 'OK',
            });
            return; // Dừng lại nếu có câu hỏi không hợp lệ
        }

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
            const response = await axios.put(
                `${API_URL}/quizzes/${quiz_id}/questions`,
                { questions: requestData },
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Cập nhật câu hỏi thành công',
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Gửi yêu cầu cập nhật hoặc tạo mới đáp án cho từng câu hỏi
                await Promise.all(questions.map(async (q) => {
                    let hasExistingOptions = false;
                    try {
                        const response = await axios.get(`${API_URL}/questions/${q.id}/options`, {
                            headers: {
                                'x-api-secret': API_KEY,
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
                        const trueOption = q.options.find(option => option.answer === "true") || {};
                        const falseOption = q.options.find(option => option.answer === "false") || {};

                        if (!q.answers || !Array.isArray(q.answers) || q.answers.length === 0) {
                            q.answers = ["true"];
                        }

                        optionsData = {
                            options: [
                                {
                                    id: trueOption.id || null,
                                    answer: "true",
                                    is_correct: q.answers[0] === "true"
                                },
                                {
                                    id: falseOption.id || null,
                                    answer: "false",
                                    is_correct: q.answers[0] === "false"
                                }
                            ]
                        };
                    } else if (q.type === 'fill_blank') {
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
                                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                        } else {
                            await axios.put(`${API_URL}/questions/${q.id}/options`, optionsData, {
                                headers: {
                                    'x-api-secret': API_KEY,
                                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                        }
                    }
                }));

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Cập nhật đáp án thành công',
                    showConfirmButton: false,
                    timer: 1500,
                });
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
            await showQuizQuestions(true);
        }
    };



    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
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
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
            {loading ? (
                <QuizCreatorSkeleton />

            ) : (
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 p-4">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Tạo Quiz cho Lesson {lessonId}
                            </h2>
                            <div className="flex space-x-4">
                                <Button
                                    onClick={update}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md transition duration-300"
                                >
                                    Cập nhật tất cả câu hỏi
                                </Button>

                                <Button
                                    onClick={back}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition duration-300"
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 space-y-6">
                        <div className="pt-16 space-y-6">
                            {questions.map((q, questionIndex) => (
                                <Card key={questionIndex} className="p-8 relative shadow-md hover:shadow-lg transition-shadow">
                                    <div className="absolute top-4 right-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                            onClick={() => deleteQuestion(questionIndex, q.id)}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-lg font-semibold text-gray-700">Câu hỏi {questionIndex + 1}</span>
                                        </div>

                                        <div className="relative">
                                            <Type className="absolute top-3 left-3 text-yellow-500" size={20} />
                                            <Input
                                                type="text"
                                                placeholder="Nhập câu hỏi của bạn"
                                                value={q.question}
                                                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                                className="pl-10 py-3 focus:ring-yellow-500 focus:border-yellow-500"
                                            />
                                        </div>

                                        {/* Phần giao diện đáp án cho từng loại quiz */}
                                        {q.type === 'single_choice' || q.type === 'mutiple_choice' ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                {q.options.map((option, optionIndex) => (
                                                    <div
                                                        key={optionIndex}
                                                        className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer
                                                            ${q.type === 'single_choice'
                                                                ? q.answers[0] === optionIndex
                                                                    ? 'bg-yellow-100 border-yellow-400'
                                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                                : q.answers.includes(optionIndex)
                                                                    ? 'bg-yellow-100 border-yellow-400'
                                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                        onClick={() => handleAnswerChange(questionIndex, optionIndex)}
                                                    >
                                                        <div className="flex-shrink-0">
                                                            {q.type === 'single_choice' ? (
                                                                <Circle
                                                                    size={20}
                                                                    className={`${q.answers[0] === optionIndex ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                                                                />
                                                            ) : (
                                                                <CheckCircle2
                                                                    size={20}
                                                                    className={`${q.answers.includes(optionIndex) ? 'text-yellow-500' : 'text-gray-400'}`}
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
                                        ) : null}

                                        {q.type === 'true_false' ? (
                                            <div className="flex gap-4">
                                                <Button
                                                    type="button"
                                                    className={`flex-1 ${q.options.find(option => option.answer === 'true' && option.isCorrect) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                                    onClick={() => {
                                                        // Cập nhật câu trả lời và isCorrect
                                                        handleAnswerChange(questionIndex, 'true');
                                                        const updatedOptions = q.options.map(option => ({
                                                            ...option,
                                                            isCorrect: option.answer === 'true'
                                                        }));

                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[questionIndex].options = updatedOptions;
                                                        updatedQuestions[questionIndex].answers = ['true']; // Cập nhật answers
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                >
                                                    Đúng
                                                </Button>
                                                <Button
                                                    type="button"
                                                    className={`flex-1 ${q.options.find(option => option.answer === 'false' && option.isCorrect) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                                    onClick={() => {
                                                        // Cập nhật câu trả lời và isCorrect
                                                        handleAnswerChange(questionIndex, 'false');
                                                        const updatedOptions = q.options.map(option => ({
                                                            ...option,
                                                            isCorrect: option.answer === 'false'
                                                        }));

                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[questionIndex].options = updatedOptions;
                                                        updatedQuestions[questionIndex].answers = ['false']; // Cập nhật answers
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                >
                                                    Sai
                                                </Button>
                                            </div>
                                        ) : null}


                                        {q.type === 'fill_blank' ? (
                                            <Input
                                                type="text"
                                                placeholder="Nhập đáp án"
                                                value={q.answers[0] || ''}
                                                onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : null}
                                    </div>
                                </Card>
                            ))}
                        </div>

                    </div>

                    <div className="flex flex-wrap gap-4 mb-6 justify-center">
                        <Button
                            onClick={() => addQuizQuestion("single_choice")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Thêm Một Lựa Chọn
                        </Button>
                        <Button
                            onClick={() => addQuizQuestion("mutiple_choice")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Thêm Nhiều Lựa Chọn
                        </Button>
                        <Button
                            onClick={() => addQuizQuestion("true_false")}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Thêm Đúng/Sai
                        </Button>
                        <Button
                            onClick={() => addQuizQuestion("fill_blank")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Thêm Điền Vào Ô Trống
                        </Button>
                    </div>




                    <Button
                        onClick={() => console.log(JSON.stringify(questions, null, 2))}
                        className="ml-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Xuất JSON
                    </Button>
                </div>
            )}

        </>

    );


};
