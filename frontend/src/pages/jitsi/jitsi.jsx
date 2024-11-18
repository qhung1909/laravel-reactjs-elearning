import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const JitsiMeeting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: '', user_id: null, role: '' });
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTeacher, setHasTeacher] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const jitsiApiRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const meetingUrl = window.location.href;
  const [participantUserIds, setParticipantUserIds] = useState(new Map());

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User Info:", response.data);
      setUserInfo({
        name: response.data.name,
        user_id: response.data.user_id,
        role: response.data.role,
        email: response.data.email,
      });
      setIsLoading(false);

      if (response.data.role === 'user') {
        setIsWaiting(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: window.location.pathname } });
      } else {
        console.error('Error fetching user info:', error);
      }
      setIsLoading(false);
    }
  };

  const fetchMeetingId = async (meetingUrl) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`${API_URL}/meetings/getMeetingId`, {
        params: { meeting_url: meetingUrl },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Meeting ID:", response.data.meeting_id);
      return response.data.meeting_id;
    } catch (error) {
      console.error('Error fetching meeting ID:', error);
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: window.location.pathname } });
      } else if (error.response?.status === 404) {
        console.error('Meeting not found');
      }
      return null;
    }
  };

  const saveParticipant = async (participant, meeting_id, leftAt = null) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token không tồn tại!");
      return;
    }

    try {
      const data = {
        meeting_url: meetingUrl,
        user_id: leftAt ? participant.user_id : userInfo.user_id, // Fix: Chỉ dùng userInfo.user_id khi join mới
        joined_at: !leftAt ? new Date().toISOString() : null,
        left_at: leftAt,
        is_present: leftAt ? 0 : 1,
        meeting_id: meeting_id,
        participant_info: {
          displayName: participant.displayName,
          role: participant.role || userInfo.role,
          participantId: participant.id
        }
      };

      console.log("Data to save participant:", data);

      const response = await axios.post(
        `${API_URL}/meetings/participants`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Participant saved successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving participant:", error);
      return null;
    }
  };

  const checkTeacherPresence = async (meetingUrl) => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      const response = await axios.post(
        `${API_URL}/meetings/check-teacher-presence`,
        { meeting_url: meetingUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Teacher presence check:", response.data);
      return response.data.can_join;
    } catch (error) {
      console.error("Error checking teacher presence:", error);
      return false;
    }
  };

  const initializeJitsiMeeting = async (meeting_id) => {
    // Kiểm tra nếu đã có instance đang chạy thì không tạo mới
    if (jitsiApiRef.current) {
      console.log("Jitsi instance already exists");
      return;
    }

    if (userInfo.role === 'user') {
      const teacherIsPresent = await checkTeacherPresence(meetingUrl);
      if (!teacherIsPresent) {
        setIsWaiting(true);
        return;
      }
    }

    const domain = '192.168.1.7:8443';
    const options = {
      roomName: meeting_id,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        enableLobby: true,
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      userInfo: {
        displayName: userInfo.name,
        role: userInfo.role,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'security'
        ],
      },
    };

    try {
      console.log("Initializing new Jitsi instance");
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      api.on("videoConferenceJoined", async () => {
        const currentParticipants = api.getParticipantsInfo();

        if (userInfo.role === 'user') {
          const teacherIsPresent = await checkTeacherPresence(meetingUrl);
          if (!teacherIsPresent) {
            api.executeCommand('hangup');
            setIsWaiting(true);
            return;
          }
        }

        const joinTime = new Date().toISOString();
        const myParticipantId = api.getParticipantsInfo()[0].participantId;

        // Lưu thông tin của chính mình
        setParticipantUserIds(prev => new Map(prev).set(myParticipantId, {
          user_id: userInfo.user_id,
          joinedAt: joinTime
        }));

        await saveParticipant({
          displayName: userInfo.name,
          role: userInfo.role,
          id: myParticipantId,
          joinedAt: joinTime,
          user_id: userInfo.user_id
        }, meeting_id);

        setParticipants(currentParticipants.map(p => ({
          ...p,
          joinedAt: joinTime
        })));
        setIsWaiting(false);
      });

      api.on("participantJoined", async (participant) => {
        console.log("Participant joined:", participant);
        const participantWithTime = {
          ...participant,
          joinedAt: new Date().toISOString()
        };

        // Lưu thông tin user vào Map với key là participant.id
        setParticipantUserIds(prev => new Map(prev).set(participant.id, {
          user_id: participant.user_id || userInfo.user_id,
          joinedAt: participantWithTime.joinedAt
        }));

        await saveParticipant(participantWithTime, meeting_id);
        setParticipants(prev => [...prev, participant]);

        if (userInfo.role === 'user') {
          const teacherIsPresent = await checkTeacherPresence(meetingUrl);
          setIsWaiting(!teacherIsPresent);
          if (!teacherIsPresent) {
            api.executeCommand('hangup');
          }
        }
      });

      api.on("participantLeft", async (participant) => {
        console.log("Participant left:", participant);

        // Lấy thông tin user_id từ Map
        const participantInfo = participantUserIds.get(participant.id);

        if (participantInfo) {
          await saveParticipant({
            displayName: participant.displayName,
            role: participant.role || userInfo.role,
            id: participant.id,
            user_id: participantInfo.user_id, // Sử dụng user_id đã lưu
            joinedAt: participantInfo.joinedAt
          }, meeting_id, new Date().toISOString());

          // Xóa thông tin participant khỏi Map
          setParticipantUserIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(participant.id);
            return newMap;
          });
        }

        setParticipants(prev => prev.filter(p => p.id !== participant.id));

        if (userInfo.role === 'user') {
          const teacherIsPresent = await checkTeacherPresence(meetingUrl);
          if (!teacherIsPresent) {
            api.executeCommand('hangup');
            setIsWaiting(true);
          }
        }
      });

      api.on("videoConferenceLeft", async () => {
        // Lưu thời điểm rời phòng cho user hiện tại
        await saveParticipant({
          displayName: userInfo.name,
          role: userInfo.role,
          id: jitsiApiRef.current?.getParticipantsInfo()[0]?.participantId,
          user_id: userInfo.user_id
        }, meeting_id, new Date().toISOString());

        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      });

    } catch (error) {
      console.error("Error initializing Jitsi:", error);
      jitsiApiRef.current = null;
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeRoom = async () => {
      if (!isLoading && userInfo.user_id && jitsiContainerRef.current && mounted) {
        const meeting_id = await fetchMeetingId(meetingUrl);
        if (!meeting_id) {
          console.error('Could not fetch meeting_id');
          return;
        }

        if (userInfo.role === 'teacher') {
          await initializeJitsiMeeting(meeting_id);
        } else {
          const teacherIsPresent = await checkTeacherPresence(meetingUrl);
          if (teacherIsPresent) {
            await initializeJitsiMeeting(meeting_id);
          } else {
            setIsWaiting(true);
          }
        }
      }
    };

    initializeRoom();

    return () => {
      mounted = false;
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [userInfo, isLoading]);

  useEffect(() => {
    let intervalId;

    if (isWaiting && userInfo.role === 'user') {
      intervalId = setInterval(async () => {
        const teacherIsPresent = await checkTeacherPresence(meetingUrl);
        if (teacherIsPresent) {
          setIsWaiting(false);
          const meeting_id = await fetchMeetingId(meetingUrl);
          if (meeting_id && !jitsiApiRef.current) {
            await initializeJitsiMeeting(meeting_id);
          }
        }
      }, 2500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWaiting, userInfo.role]);

  if (isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Đang chờ giảng viên vào phòng...</h2>
        <p className="text-gray-600">Bạn sẽ được tự động vào phòng khi giảng viên có mặt.</p>
      </div>
    );
  }

  return (
    <div>
      <div ref={jitsiContainerRef} style={{ width: '100%', height: '100vh' }} />
      {userInfo.role === 'teacher' && (
        <div className="fixed bottom-4 right-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">View Attendance</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Attendance List</SheetTitle>
                <SheetDescription>
                  {/* Thêm nội dung danh sách điểm danh ở đây */}
                </SheetDescription>
              </SheetHeader>
              <SheetClose asChild>
                <Button variant="default">Close</Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

export default JitsiMeeting;