import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { SideBarUI } from '../sidebarUI'
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

export default function ManageFooter() {
    const [footerItems, setFooterItems] = useState([
        { id: 1, text: 'Về chúng tôi', link: '/about' },
        { id: 2, text: 'Điều khoản sử dụng', link: '/terms' },
        { id: 3, text: 'Chính sách bảo mật', link: '/privacy' },
        { id: 4, text: 'Liên hệ', link: '/contact' },
    ])

    const [editingId, setEditingId] = useState(null)
    const [editingValues, setEditingValues] = useState({ text: '', link: '' })

    const handleEdit = (id) => {
        const itemToEdit = footerItems.find(item => item.id === id)
        setEditingId(id)
        setEditingValues({ text: itemToEdit.text, link: itemToEdit.link })
    }

    const handleSave = () => {
        setFooterItems(footerItems.map(item =>
            item.id === editingId ? { ...item, ...editingValues } : item
        ))
        setEditingId(null)
    }

    const handleCancel = () => {
        setEditingId(null)
    }

    const handleDelete = (id) => {
        setFooterItems(footerItems.filter(item => item.id !== id))
    }

    const handleAdd = () => {
        const newItem = { id: Date.now(), text: 'Mục mới', link: '#' }
        setFooterItems([...footerItems, newItem])
        handleEdit(newItem.id)
    }




    return (
        <SidebarProvider>
            <SideBarUI />
            <SidebarInset>
                <header className="z-10 absolute left-1 top-3">
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
                                        Quản lý khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="absolute top-14 px-6 bg-gray-50 w-full">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-between items-start">
                            {footerItems.map((item) => (
                                <div key={item.id} className="w-full sm:w-auto mb-4 sm:mb-0">
                                    {editingId === item.id ? (
                                        <div className="flex flex-col space-y-2">
                                            <Input
                                                value={editingValues.text}
                                                onChange={(e) => setEditingValues({ ...editingValues, text: e.target.value })}
                                                placeholder="Tên hiển thị"
                                                className="w-full sm:w-48"
                                            />
                                            <Input
                                                value={editingValues.link}
                                                onChange={(e) => setEditingValues({ ...editingValues, link: e.target.value })}
                                                placeholder="Đường dẫn"
                                                className="w-full sm:w-48"
                                            />
                                            <div className="flex space-x-2">
                                                <Button size="sm" onClick={handleSave}>
                                                    <Check className="h-4 w-4 mr-1" /> Lưu
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                                    <X className="h-4 w-4 mr-1" /> Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <a href={item.link} className="text-gray-600 hover:text-gray-900">
                                                {item.text}
                                            </a>
                                            <Button size="icon" variant="ghost" onClick={() => handleEdit(item.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAdd}>
                                <Plus className="h-4 w-4 mr-2" /> Thêm mục mới
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
