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
    // materiau verre (refraction reelle des autres formes du cluster derriere) : equivalent natif
    // du MeshTransmissionMaterial de @react-three/drei, sans dependance React/R3F.
    function matGlass(color) {
      return new THREE.MeshPhysicalMaterial({
        color: color, roughness: 0.06, metalness: 0,
        transmission: 1.0, thickness: 0.9, ior: 1.5,
        clearcoat: 1.0, clearcoatRoughness: 0.06,
        attenuationColor: new THREE.Color(color), attenuationDistance: 1.1
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
      { g: 2, c: BRAND.sun, pos: [1.5, 1.4, -0.4], rough: 0.24, s: 0.9, glass: true },
      { g: 3, c: BRAND.lime, pos: [-1.4, -1.5, 0.8], rough: 0.28, s: 1.05, glass: true }
    ];
    var meshes = specs.map(function (sp) {
      var m = new THREE.Mesh(geos[sp.g], sp.glass ? matGlass(sp.c) : mat(sp.c, sp.rough));
      m.position.set(sp.pos[0], sp.pos[1], sp.pos[2]); m.scale.setScalar(sp.s);
      m.userData.spin = (Math.random() - 0.5) * 0.4 + 0.2;
      m.userData.ph = Math.random() * 6.28;
      group.add(m); return m;
    });

    // cluster decale a droite : degage la colonne de gauche ou vit le panneau de vente (lisibilite titre)
    group.position.x = 1.9;

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

  /* -------- LIQUID GLASS (refraction reelle, technique SVG feDisplacementMap) --------
     Adaptation vanilla (sans React/build) du principe des libs type "simple-liquid-glass" :
     une carte de deplacement (bump radial genere en canvas) pilote un filtre SVG applique
     en backdrop-filter. Actif seulement sur moteurs Chromium (seuls a interpreter url(#id)
     dans backdrop-filter) ; ailleurs le blur CSS deja pose en styles.css reste le fallback
     (jamais pire qu'avant, jamais casse). */
  (function liquidGlass() {
    var els = document.querySelectorAll("[data-glass]");
    if (!els.length) return;
    var ua = navigator.userAgent || "";
    var chromium = /(chrome|chromium|crios|edg|opr)\//i.test(ua) && !/iphone|ipad|ipod/i.test(ua);
    if (!chromium) return;

    var svgNS = "http://www.w3.org/2000/svg";
    var host = document.createElementNS(svgNS, "svg");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    var defs = document.createElementNS(svgNS, "defs");
    host.appendChild(defs);
    document.body.appendChild(host);

    function roundRect(ctx, x, y, w, h, r) {
      r = Math.max(0, Math.min(r, w / 2, h / 2));
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    function buildMap(w, h, radius) {
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, w, h); // neutre = pas de deplacement
      var border = Math.max(6, Math.min(w, h) * 0.18);
      roundRect(ctx, 1, 1, w - 2, h - 2, radius); ctx.fillStyle = "#fff"; ctx.fill(); // bord = pousse
      roundRect(ctx, border, border, Math.max(1, w - border * 2), Math.max(1, h - border * 2), Math.max(0, radius - border)); ctx.fillStyle = "#000"; ctx.fill(); // centre = creuse
      var c2 = document.createElement("canvas"); c2.width = w; c2.height = h;
      var ctx2 = c2.getContext("2d");
      ctx2.filter = "blur(" + Math.round(border * 0.55) + "px)"; // bump lisse, pas une marche
      ctx2.drawImage(c, 0, 0);
      return c2.toDataURL();
    }

    var cache = {}, n = 0;
    function apply(el) {
      var r = el.getBoundingClientRect();
      var w = Math.max(8, Math.round(r.width)), h = Math.max(8, Math.round(r.height));
      var radius = parseFloat(el.getAttribute("data-glass-radius") || "26");
      var key = w + "x" + h + "x" + radius;
      var id = cache[key];
      if (!id) {
        id = "lg-" + (n++);
        var uri = buildMap(w, h, radius);
        var filter = document.createElementNS(svgNS, "filter");
        filter.setAttribute("id", id);
        filter.setAttribute("color-interpolation-filters", "sRGB");
        filter.setAttribute("x", "-15%"); filter.setAttribute("y", "-15%");
        filter.setAttribute("width", "130%"); filter.setAttribute("height", "130%");
        var feImg = document.createElementNS(svgNS, "feImage");
        feImg.setAttribute("href", uri); feImg.setAttribute("x", "0"); feImg.setAttribute("y", "0");
        feImg.setAttribute("width", "100%"); feImg.setAttribute("height", "100%"); feImg.setAttribute("result", "map");
        var disp = document.createElementNS(svgNS, "feDisplacementMap");
        disp.setAttribute("in", "SourceGraphic"); disp.setAttribute("in2", "map");
        disp.setAttribute("scale", "24"); disp.setAttribute("xChannelSelector", "R"); disp.setAttribute("yChannelSelector", "G");
        filter.appendChild(feImg); filter.appendChild(disp);
        defs.appendChild(filter);
        cache[key] = id;
      }
      var v = "url(#" + id + ") blur(6px) saturate(165%)";
      el.style.backdropFilter = v; el.style.webkitBackdropFilter = v;
    }
    els.forEach(apply);
    var rt;
    addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { els.forEach(apply); }, 200); });
  })();

  /* -------- SIGNATURE LIQUIDE (metal liquide anime, centrale dans le hero) --------
     Shader adapte (licence MIT, github.com/collidingScopes/liquid-logo) : simplex noise +
     detection de contour + reflets metalliques teintes couleur marque, applique en WebGL brut.
     Priorite au vrai logo detoure du prospect (window.__DEMO_LOGO_URL, fourni par le pipeline
     seulement si exploitable). Sinon (trame generique ou logo non trouve) : le nom de la marque
     est dessine directement dans un canvas et sert de silhouette - toujours actif, jamais vide. */
  (function heroLiquidLogo() {
    var canvas = document.getElementById("heroSig");
    if (!canvas || REDUCED) return;
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    var VS = "attribute vec2 aVertexPosition;\nvoid main(){ gl_Position = vec4(aVertexPosition,0.0,1.0); }";
    var FS = "precision highp float;\n" +
      "uniform vec2 u_resolution; uniform float u_time; uniform float u_speed; uniform float u_iterations;\n" +
      "uniform float u_scale; uniform float u_dotFactor; uniform float u_vOffset; uniform float u_intensityFactor;\n" +
      "uniform float u_expFactor; uniform vec3 u_colorFactors; uniform float u_colorShift; uniform float u_dotMultiplier;\n" +
      "uniform float u_noiseIntensity; uniform sampler2D u_logoTexture; uniform float u_logoScale; uniform float u_logoInteractStrength;\n" +
      "uniform vec3 u_brand;\n" +
      "float random(vec2 st){ return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123); }\n" +
      "vec3 mod289(vec3 x){ return x-floor(x*(1.0/289.0))*289.0; } vec4 mod289(vec4 x){ return x-floor(x*(1.0/289.0))*289.0; }\n" +
      "vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); } vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159-0.85373472095314*r; }\n" +
      "float snoise(vec3 v){\n" +
      "  const vec2 C = vec2(1.0/6.0,1.0/3.0); const vec4 D = vec4(0.0,0.5,1.0,2.0);\n" +
      "  vec3 i = floor(v+dot(v,C.yyy)); vec3 x0 = v-i+dot(i,C.xxx);\n" +
      "  vec3 g = step(x0.yzx,x0.xyz); vec3 l = 1.0-g; vec3 i1 = min(g.xyz,l.zxy); vec3 i2 = max(g.xyz,l.zxy);\n" +
      "  vec3 x1 = x0-i1+C.xxx; vec3 x2 = x0-i2+C.yyy; vec3 x3 = x0-D.yyy;\n" +
      "  i = mod289(i);\n" +
      "  vec4 p = permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));\n" +
      "  float n_ = 0.142857142857; vec3 ns = n_*D.wyz-D.xzx;\n" +
      "  vec4 j = p-49.0*floor(p*ns.z*ns.z);\n" +
      "  vec4 x_ = floor(j*ns.z); vec4 y_ = floor(j-7.0*x_);\n" +
      "  vec4 x = x_*ns.x+ns.yyyy; vec4 y = y_*ns.x+ns.yyyy; vec4 h = 1.0-abs(x)-abs(y);\n" +
      "  vec4 b0 = vec4(x.xy,y.xy); vec4 b1 = vec4(x.zw,y.zw);\n" +
      "  vec4 s0 = floor(b0)*2.0+1.0; vec4 s1 = floor(b1)*2.0+1.0; vec4 sh = -step(h,vec4(0.0));\n" +
      "  vec4 a0 = b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw+s1.xzyw*sh.zzww;\n" +
      "  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);\n" +
      "  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n" +
      "  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;\n" +
      "  vec4 m = max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m = m*m;\n" +
      "  return 42.0*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n" +
      "}\n" +
      "float detectEdges(vec2 uv, float threshold){\n" +
      "  float dx = 1.0/u_resolution.x; float dy = 1.0/u_resolution.y;\n" +
      "  vec4 c0 = texture2D(u_logoTexture, uv); vec4 l0 = texture2D(u_logoTexture, uv-vec2(dx,0.0));\n" +
      "  vec4 r0 = texture2D(u_logoTexture, uv+vec2(dx,0.0)); vec4 t0 = texture2D(u_logoTexture, uv-vec2(0.0,dy));\n" +
      "  vec4 b0 = texture2D(u_logoTexture, uv+vec2(0.0,dy));\n" +
      "  float diff = length(c0-l0)+length(c0-r0)+length(c0-t0)+length(c0-b0);\n" +
      "  return smoothstep(0.0, threshold, diff);\n" +
      "}\n" +
      "vec4 liquidMetalEffect(vec4 color, float edge){\n" +
      "  float highlight = pow(0.5+0.5*sin(edge*6.0), 8.0)*edge;\n" +
      "  vec4 metallic = vec4(color.r+highlight*u_brand.r, color.g+highlight*u_brand.g, color.b+highlight*u_brand.b, color.a);\n" +
      "  return clamp(metallic, 0.0, 1.0);\n" +
      "}\n" +
      "void main(){\n" +
      "  vec2 r = u_resolution; vec2 FC = gl_FragCoord.xy; float time = u_time*u_speed;\n" +
      "  vec2 uv = FC.xy/r; vec2 logoUV = (uv-0.5)/u_logoScale+0.5; logoUV.y = 1.0-logoUV.y;\n" +
      "  if (logoUV.x < 0.0 || logoUV.x > 1.0 || logoUV.y < 0.0 || logoUV.y > 1.0) discard;\n" +
      "  vec4 logoColor = texture2D(u_logoTexture, logoUV); float logoAlpha = logoColor.a;\n" +
      "  if (logoAlpha <= 0.1) discard;\n" +
      "  float edge = detectEdges(logoUV, 0.2)*u_logoInteractStrength;\n" +
      "  vec2 p = (FC.xy*2.0-r)/r.y; vec2 l = vec2(0.0); float dotP = dot(p,p);\n" +
      "  l.x += abs(u_dotFactor-dotP)*u_dotMultiplier;\n" +
      "  float edgeInfluence = edge*20.0; vec2 v = p*(1.0-l.x)/u_scale;\n" +
      "  v += vec2(sin(edge*10.0), cos(edge*8.0))*edgeInfluence;\n" +
      "  float flowNoise = snoise(vec3(p*2.0, time*0.15))*u_noiseIntensity;\n" +
      "  v += vec2(flowNoise, flowNoise*0.7);\n" +
      "  vec4 o = vec4(0.0);\n" +
      "  for (float i = 0.0; i < 16.0; i++) {\n" +
      "    if (i >= u_iterations) break; float idx = i+1.0;\n" +
      "    vec2 offset = cos(v.yx*idx+vec2(0.0,idx)+time)/idx+u_vOffset;\n" +
      "    if (edge > 0.1) offset *= 1.0+edge*4.0;\n" +
      "    v += offset; o += (sin(vec4(v.x,v.y,v.y,v.x))+1.0)*abs(v.x-v.y)*u_intensityFactor;\n" +
      "  }\n" +
      "  if (u_colorShift > 0.0) o = o.wxyz*u_colorShift+o*(1.0-u_colorShift);\n" +
      "  vec4 expPy = exp(p.y*vec4(u_colorFactors.x,u_colorFactors.y,u_colorFactors.z,0.0));\n" +
      "  float expLx = exp(-u_expFactor*l.x); vec4 ratio = expPy*expLx/o;\n" +
      "  vec4 exp2x = exp(2.0*ratio); o = (exp2x-1.0)/(exp2x+1.0);\n" +
      "  vec2 noiseCoord = FC/1.5; float noiseV = random(noiseCoord+time*0.0004)*0.12-0.075; o = o+vec4(noiseV);\n" +
      "  o = liquidMetalEffect(o, edge); o = clamp(o, 0.0, 1.0);\n" +
      "  vec4 finalColor = mix(o, vec4(o.rgb*0.8+0.2, logoAlpha), 0.3);\n" +
      "  float hi = pow(edge*1.2, 4.0); finalColor.rgb += hi*u_brand;\n" +
      "  finalColor.a = min(finalColor.a+0.4, 1.0);\n" +
      "  gl_FragColor = finalColor;\n" +
      "}";

    function compile(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "aVertexPosition");

    var U = {};
    ["resolution", "time", "speed", "iterations", "scale", "dotFactor", "vOffset", "intensityFactor",
      "expFactor", "colorFactors", "colorShift", "dotMultiplier", "noiseIntensity", "logoTexture",
      "logoScale", "logoInteractStrength", "brand"].forEach(function (nm) { U[nm] = gl.getUniformLocation(prog, "u_" + nm); });

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var ready = false;
    function upload(source) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      ready = true;
      canvas.classList.add("is-on");
    }
    // repli garanti : le nom de marque (nav__mark, deja personnalise par le pipeline) dessine
    // dans un canvas carre = silhouette toujours disponible, meme sans logo prospect exploitable.
    function textFallback() {
      var name = ((document.querySelector(".nav__mark") || {}).textContent || "Marque").trim();
      var tc = document.createElement("canvas"); tc.width = 640; tc.height = 640;
      var tx = tc.getContext("2d");
      tx.clearRect(0, 0, 640, 640);
      tx.fillStyle = "#fff"; tx.textAlign = "center"; tx.textBaseline = "middle";
      var size = 150, fam = "800 " + size + "px 'Bricolage Grotesque', sans-serif";
      tx.font = fam;
      while (tx.measureText(name).width > 560 && size > 40) { size -= 4; tx.font = "800 " + size + "px 'Bricolage Grotesque', sans-serif"; }
      tx.fillText(name, 320, 330);
      upload(tc);
    }
    var url = window.__DEMO_LOGO_URL;
    if (url) {
      var img = new Image();
      img.onload = function () { upload(img); };
      img.onerror = textFallback; // logo casse/injoignable -> repli texte, jamais de canvas vide
      img.src = url;
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { if (!url) textFallback(); });
    } else if (!url) {
      textFallback();
    }

    function brandRGB() {
      var v = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#FF4D2E";
      var hx = v.replace("#", "");
      if (hx.length === 3) hx = hx.split("").map(function (ch) { return ch + ch; }).join("");
      var num = parseInt(hx, 16) || 0xFF4D2E;
      return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    }
    var brand = brandRGB();

    function size() {
      var dpr = Math.min(devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    size(); addEventListener("resize", size);

    var lt0 = null;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!ready) return;
      if (lt0 === null) lt0 = ts;
      var t = (ts - lt0) / 1000;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(U.resolution, canvas.width, canvas.height);
      gl.uniform1f(U.time, t);
      gl.uniform1f(U.speed, 0.4);
      gl.uniform1f(U.iterations, 15);
      gl.uniform1f(U.scale, 3.12);
      gl.uniform1f(U.dotFactor, 0.04);
      gl.uniform1f(U.vOffset, 5.1);
      gl.uniform1f(U.intensityFactor, 0.07);
      gl.uniform1f(U.expFactor, 0.2);
      gl.uniform3f(U.colorFactors, 1.1, 0.7, 0.9);
      gl.uniform1f(U.colorShift, 0.9);
      gl.uniform1f(U.dotMultiplier, 0.21);
      gl.uniform1f(U.noiseIntensity, 0.4);
      gl.uniform1f(U.logoScale, 1.0);
      gl.uniform1f(U.logoInteractStrength, 0.4);
      gl.uniform3f(U.brand, brand[0], brand[1], brand[2]);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(U.logoTexture, 0);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  })();

  /* -------- AURA (fond degrade anime, technique shadergradient.co portee en vanilla) --------
     shadergradient.co est verrouille React (@shadergradient/react) sans sortie GLSL simple a
     extraire hors de ce framework ; la TECHNIQUE (bruit simplex qui fait fluer un degrade multi-
     couleurs) est reimplementee ici en WebGL brut, pilotee par les couleurs de marque reelles du
     prospect. Plein ecran derriere le hero, opacite faible : anime le fond sans jamais nuire au
     contraste du texte (charte "clair et vif"). */
  (function heroAura() {
    var canvas = document.getElementById("heroAura");
    if (!canvas || REDUCED) return;
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    var VS = "attribute vec2 aVertexPosition;\nvoid main(){ gl_Position = vec4(aVertexPosition,0.0,1.0); }";
    var FS = "precision highp float;\n" +
      "uniform vec2 u_res; uniform float u_time; uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3; uniform vec3 u_c4;\n" +
      "vec3 mod289(vec3 x){ return x-floor(x*(1.0/289.0))*289.0; } vec4 mod289(vec4 x){ return x-floor(x*(1.0/289.0))*289.0; }\n" +
      "vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); } vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159-0.85373472095314*r; }\n" +
      "float snoise(vec3 v){\n" +
      "  const vec2 C = vec2(1.0/6.0,1.0/3.0); const vec4 D = vec4(0.0,0.5,1.0,2.0);\n" +
      "  vec3 i = floor(v+dot(v,C.yyy)); vec3 x0 = v-i+dot(i,C.xxx);\n" +
      "  vec3 g = step(x0.yzx,x0.xyz); vec3 l = 1.0-g; vec3 i1 = min(g.xyz,l.zxy); vec3 i2 = max(g.xyz,l.zxy);\n" +
      "  vec3 x1 = x0-i1+C.xxx; vec3 x2 = x0-i2+C.yyy; vec3 x3 = x0-D.yyy;\n" +
      "  i = mod289(i);\n" +
      "  vec4 p = permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));\n" +
      "  float n_ = 0.142857142857; vec3 ns = n_*D.wyz-D.xzx;\n" +
      "  vec4 j = p-49.0*floor(p*ns.z*ns.z);\n" +
      "  vec4 x_ = floor(j*ns.z); vec4 y_ = floor(j-7.0*x_);\n" +
      "  vec4 x = x_*ns.x+ns.yyyy; vec4 y = y_*ns.x+ns.yyyy; vec4 h = 1.0-abs(x)-abs(y);\n" +
      "  vec4 b0 = vec4(x.xy,y.xy); vec4 b1 = vec4(x.zw,y.zw);\n" +
      "  vec4 s0 = floor(b0)*2.0+1.0; vec4 s1 = floor(b1)*2.0+1.0; vec4 sh = -step(h,vec4(0.0));\n" +
      "  vec4 a0 = b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw+s1.xzyw*sh.zzww;\n" +
      "  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);\n" +
      "  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n" +
      "  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;\n" +
      "  vec4 m = max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m = m*m;\n" +
      "  return 42.0*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n" +
      "}\n" +
      "void main(){\n" +
      "  vec2 uv = gl_FragCoord.xy/u_res; vec2 p = (uv*2.0-1.0); p.x *= u_res.x/u_res.y;\n" +
      "  float t = u_time*0.05;\n" +
      "  float n1 = snoise(vec3(p*0.7, t));\n" +
      "  float n2 = snoise(vec3(p*1.0+vec2(50.0,10.0), t*1.3));\n" +
      "  float n3 = snoise(vec3(p*1.3+vec2(120.0,80.0), t*0.8));\n" +
      "  vec3 col = mix(u_c1, u_c2, smoothstep(-0.9,0.9,n1));\n" +
      "  col = mix(col, u_c3, smoothstep(-0.1,0.9,n2)*0.55);\n" +
      "  col = mix(col, u_c4, smoothstep(0.15,0.95,n3)*0.4);\n" +
      "  float vig = 1.0-smoothstep(0.35,1.05,distance(uv, vec2(0.5)));\n" + // vignette sur uv brut (0..1) : couvre tout le rectangle, pas seulement un cercle central
      "  gl_FragColor = vec4(col, 0.24*vig);\n" +
      "}";

    function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "aVertexPosition");
    var U = {};
    ["res", "time", "c1", "c2", "c3", "c4"].forEach(function (nm) { U[nm] = gl.getUniformLocation(prog, "u_" + nm); });

    function rgb(varName, fallback) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
      var hx = v.replace("#", ""); if (hx.length === 3) hx = hx.split("").map(function (c) { return c + c; }).join("");
      var n = parseInt(hx, 16) || 0;
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    var c1 = rgb("--brand", "#FF4D2E"), c2 = rgb("--sun", "#FFC53D"), c3 = rgb("--violet", "#7B5CFF"), c4 = rgb("--cobalt", "#2B44FF");

    function size() {
      var dpr = Math.min(devicePixelRatio || 1, 1.6); // fond flou basse frequence : pas besoin de pleine dpr
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    size(); addEventListener("resize", size);

    var t0 = null;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (t0 === null) t0 = ts;
      var t = (ts - t0) / 1000;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, t);
      gl.uniform3f(U.c1, c1[0], c1[1], c1[2]);
      gl.uniform3f(U.c2, c2[0], c2[1], c2[2]);
      gl.uniform3f(U.c3, c3[0], c3[1], c3[2]);
      gl.uniform3f(U.c4, c4[0], c4[1], c4[2]);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  })();

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
