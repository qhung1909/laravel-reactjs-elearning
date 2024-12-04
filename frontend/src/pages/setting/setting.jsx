import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Save, Upload, AlertCircle, Key, Globe, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SideBarUI } from '../admin/sidebarUI';

const WebsiteSettings = () => {
    const [settings, setSettings] = useState({
        title: "My Website",
        description: "My awesome website description",
        apiKey: "sk-123456789",
        logoUrl: "/logo.png",
        bannerUrl: "/banner.jpg"
    });

    const handleSave = () => {
        console.log("Saving settings:", settings);
    };

    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="h-screen">
            <SidebarProvider>
                <SideBarUI />
                <SidebarInset>
                    <header className="absolute left-1 top-3 font-sans">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-6" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/schedule-list">Quản lý phòng Jitsi Meet</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">

                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default WebsiteSettings;