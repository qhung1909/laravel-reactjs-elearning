import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline'

// Giả lập dữ liệu
const courses = [
  { id: 1, title: 'Khóa học React cơ bản', instructor: 'Nguyễn Văn A', status: 'pending' },
  { id: 2, title: 'Lập trình Python nâng cao', instructor: 'Trần Thị B', status: 'pending' },
  // Thêm các khóa học khác...
]

const lessons = [
  {
    id: 1,
    courseId: 1,
    title: 'Giới thiệu về React',
    content: 'Nội dung bài học...',
    videoUrl: 'https://example.com/video1.mp4',
    quizzes: [
      { id: 1, question: 'React là gì?', options: ['Framework', 'Library', 'Language', 'Platform'], correctAnswer: 1 },
      // Thêm các câu hỏi khác...
    ]
  },
  // Thêm các bài học khác...
]

export default function Draft() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
    setSelectedLesson(null)
  }

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson)
    setIsPlaying(false)
  }

  const handleApprove = () => {
    // Xử lý logic phê duyệt
    alert('Đã phê duyệt!')
  }

  const handleReject = () => {
    // Xử lý logic từ chối
    alert('Đã từ chối!')
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Xử lý logic play/pause video
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý duyệt nội dung</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <h2 className="text-xl font-semibold mb-2">Danh sách khóa học chờ duyệt</h2>
          <ul className="space-y-2">
            {courses.map(course => (
              <li
                key={course.id}
                className={`p-2 border rounded cursor-pointer ${selectedCourse?.id === course.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleCourseSelect(course)}
              >
                {course.title} - {course.instructor}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3">
          {selectedCourse && (
            <div>
              <h2 className="text-xl font-semibold mb-2">{selectedCourse.title}</h2>
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                     ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                  }>
                    Nội dung bài học
                  </Tab>
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                     ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                  }>
                    Video bài giảng
                  </Tab>
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                     ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                  }>
                    Câu hỏi Quiz
                  </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                  <Tab.Panel className="rounded-xl bg-white p-3">
                    <h3 className="text-lg font-semibold mb-2">Nội dung bài học</h3>
                    {selectedLesson ? (
                      <div>
                        <h4 className="font-medium">{selectedLesson.title}</h4>
                        <p>{selectedLesson.content}</p>
                      </div>
                    ) : (
                      <p>Vui lòng chọn một bài học để xem nội dung</p>
                    )}
                  </Tab.Panel>
                  <Tab.Panel className="rounded-xl bg-white p-3">
                    <h3 className="text-lg font-semibold mb-2">Video bài giảng</h3>
                    {selectedLesson ? (
                      <div>
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                          <video src={selectedLesson.videoUrl} controls className="w-full h-full object-cover rounded" />
                        </div>
                        <button
                          onClick={togglePlayPause}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {isPlaying ? (
                            <>
                              <PauseIcon className="h-5 w-5 mr-2" />
                              Tạm dừng
                            </>
                          ) : (
                            <>
                              <PlayIcon className="h-5 w-5 mr-2" />
                              Phát
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <p>Vui lòng chọn một bài học để xem video</p>
                    )}
                  </Tab.Panel>
                  <Tab.Panel className="rounded-xl bg-white p-3">
                    <h3 className="text-lg font-semibold mb-2">Câu hỏi Quiz</h3>
                    {selectedLesson ? (
                      <ul className="space-y-2">
                        {selectedLesson.quizzes.map(quiz => (
                          <li key={quiz.id} className="border p-2 rounded">
                            <p className="font-medium">{quiz.question}</p>
                            <ul className="ml-4 list-disc">
                              {quiz.options.map((option, index) => (
                                <li key={index} className={index === quiz.correctAnswer ? 'text-green-600' : ''}>
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Vui lòng chọn một bài học để xem câu hỏi quiz</p>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleApprove}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Phê duyệt
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Từ chối
                </button>
                <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  Yêu cầu chỉnh sửa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
