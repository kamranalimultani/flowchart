"use client";

import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { handleLogout } from "@/utils/commonUtils";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "store";

const docsCategories = {
  "Getting Started": [
    { id: "intro", title: "Introduction to Melvok" },
    { id: "auth", title: "Authentication & Plans" },
  ],
  "Core Features": [
    { id: "form-builder", title: "Form Template Builder" },
    { id: "flow-creation", title: "Creating Flows" },
    { id: "flow-management", title: "Managing Your Flows" },
  ],
  // additional categories...
};

export function NavigationBar() {
  const navigate = useNavigate();
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
    // Check localStorage for auth token
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error parsing auth data:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
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
            to="/"
            className="text-2xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Melvok
          </Link>

          <div className="flex items-center gap-4">
            {/* Logged in user navigation */}
            {isLoggedIn ? (
              <>
                <NavigationMenu className="hidden md:flex">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link to="/dashboard">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Analytics
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/flows">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Flows
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/forms-templates">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Form Templates
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    {isLoggedIn && user !== null && user.role == "admin" && (
                      <NavigationMenuItem>
                        <Link to="/users">
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            Users{" "}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )}
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
                                navigate(`/documentation?section=${doc.id}`);
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

                {/* Theme Toggle */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

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
                        navigate("/login");
                      }}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Not logged in navigation */}
                <NavigationMenu className="hidden md:flex">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <a href="#features">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Features
                        </NavigationMenuLink>
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a href="#pricing">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Pricing
                        </NavigationMenuLink>
                      </a>
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
                                navigate(`/documentation?section=${doc.id}`);
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
                      <a href="/blogs">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Blogs
                        </NavigationMenuLink>
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/login">
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Sign In
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Theme Toggle */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

                {/* Get Started Button */}
                <Link to="/signup">
                  <Button className="hidden md:flex">
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </>
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
