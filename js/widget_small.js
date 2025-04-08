// widget_small.js

var FIX_URL = "https://fix.incontrol.app/";
var STYLE_URL = "https://cdn.jsdelivr.net/gh/maxdorowidget/widget@931bce5/css/widget.css";
var SRC_URL = "https://cdn.jsdelivr.net/gh/maxdorowidget/widget@main/";

// Asynchronous helper to load an external CSS file and return a CSSStyleSheet.
async function loadCSS(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load CSS: ${url}`);
  }
  const cssText = await response.text();
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  return sheet;
}

// Helper to attach the external stylesheet to the shadow root.
async function attachStyles(shadow, cssURL) {
  try {
    const sheet = await loadCSS(cssURL);
    if (shadow.adoptedStyleSheets) {
      shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet];
      return;
    }
    const styleElem = document.createElement("style");
    styleElem.textContent = Array.from(sheet.cssRules)
      .map(rule => rule.cssText)
      .join("\n");
    shadow.appendChild(styleElem);
  } catch (err) {
    console.error(err);
  }
}

/* ------------------------------
   Small Widget (fix-widget-small)
------------------------------- */
if (!customElements.get("fix-widget-small")) {
  class FixWidgetSmall extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      // Main container for the small widget
      const container = document.createElement("div");
      container.classList.add("widget-small-container");

      // Content area: flex container with SEO slot, divider, and button
      const content = document.createElement("div");
      content.classList.add("widget-small-content");

      const seoContainer = document.createElement("div");
      seoContainer.classList.add("seo-container");
      const seoSlot = document.createElement("slot");
      seoSlot.name = "seo";
      seoContainer.appendChild(seoSlot);

      // Divider element
      const divider = document.createElement("div");
      divider.classList.add("divider");

      const button = document.createElement("button");
      button.classList.add("widget-button");
      button.textContent = "Open Incontrol.FIX";
      const buttonLink = document.createElement("a");
      buttonLink.href = FIX_URL;
      buttonLink.setAttribute("target", "blank");
      buttonLink.appendChild(button);

      content.appendChild(seoContainer);
      content.appendChild(divider);
      content.appendChild(buttonLink);
      container.appendChild(content);
      this.shadowRoot.appendChild(container);

      attachStyles(this.shadowRoot, STYLE_URL);
    }
  }
  customElements.define("fix-widget-small", FixWidgetSmall);
}