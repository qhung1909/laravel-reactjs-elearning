import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const JitsiMeeting = () => {
  const { id } = useParams(); // Lấy id phòng cuộc họp từ URL
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    if (jitsiContainerRef.current) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: id, // Sử dụng id từ URL làm tên phòng
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
      };

      // Khởi tạo cuộc họp
      const api = new window.JitsiMeetExternalAPI(domain, options);

      return () => {
        api.dispose(); // Giải phóng tài nguyên khi không cần thiết
      };
    }
  }, [id]); // useEffect sẽ chạy lại khi id thay đổi

  return (
    <div ref={jitsiContainerRef} style={{ width: '100%', height: '100vh' }}>
      {/* Jitsi sẽ render tại đây */}
    </div>
  );
};

export default JitsiMeeting;
