"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
            <div className="flex flex-col h-full">
                <label className="text-sm font-medium mb-2">Markdown Input</label>
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-grow font-mono text-sm resize-none p-4"
                    placeholder="Write your blog post here in Markdown..."
                />
            </div>
            <div className="flex flex-col h-full overflow-hidden border rounded-md">
                <label className="text-sm font-medium mb-2 p-2 bg-muted border-b">Preview</label>
                <div className="overflow-y-auto p-4 prose dark:prose-invert max-w-none h-full bg-card">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value || "_Nothing to preview_"}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
