"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.user);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check localStorage for auth token
        if (typeof window !== "undefined") {
            const authData = localStorage.getItem("auth");
            if (!authData && !user) {
                router.push("/login"); // Redirect to login if no auth
            } else {
                setAuthorized(true);
            }
        }
    }, [user, router]);

    // While checking, render nothing or a loader
    if (!authorized) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Or return null
    }

    return <>{children}</>;
}
