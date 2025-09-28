/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { drawioConverterAsync } from "@/utils/test";

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
      drawioConverterAsync(xml, containerId, true).catch((err) => {
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
      {/* fallback if xml missing */}
      {!xml && (
        <span className="text-sm text-gray-500">No preview available</span>
      )}
    </div>
  );
};
