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
  const navigate = useNavigate();
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
  const [flowDetails, setFlowDetails] = useState<any>(null);

  const handleCheck = async (formId: string, checked: boolean) => {
    setCheckedForms((x) => ({ ...x, [formId]: checked }));

    let nodeData = [...(flowDetails?.node_data || [])];
    let node = nodeData.find((n: any) => n.node_id === idAttribute);

    if (node) {
      node.form_templates = checked
        ? [...new Set([...node.form_templates, formId])]
        : node.form_templates.filter((id: string) => id !== formId);
    } else if (checked) {
      nodeData.push({ node_id: idAttribute, form_templates: [formId] });
    }

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

  const fetchFlowDetails = async () => {
    try {
      const res = await getRequest(`/api/flows/${flowData.file_name}`, true);
      let flow = res.flow;

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
    fetchFlowDetails();
  }, []);

  useEffect(() => {
    if (!flowDetails || !flowData.xml) return;

    const container = containerRef.current;
    if (!container) return;

    // Access mxGraph factory from window
    const mxGraphFactory = (window as any).mxgraph;

    if (!mxGraphFactory) {
      console.error("mxGraph not loaded! Check CDN script in index.html");
      return;
    }

    // Initialize mxGraph with base path
    const mx = mxGraphFactory({
      mxBasePath: "https://cdn.jsdelivr.net/npm/mxgraph@4.2.2/javascript/src",
    });

    // Extract classes
    const mxGraph = mx.mxGraph;
    const mxRubberband = mx.mxRubberband;
    const mxEvent = mx.mxEvent;
    const mxUtils = mx.mxUtils;
    const mxCodec = mx.mxCodec;

    console.log("mxGraph loaded successfully");

    // Create graph instance
    const graph = new mxGraph(container);
    graphRef.current = graph;

    // Configure graph behavior
    graph.setCellsMovable(false);
    graph.setConnectable(false);
    graph.setPanning(true);
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.setHtmlLabels(true);
    graph.setEnabled(true);

    // Customize cursor for vertices
    const originalGetCursor = graph.getCursorForCell;
    graph.getCursorForCell = function (cell: any) {
      if (cell && cell.isVertex()) {
        return "pointer";
      }
      return originalGetCursor.apply(this, arguments);
    };

    // Remove fill color for text-only vertices
    const originalGetCellStyle = graph.getCellStyle;
    graph.getCellStyle = function (cell: any) {
      let style = originalGetCellStyle.apply(this, arguments);

      if (
        cell &&
        cell.isVertex() &&
        cell.style &&
        cell.style.includes("text;html=1")
      ) {
        style = { ...style, strokeColor: "none", fillColor: "none" };
      }

      return style;
    };

    // Enable rubberband selection
    new mxRubberband(graph);

    // Parse and render the XML
    try {
      const parsed = extractGraphModel(flowData.xml);
      console.log("Parsed XML:", parsed.substring(0, 200));

      const doc = mxUtils.parseXml(parsed);
      const codec = new mxCodec(doc);

      // Decode into graph model
      graph.getModel().beginUpdate();
      try {
        codec.decode(doc.documentElement, graph.getModel());
      } finally {
        graph.getModel().endUpdate();
      }

      console.log(
        "Graph cells:",
        graph.getModel().getChildCount(graph.getDefaultParent())
      );

      // Fit and center the graph
      const bounds = graph.getGraphBounds();
      console.log("Graph bounds:", bounds);

      if (bounds.width > 0 && bounds.height > 0) {
        // Calculate scale to fit
        const widthScale = container.clientWidth / (bounds.width + 40);
        const heightScale = container.clientHeight / (bounds.height + 40);
        const scale = Math.min(widthScale, heightScale, 1); // Don't zoom in beyond 100%

        graph.view.setScale(scale);

        // Center the graph
        const dx =
          (container.clientWidth - bounds.width * scale) / 2 - bounds.x * scale;
        const dy =
          (container.clientHeight - bounds.height * scale) / 2 -
          bounds.y * scale;
        graph.view.setTranslate(dx, dy);
      }

      // Force refresh
      graph.refresh();
      console.log("Graph rendered successfully");
    } catch (err) {
      console.error("Error parsing/rendering XML:", err);
    }

    // Add click listener for nodes
    graph.addListener(mxEvent.CLICK, (sender: any, evt: any) => {
      const cell = evt.getProperty("cell");
      if (cell && cell.isVertex() && flowDetails) {
        const nodeId = cell.getId();
        console.log("Clicked node:", nodeId);
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

    // Add zoom with Ctrl+Wheel
    const wheelHandler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (e.deltaY < 0) graph.zoomIn();
      else graph.zoomOut();
    };

    container.addEventListener("wheel", wheelHandler);

    // Cleanup
    return () => {
      container.removeEventListener("wheel", wheelHandler);
      graph.destroy();
    };
  }, [flowData.xml, flowDetails, forms]);

  return (
    <>
      <div className="my-4 flex justify-between items-center mx-4 z-0">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 cursor-pointer rounded-xl px-3 py-2
                      bg-white/20 backdrop-blur-md border border-white/30 shadow-md
                      hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </div>

        <h2 className="text-lg font-semibold">{flowData.title}</h2>
      </div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "calc(100vh - 100px)",
          border: "1px solid #ccc",
          cursor: "grab",
          overflow: "hidden",
          backgroundColor: "#ffffff",
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
          loading={false}
          selectedTitle="Form Assignment"
          onCheck={handleCheck}
        />
      )}
    </>
  );
};
