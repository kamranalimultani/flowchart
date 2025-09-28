/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { drawioConverterAsync } from "@/utils/test";
import { useEffect, useRef, useState } from "react";
import panzoom from "@panzoom/panzoom";
import { useLocation } from "react-router-dom";
import { FloatSidebar } from "@/components/customComponents/FloatOverlay";
import { getRequest, putRequest } from "@/utils/apiUtils";

export const FlowDetails = () => {
  const location = useLocation();
  const flowData = location.state as {
    id: number;
    title: string;
    description: string;
    xml: string;
    node_data: any[];
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const [forms, setForms] = useState<any[]>([]);

  const [idAttribute, setIdAttribute] = useState<string>("");
  console.log(idAttribute);

  const zoomableComponentRef = useRef<HTMLDivElement | null>(null);
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
  const setupClickableEvents = () => {
    const graphViewer = (window as any).newGraphViewer;
    if (!graphViewer || !graphViewer.graph) {
      console.error("Graph viewer is not initialized.");
      return;
    }

    const view = graphViewer.graph.getView();
    const states = view.states;

    states.visit((key: any, state: any) => {
      const cellValue = state.cell.value;
      if (cellValue) {
        const shapeNode = state.shape.node;
        shapeNode.style.cursor = "pointer";

        if (cellValue.attributes && cellValue.attributes.length > 0) {
          shapeNode.addEventListener(
            "click",
            () => {
              const attributes = extractAttributes(cellValue.attributes);
              if (attributes && attributes.length > 0) {
                setIdAttribute(attributes[1].value);
              }
              console.log(attributes[1].value);
              openSidebar(attributes[1].value);
            },
            false
          );
        }
      }
    });
  };
  useEffect(() => {
    drawioConverterAsync(flowData.xml, "drawio-diagram", false).then(() => {
      const container = document.querySelector(
        "#drawio-diagram svg"
      ) as HTMLElement;
      if (container) {
        const panZoomInstance = panzoom(container, {
          maxZoom: 5,
          minZoom: 0.5,
        });
        // Optional: reset on double-click
        container.addEventListener("dblclick", () => panZoomInstance.reset());
      }
    });
    setupClickableEvents();
  }, [flowData.xml]);
  const fetchAlTemplates = async () => {
    const res = await getRequest("/api/forms/all");
    setForms(res ?? []);
  };
  const [checkedForms, setCheckedForms] = useState<{ [key: string]: boolean }>(
    {}
  );

  const openSidebar = async (nodeId: string) => {
    await fetchAlTemplates();
    setIdAttribute(nodeId);
    setShowSidebar(true);

    // Always parse if string
    let nodeDataArr: any[] = [];
    if (typeof flowData.node_data === "string") {
      try {
        nodeDataArr = JSON.parse(flowData.node_data);
      } catch {
        nodeDataArr = [];
      }
    } else if (Array.isArray(flowData.node_data)) {
      nodeDataArr = flowData.node_data;
    } else {
      nodeDataArr = [];
    }

    const assigned =
      nodeDataArr.find((n: any) => n.node_id === nodeId)?.form_templates || [];
    setCheckedForms(
      forms.reduce(
        (acc, f) => ({ ...acc, [f.id]: assigned.includes(f.id) }),
        {}
      )
    );
  };

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

  return (
    <>
      <div
        ref={zoomableComponentRef}
        id="drawio-diagram"
        className="w-full h-screen overflow-auto border rounded relative"
        style={{ cursor: "grab" }}
      ></div>
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
          viewForm={false} // Add this prop!
          setViewForm={() => {}} // Add this prop!
          selectedTitle="Form Assignment" // This is optional, but recommended
          onCheck={handleCheck}
        />
      )}
    </>
  );
};
