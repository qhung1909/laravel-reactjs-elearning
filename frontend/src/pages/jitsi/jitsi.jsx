import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JitsiMeeting = () => {
  const { id } = useParams();
  const jitsiContainerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });
  const [isTeacherInMeeting, setIsTeacherInMeeting] = useState(false); // Kiểm tra xem có teacher trong phòng không
  const jitsiApiRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        
        setUserInfo({ name: response.data.name, role: response.data.role });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo.name && userInfo.role && jitsiContainerRef.current) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: id,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'desktop',
              'raisehand',
              'hangup',
              'chat',
              'fullscreen',
              'fodeviceselection',
              'profile',
              'settings',
            ],
          },
        },
        userInfo: {
          displayName: userInfo.name,
        },
      };

      if (!jitsiApiRef.current) {
        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        // Lắng nghe sự kiện participantJoined
        api.addEventListener('participantJoined', (participant) => {
          console.log('Participant joined:', participant);
          // Nếu participant là teacher, đánh dấu là có giảng viên trong phòng
          if (participant.displayName && participant.displayName.toLowerCase().includes('teacher')) {
            setIsTeacherInMeeting(true);
          }
        });

        // Lắng nghe sự kiện participantLeft
        api.addEventListener('participantLeft', (participant) => {
          console.log('Participant left:', participant);
          // Nếu giảng viên rời phòng, cập nhật trạng thái
          if (participant.displayName && participant.displayName.toLowerCase().includes('teacher')) {
            setIsTeacherInMeeting(false);
          }
        });
      }

      // Nếu người dùng là student và không có teacher trong phòng, ngăn họ tham gia
      if (userInfo.role === 'user' && !isTeacherInMeeting) {
        alert('Không thể tham gia phòng họp vì chưa có giảng viên.');
        return;
      }

      // Hủy Jitsi API khi component bị unmount
      return () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      };
    }
  }, [userInfo, id, isTeacherInMeeting]);

  return (
    <div ref={jitsiContainerRef} style={{ width: '100%', height: '100vh' }}>
      {/* Jitsi will render here */}
    </div>
  );
};

export default JitsiMeeting;
