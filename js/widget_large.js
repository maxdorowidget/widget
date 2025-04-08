// widget_large.js

var FIX_URL = "https://fix.incontrol.app/";
var STYLE_URL = "https://cdn.jsdelivr.net/gh/maxdorowidget/widget@main/css/widget.min.css";
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

/* --------------------------
   Large Widget (fix-widget)
--------------------------- */
if (!customElements.get("fix-widget")) {
  class FixWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      // Create main container
      const container = document.createElement("div");
      container.classList.add("widget-large-container");

      // Top bar (56px) with gradient background and centered SEO slot for logo
      const topBar = document.createElement("div");
      topBar.classList.add("widget-large-topbar");
      const logoSlot = document.createElement("slot");
      logoSlot.name = "seo";
      topBar.appendChild(logoSlot);

      // Main content area (centered)
      const contentArea = document.createElement("div");
      contentArea.classList.add("widget-large-content");

      // Login box (360px wide)
      const loginBox = document.createElement("div");
      loginBox.classList.add("login-box");

      // Update title based on data-company attribute
      const company = this.getAttribute("data-company");
      const titleText = company && company.trim() !== ""
        ? `Inloggen op het ${company} Klantportaal`
        : "Inloggen op Incontrol.FIX";
      const title = document.createElement("h1");
      title.textContent = titleText;
      loginBox.appendChild(title);

      const subtitle = document.createElement("h2");
      subtitle.textContent = "Krijg inzicht in je locaties en bevindingen";
      loginBox.appendChild(subtitle);

      const appImg = document.createElement("img");
      appImg.src = SRC_URL + "src/app.svg";
      appImg.alt = "App illustratie";
      appImg.classList.add("widget-large-appimg");
      loginBox.appendChild(appImg);

      // Link styled as a button pointing to the product domain
      const qrLinkButton = document.createElement("a");
      qrLinkButton.href = FIX_URL;
      qrLinkButton.textContent = "Inloggen met QR code scan";
      qrLinkButton.classList.add("widget-large-button");
      qrLinkButton.setAttribute("target", "_blank");
      loginBox.appendChild(qrLinkButton);

      const manualLink = document.createElement("a");
      manualLink.href = FIX_URL + "login/manual-code?redirectUri=%2F";
      manualLink.textContent = "Handmatig code invoeren";
      manualLink.classList.add("widget-large-link");
      manualLink.setAttribute("target", "_blank");
      loginBox.appendChild(manualLink);

      contentArea.appendChild(loginBox);

      // Bottom bar (56px) with background #EEE and centered link
      const bottomBar = document.createElement("div");
      bottomBar.classList.add("widget-large-bottombar");
      const bottomLink = document.createElement("a");
      bottomLink.href = FIX_URL;
      bottomLink.textContent = "Inloggen met gebruikersnaam";
      bottomLink.classList.add("widget-large-link");
      bottomLink.setAttribute("target", "_blank");
      bottomBar.appendChild(bottomLink);

      // Assemble the widget
      container.appendChild(topBar);
      container.appendChild(contentArea);
      container.appendChild(bottomBar);
      this.shadowRoot.appendChild(container);

      attachStyles(this.shadowRoot, STYLE_URL);
    }

    static get observedAttributes() {
      return ["data-company"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "data-company") {
        this._updateTitle(newValue);
      }
    }

    connectedCallback() {
      const company = this.getAttribute("data-company");
      this._updateTitle(company);
    }

    _updateTitle(company) {
      const title = this.shadowRoot.querySelector(".login-box h1");
      if (title) {
        title.textContent = (company && company.trim() !== "")
          ? `Inloggen op het ${company} Klantportaal`
          : "Inloggen op Incontrol.FIX";
      }
    }
  }
  customElements.define("fix-widget", FixWidget);
}