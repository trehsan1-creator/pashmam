/* ==========================================================================
   ATIFARZAM — PREMIUM COMMAND LAYER (interactions)
   Runs after presentation.js / pages.js. Pure vanilla, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer =
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------------------------
     Chapter emblem on the inner pages
     --------------------------------------------------------------------- */
  var PAGE_META = {
    hardware: { num: "01", code: "HARDWARE / TELEMETRY" },
    software: { num: "02", code: "MYFARZAM / PLATFORM" },
    company: { num: "03", code: "COMPANY / B2B" },
    contact: { num: "04", code: "CONTACT / SUPPORT" }
  };

  function mountPageEmblem() {
    var page = root.getAttribute("data-page") || "";
    var meta = PAGE_META[page];
    var hero = document.querySelector(".page-hero");
    if (!meta || !hero || hero.querySelector(".page-emblem")) return;

    var emblem = document.createElement("div");
    emblem.className = "page-emblem";
    emblem.setAttribute("aria-hidden", "true");
    emblem.innerHTML =
      '<svg viewBox="0 0 320 320" focusable="false">' +
      '<circle class="pe-ring" cx="160" cy="160" r="152"/>' +
      '<circle class="pe-ring" cx="160" cy="160" r="116"/>' +
      '<circle class="pe-ring" cx="160" cy="160" r="132"/>' +
      '<circle class="pe-ring-dash" cx="160" cy="160" r="142"/>' +
      '<circle class="pe-ring-dash pe-ring-dash-2" cx="160" cy="160" r="104"/>' +
      '<path class="pe-cross" d="M160 2v30M160 288v30M2 160h30M288 160h30"/>' +
      '<path class="pe-arc" d="M160 32a128 128 0 0 1 110 63"/>' +
      "</svg>" +
      '<span class="pe-num">' +
      meta.num +
      "</span>" +
      '<span class="pe-code">' +
      meta.code.split(" / ").join("<br>") +
      "</span>";
    hero.appendChild(emblem);
  }

  /* ---------------------------------------------------------------------
     Live fleet console: clock + gently drifting telemetry
     --------------------------------------------------------------------- */
  function mountConsole() {
    var consoleEl = document.getElementById("hero-console");
    if (!consoleEl) return;

    var clock = document.getElementById("console-clock");
    var speed = document.getElementById("console-speed");
    var speedSide = document.getElementById("console-speed-side");
    var fuel = document.getElementById("console-fuel");
    var temp = document.getElementById("console-temp");

    function two(n) {
      return (n < 10 ? "0" : "") + n;
    }

    function paintClock() {
      if (!clock) return;
      try {
        var now = new Date();
        var parts = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Tehran"
        }).format(now);
        clock.textContent = parts;
      } catch (e) {
        var d = new Date();
        clock.textContent = two(d.getHours()) + ":" + two(d.getMinutes());
      }
    }

    paintClock();
    window.setInterval(paintClock, 30000);

    if (reduceMotion) return;

    var currentSpeed = 84;
    var currentFuel = 62;
    var currentTemp = -4;
    var timer = 0;

    function drift() {
      currentSpeed = Math.max(48, Math.min(112, currentSpeed + (Math.random() * 14 - 7)));
      currentFuel = Math.max(41, Math.min(88, currentFuel + (Math.random() * 2 - 1)));
      currentTemp = Math.max(-8, Math.min(2, currentTemp + (Math.random() * 1.2 - 0.6)));

      if (speed) speed.textContent = String(Math.round(currentSpeed));
      if (speedSide) speedSide.textContent = String(Math.round(currentSpeed));
      if (fuel) fuel.textContent = String(Math.round(currentFuel));
      if (temp) temp.textContent = String(Math.round(currentTemp));
    }

    function start() {
      if (timer) return;
      timer = window.setInterval(drift, 3400);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = 0;
    }

    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    if (!document.hidden) start();
  }

  /* ---------------------------------------------------------------------
     Perspective tilt for the console only
     --------------------------------------------------------------------- */
  function mountTilt() {
    if (!finePointer || reduceMotion) return;

    var el = document.getElementById("hero-console");
    if (!el) return;

    var raf = 0;
    var tx = 0;
    var ty = 0;

    function paint() {
      raf = 0;
      el.style.setProperty("--rx", (2 + ty).toFixed(2) + "deg");
      el.style.setProperty("--ry", (-4 + tx).toFixed(2) + "deg");
    }

    function onMove(e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tx = x * 5;
      ty = -y * 4;
      if (!raf) raf = requestAnimationFrame(paint);
    }

    function reset() {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(paint);
    }

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
  }

  /* ---------------------------------------------------------------------
     Subtle pointer parallax on the hero scene
     --------------------------------------------------------------------- */
  function mountHeroParallax() {
    if (!finePointer || reduceMotion) return;

    var hero = document.querySelector(".hero-command");
    if (!hero) return;

    var raf = 0;
    var px = 0;
    var py = 0;

    function paint() {
      raf = 0;
      hero.style.setProperty("--px", px.toFixed(3));
      hero.style.setProperty("--py", py.toFixed(3));
    }

    hero.addEventListener(
      "pointermove",
      function (e) {
        var r = hero.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * -2;
        py = ((e.clientY - r.top) / r.height - 0.5) * -2;
        if (!raf) raf = requestAnimationFrame(paint);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", function () {
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(paint);
    });
  }

  /* ---------------------------------------------------------------------
     Magnetic primary buttons (desktop only, a few pixels)
     --------------------------------------------------------------------- */
  function mountMagnetic() {
    if (!finePointer || reduceMotion) return;

    var selector = ".btn-orange, .btn-outline-cream, .btn-outline-navy, .nav-cta";
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (btn) {
      var raf = 0;
      var mx = 0;
      var my = 0;

      function paint() {
        raf = 0;
        btn.style.transform = "translate3d(" + mx.toFixed(2) + "px," + my.toFixed(2) + "px,0)";
      }

      btn.addEventListener(
        "pointermove",
        function (e) {
          var r = btn.getBoundingClientRect();
          mx = ((e.clientX - r.left) / r.width - 0.5) * 8;
          my = ((e.clientY - r.top) / r.height - 0.5) * 6;
          if (!raf) raf = requestAnimationFrame(paint);
        },
        { passive: true }
      );

      btn.addEventListener("pointerleave", function () {
        mx = 0;
        my = 0;
        if (!raf) raf = requestAnimationFrame(paint);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Stagger inside repeated grids (uses the existing --d reveal variable)
     --------------------------------------------------------------------- */
  function mountStagger() {
    var grids = document.querySelectorAll(
      ".doors, .auds, .rgrid, .catalog-grid, .dev-grid, .plans, .xv-list"
    );

    Array.prototype.forEach.call(grids, function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        if (!child.style.getPropertyValue("--d")) {
          child.style.setProperty("--d", Math.min(i * 0.07, 0.42).toFixed(2) + "s");
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-driven depth for the hero deck
     --------------------------------------------------------------------- */
  function mountHeroDepth() {
    var hero = document.querySelector(".hero-command");
    if (!hero) return;

    var mq = window.matchMedia(
      "(min-width: 981px) and (prefers-reduced-motion: no-preference)"
    );
    var raf = 0;

    function paint() {
      raf = 0;
      if (!mq.matches) {
        hero.style.removeProperty("--sp");
        return;
      }
      var h = hero.offsetHeight || window.innerHeight;
      var p = Math.min(1, Math.max(0, window.scrollY / h));
      hero.style.setProperty("--sp", p.toFixed(4));
    }

    function req() {
      if (!raf) raf = window.requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    if (mq.addEventListener) mq.addEventListener("change", req);
    paint();
  }

  /* ---------------------------------------------------------------------
     3D stack: scroll progress + active layer
     --------------------------------------------------------------------- */
  function mountStack() {
    var wrap = document.getElementById("stack-wrap");
    if (!wrap) return;

    var steps = Array.prototype.slice.call(
      wrap.querySelectorAll(".stack-steps li")
    );
    var planes = Array.prototype.slice.call(
      wrap.querySelectorAll(".stack-plane")
    );
    var mq = window.matchMedia(
      "(max-width: 980px), (prefers-reduced-motion: reduce)"
    );
    var raf = 0;
    var lastKey = "";

    function setActive(stepIndex, hotIndex) {
      if (hotIndex === undefined) hotIndex = stepIndex;
      var key = stepIndex + ":" + hotIndex;
      if (key === lastKey) return;
      lastKey = key;
      steps.forEach(function (el, k) {
        el.classList.toggle("is-active", k <= stepIndex);
      });
      planes.forEach(function (el, k) {
        el.classList.toggle("is-hot", hotIndex >= 0 && k === hotIndex);
      });
    }

    function paint() {
      raf = 0;

      if (mq.matches) {
        wrap.style.removeProperty("--p");
        setActive(3, -1);
        return;
      }

      var r = wrap.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      if (total <= 0) {
        wrap.style.setProperty("--p", "0");
        setActive(0, 0);
        return;
      }

      var p = Math.min(1, Math.max(0, -r.top / total));
      wrap.style.setProperty("--p", p.toFixed(4));

      var idx = Math.min(3, Math.floor(p * 4.0001));
      setActive(idx, idx);
    }

    function req() {
      if (!raf) raf = window.requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    if (mq.addEventListener) mq.addEventListener("change", req);
    paint();
  }

  /* ---------------------------------------------------------------------
     Pointer-driven 3D tilt on the card surfaces
     --------------------------------------------------------------------- */
  function mountCardTilt() {
    if (!finePointer || reduceMotion) return;

    var cards = document.querySelectorAll(".door, .rcard, .pcard");
    Array.prototype.forEach.call(cards, function (el) {
      var raf = 0;
      var tx = 0;
      var ty = 0;

      function paint() {
        raf = 0;
        el.style.setProperty("--tx", tx.toFixed(2) + "deg");
        el.style.setProperty("--ty", ty.toFixed(2) + "deg");
      }

      function req() {
        if (!raf) raf = window.requestAnimationFrame(paint);
      }

      el.addEventListener(
        "pointermove",
        function (e) {
          if (el.classList.contains("reveal") && !el.classList.contains("is-in")) {
            return;
          }
          var r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          tx = (0.5 - (e.clientY - r.top) / r.height) * 4;
          ty = ((e.clientX - r.left) / r.width - 0.5) * 5;
          req();
        },
        { passive: true }
      );

      el.addEventListener("pointerleave", function () {
        tx = 0;
        ty = 0;
        req();
      });
    });
  }

  /* ---------------------------------------------------------------------
     Global scroll state (used by the mobile floating CTA)
     --------------------------------------------------------------------- */
  function mountScrollState() {
    var body = document.body;
    var hero = document.querySelector(".hero-command");
    var ticking = false;

    function paint() {
      ticking = false;
      var show;
      if (hero) {
        show = hero.getBoundingClientRect().bottom < window.innerHeight * 0.55;
      } else {
        show = window.scrollY > 280;
      }
      var nearBottom =
        window.scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 560;
      body.classList.toggle("is-scrolled", show && !nearBottom);
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(paint);
        }
      },
      { passive: true }
    );

    paint();
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  if (reduceMotion) {
    Array.prototype.forEach.call(
      document.querySelectorAll("animateMotion"),
      function (node) {
        node.remove();
      }
    );
  }

  mountScrollState();
  mountPageEmblem();
  mountConsole();
  mountTilt();
  mountHeroParallax();
  mountHeroDepth();
  mountStack();
  mountCardTilt();
  mountMagnetic();
  mountStagger();
})();
