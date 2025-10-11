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
      console.log(res.flow);

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
      setFlowDetails(flow);
    } catch (err) {
      console.error("Error fetching flow:", err);
    }
  };

  useEffect(() => {
    if (isSharedView) {
      const res = fetchSharedDetails();
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
    console.log("node", node);
    // Build checked forms map
    const checkedMap: { [key: string]: boolean } = {};
    if (node && node.form_templates) {
      node.form_templates.forEach((formId: string) => {
        checkedMap[formId] = true;
      });
    }
    console.log("checkedForms");
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
        <h2 className="text-lg font-semibold">{flowDetails.title}</h2>
      </div>
      <div
        className=""
        style={{
          height: "100% !important",
          width: "100% !important",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          id="drawioContainer"
          ref={containerRef}
          style={{
            width: "100vw !important",
            height: "auto !important",
            border: "1px solid #ccc",
            cursor: "grab",
            overflow: "scroll",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
      {showSidebar && (
        <FloatSidebar
          forms={forms.filter((f) => {
            const currentNode = flowDetails?.node_data?.find(
              (n: any) => n.node_id === idAttribute
            );
            return currentNode?.form_templates?.includes(f.id);
          })}
          isSharedView={isSharedView}
          open={showSidebar}
          setOpen={setShowSidebar}
          items={forms
            .filter((f) => {
              const currentNode = flowDetails?.node_data?.find(
                (n: any) => n.node_id === idAttribute
              );
              return currentNode?.form_templates?.includes(f.id);
            })
            .map((f) => ({
              id: f.id,
              title: f.title,
              checked: checkedForms[f.id],
            }))}
          idAttribute={idAttribute}
          flow_id={flowDetails.id}
          loading={false}
          selectedTitle="Form Assignment"
          onCheck={handleCheck}
        />
      )}
    </>
  );
};
