/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getRequest, postRequest, putRequest } from "@/utils/apiUtils";
import { FloatSidebar } from "@/components/customComponents/FloatOverlay";
import { drawioConverterAsync } from "@/utils/test";

export const FlowDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ hook for navigation
  const containerRef = useRef<HTMLDivElement | null>(null);
  const queryParams = new URLSearchParams(location.search);
  const fileParam = queryParams.get("file");
  const share_uuid = queryParams.get("share_uuid"); // --- IGNORE ---
  const [showSidebar, setShowSidebar] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [checkedForms, setCheckedForms] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [isSharedView] = useState(!!share_uuid); // --- IGNORE ---
  const [flowDetails, setFlowDetails] = useState<any>(null);
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
    console.log("resssss", res);
    setForms(res);
  };
  const fetchSharedDetails = async () => {
    try {
      const res = await postRequest(
        `/api/forms/shared?share_uuid=${share_uuid}`
      );

      if (!res.ok) {
        // res.ok is false for status >= 400
        console.warn("API returned error:", res);
      }
      setForms(res.forms);
      if (typeof res.flow.node_data === "string") {
        try {
          res.flow.node_data = JSON.parse(res.flow.node_data);
        } catch (e) {
          res.flow.node_data = [];
        }
      }

      setFlowDetails(res.flow);
    } catch (err) {
      // console.error("Fetch error:", err);
    }
  };

  const fetchFlowDetails = async () => {
    if (!fileParam) {
      return;
    }
    try {
      const res = await getRequest(`/api/flows/${fileParam}`, true);
      let flow = res.flow;

      // Ensure node_data is parsed
      if (typeof flow.node_data === "string") {
        try {
          flow.node_data = JSON.parse(flow.node_data);
        } catch (e) {
          flow.node_data = [];
        }
      }
      console.log(flow);
      setFlowDetails(flow);
    } catch (err) {
      console.error("Error fetching flow:", err);
    }
  };

  useEffect(() => {
    if (isSharedView) {
      fetchSharedDetails();
    } else {
      fetchTemplates();
      fetchFlowDetails(); // ✅ fetch fresh flow by file_name
    }
  }, []);

  const extractAttributes = (namedNodeMap: NamedNodeMap) => {
    const attributesArray = [];
    for (let i = 0; i < namedNodeMap.length; i++) {
      const attribute = namedNodeMap[i];
      attributesArray.push({
        name: attribute.name,
        value: attribute.value,
      });
    }
    return attributesArray;
  };

  /**
   * Sets up clickable events for diagram elements.
   */
  const setupClickableEvents = () => {
    const graphViewer = (window as any).newGraphViewer;
    if (!graphViewer || !graphViewer.graph) {
      console.error("Graph viewer is not initialized.");
      return;
    }

    const view = graphViewer.graph.getView();
    const states = view.states;

    states.visit((key: any, state: any) => {
      const shapeNode = state.shape?.node;
      const textNode = state.text?.node; // 👈 this handles the label
      const cellValue = state.cell.value;
      if (cellValue) {
        shapeNode.style.cursor = "pointer";
        const attachClickable = (node: any) => {
          if (cellValue.attributes && cellValue.attributes.length > 0) {
            shapeNode.addEventListener(
              "click",
              () => {
                const attributes = extractAttributes(cellValue.attributes);
                if (attributes && attributes.length > 0) {
                  setIdAttribute(attributes[1].value);
                  setShowSidebar(true);
                }
              },
              false
            );
          }
        };
        attachClickable(shapeNode);
        attachClickable(textNode);
      }
    });
  };
  useEffect(() => {
    if (!idAttribute || !flowDetails?.node_data) return;

    // Find node data by clicked ID
    const node = flowDetails.node_data.find(
      (n: any) => n.node_id === idAttribute
    );
    if (!node) {
      setCheckedForms({});
      return;
    }
    // Build checked forms map
    const checkedMap: { [key: string]: boolean } = {};
    if (node && node.form_templates) {
      node.form_templates.forEach((formId: string) => {
        checkedMap[formId] = true;
      });
    }
    // Update checked forms
    setCheckedForms(checkedMap);
  }, [idAttribute, flowDetails]);

  useEffect(() => {
    if (!flowDetails) return;

    const initGraph = async () => {
      drawioConverterAsync(flowDetails.xml, "drawioContainer");
      setupClickableEvents();
    };

    initGraph();
  }, [flowDetails]);
  if (!flowDetails) {
    return <div>Loading flow details...</div>;
  }
  const handleZoomIn = () => {
    const graphViewer = (window as any).newGraphViewer;
    if (graphViewer?.graph) {
      graphViewer.graph.zoomIn();
    }
  };

  const handleZoomOut = () => {
    const graphViewer = (window as any).newGraphViewer;
    if (graphViewer?.graph) {
      graphViewer.graph.zoomOut();
    }
  };
  
  return (
    <>
      <div className="my-4 flex justify-between items-center mx-4 z-0">
        {/* Left side - glass card back button */}

        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <div
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer rounded-xl px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/30 transition"
            style={{ minHeight: "48px" }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="ml-2 text-sm font-medium">Back</span>
          </div>

          {/* Zoom Controls */}
          <div className="flex flex-row items-center space-x-2 z-50">
            <button
              style={{ minHeight: "48px" }}
              onClick={handleZoomIn}
              className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-full w-12 h-4 flex items-center justify-center hover:bg-gray-100"
              aria-label="Zoom In"
            >
              +
            </button>
            <button
              style={{ minHeight: "48px" }}
              onClick={handleZoomOut}
              className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-full w-12 h-4 flex items-center justify-center hover:bg-gray-100"
              aria-label="Zoom Out"
            >
              –
            </button>
          </div>
        </div>

        {/* Right side - graph title */}
        <h2 className="text-lg font-semibold">{flowDetails.title}</h2>
      </div>
      {/* Custom Zoom Controls */}

      <div
        className=""
        style={{
          height: "100vh !important",
          width: "100% !important",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div
          id="drawioContainer"
          ref={containerRef}
          style={{
            cursor: "default !important",
            width: "100vw !important",
            height: "100% !important",
            // border: "1px solid #ccc",
            // cursor: "grab",
            overflow: "scroll",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
      {showSidebar && (
        <div style={{ zIndex: 9999 }}>
          <FloatSidebar
            forms={
              isSharedView
                ? // 🔹 Shared view → show only assigned forms
                  forms.filter((f) => {
                    const currentNode = flowDetails?.node_data?.find(
                      (n: any) => n.node_id === idAttribute
                    );
                    return currentNode?.form_templates?.includes(f.id);
                  })
                : // 🔹 Manager view → show all forms
                  forms
            }
            isSharedView={isSharedView}
            open={showSidebar}
            setOpen={setShowSidebar}
            items={forms.map((f) => ({
              id: f.id,
              title: f.title,
              checked: !!checkedForms[f.id], // ✅ checked if assigned to this node
            }))}
            idAttribute={idAttribute}
            flow_id={flowDetails.id}
            loading={false}
            selectedTitle="Form Assignment"
            onCheck={handleCheck}
          />
        </div>
      )}
    </>
  );
};
