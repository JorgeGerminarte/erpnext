/* ==========================================================================
   Comportamiento compartido: menú móvil, cabecera, animaciones y parallax.
   Sin dependencias. Funciona abriendo el HTML directamente (file://).
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Cabecera: fondo al hacer scroll ---------- */
  var header = document.querySelector(".site-header");
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  /* ---------- Menú móvil accesible ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    if ("inert" in menu) menu.inert = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus();
    }
  }

  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Aparición suave al entrar en pantalla ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Parallax del hero ----------
     Tres capas con data-speed (fondo, texto, plantas delanteras).
     - prefers-reduced-motion: desactivado.
     - Dispositivos modestos (ahorro de datos, poca memoria o pocos núcleos)
       y pantallas pequeñas: intensidad reducida.
     - Si durante los primeros fotogramas de scroll el navegador no llega a
       ~35 fps, se desactiva del todo para no penalizar la lectura. */
  var hero = document.querySelector(".hero");
  var layers = hero ? Array.prototype.slice.call(hero.querySelectorAll("[data-speed]")) : [];
  var fadeEl = hero ? hero.querySelector("[data-fade]") : null;

  var conn = navigator.connection || {};
  var modestDevice = conn.saveData === true ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);

  var intensity = 1;
  var disabled = false;
  var ticking = false;
  var heroVisible = true;

  function computeIntensity() {
    if (reducedMotion.matches) return 0;
    var k = window.innerWidth < 720 ? 0.6 : 1;
    if (modestDevice) k *= 0.5;
    return k;
  }

  function resetLayers() {
    layers.forEach(function (el) { el.style.transform = ""; });
    if (fadeEl) fadeEl.style.opacity = "";
  }

  function renderParallax() {
    ticking = false;
    if (disabled || intensity === 0 || !heroVisible) return;
    var y = window.scrollY;
    var h = hero.offsetHeight;
    if (y > h) return;
    layers.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-speed")) || 0;
      el.style.transform = "translate3d(0," + (y * speed * intensity).toFixed(1) + "px,0)";
    });
    if (fadeEl) fadeEl.style.opacity = String(Math.max(0, 1 - (y / h) * 1.35));
  }

  /* Sonda de rendimiento: al empezar el primer scroll mide ~40 fotogramas
     seguidos. Si la mediana supera ~28 ms (< 35 fps) se apaga el parallax. */
  var probeStarted = false;
  function startProbe() {
    probeStarted = true;
    var samples = [];
    var last = 0;
    function frame(t) {
      if (last) samples.push(t - last);
      last = t;
      if (samples.length < 40) { window.requestAnimationFrame(frame); return; }
      samples.sort(function (a, b) { return a - b; });
      if (samples[Math.floor(samples.length / 2)] > 28) { disabled = true; resetLayers(); }
    }
    window.requestAnimationFrame(frame);
  }

  function onScroll() {
    updateHeader();
    if (!layers.length || disabled || intensity === 0) return;
    if (!probeStarted) startProbe();
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(renderParallax);
    }
  }

  function applyMotionPreference() {
    intensity = computeIntensity();
    if (intensity === 0) resetLayers(); else renderParallax();
  }

  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }).observe(hero);
  }

  intensity = computeIntensity();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", applyMotionPreference, { passive: true });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", applyMotionPreference);

  updateHeader();
  renderParallax();

  /* ---------- Año actual en el pie ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
