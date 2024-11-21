import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import CertificateTemplate from './certificate';
import { Button } from "@/components/ui/button";
import { Download, Printer, AlertCircle, ChevronLeft, FileX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <FileX className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Không tìm thấy chứng chỉ</CardTitle>
            <CardDescription className="text-base mt-2">
              Xin lỗi, chúng tôi không thể tìm thấy chứng chỉ bạn yêu cầu. Vui lòng kiểm tra lại ID chứng chỉ hoặc quay lại trang quản lý chứng chỉ.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/user/certificate')}
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại danh sách chứng chỉ
            </Button>
          </CardFooter>
        </Card>
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