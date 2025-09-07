/* eslint-disable @typescript-eslint/no-explicit-any */
import { drawioConverterAsync } from "@/utils/test";
import { useEffect, useRef, useState } from "react";
import panzoom from "@panzoom/panzoom";

export const FlowDetails = () => {
  const [idAttribute, setIdAttribute] = useState<string>("");
  console.log(idAttribute);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" version="28.2.0">
  <diagram id="prtHgNgQTEPvFCAcTncT" name="Page-1">
    <mxGraphModel dx="1183" dy="556" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="dNxyNK7c78bLwvsdeMH5-11" value="Orgchart" style="swimlane;html=1;startSize=20;horizontal=1;containerType=tree;glass=0;" parent="1" vertex="1">
          <mxGeometry x="40" y="80" width="710" height="290" as="geometry" />
        </mxCell>
        <UserObject label="%name%&lt;br&gt;&lt;i style=&quot;color: gray&quot;&gt;%position%&lt;/i&gt;&lt;br&gt;&lt;a href=&quot;mailto:%email%&quot;&gt;Email&lt;/a&gt;" name="Tessa Miller" position="CFO" location="Office 1" email="me@example.com" placeholders="1" id="dNxyNK7c78bLwvsdeMH5-12">
          <mxCell style="label;image=https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-3-128.png;whiteSpace=wrap;html=1;rounded=0;glass=0;treeMoving=1;treeFolding=1;" parent="dNxyNK7c78bLwvsdeMH5-11" vertex="1">
            <mxGeometry x="260" y="50" width="180" height="70" as="geometry" />
          </mxCell>
        </UserObject>
        <mxCell id="dNxyNK7c78bLwvsdeMH5-13" value="" style="endArrow=blockThin;endFill=1;fontSize=11;edgeStyle=elbowEdgeStyle;elbow=vertical;rounded=0;" parent="dNxyNK7c78bLwvsdeMH5-11" source="dNxyNK7c78bLwvsdeMH5-12" target="dNxyNK7c78bLwvsdeMH5-14" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <UserObject label="%name%&lt;br&gt;&lt;i style=&quot;color: gray&quot;&gt;%position%&lt;/i&gt;&lt;br&gt;&lt;a href=&quot;mailto:%email%&quot;&gt;Email&lt;/a&gt;" name="Edward Morrison" position="Brand Manager" location="Office 2" email="me@example.com" placeholders="1" link="https://www.draw.io" id="dNxyNK7c78bLwvsdeMH5-14">
          <mxCell style="label;image=https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png;whiteSpace=wrap;html=1;rounded=0;glass=0;treeFolding=1;treeMoving=1;" parent="dNxyNK7c78bLwvsdeMH5-11" vertex="1">
            <mxGeometry x="40" y="180" width="180" height="80" as="geometry" />
          </mxCell>
        </UserObject>
        <mxCell id="dNxyNK7c78bLwvsdeMH5-15" value="" style="endArrow=blockThin;endFill=1;fontSize=11;edgeStyle=elbowEdgeStyle;elbow=vertical;rounded=0;" parent="dNxyNK7c78bLwvsdeMH5-11" source="dNxyNK7c78bLwvsdeMH5-12" target="dNxyNK7c78bLwvsdeMH5-16" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <UserObject label="%name%&lt;br&gt;&lt;i style=&quot;color: gray&quot;&gt;%position%&lt;/i&gt;&lt;br&gt;&lt;a href=&quot;mailto:%email%&quot;&gt;Email&lt;/a&gt;" name="Evan Valet" position="HR Director" location="Office 4" email="me@example.com" placeholders="1" link="https://www.draw.io" id="dNxyNK7c78bLwvsdeMH5-16">
          <mxCell style="label;image=https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-9-2-128.png;whiteSpace=wrap;html=1;rounded=0;glass=0;treeFolding=1;treeMoving=1;" parent="dNxyNK7c78bLwvsdeMH5-11" vertex="1">
            <mxGeometry x="260" y="180" width="180" height="80" as="geometry" />
          </mxCell>
        </UserObject>
        <mxCell id="dNxyNK7c78bLwvsdeMH5-17" value="" style="endArrow=blockThin;endFill=1;fontSize=11;edgeStyle=elbowEdgeStyle;elbow=vertical;rounded=0;" parent="dNxyNK7c78bLwvsdeMH5-11" source="dNxyNK7c78bLwvsdeMH5-12" target="dNxyNK7c78bLwvsdeMH5-18" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <UserObject label="%name%&lt;br&gt;&lt;i style=&quot;color: gray&quot;&gt;%position%&lt;/i&gt;&lt;br&gt;&lt;a href=&quot;mailto:%email%&quot;&gt;Email&lt;/a&gt;" name="Alison Donovan" position="System Admin" location="Office 3" email="me@example.com" placeholders="1" link="https://www.draw.io" id="dNxyNK7c78bLwvsdeMH5-18">
          <mxCell style="label;image=https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-2-128.png;whiteSpace=wrap;html=1;rounded=0;glass=0;" parent="dNxyNK7c78bLwvsdeMH5-11" vertex="1">
            <mxGeometry x="490" y="180" width="180" height="80" as="geometry" />
          </mxCell>
        </UserObject>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

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
              // setIsSidebarOpen((prev) => !prev);
            },
            false
          );
        }
      }
    });
  };
  useEffect(() => {
    drawioConverterAsync(svg, "drawio-diagram").then(() => {
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
  }, [svg]);

  return (
    <div
      ref={zoomableComponentRef}
      id="drawio-diagram"
      className="w-full h-screen overflow-auto border rounded relative"
      style={{ cursor: "grab" }}
    ></div>
  );
};
