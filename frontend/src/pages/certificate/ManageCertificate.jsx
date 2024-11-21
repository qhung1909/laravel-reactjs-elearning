import React, { useEffect, useState } from "react";
import { Eye, Award, SearchX, Loader2 } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = localStorage.getItem("access_token");

const ManageCertificate = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <Card className="w-full max-w-6xl mx-auto shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <Award className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl font-bold">Quản lí chứng chỉ</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        Xem và quản lí tất cả chứng chỉ của bạn.
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription className="flex items-center">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {!loading && !error && certificates.length === 0 && (
                        <div className="text-center py-12">
                            <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-lg font-semibold text-muted-foreground">
                                Không tìm thấy chứng chỉ nào
                            </p>
                        </div>
                    )}

                    {!loading && !error && certificates.length > 0 && (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px] font-semibold">Certificate ID</TableHead>
                                        <TableHead className="w-[30%] font-semibold">Tên chứng chỉ</TableHead>
                                        <TableHead className="w-[25%] font-semibold">Thời gian nhận được</TableHead>
                                        <TableHead className="w-[10%] text-right font-semibold">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {certificates.map((certificate) => (
                                        <TableRow 
                                            key={certificate.certificate_id} 
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                                                    {certificate.certificate_id}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium">{certificate.course_title}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(new Date(certificate.issue_at), "PPP")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-primary hover:text-white transition-colors"
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
    );
};

export default ManageCertificate;