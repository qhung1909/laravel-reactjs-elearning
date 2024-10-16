import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
Command,
CommandEmpty,
CommandGroup,
CommandInput,
CommandItem,
CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"

import React from "react"
export const UserAccount = () => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const language = [
        {
          value: "tiengAnh",
          label: "Tiếng Anh",
        },
        {
          value: "tiengViet",
          label: "Tiếng Việt",
        }
      ]
    return (
        <>
            <section className="useraccount my-10 mx-auto  px-4 lg:px-10 xl:px-20">
                <div className="border border-gray-200 rounded-xl px-10 py-5 shadow-lg">
                    <div className="py-5 border-b">
                        <span className="font-semibold text-xl">Cài đặt</span>
                        <p className="text-gray-500 text-sm">Quản lý cài đặt tài khoản của bạn</p>
                    </div>
                    <div className="lg:grid grid-cols-4 gap-5 ">
                        <div className="col-span-1 my-3 lg:my-5 ">
                            <ul className="gap-3 text-sm font-medium max-lg:items-center flex lg:flex-col">
                                <li className=" py-1 lg:py-1 px-3 rounded-md">
                                    <Link to="/userprofile" className="hover:underline">
                                        <p>Hồ sơ cá nhân</p>
                                    </Link>
                                </li>
                                <li className="bg-gray-100  py-3 lg:py-1 px-3 rounded-md">
                                    <Link  to="/useraccount">
                                        <p>Tài khoản</p>
                                    </Link>
                                </li>
                                {/* <li className="py-1 px-3 rounded-md">
                                    <Link className="hover:underline" to="/userappearance">
                                        <p>Giao diện</p>
                                    </Link>
                                </li> */}
                                <li className="py-3 lg:py-1 px-3 rounded-md">
                                    <Link className="hover:underline" to="/usernoti">
                                        <p>Thông báo</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-3 my-3 lg:my-5">
                            <div className="border-b pb-5">
                                <span className="font-medium">Tài khoản</span>
                                <p className="text-sm text-gray-500 ">Thiết lập tài khoản của bạn.</p>
                            </div>
                            <div className="my-5">
                                <form action="">
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Họ tên</Label>
                                            <Input placeholder="Nhập tên của bạn..." className="text-xs"></Input>
                                            <p className="text-xs text-gray-500">Tên này sẽ được hiển thị ở hồ sơ của bạn</p>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Sinh nhật</Label>
                                            <input type="date" className="border p-2 w-[40%] rounded-lg" />

                                            <p className="text-xs text-gray-500">Bạn có thể cập nhật ngày sinh của bạn tại đây.</p>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className="space-y-2">
                                            <Label className="font-medium text-sm">Ngôn ngữ</Label>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-[200px] justify-between"
                                                    >
                                                        {value
                                                            ? language.find((framework) => framework.value === value)?.label
                                                            : "Chọn ngôn ngữ..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search framework..." />
                                                        <CommandList>
                                                            <CommandEmpty>No framework found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {language.map((framework) => (
                                                                    <CommandItem
                                                                        key={framework.value}
                                                                        value={framework.value}
                                                                        onSelect={(currentValue) => {
                                                                            setValue(currentValue === value ? "" : currentValue)
                                                                            setOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                value === framework.value ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {framework.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <p className="text-xs text-gray-500">Bạn có thể chọn ngôn ngữ bạn muốn tại đây</p>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="">
                                            <Button className="text-xs px-3 hover:text-white duration-300">Update tài khoản</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}
