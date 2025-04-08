var FIX_URL = "https://incontrolfix-develop.cloud.maxdoro.com/";
var STYLE_URL = "https://incontrolfix-develop.cloud.maxdoro.com/widget/css/widget.css";
var SRC_URL = "https://incontrolfix-develop.cloud.maxdoro.com/widget/";

if (window.location.origin == "http://localhost:4200") {
  var STYLE_URL = "http://localhost:4200/widget/css/widget.css";
  var SRC_URL = "http://localhost:4200/widget/";
}

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
      console.log(this.getAttribute("data-src"));

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

/* ------------------------------
   Medium Widget (fix-widget-medium)
------------------------------- */
if (!customElements.get("fix-widget-medium")) {
  class FixWidgetMedium extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      // Create main container (800 x 280)
      const container = document.createElement("div");
      container.classList.add("widget-medium-container");

      // TOP BAR AREA (height: 194px = 280 - 86)
      const topBar = document.createElement("div");
      topBar.classList.add("top-bar");

      // Padded content wrapper for top bar
      const topBarContent = document.createElement("div");
      topBarContent.classList.add("top-bar-content");

      // Left side: SEO slot for logo (expects logo2.svg via slot)
      const leftSlot = document.createElement("div");
      leftSlot.classList.add("left-slot");
      const seoSlot = document.createElement("slot");
      seoSlot.name = "seo";
      leftSlot.appendChild(seoSlot);

      // Divider element
      const divider = document.createElement("div");
      divider.classList.add("divider");

      // Right side: Open button
      const rightSlot = document.createElement("div");
      const buttonLink = document.createElement("a");
      const openButton = document.createElement("button");
      rightSlot.classList.add("right-slot");
      buttonLink.href = FIX_URL;
      buttonLink.setAttribute("target", "blank");
      openButton.classList.add("open-button");
      openButton.textContent = "Open Incontrol.FIX";
      buttonLink.appendChild(openButton);
      rightSlot.appendChild(buttonLink);

      topBarContent.appendChild(leftSlot);
      topBarContent.appendChild(divider);
      topBarContent.appendChild(rightSlot);
      topBar.appendChild(topBarContent);

      // BOTTOM BAR (86px tall, background #ABBFC0)
      const bottomBar = document.createElement("div");
      bottomBar.classList.add("bottom-bar");

      const bottomBarContent = document.createElement("div");
      bottomBarContent.classList.add("bottom-bar-content");

      // Powered-by section: wrapper for icon and text
      const poweredByDiv = document.createElement("div");
      poweredByDiv.classList.add("powered-by");

      const poweredByWrapper = document.createElement("div");
      poweredByWrapper.classList.add("powered-by-wrapper");

      // Icon container (44x44) using app_icon.svg
      const iconContainer = document.createElement("div");
      iconContainer.classList.add("powered-by-icon");
      const incontrolIcon = document.createElement("img");
      incontrolIcon.src = SRC_URL + "src/app_icon.svg";
      incontrolIcon.alt = "Incontrol icoon";
      iconContainer.appendChild(incontrolIcon);

      // Text container: two lines ("Powered by" on top, "Incontrol" below)
      const textContainer = document.createElement("div");
      textContainer.classList.add("powered-by-text");
      const poweredLabel = document.createElement("span");
      poweredLabel.classList.add("powered-by-label");
      poweredLabel.textContent = "Powered by";
      const poweredName = document.createElement("span");
      poweredName.classList.add("powered-by-name");
      poweredName.textContent = "Incontrol";
      textContainer.appendChild(poweredLabel);
      textContainer.appendChild(poweredName);

      poweredByWrapper.appendChild(iconContainer);
      poweredByWrapper.appendChild(textContainer);
      poweredByDiv.appendChild(poweredByWrapper);

      // Store buttons container
      const storeButtonsDiv = document.createElement("div");
      storeButtonsDiv.classList.add("store-buttons");

      const playStoreLink = document.createElement("a");
      playStoreLink.href = "https://play.google.com/store/apps/details?id=com.maxdoro.incontrol&hl=nl";
      const playStoreImg = document.createElement("img");
      playStoreImg.src = SRC_URL + "src/play_store.svg";
      playStoreImg.alt = "Krijg het op Google Play";
      playStoreImg.classList.add("store-badge");
      playStoreLink.setAttribute("target", "_blank");
      playStoreLink.appendChild(playStoreImg);

      const appStoreLink = document.createElement("a");
      appStoreLink.href = "https://apps.apple.com/nl/app/incontrol-inspect/id6447438232";
      const appStoreImg = document.createElement("img");
      appStoreImg.src = SRC_URL + "src/app_store.svg";
      appStoreImg.alt = "Download in de App Store";
      appStoreImg.classList.add("store-badge");
      appStoreLink.setAttribute("target", "_blank");
      appStoreLink.appendChild(appStoreImg);

      storeButtonsDiv.appendChild(playStoreLink);
      storeButtonsDiv.appendChild(appStoreLink);

      bottomBarContent.appendChild(poweredByDiv);
      bottomBarContent.appendChild(storeButtonsDiv);
      bottomBar.appendChild(bottomBarContent);

      // PHONE IMAGE: absolutely positioned at top: 31px, left: 50px; use phone.svg
      const phoneImg = document.createElement("img");
      phoneImg.src = SRC_URL + "src/phone.svg";
      phoneImg.alt = "Telefoon icoon";
      phoneImg.classList.add("phone-image");

      // Assemble the medium widget container
      container.appendChild(topBar);
      container.appendChild(bottomBar);
      container.appendChild(phoneImg);
      this.shadowRoot.appendChild(container);

      attachStyles(this.shadowRoot, STYLE_URL);
    }
  }
  customElements.define("fix-widget-medium", FixWidgetMedium);
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
      const buttonLink = document.createElement("a");
      buttonLink.href = FIX_URL;
      buttonLink.setAttribute("target", "blank");
      button.classList.add("widget-button");
      button.textContent = "Open Incontrol.FIX";
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
