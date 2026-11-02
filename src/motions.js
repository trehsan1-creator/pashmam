/**
 * S l — Selected Brand Loading Motions (#08, #10, #12) + Canonical Geometry
 * Light-gray theme + official navy (#102333) & orange (#f05327)
 *
 * Loaded as a classic (non-module) script before presentation.js, so the site
 * also works when index.html is opened directly via file://. Top-level bindings
 * (MOTIONS, CANONICAL_PATH, ...) are shared with presentation.js.
 */

const CANONICAL_PATH =
  "M-172.105,-310.465C94.225,-310.465 310.465,-94.235 310.465,172.105C310.465,248.465 248.465,310.465 172.105,310.465L-172.105,310.465C-248.465,310.465 -310.465,248.465 -310.465,172.105L-310.465,-172.105C-310.465,-248.465 -248.465,-310.465 -172.105,-310.465Z";

const BRAND_COLOR = "#102333";

const PALETTES = [
  {
    id: "brand",
    name: "اصلی برند",
    nameEn: "Brand Navy & Orange",
    colors: ["#102333", "#f05327", "#102333", "#102333"],
    recommendedBg: "light",
  },
  {
    id: "cream",
    name: "روشن و نارنجی",
    nameEn: "Light & Orange",
    colors: ["#F2F4F8", "#f05327", "#F2F4F8", "#F2F4F8"],
    recommendedBg: "dark",
  },
];

const CATEGORIES = [
  { id: "all", label: "موشن‌های منتخب" },
  { id: "splash", label: "اسپلش و برند" },
  { id: "morph", label: "تغییر شکل هندسی" },
  { id: "linear", label: "خطی و اینلاین" },
];

function sec(baseSeconds, speed = 1) {
  const val = baseSeconds / (Number(speed) || 1);
  return `${Number(val.toFixed(3))}s`;
}

function sel(scope, sub) {
  return scope ? `${scope} ${sub}` : sub;
}

function directFourPathsMarkup(extraAttrs = "") {
  return `<g class="stage">
    <path class="p p1" d="${CANONICAL_PATH}"${extraAttrs}/>
    <path class="p p2" d="${CANONICAL_PATH}"${extraAttrs}/>
    <path class="p p3" d="${CANONICAL_PATH}"${extraAttrs}/>
    <path class="p p4" d="${CANONICAL_PATH}"${extraAttrs}/>
  </g>`;
}

const MOTIONS = [
  {
    id: "diagonal-orbit",
    num: "08",
    slug: "08-diagonal-orbit",
    titleFa: "رقص قطری",
    titleEn: "Diagonal Orbit",
    category: "splash",
    categoryFa: "اسپلش و برند",
    descFa: "جفت‌های قطری به نوبت در مدار بیرونی ۱۸۰ درجه جای خود را عوض می‌کنند در حالی که جفت دیگر به مرکز جمع می‌شود.",
    duration: "4.4s",
    viewBox: "-920 -920 1840 1840",
    aspect: "square",
    buildMarkup: () => directFourPathsMarkup(),
    buildCss: (scope = "", spd = 1) => `
${sel(scope, ".p")} {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation-duration: ${sec(4.4, spd)};
  animation-timing-function: cubic-bezier(0.55, 0, 0.25, 1);
  animation-iteration-count: infinite;
}
${sel(scope, ".p2")} { fill: var(--c2, #102333); animation-name: sl08-a1; }
${sel(scope, ".p4")} { fill: var(--c4, #102333); animation-name: sl08-a2; }
${sel(scope, ".p3")} { fill: var(--c3, #102333); animation-name: sl08-b1; }
${sel(scope, ".p1")} { fill: var(--c1, #102333); animation-name: sl08-b2; }
@keyframes sl08-a1 {
  0%, 3%    { transform: rotate(0deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  12.5%     { transform: rotate(90deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  22%, 28%  { transform: rotate(180deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  37.5%     { transform: rotate(180deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  47%, 53%  { transform: rotate(180deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  62.5%     { transform: rotate(270deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  72%, 78%  { transform: rotate(360deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  87.5%     { transform: rotate(360deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  97%, 100% { transform: rotate(360deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
}
@keyframes sl08-a2 {
  0%, 3%    { transform: rotate(180deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  12.5%     { transform: rotate(270deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  22%, 28%  { transform: rotate(360deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  37.5%     { transform: rotate(360deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  47%, 53%  { transform: rotate(360deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  62.5%     { transform: rotate(450deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  72%, 78%  { transform: rotate(540deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  87.5%     { transform: rotate(540deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  97%, 100% { transform: rotate(540deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
}
@keyframes sl08-b1 {
  0%, 3%    { transform: rotate(90deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  12.5%     { transform: rotate(90deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  22%, 28%  { transform: rotate(90deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  37.5%     { transform: rotate(180deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  47%, 53%  { transform: rotate(270deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  62.5%     { transform: rotate(270deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  72%, 78%  { transform: rotate(270deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  87.5%     { transform: rotate(360deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  97%, 100% { transform: rotate(450deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
}
@keyframes sl08-b2 {
  0%, 3%    { transform: rotate(270deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  12.5%     { transform: rotate(270deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  22%, 28%  { transform: rotate(270deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  37.5%     { transform: rotate(360deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  47%, 53%  { transform: rotate(450deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  62.5%     { transform: rotate(450deg) translate(165px, -165px) scale(0.48); opacity: 0.55; }
  72%, 78%  { transform: rotate(450deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
  87.5%     { transform: rotate(540deg) translate(505px, -505px) scale(0.84); opacity: 1; }
  97%, 100% { transform: rotate(630deg) translate(331.5px, -331.5px) scale(1); opacity: 1; }
}`,
  },

  {
    id: "klein-flip",
    num: "10",
    slug: "10-klein-flip",
    titleFa: "ورق‌خوردن چهارگانه",
    titleEn: "Klein Symmetry Flip",
    category: "morph",
    categoryFa: "تغییر شکل هندسی",
    descFa: "گذر پیوسته میان ۴ فرم متقارن پنهان در این شیپ‌ها: دایره ← ساعت‌شنی ← پورتال ستاره ← پروانه بی‌نهایت.",
    duration: "4.4s",
    viewBox: "-900 -900 1800 1800",
    aspect: "square",
    buildMarkup: () => directFourPathsMarkup(),
    buildCss: (scope = "", spd = 1) => `
${sel(scope, ".p")} {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation-duration: ${sec(4.4, spd)};
  animation-timing-function: cubic-bezier(0.55, 0, 0.25, 1);
  animation-iteration-count: infinite;
}
${sel(scope, ".p1")} { fill: var(--c1, #102333); animation-name: sl10-p1; animation-delay: ${sec(-4.4, spd)}; }
${sel(scope, ".p2")} { fill: var(--c2, #102333); animation-name: sl10-p2; animation-delay: ${sec(-4.32, spd)}; }
${sel(scope, ".p3")} { fill: var(--c3, #102333); animation-name: sl10-p3; animation-delay: ${sec(-4.24, spd)}; }
${sel(scope, ".p4")} { fill: var(--c4, #102333); animation-name: sl10-p4; animation-delay: ${sec(-4.16, spd)}; }
${[
  ["p1", -331.5, -331.5, -90],
  ["p2", 331.5, -331.5, 0],
  ["p3", 331.5, 331.5, 90],
  ["p4", -331.5, 331.5, 180],
]
  .map(
    ([cls, x, y, r]) => `@keyframes sl10-${cls} {
  0%, 6%    { transform: translate(${x}px, ${y}px) scale(1, 1) rotate(${r}deg); opacity: 1; }
  14%       { transform: translate(${x}px, ${y}px) scale(1, 0.06) rotate(${r}deg); opacity: 0.65; }
  22%, 31%  { transform: translate(${x}px, ${y}px) scale(1, -1) rotate(${r}deg); opacity: 1; }
  39%       { transform: translate(${x}px, ${y}px) scale(0.06, -1) rotate(${r}deg); opacity: 0.65; }
  47%, 56%  { transform: translate(${x}px, ${y}px) scale(-1, -1) rotate(${r}deg); opacity: 1; }
  64%       { transform: translate(${x}px, ${y}px) scale(-1, 0.06) rotate(${r}deg); opacity: 0.65; }
  72%, 81%  { transform: translate(${x}px, ${y}px) scale(-1, 1) rotate(${r}deg); opacity: 1; }
  89%       { transform: translate(${x}px, ${y}px) scale(0.06, 1) rotate(${r}deg); opacity: 0.65; }
  97%, 100% { transform: translate(${x}px, ${y}px) scale(1, 1) rotate(${r}deg); opacity: 1; }
}`
  )
  .join("\n")}`,
  },

  {
    id: "droplet-wave",
    num: "12",
    slug: "12-droplet-wave",
    titleFa: "موج قطره‌ای خطی",
    titleEn: "Droplet Wave Bar",
    category: "linear",
    categoryFa: "خطی و اینلاین",
    descFa: "چیدمان افقی هر ۴ شیپ با زاویه ۴۵- درجه به شکل قطره و پرش موجی با فیزیک فرود نرم؛ عالی برای نوارها و وضعیت‌ها.",
    duration: "1.6s",
    viewBox: "-1380 -620 2760 1240",
    aspect: "wide",
    buildMarkup: () => directFourPathsMarkup(),
    buildCss: (scope = "", spd = 1) => `
${sel(scope, ".p")} {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation-duration: ${sec(1.6, spd)};
  animation-timing-function: cubic-bezier(0.42, 0, 0.25, 1);
  animation-iteration-count: infinite;
}
${sel(scope, ".p1")} { fill: var(--c1, #102333); animation-name: sl12-d1; animation-delay: ${sec(-1.6, spd)}; }
${sel(scope, ".p2")} { fill: var(--c2, #102333); animation-name: sl12-d2; animation-delay: ${sec(-1.42, spd)}; }
${sel(scope, ".p3")} { fill: var(--c3, #102333); animation-name: sl12-d3; animation-delay: ${sec(-1.24, spd)}; }
${sel(scope, ".p4")} { fill: var(--c4, #102333); animation-name: sl12-d4; animation-delay: ${sec(-1.06, spd)}; }
${[
  ["d1", -975],
  ["d2", -325],
  ["d3", 325],
  ["d4", 975],
]
  .map(
    ([cls, x]) => `@keyframes sl12-${cls} {
  0%, 84%, 100% {
    transform: translate(${x}px, 85px) scale(0.72, 0.72) rotate(-45deg);
  }
  14% {
    transform: translate(${x}px, 128px) scale(0.81, 0.62) rotate(-45deg);
  }
  42% {
    transform: translate(${x}px, -205px) scale(0.65, 0.81) rotate(-45deg);
  }
  68% {
    transform: translate(${x}px, 112px) scale(0.78, 0.66) rotate(-45deg);
  }
}`
  )
  .join("\n")}`,
  },
];

function generateStandaloneSvg(motion, options = {}) {
  const colors = options.colors || [BRAND_COLOR, BRAND_COLOR, BRAND_COLOR, BRAND_COLOR];
  const speed = options.speed || 1;
  const width = motion.aspect === "wide" ? 220 : 128;
  const height = motion.aspect === "wide" ? 99 : 128;
  const css = motion
    .buildCss("", speed)
    .replace(/var\(--c1,\s*#102333\)/g, colors[0])
    .replace(/var\(--c2,\s*#102333\)/g, colors[1])
    .replace(/var\(--c3,\s*#102333\)/g, colors[2])
    .replace(/var\(--c4,\s*#102333\)/g, colors[3])
    .trim();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${motion.viewBox}" width="${width}" height="${height}" role="img" aria-label="${motion.titleEn} Loading Motion">
  <style>
${css
  .split("\n")
  .map((l) => "    " + l)
  .join("\n")}
  </style>
  ${motion.buildMarkup()}
</svg>
`;
}

function generateHtmlCssSnippet(motion, options = {}) {
  const colors = options.colors || [BRAND_COLOR, BRAND_COLOR, BRAND_COLOR, BRAND_COLOR];
  const speed = options.speed || 1;
  const size = options.size || 64;
  const w = motion.aspect === "wide" ? Math.round(size * 2.22) : size;
  const h = size;
  const cls = `sl-loader-${motion.id}`;
  const css = motion
    .buildCss(`.${cls}`, speed)
    .replace(/var\(--c1,\s*#102333\)/g, colors[0])
    .replace(/var\(--c2,\s*#102333\)/g, colors[1])
    .replace(/var\(--c3,\s*#102333\)/g, colors[2])
    .replace(/var\(--c4,\s*#102333\)/g, colors[3])
    .trim();

  return `<!-- ${motion.num}. ${motion.titleEn} (${motion.titleFa}) -->
<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="${motion.viewBox}" width="${w}" height="${h}" role="status" aria-label="در حال بارگذاری">
  ${motion.buildMarkup()}
</svg>

<style>
.${cls} {
  display: inline-block;
  overflow: visible;
}
${css}
</style>`;
}

function generateReactSnippet(motion, options = {}) {
  const colors = options.colors || [BRAND_COLOR, BRAND_COLOR, BRAND_COLOR, BRAND_COLOR];
  const speed = options.speed || 1;
  const size = options.size || 64;
  const compName =
    "SLLoader" +
    motion.id
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join("");
  const w = motion.aspect === "wide" ? Math.round(size * 2.22) : size;
  const h = size;
  const cls = `sl-r-${motion.id}`;
  const css = motion
    .buildCss(`.${cls}`, speed)
    .replace(/var\(--c1,\s*#102333\)/g, colors[0])
    .replace(/var\(--c2,\s*#102333\)/g, colors[1])
    .replace(/var\(--c3,\s*#102333\)/g, colors[2])
    .replace(/var\(--c4,\s*#102333\)/g, colors[3])
    .trim();

  return `import React from "react";

export function ${compName}({ size = ${size}, className = "" }) {
  return (
    <>
      <style>{\`${css}\`}</style>
      <svg className={\`${cls} \${className}\`} xmlns="http://www.w3.org/2000/svg" viewBox="${motion.viewBox}" width={${motion.aspect === "wide" ? "Math.round(size * 2.22)" : "size"}} height={size}>
        ${motion.buildMarkup().replace(/class=/g, "className=")}
      </svg>
    </>
  );
}`;
}
