import { NavigationBar } from "@/components/layout/navigation-bar";
import Footer from "@/components/layout/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />
            <main className="pt-20 flex-1">{children}</main>
            <Footer />
        </div>
    );
}
