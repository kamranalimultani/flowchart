import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  BookOpen,
  Zap,
  Code,
  Settings,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy documentation sections
const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    subsections: [
      { id: "introduction", title: "Introduction" },
      { id: "installation", title: "Installation" },
      { id: "quick-start", title: "Quick Start Guide" },
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    icon: Zap,
    subsections: [
      { id: "flows", title: "Understanding Flows" },
      { id: "nodes", title: "Working with Nodes" },
      { id: "triggers", title: "Triggers & Events" },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Code,
    subsections: [
      { id: "authentication", title: "Authentication" },
      { id: "endpoints", title: "API Endpoints" },
      { id: "webhooks", title: "Webhooks" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    icon: Settings,
    subsections: [
      { id: "environment", title: "Environment Setup" },
      { id: "integrations", title: "Third-party Integrations" },
      { id: "advanced", title: "Advanced Settings" },
    ],
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    subsections: [
      { id: "best-practices", title: "Security Best Practices" },
      { id: "encryption", title: "Data Encryption" },
      { id: "compliance", title: "Compliance" },
    ],
  },
];

// Dummy markdown content
const markdownContent = `
# Getting Started with MelvokFlow

Welcome to MelvokFlow! This comprehensive guide will help you understand and leverage the full power of our workflow automation platform.

## Introduction

MelvokFlow is a cutting-edge workflow automation platform designed to streamline your business processes without writing a single line of code. Whether you're automating simple tasks or building complex multi-step workflows, MelvokFlow provides the tools you need.

### Key Features

- **Visual Flow Builder**: Drag-and-drop interface for creating workflows
- **Real-time Analytics**: Monitor and optimize your workflows
- **Enterprise Security**: Bank-level encryption and compliance
- **Extensive Integrations**: Connect with 100+ popular services
- **Scalable Infrastructure**: Handle millions of executions per month

## Installation

Getting started with MelvokFlow is quick and easy. Follow these steps:

### Step 1: Create an Account

Visit our [signup page](https://melvokflow.com/signup) and create your free account. You'll get:

- 1,000 free executions per month
- Access to all core features
- 24/7 community support

### Step 2: Install the CLI (Optional)

For advanced users, install our command-line interface:

\`\`\`bash
npm install -g @melvokflow/cli
melvokflow login
\`\`\`

### Step 3: Create Your First Flow

1. Navigate to the **Flows** section
2. Click **"Create New Flow"**
3. Choose a template or start from scratch
4. Add nodes and configure triggers
5. Test and deploy your flow

## Quick Start Guide

Let's create a simple automation workflow that sends a Slack notification when a new form is submitted.

### Creating a Form Trigger

1. In the Flow Builder, drag a **Form Trigger** node to the canvas
2. Configure the form fields:
   - Name (Text)
   - Email (Email)
   - Message (Textarea)
3. Save the form configuration

### Adding a Slack Action

1. Drag a **Slack** node after your trigger
2. Connect the Form Trigger to the Slack node
3. Authenticate with your Slack workspace
4. Configure the message template:

\`\`\`
New form submission from {{form.name}}
Email: {{form.email}}
Message: {{form.message}}
\`\`\`

### Testing Your Flow

Click the **Test** button to simulate a form submission. You should see:

- ✅ Form trigger activated
- ✅ Slack message sent successfully
- ✅ Execution completed in < 2s

## Understanding Flows

A **Flow** is a sequence of connected nodes that automate a specific process. Each flow consists of:

### 1. Triggers

Triggers start your flow execution. Common trigger types include:

- **Webhook**: HTTP requests from external services
- **Schedule**: Time-based execution (cron)
- **Form**: User form submissions
- **Email**: Incoming email messages
- **Database**: Database changes

### 2. Actions

Actions perform operations within your flow:

- **Send Email**: Automated email notifications
- **HTTP Request**: Call external APIs
- **Database Query**: Read/write data
- **Transform Data**: Manipulate and format data
- **Conditional Logic**: If/else branching

### 3. Connections

Connections link nodes together and pass data between them. You can:

- Map input/output fields
- Transform data in transit
- Add conditional routing
- Handle errors gracefully

## API Reference

MelvokFlow provides a comprehensive REST API for programmatic access to all platform features.

### Authentication

All API requests require authentication using an API key:

\`\`\`bash
curl -X GET https://api.melvokflow.com/v1/flows \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

### Create a Flow

\`\`\`javascript
POST /v1/flows

{
  "name": "My Automated Flow",
  "description": "Automates customer onboarding",
  "trigger": {
    "type": "webhook",
    "config": {
      "method": "POST"
    }
  },
  "nodes": [
    {
      "id": "send-email",
      "type": "email",
      "config": {
        "to": "{{trigger.email}}",
        "subject": "Welcome!",
        "body": "Thanks for signing up!"
      }
    }
  ]
}
\`\`\`

### Execute a Flow

\`\`\`javascript
POST /v1/flows/{flowId}/execute

{
  "input": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
\`\`\`

## Best Practices

### Performance Optimization

1. **Use Batching**: Process multiple items in a single execution
2. **Cache Results**: Store frequently accessed data
3. **Optimize Queries**: Use indexes and limit result sets
4. **Async Operations**: Use webhooks for long-running tasks

### Error Handling

Always implement proper error handling:

\`\`\`javascript
{
  "errorHandling": {
    "retry": {
      "enabled": true,
      "maxAttempts": 3,
      "backoff": "exponential"
    },
    "onError": "notify-admin"
  }
}
\`\`\`

### Security Guidelines

- **Never hardcode secrets**: Use environment variables
- **Validate inputs**: Sanitize all user-provided data
- **Use HTTPS**: Always encrypt data in transit
- **Rotate credentials**: Regular key rotation policy
- **Monitor access**: Enable audit logs

## Need Help?

### Community Resources

- 📚 [Knowledge Base](https://docs.melvokflow.com)
- 💬 [Community Forum](https://community.melvokflow.com)
- 🎥 [Video Tutorials](https://youtube.com/melvokflow)
- 📧 [Email Support](mailto:support@melvokflow.com)

### Enterprise Support

For enterprise customers, we offer:

- Dedicated account manager
- 24/7 priority support
- Custom integration development
- On-site training sessions

---

**Last Updated**: October 4, 2025  
**Version**: 2.1.0
`;

function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Navigation Sections */}
              <ScrollArea className="h-[calc(100vh-200px)]">
                <nav className="space-y-2">
                  {docSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id} className="space-y-1">
                        <Button
                          variant={
                            activeSection === section.id ? "secondary" : "ghost"
                          }
                          className="w-full justify-start"
                          onClick={() => setActiveSection(section.id)}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {section.title}
                        </Button>
                        {activeSection === section.id && (
                          <div className="ml-6 space-y-1">
                            {section.subsections.map((subsection) => (
                              <Button
                                key={subsection.id}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <ChevronRight className="mr-2 h-3 w-3" />
                                {subsection.title}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </ScrollArea>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            <div className="bg-card border rounded-lg shadow-sm">
              <div className="p-8">
                {/* Documentation Content */}
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(markdownContent),
                    }}
                  />
                </article>

                {/* Help Section */}
                <div className="mt-12 p-6 bg-muted rounded-lg border">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        Was this page helpful?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Let us know if you have any questions or feedback about
                        this documentation.
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm">Yes, helpful</Button>
                        <Button size="sm" variant="outline">
                          No, needs improvement
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Simple markdown to HTML converter (basic implementation)
function formatMarkdown(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // Code blocks
  html = html.replace(
    /```(.*?)\n([\s\S]*?)```/gim,
    "<pre><code>$2</code></pre>"
  );

  // Inline code
  html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");

  // Lists
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

  // Checkmarks
  html = html.replace(/✅/g, '<span class="text-green-600">✅</span>');

  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // Horizontal rule
  html = html.replace(/^---$/gim, "<hr />");

  return html;
}

export default Documentation;
