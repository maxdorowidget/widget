// widget_medium.js

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
      rightSlot.classList.add("right-slot");
      const buttonLink = document.createElement("a");
      buttonLink.href = FIX_URL;
      buttonLink.setAttribute("target", "blank");
      const openButton = document.createElement("button");
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
      playStoreLink.setAttribute("target", "_blank");
      const playStoreImg = document.createElement("img");
      playStoreImg.src = SRC_URL + "src/play_store.svg";
      playStoreImg.alt = "Krijg het op Google Play";
      playStoreImg.classList.add("store-badge");
      playStoreLink.appendChild(playStoreImg);

      const appStoreLink = document.createElement("a");
      appStoreLink.href = "https://apps.apple.com/nl/app/incontrol-inspect/id6447438232";
      appStoreLink.setAttribute("target", "_blank");
      const appStoreImg = document.createElement("img");
      appStoreImg.src = SRC_URL + "src/app_store.svg";
      appStoreImg.alt = "Download in de App Store";
      appStoreImg.classList.add("store-badge");
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