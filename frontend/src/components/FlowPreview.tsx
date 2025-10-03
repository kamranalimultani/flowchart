/* eslint-disable @typescript-eslint/no-explicit-any */
import { extractGraphModel } from "@/utils/commonUtils";
import { useEffect, useRef } from "react";

// Small helper to render readonly draw.io XML into mxGraph
const drawioConverterAsync = async (
  xml: string,
  containerId: string,
  preview: boolean = false
) => {
  const { mxGraph, mxCodec, mxUtils } = window as any;
  const container = document.getElementById(containerId);
  if (!container) return;

  const graph = new mxGraph(container);
  const originalGetCellStyle = graph.getCellStyle;
  graph.getStylesheet().getDefaultVertexStyle().fillColor = "none";
  graph.getCellStyle = function (cell: any) {
    let style = originalGetCellStyle.apply(this, arguments);

    // If it's a text-only vertex (style contains "text;html=1")
    if (
      cell &&
      cell.isVertex() &&
      cell.style &&
      cell.style.includes("text;html=1")
    ) {
      style = { ...style, strokeColor: "none", fillColor: "none" }; // no border, no fill
    }

    return style;
  };
  if (preview) {
    graph.setEnabled(false);
    graph.setCellsEditable(false);
    graph.setCellsMovable(false);
    graph.setConnectable(false);
    graph.setPanning(false);
    graph.setTooltips(false);
    graph.setHtmlLabels(true);
  }

  const doc = mxUtils.parseXml(xml);
  const codec = new mxCodec(doc);
  codec.decode(doc.documentElement, graph.getModel());

  // --- proper fit & center ---
  const bounds = graph.getGraphBounds();
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  if (bounds.width > 0 && bounds.height > 0) {
    const scale = Math.min(cw / bounds.width, ch / bounds.height) * 0.95; // small margin
    graph.view.setScale(scale);

    const dx = (cw - bounds.width * scale) / 2 / scale;
    const dy = (ch - bounds.height * scale) / 2 / scale;

    graph.view.setTranslate(-bounds.x + dx, -bounds.y + dy);
  }
};

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
      drawioConverterAsync(extractGraphModel(xml), containerId, true).catch(
        (err) => {
          console.error("Error rendering diagram preview:", err);
        }
      );
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
