// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMxGraphData(xml: string, preview: boolean): any {
  if (preview) {
    return {
      xml,
      edit: null,
      lightbox: false,
      noExitBtn: 1,
      nav: false, // ❌ disable mini-map
      zoom: false, // ❌ disable zoom buttons
      resize: false, // ❌ prevent resizing
      "auto-fit": true, // ✅ still auto-fit to container
      "allow-zoom-in": false,
      tooltips: true, // ✅ keep tooltips on hover
      center: true,
      toolbar: null, // ❌ no toolbar
    };
  } else {
    return {
      xml,
      edit: null,
      lightbox: false,
      noExitBtn: 1,
      nav: !preview, // mini-map only in non-preview
      zoom: !preview, // zoom buttons only if not preview
      resize: true, // allow resizing to parent
      "auto-fit": false, // always false for fluid layout
      "allow-zoom-in": !preview,
      tooltips: true,
      center: false, // don't center
      toolbar: preview ? null : "zoom layers",
      "toolbar-position": preview ? null : "top",
      "toolbar-nohide": false,
    };
  }
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
  targetElementId: string,
  preview: boolean
) {
  try {
    const mxGraphData = createMxGraphData(url, preview);
    const json = JSON.stringify(mxGraphData);
    const mxGraphHTML = createMxGraphHTML(json);
    // console.log("this", mxGraphData);

    // Render mxGraphHTML into the target element
    renderMxGraphHTML(mxGraphHTML, targetElementId);
  } catch (err) {
    console.error("Error loading draw.io file:", err);
  }
}
