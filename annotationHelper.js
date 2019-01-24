function addOverlay() {
  destroyOverlay();
  const overlay = document.createElement("div");
  overlay.classList.add("annotation-overlay");
  overlay.setAttribute(
    "style",
    "position:absolute;top:0;left:0;right:0;bottom:0;"
  );
  document.body.appendChild(overlay);
  window.overlay = overlay;
}

function destroyOverlay() {
  if (window.hasOwnProperty("overlay")) {
    window.overlay.remove();
  }
}

function addArrow(left, top, text) {
  const arrow = document.createElement("div");
  let arrowSVG = `<svg width="100" height="100">
  <defs>
  <marker id="arrow" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto">
      <path d="M2,1 L2,10 L10,6 L2,2" style="fill:red;" />
  </marker>
  </defs>

  <path d="M80,50 L20,18"
      style="stroke:red; stroke-width: 3px; fill: none;
      marker-end: url(#arrow);"
  />`;
  if (text) {
    arrowSVG += `<circle cx="80" cy="50" r="10" style="fill:red;"/>
  <text x="77" y="55" style="font: bold 12px sans-serif;fill:white">${text}</text>`;
  }
  arrowSVG += "</svg>";
  arrow.innerHTML = arrowSVG;
  arrow.setAttribute(
    "style",
    `z-index:9999;position:absolute;left:${left}px;top:${top}px;`
  );
  window.overlay.appendChild(arrow);
}

function addArrowToSelector(selector, text) {
  const e = document.querySelector(selector);
  if (e) {
    const box = e.getBoundingClientRect();
    addArrow(box.x + box.width / 2, box.y + box.height * 0.3, text);
  }
}

// TODO refactor box function and style into css?

function addHighlightToSelector(selector) {
  const e = document.querySelector(selector);
  if (e) {
    const box = e.getBoundingClientRect();
    const highlight = document.createElement("div");
    highlight.setAttribute(
      "style",
      `background-color: rgba(255, 230, 8, 0.54);position:absolute;top:${
        box.top
      }px;left:${box.left}px;width:${box.width}px;height:${box.height}px`
    );
    window.overlay.appendChild(highlight);
  }
}

function addBorderToSelector(selector, withArrow) {
  const e = document.querySelector(selector);
  if (e) {
    const box = e.getBoundingClientRect();
    const borderBox = document.createElement("div");
    borderBox.setAttribute(
      "style",
      `z-index:9999;border:3px solid red;position:absolute;top:${
        box.top
      }px;left:${box.left}px;width:${box.width}px;height:${box.height}px`
    );
    window.overlay.appendChild(borderBox);
    if (withArrow) {
      addArrow(box.x + box.width - 10, box.y + box.height - 15);
    }
  }
}

function addBlur(selector) {
  const e = document.querySelector(selector);
  if (e) {
    e.style.filter = "blur(4px)";
  }
}

