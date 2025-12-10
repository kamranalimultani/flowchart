import { Metadata } from "next";
import { FlowTemplatesView } from "@/components/flow-templates/FlowTemplatesView";

export const metadata: Metadata = {
    title: "Flow Templates | Melvok",
    description: "Browse our collection of premium flow templates. Start your next project with professionally designed Draw.io templates.",
};

export default function FlowTemplatesPage() {
    return <FlowTemplatesView />;
}
