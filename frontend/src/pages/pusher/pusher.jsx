import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast'; // Import react-hot-toast
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from '@/components/ui/card';
import { Bell, CheckCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from "@/components/ui/badge";

const token = localStorage.getItem('access_token');
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
const API_URL = import.meta.env.VITE_API_URL;

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

    useEffect(() => {
        if (!userId) {
            console.error('User ID is undefined, cannot subscribe to Pusher channel.');
            return;
        }

        const channel = echo.private(`user.${userId}`);

        channel.listen('.notification', (data) => {
            if (data.userId === userId) {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    data.message
                ]);

                toast('Bạn có thông báo mới!, kiểm tra hộp thư của bạn!', {
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
    }, [userId]);
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${API_URL}/notifications/read`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
                },
                body: JSON.stringify({ notification_id: notificationId }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.status);
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
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex">
                    <img
                        src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg"
                        className="w-10"
                        alt="notifications"
                    />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-96 p-3 mr-48 mt-1 rounded-2xl">
                    <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                        <div className="flex justify-between items-center">
                            <div>Thông báo</div>
                            <CheckCheck className="w-4 h-4 hover:text-blue-500 transition-colors cursor-pointer" />
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuItem className="focus:bg-transparent">
                        <div className="border-yellow-400 border-b-4 pb-2 w-full flex items-center gap-3 font-semibold text-yellow-400">
                            <p className="text-lg">Hệ thống</p>
                            <Badge variant="secondary" className="bg-pink-100 text-pink-500">
                                {notifications.length}
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
                                        className="bg-white hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-yellow-400"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex gap-3 items-start">
                                                <div className="bg-yellow-100 p-1.5 rounded-lg">
                                                    <Bell className="w-5 h-5 text-yellow-400" />
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <p className="text-base font-medium text-blue-900">{notification}</p>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-gray-500">Vừa xong</p>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs text-blue-500 hover:bg-blue-50"
                                                        >
                                                            Mới
                                                        </Badge>
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
