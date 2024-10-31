import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const token = localStorage.getItem('access_token');
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

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

        console.log('Mounting component for User ID:', userId);

        const channel = echo.private(`user.${userId}`);
        console.log('Subscribing to channel:', `user.${userId}`);

        channel.listen('.notification', (data) => {
            console.log('Received notification:', data);
            if (data.userId === userId) {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    data.message
                ]);
            }
        });

        return () => {
            console.log('Unsubscribing channel for User ID:', userId);
            echo.leave(`user.${userId}`);
        };
    }, [userId]);
    
    

    return (
        <div className="navbar-noti cursor-pointer ">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex">
                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/notification.svg" className="w-10" alt="" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-2xl p-3 mr-48 mt-1">
                    <div className=" w-96">
                        <div className="header">
                            <DropdownMenuLabel className="text-base text-blue-900 font-bold">
                                <div className="flex justify-between items-center">
                                    <div className="">Thông báo</div>
                                    <div className="">
                                        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/doublecheck.svg" className="w-4" alt="" />
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuItem>
                                <div className="border-yellow-400 border-b-4 pb-2 cursor-pointer flex items-center gap-3 font-semibold text-yellow-400">
                                    <p className="text-lg ">Hệ thống</p>
                                    <div className="bg-pink-100 py-1 px-2 rounded-full">
                                        <p className="">{notifications.length}</p> {/* Hiển thị số lượng thông báo */}
                                    </div>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuLabel className="flex justify-center items-center h-auto">
                                <div className="p-5">
                                    {notifications.length === 0 ? ( 
                                        <p className="text-center text-blue-900 font-medium">Chưa có thông báo nào</p>
                                    ) : (
                                        <ul>
                                            {notifications.map((notification, index) => (
                                                <li key={index} className="text-blue-900">
                                                    {notification}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </DropdownMenuLabel>
                        </div>
                    </div>  
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default NotificationDropdown;
