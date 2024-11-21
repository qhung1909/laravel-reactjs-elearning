import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CertificateTemplate from './certificate';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = localStorage.getItem('access_token');

const CertificateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`${API_URL}/certificate/details/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-secret': API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error(response.status === 401 
            ? 'Please log in to view this certificate' 
            : 'Certificate not found');
        }

        const data = await response.json();
        setCertificate(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Please log in')) {
          // Optional: Redirect to login page if not authenticated
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      setError('Please log in to view this certificate');
      setLoading(false);
      navigate('/login');
      return;
    }

    fetchCertificate();
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <button 
          onClick={() => navigate('/certificates')}
          className="mb-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back to Certificates
        </button>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {certificate && (
        <CertificateTemplate
        studentName={certificate.student_name} // Sử dụng tên từ API
        courseName={certificate.course_title}
        completionDate={new Date(certificate.issue_at).toLocaleDateString('vi-VN')}
        />
      )}
    </div>
  );
};

export default CertificateDetailPage;