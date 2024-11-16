import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JitsiMeeting = () => {
  const { id } = useParams();
  const jitsiContainerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: '', user_id: null, role: '' });
  const [participants, setParticipants] = useState([]);
  const jitsiApiRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const meetingUrl = window.location.href;

  const sendParticipantToBackend = async (participant, leftAt = null, joinedAt = null) => {
    const token = localStorage.getItem('access_token');
    const leftAtTime = leftAt || null;
    const joinedAtTime = joinedAt || new Date().toISOString();

    console.log('Sending participant:', participant);
    if (!participant || !participant.displayName) {
      console.error('Participant data is incomplete', participant);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/meetings/participants`,
        {
          meeting_url: meetingUrl,
          participant_id: userInfo.user_id,
          name: participant.displayName,
          joined_at: joinedAtTime,
          left_at: leftAtTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Response from backend:', response);
    } catch (error) {
      console.error('Error sending participant info:', error);
    }
  };

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 
        console.log('User info:', response.data);
        setUserInfo({ name: response.data.name, user_id: response.data.user_id, role: response.data.role });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  };

  const updateAttendance = async (participant_id, is_present) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `${API_URL}/meetings/attendance`,
        {
          meeting_url: meetingUrl,
          participants: [
            {
              participant_id,
              is_present,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Attendance updated:', response.data);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo.user_id && jitsiContainerRef.current) {
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

        api.addListener('participantJoined', (participant) => {
          console.log('Participant joined:', participant);
          sendParticipantToBackend(participant);
          setParticipants((prevParticipants) => [
            ...prevParticipants,
            { participant_id: participant.id, name: participant.displayName, is_present: true },
          ]);
        });

        api.addListener('participantLeft', (participant) => {
          console.log('Participant left:', participant);
          sendParticipantToBackend(participant, new Date().toISOString());
          setParticipants((prevParticipants) =>
            prevParticipants.filter((p) => p.participant_id !== participant.id)
          );
        });
      }

      return () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      };
    }
  }, [userInfo, id]);

  const handleAttendanceChange = (participant_id, is_present) => {
    updateAttendance(participant_id, is_present);
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.participant_id === participant_id
          ? { ...participant, is_present }
          : participant
      )
    );
  };

  return (
    <div>
      <div ref={jitsiContainerRef} style={{ width: '100%', height: '80vh' }}></div>

      {userInfo.role === 'teacher' && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Attendance</h3>
          <ul>
            {participants.map((participant) => (
              <li key={participant.participant_id}>
                <span>{participant.name}</span>
                <label>
                  <input
                    type="checkbox"
                    checked={participant.is_present}
                    onChange={(e) =>
                      handleAttendanceChange(participant.participant_id, e.target.checked)
                    }
                  />
                  Present
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JitsiMeeting;
