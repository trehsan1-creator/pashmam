/*!
 * AtiFarzam — 3D Scroll-Driven Interactive Landing (landing.html)
 * Classic (non-module) script: loads after motions.js + presentation.js + vendor/three.min.js
 * Light architectural design system: #DCE1E8 · #102333 · #f05327 · #F2F4F8
 * Provides: 6-zone Three.js architectural world, scroll camera flight, l3d.* i18n,
 * pointer parallax, 3D-projected .l3d-pin callouts, bottom .l3d-dock, 2D isometric fallback.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  SHARED BINDINGS (from presentation.js / motions.js, already loaded) */
  /* ------------------------------------------------------------------ */
  const currentLangGlobal = typeof currentLang !== "undefined" ? currentLang : null;
  const CANONICAL_PATH = typeof CANONICAL_PATH !== "undefined" ? CANONICAL_PATH : null;
  const THREE = window.THREE;

  /* ------------------------------------------------------------------ */
  /*  DESIGN TOKENS */
  /* ------------------------------------------------------------------ */
  const C_NAVY = 0x102333;
  const C_ORANGE = 0xf05327;
  const C_CREAM = 0xf2f4f8;
  const C_WHITE = 0xffffff;
  const C_SKY = 0xdce1e8;
  const BG_HEX = 0xdce1e8;

  /* ------------------------------------------------------------------ */
  /*  ZONE WORLD POSITIONS (as specified) */
  /* ------------------------------------------------------------------ */
  const ZONE_POS = [
    new THREE.Vector3(0, 0.2, 0),     // 01 monolith + GNSS
    new THREE.Vector3(12, -0.4, -22), // 02 exploded tracker
    new THREE.Vector3(-13, -1.2, -46),// 03 city + geofence
    new THREE.Vector3(13, 0.4, -70),  // 04 command deck
    new THREE.Vector3(-11, 0.0, -94), // 05 R&D core
    new THREE.Vector3(0, 0.6, -118),  // 06 diagonal orbit finale
  ];

  /* Camera stations: where the camera sits & looks for each zone */
  const STATIONS = [
    { pos: new THREE.Vector3(0, 3.2, 7.0), look: new THREE.Vector3(0, 0.2, 0) },
    { pos: new THREE.Vector3(18, 2.4, -15), look: new THREE.Vector3(12, -0.4, -22) },
    { pos: new THREE.Vector3(-20, 2.8, -39), look: new THREE.Vector3(-13, -1.2, -46) },
    { pos: new THREE.Vector3(19, 3.2, -63), look: new THREE.Vector3(13, 0.4, -70) },
    { pos: new THREE.Vector3(-18, 2.6, -87), look: new THREE.Vector3(-11, 0.0, -94) },
    { pos: new THREE.Vector3(0, 3.6, -109), look: new THREE.Vector3(0, 0.6, -118) },
  ];



  /* ------------------------------------------------------------------ */
  /*  l3d.* i18n DICTIONARY (merged into I18N) */
  /* ------------------------------------------------------------------ */
  const L3D_I18N = {
    fa: {
      "l3d.nav3d": "نمای 3D",
      "l3d.a1.tag": "اکوسیستم یکپارچه تله‌متری سه‌بعدی",
      "l3d.a1.title": "ردیابی هوشمند و مدیریت ناوگان",
      "l3d.a1.accent": "آتی‌فرزام",
      "l3d.a1.desc": "زنجیرهٔ کامل مدیریت ناوگان سازمانی و خودروهای شخصی در یک نگاه سه‌بعدی؛ از ردیاب‌های صنعتی و سنسورهای تخصصی تا پلتفرم بومی MyFarzam، ۹ گزارش Excel و اتصال دوطرفه API.",
      "l3d.a1.p1": "ردیاب و سنسورها",
      "l3d.a1.p2": "پایش و ۹ گزارش",
      "l3d.a1.p3": "توسعه اختصاصی و API",
      "l3d.a1.m1": "گزارش تحلیلی آماده حسابرسی",
      "l3d.a1.m2": "دقت ماهواره‌ای GPS/GLONASS",
      "l3d.a1.m3": "۳ دسته اعلان هوشمند",
      "l3d.a1.cta": "درخواست دمو و قیمت",
      "l3d.a1.scroll": "اسکرول کنید · کالبدشکافی ↓",
      "l3d.a2.tag": "سخت‌افزار صنعتی و ماتریس سنسورها",
      "l3d.a2.title": "معماری ۴ لایه ردیاب؛ انتخاب بر اساس خروجی در MyFarzam",
      "l3d.a2.desc": "روی هر لایه کلیک کنید تا قطعه متناظر در مدل سه‌بعدی برجسته شود و نقش آن در تولید داده‌ها و گزارش‌های MyFarzam را ببینید.",
      "l3d.a2.c0": "آنتن GNSS",
      "l3d.a2.c1": "SIM و حافظه آفلاین",
      "l3d.a2.c2": "باتری پشتیبان",
      "l3d.a2.c3": "درگاه ACC / دما / سوخت",
      "l3d.a2.k1": "کلاس سازمانی ACC",
      "l3d.a2.k2": "کلاس زنجیره سرد و سوخت",
      "l3d.a2.k3": "کلاس خودروی شخصی",
      "l3d.a2.link": "کاتالوگ ردیاب‌ها و جدول تناظر فنی ←",
      "l3d.a3.tag": "نقشه زنده، محدوده مجاز (Geofence) و صنایع",
      "l3d.a3.title": "پایش فضایی ناوگان در ۴ سناریوی واقعی",
      "l3d.a3.desc": "هر واحد را انتخاب کنید تا خودروی متناظر در شهر سه‌بعدی ردیابی شود؛ شامل مدیریت گروه‌ها، حصار جغرافیایی با سقف سرعت و اشتراک سازمانی یا شخصی.",
      "l3d.a3.u0": "پخش مویرگی",
      "l3d.a3.u1": "زنجیره سرد",
      "l3d.a3.u2": "ترانزیت سنگین",
      "l3d.a3.u3": "خودروی شخصی",
      "l3d.a3.lblSpeed": "سرعت و وضعیت",
      "l3d.a3.lblZone": "محدوده و گروه",
      "l3d.a3.lblSensor": "تله‌متری فعال",
      "l3d.a3.lblReport": "گزارش کلیدی",
      "l3d.a3.link": "شبیه‌ساز زنده، گروه‌ها و محدوده‌ها ←",
      "l3d.a4.tag": "داشبورد MyFarzam · اعلان‌ها · ۹ گزارش Excel",
      "l3d.a4.title": "از KPIهای لحظه‌ای تا ۹ گزارش آماده حسابرسی",
      "l3d.a4.desc": "دسترسی از طریق وب، موبایل و API؛ همراه با ۳ دسته اعلان (هشدار، نگهداری، سیستم) و ماتریس سه‌بعدی ۹ گزارش با خروجی مستقیم Excel:",
      "l3d.r0": "پیمایش",
      "l3d.r1": "رویداد",
      "l3d.r2": "روزانه",
      "l3d.r3": "عملکرد",
      "l3d.r4": "توقف",
      "l3d.r5": "سفر",
      "l3d.r6": "محدوده",
      "l3d.r7": "حرارتی",
      "l3d.r8": "دما",
      "l3d.ben1": "امنیت ۲۴/۷",
      "l3d.ben2": "کاهش سوخت",
      "l3d.ben3": "بهینه‌سازی مسیر",
      "l3d.ben4": "تخمین دقیق ETA",
      "l3d.a4.link": "بررسی کامل داشبورد، ۹ گزارش و مزایا ←",
      "l3d.a5.tag": "توسعه بومی، وب‌سرویس API و استقرار سازمانی",
      "l3d.a5.title": "مالکیت کامل کد منبع؛ یکپارچه با ERP سازمان شما",
      "l3d.a5.desc": "برخلاف پنل‌های ترجمه‌شده، هسته MyFarzam بومی است؛ پروتکل ردیاب‌های قبلی شما را پوشش می‌دهد و طی ۴ گام استاندارد در سازمان مستقر می‌شود:",
      "l3d.a5.tabApi": "توسعه اختصاصی و API دوطرفه",
      "l3d.a5.tabSteps": "نقشه راه ۴ گام استقرار",
      "l3d.a5.n0t": "اتصال دوطرفه به ERP",
      "l3d.a5.n0d": "تبادل خودکار پیمایش، حضور در محدوده و سوخت با سیستم مالی و حواله بار",
      "l3d.a5.n1t": "گزارش و قوانین سفارشی",
      "l3d.a5.n1d": "طراحی فرمول‌های خاص شیفت، پیمانکاری و خروجی اکسل منطبق با حسابرسی",
      "l3d.a5.n2t": "پروتکل ردیاب‌های موجود",
      "l3d.a5.n2d": "یکپارچه‌سازی سخت‌افزارهای قبلی ناوگان شما در هسته مرکزی MyFarzam",
      "l3d.a5.n3t": "استقرار و پشتیبانی بومی",
      "l3d.a5.n3d": "تقویم شمسی، RTL استاندارد، سطوح دسترسی و رصد سلامت اتصال سیم‌کارت‌ها",
      "l3d.a5.link1": "توسعه اختصاصی و API ←",
      "l3d.a5.link2": "درباره آتی‌فرزام",
      "l3d.a6.tag": "شروع همکاری · دموی زنده و پیش‌فاکتور",
      "l3d.a6.title": "دقت در هر نقطه، آرامش در مدیریت مسیر",
      "l3d.a6.desc": "مسیر موردنیاز خود را انتخاب کنید تا فرم هماهنگی دموی آنلاین MyFarzam و استعلام قیمت دقیقاً متناسب با ناوگان شما باز شود:",
      "l3d.a6.s1": "سخت‌افزار + نرم‌افزار سازمانی",
      "l3d.a6.s2": "فقط نرم‌افزار MyFarzam",
      "l3d.a6.s3": "توسعه اختصاصی و API",
      "l3d.a6.s4": "ردیاب خودروی شخصی",
      "l3d.a6.cta": "هماهنگی دموی آنلاین و پیش‌فاکتور",
      "l3d.a6.home": "نمای کلاسیک سایت",
      "l3d.a6.top": "ابتدای مسیر ↑",
      "l3d.dock.0": "معرفی",
      "l3d.dock.1": "سخت‌افزار",
      "l3d.dock.2": "نقشه و صنایع",
      "l3d.dock.3": "۹ گزارش",
      "l3d.dock.4": "API و استقرار",
      "l3d.dock.5": "دمو",
    },
    en: {
      "l3d.nav3d": "3D View",
      "l3d.a1.tag": "Integrated 3D Telemetry Ecosystem",
      "l3d.a1.title": "Smart Fleet & Vehicle Tracking",
      "l3d.a1.accent": "AtiFarzam",
      "l3d.a1.desc": "Complete fleet management for corporate fleets and private vehicles in one 3D glance — from industrial trackers and sensors to the MyFarzam platform, 9 Excel reports, and two-way API integration.",
      "l3d.a1.p1": "Tracker & Sensors",
      "l3d.a1.p2": "Monitoring & 9 Reports",
      "l3d.a1.p3": "Custom Dev & API",
      "l3d.a1.m1": "Audit-ready analytical reports",
      "l3d.a1.m2": "GPS/GLONASS satellite accuracy",
      "l3d.a1.m3": "3 smart alert tiers",
      "l3d.a1.cta": "Request Demo & Pricing",
      "l3d.a1.scroll": "Scroll down · Hardware teardown ↓",
      "l3d.a2.tag": "Industrial Hardware & Sensor Matrix",
      "l3d.a2.title": "4-Layer Tracker Architecture — Choose by Output in MyFarzam",
      "l3d.a2.desc": "Click any layer to highlight the matching piece in the 3D model and see its role in generating data and reports in MyFarzam.",
      "l3d.a2.c0": "GNSS Patch Antenna",
      "l3d.a2.c1": "SIM & Offline Flash",
      "l3d.a2.c2": "Backup Battery",
      "l3d.a2.c3": "ACC / Temp / Fuel Ports",
      "l3d.a2.k1": "Fleet ACC class",
      "l3d.a2.k2": "Cold-chain & Fuel class",
      "l3d.a2.k3": "Personal vehicle class",
      "l3d.a2.link": "Tracker catalogue & technical matrix ←",
      "l3d.a3.tag": "Live Map, Geofence & Industries",
      "l3d.a3.title": "Fleet Spatial Monitoring in 4 Real Scenarios",
      "l3d.a3.desc": "Select any unit to track the matching vehicle in the 3D city — including group management, geofence with speed limit, and organizational or personal sharing.",
      "l3d.a3.u0": "B2B Distribution",
      "l3d.a3.u1": "Cold Chain",
      "l3d.a3.u2": "Heavy Transit",
      "l3d.a3.u3": "Personal",
      "l3d.a3.lblSpeed": "Speed & Status",
      "l3d.a3.lblZone": "Zone & Group",
      "l3d.a3.lblSensor": "Active Telemetry",
      "l3d.a3.lblReport": "Key Report",
      "l3d.a3.link": "Live simulator, groups & geofences ←",
      "l3d.a4.tag": "MyFarzam Dashboard · Alerts · 9 Excel Reports",
      "l3d.a4.title": "From Live KPIs to 9 Audit-Ready Excel Reports",
      "l3d.a4.desc": "Access via web, mobile and API — plus 3 alert categories (Alerts, Maintenance, System) and a 3D 9-report matrix with direct Excel export:",
      "l3d.r0": "Route",
      "l3d.r1": "Event",
      "l3d.r2": "Daily",
      "l3d.r3": "Performance",
      "l3d.r4": "Stop",
      "l3d.r5": "Trip",
      "l3d.r6": "Geofence",
      "l3d.r7": "Heatmap",
      "l3d.r8": "Temperature",
      "l3d.ben1": "24/7 Security",
      "l3d.ben2": "Fuel Savings",
      "l3d.ben3": "Route Optimization",
      "l3d.ben4": "Accurate ETA",
      "l3d.a4.link": "Full dashboard, 9 reports & benefits ←",
      "l3d.a5.tag": "In-house R&D, Web API & Enterprise Rollout",
      "l3d.a5.title": "Full Source Ownership — Integrated with Your ERP",
      "l3d.a5.desc": "Unlike translated panels, the MyFarzam core is indigenous; it covers your existing tracker protocols and deploys in your organisation through 4 standard steps:",
      "l3d.a5.tabApi": "Custom Dev & Two-Way API",
      "l3d.a5.tabSteps": "4-Step Deployment Roadmap",
      "l3d.a5.n0t": "Two-Way ERP Integration",
      "l3d.a5.n0d": "Automatic exchange of mileage, geofence presence and fuel with finance & billing systems.",
      "l3d.a5.n1t": "Custom Reports & Rules",
      "l3d.a5.n1d": "Shift-specific formulas, subcontracting and audit-compliant Excel output.",
      "l3d.a5.n2t": "Existing Tracker Protocols",
      "l3d.a5.n2d": "Integrate your fleet's legacy hardware into the central MyFarzam core.",
      "l3d.a5.n3t": "Local Deployment & Support",
      "l3d.a5.n3d": "Solar calendar, standard RTL, access levels and SIM-connection health monitoring.",
      "l3d.a5.link1": "Custom Dev & API ←",
      "l3d.a5.link2": "About AtiFarzam",
      "l3d.a6.tag": "Start Partnership · Live Demo & Quote",
      "l3d.a6.title": "Precision at Every Point, Calm in Managing the Route",
      "l3d.a6.desc": "Choose your path so the MyFarzam online demo coordination form and tailored quotation open exactly for your fleet:",
      "l3d.a6.s1": "Hardware + Enterprise Software",
      "l3d.a6.s2": "MyFarzam Software Only",
      "l3d.a6.s3": "Custom Dev & API",
      "l3d.a6.s4": "Personal Vehicle Tracker",
      "l3d.a6.cta": "Book Online Demo & Quote",
      "l3d.a6.home": "Classic Site View",
      "l3d.a6.top": "Back to Top ↑",
      "l3d.dock.0": "Intro",
      "l3d.dock.1": "Hardware",
      "l3d.dock.2": "Map & Industries",
      "l3d.dock.3": "9 Reports",
      "l3d.dock.4": "API & Deploy",
      "l3d.dock.5": "Demo",
    },
    ar: {
      "l3d.nav3d": "عرض ثلاثي الأبعاد",
      "l3d.a1.tag": "نظام التتبع المتكامل ثلاثي الأبعاد",
      "l3d.a1.title": "التتبع الذكي وإدارة الأسطول",
      "l3d.a1.accent": "آتي فرزام",
      "l3d.a1.desc": "نظام إدارة كامل للأسطول للمؤسسات والمركبات الشخصية في نظرة ثلاثية الأبعاد واحدة؛ من أجهزة التتبع الصناعية وأجهزة الاستشعار المتخصصة إلى منصة MyFarzam، وتقارير Excel، واتصال API ثنائي الاتجاه.",
      "l3d.a1.p1": "جهاز التتبع وأجهزة الاستشعار",
      "l3d.a1.p2": "المراقبة و٩ تقارير",
      "l3d.a1.p3": "التطوير المخصص وAPI",
      "l3d.a1.m1": "تقارير تحليلية جاهزة للمراجعة",
      "l3d.a1.m2": "دقة تحديد المواقع GPS/GLONASS",
      "l3d.a1.m3": "٣ مستويات تنبيه ذكية",
      "l3d.a1.cta": "طلب عرض توضيحي وسعر",
      "l3d.a1.scroll": "مرر للأسفل · تفكيك hardware ↓",
      "l3d.a2.tag": "المصفوفة الصناعية لأجهزة التتبع وأجهزة الاستشعار",
      "l3d.a2.title": "هندسة التتبع المكونة من ٤ طبقات؛ الاختيار حسب المخرجات في MyFarzam",
      "l3d.a2.desc": "انقر على أي طبقة لتسليط الضوء على القطعة المطابقة في النموذج ثلاثي الأبعاد ومعرفة دورها في توليد البيانات والتقارير في MyFarzam.",
      "l3d.a2.c0": "هوائي GNSS لاصق",
      "l3d.a2.c1": "بطاقة SIM وذاكرة غير متصلة",
      "l3d.a2.c2": "بطارية احتياطية",
      "l3d.a2.c3": "منافذ ACC / درجة حرارة / وقود",
      "l3d.a2.k1": "فئة الأسطول ACC",
      "l3d.a2.k2": "فئة سلسلة التبريد والوقود",
      "l3d.a2.k3": "فئة المركبة الشخصية",
      "l3d.a2.link": "كتالوج أجهزة التتبع والمصفوفة الفنية ←",
      "l3d.a3.tag": "الخريطة الحية والمنطقة المسموحة والصناعات",
      "l3d.a3.title": "مراقبة الأسطول مكانياً في ٤ سيناريوهات واقعية",
      "l3d.a3.desc": "حدد أي وحدة لتتبع المركبة المطابقة في المدينة ثلاثية الأبعاد؛ بما في ذلك إدارة المجموعات والمنطقة الجغرافية بسقف السرعة والمشاركة المؤسسية أو الشخصية.",
      "l3d.a3.u0": "التوزيع B2B",
      "l3d.a3.u1": "سلسلة التبريد",
      "l3d.a3.u2": "العبور الثقيل",
      "l3d.a3.u3": "الشخصية",
      "l3d.a3.lblSpeed": "السرعة والحالة",
      "l3d.a3.lblZone": "المجموعة والمنطقة",
      "l3d.a3.lblSensor": "القياس عن بُعد النشط",
      "l3d.a3.lblReport": "التقرير الرئيسي",
      "l3d.a3.link": "المحاكي المباشر والمجموعات والمناطق ←",
      "l3d.a4.tag": "لوحة MyFarzam · التنبيهات · ٩ تقارير Excel",
      "l3d.a4.title": "من مؤشرات الأداء الرئيسية اللحظية إلى ٩ تقارير Excel جاهزة للمراجعة",
      "l3d.a4.desc": "الوصول عبر الويب والجوال وواجهة برمجة التطبيقات؛ بالإضافة إلى ٣ فئات تنبيه (تنبيه، صيانة، نظام) ومصفوفة ثلاثية الأبعاد من ٩ تقارير مع تصدير مباشر إلى Excel:",
      "l3d.r0": "المسار",
      "l3d.r1": "الحدث",
      "l3d.r2": "اليومي",
      "l3d.r3": "الأداء",
      "l3d.r4": "التوقف",
      "l3d.r5": "الرحلة",
      "l3d.r6": "النطاق الجغرافي",
      "l3d.r7": "خريطة الحرارة",
      "l3d.r8": "درجة الحرارة",
      "l3d.ben1": "أمان على مدار الساعة",
      "l3d.ben2": "توفير الوقود",
      "l3d.ben3": "تحسين المسار",
      "l3d.ben4": "تقدير دقيق لوصول",
      "l3d.a4.link": "لوحة التحكم الكاملة و٩ تقارير ومزايا ←",
      "l3d.a5.tag": "التطوير المحلي وواجهة برمجة التطبيقات والنشر المؤسسي",
      "l3d.a5.title": "ملكية كاملة للكود المصدري؛ متكامل مع نظام تخطيط موارد المؤسسات لديك",
      "l3d.a5.desc": "على عكس اللوحات المترجمة، نواة MyFarzam محلية؛ تغطي بروتوكولات أجهزة التتبع السابقة لديك وتنشر في مؤسستك عبر ٤ خطوات معيارية:",
      "l3d.a5.tabApi": "التطوير المخصص وAPI ثنائي الاتجاه",
      "l3d.a5.tabSteps": "خارطة طريق النشر المكونة من ٤ خطوات",
      "l3d.a5.n0t": "التكامل ثنائي الاتجاه مع تخطيط موارد المؤسسات",
      "l3d.a5.n0d": " intercambio تلقائي للمسافة، والحضور في النطاق الجغرافي، والوقود مع نظم التمويل والفوترة.",
      "l3d.a5.n1t": "تقارير وقوانين مخصصة",
      "l3d.a5.n1d": "تصميم صيغ خاصة بنوبات العمل، والمقاولات ومخرجات Excel مطابقة للمراجعة.",
      "l3d.a5.n2t": "بروتوكولات أجهزة التتبع الحالية",
      "l3d.a5.n2d": "تكامل أجهزة تتبع أسطولك الحالية في النواة المركزية لـ MyFarzam.",
      "l3d.a5.n3t": "النشر والدعم المحلي",
      "l3d.a5.n3d": "التقويم الشمسي، وRTL قياسي، ومستويات الوصول ورصد صحة اتصال بطاقة SIM.",
      "l3d.a5.link1": "التطوير المخصص وAPI ←",
      "l3d.a5.link2": "عن آتي فرزام",
      "l3d.a6.tag": "بدء الشراكة · عرض توضيحي مباشر وعرض سعر",
      "l3d.a6.title": "الدقة في كل نقطة، والهدوء في إدارة المسار",
      "l3d.a6.desc": "اختر مسارك المطلوب لفتح نموذج تنسيق العرض التوضيحي المباشر لـ MyFarzam واستعلامات السعر المخصصة لأسطولك تمامًا:",
      "l3d.a6.s1": "الأجهزة + البرامج المؤسسية",
      "l3d.a6.s2": "برنامج MyFarzam فقط",
      "l3d.a6.s3": "التطوير المخصص وAPI",
      "l3d.a6.s4": "جهاز تتبع مركبة شخصية",
      "l3d.a6.cta": "حجز عرض توضيحي مباشر وعرض سعر",
      "l3d.a6.home": "عرض الموقع الكلاسيكي",
      "l3d.a6.top": "العودة إلى الأعلى ↑",
      "l3d.dock.0": "مقدمة",
      "l3d.dock.1": "الأجهزة",
      "l3d.dock.2": "الخريطة والصناعات",
      "l3d.dock.3": "٩ تقارير",
      "l3d.dock.4": "API والنشر",
      "l3d.dock.5": "العرض التوضيحي",
    },
  };


  /* ------------------------------------------------------------------ */
  /*  DOM & UTIL HELPERS */
  /* ------------------------------------------------------------------ */
  function $id(id) { return document.getElementById(id); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function isRTL() { return document.documentElement.dir === "rtl"; }
  function isMobile() { return window.innerWidth <= 920; }
  function getLang() {
    return document.documentElement.lang || (currentLangGlobal != null ? currentLangGlobal : "fa");
  }
  function t(key) {
    var lang = getLang();
    var dict = L3D_I18N && L3D_I18N[lang];
    if (dict && dict[key] !== undefined) return dict[key];
    if (window.I18N && window.I18N[lang] && window.I18N[lang][key] !== undefined) {
      return window.I18N[lang][key];
    }
    return key;
  }

  function getScrollTop() {
    var se = document.scrollingElement || document.documentElement;
    return Math.max(
      window.scrollY || 0, window.pageYOffset || 0,
      se ? se.scrollTop || 0 : 0,
      document.documentElement ? document.documentElement.scrollTop || 0 : 0,
      document.body ? document.body.scrollTop || 0 : 0
    );
  }
  function getMaxScroll() {
    var se = document.scrollingElement || document.documentElement;
    var docH = Math.max(
      se ? se.scrollHeight || 0 : 0,
      document.documentElement ? document.documentElement.scrollHeight || 0 : 0,
      document.body ? document.body.scrollHeight || 0 : 0
    );
    return Math.max(1, docH - window.innerHeight);
  }
  function ease(t) { return t * t * (3 - 2 * t); } // smoothstep
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ------------------------------------------------------------------ */
  /*  WEBGL DETECTION */
  /* ------------------------------------------------------------------ */
  function webglAvailable() {
    var canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  }

  /* ------------------------------------------------------------------ */
  /*  THREE.WORLD STATE */
  /* ------------------------------------------------------------------ */
  var scene, camera, renderer, clock, envMap, raycaster, pointer;
  var groups = [];            // per-zone groups
  var pins = [];              // {el, worldPos, langKeys:{fa,en,ar}, category}
  var satellites = [];        // {mesh, radius, angle, speed, height, baseY}
  var vehicles = [];          // {mesh, curve, time, speed, lane}
  var zoneHighlights = [];    // {mesh, origEmissive, origColor} for chip interaction
  var activeZone = 0;
  var smoothScrollProg = 0;   // 0..1 damped
  var targetScrollProg = 0;
  var pointer = new THREE.Vector2(0, 0);
  var isFallback = false;
  var worldLabelsEl;

  /* ------------------------------------------------------------------ */
  /*  MATERIAL FACTORY */
  /* ------------------------------------------------------------------ */
  function makeEnvMap() {
    var size = 256;
    var canvas = document.createElement("canvas");
    canvas.width = size * 2;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    var grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, "#dce1e8");
    grad.addColorStop(1, "#102333");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size * 2, size);
    ctx.fillStyle = "#102333";
    ctx.fillRect(0, size, size * 2, size);
    var tex = new THREE.CanvasTexture(canvas);
    var pmrem = new THREE.PMREMGenerator(renderer);
    var env = pmrem.generateFromEquirectangular(tex).texture;
    tex.dispose();
    try { pmrem.dispose(); } catch (e) {}
    return env;
  }

  function matNavy() {
    return new THREE.MeshPhysicalMaterial({
      color: C_NAVY, metalness: 0.7, roughness: 0.22, envMap: envMap, envMapIntensity: 0.9
    });
  }
  function matOrange() {
    return new THREE.MeshPhysicalMaterial({
      color: C_ORANGE, metalness: 0.5, roughness: 0.3, envMap: envMap, envMapIntensity: 0.9
    });
  }
  function matCream() {
    return new THREE.MeshPhysicalMaterial({
      color: C_CREAM, metalness: 0.25, roughness: 0.5, envMap: envMap, envMapIntensity: 0.6
    });
  }
  function matGlass() {
    return new THREE.MeshPhysicalMaterial({
      color: C_WHITE, metalness: 0.1, roughness: 0.1, transparent: true,
      opacity: 0.75, transmission: 0.55, thickness: 0.6, envMap: envMap, envMapIntensity: 0.6
    });
  }
  function matEmissive(hex, intensity) {
    var m = new THREE.MeshBasicMaterial({ color: hex });
    m.emissive = new THREE.Color(hex);
    m.emissiveIntensity = intensity || 1;
    return m;
  }

  /* ------------------------------------------------------------------ */
  /*  HELPER: centered extrude from SVG path string */
  /* ------------------------------------------------------------------ */
  /* Minimal SVG path parser -> THREE.Shape (handles M/m, L/l, H/h, V/v, C/c, S/s, Q/q, Z/z) */
  function parseSVGPath(d) {
    var tokens = d.match(/[A-Za-z]|[-+]?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi) || [];
    var shape = new THREE.Shape();
    var i = 0, n = tokens.length;
    var x = 0, y = 0;
    var prevCx = 0, prevCy = 0;
    while (i < n) {
      var cmd = tokens[i++];
      if (cmd === "M" || cmd === "m") {
        x = +tokens[i] + (cmd === "m" ? x : 0);
        y = +tokens[i + 1] + (cmd === "m" ? y : 0);
        shape.moveTo(x, y); i += 2;
      } else if (cmd === "L" || cmd === "l") {
        x = +tokens[i] + (cmd === "l" ? x : 0);
        y = +tokens[i + 1] + (cmd === "l" ? y : 0);
        shape.lineTo(x, y); i += 2;
      } else if (cmd === "H" || cmd === "h") {
        x = cmd === "h" ? x + +tokens[i] : +tokens[i];
        shape.lineTo(x, y); i += 1;
      } else if (cmd === "V" || cmd === "v") {
        y = cmd === "v" ? y + +tokens[i] : +tokens[i];
        shape.lineTo(x, y); i += 1;
      } else if (cmd === "C" || cmd === "c") {
        var x1 = +tokens[i], y1 = +tokens[i + 1];
        var x2 = +tokens[i + 2], y2 = +tokens[i + 3];
        var x3 = +tokens[i + 4], y3 = +tokens[i + 5];
        if (cmd === "c") { x1 += x; y1 += y; x2 += x; y2 += y; x3 += x; y3 += y; }
        shape.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        prevCx = x2; prevCy = y2; x = x3; y = y3; i += 6;
      } else if (cmd === "S" || cmd === "s") {
        var c1x = 2 * x - prevCx, c1y = 2 * y - prevCy;
        var x2 = +tokens[i], y2 = +tokens[i + 1];
        var x3 = +tokens[i + 2], y3 = +tokens[i + 3];
        if (cmd === "s") { x2 += x; y2 += y; x3 += x; y3 += y; }
        shape.bezierCurveTo(c1x, c1y, x2, y2, x3, y3);
        prevCx = x2; prevCy = y2; x = x3; y = y3; i += 4;
      } else if (cmd === "Q" || cmd === "q") {
        var x1 = +tokens[i], y1 = +tokens[i + 1];
        var x2 = +tokens[i + 2], y2 = +tokens[i + 3];
        if (cmd === "q") { x1 += x; y1 += y; x2 += x; y2 += y; }
        shape.quadraticCurveTo(x1, y1, x2, y2);
        x = x2; y = y2; i += 4;
      } else if (cmd === "Z" || cmd === "z") {
        break;
      }
    }
    return shape;
  }

  function centeredExtrude(d, scale, depth, bevel) {
    var shape = parseSVGPath(d);
    if (scale) shape.scale(scale, scale);
    var geo = new THREE.ExtrudeGeometry(shape, {
      depth: depth, bevelEnabled: !!bevel, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3
    });
    var bbox = new THREE.Box3().setFromBufferAttribute(geo.attributes.position);
    var center = new THREE.Vector3();
    bbox.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);
    return geo;
  }

  /* AF_PURE_D (from presentation.js hero logo) */
  var AF_PURE_D =
    "M810.77,440.18c-11.41,196.45-162.4,391.62-247.41,472.15-27.45,28.6-51.13,7.64-51.13-14.47v-448.12c0-18.81-13.94-34.32-32.08-36.76h-170.95c-20.72,0-37.18,16.44-37.18,36.85v447.34c0,16.33-13.23,29.56-29.55,29.56-8.17,0-15.55-3.32-20.91-8.66-5.36-5.34-8.66-12.74-8.66-20.91v-484.19c0-157.84,149.62-315.69,299.23-315.69h269.37c16.33,0,29.56,13.23,29.56,29.55s-13.23,29.56-29.56,29.56h-232.19c-20.72,0-37.18,16.46-37.18,36.87l.09,182.47c0,20.51,16.6,37.11,37.13,37.11h237.35c18.12.44,25.77,13.74,24.06,27.34Z";

  /* ------------------------------------------------------------------ */
  /*  ZONE BUILDERS */
  /* ------------------------------------------------------------------ */

  function buildZone01() {
    var g = new THREE.Group();
    g.position.copy(ZONE_POS[0]);

    // Plinth (coordinate base)
    var plinth = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.34, 2.6), matCream());
    plinth.position.y = -0.56;
    plinth.castShadow = true; plinth.receiveShadow = true;
    g.add(plinth);

    // Coordinate grid on plinth
    var grid = new THREE.GridHelper(2.8, 14, 0x102333, 0x102333);
    grid.material.transparent = true; grid.material.opacity = 0.35;
    grid.position.set(0, -0.38, 0); grid.rotation.x = -Math.PI / 2;
    g.add(grid);

    // AF_PURE_D titanium monolith
    var monoGeo = centeredExtrude(AF_PURE_D, 1 / 240, 0.5, true);
    var monolith = new THREE.Mesh(monoGeo, matNavy());
    monolith.position.y = 0.28;
    monolith.castShadow = true; monolith.receiveShadow = true;
    g.add(monolith);

    // 3 GNSS orbital rings + satellites
    [1.5, 2.7, 4.0].forEach(function (r, i) {
      var ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.018, r + 0.018, 64),
        new THREE.MeshBasicMaterial({ color: C_NAVY, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.18;
      ring.position.y = 1.0;
      ring.renderOrder = 1;
      g.add(ring);

      var sat = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), matOrange());
      sat.position.y = 1.0;
      satellites.push({ mesh: sat, radius: r, angle: i * 2.09, speed: 0.0018 + i * 0.0008, height: 1.0 });
      g.add(sat);
    });

    // 3 solution pillar nodes
    [[-1.55, 0, -1.55], [1.55, 0, -1.55], [0, 0, 2.05]].forEach(function (p) {
      var pillar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.95, 0.26), matCream());
      pillar.position.set(p[0], 0.475, p[2]);
      pillar.castShadow = true; pillar.receiveShadow = true;
      g.add(pillar);
      var cap = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), matOrange());
      cap.position.set(p[0], 0.98, p[2]);
      g.add(cap);
    });

    // Pin: monolith
    addPin(g, { x: 0, y: 1.6, z: 0 },
      { fa: "ضلع ۱ ·کلبد ردیاب · دقت < ۲ متر", en: "Pillar 1 · Tracker Core · <2m Accuracy", ar: "الركيزة ١ · نواة الرصد · دقة < ٢ م" }, "mono");

    scene.add(g);
    groups.push(g);
    return g;
  }

  function buildZone02() {
    var g = new THREE.Group();
    g.position.copy(ZONE_POS[1]);

    var layerNames = [
      { fa: "آنتن GNSS", en: "GNSS Antenna", ar: "هوائي GNSS" },
      { fa: "SIM و حافظه", en: "SIM & Flash", ar: "الشريحة والذاكرة" },
      { fa: "باتری", en: "Battery", ar: "البطارية" },
      { fa: "شاسی و ورودی‌ها", en: "Chassis & I/O", ar: "الشاسيه والمنافذ" },
    ];

    var layers = [];
    var baseY = 0;
    [0.34, 0.5, 0.5, 0.86].forEach(function (h, i) {
      var layer = new THREE.Group();
      var body = new THREE.Mesh(new THREE.BoxGeometry(1.6, h, 1.2), i % 2 === 0 ? matNavy() : matCream());
      body.position.y = h / 2;
      body.castShadow = true; body.receiveShadow = true;
      layer.add(body);

      // I/O ports on bottom layer
      if (i === 3) {
        ["ACC", "T", "F", "V"].forEach(function (port, j) {
          var portMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 8), matOrange());
          portMesh.rotation.z = Math.PI / 2;
          portMesh.position.set(-0.6 + j * 0.4, h / 2, 0.65);
          layer.add(portMesh);
        });
      }

      layer.position.y = baseY + h / 2;
      baseY += h + 0.06; // gap
      g.add(layer);
      layers.push(layer);

      addPin(g, { x: 0, y: baseY - 0.06 + 1.2, z: 1.4 }, layerNames[i], "hw" + i);
    });

    // Store layers for chip interaction
    g.userData.layers = layers;
    g.userData.layerNames = layerNames;

    scene.add(g);
    groups.push(g);
    return g;
  }

  function buildZone03() {
    var g = new THREE.Group();
    g.position.copy(ZONE_POS[2]);

    // Ground plane
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), matCream());
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    g.add(ground);

    // Mini city buildings
    var city = new THREE.Group();
    for (var bx = -16; bx <= 16; bx += 4) {
      for (var bz = -16; bz <= 16; bz += 4) {
        if (Math.abs(bx) < 2 && Math.abs(bz) < 2) continue; // center highway
        var h = 0.4 + Math.random() * 1.4;
        var b = new THREE.Mesh(new THREE.BoxGeometry(2.6, h, 2.6), matNavy());
        b.position.set(bx, h / 2, bz);
        b.castShadow = true; b.receiveShadow = true;
        city.add(b);
      }
    }
    g.add(city);

    // Highway interchange (curved ribbons)
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, 0.06, -10), new THREE.Vector3(-6, 0.06, 0),
      new THREE.Vector3(0, 0.06, 6), new THREE.Vector3(6, 0.06, 0),
      new THREE.Vector3(6, 0.06, -10)
    ]);
    var tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, 0.32, 8, false),
      new THREE.MeshPhysicalMaterial({ color: C_NAVY, metalness: 0.6, roughness: 0.25, envMap: envMap, envMapIntensity: 0.8 })
    );
    tube.castShadow = true; tube.receiveShadow = true;
    g.add(tube);

    // Glowing 3D Geofence (60 km/h) — torus ring
    var geofence = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.14, 16, 64),
      new THREE.MeshBasicMaterial({ color: C_ORANGE, transparent: true, opacity: 0.85 })
    );
    geofence.rotation.x = Math.PI / 2;
    geofence.position.set(0, 0.28, 0);
    geofence.userData.glow = true;
    g.add(geofence);

    addPin(g, { x: 0, y: 2.2, z: 0 },
      { fa: "حصار جغرافیایی · ۶۰ km/h", en: "Geofence · 60 km/h", ar: "النطاق الجغرافي · ٦٠ كم/ساعة" }, "geofence");

    // 4 vehicles on splines
    var splines = [
      new THREE.CatmullRomCurve3([new THREE.Vector3(-14, 0.18, -12), new THREE.Vector3(-4, 0.18, 4), new THREE.Vector3(14, 0.18, -12)]),
      new THREE.CatmullRomCurve3([new THREE.Vector3(14, 0.18, -6), new THREE.Vector3(4, 0.18, 10), new THREE.Vector3(-14, 0.18, -6)]),
      new THREE.CatmullRomCurve3([new THREE.Vector3(-10, 0.18, 14), new THREE.Vector3(0, 0.18, 6), new THREE.Vector3(10, 0.18, 14)]),
      new THREE.CatmullRomCurve3([new THREE.Vector3(10, 0.18, -14), new THREE.Vector3(0, 0.18, -8), new THREE.Vector3(-10, 0.18, -14)]),
    ];
    var vehicleColors = [C_NAVY, C_ORANGE, 0x2c4a66, 0x6b8cae];
    var vehicleLabels = [
      { fa: "واحد ۱۰۴ · توزیع", en: "Unit 104 · Distribution", ar: "الوحدة ١٠٤ · التوزيع" },
      { fa: "واحد ۲۰۸ ·냉동", en: "Unit 208 · Cold Chain", ar: "الوحدة ٢٠٨ · سلسلة التبريد" },
      { fa: "واحد ۳۱۲ · ترانزیت", en: "Unit 312 · Heavy Transit", ar: "الوحدة ٣١٢ · العبور الثقيل" },
      { fa: "واحد ۴۰۱ · شخصی", en: "Unit 401 · Personal", ar: "الوحدة ٤٠١ · شخصي" },
    ];
    splines.forEach(function (spline, i) {
      var v = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.1), new THREE.MeshPhysicalMaterial({ color: vehicleColors[i], metalness: 0.5, roughness: 0.35, envMap: envMap, envMapIntensity: 0.8 }));
      v.castShadow = true; v.receiveShadow = true;
      v.userData.spline = spline;
      v.userData.time = i * 0.25;
      v.userData.speed = 0.0012 + i * 0.0004;
      vehicles.push({ mesh: v, curve: spline, time: i * 0.25, speed: v.userData.speed, lane: i });
      g.add(v);
      addPin(g, { x: 0, y: 1.5, z: 0 }, vehicleLabels[i], "unit" + i, v);
    });

    scene.add(g);
    groups.push(g);
    return g;
  }

  function buildZone04() {
    var g = new THREE.Group();
    g.position.copy(ZONE_POS[3]);

    // KPI pillars: 248 total, 214 online, 189 moving
    var kpis = [
      { val: "248", lab: { fa: "کل دستگاه‌ها", en: "Total Devices", ar: "إجمالي الأجهزة" } },
      { val: "214", lab: { fa: "دستگاه‌های آنلاین", en: "Online Devices", ar: "الأجهزة المتصلة" } },
      { val: "189", lab: { fa: "در حال حرکت", en: "Moving Devices", ar: "الأجهزة المتحركة" } },
    ];
    kpis.forEach(function (k, i) {
      var col = new THREE.Group();
      var pillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.6, 1.4), matNavy());
      pillar.position.y = 1.8;
      pillar.castShadow = true; pillar.receiveShadow = true;
      col.add(pillar);
      var top = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), matOrange());
      top.position.y = 3.85;
      col.add(top);
      col.position.set(-3.6 + i * 3.6, 0, 0);
      g.add(col);
      addPin(g, { x: -3.6 + i * 3.6, y: 4.7, z: 1.2 }, { fa: k.val + " · " + k.lab.fa, en: k.val + " · " + k.lab.en, ar: k.val + " · " + k.lab.ar }, "kpi" + i);
    });

    // 7/14/30d ribbon chart (extruded ribbon bars)
    [7, 14, 30].forEach(function (d, i) {
      var h = 0.6 + d / 60;
      var ribbon = new THREE.Mesh(new THREE.BoxGeometry(1.1, h, 0.5), matCream());
      ribbon.position.set(4.6 + i * 1.6, h / 2, 1.0);
      ribbon.castShadow = true; ribbon.receiveShadow = true;
      g.add(ribbon);
      addPin(g, { x: 4.6 + i * 1.6, y: h + 0.8, z: 1.4 }, { fa: d + " روزه", en: d + "-Day Ribbon", ar: d + " يومًا" }, "ribbon" + i);
    });

    // Heatmap contour plane
    var heat = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({
      color: C_ORANGE, transparent: true, opacity: 0.25, side: THREE.DoubleSide
    }));
    heat.rotation.x = -Math.PI / 2;
    heat.position.set(-1.0, 0.06, -2.2);
    g.add(heat);

    // 3 notification beacons
    ["alert", "maintenance", "system"].forEach(function (b, i) {
      var beacon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), matEmissive(i === 0 ? C_ORANGE : 0x102333, 1.2));
      beacon.position.set(-4.2 + i * 2.1, 1.6, 2.4);
      beacon.userData.beacon = true;
      g.add(beacon);
      addPin(g, { x: -4.2 + i * 2.1, y: 2.4, z: 3.0 }, { fa: "اعلان " + (i + 1), en: "Alert " + (i + 1), ar: "تنبيه " + (i + 1) }, "beacon" + i, beacon);
    });

    // 3x3 report matrix (flat tiles)
    var reportTitles = [
      { fa: "پیمایش", en: "Route", ar: "المسار" },
      { fa: "رویداد", en: "Event", ar: "الحدث" },
      { fa: "روزانه", en: "Daily", ar: "اليومي" },
      { fa: "عملکرد", en: "Performance", ar: "الأداء" },
      { fa: "توقف", en: "Stop", ar: "التوقف" },
      { fa: "سفر", en: "Trip", ar: "الرحلة" },
      { fa: "محدوده", en: "Geofence", ar: "النطاق" },
      { fa: "حرارتی", en: "Heatmap", ar: "الحرارة" },
      { fa: "دما", en: "Temperature", ar: "درجة الحرارة" },
    ];
    reportTitles.forEach(function (rt, i) {
      var tile = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.18, 1.05), i % 2 === 0 ? matCream() : matNavy());
      tile.position.set(-1.05 + (i % 3) * 1.12, 0.2, -5.0 + Math.floor(i / 3) * 1.12);
      tile.castShadow = true; tile.receiveShadow = true;
      g.add(tile);
      addPin(g, { x: tile.position.x, y: 1.0, z: tile.position.z }, rt, "rep" + i, tile);
    });

    // 3D XLSX prism
    var xlsx = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 0.7), matGlass());
    xlsx.position.set(4.2, 0.8, -5.2);
    xlsx.castShadow = true; xlsx.receiveShadow = true;
    g.add(xlsx);
    addPin(g, { x: 4.2, y: 2.2, z: -5.2 }, { fa: "خروجی Excel (.XLSX)", en: "Excel Export (.XLSX)", ar: "تصدير Excel" }, "xlsx", xlsx);

    scene.add(g);
    groups.push(g);
    return g;
  }

  function buildZone05() {
    var g = new THREE.Group();
    g.position.copy(ZONE_POS[4]);

    // Indigenous R&D core cube
    var core = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2.4), matNavy());
    core.position.set(0, 1.2, 0);
    core.castShadow = true; core.receiveShadow = true;
    g.add(core);
    var coreWire = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2.5, 2.5),
      new THREE.MeshBasicMaterial({ color: C_ORANGE, wireframe: true, transparent: true, opacity: 0.4 })
    );
    coreWire.position.set(0, 1.2, 0);
    g.add(coreWire);
    addPin(g, { x: 0, y: 2.8, z: 0 }, { fa: "هسته بومی MyFarzam", en: "MyFarzam Indigenous Core", ar: "النواة المحلية MyFarzam" }, "core", core);

    // 4 ERP/API nodes with bidirectional fiber conduits
    var nodePositions = [
      new THREE.Vector3(-5.5, 0.9, -3.5),
      new THREE.Vector3(5.5, 0.9, -3.5),
      new THREE.Vector3(-5.5, 0.9, 3.5),
      new THREE.Vector3(5.5, 0.9, 3.5),
    ];
    var nodeLabels = [
      { fa: "ERP مالی", en: "Finance ERP", ar: "نظام تخطيط مالي" },
      { fa: "ERP بار", en: "Logistics ERP", ar: "نظام تخطيط لوجستي" },
      { fa: "پروtokol ردیاب", en: "Tracker Protocol", ar: "بروتوكول التتبع" },
      { fa: "داشبورد ERP", en: "ERP Dashboard", ar: "لوحة تخطيط موارد" },
    ];
    nodePositions.forEach(function (np, i) {
      var node = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matCream());
      node.position.copy(np);
      node.castShadow = true; node.receiveShadow = true;
      g.add(node);
      // conduit line core -> node
      var conduit = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.2, 0),
            new THREE.Vector3(np.x * 0.5, 1.6, np.z * 0.5),
            np
          ]), 12, 0.1, 6, false
        ),
        new THREE.MeshPhysicalMaterial({ color: C_ORANGE, metalness: 0.4, roughness: 0.3, envMap: envMap, envMapIntensity: 0.8 })
      );
      conduit.castShadow = true;
      g.add(conduit);
      addPin(g, { x: np.x, y: np.y + 0.9, z: np.z }, nodeLabels[i], "erp" + i, node);
    });

    // 4 stepped deployment milestone plinths
    [0.8, 1.6, 2.6, 3.8].forEach(function (h, i) {
      var plinth = new THREE.Mesh(new THREE.BoxGeometry(1.0, h, 1.0), matNavy());
      plinth.position.set(-4.2 + i * 2.8, h / 2, 6.0);
      plinth.castShadow = true; plinth.receiveShadow = true;
      g.add(plinth);
      addPin(g, { x: -4.2 + i * 2.8, y: h + 0.8, z: 6.0 },
        { fa: "گام " + (i + 1), en: "Step " + (i + 1), ar: "الخطوة " + (i + 1) }, "step" + i, plinth);
    });

    scene.add(g);
    groups.push(g);
    return g;
  }

  function buildZone06() {
    var g = new THREE.Group();
    g.position.copy(ZONE_POS[5]);

    // af crest (flat extruded)
    var crestGeo = centeredExtrude(AF_PURE_D, 1 / 300, 0.18, false);
    var crest = new THREE.Mesh(crestGeo, matOrange());
    crest.position.y = 0.1;
    crest.castShadow = true; crest.receiveShadow = true;
    g.add(crest);

    // CANONICAL_PATH Diagonal Orbit sculpture (4-petal extruded)
    if (CANONICAL_PATH) {
      var orbitGeo = centeredExtrude(CANONICAL_PATH, 1 / 380, 0.5, false);
      var orbit = new THREE.Mesh(orbitGeo, matNavy());
      orbit.position.y = 0.0;
      orbit.castShadow = true; orbit.receiveShadow = true;
      orbit.userData.orbit = true;
      g.add(orbit);

      // petal instances rotating (diagonal orbit)
      var petalGeo = new THREE.BoxGeometry(0.5, 2.6, 0.3);
      for (var k = 0; k < 4; k++) {
        var petal = new THREE.Mesh(petalGeo, matCream());
        petal.position.set(0, 1.3, 0);
        petal.castShadow = true; petal.receiveShadow = true;
        petal.userData.petal = true;
        petal.userData.angle = k * (Math.PI / 2);
        petal.userData.orbitR = 2.2;
        g.add(petal);
      }
    }

    addPin(g, { x: 0, y: 2.6, z: 0 },
      { fa: "رقص قطری Motion #08", en: "Diagonal Orbit Motion #08", ar: "المدار القطري Movement #08" }, "finale");

    scene.add(g);
    groups.push(g);
    return g;
  }

  /* ------------------------------------------------------------------ */
  /*  PIN SYSTEM */
  /* ------------------------------------------------------------------ */
  function addPin(group, worldPos, langKeys, category, attachMesh) {
    var el = document.createElement("div");
    el.className = "l3d-pin";
    el.setAttribute("data-pin-category", category);
    el.textContent = "";
    worldLabelsEl.appendChild(el);
    pins.push({
      el: el,
      world: new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z),
      keys: langKeys || {},
      category: category,
      mesh: attachMesh || null,
    });
  }

  function updatePins() {
    if (!camera || !renderer) return;
    var width = renderer.domElement.clientWidth;
    var height = renderer.domElement.clientHeight;
    var vector = new THREE.Vector3();

    pins.forEach(function (pin) {
      vector.copy(pin.world).project(camera);
      var cx = (vector.x * 0.5 + 0.5) * width;
      var cy = (-(vector.y * 0.5) + 0.5) * height;
      var cz = vector.z; // <1 means in front of camera (after proj)

      var visible = cz < 1 && cz > -1 && cx >= 0 && cx <= width && cy >= 0 && cy <= height;
      var el = pin.el;
      el.style.transform = "translate(" + cx + "px, " + cy + "px)";
      el.style.opacity = visible ? 1 : 0;
      el.style.pointerEvents = visible ? "auto" : "none";

      if (visible) {
        var lang = getLang();
        var label = pin.keys[lang] || pin.keys.fa || "";
        el.textContent = label;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  THREE INIT */
  /* ------------------------------------------------------------------ */
  function initThree() {
    var canvasWrap = $id("l3d-stage-wrap");
    var canvas = $id("l3d-canvas");
    worldLabelsEl = $id("l3d-world-labels");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_HEX);
    scene.fog = new THREE.Fog(BG_HEX, 10, 118);

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0.2, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    envMap = makeEnvMap();

    // Lights
    var ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);
    var hemi = new THREE.HemisphereLight(0xdce1e8, 0x102333, 0.5);
    scene.add(hemi);
    var dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(8, 12, 6);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    dir.shadow.camera.left = -30; dir.shadow.camera.right = 30;
    dir.shadow.camera.top = 30; dir.shadow.camera.bottom = -30;
    scene.add(dir);

    // Build zones
    buildZone01();
    buildZone02();
    buildZone03();
    buildZone04();
    buildZone05();
    buildZone06();

    canvasWrap.appendChild(renderer.domElement); // ensure canvas in wrap (already there)

    clock = new THREE.Clock();
  }

  /* ------------------------------------------------------------------ */
  /*  CAMERA FLIGHT + VIEW OFFSET (RTL/LTR + mobile) */
  /* ------------------------------------------------------------------ */
  function updateCameraFromScroll() {
    if (!camera || !renderer) return;
    var width = renderer.domElement.clientWidth;
    var height = renderer.domElement.clientHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // target scroll progress
    var st = getScrollTop();
    var maxS = getMaxScroll();
    targetScrollProg = Math.max(0, Math.min(1, st / maxS));
    smoothScrollProg += (targetScrollProg - smoothScrollProg) * 0.06;

    var zoneF = smoothScrollProg * 6;
    var zi = Math.min(Math.floor(zoneF), 5);
    var t = Math.max(0, Math.min(1, zoneF - zi));
    var te = ease(t);

    var from = STATIONS[zi];
    var to = STATIONS[Math.min(zi + 1, 5)];
    activeZone = zi;

    // camera position flight
    camera.position.x = lerp(from.pos.x, to.pos.x, te);
    camera.position.y = lerp(from.pos.y, to.pos.y, te);
    camera.position.z = lerp(from.pos.z, to.pos.z, te);

    // look-at target + pointer parallax
    var lx = lerp(from.look.x, to.look.x, te);
    var ly = lerp(from.look.y, to.look.y, te);
    var lz = lerp(from.look.z, to.look.z, te);
    lx += pointer.x * 1.6;
    ly += pointer.y * 1.0;
    camera.lookAt(lx, ly, lz);

    // Optical framing via setViewOffset
    var dirSign = isRTL() ? 1 : -1;
    var cardSide = zi % 2 === 0 ? "left" : "right";
    if (zi === 5) cardSide = "center";

    var offsetX = 0;
    var offsetY = 0;
    if (cardSide === "left") offsetX = -0.21;
    else if (cardSide === "right") offsetX = +0.21;
    offsetX = offsetX * vw * dirSign;
    if (isMobile()) offsetY = +0.19 * vh; // shift upward on mobile

    if (offsetX !== 0 || offsetY !== 0) {
      camera.setViewOffset(vw, vh, offsetX, offsetY, vw, vh);
    } else {
      camera.clearViewOffset();
    }

    // update per-zone animations
    updateZoneAnimations();
    updatePins();
    updateActUI();
    updateDock();

    renderer.render(scene, camera);
  }

  function updateZoneAnimations() {
    var time = clock ? clock.getElapsedTime() : 0;

    // satellites
    satellites.forEach(function (s) {
      s.angle += s.speed;
      var x = Math.cos(s.angle) * s.radius;
      var z = Math.sin(s.angle) * s.radius;
      s.mesh.position.set(x, s.height, z);
    });

    // vehicles
    vehicles.forEach(function (v) {
      v.time += v.speed;
      if (v.time > 1) v.time = 0;
      var pt = v.curve.getPointAt(v.time);
      var nt = v.curve.getPointAt(Math.min(1, v.time + 0.01));
      v.mesh.position.copy(pt);
      v.mesh.lookAt(nt);
      v.mesh.rotation.z = Math.PI / 2; // roll
    });

    // orbit petals (zone 06)
    groups.forEach(function (g) {
      g.traverse(function (obj) {
        if (obj.userData.petal) {
          var a = obj.userData.angle + time * 0.5;
          obj.position.x = Math.cos(a) * obj.userData.orbitR;
          obj.position.z = Math.sin(a) * obj.userData.orbitR;
          obj.rotation.y = a;
        }
        if (obj.userData.orbit) {
          obj.rotation.y = time * 0.25;
        }
      });
    });

    // geofence pulse
    groups.forEach(function (g) {
      g.traverse(function (obj) {
        if (obj.userData.glow) {
          var s = 1 + Math.sin(time * 3) * 0.06;
          obj.scale.set(s, s, s);
          obj.material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
        }
      });
    });

    // beacons pulse
    groups.forEach(function (g) {
      g.traverse(function (obj) {
        if (obj.userData.beacon) {
          var s = 1 + Math.sin(time * 4 + obj.position.x) * 0.15;
          obj.scale.set(s, s, s);
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  ACT / DOCK UI SYNC */
  /* ------------------------------------------------------------------ */
  function updateActUI() {
    var acts = $all(".l3d-act");
    var st = getScrollTop();
    var vh = window.innerHeight;
    acts.forEach(function (act) {
      var top = act.offsetTop || 0;
      var active = st >= top - vh * 0.35 && st < top + vh * 0.65;
      act.classList.toggle("is-active", active);
    });
  }

  function updateDock() {
    var btns = $all(".l3d-dock-btn");
    btns.forEach(function (btn, i) {
      btn.classList.toggle("is-active", i === activeZone);
    });
    var readout = $id("l3d-cam-readout");
    if (readout) readout.textContent = "Z " + Math.round(-camera.position.z) + "m · " + (activeZone + 1) + "/06";
  }

  /* ------------------------------------------------------------------ */
  /*  INTERACTIONS */
  /* ------------------------------------------------------------------ */
  function setupInteractions() {
    // Dock buttons -> scroll to act
    $all(".l3d-dock-btn").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        var act = $id("act-0" + (i + 1));
        if (act) act.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // HW chips (act-02) -> highlight layer
    $all("#l3d-hw-chips .l3d-chip").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        $all("#l3d-hw-chips .l3d-chip").forEach(function (b) { b.classList.remove("is-on"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-on"); btn.setAttribute("aria-selected", "true");
        var g = groups[1];
        if (g && g.userData.layers) {
          g.userData.layers.forEach(function (layer, li) {
            var on = li === i;
            layer.traverse(function (obj) {
              if (obj.isMesh) {
                obj.material.emissive.setHex(on ? C_ORANGE : 0x000000);
                obj.material.emissiveIntensity = on ? 0.6 : 0;
              }
            });
          });
        }
      });
    });

    // Unit chips (act-03) -> highlight vehicle
    $all("#l3d-unit-chips .l3d-chip").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        $all("#l3d-unit-chips .l3d-chip").forEach(function (b) { b.classList.remove("is-on"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-on"); btn.setAttribute("aria-selected", "true");
        var v = vehicles[i];
        if (v) {
          vehicles.forEach(function (vv) { vv.mesh.material.emissive.setHex(0x000000); vv.mesh.material.emissiveIntensity = 0; });
          v.mesh.material.emissive.setHex(C_ORANGE);
          v.mesh.material.emissiveIntensity = 0.8;
        }
      });
    });

    // Report matrix chips (act-04)
    $all("#l3d-rep-matrix .l3d-rep-btn").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        $all("#l3d-rep-matrix .l3d-rep-btn").forEach(function (b) { b.classList.remove("is-on"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-on"); btn.setAttribute("aria-selected", "true");
      });
    });

    // Step list (act-05) -> highlight conduit/plinth
    $all(".l3d-step-list li").forEach(function (li, i) {
      li.addEventListener("click", function () {
        $all(".l3d-step-list li").forEach(function (l) { l.classList.remove("is-on"); });
        li.classList.add("is-on");
      });
    });

    // Pillar jump buttons (act-01)
    $all(".l3d-pillar-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var idx = btn.getAttribute("data-pillar");
        var targets = ["#act-02", "#act-03", "#act-05"];
        if (targets[idx]) document.querySelector(targets[idx]).scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Pointer parallax
    window.addEventListener("pointermove", function (e) {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (e.touches[0]) pointer.set((e.touches[0].clientX / window.innerWidth) * 2 - 1, -(e.touches[0].clientY / window.innerHeight) * 2 + 1);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /*  SCROLL / RESIZE / LOOP */
  /* ------------------------------------------------------------------ */
  function onScroll() {
    if (!isFallback) {
      // rAF-throttled
      if (!window.__l3dRaf) {
        window.__l3dRaf = requestAnimationFrame(updateCameraFromScroll);
      }
    }
  }

  function onResize() {
    if (!camera || !renderer) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    renderer.setSize(vw, vh);
    if (!isFallback) updateCameraFromScroll();
  }

  function animate() {
    if (isFallback) return;
    requestAnimationFrame(animate);
    if (document.hidden) return;
    // continuous render even when not scrolling (keeps satellites/vehicles moving)
    updateCameraFromScroll();
  }

  /* ------------------------------------------------------------------ */
  /*  LANG/DIR MUTATION OBSERVER (re-render pins + flip viewOffset) */
  /* ------------------------------------------------------------------ */
  function setupLangObserver() {
    if (!window.MutationObserver) return;
    var observer = new MutationObserver(function () {
      updatePins();
      updateDock();
      // camera viewOffset flips on next scroll frame
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir"] });
  }

  /* ------------------------------------------------------------------ */
  /*  2D ISOMETRIC FALLBACK (canvas 2d) */
  /* ------------------------------------------------------------------ */
  function setupFallback() {
    isFallback = true;
    var canvasWrap = $id("l3d-stage-wrap");
    var canvas = $id("l3d-canvas");
    canvas.style.display = "none";
    var fb = document.createElement("canvas");
    fb.className = "l3d-canvas l3d-fallback";
    fb.width = window.innerWidth;
    fb.height = window.innerHeight;
    canvasWrap.appendChild(fb);
    var ctx = fb.getContext("2d");

    function draw() {
      var w = fb.width, h = fb.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#dce1e8";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#102333";
      ctx.font = "bold 18px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t("l3d.a1.title"), w * 0.5, h * 0.22);
      ctx.fillStyle = "#f05327";
      ctx.fillText(t("l3d.a6.title"), w * 0.5, h * 0.78);
      ctx.fillStyle = "#102333";
      ctx.font = "14px system-ui";
      ctx.fillText("Three.js WebGL غیر فعال — نمایش دو بعدی (isometric)", w * 0.5, h * 0.5);
      ctx.fillText("درحال بارگذاری نسخه دو بعدی (isometric) —ω", w * 0.5, h * 0.54);
      // 6 iso boxes
      var iso = function (cx, cy, label) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 40);
        ctx.lineTo(cx + 40, cy - 20);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx - 40, cy - 20);
        ctx.closePath();
        ctx.fillStyle = "#dce1e8";
        ctx.fill();
        ctx.strokeStyle = "#102333";
        ctx.stroke();
        ctx.fillStyle = "#102333";
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(label, cx, cy + 6);
      };
      var labels = ["۰۱ مونولیت", "۰۲ ردیاب", "۰۳ شهر", "۰۴ داشبورد", "۰۵ R&D", "۰۶ مدار"];
      var xs = [w * 0.2, w * 0.5, w * 0.8, w * 0.2, w * 0.5, w * 0.8];
      var ys = [h * 0.35, h * 0.35, h * 0.35, h * 0.62, h * 0.62, h * 0.62];
      for (var i = 0; i < 6; i++) iso(xs[i], ys[i], labels[i]);
    }

    draw();
    window.addEventListener("resize", function () {
      fb.width = window.innerWidth; fb.height = window.innerHeight;
      draw();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  INIT */
  /* ------------------------------------------------------------------ */
  function setDebug(msg, ok) {
    var d = document.getElementById("l3d-status");
    if (d) {
      d.style.display = "block";
      d.style.position = "fixed";
      d.style.top = "10px";
      d.style.left = "50%";
      d.style.transform = "translateX(-50%)";
      d.style.zIndex = "99999";
      d.style.padding = "10px 16px";
      d.style.borderRadius = "8px";
      d.style.background = ok ? "rgba(16,35,51,0.95)" : "rgba(160,30,20,0.95)";
      d.style.color = "#fff";
      d.style.border = ok ? "1px solid rgba(240,83,39,0.7)" : "1px solid #f05327";
      d.style.fontFamily = "system-ui";
      d.style.fontSize = "13px";
      d.style.textAlign = "center";
      d.style.minWidth = "220px";
      d.textContent = msg;
    }
    console.log("[landing3d]", msg);
  }

  function init() {
    // Apply saved language (presentation.js already did this; ensure dir/lang reflect)
    var savedLang = getLang();
    document.documentElement.lang = savedLang;
    document.documentElement.dir = (savedLang === "fa" || savedLang === "ar") ? "rtl" : "ltr";

    setDebug("landing3d: init…", true);

    if (!webglAvailable()) {
      setDebug("WebGL غیرفعال است — نسخه دو بعدی بارگذاری می‌شود", false);
      setupFallback();
      return;
    }
    if (!THREE) {
      setDebug("Three.js بارگذاری نشد — vendor/three.min.js را بررسی کنید", false);
      setupFallback();
      return;
    }
    setDebug("Three.js r" + THREE.REVISION + " بارگذاری شد", true);

    try {
      initThree();
      setupInteractions();
      setupLangObserver();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      // initial frame
      targetScrollProg = Math.max(0, Math.min(1, getScrollTop() / getMaxScroll()));
      smoothScrollProg = targetScrollProg;
      updateCameraFromScroll();
      animate();
      setDebug("صحنه سه‌بعدی آماده است · ۶ منطقه", true);
    } catch (e) {
      console.warn("[landing3d] WebGL init failed, falling back:", e);
      setDebug("خطای WebGL: نسخه دو بعدی بارگذاری می‌شود", false);
      setupFallback();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
