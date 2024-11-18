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
      console.log("User Info:", response.data);
      setUserInfo({
        name: response.data.name,
        user_id: response.data.user_id,
        role: response.data.role,
        email: response.data.email,
      });
      setIsLoading(false);

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

  const fetchMeetingId = async (meetingUrl) => {
    try {
      const response = await axios.get(`${API_URL}/meetings/getMeetingId`, {
        params: { meeting_url: meetingUrl },
      });
      console.log("Meeting ID:", response.data.meeting_id); 
      return response.data.meeting_id;
    } catch (error) {
      console.error('Error fetching meeting ID:', error);
      return null;
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

  const saveParticipant = async (participant, meeting_id, leftAt = null) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token không tồn tại!");
      return;
    }

    const joinedAt = new Date().toISOString();
    const data = {
      meeting_url: meetingUrl,  
      user_id: userInfo.user_id, 
      joined_at: joinedAt,  
      left_at: leftAt,  
      is_present: 0,  
      meeting_id: meeting_id,  
      created_at: new Date().toISOString(),  
      updated_at: new Date().toISOString(),  
    };
    console.log("Data to save participant:", data);  
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
    api.on("videoConferenceJoined", () => {
      const currentParticipants = api.getParticipantsInfo();
      currentParticipants.forEach((participant) => saveParticipant(participant, id));
      setParticipants(currentParticipants);

      const teacherOrModeratorPresent = checkForTeacherOrModerator(currentParticipants);
      setHasTeacher(teacherOrModeratorPresent);
      setIsWaiting(!teacherOrModeratorPresent && userInfo.role !== "teacher");
    });

    api.on("participantJoined", (participant) => {
      saveParticipant(participant, id);
      setParticipants((prevParticipants) => {
        const updatedParticipants = [...prevParticipants, participant];
        const teacherOrModeratorPresent = checkForTeacherOrModerator(updatedParticipants);
        setHasTeacher(teacherOrModeratorPresent);
        setIsWaiting(!teacherOrModeratorPresent && userInfo.role !== "teacher");
        return updatedParticipants;
      });
    });

    api.on("participantLeft", (participant) => {
      saveParticipant(participant, id, new Date().toISOString());
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
      fetchMeetingId(meetingUrl).then((meeting_id) => {
        if (!meeting_id) {
          console.error('Could not fetch meeting_id');
          return;
        }
        const domain = '192.168.1.7:8443';
        const options = {
          roomName: meeting_id,  
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
      });

      return () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      };
    }
  }, [userInfo, isLoading, meetingUrl]);

  useEffect(() => {
    if (isWaiting) {
      alert('Waiting for the teacher to start the meeting...');
    }
  }, [isWaiting]);


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
