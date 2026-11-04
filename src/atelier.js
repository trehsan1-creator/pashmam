/* ==========================================================================
   ATIFARZAM — ATELIER interactions
   Progress rail, drifting isometric stage, mobile menu, language select.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop =
    window.matchMedia && window.matchMedia("(min-width: 1024px)");

  var header = document.querySelector(".af-header");
  var stage = document.querySelector(".af-stage-inner");
  var menu = document.getElementById("af-mobile");
  var menuButton = document.getElementById("af-menu-btn");
  var select = document.getElementById("language");
  var queued = false;

  /* ---------------------------------------------------------------------
     Language
     --------------------------------------------------------------------- */
  function applySavedLanguage() {
    var saved = null;
    try {
      saved = window.localStorage && window.localStorage.getItem("af_lang");
    } catch (_) {}

    if (saved && saved !== "fa" && window.AF_APPLY_LANGUAGE) {
      window.AF_APPLY_LANGUAGE(saved, { persist: false });
    }

    if (select) {
      select.value = document.documentElement.getAttribute("lang") || "fa";
      select.addEventListener("change", function () {
        if (window.AF_APPLY_LANGUAGE) {
          window.AF_APPLY_LANGUAGE(select.value, { persist: true });
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Progress + stage drift
     --------------------------------------------------------------------- */
  function render() {
    queued = false;

    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, scrollTop / max));

    doc.style.setProperty("--af-progress", progress.toFixed(4));

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 8);
    }

    if (stage) {
      var canDrift = desktop && desktop.matches && !reduceMotion;
      var drift = canDrift ? Math.min(scrollTop * 0.065, 45) : 0;
      stage.style.setProperty("--drift", drift.toFixed(2) + "px");
    }
  }

  function requestRender() {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(render);
    }
  }

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menu && menuButton) {
    menuButton.addEventListener("click", function () {
      var open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  /* ---------------------------------------------------------------------
     Back to top
     --------------------------------------------------------------------- */
  Array.prototype.forEach.call(
    document.querySelectorAll(".af-to-top"),
    function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth"
        });
      });
    }
  );

  /* ---------------------------------------------------------------------
     Software — 3D scrollytelling
     Scroll progress through the tall track drives four panels in 3D space
     (rotateY / translateZ / opacity) and the matching step + progress rail.
     --------------------------------------------------------------------- */
  var track = document.getElementById("af-scrolly");
  var scene = document.getElementById("af-scene");
  var panels = scene ? Array.prototype.slice.call(scene.querySelectorAll(".af-panel3d")) : [];
  var steps = track ? Array.prototype.slice.call(track.querySelectorAll(".af-step")) : [];
  var scrollyTarget = 0;
  var scrollyCurrent = 0;
  var scrollyRaf = 0;
  var activeStep = -1;
  var staticMode = !!reduceMotion;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function paintScrolly(p) {
    var n = panels.length;
    if (!n) return;
    track.style.setProperty("--sp", p.toFixed(4));

    var pos = p * (n - 1);
    var narrow = window.innerWidth < 1024;
    var spread = narrow ? 70 : 150;
    var depth = narrow ? 180 : 280;

    panels.forEach(function (panel, i) {
      var d = clamp(pos - i, -2.4, 2.4);
      var ad = Math.abs(d);
      var op = Math.max(0, 1 - ad * 1.7);
      panel.style.setProperty("--tx", (-d * spread).toFixed(1) + "px");
      panel.style.setProperty("--tz", (-ad * depth).toFixed(1) + "px");
      panel.style.setProperty("--ry", clamp(d * -55, -80, 80).toFixed(2) + "deg");
      panel.style.setProperty("--op", op.toFixed(3));
      panel.style.setProperty("--z", String(Math.round(100 - ad * 20)));
      panel.classList.toggle("is-front", ad < 0.5);
    });

    var idx = clamp(Math.round(pos), 0, n - 1);
    if (idx !== activeStep) {
      activeStep = idx;
      steps.forEach(function (step, i) {
        var on = i === idx;
        step.classList.toggle("is-active", on);
        step.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
  }

  function readScrollyTarget() {
    if (!track) return 0;
    var rect = track.getBoundingClientRect();
    var range = Math.max(1, rect.height - window.innerHeight);
    return clamp(-rect.top / range, 0, 1);
  }

  function tickScrolly() {
    scrollyRaf = 0;
    var diff = scrollyTarget - scrollyCurrent;
    if (Math.abs(diff) < 0.0004) {
      scrollyCurrent = scrollyTarget;
    } else {
      scrollyCurrent += diff * 0.14;
      scrollyRaf = window.requestAnimationFrame(tickScrolly);
    }
    paintScrolly(scrollyCurrent);
  }

  function updateScrolly(jump) {
    if (!track || !panels.length) return;
    if (staticMode) return;
    scrollyTarget = readScrollyTarget();
    if (jump) scrollyCurrent = scrollyTarget;
    if (!scrollyRaf) scrollyRaf = window.requestAnimationFrame(tickScrolly);
  }

  function goToStep(i) {
    var n = panels.length;
    if (staticMode) {
      paintScrolly(n > 1 ? i / (n - 1) : 0);
      return;
    }
    var top = track.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
    var range = Math.max(1, track.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + (i / (n - 1)) * range + 2,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  if (track && panels.length) {
    if (staticMode) track.classList.add("is-static");

    steps.forEach(function (step, i) {
      step.addEventListener("click", function () { goToStep(i); });
      step.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToStep(i);
        }
      });
    });

    window.addEventListener("scroll", function () { updateScrolly(false); }, { passive: true });
    window.addEventListener("resize", function () { updateScrolly(true); });
    paintScrolly(0);
    updateScrolly(true);
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  applySavedLanguage();

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  if (desktop && desktop.addEventListener) {
    desktop.addEventListener("change", requestRender);
  }
  render();
})();
