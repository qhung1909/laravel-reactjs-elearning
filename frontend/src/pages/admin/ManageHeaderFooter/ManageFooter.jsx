import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Brush, Share2, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea"; import { SideBarUI } from '../sidebarUI'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { GraduationCap, LayoutDashboard } from 'lucide-react';
import { Separator } from '@radix-ui/react-context-menu'
import { Settings, Save, Upload, AlertCircle, Key, Globe, Image as ImageIcon, RefreshCcw, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

export default function ManageFooter() {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem('access_token');

    const [settings, setSettings] = useState({
        title: "",
        description: "",
        timezone: "",
        language: "",
        logoUrl: "",
        favicon: "",
        primaryColor: "",
        secondaryColor: "",
        metaTitle: "",
        metaDescription: "",
        googleAnalyticsId: "",
        facebookPixelId: "",
        email: "",
        phone: "",
        address: "",
        workingHours: "",
        bannerUrl: "",
        defaultThumbnail: "",
        maxUploadSize: 5,
        allowedFileTypes: [],
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        apiKey: "",
        webhookUrl: "",
        allowedOrigins: "*",
        rateLimit: 100
    });
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({
        banner: '',
        thumbnail: ''
    });
    const handleFileChange = (e, type) => {
        if (e.target.files[0]) {
            setSelectedFiles(prev => ({
                ...prev,
                [type]: e.target.files[0].name
            }));
        }
    };
    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-secret': API_KEY
                }
            });
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data = await response.json();

            setSettings({
                title: data.title,
                description: data.description,
                timezone: data.timezone,
                language: data.language,
                logoUrl: data.logo_url,
                favicon: data.favicon,
                primaryColor: data.primary_color,
                secondaryColor: data.secondary_color,
                metaTitle: data.meta_title,
                metaDescription: data.meta_description,
                googleAnalyticsId: data.google_analytics_id,
                facebookPixelId: data.facebook_pixel_id,
                email: data.contact_email,
                phone: data.phone,
                address: data.address,
                workingHours: data.working_hours,
                bannerUrl: data.banner_url,
                defaultThumbnail: data.default_thumbnail,
                maxUploadSize: data.max_upload_size,
                allowedFileTypes: JSON.parse(data.allowed_file_types || '[]'),
                facebook: data.facebook_url,
                twitter: data.twitter_url,
                instagram: data.instagram_url,
                linkedin: data.linkedin_url,
                youtube: data.youtube_url,
                apiKey: data.api_key,
                webhookUrl: data.webhook_url,
                allowedOrigins: data.allowed_origins,
                rateLimit: data.rate_limit
            });

        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            // Get files from inputs
            const logoInput = document.getElementById('logo');
            const faviconInput = document.getElementById('favicon');
            const bannerInput = document.getElementById('banner');
            const thumbnailInput = document.getElementById('thumbnail');

            // Append files if selected
            if (logoInput?.files[0]) {
                formData.append('logo', logoInput.files[0]);
            }
            if (faviconInput?.files[0]) {
                formData.append('favicon', faviconInput.files[0]);
            }
            if (bannerInput?.files[0]) {
                formData.append('banner', bannerInput.files[0]);
            }
            if (thumbnailInput?.files[0]) {
                formData.append('thumbnail', thumbnailInput.files[0]);
            }

            // Append rest of the data
            const apiData = {
                title: settings.title,
                description: settings.description,
                timezone: settings.timezone,
                language: settings.language,
                // logo_url: settings.logoUrl,
                // favicon: settings.favicon,
                primary_color: settings.primaryColor,
                secondary_color: settings.secondaryColor,
                meta_title: settings.metaTitle,
                meta_description: settings.metaDescription,
                google_analytics_id: settings.googleAnalyticsId,
                facebook_pixel_id: settings.facebookPixelId,
                contact_email: settings.email,
                phone: settings.phone,
                address: settings.address,
                working_hours: settings.workingHours,
                // banner_url: settings.bannerUrl,
                // default_thumbnail: settings.defaultThumbnail,
                max_upload_size: settings.maxUploadSize,
                allowed_file_types: JSON.stringify(settings.allowedFileTypes),
                facebook_url: settings.facebook,
                twitter_url: settings.twitter,
                instagram_url: settings.instagram,
                linkedin_url: settings.linkedin,
                youtube_url: settings.youtube,
                api_key: settings.apiKey,
                webhook_url: settings.webhookUrl,
                allowed_origins: settings.allowedOrigins,
                rate_limit: settings.rateLimit
            };

            // Append all fields from apiData to formData
            Object.keys(apiData).forEach(key => {
                formData.append(key, apiData[key]);
            });

            const { data } = await axios.post(`${API_URL}/admin/settings`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-secret': API_KEY,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update settings if new URLs are returned
            if (data.logo_url || data.favicon) {
                setSettings(prev => ({
                    ...prev,
                    logoUrl: data.logo_url || prev.logoUrl,
                    favicon: data.favicon || prev.favicon
                }));
            }

            // Update document metadata
            const titleTag = document.getElementsByTagName('title')[0];
            if (titleTag) {
                titleTag.innerText = settings.metaTitle;
            }

            let metaDescTag = document.querySelector('meta[name="description"]');
            if (!metaDescTag) {
                metaDescTag = document.createElement('meta');
                metaDescTag.setAttribute('name', 'description');
                document.head.appendChild(metaDescTag);
            }
            metaDescTag.setAttribute('content', settings.metaDescription);

            const faviconTag = document.querySelector('link[rel="icon"]');
            if (faviconTag) {
                faviconTag.setAttribute('href', settings.favicon);
                faviconTag.setAttribute('class', 'object-cover');
            }

            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.error || 'Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SidebarProvider>

            <SideBarUI />
            <SidebarInset>
                <header className="z-10 absolute left-1 top-3 font-sans">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href="/admin/courses"
                                        className="flex items-center gap-1 text-blue-600"
                                    >
                                        <GraduationCap size={16} />
                                        Quản lý cài đặt website
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-14 px-6 w-full font-sans bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Cài đặt thông tin website</h1>
                        </div>

                        <div className="grid gap-8">
                            {/* General Settings */}
                            <Card className="shadow-lg hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-teal-500" />
                                        Tổng quan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-teal-600">Tiêu đề website</Label>
                                        <Input
                                            value={settings.title}
                                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                            className="focus:border-teal-500"
                                            placeholder="Nhập tiêu đề website"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-teal-600">Mô tả</Label>
                                        <Input
                                            value={settings.description}
                                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                            className="focus:border-teal-500"
                                            placeholder="Nhập mô tả website"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brush className="h-5 w-5 text-orange-500" />
                                        Nhận dạng thương hiệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-orange-600">Logo</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-orange-200 flex items-center justify-center bg-orange-50 hover:border-orange-300 transition-colors">
                                                    <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full p-2" />
                                                </div>
                                                <div className="text-orange-600 hover:text-orange-700">
                                                    <Label htmlFor="logo">Upload Logo</Label>
                                                    <Input
                                                        id="logo"
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-orange-600">Favicon</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-orange-200 flex items-center justify-center bg-orange-50 hover:border-orange-300 transition-colors">
                                                    <img src={settings.favicon} alt="Favicon" className="max-w-full max-h-full p-2" />
                                                </div>
                                                <div className="text-orange-600 hover:text-orange-700">
                                                    <Label htmlFor="faviconn">Upload Logo</Label>
                                                    <Input
                                                        id="faviconn"
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>

                            {/* SEO */}
                            <Card className="shadow-lg hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-5 w-5 text-purple-500" />
                                        Cấu hình SEO
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-purple-600">Tiêu đề Meta</Label>
                                            <Input
                                                value={settings.metaTitle}
                                                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                                                className="focus:border-purple-500"
                                                placeholder="Tiêu đề cho SEO"
                                            />
                                            <p className="text-sm text-purple-500">Đề xuất: 50-60 từ</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-purple-600">Meta Description</Label>
                                            <Textarea
                                                value={settings.metaDescription}
                                                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                                className="min-h-[100px] focus:border-purple-500"
                                                placeholder="Mô tả cho SEO"
                                            />
                                            <p className="text-sm text-purple-500">Đề xuất: 150-160 từ</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-emerald-500" />
                                        Thông tin liên hệ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-emerald-600">Địa chỉ email</Label>
                                            <Input
                                                type="email"
                                                value={settings.email}
                                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                                className="focus:border-emerald-500"
                                                placeholder="example@domain.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-emerald-600">Số điện thoại</Label>
                                            <Input
                                                value={settings.phone}
                                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                                className="focus:border-emerald-500"
                                                placeholder="+84 xxx xxx xxx"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-emerald-600">Địa chỉ</Label>
                                            <Textarea
                                                value={settings.address}
                                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                                className="focus:border-emerald-500"
                                                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-lg hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-indigo-500" />
                                        Cài đặt hình ảnh
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-indigo-600">Ảnh banner</Label>
                                            <div className="flex flex-col gap-4">
                                                <div className="aspect-video w-full rounded-lg border-2 border-dashed border-indigo-200 flex items-center justify-center bg-indigo-50 hover:border-indigo-300 transition-colors">
                                                    <img src={settings.bannerUrl} alt="Banner" className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            readOnly
                                                            value={settings.bannerUrl}
                                                            className="focus:border-indigo-500"
                                                        />
                                                        <Input
                                                            id="banner"
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, 'banner')}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            className="text-indigo-600 hover:text-indigo-700"
                                                            onClick={() => document.getElementById('banner').click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Upload
                                                        </Button>
                                                    </div>
                                                    {selectedFiles.banner && (
                                                        <p className="text-sm text-gray-600">
                                                            File đã chọn: {selectedFiles.banner}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-indigo-600">Ảnh Thumbnail</Label>
                                            <div className="flex flex-col gap-4">
                                                <div className="aspect-video w-full rounded-lg border-2 border-dashed border-indigo-200 flex items-center justify-center bg-indigo-50 hover:border-indigo-300 transition-colors">
                                                    <img src={settings.defaultThumbnail} alt="Default Thumbnail" className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={settings.defaultThumbnail}
                                                            onChange={(e) => setSettings({ ...settings, defaultThumbnail: e.target.value })}
                                                            placeholder="Nhập URL thumbnail"
                                                            className="focus:border-indigo-500"
                                                        />
                                                        <Input
                                                            id="thumbnail"
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, 'thumbnail')}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            className="text-indigo-600 hover:text-indigo-700"
                                                            onClick={() => document.getElementById('thumbnail').click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Upload
                                                        </Button>
                                                    </div>
                                                    {selectedFiles.thumbnail && (
                                                        <p className="text-sm text-gray-600">
                                                            File đã chọn: {selectedFiles.thumbnail}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Share2 className="h-5 w-5" />
                                        Liên kết mạng xã hội
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-blue-600">Facebook</Label>
                                            <Input
                                                value={settings.facebook}
                                                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                                placeholder="https://facebook.com/..."
                                                className="focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-blue-400">Twitter</Label>
                                            <Input
                                                value={settings.twitter}
                                                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                                placeholder="https://twitter.com/..."
                                                className="focus:border-blue-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-pink-500">Instagram</Label>
                                            <Input
                                                value={settings.instagram}
                                                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                                placeholder="https://instagram.com/..."
                                                className="focus:border-pink-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-blue-700">LinkedIn</Label>
                                            <Input
                                                value={settings.linkedin}
                                                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                                                placeholder="https://linkedin.com/..."
                                                className="focus:border-blue-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-red-600">Youtube</Label>
                                            <Input
                                                value={settings.youtube}
                                                onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                                                placeholder="https://youtube.com/..."
                                                className="focus:border-red-600"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* API Configuration */}
                            <Card className="shadow-xl border-red-400 bg-red-200">
                                <CardHeader className="border-b border-red-400">
                                    <CardTitle className="flex items-center gap-2 text-red-700">
                                        <Key className="h-5 w-5" />
                                        Danger Zone !
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-red-700">API Key</Label>
                                            <div className="relative">
                                                <Input
                                                    type="password"
                                                    value={settings.apiKey}
                                                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                                    className="pr-24 border-red-200 focus:ring-red-500"
                                                    placeholder="Enter API key"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-600 hover:text-red-700"
                                                >
                                                    Làm mới
                                                </Button>
                                            </div>
                                            <p className="text-sm text-red-600">Không bao giờ tiết lộ thông tin API.!</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-red-700">Webhook URL</Label>
                                            <Input
                                                value={settings.webhookUrl}
                                                onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                                                className="border-red-200 focus:ring-red-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-red-700">Domain được phép</Label>
                                            <Input
                                                value={settings.allowedOrigins}
                                                onChange={(e) => setSettings({ ...settings, allowedOrigins: e.target.value })}
                                                className="border-red-200 focus:ring-red-500"
                                                placeholder="* hoặc domain cụ thể"
                                            />
                                            <p className="text-sm text-red-600">Sử dụng * cho tất cả domain hoặc liệt kê các domain cách nhau bằng dấu phẩy</p>
                                        </div>

                                    </div>

                                    <Alert className="bg-red-300 border-red-600">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertTitle className="text-red-700">Thông báo bảo mật</AlertTitle>
                                        <AlertDescription className="text-red-600">
                                            Giữ bảo mật thông tin xác thực API của bạn. Kích hoạt giới hạn tốc độ và hạn chế nguồn gốc để ngăn chặn lạm dụng.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>


                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
