import React, { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Clock, MoreHorizontal } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchNotifications = async () => {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/auth/notifications`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            setTasks(data.notifications);
        } else {
            console.error('Failed to fetch notifications:', response.statusText);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Thông báo</h2>
                    <p className="text-muted-foreground">
                        Toàn bộ thông báo nằm ở đây!
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder="Tìm kiếm thông báo..."
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    </div>
                </div>
                <div className="rounded-md border">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead className="w-[100px]">Tên thông báo</TableHead>
                                    <TableHead>Tiêu đề</TableHead>
                                    <TableHead className="w-[100px]">Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(tasks) && tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <TableRow
                                            key={task.id}
                                            className={task.is_read === 0 ? "bg-red-100" : "bg-green-100"}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <span>{task.id}</span>
                                                    <Badge variant="outline" className={
                                                        task.priority === "low" ? "bg-green-500/10" :
                                                            task.priority === "medium" ? "bg-yellow-500/10" :
                                                                task.priority === "high" ? "bg-red-500/10" :
                                                                    ""
                                                    }>
                                                        {task.type}
                                                    </Badge>                                                </div>
                                            </TableCell>
                                            <TableCell>{task.message}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {task.is_read === 0 && (
                                                        <Badge variant="outline" className="bg-green-500/10">
                                                            Chưa đọc
                                                        </Badge>
                                                    )}
                                                    {task.is_read === 1 && (
                                                        <Badge variant="outline" className="bg-green-500/10">
                                                            Đã đọc
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            Không có thông báo nào.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
