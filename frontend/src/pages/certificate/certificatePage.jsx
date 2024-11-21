import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import CertificateTemplate from './certificate';
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = localStorage.getItem('access_token');

const CertificateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef(null);

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

  const downloadAsPNG = async () => {
    try {
      setDownloading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const certificateElement = certificateRef.current;
      if (!certificateElement) {
        throw new Error('Certificate element not found');
      }

      const canvas = await html2canvas(certificateElement, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: null,
        logging: false,
      });

      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.course_title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setDownloading(false);
    }
  };

  const printCertificate = () => {
    window.print();
  };

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


      <div ref={certificateRef}>
        {certificate && (
          <CertificateTemplate
            studentName={certificate.student_name}
            courseName={certificate.course_title}
            completionDate={new Date(certificate.issue_at).toLocaleDateString('vi-VN')}
          />
        )}
      </div>

      <div className="flex justify-center items-center mb-6 mt-5">
        
        <div className="flex gap-4">
          <Button
            onClick={downloadAsPNG}
            disabled={downloading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Downloading...' : 'Tải file ảnh - PNG'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailPage;