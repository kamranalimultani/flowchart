// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMxGraphData(xml: string): any {
  return {
    xml,
    edit: null,
    lightbox: false,
    noExitBtn: 1,
    nav: true, // ✅ Adds mini-map navigation
    zoom: true, // ✅ Enables zoom buttons
    resize: true,
    "auto-fit": true,
    "allow-zoom-in": true,
    tooltips: true,
    center: true,
    toolbar: "zoom layers", // ✅ Toolbar with zoom + layer controls
    "toolbar-position": "top",
    "toolbar-nohide": false,
  };
}

const chatMap: { [key: string]: string } = {
  "&": "&amp;",
  "'": "&#x27;",
  "`": "&#x60;",
  '"': "&quot;",
  "<": "&lt;",
  ">": "&gt;",
};
function replaceMatchedCharacters(match: string): string {
  return chatMap[match];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function escapeHTML(input: any): string {
  if (typeof input !== "string") return input;
  return input.replace(/[&'`"<>]/g, replaceMatchedCharacters);
}
function createMxGraphHTML(json: string): string {
  return `<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="${escapeHTML(
    json
  )}"></div>`;
}
function renderMxGraphHTML(mxGraphHTML: string, targetElementId: string): void {
  const graphContainer = document.getElementById(targetElementId);
  if (graphContainer) {
    graphContainer.innerHTML = mxGraphHTML;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).GraphViewer.processElements();
  } else {
    console.error(`Element with id '${targetElementId}' not found.`);
  }
}
export async function drawioConverterAsync(
  url: string,
  targetElementId: string
) {
  try {
    const mxGraphData = createMxGraphData(url);
    const json = JSON.stringify(mxGraphData);
    const mxGraphHTML = createMxGraphHTML(json);
    // console.log("this", mxGraphData);

    // Render mxGraphHTML into the target element
    renderMxGraphHTML(mxGraphHTML, targetElementId);
  } catch (err) {
    console.error("Error loading draw.io file:", err);
  }
}
