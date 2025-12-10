import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LoginPromptDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoginPromptDialog({ open, onOpenChange }: LoginPromptDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Want to use these templates?</DialogTitle>
                    <DialogDescription>
                        Create an account or log in to use these premium flow templates for your projects.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Link href="/login" className="w-full sm:w-auto">
                        <Button className="w-full">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/signup" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">
                            Sign Up
                        </Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
