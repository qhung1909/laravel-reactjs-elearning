import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  ListChecks,
  CheckCircle2,
  Circle,
  Type,
  Plus,
  Trash2,
} from 'lucide-react';

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, {
      type: '',
      question: '',
      options: ['', '', '', ''],  // 4 tùy chọn cố định
      answers: [] // Sẽ lưu index thay vì giá trị
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
      // Xử lý multiple choice - toggle selection bằng index
      if (question.answers.includes(optionIndex)) {
        question.answers = question.answers.filter(ans => ans !== optionIndex);
      } else {
        question.answers.push(optionIndex);
      }
    } else {
      // Xử lý single choice - chỉ chọn một index
      question.answers = [optionIndex];
    }

    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    // Chuyển đổi answers từ index sang giá trị thực tế trước khi submit
    const formattedQuestions = questions.map(q => ({
      ...q,
      answers: q.type === 'truefalse' || q.type === 'fillblank'
        ? q.answers
        : q.answers.map(ansIndex => q.options[ansIndex])
    }));
    console.log(formattedQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tạo Quiz</h2>
        <Button
          onClick={addQuestion}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm câu hỏi
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, questionIndex) => (
          <Card key={questionIndex} className="p-6 relative">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => deleteQuestion(questionIndex)}
              >
                <Trash2 size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-gray-700">Câu hỏi {questionIndex + 1}</span>
              </div>

              <select
                value={q.type}
                onChange={(e) => handleTypeChange(questionIndex, e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn loại câu hỏi</option>
                <option value="singlechoice">Single Choice</option>
                <option value="multiplechoice">Multiple Choice</option>
                <option value="truefalse">True/False</option>
                <option value="fillblank">Fill in the Blank</option>
              </select>

              {q.type && (
                <div className="space-y-4">
                  <div className="relative">
                    <Type className="absolute top-3 left-3 text-gray-400" size={20} />
                    <Input
                      type="text"
                      placeholder="Nhập câu hỏi của bạn"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                      className="pl-10 py-2"
                    />
                  </div>

                  {(q.type === 'singlechoice' || q.type === 'multiplechoice') && (
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                          <div
                            className="cursor-pointer"
                            onClick={() => handleAnswerChange(questionIndex, optionIndex)}
                          >
                            {q.type === 'singlechoice' ? (
                              <Circle
                                size={20}
                                className={`${q.answers.includes(optionIndex) ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`}
                              />
                            ) : (
                              <CheckCircle2
                                size={20}
                                className={`${q.answers.includes(optionIndex) ? 'text-blue-500' : 'text-gray-400'}`}
                              />
                            )}
                          </div>
                          <Input
                            type="text"
                            placeholder={`Tùy chọn ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            className="flex-1 border-0 bg-transparent focus:ring-0"
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
                        className="flex-1"
                      >
                        Đúng
                      </Button>
                      <Button
                        type="button"
                        variant={q.answers[0] === 'false' ? 'default' : 'outline'}
                        onClick={() => handleAnswerChange(questionIndex, 'false')}
                        className="flex-1"
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
                      className="w-full"
                    />
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            <ListChecks className="mr-2" size={20} />
            Lưu Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
