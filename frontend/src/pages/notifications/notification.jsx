import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { Bell, Search, MoreHorizontal, Eye, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function TaskList() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(0)
    const API_URL = import.meta.env.VITE_API_URL
    const location = useLocation()
    const navigate = useNavigate()
  
    const fetchNotifications = async (page = 1) => {
      const token = localStorage.getItem('access_token')
      try {
        const response = await fetch(`${API_URL}/auth/notifications?per_page=${tasksPerPage}&page=${page}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
  
        if (response.ok) {
          const data = await response.json()
          setTasks(data.notifications)
          setTotalPages(data.last_page)
          setCurrentPage(data.current_page)
        } else {
          console.error('Failed to fetch notifications:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }
  
    useEffect(() => {
      const params = new URLSearchParams(location.search)
      const page = parseInt(params.get('page')) || 1
      const per_page = parseInt(params.get('per_page')) || tasksPerPage
  
      setCurrentPage(page)
      fetchNotifications(page)
    }, [location.search])
  
    const handleNotificationClick = async (notificationId) => {
      const token = localStorage.getItem('access_token')
  
      await fetch(`${API_URL}/auth/notifications/read/${notificationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      navigate(`/notifications/${notificationId}`);
    };
  
    const filteredTasks = tasks.filter(task =>
      task.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
  
    const TaskSkeleton = () => (
      <TableRow>
        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      </TableRow>
    )
  
    const handlePageChange = (page) => {
      setCurrentPage(page)
      const params = new URLSearchParams(location.search)
      params.set('page', page)
      params.set('per_page', tasksPerPage)
      navigate({ search: params.toString() })
    }
  
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-3xl font-bold">Thông báo</CardTitle>
          <Bell className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-2 bg-secondary p-2 rounded-md">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thông báo..."
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary">
                    <TableHead className="w-12 font-bold">#</TableHead>
                    <TableHead className="w-[100px] font-bold">ID</TableHead>
                    <TableHead className="font-bold">Nội dung</TableHead>
                    <TableHead className="w-[120px] font-bold">Trạng thái</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(8).fill(0).map((_, index) => <TaskSkeleton key={index} />)
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                      <TableRow
                        key={task.id}
                        className={task.is_read === 0 ? "bg-red-50 hover:bg-red-100 cursor-pointer" : "bg-green-50 hover:bg-green-100 cursor-pointer"}
                        onClick={() => handleNotificationClick(task.id)} 
                      >
                        <TableCell>{(currentPage - 1) * tasksPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium">
                          <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                            {task.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{task.message}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.is_read === 0 ? "destructive" : "success"} 
                            className="w-24 justify-center py-1"
                          >
                            {task.is_read === 0 ? "Chưa đọc" : "Đã đọc"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Xóa</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Không có thông báo nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <Pagination>
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink 
                      href="#"
                      className={currentPage === index + 1 ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    )
  }