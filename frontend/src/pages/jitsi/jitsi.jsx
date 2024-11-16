import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Sử dụng useNavigate để điều hướng
import axios from 'axios';

const JitsiMeeting = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();  // Hook để điều hướng trang
  const jitsiContainerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });
  const jitsiApiRef = useRef(null);  // Lưu trữ API Jitsi
  const API_URL = import.meta.env.VITE_API_URL;

  // Lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Gửi token trong header
          },
        });
        console.log(response.data);
        
        // Chỉ cập nhật state nếu userInfo thay đổi
        setUserInfo({ name: response.data.name, role: response.data.role });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();  // Gọi API khi component load lần đầu
  }, []);  // Chỉ gọi một lần khi component mount

  useEffect(() => {
    // Kiểm tra vai trò người dùng trước khi vào cuộc họp
    if (userInfo.role && userInfo.role.trim() !== 'teacher') {
      navigate('/404');  // Điều hướng đến trang không có quyền truy cập
      return;  // Không tiếp tục khởi tạo Jitsi
    }

    // Nếu người dùng là teacher, khởi tạo cuộc họp Jitsi
    if (userInfo.name && jitsiContainerRef.current) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: id, // Sử dụng id từ URL làm tên phòng
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,  // Mặc định tắt mic khi vào cuộc họp
          startWithVideoMuted: true,  // Mặc định tắt camera khi vào cuộc họp
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'raisehand', 'hangup', 'chat', 'fullscreen', 'fodeviceselection', 'profile', 'settings',
            ], // Các nút công cụ cho người dùng
          },
        },
        userInfo: {
          displayName: userInfo.name, // Hiển thị tên người dùng từ userInfo.name
        },
      };

      if (!jitsiApiRef.current) {  // Kiểm tra nếu Jitsi chưa được khởi tạo
        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;  // Lưu API vào ref
      }

      return () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();  // Giải phóng tài nguyên khi không cần thiết
        }
      };
    }
  }, [userInfo, id, navigate]);  // Chạy lại khi userInfo hoặc id thay đổi

  return (
    <div ref={jitsiContainerRef} style={{ width: '100%', height: '100vh' }}>
      {/* Jitsi sẽ render tại đây */}
    </div>
  );
};

export default JitsiMeeting;
