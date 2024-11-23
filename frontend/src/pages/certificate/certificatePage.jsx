import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import CertificateTemplate from './certificate';
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Share2, Medal, Facebook } from "lucide-react";
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

  const getErrorMessage = (error) => {
    if (error === "Certificate not found") {
      return "Không tìm thấy chứng chỉ";
    }
    return error;
  };


  const shareFacebook = async () => {
    try {
      const shareUrl = window.location.href;

      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

      const width = 1200;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      window.open(
        facebookShareUrl,
        'facebook-share-dialog',
        `width=${width},height=${height},top=${top},left=${left}`
      );
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Đang tải chứng chỉ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center animate-pulse">
                <Medal className="h-12 w-12 text-rose-500" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Không tìm thấy chứng chỉ
              </CardTitle>
              <CardDescription className="text-base mt-2 text-gray-600">
                Xin lỗi, chúng tôi không thể tìm thấy chứng chỉ bạn yêu cầu.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-rose-50 border-rose-200">
              <AlertTitle className="text-rose-800 font-semibold">Có lỗi xảy ra</AlertTitle>
              <AlertDescription className="text-rose-700">
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-50 border-2 transition-all duration-200 font-medium"
              onClick={() => navigate('/user/certificate')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách chứng chỉ
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/user/certificate')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>

        {/* Certificate Card */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center border-b bg-white">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Chứng chỉ khóa học
            </CardTitle>
            <CardDescription className="text-gray-600">
              {certificate?.course_title}
            </CardDescription>
          </CardHeader>

          {/* Certificate Preview */}
          <CardContent className="p-6">
            <div
              ref={certificateRef}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              {certificate && (
                <CertificateTemplate
                  studentName={certificate.student_name}
                  courseName={certificate.course_title}
                  completionDate={new Date(certificate.issue_at).toLocaleDateString('vi-VN')}
                />
              )}
            </div>
          </CardContent>

          {/* Action Buttons */}
          <CardFooter className="flex justify-center gap-4 pb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-200 shadow-md"
              onClick={downloadAsPNG}
              disabled={downloading}
            >
              <Download className="h-5 w-5 mr-2" />
              {downloading ? 'Đang tải xuống...' : 'Tải chứng chỉ'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={shareFacebook}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0 transition-all duration-200 shadow-md"
            >
              <Facebook className="h-5 w-5 mr-2" />
              Chia sẻ Facebook
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CertificateDetailPage;