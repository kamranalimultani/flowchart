import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FlowTemplate } from "@/types/flow-template";

interface ManageTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template?: FlowTemplate | null; // If provided, edit mode
    onSubmit: (formData: FormData) => Promise<void>;
}

export function ManageTemplateDialog({
    open,
    onOpenChange,
    template,
    onSubmit,
}: ManageTemplateDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (template) {
            setTitle(template.title);
            setDescription(template.description || "");
            setTags(Array.isArray(template.tags) ? template.tags.join(", ") : "");
        } else {
            // Reset for create mode
            setTitle("");
            setDescription("");
            setTags("");
        }
        setXmlFile(null);
        setThumbnail(null);
    }, [template, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        if (xmlFile) {
            formData.append("xml_file", xmlFile);
        }
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            await onSubmit(formData);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{template ? "Edit Template" : "Add New Template"}</DialogTitle>
                    <DialogDescription>
                        {template
                            ? "Update the details of the flow template."
                            : "Upload a new Draw.io XML flow template."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags
                        </Label>
                        <Input
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="col-span-3"
                            placeholder="Comma separated"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="xml" className="text-right">
                            XML File
                        </Label>
                        <Input
                            id="xml"
                            type="file"
                            accept=".xml,.txt"
                            onChange={(e) => setXmlFile(e.target.files?.[0] || null)}
                            className="col-span-3"
                            required={!template} // Required only on create
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="thumbnail" className="text-right">
                            Thumbnail
                        </Label>
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
