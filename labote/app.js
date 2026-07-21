/* =========================================================
   DÉMO PREMIUM V3 · clair & vif · motion
   Lenis + GSAP/ScrollTrigger + Three.js (cluster 3D interactif)
   Dégradation: reduced-motion / no-WebGL / touch → statique lisible
   ========================================================= */
(function () {
  "use strict";
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH = window.matchMedia("(hover:none),(pointer:coarse)").matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  var BRAND = { coral: 0xFF4D2E, cobalt: 0x2B44FF, lime: 0xC7F03A, sun: 0xFFC53D, violet: 0x7B5CFF };


  /* -------- PRODUCT GRID -------- */
  var PRODUCTS = window.__DEMO_PRODUCTS || [
    { n: "Veste Atelier", p: "129€", o: "159€", r: "4.9", c: [BRAND.coral, 0x17160F, BRAND.cobalt], flag: "Best-seller", a: "jacket-a", b: "jacket-b" },
    { n: "Hoodie Signature", p: "89€", o: "", r: "4.8", c: [BRAND.lime, 0x17160F, BRAND.sun], flag: "", a: "hoodie-a", b: "hoodie-b" },
    { n: "Pantalon Coupe 01", p: "99€", o: "119€", r: "4.9", c: [0x17160F, BRAND.cobalt, 0x8a8578], flag: "-20%", a: "pants-a", b: "street-tall" },
    { n: "Tee Oversize", p: "45€", o: "", r: "4.7", c: [0xffffff, BRAND.coral, BRAND.violet], flag: "Nouveau", a: "tee-a", b: "rack-warm" },
    { n: "Bonnet Maille", p: "29€", o: "", r: "4.8", c: [BRAND.sun, 0x17160F, BRAND.cobalt], flag: "", a: "beanie-a", b: "acc-b" },
    { n: "Sneaker Édition", p: "75€", o: "95€", r: "5.0", c: [BRAND.violet, 0x17160F, BRAND.lime], flag: "Série courte", a: "sneaker-a", b: "sneaker-b" }
  ];
  (function grid() {
    var g = document.getElementById("prodGrid"); if (!g) return;
    var hex = function (n) { return typeof n === "string" ? n : ("#" + n.toString(16).padStart(6, "0")); };
    var IMG = window.__DEMO_IMG || {};
    var src = function (n) { return /^(https?:|data:)/.test(n) ? n : (IMG[n] || ("assets/img/" + n + ".jpg")); };
    PRODUCTS.forEach(function (pr) {
      var sw = pr.c.map(function (c) { return '<i style="background:' + hex(c) + '"></i>'; }).join("");
      var el = document.createElement("article");
      el.className = "prod"; el.setAttribute("data-anim", "rise");
      el.innerHTML =
        '<div class="prod__media">' +
          (pr.flag ? '<span class="prod__flag">' + pr.flag + "</span>" : "") +
          '<button class="prod__wish" aria-label="Ajouter aux favoris">♡</button>' +
          '<div class="media media--a"><img class="media__img" loading="lazy" src="' + src(pr.a) + '" alt="' + pr.n + '"></div>' +
          '<div class="media media--b"><img class="media__img" loading="lazy" src="' + src(pr.b) + '" alt="' + pr.n + ' vue 2"></div>' +
        "</div>" +
        '<div class="prod__body">' +
          '<div class="prod__row"><span class="prod__name">' + pr.n + '</span>' +
          '<span class="prod__price">' + (pr.o ? "<s>" + pr.o + "</s>" : "") + pr.p + "</span></div>" +
          (pr.r ? '<div class="prod__rate"><b>★</b> ' + pr.r + (pr.rc ? " · " + pr.rc + " avis" : "") + "</div>" : "") +
          '<div class="prod__sw">' + sw + "</div>" +
          '<button class="btn prod__add" data-magnetic><span>Ajouter au panier</span></button>' +
        "</div>";
      g.appendChild(el);
    });
  })();

  /* -------- TESTIMONIALS reel (auto-scroll, pause hover) -------- */
  var TESTI = [
    { q: "Le rendu est bien au-dessus des photos. Coupe parfaite, livré en deux jours.", n: "Camille R.", c: "Lyon", a: "av3", hl: 1 },
    { q: "Je recommande les yeux fermés. Qualité au rendez-vous et un vrai suivi.", n: "Sofia M.", c: "Bruxelles", a: "av2" },
    { q: "Site clair, commande simple, et la pièce est encore mieux en vrai.", n: "Yanis B.", c: "Paris", a: "av1" },
    { q: "Emballage soigné, matières top. On sent que c'est pensé dans le détail.", n: "Inès L.", c: "Genève", a: "av4", hl: 1 },
    { q: "Passé commande le soir, reçu 48h après. Rien à redire, je reviendrai.", n: "Noah K.", c: "Montréal", a: "av5" },
    { q: "Le site donne confiance direct. La pièce tient toutes ses promesses.", n: "Léa D.", c: "Bordeaux", a: "av6" }
  ];
  (function testiReel() {
    var track = document.getElementById("treelTrack"), reel = document.getElementById("treel");
    if (!track) return;
    var IMG = window.__DEMO_IMG || {};
    var av = function (n) { return IMG[n] || ("assets/img/" + n + ".jpg"); };
    function card(t) {
      var el = document.createElement("div");
      el.className = "tcard" + (t.hl ? " tcard--hl" : "");
      el.innerHTML =
        '<div class="tcard__stars" role="img" aria-label="Noté 5 sur 5">★★★★★</div>' +
        '<p class="tcard__q">« ' + t.q + ' »</p>' +
        '<div class="tcard__who"><i style="background-image:url(' + av(t.a) + ')"></i>' +
        '<div><div class="tcard__name">' + t.n + '</div><div class="tcard__meta">' + t.c + ' · <span class="tcard__vp">Achat vérifié</span></div></div></div>';
      return el;
    }
    TESTI.forEach(function (t) { track.appendChild(card(t)); });
    if (REDUCED || TOUCH || !hasGSAP) { reel.classList.add("is-native"); return; }
    // duplicate for seamless loop
    TESTI.forEach(function (t) { track.appendChild(card(t)); });
    var half = track.scrollWidth / 2;
    var tw = gsap.to(track, { x: -half, duration: 34, ease: "none", repeat: -1 });
    reel.addEventListener("mouseenter", function () { gsap.to(tw, { timeScale: 0, duration: 0.4 }); });
    reel.addEventListener("mouseleave", function () { gsap.to(tw, { timeScale: 1, duration: 0.4 }); });
  })();

  /* -------- CURSOR + MAGNETIC -------- */
  (function cursor() {
    if (TOUCH || REDUCED || !hasGSAP) return;
    var dot = document.querySelector(".cursor"); if (!dot) return;
    var x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    gsap.ticker.add(function () { x += (tx - x) * 0.22; y += (ty - y) * 0.22; dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)"; });
    function bind() {
      document.querySelectorAll("a,button,[data-magnetic]").forEach(function (el) {
        if (el.__c) return; el.__c = 1;
        el.addEventListener("mouseenter", function () { dot.classList.add("cursor--big"); });
        el.addEventListener("mouseleave", function () { dot.classList.remove("cursor--big"); });
      });
      document.querySelectorAll("[data-magnetic]").forEach(function (el) {
        if (el.__m) return; el.__m = 1;
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.35, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.5, ease: "power3.out" });
        });
        el.addEventListener("mouseleave", function () { gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }); });
      });
    }
    bind();
  })();

  /* -------- THREE.js 3D CLUSTER -------- */
  function makeCluster(canvas) {
    if (!window.THREE) return null;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
    catch (e) { return null; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, TOUCH ? 1.3 : 2));
    if (THREE.ACESFilmicToneMapping) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.02; }
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100); cam.position.set(0, 0, 8);
    var group = new THREE.Group(); scene.add(group);

    // couleur de marque (auto par prospect via la variable CSS --brand)
    var BRANDC = BRAND.coral;
    try { var _v = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim(); if (_v) BRANDC = new THREE.Color(_v).getHex(); } catch (e) {}

    function mat(color, rough, metal) {
      return new THREE.MeshPhysicalMaterial({
        color: color, roughness: rough, metalness: metal || 0.12,
        clearcoat: 1.0, clearcoatRoughness: 0.18, sheen: 0.4, sheenColor: new THREE.Color(0xffffff)
      });
    }
    var geos = [
      new THREE.IcosahedronGeometry(1.35, 6),
      window.THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.62, 1.1, 12, 24) : new THREE.CylinderGeometry(0.62, 0.62, 2, 24),
      new THREE.TorusGeometry(0.9, 0.34, 24, 48),
      new THREE.IcosahedronGeometry(0.85, 5)
    ];
    var specs = [
      { g: 0, c: BRANDC, pos: [-1.7, 0.4, 0], rough: 0.16, s: 1 },
      { g: 1, c: BRAND.cobalt, pos: [1.7, -0.9, 0.6], rough: 0.3, s: 1 },
      { g: 2, c: BRAND.sun, pos: [1.5, 1.4, -0.4], rough: 0.24, s: 0.9 },
      { g: 3, c: BRAND.lime, pos: [-1.4, -1.5, 0.8], rough: 0.28, s: 1 }
    ];
    var meshes = specs.map(function (sp) {
      var m = new THREE.Mesh(geos[sp.g], mat(sp.c, sp.rough));
      m.position.set(sp.pos[0], sp.pos[1], sp.pos[2]); m.scale.setScalar(sp.s);
      m.userData.spin = (Math.random() - 0.5) * 0.4 + 0.2;
      m.userData.ph = Math.random() * 6.28;
      group.add(m); return m;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(4, 6, 6); scene.add(key);
    var p1 = new THREE.PointLight(BRANDC, 58, 30); p1.position.set(-5, 3, 4); scene.add(p1);
    var p2 = new THREE.PointLight(BRAND.cobalt, 52, 30); p2.position.set(5, -3, 5); scene.add(p2);
    var p3 = new THREE.PointLight(BRAND.violet, 40, 30); p3.position.set(0, 4, -4); scene.add(p3);

    var mouse = { x: 0, y: 0 };
    if (!TOUCH) addEventListener("mousemove", function (e) { mouse.x = (e.clientX / innerWidth - 0.5); mouse.y = (e.clientY / innerHeight - 0.5); });

    function size() {
      var r = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
    }
    size(); addEventListener("resize", size);

    var scrollRot = 0;
    if (hasGSAP) ScrollTrigger.create({ trigger: canvas.closest("header,section") || document.body, start: "top top", end: "bottom top", scrub: true, onUpdate: function (s) { scrollRot = s.progress; } });

    return {
      render: function (t) {
        meshes.forEach(function (m, i) {
          m.rotation.x = t * 0.18 * m.userData.spin + i;
          m.rotation.y = t * 0.24 * m.userData.spin;
          m.position.y = m.userData.baseY !== undefined ? m.userData.baseY : (m.userData.baseY = m.position.y);
          m.position.y = m.userData.baseY + Math.sin(t * 0.9 + m.userData.ph) * 0.18;
        });
        group.rotation.y += ((mouse.x * 0.6) - group.rotation.y) * 0.05 + 0.0004;
        group.rotation.x += ((mouse.y * 0.4) - group.rotation.x) * 0.05;
        group.position.y = scrollRot * -1.2;
        cam.position.z = 8 + scrollRot * 0.9; // camera qui recule doucement au scroll (profondeur)
        renderer.render(scene, cam);
      }
    };
  }

  var clusters = [];
  var hc = document.getElementById("heroCanvas");
  if (hc) { var c1 = makeCluster(hc); if (c1) clusters.push(c1); }
  var t0 = null;
  function loop(ts) { if (t0 === null) t0 = ts; var t = (ts - t0) / 1000; for (var i = 0; i < clusters.length; i++) clusters[i].render(t); requestAnimationFrame(loop); }
  if (clusters.length) {
    if (REDUCED) { clusters.forEach(function (c) { c.render(1.4); }); } // pose fixe (accessibilité)
    else requestAnimationFrame(loop);
  }

  /* -------- LENIS -------- */
  var lenis = null;
  if (!REDUCED && !TOUCH && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 });
    window.__lenis = lenis;
    if (hasGSAP) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function (time) { lenis.raf(time * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length > 1) { var tg = document.querySelector(id); if (tg) { e.preventDefault(); lenis.scrollTo(tg, { offset: -70 }); } } });
    });
  }

  /* -------- LOADER -------- */
  (function loader() {
    var el = document.getElementById("loader"); if (!el) return;
    if (REDUCED || !hasGSAP) { el.style.display = "none"; revealHero(true); return; }
    if (lenis) lenis.stop();
    var c = document.getElementById("loaderCount"), bar = document.getElementById("loaderBar"), o = { v: 0 };
    gsap.to(o, { v: 100, duration: 1.0, ease: "power2.inOut",
      onUpdate: function () { c.textContent = Math.round(o.v); bar.style.width = o.v + "%"; },
      onComplete: function () { gsap.to(el, { yPercent: -100, duration: 0.8, ease: "power4.inOut", onComplete: function () { el.style.display = "none"; if (lenis) lenis.start(); } }); revealHero(false); }
    });
  })();

  function revealHero(instant) {
    var title = document.querySelector(".hero__title");
    var heroAnims = document.querySelectorAll(".hero [data-anim], .promo, .nav");
    if (!hasGSAP || REDUCED || instant) {
      document.querySelectorAll("[data-anim]").forEach(function (e) { e.classList.add("is-in"); });
      if (title) title.classList.add("is-in");
      return;
    }
    var i = 0;
    heroAnims.forEach(function (e) { e.style.transitionDelay = (0.05 + i * 0.06) + "s"; e.classList.add("is-in"); i++; });
    if (title) title.classList.add("is-in");
    setTimeout(function () { heroAnims.forEach(function (e) { e.style.transitionDelay = ""; }); }, 1400);
  }

  if (!hasGSAP) { document.querySelectorAll("[data-anim]").forEach(function (e) { e.classList.add("is-in"); }); return; }

  /* -------- reveals au scroll : IntersectionObserver + CSS (jamais bloques par le ticker gsap) -------- */
  (function reveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-anim]")).filter(function (e) {
      return !e.closest(".hero") && !e.classList.contains("nav") && !e.classList.contains("promo");
    });
    if (REDUCED || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    // filet de securite : tout element deja visible le devient meme si l'IO rate
    setTimeout(function () {
      els.forEach(function (e) { if (!e.classList.contains("is-in") && e.getBoundingClientRect().top < innerHeight * 0.95) e.classList.add("is-in"); });
    }, 2500);
  })();

  /* -------- counters (rAF autonome, temps reel, snap exact, une seule fois) -------- */
  (function counters() {
    var els = document.querySelectorAll("[data-count]");
    function run(el) {
      if (el.__counted) return; el.__counted = true;
      var end = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var suf = el.getAttribute("data-suffix") || "";
      if (REDUCED) { el.textContent = end.toFixed(dec) + suf; return; }
      var dur = 1800, start = null;
      function ease(t) { return 1 - Math.pow(1 - t, 3); } // easeOutCubic
      function step(ts) {
        if (start === null) start = ts;
        var p = (ts - start) / dur;
        if (p >= 1) { el.textContent = end.toFixed(dec) + suf; return; } // snap exact
        el.textContent = (end * ease(p)).toFixed(dec) + suf;
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { Array.prototype.forEach.call(els, run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  })();

  /* -------- promo marquee -------- */
  (function promo() {
    var row = document.getElementById("promoRow"); if (!row) return;
    gsap.to(row, { x: -row.scrollWidth / 2, duration: 24, ease: "none", repeat: -1 });
  })();

  /* -------- FAQ accordion -------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q"), a = item.querySelector(".faq__a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach(function (o) { if (o !== item) { o.classList.remove("open"); gsap.to(o.querySelector(".faq__a"), { height: 0, duration: 0.4, ease: "power2.inOut" }); } });
      if (open) { item.classList.remove("open"); gsap.to(a, { height: 0, duration: 0.4, ease: "power2.inOut" }); }
      else { item.classList.add("open"); gsap.set(a, { height: "auto" }); gsap.from(a, { height: 0, duration: 0.5, ease: "power2.out" }); }
    });
  });

  /* -------- hero : mot rotatif qui change de couleur -------- */
  (function rotator() {
    var r = document.getElementById("rotator"); if (!r) return;
    var ws = [].slice.call(r.querySelectorAll(".rotator__w"));
    if (!ws.length) return;
    if (!hasGSAP) { ws[0].style.opacity = 1; return; }
    var sl = REDUCED ? 0 : 70; // reduced-motion : fondu couleur sans glissement
    gsap.set(ws, { yPercent: sl, opacity: 0 });
    gsap.set(ws[0], { yPercent: 0, opacity: 1 });
    var i = 0;
    function cycle() {
      var cur = ws[i], nx = ws[(i + 1) % ws.length];
      gsap.to(cur, { yPercent: -sl, opacity: 0, duration: 0.5, ease: "power3.in" });
      gsap.fromTo(nx, { yPercent: sl, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
      i = (i + 1) % ws.length;
      gsap.delayedCall(2.1, cycle);
    }
    gsap.delayedCall(2.1, cycle);
  })();

  /* -------- float parallax (bulles hero + déco + bgword) -------- */
  (function floaters() {
    if (TOUCH || REDUCED) return;
    var els = gsap.utils.toArray("[data-float]").map(function (el) {
      return { el: el, f: parseFloat(el.getAttribute("data-float")) || 0.5,
        qx: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" }),
        qy: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }) };
    });
    window.addEventListener("mousemove", function (e) {
      var mx = e.clientX / window.innerWidth - 0.5, my = e.clientY / window.innerHeight - 0.5;
      els.forEach(function (o) { o.qx(mx * o.f * 46); o.qy(my * o.f * 46); });
    });
  })();

  /* -------- STORY : flythrough 3D (images qui surgissent en profondeur) -------- */
  (function story() {
    var sec = document.getElementById("story"), pin = document.getElementById("storyPin");
    var cards = gsap.utils.toArray(".story__card"), steps = gsap.utils.toArray(".story__step");
    if (!sec || !cards.length) return;
    if (TOUCH || REDUCED) {
      sec.classList.add("is-static");
      gsap.set(cards, { opacity: 1, clearProps: "transform" });
      if (steps[0]) gsap.set(steps[0], { opacity: 1, yPercent: 0 });
      return;
    }
    var N = cards.length;
    gsap.set(cards, { xPercent: -50, yPercent: -50, transformPerspective: 1300, transformOrigin: "50% 50%" });
    gsap.set(steps, { opacity: 0, yPercent: 60 });
    if (steps[0]) gsap.set(steps[0], { opacity: 1, yPercent: 0 });
    var cur = 0;
    var clamp = gsap.utils.clamp, mr = gsap.utils.mapRange;
    ScrollTrigger.create({
      trigger: sec, start: "top top", end: "+=" + Math.round(N * window.innerHeight * 0.9),
      pin: pin, scrub: 1, invalidateOnRefresh: true,
      onUpdate: function (self) {
        var t = self.progress * N;
        cards.forEach(function (card, i) {
          var d = t - i, op, z, ry, x;
          if (d <= -1 || d >= 1.5) { op = 0; z = d <= -1 ? -1400 : 800; ry = 0; x = 0; }
          else {
            op = d < 0 ? mr(-1, -0.35, 0, 1, d) : (d > 0.7 ? mr(0.7, 1.5, 1, 0, d) : 1);
            op = clamp(0, 1, op);
            z = mr(-1, 1.5, -1250, 720, d);
            ry = mr(-1, 1.5, 16, -16, d);
            x = mr(-1, 1.5, 90, -90, d);
          }
          gsap.set(card, { opacity: op, z: z, rotationY: ry, x: x });
        });
        var s = clamp(0, N - 1, Math.round(t - 0.5));
        if (s !== cur) {
          gsap.to(steps[cur], { opacity: 0, yPercent: -55, duration: 0.4, ease: "power2.in" });
          gsap.to(steps[s], { opacity: 1, yPercent: 0, duration: 0.55, ease: "power3.out" });
          cur = s;
        }
      }
    });
  })();

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
