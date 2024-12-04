import React, { useState } from 'react'
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

export default function ManageFooter() {
    const [settings, setSettings] = useState({
        title: "My Website",
        description: "My awesome website description",
        timezone: "UTC+07:00",
        language: "vi",

        logoUrl: "/logo.png",
        favicon: "/favicon.ico",
        primaryColor: "#EAB308",
        secondaryColor: "#CA8A04",

        metaTitle: "",
        metaDescription: "",
        googleAnalyticsId: "",
        facebookPixelId: "",

        email: "contact@example.com",
        phone: "+84123456789",
        address: "123 Street, City, Country",
        workingHours: "Mon-Fri: 9:00 AM - 5:00 PM",

        bannerUrl: "/banner.jpg",
        defaultThumbnail: "/thumbnail.jpg",
        maxUploadSize: 5,
        allowedFileTypes: ["jpg", "png", "pdf"],

        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",

        apiKey: "sk-123456789",
        webhookUrl: "",
        allowedOrigins: "*",
        rateLimit: 100
    });

    const handleSave = () => {
        console.log("Saving settings:", settings);
    };

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

                <div className="absolute top-14 px-6 bg-gray-50 w-full font-sans">


                    {/* Content */}
                    <div className="p-6 space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Website Settings</h1>
                        </div>

                        <div className="grid gap-8">
                            {/* General Settings */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        General Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Website Title</Label>
                                        <Input
                                            value={settings.title}
                                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={settings.description}
                                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Timezone</Label>
                                        <Select
                                            value={settings.timezone}
                                            onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UTC+07:00">UTC+07:00</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Select
                                            value={settings.language}
                                            onValueChange={(value) => setSettings({ ...settings, language: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vi">Tiếng Việt</SelectItem>
                                                <SelectItem value="en">English</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Branding */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brush className="h-5 w-5" />
                                        Branding
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label>Logo</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                                                    <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full p-2" />
                                                </div>
                                                <Button variant="outline">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Logo
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label>Favicon</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                                                    <img src={settings.favicon} alt="Favicon" className="max-w-full max-h-full p-2" />
                                                </div>
                                                <Button variant="outline">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Favicon
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Primary Color</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="color"
                                                    value={settings.primaryColor}
                                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                    className="w-16 h-10 p-1"
                                                />
                                                <Input
                                                    value={settings.primaryColor}
                                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Secondary Color</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="color"
                                                    value={settings.secondaryColor}
                                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                    className="w-16 h-10 p-1"
                                                />
                                                <Input
                                                    value={settings.secondaryColor}
                                                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-5 w-5" />
                                        SEO Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Meta Title</Label>
                                            <Input
                                                value={settings.metaTitle}
                                                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                                            />
                                            <p className="text-sm text-gray-500">Recommended: 50-60 characters</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Meta Description</Label>
                                            <Textarea
                                                value={settings.metaDescription}
                                                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                                className="min-h-[100px]"
                                            />
                                            <p className="text-sm text-gray-500">Recommended: 150-160 characters</p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Google Analytics ID</Label>
                                            <Input
                                                value={settings.googleAnalyticsId}
                                                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                                placeholder="UA-XXXXXXXXX-X"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Facebook Pixel ID</Label>
                                            <Input
                                                value={settings.facebookPixelId}
                                                onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                                                placeholder="XXXXXXXXXXXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5" />
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Email Address</Label>
                                            <Input
                                                type="email"
                                                value={settings.email}
                                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <Input
                                                value={settings.phone}
                                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Address</Label>
                                            <Textarea
                                                value={settings.address}
                                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Working Hours</Label>
                                            <Input
                                                value={settings.workingHours}
                                                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Media */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Media Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label>Banner Image</Label>
                                            <div className="flex flex-col gap-4">
                                                <div className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                                                    <img src={settings.bannerUrl} alt="Banner" className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={settings.bannerUrl}
                                                        onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
                                                        placeholder="Enter banner URL"
                                                    />
                                                    <Button variant="outline">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label>Default Thumbnail</Label>
                                            <div className="flex flex-col gap-4">
                                                <div className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                                                    <img src={settings.defaultThumbnail} alt="Default Thumbnail" className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={settings.defaultThumbnail}
                                                        onChange={(e) => setSettings({ ...settings, defaultThumbnail: e.target.value })}
                                                        placeholder="Enter thumbnail URL"
                                                    />
                                                    <Button variant="outline">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Max Upload Size (MB)</Label>
                                            <Input
                                                type="number"
                                                value={settings.maxUploadSize}
                                                onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Allowed File Types</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {settings.allowedFileTypes.map((type) => (
                                                    <div key={type} className="rounded-full bg-yellow-50 px-3 py-1 text-sm text-yellow-700">
                                                        .{type}
                                                    </div>
                                                ))}
                                                <Button variant="outline" size="sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Type
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Media */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Share2 className="h-5 w-5" />
                                        Social Media Links
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                                            <div key={platform} className="space-y-2">
                                                <Label className="capitalize">{platform}</Label>
                                                <Input
                                                    value={settings[platform]}
                                                    onChange={(e) => setSettings({ ...settings, [platform]: e.target.value })}
                                                    placeholder={`https://${platform}.com/...`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* API Configuration */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Key className="h-5 w-5" />
                                        API Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>API Key</Label>
                                            <div className="relative">
                                                <Input
                                                    type="password"
                                                    value={settings.apiKey}
                                                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                                    className="pr-24"
                                                    placeholder="Enter API key"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-yellow-600 hover:text-yellow-700"
                                                >
                                                    Regenerate
                                                </Button>
                                            </div>
                                            <p className="text-sm text-gray-500">Never share your API key publicly</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Webhook URL</Label>
                                            <Input
                                                value={settings.webhookUrl}
                                                onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Allowed Origins</Label>
                                            <Input
                                                value={settings.allowedOrigins}
                                                onChange={(e) => setSettings({ ...settings, allowedOrigins: e.target.value })}
                                                placeholder="* or specific domains"
                                            />
                                            <p className="text-sm text-gray-500">Use * for all origins or comma-separated domains</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rate Limit (requests/min)</Label>
                                            <Input
                                                type="number"
                                                value={settings.rateLimit}
                                                onChange={(e) => setSettings({ ...settings, rateLimit: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <Alert className="bg-yellow-50 border-yellow-200">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <AlertTitle>Security Notice</AlertTitle>
                                        <AlertDescription className="text-yellow-600">
                                            Keep your API credentials secure. Enable rate limiting and restrict origins to prevent abuse.
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
