/* Exploded-view scroll interaction for hardware.html */
(function () {
  var wrap = document.getElementById("xv-wrap");
  if (!wrap) return;
  var layers = [].slice.call(wrap.querySelectorAll(".xv-layer"));
  var items = [].slice.call(wrap.querySelectorAll(".xv-item"));
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forced = -1, raf = 0;
  function setOn(i) {
    layers.forEach(function (l, k) { l.classList.toggle("is-on", k === i); });
    items.forEach(function (l, k) { l.classList.toggle("is-on", k === i); });
    wrap.classList.toggle("has-on", i >= 0);
  }
  function tick() {
    raf = 0;
    var r = wrap.getBoundingClientRect();
    var span = Math.max(1, r.height - window.innerHeight);
    var p = Math.min(1, Math.max(0, -r.top / span));
    var ex = reduce ? 1 : Math.min(1, p * 2.2);
    wrap.style.setProperty("--ex", ex.toFixed(3));
    if (forced < 0) setOn(ex < 0.85 ? -1 : Math.max(0, Math.min(3, Math.floor((p - 0.4) / 0.6 * 4))));
  }
  function req() { if (!raf) raf = requestAnimationFrame(tick); }
  items.forEach(function (el, i) {
    ["mouseenter", "focus"].forEach(function (e) { el.addEventListener(e, function () { forced = i; setOn(i); }); });
    ["mouseleave", "blur"].forEach(function (e) { el.addEventListener(e, function () { forced = -1; req(); }); });
  });
  layers.forEach(function (el, i) {
    el.addEventListener("mouseenter", function () { forced = i; setOn(i); });
    el.addEventListener("mouseleave", function () { forced = -1; req(); });
  });
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req, { passive: true });
  tick();
})();

/* Screenshots: swap placeholder for real image if assets/screens/<name>.* exists */
(function () {
  var exts = ["png", "webp", "jpg"];
  [].slice.call(document.querySelectorAll("[data-shot]")).forEach(function (fig) {
    var img = fig.querySelector("img"), n = fig.getAttribute("data-shot"), i = 0;
    function tryNext() {
      if (i >= exts.length) {
        fig.classList.add("is-missing");
        var ch = fig.closest(".shots-chapter");
        if (ch && !ch.querySelector(".shot:not(.is-missing)")) ch.hidden = true;
        return;
      }
      var t = new Image();
      t.onload = function () { img.src = t.src; img.hidden = false; fig.classList.add("has-img"); };
      t.onerror = tryNext;
      t.src = "./assets/screens/" + n + "." + exts[i++];
    }
    tryNext();
  });
})();

/* Hardware catalog: data from src/products.js; empty list -> placeholder cards */
(function () {
  var grid = document.getElementById("catalog-grid");
  if (!grid) return;
  var list = window.AF_PRODUCTS || [], fwrap = document.getElementById("catalog-filters");
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function draw(tag) {
    if (!list.length) {
      grid.innerHTML = [1, 2, 3, 4, 5, 6].map(function (n) {
        return '<div class="pcard is-empty"><div class="pcard-img">جای مدل ' + n + '</div><div class="pcard-body"><h3>نام مدل</h3><p>توضیح کوتاه کاربرد دستگاه</p></div></div>';
      }).join("");
      return;
    }
    grid.innerHTML = list.filter(function (p) { return !tag || p.tag === tag; }).map(function (p) {
      var href = p.href || ("contact.html?model=" + encodeURIComponent(p.name));
      var chips = (p.inputs || []).map(function (i) { return "<i>" + esc(i) + "</i>"; }).join("");
      var en = (p.enables || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");
      return '<a class="pcard reveal is-in" href="' + esc(href) + '"><div class="pcard-img">' + (p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' : "") +
        '</div><div class="pcard-body">' + (p.tag ? "<em>" + esc(p.tag) + "</em>" : "") + "<h3>" + esc(p.name) + "</h3><p>" + esc(p.desc) + "</p>" +
        (chips ? '<div class="pc-in">' + chips + "</div>" : "") + (en ? '<ul class="pc-en">' + en + "</ul>" : "") +
        (p.note ? '<small class="pc-note">' + esc(p.note) + "</small>" : "") + "</div></a>";
    }).join("");
  }
  var tags = [];
  list.forEach(function (p) { if (p.tag && tags.indexOf(p.tag) < 0) tags.push(p.tag); });
  if (tags.length > 1 && fwrap) {
    fwrap.innerHTML = ["همه کلاس‌ها"].concat(tags).map(function (t, i) { return '<button type="button" class="chip-f' + (i ? "" : " is-on") + '" data-t="' + (i ? esc(t) : "") + '">' + esc(t) + "</button>"; }).join("");
    fwrap.addEventListener("click", function (e) {
      var b = e.target.closest(".chip-f"); if (!b) return;
      [].forEach.call(fwrap.children, function (c) { c.classList.toggle("is-on", c === b); });
      draw(b.getAttribute("data-t"));
    });
  }
  draw("");
})();

/* Software page: tabbed groups (monitoring / management / reports / benefits) */
(function () {
  var tabs = document.getElementById("sw-tabs");
  if (!tabs) return;
  var groups = [].slice.call(document.querySelectorAll(".sw-group"));
  var btns = [].slice.call(tabs.querySelectorAll("button"));
  function show(g) {
    groups.forEach(function (x) { x.hidden = x.getAttribute("data-g") !== g; });
    btns.forEach(function (b) { var on = b.getAttribute("data-g") === g; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
  }
  function fromHash(scroll) {
    var id = location.hash.slice(1), el = id && document.getElementById(id), g = el && el.closest(".sw-group");
    if (!g) return;
    show(g.getAttribute("data-g"));
    if (scroll) requestAnimationFrame(function () { el.scrollIntoView(); });
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      show(b.getAttribute("data-g"));
      var first = document.querySelector('.sw-group[data-g="' + b.getAttribute("data-g") + '"]');
      if (first) window.scrollTo({ top: first.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
    });
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var el = document.getElementById(a.getAttribute("href").slice(1)), g = el && el.closest(".sw-group");
    if (g) show(g.getAttribute("data-g"));
  }, true);
  window.addEventListener("hashchange", function () { fromHash(true); });
  fromHash(true);
})();

/* Door cards: pointer spotlight */
(function () {
  [].slice.call(document.querySelectorAll(".door")).forEach(function (d) {
    d.addEventListener("pointermove", function (e) {
      var r = d.getBoundingClientRect();
      d.style.setProperty("--mx", (e.clientX - r.left) + "px");
      d.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  });
})();

/* Contact form: prefill from ?service= / ?model=, personal toggle, sent note */
(function () {
  var f = document.getElementById("lead-form"); if (!f) return;
  var q = new URLSearchParams(location.search);
  if (q.get("sent")) { var n = document.getElementById("sent-note"); if (n) n.hidden = false; }
  var svc = q.get("service"), r = svc && f.querySelector('input[name="kind"][value="' + svc + '"]'); if (r) r.checked = true;
  var m = q.get("model"), t = f.querySelector('textarea[name="notes"]'); if (m && t) t.value = "مدل موردنظر: " + m;
  function sync() {
    var k = f.querySelector('input[name="kind"]:checked'), personal = k && k.value === "personal";
    [].forEach.call(f.querySelectorAll("[data-org]"), function (el) { el.hidden = personal; });
  }
  f.addEventListener("change", sync); sync();
})();

/* Copy support email */
(function () {
  [].slice.call(document.querySelectorAll(".copy-mail")).forEach(function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-mail"), old = b.textContent;
      function done() { b.textContent = "کپی شد ✓"; setTimeout(function () { b.textContent = old; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m).then(done, function () {});
      else done();
    });
  });
})();

/* Contact details: fill src/contact-config in AF_CONTACT; blocks stay hidden until a real value exists */
(function () {
  var c = window.AF_CONTACT || {};
  [].slice.call(document.querySelectorAll("[data-contact]")).forEach(function (box) {
    var k = box.getAttribute("data-contact"), v = c[k], s = box.querySelector("[data-contact-val]");
    if (v && s) { s.textContent = v; box.hidden = false; }
  });
})();
