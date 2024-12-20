import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarUI } from "./sidebarUI"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

export const Example = () => {
    return (
        <>
            <SidebarProvider>
                <SideBarUI />
                <SidebarInset>
                    <header className="absolute left-1 top-3">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">
                                            Trang chủ
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    {/* them noi dung vao day */}
                    <div>Example</div>
                    {/*=======================*/}

                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
