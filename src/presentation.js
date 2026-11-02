/* Classic script: runs after motions.js (ordered <script defer>), which
   provides MOTIONS and CANONICAL_PATH as shared top-level bindings.
   No ES modules => the site also works from a file:// URL. */

document.documentElement.classList.add("js-ready");

const LIGHT_PALETTE = ["#102333", "#f05327", "#102333", "#102333"];
const DARK_PALETTE = ["#F2F4F8", "#f05327", "#F2F4F8", "#F2F4F8"];

/* Strictly ONLY #08 (diagonal-orbit), #10 (klein-flip), #12 (droplet-wave) */
const ALLOWED_MOTION_IDS = new Set([
  "diagonal-orbit",
  "klein-flip",
  "droplet-wave",
]);

function renderBrandMotion(
  slotId,
  motionId,
  { size = 48, colors = LIGHT_PALETTE, speed = 1 } = {}
) {
  if (!ALLOWED_MOTION_IDS.has(motionId)) return null;
  const m = MOTIONS.find((item) => item.id === motionId);
  if (!m) return null;

  const cls = `af-m-${slotId}`;
  const w = m.aspect === "wide" ? Math.round(size * 2.22) : size;
  const h = size;
  const css = m
    .buildCss(`.${cls}`, speed)
    .replace(/var\(--c1,\s*#102333\)/g, colors[0])
    .replace(/var\(--c2,\s*#102333\)/g, colors[1])
    .replace(/var\(--c3,\s*#102333\)/g, colors[2])
    .replace(/var\(--c4,\s*#102333\)/g, colors[3])
    .trim();

  return {
    css,
    svg: `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="${m.viewBox}" width="${w}" height="${h}" style="overflow:visible;display:block" aria-hidden="true">${m.buildMarkup()}</svg>`,
  };
}

function mountMotions() {
  const slots = [
    ["map-sync-loader", "klein-flip", { size: 46, colors: DARK_PALETTE, speed: 0.88 }],
    ["readout-wave-slot", "droplet-wave", { size: 24, colors: DARK_PALETTE, speed: 0.78 }],
    ["benefits-flip-slot", "klein-flip", { size: 42, colors: DARK_PALETTE, speed: 0.78 }],
    ["benefits-wave-slot", "droplet-wave", { size: 22, colors: DARK_PALETTE, speed: 0.78 }],
    ["closing-motion-slot", "diagonal-orbit", { size: 52, colors: DARK_PALETTE, speed: 0.76 }],
  ];

  const cssChunks = [];
  for (const [elId, motionId, opts] of slots) {
    const el = document.getElementById(elId);
    if (!el) continue;
    const built = renderBrandMotion(elId, motionId, opts);
    if (!built) continue;
    cssChunks.push(built.css);
    el.innerHTML = built.svg;
  }

  const motionStyleEl = document.getElementById("af-motion-styles");
  if (motionStyleEl) {
    motionStyleEl.textContent = cssChunks.join("\n");
  }

  /* Pause off-screen loaders automatically for zero idle GPU/CPU cost */
  const hosts = document.querySelectorAll(".motion-host");
  if ("IntersectionObserver" in window) {
    const motionIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-paused", !entry.isIntersecting);
        }
      },
      { rootMargin: "120px 0px" }
    );
    hosts.forEach((h) => {
      h.classList.add("is-paused");
      motionIO.observe(h);
    });
  }
}

/* =========================================================
   SCROLL-DRIVEN CONTOUR TRACE (09: ترسیم خطی) ON LEFT RAIL
   ========================================================= */
const tracePaths = [];

function mountScrollContourTrace() {
  const traceSvg = document.getElementById("scroll-trace-svg");
  if (!traceSvg) return;

  const rotations = [270, 0, 90, 180];
  traceSvg.innerHTML = rotations
    .map((rot, idx) => {
      const col = LIGHT_PALETTE[idx];
      return (
        `<g transform="rotate(${rot})">` +
        `<path data-trace-q="${idx}" transform="translate(331.5,-331.5)" d="${CANONICAL_PATH}" ` +
        `pathLength="100" fill="${col}" fill-opacity="0" stroke="${col}" stroke-width="78" ` +
        `stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="100" stroke-dashoffset="84"/>` +
        `</g>`
      );
    })
    .join("");

  traceSvg.querySelectorAll("path[data-trace-q]").forEach((p) => {
    tracePaths.push(p);
  });
}

function updateContourTrace(smoothProg) {
  for (let idx = 0; idx < tracePaths.length; idx++) {
    const p = tracePaths[idx];
    /* Seamless mod-200 dash cycle: sketches with every scroll and rests traced & filled at 100% */
    const raw = 0.08 + smoothProg * 3.44 - idx * 0.025;
    const u = ((raw % 1) + 1) % 1;
    const dashOffset = 100 - 200 * u;

    let fillAlpha = 0;
    let strokeAlpha = 1;
    const dist = Math.abs(u - 0.52);
    if (dist < 0.2) {
      const bell = (1 + Math.cos((dist / 0.2) * Math.PI)) * 0.5;
      fillAlpha = 0.92 * bell;
      strokeAlpha = 1 - 0.35 * bell;
    }

    p.setAttribute("stroke-dashoffset", dashOffset.toFixed(2));
    p.setAttribute("fill-opacity", fillAlpha.toFixed(3));
    p.setAttribute("stroke-opacity", strokeAlpha.toFixed(3));
  }
}

function mountClosingCreamLogos() {
  const wrap = document.getElementById("closing-cream-logos");
  if (!wrap) return;
  wrap.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="32" height="32" aria-label="نشان آتی‌فرزام">
      <path fill="#F2F4F8" d="M810.77,440.18c-11.41,196.45-162.4,391.62-247.41,472.15-27.45,28.6-51.13,7.64-51.13-14.47v-448.12c0-18.81-13.94-34.32-32.08-36.76h-170.95c-20.72,0-37.18,16.44-37.18,36.85v447.34c0,16.33-13.23,29.56-29.55,29.56-8.17,0-15.55-3.32-20.91-8.66-5.36-5.34-8.66-12.74-8.66-20.91v-484.19c0-157.84,149.62-315.69,299.23-315.69h269.37c16.33,0,29.56,13.23,29.56,29.55s-13.23,29.56-29.56,29.56h-232.19c-20.72,0-37.18,16.46-37.18,36.87l.09,182.47c0,20.51,16.6,37.11,37.13,37.11h237.35c18.12.44,25.77,13.74,24.06,27.34Z"/>
    </svg>
    <span style="width:5px;height:5px;border-radius:50%;background:#f05327;display:inline-block"></span>
    <span style="font-weight:800;font-size:1.05rem;color:#F2F4F8">آتی‌فرزام</span>
    <span style="width:5px;height:5px;border-radius:50%;background:#f05327;display:inline-block"></span>
    <span dir="ltr" style="font-weight:800;font-size:0.95rem;letter-spacing:0.08em;color:#F2F4F8">ATIFARZAM</span>
  `;
}

const UNITS = {
  "0": {
    coords: "35.7448° N, 51.3752° E",
    route: "M 78 286 C 178 286, 232 142, 350 168 C 452 190, 508 108, 604 108",
    geofence: [350, 190, 112],
    start: [78, 286],
    end: [604, 108],
    pin: [350, 168],
    i18n: {
      fa: {
        title: "واحد ۱۰۴ · ناوگان توزیع",
        status: "در محدوده مجاز",
        speed: "۶۸ کیلومتر بر ساعت",
        distance: "۱۴۲.۶ کیلومتر",
        signal: "۱۲ ماهواره متصل · عالی",
      },
      en: {
        title: "Unit 104 · Distribution Fleet",
        status: "Inside Geofence",
        speed: "68 km/h",
        distance: "142.6 km",
        signal: "12 Satellites · Excellent",
      },
      ar: {
        title: "الوحدة ١٠٤ · أسطول التوزيع",
        status: "ضمن النطاق المسموح",
        speed: "٦٨ كم/ساعة",
        distance: "١٤٢.٦ كم",
        signal: "١٢ قمراً متصلاً · ممتاز",
      },
    },
  },
  "1": {
    coords: "35.6997° N, 51.4043° E",
    route: "M 105 98 C 215 118, 260 238, 392 224 C 488 214, 526 268, 592 284",
    geofence: [392, 220, 98],
    start: [105, 98],
    end: [592, 284],
    pin: [392, 224],
    i18n: {
      fa: {
        title: "واحد ۲۰۸ · حلقه مرکزی",
        status: "توقف در ایستگاه مجاز",
        speed: "۰ کیلومتر بر ساعت (متوقف)",
        distance: "۹۶.۴ کیلومتر",
        signal: "۱۴ ماهواره متصل · عالی",
      },
      en: {
        title: "Unit 208 · Central Ring",
        status: "Authorized Station Stop",
        speed: "0 km/h (Parked)",
        distance: "96.4 km",
        signal: "14 Satellites · Excellent",
      },
      ar: {
        title: "الوحدة ٢٠٨ · الحلقة المركزية",
        status: "توقف في محطة معتمدة",
        speed: "٠ كم/ساعة (متوقف)",
        distance: "٩٦.٤ كم",
        signal: "١٤ قمراً متصلاً · ممتاز",
      },
    },
  },
  "2": {
    coords: "35.5819° N, 51.4820° E",
    route: "M 64 308 C 190 296, 290 198, 430 144 C 508 114, 558 102, 616 92",
    geofence: [446, 148, 106],
    start: [64, 308],
    end: [616, 92],
    pin: [484, 126],
    i18n: {
      fa: {
        title: "واحد ۳۱۲ · محور جنوبی",
        status: "در مسیر ترانزیت",
        speed: "۸۴ کیلومتر بر ساعت",
        distance: "۲۸۹.۰ کیلومتر",
        signal: "۱۱ ماهواره متصل · پایدار",
      },
      en: {
        title: "Unit 312 · Southern Axis",
        status: "Active Transit Corridor",
        speed: "84 km/h",
        distance: "289.0 km",
        signal: "11 Satellites · Stable",
      },
      ar: {
        title: "الوحدة ٣١٢ · المحور الجنوبي",
        status: "في مسار الترانزيت",
        speed: "٨٤ كم/ساعة",
        distance: "٢٨٩.٠ كم",
        signal: "١١ قمراً متصلاً · مستقر",
      },
    },
  },
};

let currentLang = "fa";
let activeUnitKey = "0";
let refreshTelemetryLanguage = () => {};

const LANG_META = {
  fa: {
    dir: "rtl",
    idx: 0,
    label: "فارسی",
    code: "FA",
    docTitle: "مدیریت ناوگان آتی فرزام — GPS و ردیاب هوشمند خودرو",
  },
  en: {
    dir: "ltr",
    idx: 1,
    label: "English",
    code: "EN",
    docTitle: "AtiFarzam Fleet Management — Smart GPS & Vehicle Tracking",
  },
  ar: {
    dir: "rtl",
    idx: 2,
    label: "العربية",
    code: "AR",
    docTitle: "إدارة الأسطول آتي فرزام — نظام GPS وتتبع المركبات الذكي",
  },
};

const I18N = {
  fa: {
    "lang.caption": "انتخاب زبان نمایش",
    "rail.0": "معرفی سامانه",
    "rail.1": "شبیه‌ساز زنده GPS",
    "rail.2": "توانمندی‌های هسته",
    "rail.3": "فواید GPS",
    "rail.4": "جمع‌بندی ارائه",
    "nav.telemetry": "پایش زنده",
    "nav.monitoring": "پایش",
    "nav.dashboard": "داشبورد",
    "nav.map": "نقشه دستگاه‌ها",
    "nav.notifications": "اعلان‌ها",
    "nav.devices": "دستگاه‌ها",
    "nav.management": "مدیریت",
    "nav.groups": "گروه‌ها",
    "nav.geofences": "محدوده‌ها",
    "nav.reports": "گزارش‌ها",
    "nav.hardware": "سخت‌افزار",
    "nav.software": "نرم‌افزار",
    "nav.system": "سامانه",
    "nav.benefits": "فواید",
    "nav.closing": "جمع‌بندی",
    "hero.tag": "آتی فرزام",
    "hero.titleMain": "مدیریت ناوگان",
    "hero.titleAccent": "آتی فرزام",
    "hero.desc":
      "زنجیره کامل تله‌متری ناوگان سازمانی و خودروهای شخصی؛ از ردیاب‌های صنعتی و سنسورهای دما، سوخت و سوئیچ تا داشبورد زنده، ۹ گزارش تحلیلی با خروجی Excel و توسعه نرم‌افزار اختصاصی متناسب با فرآیندهای سازمان شما.",
    "hero.m1": "پایداری ارتباط و ثبت نقطه",
    "hero.m2": "دقت مکان‌یابی ماهواره‌ای",
    "hero.m3": "پایش پیوسته و هشدار آنی",
    "hero.satStatus": "اتصال ماهواره‌ای برقرار است",
    "hero.scrollHint": "اسکرول کنید · شروع مسیر",
    "tel.tag": "شبیه‌ساز زنده سامانه",
    "tel.title": "دیدِ یکپارچه بر تمام نقاط مسیر",
    "tel.desc":
      "انتخاب هر واحد در شبکه، داده‌های موقعیت، سرعت، محدوده مجاز و وضعیت اتصال ردیاب را به نرمی همگام‌سازی می‌کند.",
    "tel.tab0": "واحد ۱۰۴ · مسیر شمال‌غرب",
    "tel.tab1": "واحد ۲۰۸ · حلقه مرکزی",
    "tel.tab2": "واحد ۳۱۲ · محور جنوبی",
    "tel.syncing": "همگام‌سازی موقعیت ماهواره‌ای...",
    "tel.lblCoords": "مختصات لحظه‌ای",
    "tel.lblSpeed": "سرعت حرکت",
    "tel.lblDist": "مسافت طی‌شده امروز",
    "tel.lblSignal": "کیفیت سیگنال ردیاب",
    "tel.stream": "دریافت و به‌روزرسانی خودکار داده‌های ردیاب",
    "cap.tag": "توانمندی‌های هسته",
    "cap.title": "طراحی‌شده برای نظارت دقیق و تصمیم‌گیری سریع",
    "cap.desc":
      "چهار ستون اصلی سامانه مدیریت ناوگان آتی‌فرزام برای کنترل کامل عملیات حمل‌ونقل و امنیت دارایی‌ها.",
    "cap.c1.pill": "موقعیت‌یابی",
    "cap.c1.title": "موقعیت‌یابی لحظه‌ای و بازپخش مسیر",
    "cap.c1.desc":
      "نمایش زنده موقعیت روی نقشه به همراه آرشیو دقیق مسیرهای پیموده‌شده، نقاط توقف و زمان‌بندی سفرها.",
    "cap.c2.pill": "محدوده مجاز",
    "cap.c2.title": "حصار جغرافیایی (Geofence)",
    "cap.c2.desc":
      "تعریف نواحی مجاز یا ممنوعه روی نقشه و ارسال اعلان فوری به مدیر ناوگان در لحظه ورود یا خروج واحدها.",
    "cap.c3.pill": "تحلیل تردد",
    "cap.c3.title": "گزارش‌های تحلیلی و پایش رانندگی",
    "cap.c3.desc":
      "بررسی شتاب‌گیری ناگهانی، تخطی از سرعت مجاز، ساعات کارکرد موتور و بهینه‌سازی مصرف سوخت ناوگان.",
    "cap.c4.pill": "پایداری داده",
    "cap.c4.title": "امنیت سخت‌افزاری و حافظه آفلاین",
    "cap.c4.desc":
      "تشخیص دستکاری یا قطع باتری، فرمان توقف اضطراری امن و ذخیره خودکار نقاط در مناطق فاقد پوشش شبکه.",
    "db.tag": "داشبورد مدیریتی",
    "db.title": "پاسخ سریع به وضعیت ناوگان در یک نگاه",
    "db.desc": "داشبورد مرکزی با KPIهای زنده، نمودارهای زمانی و ورودی نقشه حرارتی برای نظارت کامل بر وضعیت ناوگان.",
    "db.k1": "تعداد کل دستگاه‌ها",
    "db.k2": "دستگاه‌های آنلاین",
    "db.k3": "دستگاه‌های در حال حرکت",
    "db.k4": "آخرین موقعیت ثبت شده",
    "db.chartTitle": "آمار ۷ روز گذشته",
    "db.period7": "۷ روز",
    "db.period14": "۱۴ روز",
    "db.period30": "۳۰ روز",
    "db.legend1": "بیشترین سرعت",
    "db.legend2": "بیشترین مسافت",
    "db.legend3": "میانگین سرعت",
    "db.legend4": "تعداد توقف‌ها",
    "map.tag": "نقشه دستگاه‌ها",
    "map.title": "موقعیت‌یابی فضایی ناوگان در یک نگاه",
    "map.desc": "نقشه تعاملی با امکان فیلتر دستگاه‌ها و گروه‌ها، لایه‌های مختلف نقشه و کنترل zoom و fullscreen.",
    "map.f1.title": "انتخاب دستگاه و گروه",
    "map.f1.desc": "فیلتر کردن دستگاه‌های قابل نمایش روی نقشه بر اساس گروه یا دستگاه خاص.",
    "map.f1.pill": "انتخاب دستگاه",
    "map.f2.title": "لایه‌های مختلف نقشه",
    "map.f2.desc": "تغییر لایهٔ نقشه و نمایش تمام‌صفحه.",
    "map.f2.pill": "لایه‌های نقشه",
    "map.f3.title": "کنترل zoom و fullscreen",
    "map.f3.desc": "مشاهده نقشه با جزئیات کامل در اندازه‌های مختلف و حالت تمام صفحه.",
    "map.f3.pill": "کنترل نمایش",
    "map.f4.title": "موقعیت و برچسب ردیاب‌ها",
    "map.f4.desc": "نمایش نشانه‌ها و برچسب‌های ردیاب‌ها روی نقشه با وضعیت لحظه‌ای.",
    "map.f4.pill": "نشان‌ها",
    "dev.tag": "مدیریت دستگاه‌ها",
    "dev.title": "نگهداری مخزن ردیاب‌ها و نمایش اطلاعات لحظه‌ای",
    "dev.desc": "لیست کامل دستگاه‌ها با امکان جستجو، فیلتر گروه، صفحه‌بندی و تازه‌سازی خودکار اطلاعات.",
    "dev.f1.title": "مشاهده کامل مخزن ردیاب‌ها",
    "dev.f1.desc": "جدول کامل دستگاه‌ها با اطلاعات برچسب خودرو/شخص، شناسه دستگاه، شماره سیم‌کارت، پلاک، زمان آخرین موقعیت و اتصال.",
    "dev.f1.pill": "لیست دستگاه‌ها",
    "dev.f2.title": "جستجوی متن و فیلتر",
    "dev.f2.desc": "جستجوی سریع در لیست دستگاه‌ها بر اساس نام، شناسه یا گروه با امکان فیلتر کردن بر اساس گروه‌های تعریف شده.",
    "dev.f2.pill": "جستجو و فیلتر",
    "dev.f3.title": "مشاهده دستگاه‌ها روی نقشه",
    "dev.f3.desc": "نمایش موقعیت تمام دستگاه‌ها به صورت همزمان روی نقشه با امکان انتخاب و مشاهده جزئیات هر دستگاه.",
    "dev.f3.pill": "نمای نقشه",
    "dev.f4.title": "اتصال ردیاب فیزیکی به حساب کاربری",
    "dev.f4.desc": "فرم ثبت دستگاه با اطلاعات اجباری شناسه IMEI، مدل ردیاب، شماره سیم‌کارت و برچسب خودرو/شخص با امکان انتخاب ساعت و منطقه زمانی.",
    "dev.f4.pill": "افزودن دستگاه",
    "grp.tag": "مدیریت گروه‌ها",
    "grp.title": "سازماندهی ناوگان برای فیلتر، نقشه و گزارش‌های یکپارچه",
    "grp.desc": "امکان سازماندهی ناوگان در گروه‌های مختلف برای فیلتر کردن، استفاده در نقشه و گزارش‌های تحلیلی.",
    "grp.f1.title": "جستجوی سریع در لیست گروه‌ها",
    "grp.f1.desc": "امکان جستجوی سریع در لیست گروه‌ها برای پیدا کردن گروه مورد نظر در زمان کوتاهی.",
    "grp.f1.pill": "جستجوی گروه‌ها",
    "grp.f2.title": "ایجاد گروه‌های جدید",
    "grp.f2.desc": "فرم ساده برای ایجاد گروه‌های جدید با امکان تخصیص دستگاه‌ها به هر گروه.",
    "grp.f2.pill": "افزودن گروه",
    "grp.f3.title": "نمایش تعداد دستگاه‌ها در هر گروه",
    "grp.f3.desc": "مشاهده تعداد دستگاه‌های تخصیص داده شده به هر گروه به صورت لحظه‌ای.",
    "grp.f3.pill": "تعداد دستگاه‌ها",
    "grp.f4.title": "مشاهده آسان لیست بلند",
    "grp.f4.desc": "امکان صفحه‌بندی لیست گروه‌ها برای نمایش آسان در صورت وجود گروه‌های متعدد.",
    "grp.f4.pill": "صفحه‌بندی",
    "gf.tag": "مدیریت محدوده‌ها",
    "gf.title": "تعریف مکان‌های معنادار و تحلیل ورود/خروج",
    "gf.desc": "تعریف محدوده‌های جغرافیایی با هندسه دایره، چندضلعی یا چندخطی همراه با سرعت مجاز برای هر محدوده.",
    "gf.f1.title": "جستجوی سریع در لیست محدوده‌ها",
    "gf.f1.desc": "امکان جستجوی سریع در لیست محدوده‌های تعریف شده برای پیدا کردن محدوده مورد نظر.",
    "gf.f1.pill": "جستجوی محدوده‌ها",
    "gf.f2.title": "ایجاد محدوده‌های جدید",
    "gf.f2.desc": "فرم کامل برای ایجاد محدوده‌های جدید با امکان رسم دایره، چندضلعی یا چندخطی روی نقشه.",
    "gf.f2.pill": "افزودن محدوده",
    "gf.f3.title": "تعریف سرعت مجاز برای هر محدوده",
    "gf.f3.desc": "امکان تعیین سقف سرعت مجاز برای هر محدوده به صورت جداگانه.",
    "gf.f3.pill": "سرعت مجاز",
    "gf.f4.title": "مشاهده آسان لیست بلند",
    "gf.f4.desc": "امکان صفحه‌بندی لیست محدوده‌ها برای نمایش آسان در صورت وجود محدوده‌های متعدد.",
    "gf.f4.pill": "صفحه‌بندی",
    "notif.tag": "اعلان‌ها",
    "notif.title": "نمایش تغییرات عملیاتی و خطرات سرویس/اشتراک",
    "notif.desc": "نمایش اعلان‌های هشدار، تعمیر و نگهداری و سیستمی به صورت طبقه‌بندی شده.",
    "notif.f1.title": "رویدادهای حرکتی و وضعیت ردیاب",
    "notif.f1.desc": "اعلان‌های روشن/خاموش شدن، شروع/توقف حرکت، سرعت غیرمجاز و موقعیت روی نقشه.",
    "notif.f1.pill": "هشدارها",
    "notif.f2.title": "اعلان‌های سرویس دوره‌ای",
    "notif.f2.desc": "یادآوری‌های سرویس‌های برنامه‌ریزی شده با جزئیات متن مربوطه.",
    "notif.f2.pill": "تعمیر و نگهداری",
    "notif.f3.title": "اعلان‌های سیستمی و اشتراک",
    "notif.f3.desc": "اعلان‌های عدم دریافت داده جدید، انقضای اشتراک و یادآوری تمدید اشتراک.",
    "notif.f3.pill": "سیستمی",
    "rpt.tag": "گزارش‌ها",
    "rpt.title": "گزارش‌های تحلیلی بر اساس انتخاب دستگاه/گروه و بازه زمانی",
    "rpt.desc": "تولید گزارش‌های متنوع بر اساس انتخاب دستگاه یا گروه و بازه زمانی با امکان صادر کردن به Excel.",
    "rpt.f1.title": "بازسازی مسیر ردیاب",
    "rpt.f1.desc": "بازسازی مسیر ردیاب برای دوره زمانی انتخاب شده با فیلترهای حذف سرعت صفر، پاکسازی تداخل و ولتاژ نقطه.",
    "rpt.f1.pill": "مسیر",
    "rpt.f2.title": "رویدادهای عملیاتی",
    "rpt.f2.desc": "پیدا کردن رویدادهای خاص در بازه زمانی با فیلترهای نوع رویداد: غیرفعال، شروع حرکت، توقف، سرعت غیرمجاز و...",
    "rpt.f2.pill": "رویداد",
    "rpt.f3.title": "خلاصه روزانه دستگاه",
    "rpt.f3.desc": "خلاصه عملکرد دستگاه در روز یا شیفت کاری با اطلاعات شروع/پایان، زمان روشن/خاموش، مسافت و مصرف سوخت.",
    "rpt.f3.pill": "روزانه",
    "rpt.f4.title": "مقایسه دارایی‌ها",
    "rpt.f4.desc": "مقایسه چندین دارایی یا کل گروه در بازه زمانی با اطلاعات مسافت، سرعت، زمان توقف/حرکت و مصرف سوخت.",
    "rpt.f4.pill": "عملکرد",
    "rpt.f5.title": "مکان‌های توقف",
    "rpt.f5.desc": "پیدا کردن مکان‌های توقف و توقف‌های کوتاه/بلند با فیلترهای حداقل و حداکثر مدت توقف.",
    "rpt.f5.pill": "توقف",
    "rpt.f6.title": "سفرهای دستگاه",
    "rpt.f6.desc": "تجزیه دوره عملیاتی دستگاه به سفرهای جداگانه با اطلاعات زمان، مسافت و سرعت.",
    "rpt.f6.pill": "سفر",
    "rpt.f7.title": "ورود/خروج از محدوده‌ها",
    "rpt.f7.desc": "نمایش زمانی که یک دارایی در داخل یا خارج سایت‌های تعریف شده قرار داشته و چگونه عمل کرده است.",
    "rpt.f7.pill": "محدوده",
    "rpt.f8.title": "نقشه حرارتی تردد",
    "rpt.f8.desc": "نمایش جایی که قسمت انتخابی ناوگان بیشتر اوقات را سپری می‌کند یا حرکت می‌کند.",
    "rpt.f8.pill": "حرارتی",
    "rpt.f9.title": "تاریخچه دما",
    "rpt.f9.desc": "دریافت تاریخچه دما برای ردیاب، مفید برای نظارت بر زنجیره سرد یا محیط.",
    "rpt.f9.pill": "دما",
    "clients.tag": "مشتریان و سابقه",
    "clients.title": "هویت و اعتماد؛ شریک تجاری معتبر شما",
    "clients.desc": "سامانه مدیریت ناوگان آتی‌فرزام با سال‌ها تجربه و همکاری با سازمان‌ها و شرکت‌های بزرگ، انتخاب اول برای پایش هوشمند و مدیریت ناوگان در کشور است.",
    "clients.hint": "روی لوگوها کلیک کنید تا متوقف شوند",
    "clients.water": "شرکت آب و فاضلاب استان",
    "clients.transport": "سازمان حمل و نقل شهری",
    "clients.post": "شرکت پست جمهوری اسلامی ایران",
    "clients.municipality": "شهرداری تهران",
    "clients.gas": "شرکت ملی گاز ایران",
    "clients.energy": "وزارت نیرو",
    "clients.police": "ناجا",
    "clients.customs": "گمرک جمهوری اسلامی ایران",
    "profile.tag": "پروفایل و تنظیمات",
    "profile.title": "مدیریت دسترسی و ترجیحات شخصی",
    "profile.desc": "نگهداری اطلاعات دسترسی حساب کاربری و تنظیمات نمایش محلی برای تجربه شخصی‌سازی شده.",
    "profile.f1.pill": "اطلاعات حساب",
    "profile.f1.title": "اطلاعات ورود و مدیریت سشن",
    "profile.f1.desc": "مدیریت اطلاعات کاربری، رمز عبور، سشن‌های فعال و امنیت حساب.",
    "profile.f2.pill": "تنظیمات زبان",
    "profile.f2.title": "زبان، تقویم و منطقه زمانی",
    "profile.f2.desc": "تنظیم زبان رابط کاربری، نوع تقویم و منطقه زمانی محلی.",
    "profile.f3.pill": "اعلان‌ها",
    "profile.f3.title": "تنظیمات دریافت اعلان‌ها",
    "profile.f3.desc": "مدیریت نوع اعلان‌ها، کانال‌های دریافت و ترجیحات اعلان.",
    "profile.f4.pill": "حریم خصوصی",
    "profile.f4.title": "تنظیمات حریم خصوصی و دسترسی",
    "profile.f4.desc": "مدیریت مجوزها، دسترسی‌ها و تنظیمات حریم خصوصی حساب.",
    "support.tag": "پشتیبانی",
    "support.title": "راه‌های ارتباطی و پشتیبانی فنی",
    "support.desc": "دسترسی سریع به تیم پشتیبانی برای حل مشکلات و دریافت راهنمایی‌های تخصصی.",
    "support.f1.pill": "تلفن",
    "support.f1.title": "پشتیبانی تلفنی ۲۴ ساعته",
    "support.f1.desc": "تماس با تیم پشتیبانی از طریق شماره‌های تلفن اختصاصی.",
    "support.f2.pill": "چت",
    "support.f2.title": "چت آنلاین با کارشناسان",
    "support.f2.desc": "برقراری چت آنلاین با تیم فنی برای حل سریع مشکلات.",
    "support.f3.pill": "ایمیل",
    "support.f3.title": "پشتیبانی از طریق ایمیل",
    "support.f3.desc": "ارسال درخواست و دریافت پاسخ از طریق ایمیل رسمی.",
    "support.f4.pill": "مستندات",
    "support.f4.title": "مرکز مستندات و راهنماها",
    "support.f4.desc": "دسترسی به مستندات کامل، آموزش‌ها و راهنماهای ویدئویی.",
    "support.btn": "مشاهده راه‌های ارتباطی",
    "support.modalTitle": "راه‌های ارتباطی با تیم پشتیبانی آتی‌فرزام",
    "support.phone1": "۰۲۱-۱۲۳۴۵۶۷۸",
    "support.phone2": "۰۲۱-۸۷۶۵۴۳۲۱",
    "support.chat": "چت آنلاین در سایت",
    "support.chatHours": "۲۴ ساعته، ۷ روز هفته",
    "support.email": "support@atifarzam.ir",
    "support.emailResponse": "پاسخ در کمتر از ۲ ساعت",
    "support.docs": "docs.atifarzam.ir",
    "support.docsDesc": "راهنماها و آموزش‌ها",
    "hw.tag": "سخت‌افزار",
    "hw.title": "سخت‌افزار ردیاب هوشمند؛ مقاوم، دقیق و پایدار",
    "hw.desc":
      "ماژول‌های سخت‌افزاری آتی‌فرزام با طراحی صنعتی و قطعات استاندارد، برای کارکرد پیوسته در شرایط محیطی متنوع و ارسال بدون وقفه داده‌ها مهندسی شده‌اند.",
    "hw.bannerEyebrow": "معماری ماژول مرکزی",
    "hw.bannerTitle": "واحد موقعیت‌یاب چندسامانه‌ای GNSS و مخابرات صنعتی",
    "hw.bannerDesc":
      "مجهز به گیرنده حساس ماهواره‌ای، مودم ارتباطی پایدار و مدار تغذیه محافظت‌شده جهت نصب ایمن و عملکرد پیوسته در ناوگان سبک و سنگین.",
    "hw.spec1": "گیرنده ماهواره‌ای چندکاناله",
    "hw.spec2": "مدار تغذیه با محافظ نوسان",
    "hw.spec3": "مقاوم در برابر غبار و رطوبت",
    "hw.spec4Val": "باتری پشتیبان",
    "hw.spec4": "تداوم کارکرد هنگام قطع برق",
    "hw.c1.pill": "دقت سیگنال",
    "hw.c1.title": "آنتن و ماژول مکان‌یابی دقیق",
    "hw.c1.desc":
      "دریافت هم‌زمان سیگنال از چند منظومه ماهواره‌ای برای ثبت دقیق مختصات حتی در معابر متراکم و شرایط جوی مختلف.",
    "hw.c2.pill": "حافظه داخلی",
    "hw.c2.title": "ذخیره‌سازی آفلاین در نقاط کور",
    "hw.c2.desc":
      "ثبت خودکار هزاران نقطه حرکتی در مناطق فاقد پوشش شبکه موبایل و ارسال یکپارچه اطلاعات بلافاصله پس از اتصال مجدد.",
    "hw.c3.pill": "درگاه‌های توسعه",
    "hw.c3.title": "پشتیبانی از سنسورها و ورودی‌های جانبی",
    "hw.c3.desc":
      "قابلیت اتصال به ورودی سوئیچ (ACC)، سنسورهای دما و درب، تشخیص ضربه یا لرزش و رله فرمان ایمن از راه دور.",
    "hw.c4.pill": "ایمنی مدار",
    "hw.c4.title": "باتری داخلی و هشدار جداسازی",
    "hw.c4.desc":
      "تشخیص فوری قطع برق اصلی یا دستکاری دستگاه و ارسال هشدار اضطراری به سامانه مرکزی به کمک باتری پشتیبان داخلی.",
    "sw.tag": "نرم‌افزار",
    "sw.title": "نرم‌افزار یکپارچه پایش و مدیریت هوشمند ناوگان",
    "sw.desc":
      "پلتفرم نرم‌افزاری آتی‌فرزام داده‌های لحظه‌ای سخت‌افزار را در قالب داشبوردهای شفاف، نقشه‌های تعاملی و گزارش‌های مدیریتی در اختیار شما قرار می‌دهد.",
    "sw.p1.title": "پنل تحت وب جامع",
    "sw.p1.desc": "پایش کامل ناوگان از طریق مرورگر بدون نیاز به نصب",
    "sw.p2.title": "نسخه موبایل و واکنش‌گرا",
    "sw.p2.desc": "دسترسی سریع مدیران به موقعیت و اعلان‌ها در هر مکان",
    "sw.p3.title": "وب‌سرویس و API سازمانی",
    "sw.p3.desc": "امکان یکپارچه‌سازی مستقیم با سامانه‌های داخلی سازمان",
    "sw.c1.pill": "پایش زنده",
    "sw.c1.title": "داشبورد نقشه زنده و بازپخش مسیر",
    "sw.c1.desc":
      "نمایش لحظه‌ای تمام واحدها روی نقشه با جزئیات سرعت، جهت حرکت، وضعیت توقف و بازپخش گرافیکی سفرهای گذشته.",
    "sw.c2.pill": "گزارش‌های مدیریتی",
    "sw.c2.title": "موتور گزارش‌ساز تحلیلی و خروجی دقیق",
    "sw.c2.desc":
      "تولید گزارش‌های متنوع پیمایش، ساعات کارکرد، توقف‌ها و رفتار رانندگی با امکان فیلتر بازه زمانی و دریافت خروجی استاندارد.",
    "sw.c3.pill": "اعلان هوشمند",
    "sw.c3.title": "مدیریت رویدادها، محدوده‌ها و هشدارها",
    "sw.c3.desc":
      "تعریف حصارهای جغرافیایی، سقف سرعت مجاز و یادآور سرویس‌های دوره‌ای همراه با ارسال اعلان آنی در لحظه وقوع رویداد.",
    "sw.c4.pill": "مدیریت دسترسی",
    "sw.c4.title": "تعریف کاربران و سطوح دسترسی سازمانی",
    "sw.c4.desc":
      "امکان گروه‌بندی ناوگان در واحدهای مجزا و پیگیری اعتبار اشتراک و وضعیت اتصال هر دستگاه.",
    "ben.tag": "ارزش‌آفرینی عملیاتی · فواید GPS",
    "ben.title": "مزایا و فواید کلیدی استفاده از GPS و ردیاب هوشمند",
    "ben.desc":
      "استقرار سامانه ردیاب ماهواره‌ای آتی‌فرزام، علاوه بر امنیت لحظه‌ای، بهره‌وری ناوگان را افزایش داده و هزینه‌های پنهان نگهداری و پیمایش را به شکل ملموس کاهش می‌دهد.",
    "ben.b1.kicker": "امنیت ۲۴ ساعته",
    "ben.b1.title": "حفاظت و پیشگیری مؤثر از سرقت",
    "ben.b1.desc":
      "اعلان آنی در صورت حرکت غیرمجاز، لرزش یا جداسازی باتری و امکان ردیابی دقیق تا بازیابی کامل دارایی در شرایط اضطراری.",
    "ben.b2.kicker": "صرفه‌جویی اقتصادی",
    "ben.b2.title": "کاهش مصرف سوخت و استهلاک",
    "ben.b2.desc":
      "حذف ترددهای غیرضروری، کاهش زمان درجا کار کردن موتور و کنترل سرعت که هزینه‌های سوخت و تعمیرات دوره‌ای را بهینه می‌کند.",
    "ben.b3.kicker": "چابکی عملیاتی",
    "ben.b3.title": "مدیریت زمان و بهینه‌سازی مسیر",
    "ben.b3.desc":
      "انتخاب بهترین مسیرهای اعزام، پایش دقیق زمان توقف در ایستگاه‌ها و افزایش تعداد ماموریت‌های موفق در هر روز کاری.",
    "ben.b4.kicker": "کاهش ریسک",
    "ben.b4.title": "ارتقای ایمنی رانندگی و محموله",
    "ben.b4.desc":
      "پایش رفتار حرکتی شامل ترمزهای شدید و تخطی از سرعت مجاز برای پیشگیری از حوادث جاده‌ای و حفظ سلامت سرنشینان و بار.",
    "ben.b5.kicker": "شفافیت مدیریتی",
    "ben.b5.title": "مستندسازی خودکار و گزارش دقیق",
    "ben.b5.desc":
      "ثبت لحظه‌به‌لحظه پیمایش، کارکرد روزانه و تاریخچه کامل سفرها بدون خطای انسانی؛ آماده برای تحلیل و ارزیابی عملکرد.",
    "ben.b6.kicker": "اطمینان و هماهنگی",
    "ben.b6.title": "تخمین دقیق زمان رسیدن (ETA)",
    "ben.b6.desc":
      "امکان اعلام دقیق موقعیت و زمان تحویل به مشتریان یا واحدهای سازمانی بر پایه داده‌های زنده ماهواره‌ای.",
    "ben.stripTitle": "بازده پایدار در مقیاس سازمانی و شخصی",
    "ben.stripSub": "پایش هوشمند برای کنترل هزینه، افزایش امنیت و شفافیت کامل مسیرها",
    "ben.stripWave": "پایداری تبادل داده GPS",
    "close.eyebrow": "سامانه مدیریت ناوگان آتی‌فرزام (MyFarzam)",
    "close.title": "ناوگان خود را با داده‌های دقیق مدیریت کنید",
    "close.desc":
      "برای دریافت دموی زنده سامانه MyFarzam و مشاوره انتخاب مدل ردیاب متناسب با خودروهای سازمانتان با تیم فنی ما گفتگو کنید.",
    "close.btnTop": "بازگشت به ابتدای ارائه ↑",
    "close.btnBenefits": "مرور فواید سامانه GPS",
    "footer.copy": "سامانه مدیریت ناوگان آتی‌فرزام (GPS و ردیاب خودرو)",
  },

  en: {
    "lang.caption": "Select Display Language",
    "rail.0": "System Overview",
    "rail.1": "Live GPS Simulator",
    "rail.2": "Core Capabilities",
    "rail.3": "GPS Benefits",
    "rail.4": "Presentation Summary",
    "nav.telemetry": "Live Tracking",
    "nav.monitoring": "Monitoring",
    "nav.dashboard": "Dashboard",
    "nav.map": "Devices Map",
    "nav.notifications": "Notifications",
    "nav.devices": "Devices",
    "nav.management": "Management",
    "nav.groups": "Groups",
    "nav.geofences": "Geofences",
    "nav.reports": "Reports",
    "nav.hardware": "Hardware",
    "nav.software": "Software",
    "nav.system": "System",
    "nav.benefits": "Benefits",
    "nav.closing": "Summary",
    "hero.tag": "AtiFarzam",
    "hero.titleMain": "AtiFarzam",
    "hero.titleAccent": "Fleet Management",
    "hero.desc":
      "The full telemetry chain for corporate fleets and private vehicles: from industrial trackers and temperature, fuel and ignition sensors to a live dashboard, 9 analytical reports with Excel export, and custom software built around your organisation’s processes.",
    "hero.m1": "Link Uptime & Point Logging",
    "hero.m2": "Satellite Positioning Accuracy",
    "hero.m3": "Continuous Monitoring & Alerts",
    "hero.satStatus": "Satellite Link Established",
    "hero.scrollHint": "Scroll Down · Begin Journey",
    "tel.tag": "Live System Simulator",
    "tel.title": "Unified Visibility Across Every Point of the Route",
    "tel.desc":
      "Selecting any active unit smoothly synchronizes live coordinates, travel speed, geofence compliance, and satellite signal health.",
    "tel.tab0": "Unit 104 · Northwest Corridor",
    "tel.tab1": "Unit 208 · Central Ring",
    "tel.tab2": "Unit 312 · Southern Axis",
    "tel.syncing": "Synchronizing satellite position...",
    "tel.lblCoords": "Live Coordinates",
    "tel.lblSpeed": "Current Speed",
    "tel.lblDist": "Distance Covered Today",
    "tel.lblSignal": "Tracker Signal Quality",
    "tel.stream": "Automatic telemetry updates from the tracker",
    "cap.tag": "Core Capabilities",
    "cap.title": "Engineered for Precision Oversight & Rapid Decisions",
    "cap.desc":
      "Four foundational pillars of the AtiFarzam Fleet Management platform for complete transport control and asset protection.",
    "cap.c1.pill": "Positioning",
    "cap.c1.title": "Real-Time Tracking & Route Replay",
    "cap.c1.desc":
      "Live map positioning paired with an exact archive of traveled routes, stop durations, and full trip timelines.",
    "cap.c2.pill": "Geofencing",
    "cap.c2.title": "Smart Geofence Boundaries",
    "cap.c2.desc":
      "Define authorized or restricted zones on the map and trigger instant notifications the moment vehicles enter or leave.",
    "cap.c3.pill": "Analytics",
    "cap.c3.title": "Analytical Reports & Driving Insights",
    "cap.c3.desc":
      "Evaluate harsh acceleration, speed violations, engine operating hours, and optimize overall fleet fuel consumption.",
    "cap.c4.pill": "Data Resilience",
    "cap.c4.title": "Hardware Security & Offline Buffer",
    "cap.c4.desc":
      "Battery-tamper alerts, secure emergency immobilizer commands, and automatic offline point storage in coverage dead zones.",
    "db.tag": "Dashboard",
    "db.title": "Quick Overview of Fleet Status at a Glance",
    "db.desc": "Central dashboard with live KPIs, time-series charts, and heatmap entry point for complete fleet status monitoring.",
    "db.k1": "Total Devices",
    "db.k2": "Online Devices",
    "db.k3": "Moving Devices",
    "db.k4": "Last Position Recorded",
    "db.chartTitle": "Last 7 Days Statistics",
    "db.period7": "7 Days",
    "db.period14": "14 Days",
    "db.period30": "30 Days",
    "db.legend1": "Highest Speed",
    "db.legend2": "Longest Distance",
    "db.legend3": "Average Speed",
    "db.legend4": "Stop Count",
    "map.tag": "Devices Map",
    "map.title": "Spatial Location of Fleet Units at a Glance",
    "map.desc": "Interactive map with device/group filtering, multiple map layers, zoom and fullscreen controls.",
    "map.f1.title": "Device and Group Selection",
    "map.f1.desc": "Filter displayed devices on the map based on specific groups or devices.",
    "map.f1.pill": "Selection",
    "map.f2.title": "Multiple Map Layers",
    "map.f2.desc": "Switch map layers and view in fullscreen.",
    "map.f2.pill": "Layers",
    "map.f3.title": "Zoom and Fullscreen Control",
    "map.f3.desc": "View the map with full details at different sizes and in fullscreen mode.",
    "map.f3.pill": "Controls",
    "map.f4.title": "Tracker Positions and Labels",
    "map.f4.desc": "Display tracker markers and labels on the map with real-time status.",
    "map.f4.pill": "Markers",
    "dev.tag": "Device Management",
    "dev.title": "Maintain Tracker Inventory with Real-Time Information",
    "dev.desc": "Complete device list with search, group filtering, pagination, and automatic information refresh.",
    "dev.f1.title": "Complete View of Tracker Inventory",
    "dev.f1.desc": "Full device table with vehicle/person label, device ID, SIM number, plate, last position time, and connection time.",
    "dev.f1.pill": "Device List",
    "dev.f2.title": "Text Search and Filtering",
    "dev.f2.desc": "Quick search in device list by name, ID, or group with filtering by defined groups.",
    "dev.f2.pill": "Search & Filter",
    "dev.f3.title": "View Devices on Map",
    "dev.f3.desc": "Display all device positions simultaneously on the map with selection and detail viewing.",
    "dev.f3.pill": "Map View",
    "dev.f4.title": "Connect Physical Tracker to User Account",
    "dev.f4.desc": "Device registration form with required IMEI/ID, tracker model, SIM number, vehicle/person label, with time and timezone selection.",
    "dev.f4.pill": "Add Device",
    "grp.tag": "Groups",
    "grp.title": "Organize Fleet for Filtering, Maps, and Consolidated Reports",
    "grp.desc": "Organize fleet into groups for filtering, map use, and analytical reports.",
    "grp.f1.title": "Quick Search in Group List",
    "grp.f1.desc": "Quick search in group list to find the desired group in a short time.",
    "grp.f1.pill": "Search Groups",
    "grp.f2.title": "Create New Groups",
    "grp.f2.desc": "Simple form for creating new groups with device assignment capability.",
    "grp.f2.pill": "Add Group",
    "grp.f3.title": "Display Device Count per Group",
    "grp.f3.desc": "View the number of devices assigned to each group in real-time.",
    "grp.f3.pill": "Device Count",
    "grp.f4.title": "Easy Viewing of Long Lists",
    "grp.f4.desc": "Pagination of group list for easy display when there are many groups.",
    "grp.f4.pill": "Pagination",
    "gf.tag": "Geofences",
    "gf.title": "Define Meaningful Locations and Support Entry/Exit Analysis",
    "gf.desc": "Define geographical boundaries with circle, polygon, or polyline geometry with speed limits.",
    "gf.f1.title": "Quick Search in Geofence List",
    "gf.f1.desc": "Quick search in the list of defined geofences to find the desired boundary.",
    "gf.f1.pill": "Search Geofences",
    "gf.f2.title": "Create New Geofences",
    "gf.f2.desc": "Complete form for creating new geofences with circle, polygon, or polyline drawing on the map.",
    "gf.f2.pill": "Add Geofence",
    "gf.f3.title": "Define Speed Limit for Each Geofence",
    "gf.f3.desc": "Ability to set maximum speed limit for each geofence individually.",
    "gf.f3.pill": "Speed Limit",
    "gf.f4.title": "Easy Viewing of Long Lists",
    "gf.f4.desc": "Pagination of geofence list for easy display when there are many boundaries.",
    "gf.f4.pill": "Pagination",
    "notif.tag": "Notifications",
    "notif.title": "Display Operational Changes and Service/Subscription Risks",
    "notif.desc": "Display alerts, maintenance, and system notifications in categorized tabs.",
    "notif.f1.title": "Motion and Tracker Status Events",
    "notif.f1.desc": "Alerts for ignition on/off, movement start/stop, overspeed, and map location.",
    "notif.f1.pill": "Alerts",
    "notif.f2.title": "Scheduled Maintenance Notices",
    "notif.f2.desc": "Reminders for scheduled maintenance with relevant text details.",
    "notif.f2.pill": "Maintenance",
    "notif.f3.title": "System and Subscription Notices",
    "notif.f3.desc": "No-new-data alerts, subscription expiry, and renewal reminders.",
    "notif.f3.pill": "System",
    "rpt.tag": "Reports",
    "rpt.title": "Analytical Reports Based on Device/Group and Time Range",
    "rpt.desc": "Generate various reports based on device/group selection and time range with Excel export capability.",
    "rpt.f1.title": "Reconstruct Tracker Path",
    "rpt.f1.desc": "Reconstruct tracker path for selected period with filters: disable zero-speed, GPS jamming cleanup, include point voltage.",
    "rpt.f1.pill": "Route",
    "rpt.f2.title": "Operational Events",
    "rpt.f2.desc": "Find specific operational events in time window with event type filters: inactive, movement start/stop, overspeed, fuel leak, geofence enter/exit, etc.",
    "rpt.f2.pill": "Event",
    "rpt.f3.title": "Device Daily Summary",
    "rpt.f3.desc": "Summary of device operation for day or shift with start/end time, ignition on/off time, distance, and fuel consumption.",
    "rpt.f3.pill": "Daily",
    "rpt.f4.title": "Compare Assets",
    "rpt.f4.desc": "Compare multiple assets or entire group across time range with distance, speed, stop/movement time, and fuel consumption.",
    "rpt.f4.pill": "Performance",
    "rpt.f5.title": "Stop Locations",
    "rpt.f5.desc": "Find dwell/idle locations and filter by minimum and maximum stop duration.",
    "rpt.f5.pill": "Stop",
    "rpt.f6.title": "Device Trips",
    "rpt.f6.desc": "Break device operating period into journeys with time, distance, and speed information.",
    "rpt.f6.pill": "Trip",
    "rpt.f7.title": "Geofence Entry/Exit",
    "rpt.f7.desc": "Show when an asset was inside/outside defined sites and how it operated there.",
    "rpt.f7.pill": "Geofence",
    "rpt.f8.title": "Traffic Heatmap",
    "rpt.f8.desc": "Reveal where the selected fleet part spends time or moves most frequently.",
    "rpt.f8.pill": "Heatmap",
    "rpt.f9.title": "Temperature History",
    "rpt.f9.desc": "Retrieve temperature history for a tracker, useful for cold-chain or environment monitoring.",
    "rpt.f9.pill": "Temperature",
    "clients.tag": "Clients & History",
    "clients.title": "Identity and Trust; Your Reliable Business Partner",
    "clients.desc": "AtiFarzam Fleet Management System, with years of experience and collaboration with major organizations and companies, is the first choice for smart tracking and fleet management in the country.",
    "clients.hint": "Click on logos to pause the animation",
    "clients.water": "Provincial Water & Wastewater Co.",
    "clients.transport": "Urban Transport Organization",
    "clients.post": "Iran Post Company",
    "clients.municipality": "Tehran Municipality",
    "clients.gas": "National Gas Company of Iran",
    "clients.energy": "Ministry of Energy",
    "clients.police": "LAW ENFORCEMENT",
    "clients.customs": "Iran Customs Administration",
    "profile.tag": "Profile & Settings",
    "profile.title": "Access Management and Personal Preferences",
    "profile.desc": "Maintain account access information and local display preferences for a personalized experience.",
    "profile.f1.pill": "Account Info",
    "profile.f1.title": "Login Information and Session Management",
    "profile.f1.desc": "Manage user information, passwords, active sessions, and account security.",
    "profile.f2.pill": "Language Settings",
    "profile.f2.title": "Language, Calendar and Timezone",
    "profile.f2.desc": "Set interface language, calendar type, and local timezone.",
    "profile.f3.pill": "Notifications",
    "profile.f3.title": "Notification Preferences",
    "profile.f3.desc": "Manage notification types, delivery channels, and preferences.",
    "profile.f4.pill": "Privacy",
    "profile.f4.title": "Privacy and Access Settings",
    "profile.f4.desc": "Manage permissions, access, and account privacy settings.",
    "support.tag": "Support",
    "support.title": "Contact Methods and Technical Support",
    "support.desc": "Quick access to the support team for troubleshooting and expert guidance.",
    "support.f1.pill": "Phone",
    "support.f1.title": "24/7 Phone Support",
    "support.f1.desc": "Contact support team via dedicated phone numbers.",
    "support.f2.pill": "Chat",
    "support.f2.title": "Live Chat with Experts",
    "support.f2.desc": "Establish live chat with technical team for quick problem resolution.",
    "support.f3.pill": "Email",
    "support.f3.title": "Email Support",
    "support.f3.desc": "Submit requests and receive responses via official email.",
    "support.f4.pill": "Documentation",
    "support.f4.title": "Documentation Center",
    "support.f4.desc": "Access complete documentation, tutorials, and video guides.",
    "support.btn": "View Contact Methods",
    "support.modalTitle": "Contact Methods with AtiFarzam Support Team",
    "support.phone1": "021-12345678",
    "support.phone2": "021-87654321",
    "support.chat": "Live Chat on Website",
    "support.chatHours": "24/7 Support",
    "support.email": "support@atifarzam.ir",
    "support.emailResponse": "Response in less than 2 hours",
    "support.docs": "docs.atifarzam.ir",
    "support.docsDesc": "Guides and Tutorials",
    "hw.tag": "Hardware",
    "hw.title": "Smart GPS Tracker Hardware — Rugged, Precise & Reliable",
    "hw.desc":
      "AtiFarzam hardware modules combine industrial-grade components with protected power circuitry for uninterrupted data transmission across diverse operating conditions.",
    "hw.bannerEyebrow": "Core Module Architecture",
    "hw.bannerTitle": "Multi-Constellation GNSS & Industrial Telemetry Unit",
    "hw.bannerDesc":
      "Equipped with a high-sensitivity satellite receiver, resilient cellular modem, and surge-protected power supply for safe, continuous operation across light and heavy fleets.",
    "hw.spec1": "Multi-channel satellite receiver",
    "hw.spec2": "Surge-protected power circuit",
    "hw.spec3": "Dust & moisture resistant",
    "hw.spec4Val": "Backup Battery",
    "hw.spec4": "Uninterrupted power-cut operation",
    "hw.c1.pill": "Signal Precision",
    "hw.c1.title": "High-Sensitivity Antenna & GNSS Engine",
    "hw.c1.desc":
      "Simultaneous reception from multiple satellite constellations for pinpoint coordinate logging even in dense urban corridors.",
    "hw.c2.pill": "Onboard Memory",
    "hw.c2.title": "Offline Buffer in Coverage Dead Zones",
    "hw.c2.desc":
      "Automatically stores thousands of route waypoints when cellular signal drops and synchronizes seamlessly upon reconnection.",
    "hw.c3.pill": "I/O Expansion",
    "hw.c3.title": "Peripheral Sensors & Auxiliary Inputs",
    "hw.c3.desc":
      "Supports ignition detection (ACC), temperature and door sensors, shock/vibration sensing, and secure remote relay control.",
    "hw.c4.pill": "Circuit Safety",
    "hw.c4.title": "Internal Backup Battery & Tamper Alert",
    "hw.c4.desc":
      "Detects main power disconnection or physical tampering instantly and dispatches an emergency alert via its internal battery.",
    "sw.tag": "Software",
    "sw.title": "Unified Fleet Monitoring & Intelligence Software",
    "sw.desc":
      "The AtiFarzam software platform transforms live hardware telemetry into clear interactive maps, real-time alerts, and executive reports.",
    "sw.p1.title": "Comprehensive Web Console",
    "sw.p1.desc": "Full browser-based fleet control with zero installation",
    "sw.p2.title": "Mobile & Responsive Access",
    "sw.p2.desc": "Instant live locations and alerts for managers anywhere",
    "sw.p3.title": "Enterprise API & Webhooks",
    "sw.p3.desc": "Direct data integration with internal ERP & logistics systems",
    "sw.c1.pill": "Live Monitoring",
    "sw.c1.title": "Real-Time Map Dashboard & Trip Replay",
    "sw.c1.desc":
      "Monitor all active units on a unified map with live speed, heading, stop durations, and graphical historical route playback.",
    "sw.c2.pill": "Executive Reports",
    "sw.c2.title": "Analytical Reporting Engine & Exports",
    "sw.c2.desc":
      "Generate detailed mileage, engine-hour, stop, and driving-behavior reports with custom date filters and standard exports.",
    "sw.c3.pill": "Smart Alerts",
    "sw.c3.title": "Geofences, Events & Maintenance Reminders",
    "sw.c3.desc":
      "Configure custom geofence zones, speed thresholds, and periodic service schedules with instant event notifications.",
    "sw.c4.pill": "Access Control",
    "sw.c4.title": "Multi-User Roles & Fleet Grouping",
    "sw.c4.desc":
      "Organize units into dedicated groups and track each device’s subscription and connection status.",
    "ben.tag": "Operational Value · GPS Benefits",
    "ben.title": "Key Advantages of Smart GPS & Vehicle Tracking",
    "ben.desc":
      "Deploying AtiFarzam satellite tracking strengthens real-time security, elevates fleet productivity, and tangibly reduces hidden fuel and maintenance costs.",
    "ben.b1.kicker": "24/7 Protection",
    "ben.b1.title": "Proactive Anti-Theft Security",
    "ben.b1.desc":
      "Instant alerts on unauthorized movement, vibration, or battery tampering, with pinpoint tracking for rapid asset recovery.",
    "ben.b2.kicker": "Cost Efficiency",
    "ben.b2.title": "Lower Fuel Burn & Vehicle Wear",
    "ben.b2.desc":
      "Eliminate unnecessary detours, cut idle engine hours, and regulate cruising speeds to reduce fuel and service expenses.",
    "ben.b3.kicker": "Operational Agility",
    "ben.b3.title": "Time Management & Route Optimization",
    "ben.b3.desc":
      "Dispatch along optimal corridors, monitor station dwell times, and complete more successful missions every workday.",
    "ben.b4.kicker": "Risk Reduction",
    "ben.b4.title": "Enhanced Driver & Cargo Safety",
    "ben.b4.desc":
      "Track harsh braking and overspeeding patterns to prevent road incidents and safeguard both drivers and cargo.",
    "ben.b5.kicker": "Executive Clarity",
    "ben.b5.title": "Automated Logging & Accurate Reports",
    "ben.b5.desc":
      "Error-free, second-by-second mileage logs, daily utilization metrics, and complete trip histories ready for audit.",
    "ben.b6.kicker": "Reliable Coordination",
    "ben.b6.title": "Accurate Arrival Estimation (ETA)",
    "ben.b6.desc":
      "Share precise live positions and reliable delivery windows with clients and operational teams via satellite data.",
    "ben.stripTitle": "Sustained ROI for Enterprise & Personal Fleets",
    "ben.stripSub": "Smart telemetry for cost control, elevated security, and full route transparency",
    "ben.stripWave": "Resilient GPS Data Link",
    "close.eyebrow": "AtiFarzam Fleet Management System (MyFarzam)",
    "close.title": "Manage your fleet with accurate data",
    "close.desc":
      "Talk to our technical team for a live MyFarzam demo and advice on choosing the tracker model that fits your vehicles.",
    "close.btnTop": "Back to Top ↑",
    "close.btnBenefits": "Review GPS Benefits",
    "footer.copy": "AtiFarzam Fleet Management & Smart GPS Vehicle Tracking",
  },

  ar: {
    "lang.caption": "اختيار لغة العرض",
    "rail.0": "نظرة عامة",
    "rail.1": "محاكي GPS المباشر",
    "rail.2": "القدرات الأساسية",
    "rail.3": "مزايا GPS",
    "rail.4": "خلاصة العرض",
    "nav.telemetry": "التتبع المباشر",
    "nav.monitoring": "المراقبة",
    "nav.dashboard": "لوحة التحكم",
    "nav.map": "خريطة الأجهزة",
    "nav.notifications": "الإشعارات",
    "nav.devices": "الأجهزة",
    "nav.management": "الإدارة",
    "nav.groups": "المجموعات",
    "nav.geofences": "النطاقات الجغرافية",
    "nav.reports": "التقارير",
    "nav.hardware": "الأجهزة",
    "nav.software": "البرمجيات",
    "nav.system": "النظام",
    "nav.benefits": "المزايا",
    "nav.closing": "الخلاصة",
    "hero.tag": "آتي فرزام",
    "hero.titleMain": "إدارة الأسطول",
    "hero.titleAccent": "آتي فرزام",
    "hero.desc":
      "سلسلة تتبع متكاملة للأساطيل المؤسسية والمركبات الشخصية: من أجهزة التتبع الصناعية وحساسات الحرارة والوقود والإشعال إلى لوحة مباشرة و٩ تقارير تحليلية بصيغة Excel وتطوير برمجيات مخصصة لعمليات مؤسستكم.",
    "hero.m1": "استقرار الاتصال وتسجيل النقاط",
    "hero.m2": "دقة التموضع عبر الأقمار الصناعية",
    "hero.m3": "مراقبة متواصلة وتنبيه فوري",
    "hero.satStatus": "الاتصال عبر الأقمار الصناعية نشط",
    "hero.scrollHint": "مرّر للأسفل · ابدأ المسار",
    "tel.tag": "المحاكي المباشر للمنظومة",
    "tel.title": "رؤية موحّدة وشاملة لجميع نقاط المسار",
    "tel.desc":
      "يؤدي اختيار أي وحدة في الشبكة إلى مزامنة الإحداثيات الحية والسرعة والنطاق الجغرافي المسموح وجودة إشارة التتبع بسلاسة تامة.",
    "tel.tab0": "الوحدة ١٠٤ · المسار الشمالي الغربي",
    "tel.tab1": "الوحدة ٢٠٨ · الحلقة المركزية",
    "tel.tab2": "الوحدة ٣١٢ · المحور الجنوبي",
    "tel.syncing": "جارٍ مزامنة الموقع عبر الأقمار الصناعية...",
    "tel.lblCoords": "الإحداثيات اللحظية",
    "tel.lblSpeed": "سرعة الحركة",
    "tel.lblDist": "المسافة المقطوعة اليوم",
    "tel.lblSignal": "جودة إشارة التتبع",
    "tel.stream": "تحديث تلقائي لبيانات التتبع من الجهاز",
    "cap.tag": "القدرات الأساسية",
    "cap.title": "مصممة للإشراف الدقيق واتخاذ القرار السريع",
    "cap.desc":
      "الركائز الأربع الأساسية لمنظومة إدارة الأسطول آتي فرزام للتحكم الكامل بعمليات النقل وحماية الأصول.",
    "cap.c1.pill": "تحديد الموقع",
    "cap.c1.title": "التتبع اللحظي وإعادة استعراض المسار",
    "cap.c1.desc":
      "عرض مباشر للموقع على الخريطة مع أرشيف دقيق للمسارات المقطوعة ونقاط التوقف والجدول الزمني للرحلات.",
    "cap.c2.pill": "النطاق المسموح",
    "cap.c2.title": "السياج الجغرافي الذكي (Geofence)",
    "cap.c2.desc":
      "تحديد المناطق المسموحة أو المحظورة على الخريطة وإرسال تنبيه فوري لمدير الأسطول لحظة دخول المركبات أو خروجها.",
    "cap.c3.pill": "تحليل الحركة",
    "cap.c3.title": "التقارير التحليلية ومراقبة أسلوب القيادة",
    "cap.c3.desc":
      "تحليل التسارع المفاجئ وتجاوز السرعة المقررة وساعات عمل المحرك وتحسين كفاءة استهلاك الوقود للأسطول.",
    "cap.c4.pill": "استمرارية البيانات",
    "cap.c4.title": "الأمان العتادي والذاكرة غير المتصلة",
    "cap.c4.desc":
      "كشف العبث أو فصل البطارية، وأمر الإيقاف الآمن في الطوارئ، والتخزين التلقائي للنقاط في المناطق خارج التغطية.",
    "db.tag": "لوحة التحكم",
    "db.title": "إجابة سريعة عن حالة الأسطول في لمحة",
    "db.desc": "لوحة التحكم المركزية مع مؤشرات الأداء الرئيسية الحية، والرسوم البيانية الزمنية ودخول خريطة الحرارة للمراقبة الكاملة لحالة الأسطول.",
    "db.k1": "إجمالي الأجهزة",
    "db.k2": "الأجهزة المتصلة",
    "db.k3": "الأجهزة المتحركة",
    "db.k4": "آخر موقع مسجل",
    "db.chartTitle": "إحصائيات آخر ٧ أيام",
    "db.period7": "٧ أيام",
    "db.period14": "١٤ يوم",
    "db.period30": "٣٠ يوم",
    "db.legend1": "أعلى سرعة",
    "db.legend2": "أطول مسافة",
    "db.legend3": "متوسط السرعة",
    "db.legend4": "عدد التوقفات",
    "map.tag": "خريطة الأجهزة",
    "map.title": "تحديد موقع أسطولك جغرافياً في لمحة",
    "map.desc": "خريطة تفاعلية مع فلترة الأجهزة والمجموعات، وطبقات خريطة متعددة، وتحكم في التكبير والوضع كامل الشاشة.",
    "map.f1.title": "اختيار الجهاز والمجموعة",
    "map.f1.desc": "فلترة الأجهزة المعروضة على الخريطة بناءً على مجموعات أو أجهزة محددة.",
    "map.f1.pill": "الاختيار",
    "map.f2.title": "طبقات خريطة متعددة",
    "map.f2.desc": "تبديل طبقات الخريطة وعرضها بملء الشاشة.",
    "map.f2.pill": "الطبقات",
    "map.f3.title": "تحكم في التكبير والوضع كامل الشاشة",
    "map.f3.desc": "مشاهدة الخريطة بتفاصيل كاملة بأحجام مختلفة وفي وضع كامل الشاشة.",
    "map.f3.pill": "التحكم",
    "map.f4.title": "مواقع ووسوم التتبع",
    "map.f4.desc": "عرض علامات التتبع ووسومها على الخريطة مع الحالة اللحظية.",
    "map.f4.pill": "العلامات",
    "dev.tag": "إدارة الأجهزة",
    "dev.title": "صيانة مخزون أجهزة التتبع وعرض المعلومات اللحظية",
    "dev.desc": "قائمة كاملة بالأجهزة مع إمكانية البحث، فلترة المجموعة، الترقيم، والتحديث التلقائي للمعلومات.",
    "dev.f1.title": "عرض كامل لمخزون أجهزة التتبع",
    "dev.f1.desc": "جدول كامل بالأجهزة مع معلومات علامة المركبة/الشخص، معرّف الجهاز، رقم بطاقة SIM، اللوحة، وقت آخر موقع واتصال.",
    "dev.f1.pill": "قائمة الأجهزة",
    "dev.f2.title": "البحث والنقر",
    "dev.f2.desc": "بحث سريع في قائمة الأجهزة بناءً على الاسم أو المعرّف أو المجموعة مع فلترة حسب المجموعات المحددة.",
    "dev.f2.pill": "البحث والتصفية",
    "dev.f3.title": "عرض الأجهزة على الخريطة",
    "dev.f3.desc": "عرض مواقع جميع الأجهزة في نفس الوقت على الخريطة مع إمكانية اختيار وعرض تفاصيل كل جهاز.",
    "dev.f3.pill": "عرض الخريطة",
    "dev.f4.title": "ربط جهاز التتبع المادي بحساب المستخدم",
    "dev.f4.desc": "نموذج تسجيل الجهاز بمعلومات إجبارية: معرّف IMEI، نموذج التتبع، رقم بطاقة SIM، علامة المركبة/الشخص، مع اختيار الوقت والمنطقة الزمنية.",
    "dev.f4.pill": "إضافة جهاز",
    "grp.tag": "المجموعات",
    "grp.title": "تنظيم الأسطول للفلترة، الخرائط، والتقارير الموحدة",
    "grp.desc": "إمكانية تنظيم الأسطول في مجموعات مختلفة للفلترة، والاستخدام في الخرائط، والتقارير التحليلية.",
    "grp.f1.title": "بحث سريع في قائمة المجموعات",
    "grp.f1.desc": "إمكانية البحث السريع في قائمة المجموعات لإيجاد المجموعة المطلوبة في وقت قصير.",
    "grp.f1.pill": "بحث المجموعات",
    "grp.f2.title": "إنشاء مجموعات جديدة",
    "grp.f2.desc": "نموذج بسيط لإنشاء مجموعات جديدة مع إمكانية تعيين الأجهزة لكل مجموعة.",
    "grp.f2.pill": "إضافة مجموعة",
    "grp.f3.title": "عرض عدد الأجهزة في كل مجموعة",
    "grp.f3.desc": "مشاهدة عدد الأجهزة المخصصة لكل مجموعة في الوقت الفعلي.",
    "grp.f3.pill": "عدد الأجهزة",
    "grp.f4.title": "عرض سهل للقوائم الطويلة",
    "grp.f4.desc": "ترقيم قائمة المجموعات لعرض سهل عند وجود العديد من المجموعات.",
    "grp.f4.pill": "ترقيم الصفحات",
    "gf.tag": "النطاقات الجغرافية",
    "gf.title": "تعريف مواقع ذات معنى ودعم تحليل الدخول/الخروج",
    "gf.desc": "تعريف الحدود الجغرافية بهندسة دائرية أو متعددة الأضلاع أو متعددة الخطوط مع حدود السرعة لكل نطاق.",
    "gf.f1.title": "بحث سريع في قائمة النطاقات",
    "gf.f1.desc": "إمكانية البحث السريع في قائمة النطاقات الجغرافية المحددة لإيجاد الحدود المطلوبة.",
    "gf.f1.pill": "بحث النطاقات",
    "gf.f2.title": "إنشاء نطاقات جديدة",
    "gf.f2.desc": "نموذج كامل لإنشاء نطاقات جغرافية جديدة مع رسم دائرية أو متعددة الأضلاع أو متعددة الخطوط على الخريطة.",
    "gf.f2.pill": "إضافة نطاق",
    "gf.f3.title": "تعريف حد السرعة لكل نطاق",
    "gf.f3.desc": "إمكانية تحديد حد السرعة الأقصى لكل نطاق جغرافي على حدة.",
    "gf.f3.pill": "حد السرعة",
    "gf.f4.title": "عرض سهل للقوائم الطويلة",
    "gf.f4.desc": "ترقيم قائمة النطاقات لعرض سهل عند وجود العديد من الحدود.",
    "gf.f4.pill": "ترقيم الصفحات",
    "notif.tag": "الإشعارات",
    "notif.title": "عرض التغيرات التشغيلية ومخاطر الخدمة/الاشتراك",
    "notif.desc": "عرض تنبيهات الصيانة والنظام في علامات تبويب مصنفة.",
    "notif.f1.title": "أحداث الحركة وحالة التتبع",
    "notif.f1.desc": "تنبيهات تشغيل/إيقاف، بداية/توقف الحركة، السرعة الزائدة، والموقع على الخريطة.",
    "notif.f1.pill": "التنبيهات",
    "notif.f2.title": "إشعارات الصيانة المجدولة",
    "notif.f2.desc": "تذكيرات الصيانة المجدولة مع تفاصيل النص ذات الصلة.",
    "notif.f2.pill": "الصيانة",
    "notif.f3.title": "إشعارات النظام والاشتراك",
    "notif.f3.desc": "تنبيهات عدم استلام بيانات جديدة، انتهاء الاشتراك، وتذكيرات التجديد.",
    "notif.f3.pill": "النظام",
    "rpt.tag": "التقارير",
    "rpt.title": "التقارير التحليلية بناءً على اختيار الجهاز/المجموعة والفترة الزمنية",
    "rpt.desc": "إنشاء تقارير متنوعة بناءً على اختيار الجهاز أو المجموعة والفترة الزمنية مع إمكانية تصديرها إلى Excel.",
    "rpt.f1.title": "إعادة بناء مسار التتبع",
    "rpt.f1.desc": "إعادة بناء مسار التتبع للفترة الزمنية المختارة مع مرشحات: تعطيل سرعة الصفر، تنظيف التداخل، تضمين جهد النقطة.",
    "rpt.f1.pill": "المسار",
    "rpt.f2.title": "الأحداث التشغيلية",
    "rpt.f2.desc": "إيجاد أحداث تشغيلية محددة في نافذة زمنية مع مرشحات أنواع الأحداث: غير نشط، بداية/توقف الحركة، السرعة الزائدة، تسرب الوقود، دخول/خروج النطاق الجغرافي، إلخ.",
    "rpt.f2.pill": "الحدث",
    "rpt.f3.title": "ملخص يومي للجهاز",
    "rpt.f3.desc": "ملخص عمل الجهاز ليوم أو نوبة عمل مع معلومات بداية/نهاية الوقت، وقت التشغيل/الإيقاف، المسافة، واستهلاك الوقود.",
    "rpt.f3.pill": "اليومي",
    "rpt.f4.title": "مقارنة الأصول",
    "rpt.f4.desc": "مقارنة عدة أصول أو المجموعة كاملة عبر الفترة الزمنية مع معلومات المسافة، السرعة، وقت التوقف/الحركة، واستهلاك الوقود.",
    "rpt.f4.pill": "الأداء",
    "rpt.f5.title": "مواقع التوقف",
    "rpt.f5.desc": "إيجاد مواقع التوقف والتوقفات القصيرة/الطويلة مع مرشحات الحد الأدنى والأقصى لمدة التوقف.",
    "rpt.f5.pill": "التوقف",
    "rpt.f6.title": "رحلات الجهاز",
    "rpt.f6.desc": "تجزئة فترة عمل الجهاز إلى رحلات منفصلة مع معلومات الوقت، المسافة، والسرعة.",
    "rpt.f6.pill": "الرحلة",
    "rpt.f7.title": "دخول/خروج من النطاقات",
    "rpt.f7.desc": "إظهار متى كان الأصل داخل/خارج المواقع المحددة وكيف عمل هناك.",
    "rpt.f7.pill": "النطاق الجغرافي",
    "rpt.f8.title": "خريطة الحرارة",
    "rpt.f8.desc": "كشف مكان قضاء جزء مختار من الأسطول معظم الوقت أو الحركة فيه.",
    "rpt.f8.pill": "خريطة الحرارة",
    "rpt.f9.title": "التاريخ الحراري",
    "rpt.f9.desc": "استرجاع التاريخ الحراري للمتبع، مفيد لمراقبة السلسلة الباردة أو البيئة.",
    "rpt.f9.pill": "درجة الحرارة",
    "clients.tag": "العملاء والسجل",
    "clients.title": "الهوية والثقة؛ شريكك التجاري الموثوق",
    "clients.desc": "نظام إدارة الأسطول آتي فرزام، مع سنوات من الخبرة والتعاون مع المنظمات والشركات الكبيرة، هو الخيار الأول للمراقبة الذكية وإدارة الأسطول في البلاد.",
    "clients.hint": "انقر على الشعارات لإيقاف الحركة",
    "clients.water": "شركة المياه والصرف الصحي المحافظة",
    "clients.transport": "منظمة النقل الحضري",
    "clients.post": "شركة بريد جمهورية إيران الإسلامية",
    "clients.municipality": "بلدية طهران",
    "clients.gas": "شركة الغاز الوطنية الإيرانية",
    "clients.energy": "وزارة الطاقة",
    "clients.police": "الأمن الوطني",
    "clients.customs": "جمارك جمهورية إيران الإسلامية",
    "profile.tag": "الملف الشخصي والإعدادات",
    "profile.title": "إدارة الوصول والتفضيلات الشخصية",
    "profile.desc": "حفظ معلومات الوصول لحساب المستخدم وإعدادات العرض المحلية لتجربة مخصصة.",
    "profile.f1.pill": "معلومات الحساب",
    "profile.f1.title": "معلومات تسجيل الدخول وإدارة الجلسة",
    "profile.f1.desc": "إدارة معلومات المستخدم، كلمة المرور، الجلسات النشطة، وأمن الحساب.",
    "profile.f2.pill": "إعدادات اللغة",
    "profile.f2.title": "اللغة والتقويم والمنطقة الزمنية",
    "profile.f2.desc": "ضبط لغة واجهة المستخدم، نوع التقويم والمنطقة الزمنية المحلية.",
    "profile.f3.pill": "الإشعارات",
    "profile.f3.title": "إعدادات استلام الإشعارات",
    "profile.f3.desc": "إدارة أنواع الإشعارات، قنوات الاستلام والتفضيلات.",
    "profile.f4.pill": "الخصوصية",
    "profile.f4.title": "إعدادات الخصوصية والوصول",
    "profile.f4.desc": "إدارة الأذونات، الوصول، وإعدادات الخصوصية للحساب.",
    "support.tag": "الدعم الفني",
    "support.title": "طرق التواصل والدعم الفني",
    "support.desc": "الوصول السريع إلى فريق الدعم لحل المشكلات والحصول على إرشادات فنية متخصصة.",
    "support.f1.pill": "الهاتف",
    "support.f1.title": "دعم هاتفي على مدار الساعة",
    "support.f1.desc": "الاتصال بفريق الدعم من خلال أرقام الهاتف المخصصة.",
    "support.f2.pill": "الدردشة",
    "support.f2.title": "دردشة مباشرة مع الخبراء",
    "support.f2.desc": "إقامة دردشة مباشرة مع الفريق الفني لحل المشكلات بسرعة.",
    "support.f3.pill": "البريد الإلكتروني",
    "support.f3.title": "دعم عبر البريد الإلكتروني",
    "support.f3.desc": "إرسال الطلبات واستلام الردود عبر البريد الرسمي.",
    "support.f4.pill": "التوثيق",
    "support.f4.title": "مركز التوثيق والإرشادات",
    "support.f4.desc": "الوصول إلى التوثيق الكامل، الدروس، وإرشادات الفيديو.",
    "support.btn": "عرض طرق التواصل",
    "support.modalTitle": "طرق التواصل مع فريق دعم آتي فرزام",
    "support.phone1": "٠٢١-١٢٣٤٥٦٧٨",
    "support.phone2": "٠٢١-٨٧٦٥٤٣٢١",
    "support.chat": "الدردشة المباشرة على الموقع",
    "support.chatHours": "دعم على مدار ٢٤ ساعة",
    "support.email": "support@atifarzam.ir",
    "support.emailResponse": "الرد في أقل من ٢ ساعة",
    "support.docs": "docs.atifarzam.ir",
    "support.docsDesc": "الدلائل والإرشادات",
    "hw.tag": "الأجهزة",
    "hw.title": "أجهزة التتبع الذكي؛ متانة ودقة واستقرار مستمر",
    "hw.desc":
      "صُممت وحدات آتي فرزام العتادية بمكونات صناعية قياسية للعمل المتواصل في مختلف الظروف البيئية وإرسال البيانات دون انقطاع.",
    "hw.bannerEyebrow": "بنية الوحدة المركزية",
    "hw.bannerTitle": "وحدة تحديد المواقع GNSS والاتصال الصناعي",
    "hw.bannerDesc":
      "مزودة بمستقبل فضائي عالي الحساسية ومودم اتصال مستقر ودائرة تغذية محمية للتركيب الآمن والأداء المتواصل في الأساطيل الخفيفة والثقيلة.",
    "hw.spec1": "مستقبل أقمار صناعية متعدد القنوات",
    "hw.spec2": "دائرة تغذية محمية من التذبذب",
    "hw.spec3": "مقاوم للغبار والرطوبة",
    "hw.spec4Val": "بطارية احتياطية",
    "hw.spec4": "استمرار العمل عند انقطاع الطاقة",
    "hw.c1.pill": "دقة الإشارة",
    "hw.c1.title": "هوائي ووحدة تموضع عالية الدقة",
    "hw.c1.desc":
      "استقبال متزامن للإشارات من عدة منظومات فضائية لتسجيل الإحداثيات بدقة حتى في الشوارع المزدحمة والظروف الجوية المتقلبة.",
    "hw.c2.pill": "ذاكرة داخلية",
    "hw.c2.title": "تخزين تلقائي في مناطق انعدام التغطية",
    "hw.c2.desc":
      "حفظ آلاف النقاط الحركية تلقائياً عند غياب تغطية الهاتف المحمول وإرسالها بشكل متكامل فور عودة الاتصال.",
    "hw.c3.pill": "منافذ التوسعة",
    "hw.c3.title": "دعم الحساسات والمداخل الجانبية",
    "hw.c3.desc":
      "إمكانية الربط مع حساس التشغيل (ACC) وحساسات الحرارة والأبواب واستشعار الصدمات ومرحل التحكم الآمن عن بُعد.",
    "hw.c4.pill": "أمان الدائرة",
    "hw.c4.title": "بطارية داخلية وتنبيه فصل الجهاز",
    "hw.c4.desc":
      "رصد فوري لانقطاع التيار الرئيسي أو العبث بالجهاز وإرسال تنبيه طارئ إلى المنظومة المركزية عبر البطارية الاحتياطية.",
    "sw.tag": "البرمجيات",
    "sw.title": "النظام البرمجي المتكامل للمراقبة والإدارة الذكية للأسطول",
    "sw.desc":
      "تحوّل منصة آتي فرزام البرمجية البيانات اللحظية الواردة من الأجهزة إلى لوحات تحكم واضحة وخرائط تفاعلية وتقارير إدارية دقيقة.",
    "sw.p1.title": "لوحة تحكم شاملة عبر الويب",
    "sw.p1.desc": "إدارة كاملة للأسطول عبر المتصفح دون الحاجة إلى تثبيت",
    "sw.p2.title": "واجهة متجاوبة للهاتف المحمول",
    "sw.p2.desc": "وصول سريع للمديرين إلى المواقع والتنبيهات في أي مكان",
    "sw.p3.title": "واجهة ربط برمجية API للمؤسسات",
    "sw.p3.desc": "تكامل مباشر وسلس مع الأنظمة الداخلية للمؤسسة",
    "sw.c1.pill": "تتبع مباشر",
    "sw.c1.title": "لوحة الخريطة الحية وإعادة عرض المسارات",
    "sw.c1.desc":
      "عرض لحظي لجميع الوحدات على الخريطة مع تفاصيل السرعة والاتجاه وحالة التوقف وإعادة العرض الرسومي للرحلات السابقة.",
    "sw.c2.pill": "تقارير إدارية",
    "sw.c2.title": "محرك تقارير تحليلي وتصدير قياسي",
    "sw.c2.desc":
      "إصدار تقارير شاملة للمسافات وساعات العمل والتوقفات وسلوك القيادة مع تصفية الفترات الزمنية وتصدير الملفات.",
    "sw.c3.pill": "تنبيهات ذكية",
    "sw.c3.title": "إدارة الأحداث والنطاقات والتنبيهات",
    "sw.c3.desc":
      "تحديد السياجات الجغرافية والسرعات القصوى وتذكيرات الصيانة الدورية مع إرسال إشعارات فورية لحظة وقوع الحدث.",
    "sw.c4.pill": "إدارة الصلاحيات",
    "sw.c4.title": "تعدد المستخدمين ومستويات الوصول المؤسسية",
    "sw.c4.desc":
      "تنظيم الأسطول في مجموعات منفصلة ومتابعة اشتراك كل جهاز وحالة اتصاله.",
    "ben.tag": "القيمة التشغيلية · مزايا GPS",
    "ben.title": "المزايا والفوائد الرئيسية لاستخدام GPS والتتبع الذكي",
    "ben.desc":
      "يسهم اعتماد منظومة التتبع الفضائي من آتي فرزام في تعزيز الأمان اللحظي ورفع كفاءة الأسطول وخفض تكاليف الوقود والصيانة الخفية بشكل ملموس.",
    "ben.b1.kicker": "حماية على مدار الساعة",
    "ben.b1.title": "الحماية الفعّالة والوقاية من السرقة",
    "ben.b1.desc":
      "تنبيه فوري عند الحركة غير المصرح بها أو الاهتزاز أو فصل البطارية، مع تتبع دقيق لاستعادة المركبة في الحالات الطارئة.",
    "ben.b2.kicker": "جدوى اقتصادية",
    "ben.b2.title": "خفض استهلاك الوقود والاستهلاك الميكانيكي",
    "ben.b2.desc":
      "إلغاء التنقلات غير الضرورية وتقليل دوران المحرك أثناء التوقف وضبط السرعات لترشيد نفقات الوقود والصيانة الدورية.",
    "ben.b3.kicker": "مرونة تشغيلية",
    "ben.b3.title": "إدارة الوقت وتحسين المسارات",
    "ben.b3.desc":
      "اختيار أفضل مسارات الإرسال ومراقبة أزمنة التوقف في المحطات وزيادة عدد المهام المنجزة يومياً.",
    "ben.b4.kicker": "تقليل المخاطر",
    "ben.b4.title": "تعزيز سلامة القيادة والحمولة",
    "ben.b4.desc":
      "مراقبة سلوك القيادة بما يشمل الكبح المفاجئ وتجاوز السرعة للوقاية من الحوادث والحفاظ على سلامة السائقين والبضائع.",
    "ben.b5.kicker": "شفافية إدارية",
    "ben.b5.title": "توثيق تلقائي وتقارير دقيقة",
    "ben.b5.desc":
      "تسجيل لحظي للمسافات المقطوعة وساعات العمل اليومية وسجل الرحلات الكامل دون أخطاء بشرية؛ جاهز للتحليل والتقييم.",
    "ben.b6.kicker": "دقة وتنسيق",
    "ben.b6.title": "تقدير دقيق لوقت الوصول (ETA)",
    "ben.b6.desc":
      "إمكانية مشاركة الموقع المباشر وموعد التسليم الدقيق مع العملاء أو الأقسام التنظيمية بالاعتماد على بيانات الأقمار الحية.",
    "ben.stripTitle": "عائد مستدام للأساطيل المؤسسية والشخصية",
    "ben.stripSub": "مراقبة ذكية لضبط التكاليف وتعزيز الأمان والشفافية الكاملة للمسارات",
    "ben.stripWave": "استقرار تبادل بيانات GPS",
    "close.eyebrow": "نظام إدارة الأسطول آتي فرزام (MyFarzam)",
    "close.title": "أدِر أسطولك ببيانات دقيقة",
    "close.desc":
      "تحدثوا مع فريقنا الفني للحصول على عرض مباشر لنظام MyFarzam واستشارة اختيار جهاز التتبع المناسب لمركباتكم.",
    "close.btnTop": "العودة إلى بداية العرض ↑",
    "close.btnBenefits": "استعراض مزايا منظومة GPS",
    "footer.copy": "منظومة إدارة الأسطول آتي فرزام (GPS وتتبع المركبات)",
  },
};

/* =========================================================
   SHARED / MULTI-PAGE I18N ADDITIONS (override stale single-page keys)
   ========================================================= */
const SHARED_I18N_ADDITIONS = {
  fa: {
    "nav.home": "خانه", "nav.hardware": "سخت‌افزار", "nav.software": "نرم‌افزار", "nav.company": "شرکت", "nav.contact": "تماس", "nav.cta": "درخواست دمو",
    "nav.sw.telemetry": "پایش زنده", "nav.sw.dashboard": "داشبورد", "nav.sw.map": "نقشهٔ دستگاه‌ها", "nav.sw.devices": "مدیریت دستگاه‌ها",
    "nav.sw.geofences": "محدوده‌ها", "nav.sw.notifications": "اعلان‌ها", "nav.sw.reports": "گزارش‌ها", "nav.sw.custom": "توسعه اختصاصی",
    "hero.tag": "سخت‌افزار تله‌متری · سامانه نرم‌افزاری MyFarzam · توسعه اختصاصی",
    "hero.titleMain": "ردیابی هوشمند و مدیریت ناوگان",
    "hero.titleAccent": "آتی‌فرزام",
    "hero.desc": "زنجیرهٔ کامل تله‌متری ناوگان سازمانی و خودروهای شخصی؛ از تأمین ردیاب‌های صنعتی و سنسورهای دما، سوخت و سوئیچ (ACC) تا داشبورد زنده، ۹ گزارش تحلیلی با خروجی Excel و توسعهٔ نرم‌افزار اختصاصی متناسب با فرآیندهای سازمان شما.",
    "hero.ctaPrimary": "درخواست دمو و استعلام قیمت", "hero.ctaSecondary": "بررسی سامانه MyFarzam",
    "hero.m1Val": "۹", "hero.m1": "گزارش تحلیلی با خروجی Excel",
    "hero.m2Val": "۳", "hero.m2": "دستهٔ اعلان: هشدار، نگهداری، سیستم",
    "hero.m3Val": "API", "hero.m3": "اتصال دوطرفه به ERP سازمان",
    "close.btnHw": "مشاهدهٔ سخت‌افزار", "close.btnDemo": "درخواست دمو",
    "ctaBand.title": "آمادهٔ تجهیز ناوگان یا مشاهدهٔ دموی زندهٔ MyFarzam هستید؟",
    "ctaBand.desc": "ترکیب خودروها و سنسورهای موردنیازتان را بگویید تا جلسهٔ دموی آنلاین و پیش‌فاکتور اختصاصی را برایتان آماده کنیم.",
    "ctaBand.btn": "هماهنگی دموی آنلاین و استعلام قیمت",
    "sticky.cta": "درخواست دمو و استعلام قیمت",
    "title.index": "آتی‌فرزام | GPS و مدیریت ناوگان", "title.hardware": "سخت‌افزار ردیاب | آتی‌فرزام", "title.software": "نرم‌افزار پایش ناوگان | آتی‌فرزام",
    "title.company": "درباره آتی‌فرزام و فرآیند استقرار | آتی‌فرزام", "title.contact": "تماس و پشتیبانی | آتی‌فرزام",
    "swtab.mon": "پایش زنده", "swtab.man": "مدیریت", "swtab.rep": "گزارش‌ها", "swtab.ben": "مزایا",
    "db.k1v": "۲۴۸", "db.k2v": "۲۱۴", "db.k3v": "۱۸۹", "db.k4v": "۳۲ ثانیه پیش",
    "hw.specNote": "انتخاب مدل نهایی و تیپ سنسورها پس از بررسی نوع خودروها (سبک، سنگین یا یخچالی) توسط تیم فنی انجام می‌شود؛ ثبت هر ردیاب در MyFarzam با شناسهٔ IMEI و شمارهٔ سیم‌کارت انجام می‌شود.",
    "ph.hw.tag": "سخت‌افزار و تله‌متری", "ph.hw.h1": "سخت‌افزارهای ردیابی GPS؛ انتخاب بر اساس خروجی نرم‌افزاری در MyFarzam",
    "ph.hw.p": "آتی‌فرزام مدل‌های متنوعی از ردیاب‌های خودرویی و صنعتی را تأمین می‌کند. هر ردیاب و سنسور جانبی، داده‌ها و گزارش‌های مشخصی را در سامانه MyFarzam فعال می‌سازد.",
    "ph.sw.tag": "پلتفرم نرم‌افزاری MyFarzam", "ph.sw.h1": "سامانه مدیریت ناوگان MyFarzam؛ پایش، محدوده‌ها و ۹ گزارش تحلیلی",
    "ph.sw.p": "محیط کاربری کاملاً فارسی و راست‌به‌چپ (RTL) بدون نیاز به نصب؛ تبدیل تله‌متری خام ردیاب‌ها به شاخص‌های وضعیت ناوگان، هشدارهای دسته‌بندی‌شده و گزارش‌های آماده حسابرسی با خروجی Excel.",
    "ph.co.tag": "شرکت", "ph.co.h1": "درباره آتی‌فرزام و فرآیند استقرار", "ph.co.p": "هویت شرکت، مزیت‌های همکاری و نقشهٔ راه استقرار سازمانی.",
    "ph.ct.tag": "دمو، استعلام قیمت و پشتیبانی فنی", "ph.ct.h1": "گفتگو با تیم فروش سازمانی و پشتیبانی فنی آتی‌فرزام",
    "ph.ct.p": "برای هماهنگی جلسه دموی آنلاین سامانه MyFarzam، دریافت پیش‌فاکتور سخت‌افزار بر اساس تعداد خودروها، یا مطرح کردن نیازهای توسعه اختصاصی، فرم زیر را تکمیل کنید یا مستقیماً با ما تماس بگیرید."
  },
  en: {
    "nav.home": "Home", "nav.hardware": "Hardware", "nav.software": "Software", "nav.company": "Company", "nav.contact": "Contact", "nav.cta": "Request Demo",
    "nav.sw.telemetry": "Live Telemetry", "nav.sw.dashboard": "Dashboard", "nav.sw.map": "Devices Map", "nav.sw.devices": "Device Management",
    "nav.sw.geofences": "Geofences", "nav.sw.notifications": "Notifications", "nav.sw.reports": "Analytical Reports", "nav.sw.custom": "Custom Dev & API",
    "hero.tag": "Telemetry Hardware · MyFarzam Platform · Custom Development",
    "hero.titleMain": "AtiFarzam",
    "hero.titleAccent": "Smart Fleet & GPS Management",
    "hero.ctaPrimary": "Request Demo & Quote", "hero.ctaSecondary": "Explore MyFarzam Platform",
    "hero.m1Val": "9", "hero.m1": "Analytical Reports with Excel Export",
    "hero.m2Val": "3", "hero.m2": "Notification Tiers: Alerts, Maintenance, System",
    "hero.m3Val": "API", "hero.m3": "Two-Way ERP Integration",
    "close.btnHw": "View Hardware", "close.btnDemo": "Request Demo",
    "ctaBand.title": "Ready to equip your fleet or see MyFarzam live?",
    "ctaBand.desc": "Share your vehicle mix and sensor requirements; our team will arrange an online demo and a tailored quotation.",
    "ctaBand.btn": "Book Online Demo & Quote",
    "sticky.cta": "Request Demo & Pricing",
    "title.index": "AtiFarzam | GPS & Fleet Management", "title.hardware": "Tracker Hardware | AtiFarzam", "title.software": "Fleet Monitoring Software | AtiFarzam",
    "title.company": "About AtiFarzam & Deployment | AtiFarzam", "title.contact": "Contact & Support | AtiFarzam",
    "swtab.mon": "Live Monitoring", "swtab.man": "Management", "swtab.rep": "Reports", "swtab.ben": "Benefits",
    "db.k1v": "248", "db.k2v": "214", "db.k3v": "189", "db.k4v": "32 seconds ago",
    "hw.specNote": "Final model and sensor selection follow a review of your vehicle types (light, heavy or refrigerated) by our technical team; each tracker is registered in MyFarzam with its IMEI and SIM number.",
    "ph.hw.tag": "Hardware & Telemetry", "ph.hw.h1": "GPS tracking hardware, selected by the MyFarzam output you need",
    "ph.hw.p": "AtiFarzam supplies a range of vehicle and industrial trackers. Each tracker and auxiliary sensor enables specific data and reports in the MyFarzam platform.",
    "ph.sw.tag": "MyFarzam Software Platform", "ph.sw.h1": "MyFarzam fleet management: live tracking, geofences and 9 analytical reports",
    "ph.sw.p": "A browser-based interface that needs no installation (fully Persian, right-to-left, with English and Arabic on this site): raw tracker telemetry becomes fleet-status indicators, categorised alerts and audit-ready reports with Excel export.",
    "ph.co.tag": "Company", "ph.co.h1": "About AtiFarzam and the deployment process", "ph.co.p": "Company profile, partnership advantages and the enterprise deployment roadmap.",
    "ph.ct.tag": "Demo, quotation and technical support", "ph.ct.h1": "Talk to the AtiFarzam enterprise sales and technical support team",
    "ph.ct.p": "To book an online MyFarzam demo, get a hardware quotation based on your vehicle count, or discuss custom development needs, complete the form below or contact us directly."
  },
  ar: {
    "nav.home": "الرئيسية", "nav.hardware": "الأجهزة", "nav.software": "البرمجيات", "nav.company": "الشركة", "nav.contact": "اتصل بنا", "nav.cta": "طلب عرض توضيحي",
    "nav.sw.telemetry": "التتبع المباشر", "nav.sw.dashboard": "لوحة التحكم", "nav.sw.map": "خريطة الأجهزة", "nav.sw.devices": "إدارة الأجهزة",
    "nav.sw.geofences": "النطاقات الجغرافية", "nav.sw.notifications": "الإشعارات", "nav.sw.reports": "التقارير التحليلية", "nav.sw.custom": "التطوير المخصص وAPI",
    "hero.tag": "أجهزة التتبع · منصة MyFarzam البرمجية · تطوير مخصص",
    "hero.titleMain": "إدارة الأسطول والتتبع الذكي",
    "hero.titleAccent": "آتي فرزام",
    "hero.ctaPrimary": "طلب عرض توضيحي وعرض سعر", "hero.ctaSecondary": "استكشاف منصة MyFarzam",
    "hero.m1Val": "٩", "hero.m1": "تقارير تحليلية مع تصدير Excel",
    "hero.m2Val": "٣", "hero.m2": "فئات الإشعارات: تنبيه، صيانة، نظام",
    "hero.m3Val": "API", "hero.m3": "ربط ثنائي الاتجاه مع ERP",
    "close.btnHw": "استعراض الأجهزة", "close.btnDemo": "طلب عرض توضيحي",
    "ctaBand.title": "هل أنتم مستعدون لتجهيز أسطولكم أو مشاهدة عرض مباشر لنظام MyFarzam؟",
    "ctaBand.desc": "شاركونا تركيبة المركبات والحساسات المطلوبة؛ ليقوم فريقنا بترتيب جلسة عرض مباشر وعرض سعر مخصص.",
    "ctaBand.btn": "حجز عرض مباشر وطلب تسعير",
    "sticky.cta": "طلب عرض توضيحي وتسعير",
    "title.index": "آتي فرزام | نظام GPS وإدارة الأسطول", "title.hardware": "أجهزة التتبع | آتي فرزام", "title.software": "برمجيات مراقبة الأسطول | آتي فرزام",
    "title.company": "عن آتي فرزام وعملية التنفيذ | آتي فرزام", "title.contact": "اتصل بنا والدعم | آتي فرزام",
    "swtab.mon": "المراقبة المباشرة", "swtab.man": "الإدارة", "swtab.rep": "التقارير", "swtab.ben": "المزايا",
    "db.k1v": "٢٤٨", "db.k2v": "٢١٤", "db.k3v": "١٨٩", "db.k4v": "قبل ٣٢ ثانية",
    "hw.specNote": "يتم اختيار الطراز النهائي والحساسات بعد مراجعة فريقنا الفني لأنواع مركباتكم (خفيفة أو ثقيلة أو مبرّدة)؛ ويُسجَّل كل جهاز في MyFarzam برقم IMEI ورقم الشريحة.",
    "ph.hw.tag": "الأجهزة والقياس عن بُعد", "ph.hw.h1": "أجهزة تتبع GPS: اختيار الجهاز بحسب مخرجات MyFarzam المطلوبة",
    "ph.hw.p": "توفّر آتي فرزام طرازات متنوعة من أجهزة التتبع للمركبات والاستخدام الصناعي، ويفعّل كل جهاز وحساس إضافي بيانات وتقارير محددة في منصة MyFarzam.",
    "ph.sw.tag": "منصة MyFarzam البرمجية", "ph.sw.h1": "نظام MyFarzam لإدارة الأسطول: تتبع مباشر ونطاقات جغرافية و٩ تقارير تحليلية",
    "ph.sw.p": "واجهة تعمل من المتصفح دون حاجة إلى تثبيت (فارسية بالكامل ومن اليمين إلى اليسار، مع العربية والإنجليزية في هذا الموقع)؛ تحوّل بيانات التتبع الخام إلى مؤشرات لحالة الأسطول وتنبيهات مصنّفة وتقارير جاهزة للتدقيق بصيغة Excel.",
    "ph.co.tag": "الشركة", "ph.co.h1": "عن آتي فرزام وعملية التنفيذ", "ph.co.p": "هوية الشركة ومزايا التعاون وخارطة طريق التنفيذ المؤسسي.",
    "ph.ct.tag": "عرض توضيحي وتسعير ودعم فني", "ph.ct.h1": "تحدّث مع فريق المبيعات المؤسسية والدعم الفني في آتي فرزام",
    "ph.ct.p": "لحجز عرض توضيحي عبر الإنترنت لنظام MyFarzam، أو الحصول على عرض سعر للأجهزة بحسب عدد المركبات، أو طرح احتياجات التطوير المخصص، يرجى تعبئة النموذج أدناه أو التواصل معنا مباشرة."
  }
};
Object.keys(SHARED_I18N_ADDITIONS).forEach(function (l) { Object.assign(I18N[l], SHARED_I18N_ADDITIONS[l]); });


function setupTelemetryBoard() {
  const tabsWrap = document.getElementById("unit-tabs");
  if (!tabsWrap) return;

  const geofenceEl = document.getElementById("map-geofence");
  const routeEl = document.getElementById("map-active-route");
  const startEl = document.getElementById("map-start-pt");
  const endEl = document.getElementById("map-end-pt");
  const pinEl = document.getElementById("map-active-pin");
  const syncOverlay = document.getElementById("map-sync-overlay");
  const syncLoader = document.getElementById("map-sync-loader");

  const rdTitle = document.getElementById("rd-title");
  const rdStatus = document.getElementById("rd-status");
  const rdCoords = document.getElementById("rd-coords");
  const rdSpeed = document.getElementById("rd-speed");
  const rdDistance = document.getElementById("rd-distance");
  const rdSignal = document.getElementById("rd-signal");

  let syncTimer = null;

  function writeUnitReadout(unitKey) {
    const data = UNITS[unitKey];
    if (!data) return;
    const copy = data.i18n[currentLang] || data.i18n.fa;
    if (rdTitle) rdTitle.textContent = copy.title;
    if (rdStatus) rdStatus.textContent = copy.status;
    if (rdCoords) rdCoords.textContent = data.coords;
    if (rdSpeed) rdSpeed.textContent = copy.speed;
    if (rdDistance) rdDistance.textContent = copy.distance;
    if (rdSignal) rdSignal.textContent = copy.signal;
  }

  refreshTelemetryLanguage = () => {
    writeUnitReadout(activeUnitKey);
  };

  tabsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".unit-tab");
    if (!btn || btn.classList.contains("active")) return;

    const unitKey = btn.dataset.unit;
    const data = UNITS[unitKey];
    if (!data) return;
    activeUnitKey = unitKey;

    tabsWrap.querySelectorAll(".unit-tab").forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (syncLoader) syncLoader.classList.remove("is-paused");
    if (syncOverlay) syncOverlay.hidden = false;
    clearTimeout(syncTimer);

    syncTimer = setTimeout(() => {
      if (geofenceEl) {
        geofenceEl.setAttribute("cx", String(data.geofence[0]));
        geofenceEl.setAttribute("cy", String(data.geofence[1]));
        geofenceEl.setAttribute("r", String(data.geofence[2]));
      }
      if (routeEl) routeEl.setAttribute("d", data.route);
      if (startEl) {
        startEl.setAttribute("cx", String(data.start[0]));
        startEl.setAttribute("cy", String(data.start[1]));
      }
      if (endEl) {
        endEl.setAttribute("cx", String(data.end[0]));
        endEl.setAttribute("cy", String(data.end[1]));
      }
      if (pinEl) {
        pinEl.setAttribute("transform", `translate(${data.pin[0]}, ${data.pin[1]})`);
      }

      writeUnitReadout(unitKey);

      if (syncOverlay) syncOverlay.hidden = true;
      if (syncLoader) syncLoader.classList.add("is-paused");
    }, 360);
  });
}

function setupLanguageDrawer() {
  const switcher = document.getElementById("lang-switcher");
  const trigger = document.getElementById("lang-trigger");
  const tray = document.getElementById("lang-drawer-tray");
  const nameEl = document.getElementById("lang-current-name");
  const codeEl = document.getElementById("lang-current-code");
  if (!switcher || !trigger || !tray) return;

  const optionBtns = Array.from(switcher.querySelectorAll(".lang-opt-btn"));
  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const heroMainSpan = document.querySelector('[data-i18n="hero.titleMain"]');
  const heroAccentSpan = document.querySelector('[data-i18n="hero.titleAccent"]');
  let fadeTimer = 0;

  function setDrawerOpen(open) {
    switcher.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function applyLanguage(lang, { animate = true, persist = true } = {}) {
    const meta = LANG_META[lang];
    const dict = I18N[lang];
    if (!meta || !dict) return;

    currentLang = lang;
    switcher.style.setProperty("--lang-idx", String(meta.idx));

    optionBtns.forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (nameEl) nameEl.textContent = meta.label;
    if (codeEl) codeEl.textContent = meta.code;

    const commitStrings = () => {
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", meta.dir);
      document.title = dict["title." + (document.documentElement.getAttribute("data-page") || "index")] || meta.docTitle;

      for (let i = 0; i < i18nNodes.length; i++) {
        const node = i18nNodes[i];
        const key = node.getAttribute("data-i18n");
        if (key && dict[key] !== undefined) {
          node.textContent = dict[key];
        }
      }
      if (heroMainSpan && heroAccentSpan) {
        const brandFirst = lang === "en";
        heroMainSpan.classList.toggle("accent-text", brandFirst);
        heroAccentSpan.classList.toggle("accent-text", !brandFirst);
      }
      refreshTelemetryLanguage();
    };

    if (animate && document.body) {
      clearTimeout(fadeTimer);
      document.body.classList.add("is-lang-fading");
      fadeTimer = setTimeout(() => {
        commitStrings();
        document.body.classList.remove("is-lang-fading");
      }, 110);
    } else {
      commitStrings();
    }

    if (persist) {
      try {
        window.localStorage.setItem("af_lang", lang);
      } catch (_) {}
    }
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    setDrawerOpen(!switcher.classList.contains("is-open"));
  });

  tray.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-opt-btn");
    if (!btn) return;
    const nextLang = btn.dataset.lang;
    if (nextLang && nextLang !== currentLang) {
      applyLanguage(nextLang, { animate: true, persist: true });
    }
    setTimeout(() => setDrawerOpen(false), 180);
  });

  document.addEventListener("pointerdown", (e) => {
    if (!switcher.classList.contains("is-open")) return;
    if (!switcher.contains(e.target)) {
      setDrawerOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && switcher.classList.contains("is-open")) {
      setDrawerOpen(false);
      trigger.focus();
    }
  });

  let saved = null;
  try {
    saved = window.localStorage && window.localStorage.getItem("af_lang");
  } catch (_) {}
  if (saved && LANG_META[saved] && saved !== "fa") {
    applyLanguage(saved, { animate: false, persist: false });
  }
}

/* =========================================================
   PURE 3D BRUSHED NAVY-TITANIUM LOGO (AUTO-ROTATING WEBGL)
   ========================================================= */
function setupHero3DLogo() {
  const stage = document.getElementById("hero-titanium-stage");
  const canvas = document.getElementById("hero-titanium-canvas");
  const shadow = document.getElementById("hero-titanium-shadow");
  if (!canvas || typeof canvas.getContext !== "function") return;

  /* Exact backgroundless AtiFarzam "af" vector path from af logo.svg */
  const AF_PURE_D =
    "M810.77,440.18c-11.41,196.45-162.4,391.62-247.41,472.15-27.45,28.6-51.13,7.64-51.13-14.47v-448.12c0-18.81-13.94-34.32-32.08-36.76h-170.95c-20.72,0-37.18,16.44-37.18,36.85v447.34c0,16.33-13.23,29.56-29.55,29.56-8.17,0-15.55-3.32-20.91-8.66-5.36-5.34-8.66-12.74-8.66-20.91v-484.19c0-157.84,149.62-315.69,299.23-315.69h269.37c16.33,0,29.56,13.23,29.56,29.55s-13.23,29.56-29.56,29.56h-232.19c-20.72,0-37.18,16.46-37.18,36.87l.09,182.47c0,20.51,16.6,37.11,37.13,37.11h237.35c18.12.44,25.77,13.74,24.06,27.34Z";

  function sampleAfPolygon(d) {
    const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)/g) || [];
    let i = 0;
    let cmd = "";
    let x = 0;
    let y = 0;
    let prevCx = 0;
    let prevCy = 0;
    const raw = [];

    const pushPt = (px, py) => {
      if (
        !raw.length ||
        Math.hypot(px - raw[raw.length - 1][0], py - raw[raw.length - 1][1]) > 0.5
      ) {
        raw.push([px, py]);
      }
    };

    const cubic = (x0, y0, x1, y1, x2, y2, x3, y3) => {
      const len =
        Math.hypot(x1 - x0, y1 - y0) +
        Math.hypot(x2 - x1, y2 - y1) +
        Math.hypot(x3 - x2, y3 - y2);
      const steps = Math.max(10, Math.min(48, Math.ceil(len / 9)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const mt = 1 - t;
        pushPt(
          mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3,
          mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3
        );
      }
    };

    while (i < tokens.length) {
      if (/^[a-zA-Z]$/.test(tokens[i])) cmd = tokens[i++];
      if (cmd === "M") {
        x = +tokens[i++];
        y = +tokens[i++];
        pushPt(x, y);
        cmd = "L";
      } else if (cmd === "l") {
        x += +tokens[i++];
        y += +tokens[i++];
        pushPt(x, y);
        prevCx = x;
        prevCy = y;
      } else if (cmd === "h") {
        x += +tokens[i++];
        pushPt(x, y);
        prevCx = x;
        prevCy = y;
      } else if (cmd === "v") {
        y += +tokens[i++];
        pushPt(x, y);
        prevCx = x;
        prevCy = y;
      } else if (cmd === "c") {
        const x1 = x + +tokens[i++];
        const y1 = y + +tokens[i++];
        const x2 = x + +tokens[i++];
        const y2 = y + +tokens[i++];
        const x3 = x + +tokens[i++];
        const y3 = y + +tokens[i++];
        cubic(x, y, x1, y1, x2, y2, x3, y3);
        prevCx = x2;
        prevCy = y2;
        x = x3;
        y = y3;
      } else if (cmd === "s") {
        const x1 = 2 * x - prevCx;
        const y1 = 2 * y - prevCy;
        const x2 = x + +tokens[i++];
        const y2 = y + +tokens[i++];
        const x3 = x + +tokens[i++];
        const y3 = y + +tokens[i++];
        cubic(x, y, x1, y1, x2, y2, x3, y3);
        prevCx = x2;
        prevCy = y2;
        x = x3;
        y = y3;
      } else if (cmd === "Z" || cmd === "z") {
        break;
      }
    }

    if (
      raw.length > 2 &&
      Math.hypot(raw[0][0] - raw[raw.length - 1][0], raw[0][1] - raw[raw.length - 1][1]) < 1.5
    ) {
      raw.pop();
    }

    const poly = raw.map(([px, py]) => [(px - 512) / 455, -(py - 512) / 455]);
    let area = 0;
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k];
      const b = poly[(k + 1) % poly.length];
      area += (a[0] * b[1] - b[0] * a[1]) * 0.5;
    }
    if (area < 0) poly.reverse();
    return poly;
  }

  function earClipPolygon(poly) {
    const n = poly.length;
    const idx = Array.from({ length: n }, (_, k) => k);
    const tris = [];
    const cross = (a, b, c) =>
      (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const inTri = (p, a, b, c) =>
      cross(a, b, p) >= -1e-6 && cross(b, c, p) >= -1e-6 && cross(c, a, p) >= -1e-6;

    let guard = 0;
    while (idx.length > 3 && guard++ < n * n) {
      let clipped = false;
      for (let k = 0; k < idx.length; k++) {
        const i0 = idx[(k + idx.length - 1) % idx.length];
        const i1 = idx[k];
        const i2 = idx[(k + 1) % idx.length];
        const a = poly[i0];
        const b = poly[i1];
        const c = poly[i2];
        if (cross(a, b, c) <= 1e-6) continue;
        let ear = true;
        for (let m = 0; m < idx.length; m++) {
          const im = idx[m];
          if (im === i0 || im === i1 || im === i2) continue;
          if (inTri(poly[im], a, b, c)) {
            ear = false;
            break;
          }
        }
        if (ear) {
          tris.push([i0, i1, i2]);
          idx.splice(k, 1);
          clipped = true;
          break;
        }
      }
      if (!clipped) break;
    }
    if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]]);
    return tris;
  }

  function buildTitaniumMesh(poly, tris) {
    const n = poly.length;
    const halfD = 0.142;

    /* Smooth outward 2D boundary normals + arc-length parameter */
    const edgeN = poly.map((p, k) => {
      const q = poly[(k + 1) % n];
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const L = Math.hypot(dx, dy) || 1;
      return [dy / L, -dx / L, L];
    });

    const vNorm2D = [];
    const arcU = [0];
    for (let k = 0; k < n; k++) {
      const ePrev = edgeN[(k + n - 1) % n];
      const eCurr = edgeN[k];
      let nx = ePrev[0] + eCurr[0];
      let ny = ePrev[1] + eCurr[1];
      const nl = Math.hypot(nx, ny) || 1;
      vNorm2D.push([nx / nl, ny / nl]);
      arcU.push(arcU[k] + eCurr[2]);
    }

    /* Vertex layout: pos(3), norm(3), brushPerp(3), arc(1) = 10 floats */
    const verts = [];
    const pushV = (px, py, pz, nx, ny, nz, bx, by, bz, u) => {
      verts.push(px, py, pz, nx, ny, nz, bx, by, bz, u);
    };

    /* Subtle 14° diagonal satin brush direction on front & back titanium plates */
    const bAngle = 0.245;
    const fbx = -Math.sin(bAngle);
    const fby = Math.cos(bAngle);

    /* 1. Front brushed titanium face (z = +halfD) */
    for (let t = 0; t < tris.length; t++) {
      const [i0, i1, i2] = tris[t];
      const p0 = poly[i0];
      const p1 = poly[i1];
      const p2 = poly[i2];
      pushV(p0[0], p0[1], halfD, 0, 0, 1, fbx, fby, 0, 0);
      pushV(p1[0], p1[1], halfD, 0, 0, 1, fbx, fby, 0, 0);
      pushV(p2[0], p2[1], halfD, 0, 0, 1, fbx, fby, 0, 0);
    }

    /* 2. Back brushed titanium face (z = -halfD) */
    for (let t = 0; t < tris.length; t++) {
      const [i0, i1, i2] = tris[t];
      const p0 = poly[i0];
      const p2 = poly[i2];
      const p1 = poly[i1];
      pushV(p0[0], p0[1], -halfD, 0, 0, -1, fbx, fby, 0, 0);
      pushV(p2[0], p2[1], -halfD, 0, 0, -1, fbx, fby, 0, 0);
      pushV(p1[0], p1[1], -halfD, 0, 0, -1, fbx, fby, 0, 0);
    }

    /* 3. 5-ring CNC machined chamfer bevel + extruded titanium side walls */
    const rings = [
      { z: halfD, flare: 0.0, nz: 0.68 },
      { z: halfD * 0.84, flare: 0.009, nz: 0.26 },
      { z: 0.0, flare: 0.012, nz: 0.0 },
      { z: -halfD * 0.84, flare: 0.009, nz: -0.26 },
      { z: -halfD, flare: 0.0, nz: -0.68 },
    ];

    const ringPt = (kIdx, r) => {
      const p = poly[kIdx % n];
      const vn = vNorm2D[kIdx % n];
      const xyScale = Math.sqrt(Math.max(0, 1 - r.nz * r.nz));
      return {
        x: p[0] + vn[0] * r.flare,
        y: p[1] + vn[1] * r.flare,
        z: r.z,
        nx: vn[0] * xyScale,
        ny: vn[1] * xyScale,
        nz: r.nz,
        u: arcU[kIdx],
      };
    };

    for (let k = 0; k < n; k++) {
      for (let r = 0; r < rings.length - 1; r++) {
        const A = ringPt(k, rings[r]);
        const B = ringPt(k + 1, rings[r]);
        const C = ringPt(k + 1, rings[r + 1]);
        const D = ringPt(k, rings[r + 1]);

        /* Brush grooves run circumferentially around the side wall (perp = Z) */
        pushV(A.x, A.y, A.z, A.nx, A.ny, A.nz, 0, 0, 1, A.u);
        pushV(D.x, D.y, D.z, D.nx, D.ny, D.nz, 0, 0, 1, D.u);
        pushV(C.x, C.y, C.z, C.nx, C.ny, C.nz, 0, 0, 1, C.u);

        pushV(A.x, A.y, A.z, A.nx, A.ny, A.nz, 0, 0, 1, A.u);
        pushV(C.x, C.y, C.z, C.nx, C.ny, C.nz, 0, 0, 1, C.u);
        pushV(B.x, B.y, B.z, B.nx, B.ny, B.nz, 0, 0, 1, B.u);
      }
    }

    return new Float32Array(verts);
  }

  const gl =
    canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      antialias: true,
    });

  const poly = sampleAfPolygon(AF_PURE_D);

  /* Fallback for headless environments without WebGL */
  if (!gl) {
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    ctx2d.save();
    ctx2d.translate(canvas.width * 0.5, canvas.height * 0.5);
    ctx2d.scale(canvas.width * 0.42, -canvas.height * 0.42);
    ctx2d.fillStyle = "#102333";
    ctx2d.beginPath();
    poly.forEach((p, idx) => (idx ? ctx2d.lineTo(p[0], p[1]) : ctx2d.moveTo(p[0], p[1])));
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.restore();
    return;
  }

  const tris = earClipPolygon(poly);
  const meshData = buildTitaniumMesh(poly, tris);
  const vertexCount = meshData.length / 10;

  const vsSrc = `
    attribute vec3 aPos;
    attribute vec3 aNorm;
    attribute vec3 aBrushPerp;
    attribute float aArc;

    uniform vec4 uRot; /* cy, sy, cx, sx */
    uniform vec2 uAspect;

    varying vec3 vLocalPos;
    varying vec3 vLocalNorm;
    varying vec3 vWorldPos;
    varying vec3 vWorldNorm;
    varying vec3 vWorldBrushPerp;
    varying float vArc;

    vec3 rotYX(vec3 v, vec4 r) {
      float x1 = v.x * r.x + v.z * r.y;
      float z1 = -v.x * r.y + v.z * r.x;
      float y2 = v.y * r.z - z1 * r.w;
      float z2 = v.y * r.w + z1 * r.z;
      return vec3(x1, y2, z2);
    }

    void main() {
      vLocalPos = aPos;
      vLocalNorm = aNorm;
      vArc = aArc;

      vec3 wp = rotYX(aPos, uRot);
      vWorldPos = wp;
      vWorldNorm = rotYX(aNorm, uRot);
      vWorldBrushPerp = rotYX(aBrushPerp, uRot);

      vec3 viewPos = wp - vec3(0.0, 0.0, 3.45);
      float f = 2.95;
      gl_Position = vec4(
        viewPos.x * f * uAspect.x,
        viewPos.y * f * uAspect.y,
        -2.0 * viewPos.z - 5.4,
        -viewPos.z
      );
    }
  `;

  const fsSrc = `
    precision highp float;

    varying vec3 vLocalPos;
    varying vec3 vLocalNorm;
    varying vec3 vWorldPos;
    varying vec3 vWorldNorm;
    varying vec3 vWorldBrushPerp;
    varying float vArc;

    void main() {
      vec3 N = normalize(vWorldNorm);
      vec3 V = normalize(vec3(0.0, 0.0, 3.45) - vWorldPos);
      vec3 B = normalize(vWorldBrushPerp - N * dot(vWorldBrushPerp, N));
      vec3 T = normalize(cross(B, N));

      /* Multi-harmonic CNC brushed titanium micro-grain (anti-aliased frequencies) */
      float isFace = step(0.82, abs(vLocalNorm.z));
      float u = mix(
        vLocalPos.z * 2.1,
        dot(vLocalPos.xy, vec2(-0.242, 0.970)),
        isFace
      );
      float v = mix(
        vArc * 0.9,
        dot(vLocalPos.xy, vec2(0.970, 0.242)),
        isFace
      );

      float w1 = sin(u * 148.0 + sin(v * 6.5) * 0.55);
      float w2 = sin(u * 282.0 + 1.85 + sin(v * 11.5) * 0.45);
      float w3 = sin(u * 436.0 + 0.75 + cos(v * 18.0) * 0.35);
      float streak = 0.72 + 0.28 * sin(v * 9.0 + w1 * 0.75);

      float brushVal = (w1 * 0.46 + w2 * 0.34 + w3 * 0.20) * streak;
      float brushSlope = (
        cos(u * 148.0) * 0.48 +
        cos(u * 282.0 + 1.85) * 0.34 +
        cos(u * 436.0 + 0.75) * 0.18
      ) * streak;

      /* Perturb surface normal across brushed titanium hairlines */
      vec3 Np = normalize(N + B * (brushSlope * 0.095));

      /* Brand Primary Navy (#102333) PVD Brushed Titanium Metallic Palette */
      vec3 navyShadow = vec3(0.029, 0.068, 0.106); /* Deep recessed navy metal */
      vec3 navyBrand  = vec3(0.063, 0.137, 0.200); /* Exact #102333 primary navy */
      vec3 navyLit    = vec3(0.138, 0.268, 0.386); /* Brushed navy-titanium midtone */
      vec3 tiCool     = vec3(0.490, 0.618, 0.735); /* Cool metallic titanium sheen */
      vec3 tiSpecCol  = vec3(0.865, 0.912, 0.958); /* Specular titanium catchlight */

      /* Analytic 3D Studio Softbox Environment Reflection */
      vec3 R = reflect(-V, Np);
      float envSky = smoothstep(-0.55, 0.85, R.y * 0.72 + R.z * 0.38);
      float envBand = smoothstep(0.18, 0.86, R.y * 0.55 - R.x * 0.48 + R.z * 0.32);
      float envDark = smoothstep(0.05, 0.55, -R.y * 0.65 + R.x * 0.35);

      vec3 envCol = mix(navyBrand, navyLit, envSky);
      envCol = mix(envCol, tiCool, envBand * 0.62);
      envCol = mix(envCol, navyShadow, envDark * 0.58);

      /* Subtle brushed titanium satin tonal contrast */
      envCol *= (1.0 + brushVal * 0.085);

      /* 3-Point Anisotropic Metallic Studio Lights */
      vec3 L1 = normalize(vec3(-0.46, 0.58, 0.67));
      vec3 H1 = normalize(L1 + V);
      float ndl1 = max(dot(Np, L1), 0.0);
      float ht1 = dot(H1, T);
      float hb1 = dot(H1, B);
      float hn1 = max(dot(H1, Np), 0.0);
      /* Anisotropic satin streak (tight along brush T, broad across grooves B) */
      float aniso1 = exp(-((ht1 * ht1) / 0.055 + (hb1 * hb1) / 0.26)) * pow(hn1, 3.0) * ndl1;
      float sharp1 = pow(hn1, 56.0) * ndl1;

      vec3 L2 = normalize(vec3(0.66, 0.30, 0.69));
      vec3 H2 = normalize(L2 + V);
      float ndl2 = max(dot(Np, L2), 0.0);
      float ht2 = dot(H2, T);
      float hb2 = dot(H2, B);
      float hn2 = max(dot(H2, Np), 0.0);
      float aniso2 = exp(-((ht2 * ht2) / 0.065 + (hb2 * hb2) / 0.28)) * pow(hn2, 3.0) * ndl2;

      /* Back/Top Rim Kicker for dramatic 3D side-wall & bevel definition */
      vec3 L3 = normalize(vec3(0.12, 0.88, -0.45));
      float rimTop = pow(max(dot(Np, L3), 0.0), 2.4) * 0.28;

      /* Grazing metallic Fresnel rim */
      float fresnel = pow(1.0 - max(dot(Np, V), 0.0), 3.4);

      vec3 col = envCol;
      col += mix(navyLit, tiCool, 0.55) * (ndl1 * 0.34 + ndl2 * 0.22);
      col += mix(tiCool, tiSpecCol, 0.62) * (aniso1 * 0.64 + aniso2 * 0.36);
      col += tiSpecCol * (sharp1 * 0.42);
      col += tiCool * (fresnel * 0.34 + rimTop);

      /* Gentle tone-curve compression to keep highlights silky, never clipped harsh white */
      col = col / (1.0 + col * 0.22);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compileShader(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, meshData, gl.STATIC_DRAW);

  const STRIDE = 10 * 4;
  const locPos = gl.getAttribLocation(prog, "aPos");
  const locNorm = gl.getAttribLocation(prog, "aNorm");
  const locBrush = gl.getAttribLocation(prog, "aBrushPerp");
  const locArc = gl.getAttribLocation(prog, "aArc");

  gl.enableVertexAttribArray(locPos);
  gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(locNorm);
  gl.vertexAttribPointer(locNorm, 3, gl.FLOAT, false, STRIDE, 3 * 4);
  gl.enableVertexAttribArray(locBrush);
  gl.vertexAttribPointer(locBrush, 3, gl.FLOAT, false, STRIDE, 6 * 4);
  gl.enableVertexAttribArray(locArc);
  gl.vertexAttribPointer(locArc, 1, gl.FLOAT, false, STRIDE, 9 * 4);

  const uRot = gl.getUniformLocation(prog, "uRot");
  const uAspect = gl.getUniformLocation(prog, "uAspect");

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  let aspectX = 1;
  let aspectY = 1;

  function syncViewport() {
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(220, Math.round(rect.width || 380));
    const cssH = Math.max(220, Math.round(rect.height || 380));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pw = Math.round(cssW * dpr);
    const ph = Math.round(cssH * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (pw >= ph) {
      aspectX = ph / pw;
      aspectY = 1;
    } else {
      aspectX = 1;
      aspectY = pw / ph;
    }
  }

  syncViewport();
  window.addEventListener("resize", syncViewport, { passive: true });

  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let angleY = -0.32;
  let lastTs = 0;
  let isVisible = true;
  let spinRaf = 0;

  function drawFrame(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, Math.max(0, (ts - lastTs) * 0.001));
    lastTs = ts;

    if (!reducedMotion) {
      /* Calm, continuous automatic 3D rotation (~13s per full 360° turn) */
      angleY = (angleY + dt * 0.48) % (Math.PI * 2);
    }

    const angleX = 0.095 + Math.sin(angleY) * 0.035;
    const cy = Math.cos(angleY);
    const sy = Math.sin(angleY);
    const cx = Math.cos(angleX);
    const sx = Math.sin(angleX);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform4f(uRot, cy, sy, cx, sx);
    gl.uniform2f(uAspect, aspectX, aspectY);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    if (shadow) {
      const sxShadow = (0.56 + 0.44 * Math.abs(cy)).toFixed(3);
      shadow.style.setProperty("--shadow-sx", sxShadow);
    }

    if (isVisible && !reducedMotion) {
      spinRaf = requestAnimationFrame(drawFrame);
    } else {
      spinRaf = 0;
    }
  }

  /* Render initial frame immediately (schedules spinRaf inside drawFrame) */
  drawFrame(0);

  /* Pause GPU loop automatically when Hero scrolls out of view */
  if ("IntersectionObserver" in window && stage) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible && !spinRaf && !reducedMotion) {
            lastTs = 0;
            spinRaf = requestAnimationFrame(drawFrame);
          } else if (!isVisible && spinRaf) {
            cancelAnimationFrame(spinRaf);
            spinRaf = 0;
          }
        }
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(stage);
  }
}

/* =========================================================
   SILKY SCROLL-COUPLED RAIL + CONTOUR TRACE ENGINE
   ========================================================= */
function getScrollTop() {
  const se = document.scrollingElement || document.documentElement;
  return Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    se ? se.scrollTop || 0 : 0,
    document.documentElement ? document.documentElement.scrollTop || 0 : 0,
    document.body ? document.body.scrollTop || 0 : 0
  );
}

function getMaxScroll() {
  const se = document.scrollingElement || document.documentElement;
  const docH = Math.max(
    se ? se.scrollHeight || 0 : 0,
    document.documentElement ? document.documentElement.scrollHeight || 0 : 0,
    document.body ? document.body.scrollHeight || 0 : 0
  );
  return Math.max(1, docH - window.innerHeight);
}

function setupKineticScroll() {
  const scrollRail = document.getElementById("scroll-journey");
  const railFill = document.getElementById("scroll-rail-fill");
  const traceTraveler = document.getElementById("scroll-trace-traveler");

  const scrollLine = document.getElementById("scroll-line");
  const topBar = document.getElementById("top-bar");
  const bgWheelLeft = document.getElementById("bg-wheel-left");
  const bgWheelRight = document.getElementById("bg-wheel-right");

  let targetY = getScrollTop();
  let smoothY = targetY;
  let targetProg = Math.max(0, Math.min(1, targetY / getMaxScroll()));
  let smoothProg = targetProg;
  let rafId = 0;

  function sampleScroll() {
    const y = getScrollTop();
    const maxS = getMaxScroll();
    targetY = y;
    targetProg = Math.max(0, Math.min(1, y / maxS));

    if (scrollLine) scrollLine.style.width = `${(targetProg * 100).toFixed(2)}%`;
    if (topBar) topBar.classList.toggle("scrolled", y > 16);

    if (!rafId) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  function renderFrame() {
    smoothY += (targetY - smoothY) * 0.07;
    smoothProg += (targetProg - smoothProg) * 0.07;

    const pct = (smoothProg * 100).toFixed(3);

    /* 1. Minimalist Orange-Glass Left Rail + Frosted Glass Traveler + Contour Trace */
    if (railFill) {
      railFill.style.height = `${pct}%`;
    }
    if (traceTraveler) {
      traceTraveler.style.top = `${pct}%`;
    }
    updateContourTrace(smoothProg);

    /* 2. Calm Architectural Background Rings */
    if (bgWheelLeft) {
      const rotL = smoothY * 0.06;
      const shiftL = smoothY * -0.03;
      bgWheelLeft.setAttribute(
        "transform",
        `translate(190 ${(210 + shiftL).toFixed(2)}) rotate(${rotL.toFixed(2)})`
      );
    }
    if (bgWheelRight) {
      const rotR = -(smoothY * 0.05);
      const shiftR = smoothY * 0.025;
      bgWheelRight.setAttribute(
        "transform",
        `translate(1260 ${(700 - shiftR).toFixed(2)}) rotate(${rotR.toFixed(2)})`
      );
    }

    const stillMoving =
      Math.abs(targetY - smoothY) > 0.18 || Math.abs(targetProg - smoothProg) > 0.0002;

    if (stillMoving) {
      if (scrollRail) scrollRail.classList.add("is-scrolling");
      rafId = requestAnimationFrame(renderFrame);
    } else {
      smoothY = targetY;
      smoothProg = targetProg;
      if (scrollRail) scrollRail.classList.remove("is-scrolling");
      rafId = 0;
    }
  }

  window.addEventListener("scroll", sampleScroll, { passive: true });
  document.addEventListener("scroll", sampleScroll, { passive: true, capture: true });
  window.addEventListener("resize", sampleScroll, { passive: true });

  updateContourTrace(smoothProg);
  renderFrame();
}

/* Passive Soft Card Spotlight (zero geometry change -> zero edge jitter) */
function setupSoftCardSheen() {
  document.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      const card = e.target.closest(".silk-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--gx", `${(e.clientX - r.left).toFixed(0)}px`);
      card.style.setProperty("--gy", `${(e.clientY - r.top).toFixed(0)}px`);
    },
    { passive: true }
  );
}

/* Animated Clients Carousel */
function setupClientsCarousel() {
  const track = document.getElementById("clients-track");
  const line = document.getElementById("clients-line");
  const items = document.getElementById("clients-items");
  const hint = document.getElementById("clients-pause-hint");
  
  if (!track || !line || !items || !hint) return;

  const cards = items.querySelectorAll(".client-card");
  let isPaused = false;
  let pausedCard = null;

  // Clone items for seamless loop
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add("client-card-clone");
    items.appendChild(clone);
  });

  // Handle card interactions
  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      isPaused = true;
      pausedCard = card;
      line.classList.add("paused");
      items.classList.add("paused");
      card.classList.add("active");
      hint.classList.add("hidden");
    });

    card.addEventListener("pointerleave", () => {
      if (isPaused && pausedCard === card) {
        isPaused = false;
        pausedCard = null;
        line.classList.remove("paused");
        items.classList.remove("paused");
        card.classList.remove("active");
        hint.classList.remove("hidden");
      }
    });

    // Touch support
    card.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isPaused = !isPaused;
      if (isPaused) {
        pausedCard = card;
        line.classList.add("paused");
        items.classList.add("paused");
        card.classList.add("active");
        hint.classList.add("hidden");
      } else {
        pausedCard = null;
        line.classList.remove("paused");
        items.classList.remove("paused");
        card.classList.remove("active");
        hint.classList.remove("hidden");
      }
    });
  });

  // Also handle clones
  const allCards = items.querySelectorAll(".client-card");
  allCards.forEach((card) => {
    card.addEventListener("pointerleave", () => {
      if (isPaused && pausedCard === card) {
        isPaused = false;
        pausedCard = null;
        line.classList.remove("paused");
        items.classList.remove("paused");
        card.classList.remove("active");
        hint.classList.remove("hidden");
      }
    });
  });
}

/* Support Glass Modal */
function setupSupportModal() {
  const modalBtn = document.getElementById("support-modal-btn");
  const modalOverlay = document.getElementById("support-modal-overlay");
  const modal = document.getElementById("support-modal");
  const modalClose = document.getElementById("support-modal-close");

  if (!modalBtn || !modalOverlay || !modal || !modalClose) return;

  function openModal() {
    modalOverlay.classList.add("active");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  modalBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
}

function setupSmoothLinks() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* Calm One-Way Silk Reveal */
function setupScrollReveals() {
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-in"));
  }
}

/* =========================================================
   INTERACTIVE KINETIC MICRO-DOT BACKGROUND FIELD
   ========================================================= */
function setupKineticDotField() {
  const canvas = document.getElementById("bg-dots-canvas");
  if (!canvas || typeof canvas.getContext !== "function") return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const STEP = 26;
  const BASE_R = 1.25;
  const RADIUS = 148;
  const TAU = Math.PI * 2;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  let count = 0;
  let offsetX = 0;
  let offsetY = 0;

  let hx = new Float32Array(0);
  let hy = new Float32Array(0);
  let ox = new Float32Array(0);
  let oy = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let isActive = new Uint8Array(0);
  const activeIndices = [];

  let pointerEnergy = 0;
  let moveDecayTimer = 0;
  let targetEnergy = 0;
  let targetMx = -9999;
  let targetMy = -9999;
  let smx = -9999;
  let smy = -9999;
  let dotsRaf = 0;

  function buildGrid() {
    width = window.innerWidth || 1280;
    height = window.innerHeight || 800;
    dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / STEP) + 1;
    rows = Math.ceil(height / STEP) + 1;
    count = cols * rows;
    offsetX = (width - (cols - 1) * STEP) * 0.5;
    offsetY = (height - (rows - 1) * STEP) * 0.5;

    hx = new Float32Array(count);
    hy = new Float32Array(count);
    ox = new Float32Array(count);
    oy = new Float32Array(count);
    vx = new Float32Array(count);
    vy = new Float32Array(count);
    isActive = new Uint8Array(count);
    activeIndices.length = 0;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const y = offsetY + r * STEP;
      for (let c = 0; c < cols; c++) {
        hx[idx] = offsetX + c * STEP;
        hy[idx] = y;
        idx++;
      }
    }

    drawDotsFrame();
  }

  function activateDot(idx) {
    if (!isActive[idx]) {
      isActive[idx] = 1;
      activeIndices.push(idx);
    }
  }

  function drawDotsFrame() {
    ctx.clearRect(0, 0, width, height);

    /* 1. Single batched draw for all calm resting micro-dots */
    ctx.fillStyle = "rgba(16, 35, 51, 0.2)";
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      if (isActive[i]) continue;
      const x = hx[i];
      const y = hy[i];
      ctx.moveTo(x + BASE_R, y);
      ctx.arc(x, y, BASE_R, 0, TAU);
    }
    ctx.fill();

    /* 2. Draw kinetically energized micro-dots with smooth bloom */
    for (let k = 0; k < activeIndices.length; k++) {
      const i = activeIndices[k];
      const dx = ox[i];
      const dy = oy[i];
      const disp = Math.hypot(dx, dy);
      const energy = Math.min(1, disp / 14);
      const r = BASE_R + energy * 1.15;
      const x = hx[i] + dx;
      const y = hy[i] + dy;

      if (energy > 0.32) {
        const mix = (energy - 0.32) / 0.68;
        ctx.fillStyle = `rgba(240, 83, 39, ${(0.28 + mix * 0.52).toFixed(3)})`;
      } else {
        ctx.fillStyle = `rgba(16, 35, 51, ${(0.22 + energy * 0.38).toFixed(3)})`;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }
  }

  function stepDots() {
    let mvx = 0;
    let mvy = 0;

    pointerEnergy += (targetEnergy - pointerEnergy) * 0.18;
    if (pointerEnergy < 0.004 && targetEnergy === 0) {
      pointerEnergy = 0;
    }

    if (pointerEnergy > 0 && targetMx > -9000) {
      if (smx < -9000) {
        smx = targetMx;
        smy = targetMy;
      }
      const nmx = smx + (targetMx - smx) * 0.24;
      const nmy = smy + (targetMy - smy) * 0.24;
      mvx = Math.max(-24, Math.min(24, nmx - smx));
      mvy = Math.max(-24, Math.min(24, nmy - smy));
      smx = nmx;
      smy = nmy;

      const cMin = Math.max(0, Math.floor((smx - RADIUS - offsetX) / STEP));
      const cMax = Math.min(cols - 1, Math.ceil((smx + RADIUS - offsetX) / STEP));
      const rMin = Math.max(0, Math.floor((smy - RADIUS - offsetY) / STEP));
      const rMax = Math.min(rows - 1, Math.ceil((smy + RADIUS - offsetY) / STEP));

      for (let r = rMin; r <= rMax; r++) {
        const rowBase = r * cols;
        for (let c = cMin; c <= cMax; c++) {
          const i = rowBase + c;
          const dx = hx[i] - smx;
          const dy = hy[i] - smy;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.001) {
            const falloff = 1 - dist / RADIUS;
            const w = falloff * falloff * pointerEnergy;
            const ux = dx / dist;
            const uy = dy / dist;

            /* Gentle elastic parting + trailing walk wake */
            const goalX = ux * w * 16 + mvx * w * 0.55;
            const goalY = uy * w * 16 + mvy * w * 0.55;
            vx[i] += (goalX - ox[i]) * 0.15;
            vy[i] += (goalY - oy[i]) * 0.15;
            activateDot(i);
          }
        }
      }
    }

    for (let k = activeIndices.length - 1; k >= 0; k--) {
      const i = activeIndices[k];
      vx[i] = (vx[i] - ox[i] * 0.078) * 0.84;
      vy[i] = (vy[i] - oy[i] * 0.078) * 0.84;
      ox[i] += vx[i];
      oy[i] += vy[i];

      if (
        pointerEnergy === 0 &&
        Math.abs(ox[i]) < 0.04 &&
        Math.abs(oy[i]) < 0.04 &&
        Math.abs(vx[i]) < 0.04 &&
        Math.abs(vy[i]) < 0.04
      ) {
        ox[i] = 0;
        oy[i] = 0;
        vx[i] = 0;
        vy[i] = 0;
        isActive[i] = 0;
        const last = activeIndices.pop();
        if (k < activeIndices.length) {
          activeIndices[k] = last;
        }
      }
    }

    drawDotsFrame();

    if (activeIndices.length > 0 || pointerEnergy > 0) {
      dotsRaf = requestAnimationFrame(stepDots);
    } else {
      dotsRaf = 0;
    }
  }

  function wakeDots() {
    if (!dotsRaf) {
      dotsRaf = requestAnimationFrame(stepDots);
    }
  }

  function pulsePointerAt(x, y, holdMs = 140) {
    targetMx = x;
    targetMy = y;
    targetEnergy = 1;
    clearTimeout(moveDecayTimer);
    moveDecayTimer = setTimeout(() => {
      targetEnergy = 0;
    }, holdMs);
    wakeDots();
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      pulsePointerAt(e.clientX, e.clientY, 140);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches && e.touches[0];
      if (t) pulsePointerAt(t.clientX, t.clientY, 220);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches && e.touches[0];
      if (t) pulsePointerAt(t.clientX, t.clientY, 180);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      clearTimeout(moveDecayTimer);
      targetEnergy = 0;
      smx = -9999;
      smy = -9999;
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseleave",
    () => {
      clearTimeout(moveDecayTimer);
      targetEnergy = 0;
      smx = -9999;
      smy = -9999;
    },
    { passive: true }
  );

  window.addEventListener("resize", buildGrid, { passive: true });
  buildGrid();
}

mountMotions();
mountScrollContourTrace();
mountClosingCreamLogos();
setupKineticDotField();
setupHero3DLogo();
setupTelemetryBoard();
setupLanguageDrawer();
setupScrollReveals();
setupKineticScroll();
setupSoftCardSheen();
setupMobileNavigation();
setupClientsCarousel();
setupSupportModal();
setupSmoothLinks();

/* Mobile Navigation Toggle */
function setupMobileNavigation() {
  const hamburger = document.getElementById("nav-hamburger");
  const overlay = document.getElementById("nav-mobile-overlay");
  const mobileMenu = document.getElementById("nav-mobile-menu");
  const desktopNav = document.querySelector(".nav-desktop");

  if (!hamburger || !overlay || !mobileMenu) return;

  // Toggle mobile menu
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    overlay.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close on overlay click
  overlay.addEventListener("click", () => {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    overlay.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Mobile: chevron toggles the submenu; the text link navigates normally
  mobileMenu.addEventListener("click", (e) => {
    const toggle = e.target.closest(".nav-dropdown-toggle");
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      const item = toggle.closest(".nav-item");
      const open = item.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      overlay.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Close all dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".top-nav")) {
      document.querySelectorAll(".nav-item.open").forEach((item) => {
        item.classList.remove("open");
      });
    }
  });
}
