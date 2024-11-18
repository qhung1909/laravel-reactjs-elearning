import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      setUserInfo({
        name: response.data.name,
        user_id: response.data.user_id,
        role: response.data.role,
        email: response.data.email,
      });
      setIsLoading(false);

      // Xác định trạng thái chờ ban đầu
      if (response.data.role !== 'teacher') {
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

  const checkForTeacherOrModerator = (participantsList) => {
    console.log('Participants List:', participantsList);

    return participantsList.some(participant => {
      return (
        participant.role === 'teacher' ||
        participant._properties?.role === 'teacher' ||
        participant.role === 'moderator' ||
        participant._properties?.role === 'moderator'
      );
    });

  };

  const saveParticipant = async (participant, leftAt = null) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token không tồn tại!");
      return;
    }

    const joinedAt = new Date().toISOString();
    const data = {
      participant_id: participant.id,
      name: participant.name || "Unknown",
      joined_at: joinedAt,
      meeting_url: meetingUrl,
      left_at: leftAt,
    };

    try {
      const response = await axios.post(`${API_URL}/meetings/participants`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Participant saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving participant:", error.response?.data || error.message);
    }
  };

  const handleParticipantEvents = (api) => {
    // Khi tham gia cuộc họp
    api.on("videoConferenceJoined", () => {
      const currentParticipants = api.getParticipantsInfo();
      currentParticipants.forEach((participant) => saveParticipant(participant));
      setParticipants(currentParticipants);

      const teacherOrModeratorPresent = checkForTeacherOrModerator(currentParticipants);
      setHasTeacher(teacherOrModeratorPresent);
      setIsWaiting(!teacherOrModeratorPresent && userInfo.role !== "teacher");
    });

    // Khi có người tham gia mới
    api.on("participantJoined", (participant) => {
      saveParticipant(participant);
      setParticipants((prevParticipants) => {
        const updatedParticipants = [...prevParticipants, participant];
        const teacherOrModeratorPresent = checkForTeacherOrModerator(updatedParticipants);

        setHasTeacher(teacherOrModeratorPresent);
        setIsWaiting(!teacherOrModeratorPresent && userInfo.role !== "teacher");
        return updatedParticipants;
      });
    });

    // Khi người tham gia rời đi
    api.on("participantLeft", (participant) => {
      saveParticipant(participant, new Date().toISOString());
      setParticipants((prevParticipants) => {
        const updatedParticipants = prevParticipants.filter((p) => p.id !== participant.id);
        const teacherOrModeratorPresent = checkForTeacherOrModerator(updatedParticipants);

        setHasTeacher(teacherOrModeratorPresent);
        setIsWaiting(!teacherOrModeratorPresent && userInfo.role !== "teacher");
        return updatedParticipants;
      });
    });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!isLoading && userInfo.user_id && jitsiContainerRef.current) {
      const domain = '192.168.1.7:8443';
      const options = {
        roomName: id,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          enableLobby: false,
          startWithAudioMuted: true,
          startWithVideoMuted: true,
        },
        userInfo: {
          displayName: userInfo.name,
        },
      };

      if (!jitsiApiRef.current) {
        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        handleParticipantEvents(api);
      }

      return () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      };
    }
  }, [userInfo, isLoading, id]);



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
                  {/* List of participants */}
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
