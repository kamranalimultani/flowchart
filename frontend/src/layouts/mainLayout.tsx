import React from "react";
import { Separator } from "@/components/ui/separator";
import { NavigationBar } from "./navigationBar";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}
const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen  ">
      {/* Navigation Bar */}
      <div className="w-full  z-30 bg-background">
        <NavigationBar />
        <Separator className="mt-4" />
        <main className="w-full pt-20">
          <div className="">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;
