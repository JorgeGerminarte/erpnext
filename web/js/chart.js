/* ==========================================================================
   Gráfica de evolución (REHAB) — SVG sin dependencias.
   Los datos se leen de la tabla accesible que hay dentro de .chart-data, así
   que para cambiar el ejemplo basta con editar esa tabla en el HTML.
   ========================================================================== */
(function () {
  "use strict";

  var figure = document.querySelector("[data-chart]");
  if (!figure) return;

  var host = figure.querySelector(".chart");
  var tooltip = figure.querySelector(".chart-tooltip");
  var target = parseFloat(figure.getAttribute("data-target"));
  var unit = figure.getAttribute("data-unit") || "";
  var NS = "http://www.w3.org/2000/svg";

  var data = Array.prototype.map.call(figure.querySelectorAll(".chart-data tbody tr"), function (tr) {
    var c = tr.children;
    return { x: parseFloat(c[0].getAttribute("data-value")), label: c[0].textContent.trim(), stage: c[1].textContent.trim(), y: parseFloat(c[2].textContent) };
  });
  if (!data.length) return;

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function render() {
    var W = Math.max(280, host.clientWidth);
    var H = Math.round(Math.min(340, Math.max(220, W * 0.52)));
    var m = { t: 18, r: 40, b: 34, l: 34 };
    var yMin = 40, yMax = 100;
    var xMax = data[data.length - 1].x;
    var sx = function (v) { return m.l + (v / xMax) * (W - m.l - m.r); };
    var sy = function (v) { return m.t + (1 - (v - yMin) / (yMax - yMin)) * (H - m.t - m.b); };

    host.innerHTML = "";
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-labelledby": "chart-title chart-desc" });
    host.appendChild(svg);

    var defs = el("defs", {}, svg);
    var grad = el("linearGradient", { id: "area-fill", x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
    el("stop", { offset: "0%", "stop-color": "#bf8438", "stop-opacity": 0.28 }, grad);
    el("stop", { offset: "100%", "stop-color": "#bf8438", "stop-opacity": 0 }, grad);

    // Rejilla y eje Y (recesivos)
    var grid = el("g", { class: "grid" }, svg);
    var axis = el("g", { class: "axis", "aria-hidden": "true" }, svg);
    [40, 60, 80, 100].forEach(function (v) {
      el("line", { x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v) }, grid);
      el("text", { x: m.l - 8, y: sy(v) + 4, "text-anchor": "end" }, axis).textContent = v;
    });
    data.forEach(function (d) {
      el("text", { x: sx(d.x), y: H - 10, "text-anchor": "middle" }, axis).textContent = d.label;
    });

    // Línea de objetivo
    if (!isNaN(target)) {
      var tg = el("g", { class: "target", "aria-hidden": "true" }, svg);
      el("line", { x1: m.l, x2: W - m.r, y1: sy(target), y2: sy(target) }, tg);
      el("text", { x: m.l + 4, y: sy(target) - 7 }, tg).textContent = "Objetivo " + target + unit;
    }

    // Área y línea
    var pts = data.map(function (d) { return [sx(d.x), sy(d.y)]; });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("");
    var baseY = sy(yMin);
    el("path", { class: "area", d: line + "L" + pts[pts.length - 1][0] + " " + baseY + "L" + pts[0][0] + " " + baseY + "Z", "aria-hidden": "true" }, svg);
    var path = el("path", { class: "line", d: line, "aria-hidden": "true" }, svg);
    host.style.setProperty("--len", Math.ceil(path.getTotalLength()));

    var cross = el("line", { class: "crosshair", y1: m.t, y2: H - m.b, "aria-hidden": "true" }, svg);

    // Puntos + zonas de interacción (más grandes que la marca)
    data.forEach(function (d, i) {
      var cx = sx(d.x), cy = sy(d.y);
      el("circle", { class: "dot" + (i === 0 ? " dot--first" : ""), cx: cx, cy: cy, r: 5, "aria-hidden": "true" }, svg);
      var hit = el("circle", {
        class: "hit", cx: cx, cy: cy, r: 20, tabindex: 0, role: "img",
        "aria-label": d.label + ", " + d.stage + ": " + d.y + unit
      }, svg);
      el("circle", { class: "ring", cx: cx, cy: cy, r: 10 }, svg);

      function show() {
        tooltip.innerHTML = "<strong>" + d.y + unit + "</strong><span>" + d.label + " · " + d.stage + "</span>";
        tooltip.style.left = (cx / W) * 100 + "%";
        tooltip.style.top = (cy / H) * 100 + "%";
        tooltip.classList.add("is-on");
        cross.setAttribute("x1", cx); cross.setAttribute("x2", cx); cross.style.opacity = 1;
      }
      function hide() { tooltip.classList.remove("is-on"); cross.style.opacity = 0; }
      hit.addEventListener("pointerenter", show);
      hit.addEventListener("pointerleave", hide);
      hit.addEventListener("focus", show);
      hit.addEventListener("blur", hide);
    });

    // Etiquetas directas selectivas: punto de partida y último dato
    var first = data[0], last = data[data.length - 1];
    el("text", { class: "label", x: sx(first.x) + 10, y: sy(first.y) + 18, "aria-hidden": "true" }, svg).textContent = first.y + unit;
    el("text", { class: "label", x: sx(last.x) - 4, y: sy(last.y) - 14, "text-anchor": "middle", "aria-hidden": "true" }, svg).textContent = last.y + unit;
  }

  render();

  // KPI de cabecera calculado a partir de los datos
  var kpi = figure.querySelector("[data-kpi]");
  if (kpi) kpi.textContent = "+" + (data[data.length - 1].y - data[0].y) + " pts";

  // Solo se redibuja si cambia el ancho (en móvil la barra de URL cambia el alto)
  var resizeTimer, lastW = host.clientWidth;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (host.clientWidth === lastW) return;
      lastW = host.clientWidth;
      render();
      host.classList.add("is-drawn");
    }, 150);
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { host.classList.add("is-drawn"); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(host);
  } else {
    host.classList.add("is-drawn");
  }
})();
