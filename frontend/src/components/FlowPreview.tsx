/* eslint-disable @typescript-eslint/no-explicit-any */
import { drawioConverterAsync } from "@/utils/test";
import { useEffect, useRef } from "react";

// Small helper to render readonly draw.io XML into mxGraph
// FlowPreview component for one diagram
export const FlowPreview = ({
  xml,
  containerId,
}: {
  xml?: string;
  containerId: string;
}) => {
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (xml && previewRef.current) {
      drawioConverterAsync(xml, containerId).catch((err) => {
        console.error("Error rendering diagram preview:", err);
      });
    }
  }, [xml, containerId]);

  return (
    <div
      ref={previewRef}
      id={containerId}
      className="w-full h-40 overflow-hidden rounded-md bg-muted/10 flex items-center justify-center"
    >
      {!xml && (
        <span className="text-sm text-gray-500">No preview available</span>
      )}
    </div>
  );
};
