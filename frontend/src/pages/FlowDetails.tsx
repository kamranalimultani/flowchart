/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getRequest, putRequest } from "@/utils/apiUtils";
import { FloatSidebar } from "@/components/customComponents/FloatOverlay";
import { extractGraphModel } from "@/utils/commonUtils";

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
    file_name: string;
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

    // ✅ Work with flowDetails not flowData
    let nodeData = [...(flowDetails?.node_data || [])];
    let node = nodeData.find((n: any) => n.node_id === idAttribute);

    if (node) {
      node.form_templates = checked
        ? [...new Set([...node.form_templates, formId])]
        : node.form_templates.filter((id: string) => id !== formId);
    } else if (checked) {
      nodeData.push({ node_id: idAttribute, form_templates: [formId] });
    }

    // ✅ update state so UI stays in sync
    setFlowDetails((prev: any) => ({ ...prev, node_data: nodeData }));

    await putRequest(
      `/api/flow/form-assign/${flowDetails.id}`,
      { node_data: nodeData },
      true
    );
  };

  const fetchTemplates = async () => {
    const res = await getRequest("/api/forms/all", true);
    setForms(res);
  };
  const [flowDetails, setFlowDetails] = useState<any>(null);

  const fetchFlowDetails = async () => {
    try {
      const res = await getRequest(`/api/flows/${flowData.file_name}`, true);
      let flow = res.flow;

      // Ensure node_data is parsed
      if (typeof flow.node_data === "string") {
        try {
          flow.node_data = JSON.parse(flow.node_data);
        } catch (e) {
          console.error("Failed to parse node_data:", e);
          flow.node_data = [];
        }
      }

      setFlowDetails(flow);
    } catch (err) {
      console.error("Error fetching flow:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchFlowDetails(); // ✅ fetch fresh flow by file_name
  }, []);

  useEffect(() => {
    if (!flowDetails) return; // wait until flowDetails is fetched

    // Access mxGraph from the CDN in public/index.html
    const { mxGraph, mxRubberband, mxEvent, mxUtils, mxCodec } = window as any;

    if (!mxGraph && !flowData.xml) {
      console.error("mxGraph not loaded! Add CDN in public/index.html");
      return;
    }

    const container = containerRef.current;
    const graph = new mxGraph(container);
    graphRef.current = graph;
    // // graph.getStylesheet().getDefaultVertexStyle().strokeColor = "none";
    // graph.getStylesheet().getDefaultEdgeStyle().strokeColor = "none";
    // graph.getStylesheet().getDefaultEdgeStyle().stroke = "none";
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
      if (cell && cell.isVertex() && flowDetails) {
        const nodeId = cell.getId();
        setIdAttribute(nodeId);
        const node = (flowDetails.node_data || []).find(
          (n: any) => n.node_id === nodeId
        );
        const updatedChecked: { [key: string]: boolean } = {};
        forms.forEach((f) => {
          updatedChecked[f.id] = node
            ? node.form_templates.includes(f.id)
            : false;
        });
        setShowSidebar(true);
        setCheckedForms(updatedChecked);
      }
    });

    container.addEventListener("wheel", (e) => {
      if (!e.ctrlKey) return; // Only zoom when Ctrl is pressed
      e.preventDefault();

      if (e.deltaY < 0) graph.zoomIn();
      else graph.zoomOut();
    });
  }, [flowData.xml, flowDetails]);

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
          idAttribute={idAttribute}
          flow_id={flowData.id}
          loading={false} // Add this prop!
          selectedTitle="Form Assignment" // This is optional, but recommended
          onCheck={handleCheck}
        />
      )}
    </>
  );
};
