"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FlowTemplate } from "@/types/flow-template";
import {
    getFlowTemplates,
    createFlowTemplate,
    updateFlowTemplate,
    deleteFlowTemplate,
} from "@/services/flowTemplateService";
import { FlowTemplateCard } from "./FlowTemplateCard";
import { ManageTemplateDialog } from "./ManageTemplateDialog";
import { LoginPromptDialog } from "./LoginPromptDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function FlowTemplatesView() {
    const [templates, setTemplates] = useState<FlowTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Dialog States
    const [manageOpen, setManageOpen] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null);

    const { user } = useSelector((state: RootState) => state.user);
    const { toast } = useToast();
    const router = useRouter();

    const isSuperAdmin = user?.role?.toLowerCase() === "superadmin";
    const isLoggedIn = !!user;

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getFlowTemplates(page, search);
            setTemplates(data.data);
            setTotalPages(data.last_page);
        } catch (error) {
            console.error("Failed to fetch templates", error);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates();
        }, 300); // 300ms debounce for search
        return () => clearTimeout(timer);
    }, [fetchTemplates]);

    // Guest Timer
    useEffect(() => {
        if (!isLoggedIn) {
            const timer = setTimeout(() => {
                setLoginPromptOpen(true);
            }, 5000); // 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    const handleCreate = () => {
        setSelectedTemplate(null);
        setManageOpen(true);
    };

    const handleEdit = (template: FlowTemplate) => {
        setSelectedTemplate(template);
        setManageOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this template?")) {
            try {
                await deleteFlowTemplate(id);
                toast({ title: "Success", description: "Template deleted successfully" });
                fetchTemplates();
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete template", variant: "destructive" });
            }
        }
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (selectedTemplate) {
                await updateFlowTemplate(selectedTemplate.id, formData);
                toast({ title: "Success", description: "Template updated successfully" });
            } else {
                await createFlowTemplate(formData);
                toast({ title: "Success", description: "Template created successfully" });
            }
            fetchTemplates();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save template", variant: "destructive" });
            throw error; // Propagate to dialog to stop loading state if needed
        }
    };

    const handleUseTemplate = (template: FlowTemplate) => {
        // Logic to use template. For now, navigate to flow creation or show success
        // Assuming we navigate to a create flow page with template ID
        // router.push(`/flows/create?template=${template.id}`);
        toast({ title: "Template Selected", description: `Selected template: ${template.title}` });
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight self-start md:self-auto">Flow Templates</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 md:flex-none">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 w-full"
                        />
                    </div>
                    {isSuperAdmin && (
                        <Button onClick={handleCreate} className="whitespace-nowrap">
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {templates.map((template) => (
                        <FlowTemplateCard
                            key={template.id}
                            template={template}
                            isSuperAdmin={isSuperAdmin}
                            isLoggedIn={isLoggedIn}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onUse={handleUseTemplate}
                        />
                    ))}
                    {templates.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-card/50">
                            <div className="bg-muted/50 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No templates found</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                {search ? "Try adjusting your search terms." : "Get started by creating your first flow template."}
                            </p>
                            {isSuperAdmin && !search && (
                                <Button onClick={handleCreate} className="mt-6" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" /> Create Template
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            <ManageTemplateDialog
                open={manageOpen}
                onOpenChange={setManageOpen}
                template={selectedTemplate}
                onSubmit={handleFormSubmit}
            />

            <LoginPromptDialog
                open={loginPromptOpen}
                onOpenChange={setLoginPromptOpen}
            />
        </div>
    );
}
