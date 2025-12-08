"use client";

import React, { useEffect, useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MoveLeft } from "lucide-react";
import { toast } from "sonner";
import { getRequest, postRequest, putRequest } from "@/utils/apiUtils";
import SurveyCreatorComponent from "@/components/SurveyJs/Survey"; // Ensure this path is correct
import { FlatDark } from "survey-core/themes";
import { Suspense } from "react";

const AddFormTemplateContent: React.FC = () => {
    const [creator, setCreator] = useState<SurveyCreator | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const [loading, setLoading] = useState<boolean>(true); // Start loading
    const [formData, setFormData] = useState<any>(null); // Store fetched data

    // Fetch form data if editing
    useEffect(() => {
        const fetchForm = async () => {
            if (editId) {
                try {
                    const res: any = await getRequest(`/api/form-templates/${editId}`, true);
                    // Adjust based on your API response structure. 
                    // Assuming result is { success: true, data: { ... }, ... } or just the object
                    // The FormTemplates list used res.data. 
                    // If the single fetch returns the object directly or wrapped.
                    // Let's assume it returns the object with form_data.
                    setFormData(res.form_data || res);
                } catch (error) {
                    console.error("Error fetching form:", error);
                    toast.error("Failed to load form template.");
                }
            }
            setLoading(false);
        };

        if (editId) {
            fetchForm();
        } else {
            setLoading(false);
        }
    }, [editId]);

    useEffect(() => {
        if (loading) return;

        const initializeSurveyCreator = async () => {
            const surveyCreator = new SurveyCreator();
            surveyCreator.showPreviewTab = false;
            surveyCreator.previewShowResults = false;

            if (formData) {
                surveyCreator.JSON = {
                    // If formData is the JSON object itself, use it. 
                    // If it has a property `form_data` (nested), use that.
                    // Based on `res.form_data` assignment above, we assume formData IS the survey JSON or close to it.
                    // Actually `location.state.form.form_data` was used.
                    ...(formData.form_data || formData),
                    FlatDark
                };
            }

            setCreator(surveyCreator);
        };

        initializeSurveyCreator();
    }, [loading, formData]);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const targetElement = document.querySelector(
                '[data-key="allowTypesense0"]'
            );

            if (targetElement) {
                const heading1 = document.createElement("h6");
                heading1.id = "noteHeading";
                heading1.textContent =
                    "NOTE: You cannot exclude a column that is indexed. Use comma-separated values to include multiple columns. Leave empty for default.";
                heading1.style.fontSize = "small";
                heading1.style.color = "red";

                targetElement.insertBefore(heading1, targetElement.firstChild);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    const handleSave = async () => {
        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        setLoading(true);

        if (creator) {
            const data = creator.JSON;

            if (!data.title) {
                setLoading(false);
                toast.error("Please add ledger title before Create Template.", {
                    description: "Add Template Title",
                });
                return;
            }

            let reqBody;

            if (editId) {
                reqBody = {
                    id: editId,
                    form_data: data,
                };
            } else {
                reqBody = {
                    form_data: data,
                };
            }

            try {
                await delay(1000);

                if (editId) {
                    // Original: putRequest(`/api/form-templates/${reqBody.id}`, reqBody, true);
                    await putRequest(`/api/form-templates/${editId}`, reqBody, true);
                } else {
                    await postRequest(`/api/form-templates`, reqBody, true);
                }

                setLoading(false);
                router.push("/forms-templates"); // Redirect to list
            } catch (error) {
                setLoading(false);
                console.error("Error saving form:", error);

                toast.error(
                    "An error occurred while saving the form. Please try again.",
                    {
                        description: "Error Saving Form",
                    }
                );
            }
        }
    };

    if (loading && !creator) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-[calc(100vh-80px)]">
            {/* adjusted height for layout */}
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <MoveLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold">
                        {editId ? "Update" : "Add New"} Template
                    </h1>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editId ? "Update Template" : "Save Template"}
                </Button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden p-4">
                <Card className="w-full h-full p-2 overflow-auto">
                    {creator ? (
                        <SurveyCreatorComponent creator={creator} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default function AddFormTemplate() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <AddFormTemplateContent />
        </Suspense>
    );
}
