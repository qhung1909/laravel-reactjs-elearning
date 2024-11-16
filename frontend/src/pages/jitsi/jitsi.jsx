import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams để lấy id từ URL
import axios from 'axios';

const JitsiMeeting = () => {
  const { id } = useParams();
  const jitsiContainerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: '' });
  const jitsiApiRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserInfo({ name: response.data.name });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo.name && jitsiContainerRef.current) {
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
              'microphone', 'camera', 'desktop', 'raisehand', 'hangup', 'chat', 'fullscreen', 'fodeviceselection', 'profile', 'settings',
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
      }

      return () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
        }
      };
    }
  }, [userInfo, id]);

  return (
    <div ref={jitsiContainerRef} style={{ width: '100%', height: '100vh' }}>
      {/* Jitsi will render here */}
    </div>
  );
};

export default JitsiMeeting;
