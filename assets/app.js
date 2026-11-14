/* Página de lançamento · O Morro dos Ventos Uivantes · Editora Novos Ventos (protótipo acadêmico, TGI Unifran) */
const CONFIG = {
  edicao: "O Morro dos Ventos Uivantes", subtitulo: "Edição de luxo e limitada",
  preco: 329.90, pixDesconto: 0.10, parcelasMax: 10,                       // provisórios
  frete: { valor: [14.9, 16.9, 19.9, 19.9, 24.9, 24.9, 29.9, 27.9, 12.9, 14.9], prazo: [4, 5, 6, 6, 8, 8, 10, 9, 3, 4], porItemExtra: 3.5 },
  ficha: [["Autora", "Emily Brontë", "autora"], ["Editora", "Novos Ventos", "editora"], ["Formato", "A5 (14,8 × 21 cm)", "formato"], ["Páginas", "348", "paginas"],
    ["Papel", "Chambril 180 g/m²", "papel"], ["Acabamento", "Capa dura com sobrecapa em bordô e dourado", "capa"], ["Itens", "Livro, caixa com ímãs, 4 cards e 4 marca-páginas", "caixa"], ["Tiragem", "Limitada", "tiragem"]],
  contato: { instagram: "@editoranovosventos_", instagramUrl: "https://www.instagram.com/editoranovosventos_/", email: "a confirmar" },
  links: { privacidade: "#", termos: "#" }
};
document.documentElement.classList.add("js");
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), f1 = v => v.toFixed(1);
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
let rs = 11; const aleat = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };

/* ---------- ARABESCOS em SVG: volutas e folhas de acanto, dourado para bronze, pontas que somem ---------- */
function fita(pts, wf) { const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const d = Math.hypot(tx, ty) || 1; tx /= d; ty /= d; const w = wf(i / (n - 1)) / 2;
    L.push([pts[i][0] - ty * w, pts[i][1] + tx * w]); R.push([pts[i][0] + ty * w, pts[i][1] - tx * w]); }
  return "M" + L.concat(R.reverse()).map(p => f1(p[0]) + " " + f1(p[1])).join("L") + "Z"; }
function bez(p0, p1, p2, p3, n = 18) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])); } return o; }
function espiral(cx, cy, r0, voltas, dir, a0, n = 44) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, r = r0 * (1 - .8 * t), a = a0 + dir * t * voltas * 2 * Math.PI; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return o; }
function voluta(P, dx, dy, r0, dir, a0) { const C = [P[0] + dx, P[1] + dy], S = [C[0] + r0 * Math.cos(a0), C[1] + r0 * Math.sin(a0)];
  return bez(P, [P[0] + dx * .35, P[1] + dy * .05], [S[0] - dx * .35, S[1] - dy * .35], S, 14).concat(espiral(C[0], C[1], r0, 1.4, dir, a0).slice(1)); }
function folha(x, y, ang, len, larg, dir = 1, lobos = 3) { const up = [], dn = [], nv = [], n = 26;
  for (let i = 0; i <= n; i++) { const t = i / n, mid = dir * .22 * len * t * t, s = Math.pow(Math.sin(Math.PI * t), .75);
    up.push([t * len, mid - larg * s * (1 + .24 * Math.cos(lobos * 2 * Math.PI * t)) * (1 - .3 * t)]); dn.push([t * len, mid + larg * .42 * Math.pow(Math.sin(Math.PI * t), .9)]); if (i % 3 === 0) nv.push([t * len * .92, mid]); }
  const c = Math.cos(ang), s = Math.sin(ang), tr = p => [x + p[0] * c - p[1] * s, y + p[0] * s + p[1] * c], pt = a => a.map(tr).map(p => f1(p[0]) + " " + f1(p[1])).join("L");
  return { d: "M" + pt(up.concat(dn.reverse())) + "Z", nv: "M" + pt(nv) }; }
function faixaSVG() { let d = "", nv = ""; const xs = y => 70 + 20 * Math.sin(y / 150 + .6), caule = []; for (let y = -20; y <= 1020; y += 10) caule.push([xs(y), y]);
  d += `<path d="${fita(caule, () => 3.6)}"/>`;
  for (let k = 0, y = 70; y < 980; y += 128, k++) { const s = k % 2 ? 1 : -1, P = [xs(y), y];
    d += `<path d="${fita(voluta(P, s * 40, 46, 19 + (k * 7) % 5, s, -Math.PI / 2), t => 3.4 * (1 - t) + .7)}"/><circle cx="${f1(P[0] + s * 41)}" cy="${f1(y + 47)}" r="2.6"/>`;
    for (const F of [folha(P[0], P[1], s > 0 ? -.75 : Math.PI + .75, 44, 12, s > 0 ? 1 : -1), folha(P[0], y + 54, s > 0 ? Math.PI + .5 : -.5, 26, 7, s > 0 ? -1 : 1)]) { d += `<path d="${F.d}"/>`; nv += F.nv; } }
  return `${d}<path d="${nv}" fill="none" stroke="#6E4A1C" stroke-width=".7" opacity=".7"/>`; }
function cantoSVG(desenho) { const tr = [bez([14, 14], [70, 6], [120, 30], [168, 22]).concat(espiral(168, 40, 18, 1.3, 1, -Math.PI / 2, 36).slice(1)), bez([14, 14], [6, 70], [30, 120], [22, 168]).concat(espiral(40, 168, 18, 1.3, -1, Math.PI, 36).slice(1)),
    voluta([60, 14], 14, 22, 9, 1, -Math.PI / 2), voluta([14, 60], 22, 14, 9, -1, Math.PI)];
  let s = tr.map(p => desenho ? `<path class="tr" pathLength="1" stroke-dasharray="1" d="M${p.map(q => f1(q[0]) + " " + f1(q[1])).join("L")}"/>` : `<path d="${fita(p, t => 2.6 * (1 - t) + .6)}"/>`).join("");
  let f = "", nv = ""; for (const F of [folha(16, 16, Math.PI / 4, 48, 11, 1), folha(16, 16, Math.PI / 4 - .55, 34, 8, 1), folha(16, 16, Math.PI / 4 + .55, 34, 8, -1)]) { f += `<path d="${F.d}"/>`; nv += F.nv; }
  return desenho ? `<g fill="none" stroke="url(#ar-ouro)" stroke-width="2.2" stroke-linecap="round">${s}</g><g fill="url(#ar-ouro)">${f}</g>` : `${s}${f}<path d="${nv}" fill="none" stroke="#6E4A1C" stroke-width=".7" opacity=".7"/>`; }
function divSVG() { let d = `<path d="M300 17 L313 30 L300 43 L287 30Z"/>`, nv = "";
  for (const s of [-1, 1]) { const pts = []; for (let x = 0; x <= 272; x += 6) pts.push([300 + s * (16 + x), 30 + 4 * Math.sin(x / 38)]); d += `<path d="${fita(pts, t => 2.6 * (1 - t) + .5)}"/>`;
    const P1 = [300 + s * 86, 30 + 4 * Math.sin(70 / 38)], P2 = [300 + s * 166, 30 + 4 * Math.sin(150 / 38)];
    d += `<path d="${fita(voluta(P1, s * 16, -14, 8, s, Math.PI / 2), t => 2.4 * (1 - t) + .5)}"/><path d="${fita(voluta(P2, s * 16, 14, 8, -s, -Math.PI / 2), t => 2.4 * (1 - t) + .5)}"/>`;
    for (const F of [folha(300 + s * 15, 30, s > 0 ? -.15 : Math.PI + .15, 34, 8, s > 0 ? -1 : 1), folha(300 + s * 120, 30 + 4 * Math.sin(104 / 38), s > 0 ? -.55 : Math.PI + .55, 24, 6, s > 0 ? 1 : -1)]) { d += `<path d="${F.d}"/>`; nv += F.nv; } }
  return `${d}<path d="${nv}" fill="none" stroke="#6E4A1C" stroke-width=".6" opacity=".7"/>`; }
$("#defs-ar").innerHTML = `<defs><linearGradient id="ar-ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0D58F"/><stop offset=".35" stop-color="#D0A34E"/><stop offset=".7" stop-color="#A57634"/><stop offset="1" stop-color="#80543A"/></linearGradient>
  <filter id="ar-sombra" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="1.6" stdDeviation="1.1" flood-color="#1a0f08" flood-opacity=".5"/></filter>
  <linearGradient id="fade-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <linearGradient id="fade-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".16" stop-color="#fff"/><stop offset=".84" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <radialGradient id="fade-c" cx="0" cy="0" r="1"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
  <mask id="m-v" maskUnits="userSpaceOnUse" x="-60" y="0" width="260" height="1000"><rect x="-60" width="260" height="1000" fill="url(#fade-v)"/></mask>
  <mask id="m-h" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="60"><rect width="600" height="60" fill="url(#fade-h)"/></mask>
  <mask id="m-c" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#fade-c)"/></mask></defs>
  <symbol id="ar-faixa" viewBox="0 0 140 1000"><g mask="url(#m-v)" filter="url(#ar-sombra)" fill="url(#ar-ouro)">${faixaSVG()}</g></symbol>
  <symbol id="ar-canto" viewBox="0 0 200 200"><g mask="url(#m-c)" filter="url(#ar-sombra)" fill="url(#ar-ouro)">${cantoSVG(false)}</g></symbol>
  <symbol id="ar-div" viewBox="0 0 600 60"><g mask="url(#m-h)" filter="url(#ar-sombra)" fill="url(#ar-ouro)">${divSVG()}</g></symbol>`;

/* ---------- conteúdo vindo do CONFIG ---------- */
const ICO = { capa: "M10 8h24a4 4 0 0 1 4 4v28H14a4 4 0 0 1-4-4z M14 40a4 4 0 0 1 0-8h24", sobre: "M8 10h32v28H8z M14 10v28 M34 10v28 M20 20l4-4 4 4-4 4z", caixa: "M6 18h36v22H6z M6 18l6-8h30v8 M40 26v6",
  foil: "M24 6l4 12h12l-10 7 4 12-10-8-10 8 4-12-10-7h12z", cards: "M8 12h20v28H8z M20 8h20v28", marc: "M14 4h8v36l-4-4-4 4z M30 4h8v36l-4-4-4 4z", tipo: "M10 38L22 10h4l12 28 M15 28h18",
  ilus: "M8 38c8-14 14-20 32-28 M14 30c6 0 10 2 12 6 M22 22c5 0 8 2 10 5", autora: "M38 6C26 8 16 18 12 32l-4 10 8-6c12-4 20-14 22-30z M12 32l10-10", editora: "M24 5l17 9v20l-17 9-17-9V14z M18 30V18l12 12V18",
  formato: "M14 8h20v32H14z M8 8v32 M6 11l2-3 2 3 M6 37l2 3 2-3", paginas: "M12 10h22v30H12z M16 6h22v30 M16 18h14 M16 24h14 M16 30h10", papel: "M12 6h16l8 8v28H12z M28 6v8h8",
  tiragem: "M14 6h20 M14 42h20 M16 6c0 12 16 12 16 18s-16 6-16 18 M32 6c0 12-16 12-16 18s16 6 16 18" };
const CANTO = `<svg class="canto" viewBox="0 0 200 200" aria-hidden="true">${cantoSVG(true)}</svg>`, ico = k => `<svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><path d="${ICO[k]}"/></svg>`;
const DET = [["capa", "Capa dura", "Capa rígida com a ilustração da edição."], ["sobre", "Sobrecapa", "Em bordô e dourado, com os ornamentos em negativo."], ["caixa", "Caixa com ímãs", "Abre como um livro e guarda o livro, os cards e os marca-páginas."],
  ["foil", "Foil dourado", "Detalhes metálicos aplicados na caixa."], ["cards", "4 cards", "Cards colecionáveis em colagem, com verso comum."], ["marc", "4 marca-páginas", "Marca-páginas ilustrados, da mesma coleção."],
  ["tipo", "Tipografia", "Cinzel Decorative e EB Garamond."], ["ilus", "Ilustrações e colagens", "Arabescos, cardos e colagens com imagens de época."]];
$("#grade-det").innerHTML = DET.map(([k, t, d]) => `<li>${CANTO}${ico(k)}<h3>${t}</h3><p>${d}</p></li>`).join("");
$("#ficha-corpo").innerHTML = CONFIG.ficha.map(([k, v, i]) => `<li>${CANTO}${ico(i)}<h3>${k}</h3><p class="val">${v}</p></li>`).join("");
$("#preco").textContent = brl(CONFIG.preco); $("#parc").textContent = `ou ${CONFIG.parcelasMax}x de ${brl(CONFIG.preco / CONFIG.parcelasMax)} sem juros`;
$("#pixlinha").textContent = `${brl(CONFIG.preco * (1 - CONFIG.pixDesconto))} no Pix (${Math.round(CONFIG.pixDesconto * 100)}% de desconto)`; $("#barra-preco").textContent = brl(CONFIG.preco);
$("#l-insta").href = CONFIG.contato.instagramUrl; $("#insta-txt").textContent = CONFIG.contato.instagram; $("#email-txt").textContent = "E-mail: " + CONFIG.contato.email;
$("#l-priv").href = CONFIG.links.privacidade; $("#l-termos").href = CONFIG.links.termos;
$("#b-mail").onclick = async () => { const e = CONFIG.contato.email; if (!e.includes("@")) { $("#email-ok").textContent = "Endereço a confirmar."; return; } try { await navigator.clipboard.writeText(e); } catch { } $("#email-ok").textContent = "E-mail copiado."; };
const FAQ = [["O que vem na caixa?", "O livro em capa dura com a sobrecapa em bordô e dourado, 4 cards e 4 marca-páginas, guardados na caixa com fecho de ímãs."],
  ["Qual é o prazo de entrega?", "O prazo aparece na compra, assim que você informa o CEP. Nesta demonstração, frete e prazo são simulados."],
  ["Quais são as formas de pagamento?", `Pix com ${Math.round(CONFIG.pixDesconto * 100)}% de desconto, cartão em até ${CONFIG.parcelasMax}x sem juros ou à vista no cartão.`],
  ["A edição é limitada?", "Sim. A tiragem é limitada, e a quantidade de exemplares será informada pela editora."]];
$("#faq-lista").innerHTML = FAQ.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join("");

/* ---------- MORRO com o casal pisando na crista (ponto mais alto via getPointAtLength) ---------- */
function morro(svg, pico, cor, pxFn) {
  const W = 1200, H = 400, cx = W / 2, y = x => H * .98 - (H * .98 - pico * H) * Math.exp(-(((x - cx) / (W * .3)) ** 2)) - 5 * Math.sin(x / 37) * (1 - Math.exp(-(((x - cx) / 90) ** 2)));
  let top = "", g = ""; for (let x = -60; x <= W + 60; x += 8) top += (x === -60 ? "M" : "L") + x + " " + f1(y(x));
  for (let x = -40; x < W + 40; x += 3.2) { const b = y(x) + 2, a = (aleat() - .5) * .9, l = 5 + aleat() * 9; g += `M${f1(x)} ${f1(b)}l${f1(Math.sin(a) * l)} ${f1(-Math.cos(a) * l)}`; }
  const id = svg.id + "-d";
  svg.innerHTML = `<defs><filter id="${id}" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="2.4"/></filter></defs><path class="crista" d="${top}" fill="none"/>
    <path d="${top} L${W + 60} ${H + 40} L-60 ${H + 40}Z" fill="${cor}"/><path d="${g}" stroke="${cor}" stroke-width="1.3" stroke-linecap="round" fill="none"/>
    <ellipse class="sombra-c" fill="rgba(14,9,6,.55)" filter="url(#${id})"/><g class="casal-g"><image class="casal-img" href="assets/img/casal.svg" preserveAspectRatio="xMidYMax meet"/></g>`;
  svg._px = pxFn; posiciona(svg);
}
function posiciona(svg) {
  const cr = $(".crista", svg), L = cr.getTotalLength(); let b = { y: 1e9 };
  for (let i = 0; i <= 480; i++) { const p = cr.getPointAtLength(L * i / 480); if (p.y < b.y) b = { x: p.x, y: p.y }; }
  const m = svg.getScreenCTM(), k = m && m.a ? m.a : 1, w = svg._px() / k, h = w / 1.562, din = 2 / k, im = $(".casal-img", svg), sh = $(".sombra-c", svg);
  Object.entries({ x: b.x - w / 2, y: b.y - h + din, width: w, height: h }).forEach(([a, v]) => im.setAttribute(a, f1(v)));
  Object.entries({ cx: b.x, cy: b.y + din, rx: w * .42, ry: Math.max(3, 5 / k) }).forEach(([a, v]) => sh.setAttribute(a, f1(v)));
  $(".casal-g", svg).style.transformOrigin = `${f1(b.x)}px ${f1(b.y)}px`;
  if (svg.id === "morro-hero") folga(svg);
}
/* desce o morro do hero quando os botões ficariam sobre o casal ou a crista (telas largas e baixas) */
function folga(svg) {
  const box = svg.parentNode, ac = $(".hero .acoes"); box.style.transform = ""; if (!ac) return;
  const a = ac.getBoundingClientRect(), c = $(".casal-img", svg).getBoundingClientRect(), m = $(".crista", svg).getBoundingClientRect();
  const d = a.bottom + 26 - Math.min(c.top, m.top); if (d > 0) box.style.transform = `translateY(${Math.ceil(d)}px)`;
}
const mHero = $("#morro-hero");
morro(mHero, .2, "#30231D", () => clamp(innerWidth * .09, 64, 150));

/* ---------- VENTO: folhas em trajetórias curvas e linhas de vento, sempre da esquerda para a direita ---------- */
const VENTO = { f: 1, alvo: 1 }, CORES_F = ["#80543A", "#5A3A28", "#4D6836", "#304A30", "#B98A45", "#9C6B3F"];
class Vento {
  constructor(cv, o) { this.cv = cv; this.g = cv.getContext("2d"); this.o = Object.assign({ n: 20, linhas: 3, alfa: 1, vel: 1, cor: "128,84,58" }, o); this.on = false; this.mult = 1; this.t = 0; this.tam(); }
  tam() { const r = this.cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); this.W = r.width || innerWidth; this.H = r.height || innerHeight;
    this.cv.width = this.W * d; this.cv.height = this.H * d; this.g.setTransform(d, 0, 0, d, 0, 0);
    this.fs = Array.from({ length: Math.round(this.o.n * (this.W < 600 ? .55 : 1)) }, () => this.nova(true));
    this.ls = Array.from({ length: this.o.linhas }, () => ({ y: this.H * (.1 + .55 * Math.random()), x: -Math.random() * this.W, c: this.W * (.3 + Math.random() * .3), a: 10 + Math.random() * 16, v: .6 + Math.random() * .6 })); }
  nova(ini) { return { x: ini ? Math.random() * this.W : -30 - Math.random() * 90, y: Math.random() * this.H * .85, v: .7 + Math.random() * 1.1, amp: 12 + Math.random() * 26, fr: .02 + Math.random() * .03, ph: Math.random() * 6.3,
    r: Math.random() * 6.3, vr: (Math.random() - .5) * .05, s: 4 + Math.random() * 6, c: CORES_F[Math.floor(Math.random() * CORES_F.length)] }; }
  passo(dt) { const k = VENTO.f * this.o.vel * this.mult, g = this.g; g.clearRect(0, 0, this.W, this.H); this.t += dt; g.lineWidth = 1;
    for (const l of this.ls) { l.x += l.v * k * dt * 1.4; if (l.x > this.W) { l.x = -l.c; l.y = this.H * (.1 + .55 * Math.random()); }
      const gr = g.createLinearGradient(l.x, 0, l.x + l.c, 0); gr.addColorStop(0, `rgba(${this.o.cor},0)`); gr.addColorStop(.5, `rgba(${this.o.cor},${.4 * this.o.alfa})`); gr.addColorStop(1, `rgba(${this.o.cor},0)`);
      g.strokeStyle = gr; g.beginPath(); for (let x = 0; x <= l.c; x += 8) { const yy = l.y + Math.sin((l.x + x) / 90 + this.t * .03) * l.a * .4; x ? g.lineTo(l.x + x, yy) : g.moveTo(l.x + x, yy); } g.stroke(); }
    g.globalAlpha = this.o.alfa;
    for (const f of this.fs) { f.x += f.v * k * dt; f.ph += f.fr * dt * Math.min(2.5, k); f.r += f.vr * dt * k; if (f.x > this.W + 40) Object.assign(f, this.nova(false));
      const fl = Math.cos(f.ph * 1.7); g.save(); g.translate(f.x, f.y + Math.sin(f.ph) * f.amp); g.rotate(f.r); g.scale(1, .3 + .7 * Math.abs(fl)); g.fillStyle = f.c; g.beginPath();
      g.moveTo(-f.s, 0); g.bezierCurveTo(-f.s * .5, -f.s * .62, f.s * .5, -f.s * .62, f.s, 0); g.bezierCurveTo(f.s * .5, f.s * .62, -f.s * .5, f.s * .62, -f.s, 0); g.fill();
      g.strokeStyle = "rgba(48,35,29,.55)"; g.lineWidth = .6; g.beginPath(); g.moveTo(-f.s, 0); g.lineTo(f.s, 0); g.stroke(); g.restore(); }
    g.globalAlpha = 1; }
}
const vHero = new Vento($("#vento-hero"), { n: 22, linhas: 4 }), vCena = new Vento($("#vento-cena"), { n: 30, linhas: 5, cor: "244,235,218", alfa: .9 }), vGlobal = new Vento($("#vento-global"), { n: 9, linhas: 2, alfa: .5 });
vGlobal.on = !reduz;
new IntersectionObserver(es => es.forEach(e => { e.target === $("#hero") ? vHero.vis = e.isIntersecting : vCena.on = e.isIntersecting; })).observe($("#hero"));
if (reduz) { vHero.passo(0); vCena.passo(0); }

/* ---------- HERO: risco de pincel, rasgo, nome da autora e lamparina ---------- */
const hero = $("#hero"), bege = $("#bege"), escura = $("#escura"), fibra = $("#fibra"), bloco = $("#ellis-bloco"), nomeE = $("#ellis-nome"), pincel = $("#pincel"), ellis = $(".ellis"), legenda = $("#legenda-risco"), heroTxt = $("#hero-texto"), emily = $("#emily");
let PC = null;
function montaPincel() {
  const b = bloco.getBoundingClientRect(), r = nomeE.getBoundingClientRect(); if (!r.width) return;
  const x0 = r.left - b.left - r.width * .05, x1 = r.right - b.left + r.width * .05, H = r.height, yc = r.top - b.top + H * .52, L = x1 - x0, N = 110;
  let s = 5; const rn = () => ((s = (s * 16807) % 2147483647) / 2147483647 - .5);
  const T = [], B = [], T2 = [], B2 = [];
  for (let i = 0; i <= N; i++) { const t = i / N, x = x0 + L * t, env = Math.pow(Math.min(1, t / .06, (1 - t) / .05), .55), w = H * (.085 + .05 * Math.pow(Math.sin(Math.PI * t), .6)) * env, c = yc + Math.sin(t * 5.2) * H * .012;
    T.push([x, c - w * (1 + .1 * rn())]); B.push([x, c + w * (1 + .1 * rn())]); T2.push([x + 3, c - H * .025 - w * .55 * (1 + .15 * rn())]); B2.push([x + 3, c - H * .025 + w * .55 * (1 + .15 * rn())]); }
  const poli = (a, z) => "M" + a.concat(z.slice().reverse()).map(p => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
  const dx = x0 + L * .86, dy = B[Math.round(N * .86)][1] - 2, gw = H * .028;
  const pingo = `M${f1(dx - gw)} ${f1(dy)} C ${f1(dx - gw * .6)} ${f1(dy + H * .14)}, ${f1(dx + gw * .2)} ${f1(dy + H * .22)}, ${f1(dx)} ${f1(dy + H * .26)} C ${f1(dx + gw * 1.6)} ${f1(dy + H * .27)}, ${f1(dx + gw * 1.2)} ${f1(dy + H * .1)}, ${f1(dx + gw)} ${f1(dy)}Z`;
  pincel.setAttribute("width", b.width); pincel.setAttribute("height", b.height);
  pincel.innerHTML = `<defs><filter id="seco" x="-5%" y="-40%" width="110%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.018 0.3" numOctaves="2" seed="4" result="t1"/>
    <feDisplacementMap in="SourceGraphic" in2="t1" scale="${f1(H * .06)}" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="0.9 0.045" numOctaves="1" seed="9" result="t2"/>
    <feColorMatrix in="t2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.6 2.05" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>
    <linearGradient id="tinta-g" x1="0" x2="1"><stop offset="0" stop-color="#7E2232"/><stop offset=".45" stop-color="#8E2A3A"/><stop offset="1" stop-color="#A3354A"/></linearGradient>
    <clipPath id="pc-clip"><rect id="pc-rect" x="${f1(x0 - H)}" y="-10" width="0" height="${f1(b.height + H)}"/></clipPath></defs>
    <g clip-path="url(#pc-clip)"><g transform="rotate(-1.5 ${f1((x0 + x1) / 2)} ${f1(yc)})" filter="url(#seco)"><path d="${poli(T, B)}" fill="url(#tinta-g)" opacity=".95"/><path d="${poli(T2, B2)}" fill="#8E2A3A" opacity=".5"/><path d="${pingo}" fill="#8E2A3A" opacity=".85"/></g></g>`;
  PC = { L: L + 2 * H, r: $("#pc-rect", pincel) };
}
const N = 64, ruido = Array.from({ length: N + 1 }, (_, i) => 10 * Math.sin(i * .7) + 7 * Math.sin(i * 1.9 + 1) + (aleat() - .5) * 16), banda = Array.from({ length: N + 1 }, () => 4 + aleat() * 9);
let brilhou = false;
function quadroHero() {
  const s = clamp(-hero.getBoundingClientRect().top / innerHeight, 0, 9), p = clamp(s / 2), W = innerWidth, H = innerHeight, tr = clamp((p - .12) / .26);
  if (PC) PC.r.setAttribute("width", f1(PC.L * (reduz ? (tr > 0 ? 1 : 0) : tr)));
  ellis.style.color = tr > .6 ? "#8C7B68" : ""; legenda.classList.toggle("on", p > .27);
  const t = clamp((p - .38) / .32);
  if (reduz) { escura.style.opacity = t > .5 ? 0 : 1; fibra.style.display = "none"; }
  else if (t <= 0) { escura.style.clipPath = "none"; escura.style.visibility = ""; fibra.style.clipPath = "polygon(0 0,0 0,0 0)"; }
  else if (t >= 1) { escura.style.visibility = "hidden"; fibra.style.clipPath = "polygon(0 0,0 0,0 0)"; }
  else { escura.style.visibility = ""; const base = (1 - t) * (H + 60) - 30, amp = 1 + t * 1.5, ys = ruido.map(v => base + v * amp), xs = ys.map((_, i) => (i / N) * W);
    let a = `0px 0px,${W}px 0px`, f = ""; for (let i = N; i >= 0; i--) a += `,${f1(xs[i])}px ${f1(ys[i])}px`;
    for (let i = 0; i <= N; i++) f += `${i ? "," : ""}${f1(xs[i])}px ${f1(ys[i] - 1)}px`; for (let i = N; i >= 0; i--) f += `,${f1(xs[i])}px ${f1(ys[i] + banda[i] * amp)}px`;
    escura.style.clipPath = `polygon(${a})`; fibra.style.clipPath = `polygon(${f})`; }
  const rev = reduz ? (p > .5 ? 1 : 0) : clamp((p - .7) / .14); emily.style.setProperty("--rev", f1(rev * 100 / 100)); heroTxt.classList.toggle("on", p > .68 || (reduz && p > .5));
  if (rev >= 1 && !brilhou) { brilhou = true; emily.classList.add("brilho"); }
  /* a cena continua no mesmo morro: o nome sobe e some, o papel dá lugar ao céu e a frase de Catherine se escreve */
  const u1 = reduz ? (s > 2.4 ? 1 : 0) : clamp((s - 2.15) / .45), u2 = reduz ? (s > 2.5 ? 1 : 0) : clamp((s - 2.35) / .5);
  heroTxt.style.transform = u1 ? `translateY(${(-u1 * 26).toFixed(2)}vh)` : ""; heroTxt.style.opacity = u1 ? (1 - u1).toFixed(3) : ""; heroTxt.style.pointerEvents = u1 > .5 ? "none" : "";
  bege.style.setProperty("--papel", (1 - u2).toFixed(3));
  quadroCena(clamp((s - 2.45) / 1.95));
  vHero.on = vHero.vis !== false && p > .58 && s < 2.9 && !reduz; vCena.on = vHero.vis !== false && s > 2.35 && !reduz;
}
hero.addEventListener("pointermove", e => { escura.style.setProperty("--lx", e.clientX + "px"); escura.style.setProperty("--ly", e.clientY + "px"); });

/* ---------- CENA DO MORRO: o sol desce com a rolagem, a frase de Catherine se escreve ---------- */
const cenaSec = hero, ceu = $("#ceu"), sol = $("#sol"), frase = $("#frase"), autoria = $("#autoria"), planos = $$("[data-prof]", cenaSec);
const pal = ["“Seja", "lá", "do", "que", "forem", "feitas", "as", "nossas", "almas,", "a", "dele", "e", "a", "minha", "são", "iguais.”"];
frase.innerHTML = pal.map((w, i) => `<span class="p${i >= pal.length - 2 ? " fim" : ""}">${w}</span>`).join(" "); const pals = $$(".p", frase);
const CEU = [[[70, 85, 122], [217, 154, 98], [240, 201, 142]], [[46, 45, 74], [180, 97, 63], [227, 154, 90]], [[23, 19, 31], [107, 47, 51], [181, 82, 47]]];
const mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u)), rgb = c => `rgb(${c.join(",")})`;
function quadroCena(p) {
  const k = p < .5 ? 0 : 1, u = p < .5 ? p / .5 : (p - .5) / .5, c = [0, 1, 2].map(i => mix(CEU[k][i], CEU[k + 1][i], u));
  ceu.style.background = `linear-gradient(180deg,${rgb(c[0])} 0%,${rgb(c[1])} 58%,${rgb(c[2])} 100%)`; sol.style.top = f1(20 + 48 * p) + "%";
  const n = Math.floor(clamp((p - .1) / .62) * pals.length + .001); pals.forEach((s, i) => s.classList.toggle("on", reduz ? p > .1 : i < n));
  pals.slice(-2).forEach(s => s.classList.toggle("acesa", p > .8)); autoria.classList.toggle("on", p > .84); vCena.mult = 1 + 1.6 * p;
}
cenaSec.addEventListener("pointermove", e => { if (reduz) return; const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
  planos.forEach(p => { const k = +p.dataset.prof; p.style.transform = `translate(${f1(-nx * 22 * k)}px,${f1(-ny * 10 * k)}px)`; }); });

/* ---------- topo, revelações e barra fixa ---------- */
const topo = $("#topo"), barra = $("#barra"); let compraVis = false, edVis = false;
new IntersectionObserver(es => { compraVis = es[0].isIntersecting; }, { threshold: .2 }).observe($("#compra"));
new IntersectionObserver(es => { edVis = es[0].isIntersecting; }).observe($("#edicao"));
const ob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visto"); ob.unobserve(e.target); } }), { threshold: .15 }); $$(".revela").forEach(e => ob.observe(e));
function quadroBarra() { const on = hero.getBoundingClientRect().bottom < innerHeight * .5 && !compraVis && !edVis && !$("#modal").open;
  barra.classList.toggle("on", on); barra.setAttribute("aria-hidden", !on); $("button", barra).tabIndex = on ? 0 : -1; topo.classList.toggle("rolado", scrollY > 20); }
let uy = scrollY, ut = performance.now();
addEventListener("scroll", () => { const n = performance.now(), v = Math.abs(scrollY - uy) / Math.max(8, n - ut); VENTO.alvo = Math.min(4, 1 + v * 1.6); uy = scrollY; ut = n; }, { passive: true });
function ajusta() { montaPincel(); [mHero].forEach(posiciona); [vHero, vCena, vGlobal].forEach(v => v.tam()); }
addEventListener("resize", ajusta); if (document.fonts) document.fonts.ready.then(ajusta); else ajusta(); montaPincel();
let t0 = performance.now();
function loop(now) {
  const dt = Math.min(3, (now - t0) / 16.7); t0 = now; VENTO.f += (VENTO.alvo - VENTO.f) * .08; VENTO.alvo += (1 - VENTO.alvo) * .04;
  document.documentElement.style.setProperty("--vento", f1(VENTO.f));
  quadroHero(); quadroBarra();
  if (!reduz) [vHero, vCena, vGlobal].forEach(v => { if (v.on) v.passo(dt); });
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- COMPRA (simulada, nunca finaliza) ---------- */
const modal = $("#modal"); let abridor = null, etapa = 1, aba = "pix", fr = null;
const st = { qtd: () => +$("#qtd").value, sub: () => CONFIG.preco * st.qtd(), frete: () => fr ? fr.valor + (st.qtd() - 1) * CONFIG.frete.porItemExtra : 0, total: () => st.sub() + st.frete(), pix: () => st.sub() * (1 - CONFIG.pixDesconto) + st.frete() };
$("#m-nome").textContent = `${CONFIG.edicao} · ${CONFIG.subtitulo}`; $("#m-unit").textContent = brl(CONFIG.preco) + " cada";
function abrir(btn) { abridor = btn; etapa = 1; mostra(); modal.showModal(); setTimeout(() => $("#cep").focus(), 60); }
const fechar = () => modal.close();
modal.addEventListener("close", () => { if (abridor) abridor.focus(); });
modal.addEventListener("click", e => { if (e.target === modal) fechar(); });
document.addEventListener("click", e => { const b = e.target.closest("[data-comprar]"); if (b) { e.preventDefault(); abrir(b); } });
$("#m-form").addEventListener("submit", e => e.preventDefault());
$("#m-fechar").onclick = fechar; $("#fim-fechar").onclick = fechar; $("#fim-ver").onclick = fechar;
$("#m-voltar").onclick = () => { if (etapa > 1 && etapa < 4) { etapa--; mostra(); } };
function mostra() {
  $$(".etapa").forEach(s => s.hidden = +s.dataset.e !== etapa);
  $$(".passos li").forEach((li, i) => { li.className = i + 1 < etapa ? "feito" : i + 1 === etapa ? "ativo" : ""; if (i + 1 === etapa) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current"); });
  $("#m-voltar").hidden = etapa === 1 || etapa === 4; $(".m-rodape").hidden = etapa === 4;
  $("#m-avancar").textContent = etapa === 3 ? "Finalizar compra" : "Continuar"; $("#m-titulo").textContent = ["Seu exemplar", "Pagamento", "Revisão", "Obrigada"][etapa - 1]; atualiza();
}
function atualiza() {
  $("#total1").textContent = brl(st.total()); $("#pix-valor").textContent = brl(st.pix()); $("#pix-desc").textContent = `-${Math.round(CONFIG.pixDesconto * 100)}%`; $("#vista-valor").textContent = brl(st.total());
  const sel = $("#parcelas"), v = sel.value; sel.innerHTML = Array.from({ length: CONFIG.parcelasMax }, (_, i) => `<option value="${i + 1}">${i + 1}x de ${brl(st.total() / (i + 1))} sem juros</option>`).join(""); if (v) sel.value = v;
  $("#pix-cod").value = `00020126580014BR.GOV.BCB.PIX0136DEMONSTRACAO-NOVOS-VENTOS-TGI5204000053039865406${st.pix().toFixed(2)}5802BR5920EDITORA NOVOS VENTOS6006FRANCA6304DEMO`;
}
$("#qtd").onchange = atualiza;
const soDig = s => s.replace(/\D/g, "");
function erro(id, msg) { const i = $("#" + id), e = $("#" + id + (id === "cep" ? "-erro" : "-e")); if (e) e.textContent = msg; i.setAttribute("aria-invalid", msg ? "true" : "false"); return !msg; }
$("#cep").addEventListener("input", e => { const d = soDig(e.target.value).slice(0, 8); e.target.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d; erro("cep", "");
  if (d.length === 8) { const r = +d[0]; fr = { valor: CONFIG.frete.valor[r], prazo: CONFIG.frete.prazo[r] }; $("#frete").textContent = `Frete simulado ${brl(fr.valor)} · entrega em até ${fr.prazo} dias úteis`; }
  else { fr = null; $("#frete").textContent = ""; } atualiza(); });
(function qr() { const n = 25; let r = ""; const fd = (x, y) => (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let on; if (fd(x, y)) { const fx = x < 7 ? x : x - (n - 7), fy = y < 7 ? y : y - (n - 7); on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); } else on = aleat() > .52; if (on) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
  $("#qr").innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" fill="#30231D">${r}</svg>`; })();
$("#copiar").onclick = async () => { const t = $("#pix-cod").value; try { await navigator.clipboard.writeText(t); } catch { const i = $("#pix-cod"); i.select(); document.execCommand("copy"); } $("#copiado").textContent = "Código copiado."; };
$$(".abas button").forEach(b => b.onclick = () => trocaAba(b.dataset.aba));
function trocaAba(a) { aba = a; $$(".abas button").forEach(b => b.setAttribute("aria-selected", b.dataset.aba === a)); $$(".aba").forEach(p => p.hidden = p.dataset.aba !== a); }
$("#ir-cartao").onclick = () => { trocaAba("cartao"); $("#parcelas").value = "1"; $("#cc-num").focus(); };
const bandeira = n => /^4/.test(n) ? "Visa" : /^(5[1-5]|2[2-7])/.test(n) ? "Mastercard" : /^3[47]/.test(n) ? "Amex" : /^(4011|4312|4389|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(n) ? "Elo" : /^(606282|3841)/.test(n) ? "Hipercard" : "";
$("#cc-num").addEventListener("input", e => { const d = soDig(e.target.value).slice(0, 16); e.target.value = d.replace(/(\d{4})(?=\d)/g, "$1 "); $("#bandeira").textContent = bandeira(d); erro("cc-num", ""); });
$("#cc-val").addEventListener("input", e => { const d = soDig(e.target.value).slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; erro("cc-val", ""); });
$("#cc-cvv").addEventListener("input", e => { e.target.value = soDig(e.target.value).slice(0, 4); erro("cc-cvv", ""); });
$("#cc-nome").addEventListener("input", () => erro("cc-nome", ""));
const luhn = d => { let s = 0; for (let i = 0; i < d.length; i++) { let n = +d[d.length - 1 - i]; if (i % 2) { n *= 2; if (n > 9) n -= 9; } s += n; } return s % 10 === 0; };
function validaCartao() {
  const d = soDig($("#cc-num").value), [m, a] = $("#cc-val").value.split("/").map(Number), hoje = new Date(), ano = 2000 + (a || 0);
  const ok = [erro("cc-num", d.length < 13 || !luhn(d) ? "Confira o número do cartão." : ""), erro("cc-nome", $("#cc-nome").value.trim().length < 3 ? "Informe o nome impresso no cartão." : ""),
    erro("cc-val", !m || m > 12 || !a || ano < hoje.getFullYear() || (ano === hoje.getFullYear() && m < hoje.getMonth() + 1) ? "Validade inválida." : ""), erro("cc-cvv", soDig($("#cc-cvv").value).length < 3 ? "CVV com 3 ou 4 números." : "")];
  const f = ok.indexOf(false); if (f >= 0) $(["#cc-num", "#cc-nome", "#cc-val", "#cc-cvv"][f]).focus(); return f < 0;
}
$("#m-avancar").onclick = () => {
  if (etapa === 1) { if (!fr) { erro("cep", "Digite um CEP com 8 números para calcular o frete."); $("#cep").focus(); return; } etapa = 2; }
  else if (etapa === 2) { if (aba === "vista") { trocaAba("cartao"); $("#parcelas").value = "1"; $("#cc-num").focus(); return; } if (aba === "cartao" && !validaCartao()) return; revisao(); etapa = 3; }
  else if (etapa === 3) etapa = 4;
  mostra(); const f = $(`.etapa[data-e="${etapa}"] input, .etapa[data-e="${etapa}"] button`); if (f) f.focus();
};
function revisao() {
  const pix = aba === "pix", tot = pix ? st.pix() : st.total(), parc = +$("#parcelas").value;
  $("#revisao").innerHTML = [[`${CONFIG.edicao} × ${st.qtd()}`, brl(st.sub())], [`Frete simulado (até ${fr.prazo} dias úteis)`, brl(st.frete())],
    ...(pix ? [[`Desconto Pix (${Math.round(CONFIG.pixDesconto * 100)}%)`, "-" + brl(st.sub() * CONFIG.pixDesconto)], ["Pagamento", "Pix"]] : [["Pagamento", `Cartão ${bandeira(soDig($("#cc-num").value))} em ${parc}x de ${brl(tot / parc)}`]])]
    .map(([a, b]) => `<li><span>${a}</span><strong>${b}</strong></li>`).join("");
  $("#total3").textContent = brl(tot);
}
