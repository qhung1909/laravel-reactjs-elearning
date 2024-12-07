import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, Save, RefreshCw, Check, X, } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const JitsiMeeting = () => {
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: '', user_id: null, role: '' });
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const jitsiApiRef = useRef(null);
  const [participantUserIds, setParticipantUserIds] = useState(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [students, setStudents] = useState([]);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const { meetingUrl } = useParams();
  const location = useLocation();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "all" || student.status === filterStatus)
  );

  const handleAttendanceChange = (id, isPresent) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id ? { ...student, status: isPresent ? "present" : "absent" } : student
      )
    );
  };

  const fetchStudentAttendance = async () => {
    const token = localStorage.getItem("access_token");
    const meetingUrl = window.location.href;
    const fullMeetingUrl =
      meetingUrl.startsWith("http://") || meetingUrl.startsWith("https://")
        ? meetingUrl
        : `http://localhost:5173${meetingUrl}`;

    try {
      const response = await axios.get(`${API_URL}/meetings/getMeetingId`, {
        params: {
          meeting_url: fullMeetingUrl,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const meetingId = response.data.meeting_id;

      const attendanceResponse = await axios.post(
        `${API_URL}/meetings/users`,
        { meeting_id: meetingId, meeting_url: fullMeetingUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        attendanceResponse.data &&
        attendanceResponse.data.status === "success" &&
        Array.isArray(attendanceResponse.data.data)
      ) {
        setStudents(
          attendanceResponse.data.data.map((user) => ({
            id: user.user_id,
            name: user.name || "Unknown",
            status: user.is_present === 1 ? "present" : "absent",
          }))
        );
      } else {
        console.error("Unexpected data structure:", attendanceResponse.data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching student attendance:", error);
      console.error("Error response:", error.response);
      setStudents([]);
      toast.error('Lỗi khi tải danh sách sinh viên. Vui lòng thử lại sau');
    }
  };

  const saveAttendance = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const presentUserIds = students.filter(student => student.status === "present").map(student => student.id);
      const absentUserIds = students.filter(student => student.status === "absent").map(student => student.id);

      if (presentUserIds.length === 0 && absentUserIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất một sinh viên để điểm danh');
        return;
      }

      const loadingToast = toast.loading('Đang cập nhật điểm danh...');

      if (presentUserIds.length > 0) {
        await axios.post(
          `${API_URL}/meetings/mark-attendance`,
          {
            meeting_url: window.location.href,
            user_ids: presentUserIds
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (absentUserIds.length > 0) {
        await axios.post(
          `${API_URL}/meetings/mark-absent`,
          {
            meeting_url: window.location.href,
            user_ids: absentUserIds
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      toast.dismiss(loadingToast);
      toast.success('Cập nhật điểm danh thành công');

      await fetchStudentAttendance();

    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Không thể cập nhật điểm danh. Vui lòng thử lại');
    }
  };

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

    const fullMeetingUrl = meetingUrl.startsWith('http://') || meetingUrl.startsWith('https://')
      ? meetingUrl
      : `http://localhost:5173${meetingUrl}`;

    try {
      const response = await axios.get(`${API_URL}/meetings/getMeetingId`, {
        params: {
          meeting_url: fullMeetingUrl
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
        meeting_url: window.location.href,
        user_id: participant.user_id || userInfo.user_id,
        joined_at: !leftAt ? new Date().toISOString() : null,
        left_at: leftAt,
        is_present: 0,
        meeting_id: meeting_id,
        participant_info: {
          displayName: participant.displayName,
          role: participant.role || userInfo.role,
          participantId: participant.id
        }
      };



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

      return response.data.can_join;
    } catch (error) {
      console.error("Error checking teacher presence:", error);
      return false;
    }
  };

  const getMeetingCourseId = async (meetingUrl) => {
    try {
      const response = await axios.get(`${API_URL}/meetings/course?meeting_url=http://localhost:5173${meetingUrl}`);
      return response.data.course_id;
    } catch (error) {
      console.error('Error getting course ID:', error);
      if (error.response && error.response.status === 404) {
        console.error('Meeting not found');
      } else {
        console.error('Error occurred while getting course ID');
      }
      return null;
    }
  };

  const checkMeetingAccess = async (userId, courseId) => {
    try {
      const response = await axios.post(`${API_URL}/meetings/check-meeting-access`, {
        user_id: userId,
        course_id: courseId
      });
      console.log(response.data);
      return response.data.has_access;
    } catch (error) {
      console.error('Error checking meeting access:', error);
      return false;
    }
  };

  const initializeJitsiMeeting = async (meeting_id) => {
    if (jitsiApiRef.current) {

      return;
    }

    if (userInfo.role === 'user') {
      const teacherIsPresent = await checkTeacherPresence(window.location.href);
      if (!teacherIsPresent) {
        setIsWaiting(true);
        return;
      }
    }

    const domain = '127.0.0.1:8443';
    const options = {
      roomName: meeting_id,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        disableRtc: true,
        disableInviteFunctions: true,
        enableLobby: true,
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        disableDeepLinking: true,
        disableProfile: true,
        disableShowMoreStats: true,
        disableThirdPartyRequests: true,
        disableWelcomePage: true
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

      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      api.on("videoConferenceJoined", async () => {
        const currentParticipants = api.getParticipantsInfo();

        if (userInfo.role === 'user') {
          const teacherIsPresent = await checkTeacherPresence(window.location.href);
          if (!teacherIsPresent) {
            api.executeCommand('hangup');
            setIsWaiting(true);
            return;
          }
        }

        const joinTime = new Date().toISOString();
        const myParticipantId = api.getParticipantsInfo()[0].participantId;

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

        if (userInfo.role === 'teacher') {
          await fetchStudentAttendance(meeting_id);
        }

        setParticipants(currentParticipants.map(p => ({
          ...p,
          joinedAt: joinTime
        })));
        setIsWaiting(false);
      });

      api.on("participantJoined", async (participant) => {

        const participantWithTime = {
          ...participant,
          joinedAt: new Date().toISOString()
        };
        await saveParticipant(participantWithTime, meeting_id);
        setParticipants(prev => [...prev, participant]);

        if (userInfo.role === 'teacher') {

          await fetchStudentAttendance(meeting_id);
        }

        if (userInfo.role === 'user') {
          const teacherIsPresent = await checkTeacherPresence(window.location.href);
          setIsWaiting(!teacherIsPresent);
          if (!teacherIsPresent) {
            api.executeCommand('hangup');
          }
        }
      });

      api.on("participantLeft", async (participant) => {


        const participantInfo = participantUserIds.get(participant.id);

        if (participantInfo) {
          await saveParticipant({
            displayName: participant.displayName,
            role: participant.role || userInfo.role,
            id: participant.id,
            user_id: participantInfo.user_id,
            joinedAt: participantInfo.joinedAt
          }, meeting_id, new Date().toISOString());

          setParticipantUserIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(participant.id);
            return newMap;
          });
        }

        setParticipants(prev => prev.filter(p => p.id !== participant.id));

        if (userInfo.role === 'teacher') {

          await fetchStudentAttendance(meeting_id);
        }

        if (userInfo.role === 'user') {
          const teacherIsPresent = await checkTeacherPresence(window.location.href);
          if (!teacherIsPresent) {
            api.executeCommand('hangup');
            setIsWaiting(true);
          }
        }
      });
      api.on("videoConferenceLeft", async () => {
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
        const meetingUrl = location.pathname;


        if (meetingUrl) {
          const courseId = await getMeetingCourseId(meetingUrl);
          if (courseId) {
            const hasAccess = await checkMeetingAccess(userInfo.user_id, courseId);
            if (hasAccess) {
              const meeting_id = await fetchMeetingId(meetingUrl);
              if (meeting_id) {
                if (userInfo.role === 'teacher') {
                  await fetchStudentAttendance(meeting_id);
                }
                await initializeJitsiMeeting(meeting_id);
              } else {
                console.error('Could not fetch meeting_id');
                navigate('/');
              }
            } else {
              console.error('User does not have access to this course');
              navigate('/');
            }
          } else {
            console.error('Could not fetch course_id');
            navigate('/');
          }
        } else {
          console.error('Could not extract meeting URL');
          navigate('/');
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
  }, [userInfo, isLoading, location.pathname, navigate]);

  useEffect(() => {
    let intervalId;

    if (isWaiting && userInfo.role === 'user') {
      intervalId = setInterval(async () => {
        const meetingUrl = window.location.href;
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
        <div className="fixed bottom-4 left-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Danh sách học viên</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[540px] flex flex-col">
              <SheetHeader>
                <SheetTitle>Danh sách học viên điểm danh</SheetTitle>
                <SheetDescription>
                  Quản lý điểm danh của học viên
                </SheetDescription>
              </SheetHeader>
              {/* Vùng tìm kiếm và lọc */}
              <div className="my-6 space-y-4">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm học viên"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="present">Có mặt</SelectItem>
                      <SelectItem value="absent">Vắng mặt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStudents(students.map(student => ({ ...student, status: "present" })));
                      toast.success('Đã chọn tất cả học viên có mặt');
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Chọn tất cả có
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStudents(students.map(student => ({ ...student, status: "absent" })));
                      toast.success('Đã chọn tất cả học viên vắng mặt');
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Chọn tất cả vắng
                  </Button>
                </div>
                <Separator />
              </div>
              <ScrollArea className="flex-grow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên học viên</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>
                        <div className="flex items-center justify-between">
                          Điểm danh
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          {student.status === "present" ? (
                            <span className="bg-green-300 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                              Có
                            </span>
                          ) : (
                            <span className="bg-red-300 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                              Vắng
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={student.status === "present"}
                            onCheckedChange={(isPresent) => {
                              handleAttendanceChange(student.id, isPresent);
                              toast.success(`Đã đánh dấu ${student.name} ${isPresent ? 'có mặt' : 'vắng mặt'}`);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="flex justify-between mt-6">
                <SheetClose asChild>
                  <Button variant="outline">Đóng</Button>
                </SheetClose>
                <Button
                  onClick={saveAttendance}
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Lưu điểm danh
                </Button>
                <Button
                  onClick={() => {
                    const loadingToast = toast.loading('Đang làm mới...');
                    fetchStudentAttendance().finally(() => toast.dismiss(loadingToast));
                  }}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Làm mới
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            icon: '✅',
          },
          error: {
            icon: '❌',
            duration: 4000,
          },
          loading: {
            icon: '⏳',
          },
        }}
      />
    </div>
  );
}

export default JitsiMeeting;