// Define chatMap with explicit type
const chatMap: { [key: string]: string } = {
  "&": "&amp;",
  "'": "&#x27;",
  "`": "&#x60;",
  '"': "&quot;",
  "<": "&lt;",
  ">": "&gt;",
};

/**
 * Replaces matched characters with their HTML entity equivalents.
 *
 * @param match - The matched character to be replaced.
 * @returns The HTML entity equivalent of the matched character.
 */
function replaceMatchedCharacters(match: string): string {
  return chatMap[match];
}

/**
 * Escapes HTML special characters in a string to prevent HTML injection.
 *
 * @param input - The string to be escaped.
 * @returns The escaped HTML string.
 */
function escapeHTML(input: any): string {
  if (typeof input !== "string") return input;
  return input.replace(/[&'`"<>]/g, replaceMatchedCharacters);
}

/**
 * Makes cells in the graph clickable and logs their unique ID on click.
 *
 * This function assumes that `newGraphViewer` and `graph` are initialized in the global window object.
 */
export function listAllCells() {
  if (
    !(window as any).newGraphViewer ||
    !(window as any).newGraphViewer.graph
  ) {
    console.error("newGraphViewer or graph is not initialized.");
    return;
  }

  const view = (window as any).newGraphViewer.graph.getView();
  const states = view.states;

  states.visit(function (key: any, state: any) {
    const cellValue = state.cell.value;
    if (cellValue) {
      const shapeNode = state.shape.node;
      shapeNode.style.cursor = "pointer";

      shapeNode.addEventListener(
        "click",
        function () {
          console.log("node clicked on", cellValue.attributes.uniqueId);
        },
        false
      );
    }
  });
}

/**
 * Converts a Draw.io diagram into HTML and renders it into the target element.
 *
 * @param url - The URL of the Draw.io file.
 * @param targetElementId - The ID of the HTML element to render the diagram into.
 */
export async function drawioConverterAsync(
  url: string,
  targetElementId: string
) {
  try {
    const mxGraphData = createMxGraphData(url);
    const json = JSON.stringify(mxGraphData);
    const mxGraphHTML = createMxGraphHTML(json);

    // Render mxGraphHTML into the target element
    renderMxGraphHTML(mxGraphHTML, targetElementId);
  } catch (err) {
    console.error("Error loading draw.io file:", err);
  }
}

/**
 * Creates an MxGraphData object with the given XML content.
 *
 * @param xml - The XML content for the graph.
 * @returns The MxGraphData object.
 * @link https://www.drawio.com/doc/faq/embed-html-options
 */
function createMxGraphData(xml: string): any {
  return {
    edit: null,
    lightbox: 0,
    noExitBtn: 1,
    "allow-zoom-in": true,
    tooltips: true,
    "max-height": 1500,
    nav: false,
    "auto-fit": true,
    resize: true,
    center: true,
    editable: "false",
    // "toolbar": "pages zoom layers", // TODO: Use it
    toolbar: "zoom",
    "toolbar-position": "inline",
    "toolbar-nohide": false,
    // "lightbox": "false",
    zoom: true,
    xml,
  };
}

/**
 * Creates HTML markup for the MxGraph using the provided JSON data.
 *
 * @param json - The JSON data to be included in the HTML.
 * @returns The HTML string for the MxGraph.
 */
function createMxGraphHTML(json: string): string {
  return `<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="${escapeHTML(
    json
  )}"></div>`;
}

/**
 * Renders MxGraph HTML into the specified target element.
 *
 * @param mxGraphHTML - The HTML string for the MxGraph.
 * @param targetElementId - The ID of the HTML element to render the graph into.
 */
function renderMxGraphHTML(mxGraphHTML: string, targetElementId: string): void {
  const graphContainer = document.getElementById(targetElementId);
  if (graphContainer) {
    graphContainer.innerHTML = mxGraphHTML;
    (window as any).GraphViewer.processElements();
  } else {
    console.error(`Element with id '${targetElementId}' not found.`);
  }
}
