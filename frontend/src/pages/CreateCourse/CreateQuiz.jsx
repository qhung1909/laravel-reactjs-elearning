import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Type, Plus, Trash2 } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Swal from "sweetalert2";
import axios from "axios";

const secretKey = 'your-secret-key';

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const CreateQuiz = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const lessonId = new URLSearchParams(location.search).get('lesson');
    const [questions, setQuestions] = useState([]);
    const { content_id, quiz_id } = useParams();

    useEffect(() => {
        const storedData = localStorage.getItem(`quiz-${lessonId}`);
        if (storedData) {
            try {
                const decryptedData = decryptData(storedData);
                setQuestions(decryptedData);
            } catch (error) {
                console.error("Error decrypting data:", error);
            }
        }
    }, [lessonId]);

    useEffect(() => {
        if (questions.length > 0 && lessonId) {
            try {
                const encryptedData = encryptData(questions);
                localStorage.setItem(`quiz-${lessonId}`, encryptedData);
            } catch (error) {
                console.error("Error saving data to localStorage:", error);
            }
        } else {
            localStorage.removeItem(`quiz-${lessonId}`);
        }
    }, [questions, lessonId]);

    useEffect(() => {
        showQuizQuestions();
    }, []);

    const showQuizQuestions = async () => {
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

                // Kiểm tra nếu fetchedQuestions không phải là một mảng, đặt nó thành một mảng rỗng
                if (!Array.isArray(fetchedQuestions)) {
                    console.error("Dữ liệu trả về không phải là một mảng:", fetchedQuestions);
                    setQuestions([]); // Đặt thành mảng rỗng nếu dữ liệu không hợp lệ
                    return;
                }

                // Nếu dữ liệu hợp lệ, tiếp tục xử lý
                setQuestions(fetchedQuestions.map(q => ({
                    id: q.question_id,
                    question: q.question || "",
                    type: q.question_type || "",
                    options: q.options || ["", "", "", ""],
                    answers: q.answers || []
                })));
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
        }
    };


    const addQuizQuestion = async () => {
        try {
            const requestData = {
                questions: [
                    {
                        question: "",
                        question_type: "",
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
                setQuestions([...questions, {
                    id: newQuestionId,
                    question: "",
                    type: "",
                    options: ["", "", "", ""],
                    answers: []
                }]);

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Đã thêm câu hỏi mới',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            await showQuizQuestions()
        } catch (error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Không thể thêm câu hỏi',
                showConfirmButton: false,
                timer: 1500
            });
            console.log(error);
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
            const requestData = questions.map(q => ({
                id: q.id,
                question: q.question,
                question_type: q.type,
            }));

            console.log("Danh sách ID các câu hỏi:", requestData.map(q => q.id));

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
            }
        } catch (error) {
            console.error("Không thể cập nhật câu hỏi:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Không thể cập nhật câu hỏi',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };




    const handleTypeChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].type = value;
        updatedQuestions[index].answers = [];
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        const question = updatedQuestions[questionIndex];

        if (question.type === 'mutiple_choice') {
            if (question.answers.includes(optionIndex)) {
                question.answers = question.answers.filter(ans => ans !== optionIndex);
            } else {
                question.answers.push(optionIndex);
            }
        } else {
            question.answers = [optionIndex];
        }

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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tạo Quiz cho Lesson {lessonId}</h2>

            <div className="space-y-6">
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

                            <Select
                                value={q.type}
                                onValueChange={(value) => handleTypeChange(questionIndex, value)}
                            >
                                <SelectTrigger className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors cursor-pointer text-gray-700">
                                    <SelectValue placeholder="Chọn loại câu hỏi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single_choice">Một lựa chọn</SelectItem>
                                    <SelectItem value="mutiple_choice">Nhiều lựa chọn</SelectItem>
                                    <SelectItem value="true_false">Đúng/Sai</SelectItem>
                                    <SelectItem value="fill_blank">Điền vào ô trống</SelectItem>
                                </SelectContent>
                            </Select>

                            {q.type && (
                                <div className="space-y-6">
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

                                    {(q.type === 'single_choice' || q.type === 'mutiple_choice') && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {q.options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer
                                                            ${q.type === 'single_choice'
                                                            ? q.answers[0] === optionIndex
                                                                ? 'bg-yellow-50 border-yellow-300'
                                                                : 'bg-gray-50 hover:bg-gray-100'
                                                            : q.answers.includes(optionIndex)
                                                                ? 'bg-yellow-50 border-yellow-300'
                                                                : 'bg-gray-50 hover:bg-gray-100'
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
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                                        className="flex-1 border-0 bg-transparent focus:ring-0 placeholder-gray-400"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'true_false' && (
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant={q.answers[0] === 'true' ? 'default' : 'outline'}
                                                onClick={() => handleAnswerChange(questionIndex, 'true')}
                                                className={`flex-1 ${q.answers[0] === 'true' ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-gray-100'}`}
                                            >
                                                Đúng
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={q.answers[0] === 'false' ? 'default' : 'outline'}
                                                onClick={() => handleAnswerChange(questionIndex, 'false')}
                                                className={`flex-1 ${q.answers[0] === 'false' ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-gray-100'}`}
                                            >
                                                Sai
                                            </Button>
                                        </div>
                                    )}

                                    {q.type === 'fill_blank' && (
                                        <Input
                                            type="text"
                                            placeholder="Nhập đáp án"
                                            value={q.answers[0] || ''}
                                            onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                                            className="w-full focus:ring-yellow-500 focus:border-yellow-500"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <Button
                onClick={addQuizQuestion}
                className="w-full p-4 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg text-yellow-600 hover:bg-yellow-100 hover:border-yellow-500 transition-colors"
            >
                <Plus size={20} className="mr-2" />
                Thêm câu hỏi
            </Button>


            <Button
                onClick={update}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                Cập nhật tất cả câu hỏi
            </Button>

            <Button
                onClick={() => console.log(JSON.stringify(questions, null, 2))}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                Xuất JSON
            </Button>
        </div>
    );
};
