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
import { useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key';

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const CreateQuiz = () => {
    const location = useLocation();
    const lessonId = new URLSearchParams(location.search).get('lesson');
    const [questions, setQuestions] = useState([]);

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


    const addQuestion = () => {
        setQuestions([...questions, {
            type: '',
            question: '',
            options: ['', '', '', ''],
            answers: []
        }]);
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

        if (question.type === 'multiplechoice') {
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

    const deleteQuestion = (index) => {
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
                                onClick={() => deleteQuestion(questionIndex)}
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
                                    <SelectItem value="singlechoice">Single Choice</SelectItem>
                                    <SelectItem value="multiplechoice">Multiple Choice</SelectItem>
                                    <SelectItem value="truefalse">True/False</SelectItem>
                                    <SelectItem value="fillblank">Fill in the Blank</SelectItem>
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

                                    {(q.type === 'singlechoice' || q.type === 'multiplechoice') && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {q.options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer
                                                            ${q.type === 'singlechoice'
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
                                                        {q.type === 'singlechoice' ? (
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

                                    {q.type === 'truefalse' && (
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

                                    {q.type === 'fillblank' && (
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
                onClick={addQuestion}
                className="w-full p-4 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg text-yellow-600 hover:bg-yellow-100 hover:border-yellow-500 transition-colors"
            >
                <Plus size={20} className="mr-2" />
                Thêm câu hỏi
            </Button>
        </div>
    );
};

