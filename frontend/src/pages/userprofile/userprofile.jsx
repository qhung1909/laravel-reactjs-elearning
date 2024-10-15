import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Link } from "react-router-dom"
export const UserProfile = () => {
    return (
        <>
            <section className="userprofile">
                <div className="">
                    <span>Cài đặt</span>
                    <p>Manage your account settings and set e-mail preferences.</p>
                </div>
                <div className="grid grid-cols-4 gap-5">
                    <div className="col-span-1">
                        <ul>
                            <li>
                                <Link>
                                    <p>Profile</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <p>Account</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <p>Appearance</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <p>Notifications</p>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <p>Display</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-3">
                        <div className="">
                            <span>Profile</span>
                            <p>This is how others will see you on the site.</p>
                        </div>
                        <div className="">
                            <Form>
                                <form className="space-y-8">
                                    <FormField

                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="shadcn" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display name.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                    </div>

                </div>
            </section>

        </>
    )
}
