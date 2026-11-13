/* A edição em 3D (Three.js r149, local). Modelos procedurais com as artes finais do projeto como textura. */
(function () {
  const sec = document.getElementById("edicao"), canvas = document.getElementById("c3d"), nav = sec.querySelector(".atalhos");
  const tTit = document.getElementById("etapa-titulo"), tTxt = document.getElementById("etapa-texto"), btnFinal = sec.querySelector(".final3d");
  const ETAPAS = [
    ["A caixa", "Revestida em marrom, com ornamentos em foil dourado e uma aba que fecha com ímãs."],
    ["A caixa se abre", "Ela abre como a capa de um livro. Dentro, o livro vestido com a sobrecapa."],
    ["O livro", "Capa dura com a ilustração da edição, com arabescos, cardos e o casal no alto do morro."],
    ["A sobrecapa", "Em bordô e dourado, com os ornamentos em negativo. Por baixo, a capa dura."],
    ["O livro aberto", "O miolo é composto em EB Garamond, com títulos em Cinzel."],
    ["Os cards", "Quatro cards colecionáveis em colagem, com um verso comum."],
    ["Os marca-páginas", "Quatro marca-páginas da mesma coleção, para acompanhar a leitura."],
    ["A edição completa", "O livro, a contracapa, os cards e os marca-páginas, guardados na caixa."]
  ];
  const ATALHOS = [["Caixa", 0], ["Livro", 2], ["Sobrecapa", 3], ["Aberto", 4], ["Cards", 5], ["Marca-páginas", 6], ["Contracapa", 7]];
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prog = () => { const r = sec.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); };
  nav.innerHTML = ATALHOS.map(([n, e]) => `<button type="button" data-e="${e}">${n}</button>`).join("");
  nav.addEventListener("click", ev => { const b = ev.target.closest("button"); if (!b) return; const top = sec.offsetTop + (+b.dataset.e / 7) * (sec.offsetHeight - innerHeight) + 2; scrollTo({ top, behavior: reduz ? "auto" : "smooth" }); });
  function etapaTexto(f) { const i = Math.round(f); tTit.textContent = ETAPAS[i][0]; tTxt.textContent = ETAPAS[i][1]; btnFinal.hidden = f < 6.6;
    nav.querySelectorAll("button").forEach(b => { const e = +b.dataset.e; b.toggleAttribute("aria-current", false); if (e === (i === 1 ? 0 : i)) b.setAttribute("aria-current", "step"); }); }
  function falha() { canvas.hidden = true; document.getElementById("fallback3d").hidden = false; addEventListener("scroll", () => etapaTexto(prog() * 7), { passive: true }); etapaTexto(0); }
  let renderer;
  try { if (!window.THREE || !window.TEX) throw 0; renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { falha(); return; }
  const T = THREE, PI = Math.PI;
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(32, 1, 0.1, 500), mundo = new T.Group(); scene.add(mundo);
  /* ambiente de reflexo: "softboxes" para o foil e o couro */
  const pm = new T.PMREMGenerator(renderer), env = new T.Scene(); env.background = new T.Color(0x16110f);
  [[12, 5, 0, 10, 6, 7], [5, 9, -10, 3, 4, 3], [5, 9, 10, 4, -3, 2.2], [16, 2, 0, -6, 8, .7]].forEach(([w, h, x, y, z, k]) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k, k * .92, k * .8), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); });
  scene.environment = pm.fromScene(env, 0.04).texture;
  scene.add(new T.HemisphereLight(0xfff1dc, 0x2a1f1a, 0.55));
  const sol = new T.DirectionalLight(0xffe2b8, 1.7); sol.position.set(14, 30, 18); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 1, far: 90 }); sol.shadow.bias = -0.0006; sol.shadow.radius = 4; scene.add(sol);
  const fill = new T.DirectionalLight(0xa9b8ff, 0.3); fill.position.set(-16, 8, -10); scene.add(fill);
  const chao = new T.Mesh(new T.PlaneGeometry(300, 300), new T.ShadowMaterial({ opacity: 0.32 })); chao.rotation.x = -PI / 2; chao.position.y = -8; chao.receiveShadow = true; scene.add(chao);
  /* texturas */
  const tl = new T.TextureLoader(), ANI = renderer.capabilities.getMaxAnisotropy();
  const tex = (k, srgb = true) => { const t = tl.load(TEX[k]); t.encoding = srgb ? T.sRGBEncoding : T.LinearEncoding; t.anisotropy = ANI; return t; };
  const ctex = (w, h, f) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const t = new T.CanvasTexture(c); f(c.getContext("2d"), w, h, t); t.encoding = T.sRGBEncoding; t.anisotropy = ANI; return t; };
  const std = (o) => new T.MeshStandardMaterial(Object.assign({ roughness: 0.6, metalness: 0 }, o));
  const ruido = (g, w, h, base, n, a) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? "255,240,220" : "0,0,0"},${Math.random() * a})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };
  const couro = ctex(512, 512, (g, w, h) => ruido(g, w, h, "#4B3125", 26000, .16)), couroB = ctex(512, 512, (g, w, h) => ruido(g, w, h, "#808080", 30000, .5)); couroB.encoding = T.LinearEncoding;
  [couro, couroB].forEach(t => { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 3); });
  const bordaPag = (vertical) => ctex(256, 256, (g, w, h) => { g.fillStyle = "#EFE4CF"; g.fillRect(0, 0, w, h); for (let i = 0; i < 256; i += 2) { g.fillStyle = `rgba(120,95,70,${.05 + Math.random() * .12})`; vertical ? g.fillRect(i, 0, 1, h) : g.fillRect(0, i, w, 1); } });
  const pagLado = bordaPag(true), pagTopo = bordaPag(false);
  let fontesOk = document.fonts ? document.fonts.load('80px "Cinzel Decorative"').then(() => document.fonts.load('40px "EB Garamond"')) : Promise.resolve();
  const abertura = ctex(740, 1050, (g, w, h, t) => fontesOk.then(() => { g.fillStyle = "#F6EEDD"; g.fillRect(0, 0, w, h); g.fillStyle = "#6B2230"; g.textAlign = "center";
    g.font = '120px "Cinzel Decorative", serif'; g.fillText("I", w / 2, 300); g.font = '34px "Cinzel", serif'; g.fillStyle = "#30231D"; g.fillText("CAPÍTULO I", w / 2, 380);
    g.strokeStyle = "#D0A34E"; g.lineWidth = 2; g.beginPath(); g.moveTo(w / 2 - 70, 420); g.lineTo(w / 2 + 70, 420); g.stroke();
    g.fillStyle = "rgba(48,35,29,.28)"; for (let y = 520; y < h - 90; y += 34) { const l = y > h - 160 ? .5 : 1; g.fillRect(90, y, (w - 180) * l * (.9 + Math.random() * .1), 9); } t.needsUpdate = true; }));
  const guarda = ctex(740, 1050, (g, w, h, t) => { g.fillStyle = "#E9D8B8"; g.fillRect(0, 0, w, h); g.strokeStyle = "#80543A"; g.lineWidth = 3; g.strokeRect(46, 46, w - 92, h - 92); g.lineWidth = 1; g.strokeRect(62, 62, w - 124, h - 124);
    const im = new Image(); im.onload = () => { const s = 260; g.globalAlpha = .9; g.drawImage(im, (w - s) / 2, (h - s * im.height / im.width) / 2, s, s * im.height / im.width); t.needsUpdate = true; }; im.src = TEX.nv; });
  /* placa com cantos arredondados e chanfro: frente e verso com textura própria */
  function forma(w, h, r) { const s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function placa(w, h, e, r, mF, mV, mB) {
    const g = new T.Group(), s = forma(w, h, r), bt = Math.min(0.03, e * 0.3);
    const corpo = new T.Mesh(new T.ExtrudeGeometry(s, { depth: e, bevelEnabled: true, bevelThickness: bt, bevelSize: Math.min(0.03, r * .5), bevelSegments: 2, curveSegments: 6 }), mB); corpo.position.z = -e / 2; g.add(corpo);
    const fg = new T.ShapeGeometry(s, 6), p = fg.attributes.position, uv = fg.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
    const f = new T.Mesh(fg, mF); f.position.z = e / 2 + bt + 0.003; g.add(f); const v = new T.Mesh(fg, mV); v.rotation.y = PI; v.position.z = -e / 2 - bt - 0.003; g.add(v); return g;
  }
  /* LIVRO (em pé: largura em x, altura em y, espessura em z; lombada em -x) */
  const W = 14.8, H = 21, E = 2.6, EC = 0.24, borda = std({ color: 0x3b2b22, roughness: .7 });
  const livro = new T.Group(); mundo.add(livro);
  const mGuarda = std({ map: guarda, roughness: .8 });
  const tras = placa(W, H, EC, 0.22, mGuarda, std({ map: tex("contracapa"), roughness: .55 }), borda); tras.position.z = -(E / 2 - EC / 2); livro.add(tras);
  const piv = new T.Group(); piv.position.set(-W / 2, 0, E / 2 - EC / 2); livro.add(piv);
  const frente = placa(W, H, EC, 0.22, std({ map: tex("capa"), roughness: .55 }), mGuarda, borda); frente.position.x = W / 2; piv.add(frente);
  const pag = new T.Mesh(new T.BoxGeometry(W - 0.4, H - 0.5, E - 2 * EC - 0.14), [std({ map: pagLado, roughness: .9 }), std({ map: pagLado, roughness: .9 }), std({ map: pagTopo, roughness: .9 }), std({ map: pagTopo, roughness: .9 }), std({ map: abertura, roughness: .85 }), std({ color: 0xF2E8D5, roughness: .9 })]);
  pag.position.x = 0.1; livro.add(pag);
  const lomb = new T.Mesh(new T.BoxGeometry(0.3, H, E), [borda, std({ map: tex("lombada"), roughness: .55 }), borda, borda, borda, borda]); lomb.position.x = -W / 2 - 0.12; livro.add(lomb);
  /* sobrecapa (filha do livro): frente, verso, lombada e a dobra da orelha */
  const sobre = new T.Group(); livro.add(sobre); const sm = k => std({ map: tex(k), roughness: .42, metalness: .05 }), bordo = std({ color: 0x4B2127, roughness: .5 });
  const pl = (w, h, m) => new T.Mesh(new T.PlaneGeometry(w, h), m);
  const sF = pl(W + .15, H + .06, sm("sobre")); sF.position.z = E / 2 + .06; sobre.add(sF);
  const sV = pl(W + .15, H + .06, sm("sobreVerso")); sV.rotation.y = PI; sV.position.z = -E / 2 - .06; sobre.add(sV);
  const sL = pl(E + .12, H + .06, sm("sobreLomb")); sL.rotation.y = -PI / 2; sL.position.x = -W / 2 - .3; sobre.add(sL);
  const sD = pl(E + .12, H + .06, bordo); sD.rotation.y = PI / 2; sD.position.x = W / 2 + .08; sobre.add(sD);
  /* CAIXA (deitada: largura em x, profundidade em z, altura em y; dobradiça da tampa na lateral esquerda) */
  const CW = 17.2, CD = 24.5, CH = 3.0, mm = std({ map: couro, bumpMap: couroB, bumpScale: .03, roughness: .72 }), forro = std({ color: 0xD9C4A0, roughness: .9 });
  const caixa = new T.Group(); mundo.add(caixa);
  const bx = (w, h, d, m, x, y, z, pai = caixa) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); pai.add(o); return o; };
  bx(CW, .2, CD, mm, 0, .1, 0); bx(CW - .6, .06, CD - .6, forro, 0, .23, 0);
  bx(CW - .6, CH - .3, .25, [mm, mm, forro, mm, mm, forro], 0, (CH - .3) / 2 + .2, (CD - .6) / 2 - .125); bx(CW - .6, CH - .3, .25, [mm, mm, forro, mm, forro, mm], 0, (CH - .3) / 2 + .2, -(CD - .6) / 2 + .125);
  bx(.25, CH - .3, CD - .6, [mm, forro, forro, mm, mm, mm], (CW - .6) / 2 - .125, (CH - .3) / 2 + .2, 0); bx(.25, CH - .3, CD - .6, [forro, mm, forro, mm, mm, mm], -(CW - .6) / 2 + .125, (CH - .3) / 2 + .2, 0);
  bx(.25, CH, CD, [mm, std({ map: tex("dorso"), roughness: .6 }), mm, mm, mm, mm], -CW / 2 + .125, CH / 2, 0);
  const ima = std({ color: 0x2b2b2b, metalness: .9, roughness: .35 });
  [-6, 6].forEach(z => { const c = new T.Mesh(new T.CylinderGeometry(.55, .55, .06, 24), ima); c.rotation.z = PI / 2; c.position.set((CW - .6) / 2 + .03, CH * .55, z); caixa.add(c); });
  const tampaP = new T.Group(); tampaP.position.set(-CW / 2, CH, 0); caixa.add(tampaP);
  bx(CW, .22, CD, [mm, mm, std({ map: tex("tampa"), roughness: .62, bumpMap: couroB, bumpScale: .012 }), std({ map: tex("forro"), roughness: .85 }), mm, mm], CW / 2, .11, 0, tampaP);
  const ouro = (k) => std({ color: 0xD9B45E, metalness: 1, roughness: .26, alphaMap: tex(k, false), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const fo = pl(CW, CD, ouro("tampaFoil")); fo.rotation.x = -PI / 2; fo.position.set(CW / 2, .225, 0); tampaP.add(fo);
  const abaP = new T.Group(); abaP.position.set(CW, .22, 0); tampaP.add(abaP);
  bx(.22, CH, CD, [std({ map: tex("aba"), roughness: .62 }), forro, mm, mm, mm, mm], .11, -CH / 2, 0, abaP);
  const fa = pl(CD, CH, ouro("abaFoil")); fa.rotation.y = PI / 2; fa.position.set(.225, -CH / 2, 0); abaP.add(fa);
  [-6, 6].forEach(z => { const c = new T.Mesh(new T.CylinderGeometry(.55, .55, .06, 24), ima); c.rotation.z = PI / 2; c.position.set(-.02, -CH * .45, z); abaP.add(c); });
  /* CARDS e MARCA-PÁGINAS */
  const creme = std({ color: 0xEFE6D6, roughness: .8 }), cards = [], marcs = [];
  for (let i = 0; i < 4; i++) { const c = placa(10.5, 14.8, .05, .35, std({ map: tex("card" + (i + 1)), roughness: .5 }), std({ map: tex("cardVerso"), roughness: .5 }), creme); mundo.add(c); cards.push(c); }
  const fitas = [0x6B2230, 0x304A30, 0xD0A34E, 0x30231D];
  for (let i = 0; i < 4; i++) { const m = placa(5, 18, .04, .25, std({ map: tex("marc" + (i + 1)), roughness: .5 }), std({ map: tex("marcVerso"), roughness: .5 }), creme);
    const cor = std({ color: fitas[i], roughness: .7 }), fio = new T.Mesh(new T.CylinderGeometry(.04, .04, 3.4, 6), cor); fio.position.y = 9 + 1.7; m.add(fio);
    const borla = new T.Mesh(new T.ConeGeometry(.42, 1.6, 10), cor); borla.position.y = 9 + 3.4 + .2; borla.rotation.z = PI; m.add(borla); mundo.add(m); marcs.push(m); }
  mundo.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); fo.castShadow = fa.castShadow = false;
  /* KEYFRAMES por etapa (0 a 7): [posição, rotação, escala] */
  const K = (p, r = [0, 0, 0], s = 1) => ({ p, r, s });
  const L = [K([.3, -6.45, 0], [-PI / 2, 0, 0]), K([.3, -6.45, 0], [-PI / 2, 0, 0]), K([0, 4, 6], [0, -.45, 0]), K([-2, 4, 6], [0, .2, 0]), K([7, 4, 4]), K([-14, 3, -4], [0, .55, 0], .8), K([-14, 3, -4], [0, .55, 0], .8), K([-2, -6.7, 0], [-PI / 2, PI, 0])];
  const C = [K([0, -8, 0]), K([0, -8, 0]), K([2, -8, -12], [0, .35, 0]), K([-8, -8, -14], [0, .5, 0]), K([-8, -8, -14], [0, .5, 0]), K([0, -8, -12]), K([0, -8, -12]), K([17, -8, -2], [0, -.35, 0])];
  const S = [K([0, 0, 0]), K([0, 0, 0]), K([0, 0, 0]), K([19, 0, -2], [0, -.5, 0]), K([24, 0, -6], [0, -.6, 0]), K([24, 0, -6], [0, -.6, 0]), K([24, 0, -6]), K([24, 0, -6])];
  const tampa = [0, 1.95, 1.95, 1.95, 1.95, 1.95, 1.95, 1.95], aba = [0, PI / 2, PI / 2, PI / 2, PI / 2, PI / 2, PI / 2, PI / 2], abre = [0, 0, 0, 0, -.94 * PI, -.94 * PI, -.94 * PI, 0];
  const dentro = (k, y) => K([C[k].p[0], -7.2 + y, C[k].p[2]], [-PI / 2, 0, 0], .4);
  const CA = cards.map((_, i) => { const o = i - 1.5; return [0, 1, 2, 3, 4].map(k => dentro(k, i * .05)).concat([K([2 + o * 6.2, 4 - Math.abs(o) * .8, 4 + i * .06], [0, 0, -o * .12]), K([2 + o * 6.2, 9.5 - Math.abs(o) * .8, 1 + i * .06], [0, 0, -o * .12]), K([4 + i * 3.2, -5.3 + i * .07, -2 + i * 1.2], [-PI / 2, 0, -.25 + i * .12])]); });
  const MA = marcs.map((_, i) => { const o = i - 1.5; return [0, 1, 2, 3, 4, 5].map(k => dentro(k, i * .04)).concat([K([2 + o * 3.4, -1.5, 6 + i * .05], [0, 0, -o * .1]), K([-8 + i * 2.2, -5.25 + i * .05, i * .3], [-PI / 2, 0, .2 - i * .13])]); });
  const CAM = [[[0, 22, 38], [0, -3, 0]], [[0, 26, 30], [0, -4, 0]], [[0, 9, 42], [0, 3, 0]], [[0, 9, 40], [0, 3, 0]], [[2, 9, 38], [1, 4, 0]], [[0, 8, 44], [0, 4, 0]], [[0, 6, 46], [0, 3, 0]], [[0, 54, .01], [0, -6, 0]]];
  /* interpolação com pausa em cada etapa e "estalo" do ímã na aba */
  const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, salto = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const seg = f => { const k = Math.min(6, Math.floor(f)), u = Math.min(1, Math.max(0, (f - k - .15) / .7)); return [k, u]; };
  const lerp = (a, b, u) => a + (b - a) * u, lv = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
  function aplica(o, arr, f, fn = ease) { const [k, u] = seg(f), e = fn(u), A = arr[k], B = arr[k + 1]; o.position.fromArray(lv(A.p, B.p, e)); o.rotation.set(...lv(A.r, B.r, e)); o.scale.setScalar(lerp(A.s, B.s, e)); }
  const num = (arr, f, fn = ease) => { const [k, u] = seg(f); return lerp(arr[k], arr[k + 1], fn(u)); };
  /* interação: arrastar para girar, com inércia */
  let rot = 0, vel = 0, arrasto = null, tBal = 0;
  canvas.addEventListener("pointerdown", e => { arrasto = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = "grabbing"; });
  canvas.addEventListener("pointermove", e => { if (arrasto === null) return; vel = (e.clientX - arrasto) * .006; arrasto = e.clientX; });
  const solta = () => { arrasto = null; canvas.style.cursor = ""; rot = Math.atan2(Math.sin(rot), Math.cos(rot)); };   // volta pelo caminho mais curto canvas.addEventListener("pointerup", solta); canvas.addEventListener("pointercancel", solta);
  function tamanho() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener("resize", tamanho); tamanho();
  const alvo = new T.Vector3(), up1 = new T.Vector3(0, 1, 0), up2 = new T.Vector3(0, 0, -1);
  let ativo = false, ultimo = -1, t0 = performance.now();
  function quadro(now) {
    if (!ativo) return; requestAnimationFrame(quadro);
    const f = prog() * 7, dt = Math.min(50, now - t0) / 16.7; t0 = now;
    if (Math.round(f) !== ultimo) { ultimo = Math.round(f); etapaTexto(f); }
    aplica(livro, L, f); aplica(caixa, C, f); aplica(sobre, S, f); sobre.visible = f < 4.6;
    tampaP.rotation.z = num(tampa, f); abaP.rotation.z = num(aba, Math.min(f, 1) < 1 ? Math.min(1, f * 1.6) : f, salto); piv.rotation.y = num(abre, f);
    cards.forEach((c, i) => { aplica(c, CA[i], f); c.visible = f > 4.45; }); marcs.forEach((m, i) => { aplica(m, MA[i], f); m.visible = f > 5.45; });
    /* sem arrasto, as peças ficam sempre de frente: balanço leve só na caixa fechada e mola que traz de volta depois do giro */
    rot += vel * dt; vel *= Math.pow(.92, dt); tBal += dt;
    if (arrasto === null) { const alvoR = !reduz && f < .6 ? Math.sin(tBal * .014) * .32 : 0; rot += (alvoR - rot) * (1 - Math.pow(.955, dt)); }
    mundo.rotation.y = rot;
    const [k, u] = seg(f), e = ease(u), cp = lv(CAM[k][0], CAM[k + 1][0], e), ct = lv(CAM[k][1], CAM[k + 1][1], e);
    const fat = camera.aspect < 1 ? Math.max(1, 1.15 / camera.aspect) * 1.05 : 1.55;   // no computador a câmera fica mais longe, com a peça inteira alvo.fromArray(ct);
    camera.position.set(ct[0] + (cp[0] - ct[0]) * fat, ct[1] + (cp[1] - ct[1]) * fat, ct[2] + (cp[2] - ct[2]) * fat);
    camera.up.copy(up1).lerp(up2, k === 6 ? e : k === 7 ? 1 : 0).normalize(); camera.lookAt(alvo);
    renderer.render(scene, camera);
  }
  new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !ativo) { ativo = true; t0 = performance.now(); requestAnimationFrame(quadro); } ativo = v; }).observe(sec);
  etapaTexto(0);
})();
