/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getRequest, putRequest } from "@/utils/apiUtils";
import { FloatSidebar } from "@/components/customComponents/FloatOverlay";

export const FlowDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ hook for navigation
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef(null);
  const flowData = location.state as {
    id: number;
    title: string;
    description: string;
    xml: string;
    node_data: any[];
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [checkedForms, setCheckedForms] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [idAttribute, setIdAttribute] = useState<string>("");

  const handleCheck = async (formId: string, checked: boolean) => {
    setCheckedForms((x) => ({ ...x, [formId]: checked }));

    let nodeData = [...(flowData.node_data || [])];
    let node = nodeData.find((n: any) => n.node_id === idAttribute);

    if (node) {
      node.form_templates = checked
        ? [...node.form_templates, formId]
        : node.form_templates.filter((id: string) => id !== formId);
    } else if (checked) {
      nodeData.push({ node_id: idAttribute, form_templates: [formId] });
    }

    await putRequest(
      `/api/flow/form-assign/${flowData.id}`,
      {
        node_data: nodeData,
      },
      true
    );
  };

  const extractGraphModel = (xmlString: any) => {
    // Find the start and end of mxGraphModel tag
    const startTag = "<mxGraphModel";
    const endTag = "</mxGraphModel>";

    const startIndex = xmlString.indexOf(startTag);
    const endIndex = xmlString.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1) {
      // Extract everything from <mxGraphModel to </mxGraphModel>
      return xmlString.substring(startIndex, endIndex + endTag.length);
    }

    // If no mxGraphModel found, return original string
    return xmlString;
  };
  const fetchTemplates = async () => {
    const res = await getRequest("/api/forms/all", true);
    setForms(res);
    console.log(res);
  };
  useEffect(() => {
    fetchTemplates();
    // Access mxGraph from the CDN in public/index.html
    const { mxGraph, mxRubberband, mxEvent, mxUtils, mxCodec } = window as any;

    if (!mxGraph && !flowData.xml) {
      console.error("mxGraph not loaded! Add CDN in public/index.html");
      return;
    }

    const container = containerRef.current;
    const graph = new mxGraph(container);
    graphRef.current = graph;
    graph.getStylesheet().getDefaultVertexStyle().fillColor = "none";
    graph.getStylesheet().getDefaultVertexStyle().strokeColor = "none"; // Add this
    graph.getStylesheet().getDefaultEdgeStyle().strokeColor = "none";
    graph.getStylesheet().getDefaultEdgeStyle().stroke = "none";

    // --- Graph options ---
    graph.setCellsMovable(false);
    graph.setConnectable(false);
    graph.setPanning(true);
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.setHtmlLabels(true);

    graph.getCursorForCell = function (cell: any) {
      if (cell && cell.isVertex()) {
        return "pointer";
      }
      return mxGraph.prototype.getCursorForCell.apply(this, arguments);
    };
    // Rubberband selection
    new mxRubberband(graph);
    const parsed = extractGraphModel(flowData.xml);
    // Parse XML and decode into the graph
    const doc = mxUtils.parseXml(parsed);
    const codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());

    graph.view.setScale(1); // 50% zoom
    const bounds = graph.getGraphBounds();
    if (!container) return;
    const dx = container.clientWidth / 2 - (bounds.x + bounds.width / 2) * 0.5;
    const dy =
      container.clientHeight / 2 - (bounds.y + bounds.height / 2) * 0.5;
    graph.view.setTranslate(dx, dy);

    // Node click listener
    graph.addListener(mxEvent.CLICK, (sender: any, evt: any) => {
      const cell = evt.getProperty("cell");
      if (cell && cell.isVertex()) {
        setIdAttribute(cell.getId());
        setShowSidebar(true);
      }
    });

    container.addEventListener("wheel", (e) => {
      if (!e.ctrlKey) return; // Only zoom when Ctrl is pressed
      e.preventDefault();

      if (e.deltaY < 0) graph.zoomIn();
      else graph.zoomOut();
    });
  }, []);

  return (
    <>
      <div className="my-4 flex justify-between items-center mx-4 z-0">
        {/* Left side - glass card back button */}
        <div
          onClick={() => navigate(-1)} // ✅ navigate back
          className="flex items-center space-x-2 cursor-pointer rounded-xl px-3 py-2
                      bg-white/20 backdrop-blur-md border border-white/30 shadow-md
                      hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </div>

        {/* Right side - graph title */}
        <h2 className="text-lg font-semibold">{flowData.title}</h2>
      </div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          border: "1px solid #ccc",
          cursor: "grab",
          overflow: "hidden",
        }}
      />
      {showSidebar && (
        <FloatSidebar
          open={showSidebar}
          setOpen={setShowSidebar}
          items={forms.map((f) => ({
            id: f.id,
            title: f.title,
            checked: checkedForms[f.id],
          }))}
          loading={false} // Add this prop!
          selectedTitle="Form Assignment" // This is optional, but recommended
          onCheck={handleCheck}
        />
      )}
    </>
  );
};
