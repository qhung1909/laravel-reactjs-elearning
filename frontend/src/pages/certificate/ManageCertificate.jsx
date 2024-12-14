import React, { useEffect, useState } from "react";
import { Eye, Award, SearchX, Loader2, Calendar, Download, Medal } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle } from "lucide-react";
import { startOfMonth, isWithinInterval } from "date-fns";

import { Alert, AlertDescription } from "@/components/ui/alert";
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = localStorage.getItem("access_token");

const ManageCertificate = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);

    const getErrorMessage = (error) => {
        if (error?.includes('401')) {
            return 'Bạn chưa đăng nhập';
        }
        if (error?.includes('404')) {
            return 'Không có chứng chỉ nào';
        }
        return error;
    };


    const newCertificatesThisMonth = certificates.filter(cert => {
        const certDate = new Date(cert.issue_at);
        return isWithinInterval(certDate, {
            start: startOfCurrentMonth,
            end: currentDate
        });
    });


    const fetchCertificates = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/certificates`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "x-api-secret": API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setCertificates(data.certificates || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleViewCertificate = (certificateId) => {
        navigate(`/certificate/${certificateId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <Medal className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/80">Tổng chứng chỉ</p>
                                    <h3 className="text-2xl font-bold">{certificates.length}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/80">Tháng này</p>
                                    <h3 className="text-2xl font-bold"> {newCertificatesThisMonth.length} Chứng chỉ mới
                                    </h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Main Content Card */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="border-b bg-white space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Quản lý Chứng chỉ
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Xem và quản lý tất cả chứng chỉ của bạn
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {loading && (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 animate-pulse">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-[60%]" />
                                            <Skeleton className="h-4 w-[40%]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error ? (
                            <Alert className="mt-4 bg-red-50 border border-red-100 shadow-sm animate-in slide-in-from-top duration-300">
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    <AlertDescription className="text-red-800 font-medium">
                                        {getErrorMessage(error)}
                                    </AlertDescription>
                                </div>
                            </Alert>

                        ) : null}

                        {!loading && !error && certificates.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <SearchX className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="text-xl font-semibold text-gray-600 mb-2">
                                    Chưa có chứng chỉ nào
                                </p>
                                <p className="text-gray-500">
                                    Hoàn thành các khóa học để nhận chứng chỉ của bạn
                                </p>
                            </div>
                        )}

                        {!loading && !error && certificates.length > 0 && (
                            <div className="rounded-xl border border-gray-100 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="w-[150px] font-semibold">Mã chứng chỉ</TableHead>
                                            <TableHead className="w-[30%] font-semibold">Tên chứng chỉ</TableHead>
                                            <TableHead className="w-[25%] font-semibold">Thời gian nhận</TableHead>
                                            <TableHead className="w-[10%] text-right font-semibold">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {certificates.map((certificate) => (
                                            <TableRow
                                                key={certificate.certificate_id}
                                                className="hover:bg-gray-50/50 transition-all duration-200"
                                            >
                                                <TableCell>
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                                        {certificate.certificate_id}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {certificate.course_title}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {format(new Date(certificate.issue_at), "dd/MM/yyyy hh:mm:ss a")}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                                                        onClick={() => handleViewCertificate(certificate.certificate_id)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Xem
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManageCertificate;
