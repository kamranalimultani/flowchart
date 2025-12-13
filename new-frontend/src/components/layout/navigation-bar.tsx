"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Bell,
    CircleUser,
    Menu,
    Moon,
    Power,
    Sun,
    Utensils,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { handleLogout } from "@/utils/commonUtils";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

const docsCategories = {
    "Getting Started": [
        { id: "intro", title: "Introduction to Flow Survey" },
        { id: "auth", title: "Authentication & Plans" },
    ],
    "Core Features": [
        { id: "form-builder", title: "Form Template Builder" },
        { id: "flow-creation", title: "Creating Flows" },
        { id: "flow-management", title: "Managing Your Flows" },
    ],
    // additional categories...
};

import { getRequest } from "@/utils/apiUtils";
import { setUser } from "@/slice/userSlice";
import { User } from "@/types/types";

export function NavigationBar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { setTheme } = useTheme();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const docsForDropdown = React.useMemo(() => {
        return Object.entries(docsCategories).flatMap(([category, docs]) =>
            docs.map((doc) => ({ ...doc, category }))
        );
    }, []);
    const { user } = useSelector((state: RootState) => state.user);

    React.useEffect(() => {
        const checkAuth = async () => {
            const authData = localStorage.getItem("auth");
            if (authData) {
                try {
                    const { token } = JSON.parse(authData);
                    if (token) {
                        setIsLoggedIn(true);
                        // If user is not in Redux (e.g. refresh), fetch it
                        if (!user) {
                            try {
                                const userData = await getRequest<User>("/api/auth/me", true);
                                dispatch(setUser(userData));
                            } catch (error) {
                                console.error("Failed to fetch user:", error);
                                // Optional: handle logout if token invalid
                            }
                        }
                    } else {
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    console.error("Error parsing auth data:", error);
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, [user, dispatch]);

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 bg-background/95 backdrop-blur-lg border-b shadow-sm"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                    >
                        Flow Survey
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger & Sheet */}
                        <div className="flex md:hidden items-center gap-2">
                            {/* Keep User Dropdown for quick profile access on mobile if desired, or move it inside sheet. 
                                 User asked for "one hamburger to show everything". 
                                 So I will hide the separate user dropdown on mobile and put it all in the sheet.
                             */}

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                    <SheetHeader>
                                        <SheetTitle className="text-left">Menu</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4 py-4 mt-4">
                                        {isLoggedIn ? (
                                            <>
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-sm font-semibold text-muted-foreground px-2">Apps</div>
                                                    <MobileLink href="/dashboard" icon={<ArrowRight className="w-4 h-4" />}>
                                                        Analytics
                                                    </MobileLink>
                                                    <MobileLink href="/flows">Flows</MobileLink>
                                                    <MobileLink href="/forms-templates">Form Templates</MobileLink>
                                                    <MobileLink href="/flow-templates">Templates</MobileLink>

                                                    {user && (user as any).role == "admin" && (
                                                        <MobileLink href="/users">Users</MobileLink>
                                                    )}
                                                    {user && user.role?.toLowerCase() === "superadmin" && (
                                                        <MobileLink href="/admin/blogs">Manage Blogs</MobileLink>
                                                    )}

                                                    <MobileLink href="/blogs">Blogs</MobileLink>
                                                </div>

                                                <div className="border-t my-2" />

                                                <div className="flex flex-col gap-2">
                                                    <div className="text-sm font-semibold text-muted-foreground px-2">Account</div>
                                                    <div className="flex items-center gap-2 px-2 py-2">
                                                        <CircleUser className="w-5 h-5" />
                                                        <span className="font-medium">{user?.name || "User"}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
                                                        onClick={() => {
                                                            handleLogout(dispatch);
                                                            router.push("/login"); // Sheet will close automatically if we navigate, but standard sheet might need manual open state control. 
                                                            // For now assuming standard behavior (sheet stays or overlay click closes). 
                                                            // Ideally we use a controlled open state to close on click.
                                                        }}
                                                    >
                                                        <Power className="mr-2 h-4 w-4" />
                                                        Logout
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <MobileLink href="/#features">Features</MobileLink>
                                                <MobileLink href="/#pricing">Pricing</MobileLink>
                                                <MobileLink href="/blogs">Blogs</MobileLink>
                                                <MobileLink href="/flow-templates">Templates</MobileLink>
                                                {/* Docs - maybe simplified link or expandable */}
                                                <MobileLink href="/documentation?section=intro">Documentation</MobileLink>

                                                <div className="border-t my-4" />

                                                <div className="flex flex-col gap-2">
                                                    <Link href="/login" onClick={() => { }}>
                                                        <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                                                    </Link>
                                                    <Link href="/signup" onClick={() => { }}>
                                                        <Button className="w-full">Get Started</Button>
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* DESKTOP: Logged in user navigation */}
                        {isLoggedIn ? (
                            <div className="hidden md:flex items-center gap-4">
                                <NavigationMenu>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/dashboard" className={navigationMenuTriggerStyle()}>
                                                    Analytics
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/flows" className={navigationMenuTriggerStyle()}>
                                                    Flows
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/forms-templates" className={navigationMenuTriggerStyle()}>
                                                    Form Templates
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/flow-templates" className={navigationMenuTriggerStyle()}>
                                                    Templates
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        {isLoggedIn && user !== null && (user as any).role == "admin" && (
                                            <NavigationMenuItem>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/users" className={navigationMenuTriggerStyle()}>
                                                        Users{" "}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        )}
                                        {isLoggedIn && user && user.role?.toLowerCase() === "superadmin" && (
                                            <NavigationMenuItem>
                                                <NavigationMenuLink asChild>
                                                    <Link href="/admin/blogs" className={navigationMenuTriggerStyle()}>
                                                        Manage Blogs
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        )}
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/flow-templates" className={navigationMenuTriggerStyle()}>
                                                    Templates
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/blogs" className={navigationMenuTriggerStyle()}>
                                                    Blogs
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger>
                                                Documentation
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    {docsForDropdown.map((doc) => (
                                                        <ListItem
                                                            key={doc.id}
                                                            title={doc.title}
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // Navigate to docs page and pass id in URL query or route param
                                                                router.push(`/documentation?section=${doc.id}`);
                                                            }}
                                                        >
                                                            {/* Optional description if you want */}
                                                            {`Section of ${doc.category}`}
                                                        </ListItem>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Menu />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
                                            My Account
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <CircleUser className="mr-2 h-4 w-4" />
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Bell className="mr-2 h-4 w-4" />
                                            Notifications
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600"
                                            onClick={() => {
                                                handleLogout(dispatch);
                                                router.push("/login");
                                            }}
                                        >
                                            <Power className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                {/* Not logged in navigation */}
                                <NavigationMenu>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/#features" className={navigationMenuTriggerStyle()}>
                                                    Features
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/#pricing" className={navigationMenuTriggerStyle()}>
                                                    Pricing
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger>
                                                Documentation
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    {docsForDropdown.map((doc) => (
                                                        <ListItem
                                                            key={doc.id}
                                                            title={doc.title}
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // Navigate to docs page and pass id in URL query or route param
                                                                router.push(`/documentation?section=${doc.id}`);
                                                            }}
                                                        >
                                                            {/* Optional description if you want */}
                                                            {`Section of ${doc.category}`}
                                                        </ListItem>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/blogs" className={navigationMenuTriggerStyle()}>
                                                    Blogs
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/flow-templates" className={navigationMenuTriggerStyle()}>
                                                    Templates
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink asChild>
                                                <Link href="/login" className={navigationMenuTriggerStyle()}>
                                                    Sign In
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                {/* Get Started Button */}
                                <Link href="/signup">
                                    <Button>
                                        Get Started Free
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

interface MobileLinkProps extends React.PropsWithChildren {
    href: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

function MobileLink({ href, icon, children, onClick, className }: MobileLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "block py-2 px-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center gap-2",
                className
            )}
            onClick={onClick}
        >
            {icon}
            {children}
        </Link>
    );
}
