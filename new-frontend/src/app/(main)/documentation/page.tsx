"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Menu, X, ChevronRight, Home, Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation"; // Updated hooks
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Define Types for Docs
type DocSection = {
    id: string;
    title: string;
    content?: string;
    category?: string;
};

const docsCategories: Record<string, DocSection[]> = {
    "Getting Started": [
        { id: "intro", title: "Introduction to Melvok" },
        { id: "auth", title: "Authentication & Plans" },
    ],
    "Core Features": [
        { id: "form-builder", title: "Form Template Builder" },
        { id: "flow-creation", title: "Creating Flows" },
        { id: "flow-management", title: "Managing Your Flows" },
    ],
    "Working with Flows": [
        { id: "canvas-editor", title: "Flow Canvas Editor" },
        { id: "assigning-forms", title: "Assigning Forms to Nodes" },
        { id: "sharing-flows", title: "Sharing & Publishing Flows" },
    ],
    "End User Guide": [
        { id: "completing-surveys", title: "Completing Flow Surveys" },
        { id: "best-practices", title: "Best Practices" },
    ],
};

const docsContent: Record<string, { title: string; content: string }> = {
    intro: {
        title: "Welcome to Melvok Documentation",
        content: `Melvok is a flow survey company that empowers users to create interactive flow diagrams (“flows”) and conduct surveys via custom forms integrated at various steps.

## What is Melvok?

Melvok lets you build surveys as visual flowcharts. Each node in your flow can represent a form, a decision point, or an informational step. This gives survey creators powerful flexibility and respondents a more engaging experience.

![Dummy Image: Melvok Platform Overview](https://via.placeholder.com/800x450?text=Melvok+Platform+Overview)

## Key Features

- Visual flowchart survey creation
- Reusable custom form templates
- Two methods to create flows: Quick create or DrawIO import
- Share flows to collect data
- Built-in analytics to gain insights

Continue to the next section to learn about signing up and plans.`,
    },
    // ... other content same as original ...
    auth: {
        title: "Authentication & Plans",
        content: `Melvok offers two signup options:

## Free Tier

- Limited to creating 3 flows during the free trial
- Access unlimited form templates
- Basic analytics and community support

## Paid Monthly Plans

- Unlimited flows and advanced form features
- Team collaboration tools
- Priority support and custom branding
- Import DrawIO diagrams
- More monthly responses and data retention

![Dummy Image: Plans Comparison](https://via.placeholder.com/800x450?text=Plans+Comparison)

Sign up at melvok.com by providing your email and choosing a plan. You can upgrade anytime from account settings.`,
    },

    "form-builder": {
        title: "Creating Form Templates in Melvok",
        content: `Melvok’s form template builder provides a visual, drag-and-drop interface to create survey forms that integrate with your flows.

## How to Create a Form Template

1. Navigate to **Form Templates** in your dashboard.
2. Click **Create New Template**.
3. Enter a name and description.
4. Use Melvok’s form elements to design your survey using:
   - Text input (single-line)
   - Text area (multi-line)
   - Number, Date pickers
   - Dropdowns, radio buttons, and checkboxes
   - Rating scales and matrix grids
   - File uploads and digital signatures (paid plans)
   - Calculated fields for values based on input (paid plans)

## Form Organization

- Multi-page support for long surveys
- Sections to group related questions
- Preview mode to test design

![Dummy Image: Form Template Builder](https://via.placeholder.com/800x450?text=Form+Template+Builder)`,
    },

    "flow-creation": {
        title: "Creating Flows",
        content: `Flows orchestrate the survey logic visually.

## Two Ways to Create Flows

1. **Quick Create:**  
   Enter a flow name and description, and Melvok generates a default welcome flow chart with main nodes (welcome, start, example form, thank you).

2. **Import DrawIO:**  
   Upload DrawIO or .xml diagram files to create complex flows from existing designs.

## Flow List Page Actions

- **Eye Button:** View and interact with the flow on the Canvas page.
- **Edit Button:** Open DrawIO editor popup to modify the flow diagram.
- **Delete Button:** Permanently delete a flow after confirmation.

![Dummy Image: Flow Creation](https://via.placeholder.com/800x450?text=Flow+Creation)`,
    },

    "flow-management": {
        title: "Managing Your Flows",
        content: `Track and maintain your flows efficiently.

## Flow Lifecycle

- Draft: Editable, not live
- Published: Live, collecting responses, minor edits allowed
- Paused: Temporarily stops new responses
- Archived: Inactive, preserved data

## Flow Settings

- General info: name, description, tags
- Access control: public, private, password-protected
- Response behavior: partial saves, multiple submissions
- Notifications and appearance customization

## Export & Backup

- Export flows (DrawIO, JSON, images)
- Export response data (CSV, Excel, JSON, PDF)
- Scheduled backups (enterprise plans)

![Dummy Image: Flow Management](https://via.placeholder.com/800x450?text=Flow+Management)`,
    },

    "canvas-editor": {
        title: "Flow Canvas Editor",
        content: `Your main workspace to design, edit, and refine flows.

## Access

- Click the eye icon on a flow for full-size view.
- Auto-opens after new flow creation.

## Features

- Pan and zoom canvas
- Multi-select nodes
- Minimap for overview
- Toolbar with flow name, status, auto-save, zoom, layout, validate, publish

## Node Palette

- Start, Form, Decision, Display, End nodes
- Advanced nodes: Delay, API (enterprise), Redirect, Calculate

![Dummy Image: Canvas Editor](https://via.placeholder.com/800x450?text=Canvas+Editor)`,
    },

    "assigning-forms": {
        title: "Assigning Forms to Nodes",
        content: `After designing your forms and creating flows, assign one or more form templates to nodes in the flow.

## How to Assign

- Click a user node on the Canvas page.
- The sidebar will open showing all available form templates.
- Check the boxes to assign multiple forms to the node.
- Each assigned form displays an eye button for preview.

![Dummy Image: Assigning Forms](https://via.placeholder.com/800x450?text=Assigning+Forms+to+Nodes)`,
    },

    "sharing-flows": {
        title: "Sharing & Publishing Flows",
        content: `Administrators with paid plans can share flows for data collection.

## How Sharing Works

- Share the URL of the flow with end users.
- End users see the flow without form assignment checkboxes.
- They click the eye icon on assigned forms at nodes to fill them.
- Upon submission, the form ends and users proceed until completing the survey flow.

![Dummy Image: Sharing Flows](https://via.placeholder.com/800x450?text=Sharing+Flows)`,
    },

    "completing-surveys": {
        title: "Completing Flow Surveys",
        content: `End users complete surveys by interacting with shared flows.

- Users open the shared URL.
- Click nodes to reveal assigned forms.
- Fill and submit forms via the eye icon preview.
- Complete all nodes to finish the survey.

This streamlined interface removes assignment controls to ensure a focused survey experience.

![Dummy Image: Completing Surveys](https://via.placeholder.com/800x450?text=Completing+Surveys)`,
    },

    "best-practices": {
        title: "Best Practices",
        content: `To get the most from Melvok:

- Use descriptive names for flows and form templates.
- Keep forms concise and logically grouped.
- Leverage conditional logic and multi-page forms for usability.
- Test thoroughly using preview before publishing.
- Ensure mobile responsiveness.
- Regularly analyze flow analytics to improve surveys.

![Dummy Image: Best Practices](https://via.placeholder.com/800x450?text=Best+Practices)`,
    },
};

function MelvokDocsContent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    const sectionFromUrl = searchParams.get("section") || "intro";
    const [activeDoc, setActiveDoc] = React.useState(sectionFromUrl);

    const currentDoc = docsContent[activeDoc] || docsContent.intro;

    const getCurrentCategoryDocs = () => {
        for (const [category, docs] of Object.entries(docsCategories)) {
            if (docs.some((d) => d.id === activeDoc)) return docs;
        }
        return [];
    };

    useEffect(() => {
        if (sectionFromUrl && sectionFromUrl !== activeDoc) {
            setActiveDoc(sectionFromUrl);
        }
    }, [sectionFromUrl]); // Simplified dependency

    const handleNext = () => {
        const docsInCategory = getCurrentCategoryDocs();
        const currentIndex = docsInCategory.findIndex((d) => d.id === activeDoc);
        if (currentIndex >= 0 && currentIndex < docsInCategory.length - 1) {
            const nextId = docsInCategory[currentIndex + 1].id;
            setActiveDoc(nextId);
            router.push(`/documentation?section=${nextId}`); // Update URL
        }
    };

    const renderMarkdown = (text: string) => {
        return text.split("\n").map((line, i) => {
            if (line.startsWith("### ")) {
                return (
                    <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                        {line.slice(4)}
                    </h3>
                );
            }
            if (line.startsWith("## ")) {
                return (
                    <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                        {line.slice(3)}
                    </h2>
                );
            }
            if (line.startsWith("# ")) {
                return (
                    <h1 key={i} className="text-3xl font-bold mb-6">
                        {line.slice(2)}
                    </h1>
                );
            }
            if (line.startsWith("- ")) {
                return (
                    <li key={i} className="ml-6 mb-2 list-disc">
                        {line.slice(2)}
                    </li>
                );
            }
            if (line.match(/^\*\*(.+?)\*\*/)) {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={i} className="mb-3">
                        {parts.map((part, j) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                                return (
                                    <strong key={j} className="font-semibold">
                                        {part.slice(2, -2)}
                                    </strong>
                                );
                            }
                            return part;
                        })}
                    </p>
                );
            }
            if (line.trim() === "") {
                return <div key={i} className="h-2" />;
            }
            // Simple Image handling in markdown
            if (line.includes("![") && line.includes("](")) {
                const alt = line.substring(line.indexOf("![") + 2, line.indexOf("]"));
                const src = line.substring(line.indexOf("](") + 2, line.indexOf(")"));
                return (
                    <div key={i} className="my-4">
                        <img src={src} alt={alt} className="rounded-lg shadow-sm max-w-full h-auto" />
                    </div>
                );
            }

            return (
                <p key={i} className="mb-3 leading-relaxed">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-background"> {/* Adjusted height to account for fixed navbar approx 80px */}
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-72" : "w-0"
                    } bg-background border-r overflow-hidden transition-all duration-300 border-border`}
            >
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">Melvok Docs</h1>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <nav className="space-y-6">
                        {Object.entries(docsCategories).map(([category, docs]) => (
                            <div key={category}>
                                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                                    {category}
                                </h3>
                                <ul className="space-y-1">
                                    {docs.map((doc) => (
                                        <li key={doc.id}>
                                            <button
                                                onClick={() => {
                                                    setActiveDoc(doc.id);
                                                    router.push(`/documentation?section=${doc.id}`);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeDoc === doc.id
                                                    ? "font-medium bg-secondary text-secondary-foreground"
                                                    : "hover:bg-muted"
                                                    }`}
                                            >
                                                {doc.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-8 py-8">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="mb-6 flex items-center gap-2 transition-colors hover:underline"
                        aria-expanded={sidebarOpen}
                        aria-controls="sidebar"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">
                            {sidebarOpen ? "Close" : "Open"} Menu
                        </span>
                    </button>

                    <article className="bg-card rounded-xl shadow-sm p-8 border border-border">
                        <div className="prose dark:prose-invert max-w-none">
                            {renderMarkdown(currentDoc.content)}
                        </div>

                        <div className="mt-12 pt-6 border-t border-border">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => {
                                        setActiveDoc("intro");
                                        router.push(`/documentation?section=intro`);
                                    }}
                                    className="flex items-center gap-2 transition-colors hover:underline"
                                >
                                    <Home className="w-4 h-4" />
                                    <span className="text-sm font-medium">Back to Home</span>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 transition-colors hover:underline"
                                >
                                    <span className="text-sm font-medium">Next Section</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </article>

                    <footer className="mt-8 text-center text-sm text-muted-foreground">
                        <p>© 2024 Melvok. All rights reserved.</p>
                    </footer>
                </div>
            </main>
        </div>
    );

}

export default function MelvokDocs() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <MelvokDocsContent />
        </Suspense>
    );
}
