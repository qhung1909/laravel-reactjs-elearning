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

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('access_token');

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    forceTLS: false,
    auth: {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
});

const NotificationDropdown = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(notification => !notification.is_read).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/notifications`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications);
                } else {
                    console.error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        if (userId) {
            const channel = echo.private(`user.${userId}`);
            channel.listen('.notification', (data) => {
                if (data.userId === userId) {
                    setNotifications((prevNotifications) => [
                        {
                            id: data.notificationId,
                            message: typeof data.message === 'string' ? data.message : JSON.stringify(data.message),
                            timestamp: data.timestamp,
                            is_read: false
                        },
                        ...prevNotifications

                    ]);
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
                }
            });

            return () => {
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

                <DropdownMenuContent className="w-96 p-3 mr-48 mt-1 rounded-2xl">
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

                    <ScrollArea className="h-[300px] w-full">
                        {notifications.length === 0 ? (
                            <div className="p-5">
                                <p className="text-center text-blue-900 font-medium">
                                    Chưa có thông báo nào
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
