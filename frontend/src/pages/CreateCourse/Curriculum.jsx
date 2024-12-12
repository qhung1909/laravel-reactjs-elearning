/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { Video, X, FileText, ArrowLeft, Menu } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
// import ReactQuill from 'react-quill';
import axios from 'axios';
import { SideBarCreateCoure } from './SideBarCreateCoure';
import { Footer } from '../footer/footer';
import { Textarea } from '@/components/ui/textarea';
import { SkeletonLoaderCurriculum } from '../skeletonEffect/skeleton';
import { Label } from "@/components/ui/label"
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
export const Curriculum = () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('access_token');

    const navigate = useNavigate();
    const [offLesson, setOffLesson] = useState(false);

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading_update, setLoadingUpdate] = useState(false);



    const { course_id } = useParams();

    const [sections, setSections] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);

    const [hasChanges, setHasChanges] = useState(false);


    const handleSectionTitleChange = (sectionId, newTitle) => {
        setSections(prevSections => {
            const updatedSections = prevSections.map(section =>
                section.id === sectionId ? { ...section, title: newTitle } : section
            );
            setHasChanges(true);
            return updatedSections;
        });
    };


    const handleContentTitleChange = (sectionId, lessonId, newTitle) => {
        setSections(prevSections => {
            const updatedSections = prevSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map(lesson =>
                            lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson
                        )
                    };
                }
                return section;
            });
            setHasChanges(true);
            return updatedSections;
        });
    };



    const handleContentDescChange = (sectionId, lessonId, newDescription) => {
        setSections(prevSections =>
            prevSections.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        lessons: section.lessons.map(lesson =>
                            lesson.id === lessonId ? { ...lesson, description: newDescription } : lesson
                        )
                    }
                    : section
            )
        )
    }

    const handleDocumentChange = (sectionId, lessonId, newValue) => {
        const currentLesson = sections.find(s => s.id === sectionId)?.lessons.find(l => l.id === lessonId);

        if (currentLesson?.content !== newValue) {
            setSections(sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.map(lesson =>
                            lesson.id === lessonId ? { ...lesson, content: newValue } : lesson
                        )
                    };
                }
                return section;
            }));
        }
    };

    const handleFileVideoChange = (sectionId, lessonId, file) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    lessons: section.lessons.map(lesson =>
                        lesson.id === lessonId ? { ...lesson, fileName: file.name, file } : lesson
                    )
                };
            }
            return section;
        }));
    };

    const resetIds = (sections) => {
        return sections.map((section, sectionIndex) => ({
            ...section,
            id: sectionIndex + 1,
            lessons: section.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                id: lessonIndex + 1
            }))
        }));
    };

    const fetchCourse = async () => {
        toast.dismiss();
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/teacher/courses/${course_id}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.data.launch_date == null) {
                setOffLesson(true);
            }
        } catch {
            // console.error('Error fetching course data:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchContent()
        fetchCourse()
    }, []);
    const fetchContent = async (force = false) => {
        toast.dismiss();
        if (!force && isDataFetched) {
            return;
        }
        try {
            // setLoading(true);
            const response = await axios.get(
                `${API_URL}/teacher/content/${course_id}`,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const apiContents = response.data.data.contents;
                apiContents.sort((a, b) => a.content_id - b.content_id);
                const transformedSections = apiContents.map((content, index) => ({
                    id: index + 1,
                    title: content.name_content,
                    content_id: content.content_id,
                    is_online_meeting: content.is_online_meeting,
                    lessons: []
                }));

                if (transformedSections.length > 0) {
                    setSections(transformedSections);
                    setIsDataFetched(true);
                }
            }
        } catch {
            // console.error('Error fetching content:', error);
            // toast.error('Không thể tải nội dung khóa học');
        } finally {
            setLoading(false)
        }
    };


    const addOfflineLesson = async () => {
        if (
            sections.length > 0 &&
            (!sections[sections.length - 1].title || !sections[sections.length - 1].title.trim())
        ) {
            toast.error("Vui lòng nhập tiêu đề cho Bài học trước khi Thêm Bài học mới.");
            return;
        }

        const newSection = {
            id: sections.length + 1,
            course_id: course_id,
            title: '',
            lessons: [],
            is_online_meeting: 0,
        };

        try {
            // Gửi yêu cầu POST để lưu phần mới
            const response = await axios.post(
                `${API_URL}/teacher/content`,
                {
                    course_id: course_id,
                    name_content: newSection.title,
                    is_online_meeting: newSection.is_online_meeting
                },
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // console.log(response.data);


            // Kiểm tra phản hồi từ server và thêm ID vào phần mới
            if (response.data.success && response.data.data.content_id) {
                const content_id = response.data.data.content_id;

                // Cập nhật phần mới với content_id từ server
                const sectionWithId = { ...newSection, content_id };

                // Thêm phần mới vào mảng sections hiện tại
                setSections((prevSections) => [...prevSections, sectionWithId]);

                toast.success("Thêm phần mới thành công!");
            } else {
                toast.error(response.data.message || "Có lỗi xảy ra khi thêm nội dung!");
            }
        } catch {
            // console.error("Error:", error);
            toast.error("Đã xảy ra lỗi khi thêm phần mới.");
        }
    };


    const addOnlineSection = async () => {
        if (
            sections.length > 0 &&
            (!sections[sections.length - 1].title || !sections[sections.length - 1].title.trim())
        ) {
            toast.error("Vui lòng nhập tiêu đề cho Bài học trước khi Thêm Bài học mới.");
            return;
        }

        const newSection = {
            id: sections.length + 1,
            course_id: course_id,
            title: '',
            lessons: [],
            is_online_meeting: 1,
        };

        try {
            // Gửi yêu cầu POST để lưu phần mới
            const response = await axios.post(
                `${API_URL}/teacher/content`,
                {
                    course_id: course_id,
                    name_content: newSection.title,
                    is_online_meeting: newSection.is_online_meeting
                },
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // console.log('hihih', response.data);


            // Kiểm tra phản hồi từ server và thêm ID vào phần mới
            if (response.data.success && response.data.data.content_id) {
                const content_id = response.data.data.content_id;

                // Cập nhật phần mới với content_id từ server
                const sectionWithId = { ...newSection, content_id };

                // Thêm phần mới vào mảng sections hiện tại`1
                setSections((prevSections) => [...prevSections, sectionWithId]);

                toast.success("Thêm phần mới thành công!");
            } else {
                toast.error(response.data.message || "Có lỗi xảy ra khi thêm nội dung!");
            }
        } catch {
            // console.error("Error:", error);
            toast.error("Đã xảy ra lỗi khi thêm phần mới.");
        }
    };







    const addContent = async (sectionId) => {
        const section = sections.find(section => section.id === sectionId);

        if (!section) return;
        // Kiểm tra nếu không có bài học nào trong section
        if (section.lessons.length === 0) {
            // Có thể thực hiện logic khác nếu cần
        } else {
            // Kiểm tra bài học cuối có tiêu đề không
            const lastLesson = section.lessons[section.lessons.length - 1];
            if (!lastLesson.title || !lastLesson.title.trim()) {
                toast.error("Vui lòng nhập tiêu đề nội dung của bài trước khi '+ Thêm nội dung mới'");
                return;
            }
        }
        try {
            const requestData = {
                content_id: section.content_id,
                title_contents: [{
                    body_content: "",
                    video_link: null,
                    document_link: null,
                    description: ""
                }]
            };

            const response = await axios.post(
                `${API_URL}/teacher/title-content`,
                requestData,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Thêm bài học thất bại");
            }

            const newTitleContentId = response.data.data[0].title_content_id;


            const newLesson = {
                id: section.lessons.length + 1,  // Đảm bảo ID bài học là duy nhất
                title: '',
                selectedOption: '',
                videoLink: '',
                content: '',
                fileName: '',
                description: '',
                title_content_id: newTitleContentId
            };


            setSections(prevSections =>
                prevSections.map(section => {
                    if (section.id === sectionId) {
                        return {
                            ...section,
                            lessons: [
                                ...section.lessons,
                                newLesson  // Thêm bài học mới vào mảng lessons
                            ]
                        };
                    }
                    return section;
                })
            );

            toast.success("Thêm bài học mới thành công!");

        } catch {
            // console.error("Error adding lesson:", error);
            toast.error("Có lỗi xảy ra khi kết nối với máy chủ!");
        }
    };




    const deleteLesson = async (contentId) => {
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa bài này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return;
        }


        try {
            // Gửi yêu cầu xóa đến API
            const response = await axios.delete(`${API_URL}/teacher/contents/${contentId}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Cập nhật state sau khi xóa thành công
                const updatedSections = sections.filter(section => section.content_id !== contentId);
                const resetSections = resetIds(updatedSections);
                setSections(resetSections);
                // await fetchContent(true);
                toast.success("Đã xóa Bài học thành công!");

            } else {
                toast.error("Có lỗi xảy ra khi xóa Bài học!");
            }
        } catch {
            // console.error('Error:', error);
            toast.error("Có lỗi xảy ra khi xóa Bài học!");
        }
    };




    const deleteContent = async (sectionId, lessonId) => {
        const section = sections.find(section => section.id === sectionId);
        const lesson = section.lessons.find(lesson => lesson.id === lessonId);

        if (!lesson.title_content_id) {
            toast.error("Không thể xóa vì thiếu title_content_id.");
            return;
        }

        // Hiển thị xác nhận trước khi xóa
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa nội dung này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return;
        }

        try {
            // Gửi yêu cầu xóa đến API
            const response = await axios.delete(`${API_URL}/teacher/title-content/delete/${lesson.title_content_id}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Xóa bài học khỏi state sau khi xóa thành công
                const updatedSections = sections.map(section => {
                    if (section.id === sectionId) {
                        return {
                            ...section,
                            lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
                        };
                    }
                    return section;
                });

                const resetSections = resetIds(updatedSections);
                setSections(resetSections);
                toast.success("Nội dung đã được xóa!");
            } else {
                toast.error(response.data.message || "Có lỗi xảy ra khi xóa nội dung.");
            }
        } catch {
            // console.error("Error deleting content:", error);
            toast.error("Có lỗi xảy ra khi kết nối với máy chủ!");
        }
    };


    const deleteVideo = async (sectionId, lessonId) => {
        const section = sections.find(section => section.id === sectionId);
        const lesson = section.lessons.find(lesson => lesson.id === lessonId);

        if (!lesson.title_content_id) {
            toast.error("Không thể xóa vì thiếu title_content_id.");
            return;
        }

        // Show confirmation dialog
        const { isConfirmed } = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (!isConfirmed) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_URL}/teacher/title-content/${lesson.title_content_id}/video`,
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                toast.success("Video đã được xóa thành công!");
            }

            if (response.data.success) {
                setSections(prevSections =>
                    prevSections.map(s =>
                        s.id === sectionId ? {
                            ...s,
                            lessons: s.lessons.map(l =>
                                l.id === lessonId ? {
                                    ...l,
                                    fileName: '',
                                    file: null
                                } : l
                            )
                        } : s
                    )
                );
                toast.success("Video đã được xóa thành công!");
                setHasChanges(true);
            } else {
                toast.error("Có lỗi xảy ra khi xóa video!");
            }
        } catch {
            toast.error("Có lỗi xảy ra khi kết nối với máy chủ!");
        }
    };

    const openPageQuiz = async (sectionId) => {
        if (!isUpdated && hasChanges) {
            notify('Bạn cần Cập nhật trước khi chuyển trang!', 'error');
            return;
        }
        try {
            const response = await axios.post(
                `${API_URL}/quizzes`,
                {
                    course_id: parseInt(course_id, 10),
                    content_id: sectionId,
                },
                {
                    headers: {
                        'x-api-secret': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );



            if (response.status === 201 && response.data) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Quiz đã được thêm thành công. Chuyển đến trang tạo quiz.',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                });

                navigate(`/course/manage/${course_id}/create-quiz/${sectionId}/quiz/${response.data.data.quiz_id}`);
            }


        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    Swal.fire({
                        title: 'Tiếp tục!',
                        text: 'Quiz đã có sẵn. Chuyển đến trang tạo quiz.',
                        icon: 'success',
                        confirmButtonText: 'Đóng',
                    });

                    navigate(`/course/manage/${course_id}/create-quiz/${sectionId}/quiz/${error.response?.data?.data?.quiz_id}`);
                }
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: error.message || 'Không thể kết nối với máy chủ.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
            }
        }
    };

    const isValidUrl = (url) => {
        const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        return urlPattern.test(url);
    };



    const update = async () => {
        toast.dismiss();

        if (sections.length === 0) {
            toast.error('Vui lòng tạo ít nhất một bài học trước khi cập nhật!');
            return;
        }

        // let hasErrors = false;
        let errorMessages = [];

        // Lặp qua các phần và bài học để kiểm tra lỗi
        sections.forEach((section) => {
            if (!section.title || !section.title.trim()) {
                errorMessages.push(`Bài ${section.id} thiếu tiêu đề`);
            }

            section.lessons.forEach((lesson, index) => {
                // Kiểm tra tiêu đề và mô tả bài học
                if (!lesson.title || !lesson.title.trim()) {
                    errorMessages.push(`Nội dung ${section.id}.${index + 1} thiếu tiêu đề`);
                }

                if (!lesson.description || !lesson.description.trim()) {
                    errorMessages.push(`Nội dung ${section.id}.${index + 1} thiếu mô tả`);
                }

                // Kiểm tra nếu có nội dung nhưng không phải URL hợp lệ
                if (lesson.content && !isValidUrl(lesson.content)) {
                    errorMessages.push(`Vui lòng nhập link nội dung hợp lệ cho bài ${section.id}.${index + 1}`);
                }

                // Kiểm tra ít nhất một trong ba: file, video_link hoặc content
                const hasVideoOrDocument = !!lesson.file || !!lesson.fileName || !!lesson.content;
                if (!hasVideoOrDocument) {
                    errorMessages.push(`Nội dung ${section.id}.${index + 1} cần có video hoặc link nội dung`);
                }
            });
        });

        if (errorMessages.length > 0) {
            // Nếu có lỗi, hiển thị thông báo đầu tiên và không tiếp tục
            toast.error(errorMessages[0]);
            return;
        }

        // Tiến hành xử lý nếu không có lỗi
        const validSections = sections.filter((section) => section.title.trim() !== '');
        const sectionsToUpdate = validSections.filter((section) => section.content_id);

        const loadingToast = toast.loading('Đang xử lý...');

        try {
            setLoadingUpdate(true);
            const updateContentsData = sectionsToUpdate.map((section) => ({
                content_id: section.content_id,
                name_content: section.title.trim(),
                is_online_meeting: section.is_online_meeting,
            }));

            let updatePromise = Promise.resolve();
            if (updateContentsData.length > 0) {
                updatePromise = axios.put(
                    `${API_URL}/teacher/courses/${course_id}/contents`,
                    { contents: updateContentsData },
                    {
                        headers: {
                            'x-api-secret': API_KEY,
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            const [updateResult] = await Promise.all([updatePromise]);

            let hasError = false;

            if (updateContentsData.length > 0 && !updateResult.data.success) {
                toast.error(updateResult.data.message || 'Không thể cập nhật nội dung khóa học!');
                hasError = true;
            }

            // Cập nhật title-content cho các sections với file upload
            const titleContentPromises = validSections.map((section) => {
                const formData = new FormData();

                // Chuẩn bị dữ liệu cho mỗi bài học
                section.lessons.forEach((lesson, index) => {
                    formData.append(`title_contents[${index}][title_content_id]`, lesson.title_content_id);
                    formData.append(`title_contents[${index}][body_content]`, lesson.title);
                    formData.append(`title_contents[${index}][description]`, lesson.description || '');

                    // Xử lý file video
                    if (lesson.file instanceof File) {
                        formData.append(`title_contents[${index}][video_link]`, lesson.file);
                    } else if (lesson.fileName) {
                        formData.append(`title_contents[${index}][video_link]`, lesson.fileName);
                    }

                    // Xử lý document link
                    formData.append(`title_contents[${index}][document_link]`, lesson.content || '');
                });

                return axios.post(
                    `${API_URL}/teacher/title-content/update/${section.content_id}`,
                    formData,
                    {
                        headers: {
                            'x-api-secret': API_KEY,
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            });

            const titleContentResults = await Promise.all(titleContentPromises);
            titleContentResults.forEach((response) => {
                if (!response.data.success) {
                    toast.error(response.data.message || 'Có lỗi xảy ra khi cập nhật chi tiết tiêu đề!');
                    hasError = true;
                }
            });

            if (!hasError) {
                toast.success('Đã lưu nội dung thành công!');
                setHasChanges(false);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại!');
                navigate('/login');
                return;
            }

            if (error.response?.status === 403) {
                toast.error('Bạn không có quyền thực hiện thao tác này!');
                return;
            }


            toast.success('Đã lưu nội dung thành công!');
            setHasChanges(false);


            // const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xử lý nội dung!';
            // toast.error(errorMessage);
            // console.error('Error:', error);
        } finally {
            toast.dismiss(loadingToast);
            setIsUpdated(true);
            setLoadingUpdate(false);
        }
    };

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    const handleAccordionClick = (contentId) => {

        const section = sections.find((s) => s.content_id === contentId);
        if (section && section.lessons.length > 0 && section.lessons[0].title !== '') {
            // console.log("Dữ liệu đã được tải, không cần fetch lại");
            return;
        }

        const fetchData = async () => {
            const response = await axios.get(`${API_URL}/teacher/title-content/${contentId}`, {
                headers: {
                    'x-api-secret': API_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // console.log(response);


            if (response.data.success) {
                const fetchedLessons = response.data.data.map((item) => {
                    return {
                        id: item.title_content_id,
                        title: item.body_content,
                        description: item.description,
                        fileName: item.video_link,
                        content: item.document_link,
                        selectedOption: item.video_link ? "videoFile" : item.document_link ? "content" : "",
                        title_content_id: item.title_content_id || null
                    };
                });

                setSections((prevSections) =>
                    prevSections.map((section) =>
                        section.content_id === contentId
                            ? { ...section, lessons: fetchedLessons }
                            : section
                    )
                );
            }
        };


        fetchData();
    };





    return (
        <>
            {loading && (
                <div className='loading'>
                    <div className='loading-spin'></div>
                </div>
            )}
            {loading_update && (
                <div className='loading'>
                    {/* <div className='loading-spin'></div> */}
                </div>
            )}

            <header className="fixed top-0 w-full z-10 bg-yellow-500 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link
                            to='/instructor/lesson'
                            className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-sm font-medium hidden sm:inline">Quay lại khóa học</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {loading ? (
                                <>
                                    <Button
                                        readOnly
                                        className=" sm:inline-flex items-center px-6 py-3 bg-white text-gray-500 font-semibold rounded-lg border-2 border-gray-500 hover:bg-white hover:text-gray-500 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                        <span>Cập nhật Nội Dung</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={update}
                                        className=" sm:inline-flex items-center px-6 py-3 bg-white text-yellow-600 font-semibold rounded-lg border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                        <span>Cập nhật Nội Dung</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </>
                            )}


                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-slate-900 hover:bg-yellow-400"
                                aria-label="Menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex max-w-7xl m-auto pt-16 pb-36">
                <SideBarCreateCoure course_id={course_id} isUpdated={isUpdated} setIsUpdated={setIsUpdated} hasChanges={hasChanges} />

                <div className="w-full lg:w-10/12 shadow-lg">




                    <>

                        <div>
                            <div className="m-2">
                                <h1 className="text-xl font-medium px-10 p-4">Chương trình giảng dạy</h1>
                            </div>
                            <div className="border-b-2"></div>
                        </div>

                        {loading ? (
                            <>
                                <SkeletonLoaderCurriculum />
                            </>
                        ) : (
                            <>
                                <div className="max-w-4xl mx-auto p-6">
                                    <form method="POST" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                        <h2 className="text-xl font-semibold">Nội dung khóa học</h2>
                                        <Accordion type="multiple" collapsible="true" className="space-y-4 relative">
                                            {Array.isArray(sections) && sections.map((section, sectionIndex) => (
                                                <AccordionItem
                                                    value={`section-${section.id}`}
                                                    key={section.id}
                                                    className="border-2 rounded-lg border-yellow-700 p-4 relative"
                                                >
                                                    <div className="flex items-center gap-4 w-[78%] md:w-[88%] absolute ml-14 mt-3">
                                                        {section.is_online_meeting === 1 ? (
                                                            <span className="bg-green-100 text-green-800 text-sm font-medium px-1 md:px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Online</span>
                                                        ) : (
                                                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-1 md:px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Offline</span>
                                                        )
                                                        }

                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-600">Bài {sectionIndex + 1}:</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="flex-1 p-2 w-1/2 md:w-full border rounded-md"
                                                            placeholder={`Nhập tiêu đề bài ${sectionIndex + 1}`}
                                                            value={section.title}
                                                            onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        {section.is_online_meeting === 0 && (
                                                            <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => openPageQuiz(section.content_id)}>
                                                                Tạo quiz
                                                            </Button>
                                                        )}

                                                    </div>



                                                    {section.is_online_meeting === 0 ? (
                                                        <AccordionTrigger
                                                            onClick={() => handleAccordionClick(section.content_id)}
                                                            className="hover:no-underline border-2 rounded-lg border-yellow-600 p-5 mt-1 ml-3"
                                                        />
                                                    ) : (
                                                        <div className="h-[56px] border-2 rounded-lg border-yellow-600 p-5 mt-1 ml-3"></div>
                                                    )}

                                                    <X onClick={() => deleteLesson(section.content_id)} className="absolute text-red-600 cursor-pointer left-1 top-1" />
                                                    <AccordionContent>
                                                        <div className="space-y-4 mt-4">
                                                            {Array.isArray(section.lessons) && section.lessons.map((lesson, lessonIndex) => (
                                                                <Card key={lesson.id} className="relative p-4 border border-yellow-400 ml-6">
                                                                    <div className="space-y-4">
                                                                        <span className="relative mx-6 bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Offline</span>

                                                                        <div className="flex items-center gap-4 pb-3">

                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium text-gray-600">
                                                                                    Nội dung: {sectionIndex + 1}.{lessonIndex + 1}
                                                                                </span>
                                                                            </div>
                                                                            <Input
                                                                                type="text"
                                                                                className="flex-1 p-2 border rounded-md"
                                                                                placeholder={`Nhập tiêu đề nội dung bài ${sectionIndex + 1}.${lessonIndex + 1}`}
                                                                                value={lesson.title}
                                                                                onChange={(e) => handleContentTitleChange(section.id, lesson.id, e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <Label>Mô tả bài học:</Label>
                                                                        <Textarea
                                                                            placeholder="Nhập mô tả cho bài học này"
                                                                            value={lesson.description}
                                                                            onChange={(e) => handleContentDescChange(section.id, lesson.id, e.target.value)}
                                                                            className="w-full"
                                                                        />



                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Video className="text-blue-500 h-5 w-5" />
                                                                                <label className="font-medium">Tải lên video:</label>
                                                                            </div>

                                                                            {lesson.fileName && (
                                                                                <div className="flex items-center gap-2 mt-2">
                                                                                    <p className="text-gray-600">Link hiện tại: {lesson.fileName}</p>

                                                                                    <X
                                                                                        className="text-blue-600 cursor-pointer w-24"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            deleteVideo(section.id, lesson.id);
                                                                                        }}
                                                                                    >
                                                                                    </X>
                                                                                </div>
                                                                            )}
                                                                            <Input
                                                                                className="mt-2"
                                                                                type="file"
                                                                                onChange={(e) => handleFileVideoChange(section.id, lesson.id, e.target.files[0])}
                                                                            />
                                                                        </div>

                                                                        {/* Phần Document */}
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <FileText className="text-purple-500 h-5 w-5" />
                                                                                <label className="font-medium">Nhập Link Nội dung:</label>
                                                                            </div>

                                                                            <Input
                                                                                type="text"
                                                                                className="mt-2"
                                                                                value={lesson.content || ""}
                                                                                onChange={(e) => handleDocumentChange(section.id, lesson.id, e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            Nội dung cần có ít nhất 1 video hoặc document
                                                                        </div>



                                                                    </div>
                                                                    <X onClick={() => deleteContent(section.id, lesson.id)} className="absolute top-1 left-2 text-red-400" />
                                                                </Card>
                                                            ))}

                                                            <button
                                                                onClick={() => addContent(section.id)}
                                                                className="w-[97%] p-2 border-2 ml-6 border-dashed rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                                                            >
                                                                + Thêm nội dung mới
                                                            </button>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>

                                        <div className="flex gap-2">

                                            {offLesson ? (
                                                <>
                                                    <button
                                                        onClick={addOfflineLesson}
                                                        className="w-full p-3 border-2 border-dashed border-slate-700 rounded-md text-gray-600 hover:bg-gray-50"
                                                    >
                                                        + Thêm Bài học mới
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={addOfflineLesson}
                                                        className="w-full p-3 border-2 border-dashed border-slate-700 rounded-md text-gray-600 hover:bg-gray-50"
                                                    >
                                                        + Thêm Bài học mới
                                                    </button>
                                                    <button
                                                        onClick={addOnlineSection}
                                                        className="w-full p-3 border-2 border-dashed border-slate-700 rounded-md text-gray-600 hover:bg-gray-50"
                                                    >
                                                        + Thêm Bài Online mới
                                                    </button>
                                                </>
                                            )}


                                        </div>
                                        <div className="text-gray-400">Để đủ điều kiện gửi đi phải có ít nhất 1 bài học được nhập</div>

                                        {/* <button
                                        onClick={exportToJsonLog}
                                        className="w-full p-3 border-2 border-dashed border-green-700 rounded-md text-gray-600 hover:bg-gray-50"
                                    >
                                        Xuất dữ liệu ra log
                                    </button> */}

                                    </form>
                                    <Toaster />
                                </div>
                            </>
                        )}

                    </>

                </div >
            </div >
            <Footer />
        </>

    );
};
