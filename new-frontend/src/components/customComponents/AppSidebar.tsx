"use client";
import { ChevronUp, User, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React from "react";

import Link from "next/link";

// Define props for the AppSidebar component
interface AppSidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void; // Function to set the sidebar state
  children: React.ReactNode; // This allows any valid React children
}
// Define the structure for menu items
export const AppSidebar: React.FC<AppSidebarProps> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar className="mt-24">
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-90px)]">
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {" "}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/`}>
                        <User className="w-5 h-5" />
                        <span>Dashbaord</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="mb-24">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span className="capitalize">Account </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="w-screen ">
        <SidebarTrigger className="mt-24 z-59 absolute" />
        <div className="mt-24 ">{children}</div>
      </main>
    </SidebarProvider>
  );
};
