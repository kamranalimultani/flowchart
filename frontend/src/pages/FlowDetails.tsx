/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getRequest, putRequest } from "@/utils/apiUtils";
import { FloatSidebar } from "@/components/customComponents/FloatOverlay";
import { extractGraphModel } from "@/utils/commonUtils";
import { drawioConverterAsync } from "@/utils/test";

export const FlowDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ hook for navigation
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const setupClickableEvents = () => {
    console.log("Setting up clickable events");
    const graphViewer = (window as any).newGraphViewer;

    if (!graphViewer || !graphViewer.graph) {
      console.error("Graph viewer is not initialized.");
      return;
    }

    const graph = graphViewer.graph;
    const view = graph.getView();
    const states = view.states;

    if (!states) {
      console.error("No states found in graph view.");
      return;
    }

    states.visit((key: any, state: any) => {
      const cell = state.cell;
      const cellID = cell?.id;
      const shapeNode = state.shape?.node;
      const textNode = state.text?.node; // 👈 this handles the label

      if (!cellID) return;

      // A small helper to attach both cursor + click
      const attachClickable = (node: any) => {
        if (!node) return;

        node.style.cursor = "pointer";
        node.onclick = null;

        node.addEventListener(
          "click",
          (e: MouseEvent) => {
            e.stopPropagation(); // avoid double triggering
            console.log("Clicked cell with ID:", cellID);
            setIdAttribute(cellID);
            setShowSidebar((prev) => !prev);
          },
          false
        );
      };

      // Apply to both shape and text nodes 👇
      attachClickable(shapeNode);
      attachClickable(textNode);
    });
  };

  useEffect(() => {
    if (!flowDetails) return;

    const initGraph = async () => {
      console.log(flowData.xml);
      drawioConverterAsync(flowData.xml, "drawioContainer");
      setupClickableEvents();
    };

    initGraph();
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
        className=""
        style={{ minHeight: "calc(86.1vh - 80px)", overflow: "auto" }}
      >
        <div
          id="drawioContainer"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100vh",
            border: "1px solid #ccc",
            cursor: "grab",
            overflow: "hidden",
          }}
        />
      </div>
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
