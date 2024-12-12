import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Card, CardContent } from '@/components/ui/card';
import { Bell, CheckCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from "@/components/ui/badge";

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('access_token');

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
    authEndpoint: 'http://localhost:8000/broadcasting/auth', // Sửa lại endpoint backend
    auth: {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
});

const NotificationDropdown = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const unreadCount = (notifications || []).filter(notification => !notification.is_read).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/notifications`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-secret': `${API_KEY}`,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.data.notifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (userId) {
            const channel = echo.private(`user.${userId}`);

            channel.listen('.notification', (data) => {
                console.log('Notification event received:', data);

                if (!data.notificationId || !data.message) {
                    console.error('Invalid notification data:', data);
                    return;
                }

                const newNotification = {
                    id: data.notificationId,
                    message: data.message,
                    created_at: data.timestamp || new Date().toISOString(),
                    is_read: false
                };

                console.log('Formatted notification:', newNotification);

                setNotifications(prevNotifications => {
                    console.log('Previous state:', prevNotifications);
                    const exists = prevNotifications.some(n => n.id === newNotification.id);
                    const newState = exists ? prevNotifications : [newNotification, ...prevNotifications];
                    console.log('New state:', newState);
                    return newState;
                });

                toast('Bạn có thông báo mới! Kiểm tra hộp thư của bạn!', {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        border: '1px solid red',
                        padding: '16px',
                        color: '#fff',
                        backgroundColor: '#ff4d4f',
                    },
                });
            });

            fetchNotifications();

            return () => {
                console.log('Cleaning up channel for user:', userId);
                channel.stopListening('.notification');
                echo.leave(`user.${userId}`);
            };
        }
    }, [userId]);

    const markAsRead = async (notificationId) => {
        if (!notificationId) {
            console.error("notificationId is undefined");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/notifications/read/${notificationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ notification_id: notificationId }),
            });

            const data = await response.json();
            if (response.ok) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map(notification =>
                        notification.id === notificationId ? { ...notification, is_read: true } : notification
                    )
                );
            } else {
                toast.error(data.status);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đánh dấu tin nhắn.');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/notifications/read-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Tất cả thông báo đã được đánh dấu là đã xem.');
                setNotifications((prevNotifications) =>
                    prevNotifications.map(notification => ({
                        ...notification,
                        is_read: true
                    }))
                );
            } else {
                const data = await response.json();
                toast.error(data.status || 'Có lỗi xảy ra khi đánh dấu tất cả tin nhắn.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đánh dấu tất cả tin nhắn.');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex relative">
                    <img
                        src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg"
                        className="w-10"
                        alt="notifications"
                    />
                    {unreadCount > 0 && (
                        <span className="absolute top-[-10px] right-[-5px] bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-96 p-3 xl:mr-40 lg:mr-16 md: mr-20 mt-1 rounded-2xl">
                    <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                        <div className="flex justify-between items-center">
                            <div>Thông báo</div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CheckCheck
                                            className="w-4 h-4 hover:text-blue-500 transition-colors cursor-pointer"
                                            onClick={markAllAsRead}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Đánh dấu tất cả là đã đọc</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem className="focus:bg-transparent">
                        <div className="border-yellow-400 border-b-4 pb-2 w-full flex items-center gap-3 font-semibold text-yellow-400">
                            <p className="text-lg">Hệ thống</p>
                            <Badge variant="secondary" className="bg-pink-100 text-pink-500">
                                {unreadCount}
                            </Badge>
                        </div>
                    </DropdownMenuItem>

                    <ScrollArea className="h-40 w-full">
                    {notifications.length === 0 ? (
                            <div className="p-5">
                                <p className="text-center text-blue-900 font-medium">
                                    Chưa có thông báo nào
                                    <svg width="100%" height="177" viewBox="0 0 139 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M71.5016 125.45C104.302 125.45 130.902 99.0496 130.902 66.4496C130.902 33.8496 104.302 7.44958 71.5016 7.44958C38.7016 7.44958 12.1016 33.8496 12.1016 66.4496C12.1016 99.0496 38.7016 125.45 71.5016 125.45Z" fill="#EAEEF9">
                                        </path>
                                        <path d="M117.002 58.7495V94.8495C117.002 102.35 110.902 108.45 103.302 108.45H39.9017C32.4017 108.45 26.3017 102.45 26.2017 94.9495C26.2017 94.8495 26.2017 94.8495 26.2017 94.7495V58.7495C26.2017 58.6495 26.2017 58.6495 26.2017 58.5495C26.2017 58.3495 26.2017 58.1495 26.3017 57.9495C26.4017 57.6495 26.5017 57.4495 26.6017 57.1495L43.6017 24.6495C44.2017 23.3495 45.5017 22.6495 46.9017 22.6495H96.2017C97.6017 22.6495 98.8017 23.3495 99.5017 24.6495L116.502 57.1495C116.602 57.3495 116.702 57.6495 116.802 57.9495C117.002 58.1495 117.002 58.4495 117.002 58.7495Z" fill="#D5DDEA"></path><g filter="url(#filter0_d_0_17276)"><path d="M117.002 58.7496V98.5496C117.002 104.05 112.602 108.45 107.002 108.45H36.2017C30.7017 108.45 26.2017 104.05 26.2017 98.5496V58.5496C26.2017 58.3496 26.2017 58.1496 26.3017 57.9496H49.1017C52.5017 57.9496 55.3017 60.6496 55.3017 64.1496C55.3017 65.8496 56.0017 67.4496 57.1017 68.5496C58.3017 69.7496 59.7017 70.3496 61.5017 70.3496H81.8017C85.2017 70.3496 88.0017 67.6496 88.0017 64.1496C88.0017 62.4496 88.7017 60.8496 89.8017 59.7496C91.0017 58.5496 92.4017 57.9496 94.1017 57.9496H116.802C117.002 58.1496 117.002 58.4496 117.002 58.7496Z" fill="url(#paint0_linear_0_17276)"></path></g><path d="M129.384 38.2496C131.648 38.2496 133.484 36.4139 133.484 34.1496C133.484 31.8852 131.648 30.0496 129.384 30.0496C127.119 30.0496 125.284 31.8852 125.284 34.1496C125.284 36.4139 127.119 38.2496 129.384 38.2496Z" fill="#EAEEF9"></path><path d="M125.284 24.9496C126.83 24.9496 128.084 23.696 128.084 22.1496C128.084 20.6032 126.83 19.3496 125.284 19.3496C123.737 19.3496 122.484 20.6032 122.484 22.1496C122.484 23.696 123.737 24.9496 125.284 24.9496Z" fill="#EAEEF9"></path><path d="M11.8837 34.1496C13.4301 34.1496 14.6837 32.896 14.6837 31.3496C14.6837 29.8032 13.4301 28.5496 11.8837 28.5496C10.3373 28.5496 9.08374 29.8032 9.08374 31.3496C9.08374 32.896 10.3373 34.1496 11.8837 34.1496Z" fill="#EAEEF9"></path><path d="M5.58379 95.7496C8.45567 95.7496 10.7838 93.4215 10.7838 90.5496C10.7838 87.6777 8.45567 85.3496 5.58379 85.3496C2.71191 85.3496 0.383789 87.6777 0.383789 90.5496C0.383789 93.4215 2.71191 95.7496 5.58379 95.7496Z" fill="#EAEEF9"></path><path d="M96.6216 10.6187C97.9267 24.8658 98.5792 28.1285 95.6244 41.0313C94.6635 43.8998 93.7026 47.0416 91.6435 49.2271C88.7607 52.642 83.5443 54.1446 79.2889 53.0518C74.8961 51.9591 71.327 48.1343 70.5033 43.49C69.817 40.6215 70.7779 37.2065 73.2488 35.4308C75.857 33.7916 79.5634 34.2014 81.7598 36.2504C84.2307 38.2993 85.1916 41.4411 85.0543 44.4462C84.9171 47.4513 83.8189 50.4565 82.3089 53.0518C78.8954 59.4335 77.4901 59.41 70.5034 69.8911" stroke="#ABB5CC" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="4 4"></path><path d="M104.275 5.31244C103.753 7.21624 101.666 7.90853 99.579 6.69702C97.3179 5.65858 95.7525 4.79322 96.1004 3.06249C96.6222 1.33177 98.7093 1.15869 101.144 0.985622C104.101 0.639477 104.623 3.40864 104.275 5.31244Z" fill="#DAE2EB"></path><path d="M87.4039 7.04302C88.2736 8.60068 90.7086 9.63911 92.4479 8.08146C94.3611 6.35073 95.9264 5.13922 95.0568 3.4085C94.1872 1.85084 92.7957 2.37006 89.8389 2.71621C87.4039 3.23542 86.3604 5.3123 87.4039 7.04302Z" fill="#DAE2EB"></path><path d="M95.0569 0.639542C96.2744 0.466469 97.4919 1.15876 97.8397 2.1972C98.0137 2.54334 98.1876 3.06256 98.1876 3.4087C98.5355 5.83172 97.6658 7.90859 96.2744 8.08167C94.709 8.42781 93.1437 6.69708 92.9697 4.44714C92.9697 3.75485 92.9697 3.4087 92.9697 2.88949C93.1437 1.67798 93.8394 0.812615 95.0569 0.639542C95.2308 0.639542 95.0569 0.639542 95.0569 0.639542Z" fill="#989FB0"></path><path d="M60.192 84.7092C61.4591 84.7092 62.4863 83.682 62.4863 82.4149C62.4863 81.1478 61.4591 80.1206 60.192 80.1206C58.9249 80.1206 57.8977 81.1478 57.8977 82.4149C57.8977 83.682 58.9249 84.7092 60.192 84.7092Z" fill="#989FB0"></path><path d="M83.0108 84.7092C84.278 84.7092 85.3051 83.682 85.3051 82.4149C85.3051 81.1478 84.278 80.1206 83.0108 80.1206C81.7437 80.1206 80.7166 81.1478 80.7166 82.4149C80.7166 83.682 81.7437 84.7092 83.0108 84.7092Z" fill="#989FB0"></path><path d="M75.322 99.7772H68.129C67.0129 99.7772 66.0828 98.8471 66.0828 97.731C66.0828 96.6148 67.0129 95.6847 68.129 95.6847H75.2599C76.3761 95.6847 77.3062 96.6148 77.3062 97.731C77.3682 98.8471 76.4381 99.7772 75.322 99.7772Z" fill="#989FB0"></path><defs><filter id="filter0_d_0_17276" x="4.20166" y="46.9496" width="134.8" height="94.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="11"></feOffset><feGaussianBlur stdDeviation="11"></feGaussianBlur><feColorMatrix type="matrix" values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_17276"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_17276" result="shape"></feBlend></filter><linearGradient id="paint0_linear_0_17276" x1="71.5721" y1="56.7815" x2="71.5721" y2="108.994" gradientUnits="userSpaceOnUse"><stop stopColor="#FDFEFF"></stop><stop offset="0.9964" stopColor="#ECF0F5"></stop></linearGradient></defs>
                                    </svg>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 p-2">
                                {notifications.map((notification, index) => (
                                    <Card
                                        key={index}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`transition-colors cursor-pointer border-l-4 ${notification.is_read
                                            ? "bg-gray-200 border-l-gray-400"
                                            : "bg-white hover:bg-gray-50 border-l-yellow-400"
                                            }`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex gap-3 items-start">
                                                <div className={`p-1.5 rounded-lg ${notification.is_read ? "bg-gray-300" : "bg-yellow-100"
                                                    }`}>
                                                    {notification.is_read ? (
                                                        <CheckCheck className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <Bell className="w-5 h-5 text-yellow-400" />
                                                    )}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <p className={`text-base font-medium ${notification.is_read ? "text-gray-500" : "text-blue-900"
                                                        }`}>
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-gray-500">
                                                            {notification.created_at
                                                                ? new Date(notification.created_at).toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                }) + ', ' + new Date(notification.created_at).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                                : "Thời gian không hợp lệ"}
                                                        </p>
                                                        {!notification.is_read && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs text-blue-500 hover:bg-blue-50"
                                                            >
                                                                Mới
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        {index < notifications.length - 1 && (
                                            <Separator className="my-1" />
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>

            <Toaster />
        </>
    );

};

export default NotificationDropdown;
