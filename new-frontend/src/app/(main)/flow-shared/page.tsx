"use client";

import { FlowDetailsView } from "@/components/FlowDetailsView";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// This page is PUBLIC (under (main) layout, but outside (protected))
// It handles ?share_uuid=... logic inside FlowDetailsView
export default function FlowSharedPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <FlowDetailsView />
        </Suspense>
    );
}
