/* ==========================================================================
   Web única — comportamiento propio (se carga después de /shared/base.js)
   - Imágenes: si existe el archivo en /img lo usa; si no, deja el marcador.
   - El umbral: escena fija que pasa de la clínica a REHAB con el scroll.
   - Cabecera y WhatsApp cambian según el centro que se está viendo.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var conn = navigator.connection || {};
  var modest = conn.saveData === true || (navigator.deviceMemory && navigator.deviceMemory <= 2);

  function setLite() { root.classList.toggle("motion-lite", reducedMotion.matches || modest); }
  setLite();
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", setLite);

  /* ---------- Imágenes con respaldo ---------- */
  document.querySelectorAll("[data-img]").forEach(function (el) {
    var src = el.getAttribute("data-img");
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add("has-img");
    };
    img.src = src;
  });
  document.querySelectorAll(".plant-slot[data-src], .umbral__plant[data-src]").forEach(function (slot) {
    var img = new Image();
    img.alt = "";
    img.onload = function () { slot.innerHTML = ""; slot.appendChild(img); };
    img.src = slot.getAttribute("data-src");
  });

  /* ---------- WhatsApp según el centro ---------- */
  var WA_PHONE = "[TELÉFONO]"; // número con prefijo 34, sin espacios
  var WA_TEXT = {
    clinica: "Hola, quiero pedir cita en la clínica",
    rehab: "Hola, quiero reservar mi valoración inicial en Rehab"
  };
  var LABEL = { clinica: "Pedir cita", rehab: "Reservar valoración" };
  function waHref(brand) { return "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(WA_TEXT[brand]); }

  var header = document.querySelector(".site-header");
  var dynamicWa = document.querySelectorAll("[data-wa-dynamic]");
  var current = { theme: null, brand: null };

  function applyContext(theme, brand) {
    if (theme && theme !== current.theme) {
      current.theme = theme;
      header.classList.toggle("theme-dark", theme === "dark");
      header.classList.toggle("theme-light", theme === "light");
    }
    if (brand && brand !== current.brand) {
      current.brand = brand;
      dynamicWa.forEach(function (a) {
        a.href = waHref(brand);
        var label = a.querySelector("[data-wa-label]");
        if (label) label.textContent = LABEL[brand];
        if (a.classList.contains("wa-fab")) {
          a.setAttribute("aria-label", (brand === "rehab" ? "Reservar valoración inicial en REHAB" : "Pedir cita en la clínica") + " por WhatsApp");
        }
      });
    }
  }

  // Sección bajo la cabecera → tema y centro
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-theme-section]"));
  function contextFromSections() {
    var probeY = (header ? header.offsetHeight : 64) / 2;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        var s = sections[i];
        if (s === umbral) return; // el umbral decide por su cuenta
        applyContext(s.getAttribute("data-theme-section"), s.getAttribute("data-brand"));
        return;
      }
    }
  }

  /* ---------- El umbral ---------- */
  var umbral = document.querySelector(".umbral");
  var lastP = -1;

  function updateUmbral() {
    if (!umbral) return;
    var r = umbral.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    if (root.classList.contains("motion-lite")) {
      applyContext(r.top < vh / 2 ? "dark" : null, r.top < vh / 2 ? "rehab" : null);
      return;
    }
    var p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    if (Math.abs(p - lastP) > 0.001) {
      lastP = p;
      umbral.style.setProperty("--p", p.toFixed(4));
      umbral.setAttribute("data-step", p < 0.36 ? "1" : p < 0.64 ? "2" : "3");
    }
    if (r.top <= 0) applyContext(p < 0.62 ? "light" : "dark", p < 0.62 ? "clinica" : "rehab");
  }

  var ticking = false;
  function frame() {
    ticking = false;
    contextFromSections();
    updateUmbral();
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  frame();
})();
