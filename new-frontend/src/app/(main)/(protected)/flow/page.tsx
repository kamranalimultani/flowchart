"use client";

import { FlowDetailsView } from "@/components/FlowDetailsView";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function FlowDetailsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <FlowDetailsView />
        </Suspense>
    );
}
