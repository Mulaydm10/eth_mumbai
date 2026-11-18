// Static sketchbook pages (ink + time + wash + arrival field), built lazily. All world coords on a 2400×1350 page.
import { rng, fbm, n2, hex, mix3, lerp, clamp, ellipse, rough, penStroke, rasterPen, wash, reserve, dab, foliage, arrivalField, TAU } from './engine.js';

export const W = 2400, H = 1350;
export const C = {
  sky: hex('#c9c3b2'), dust: hex('#d6bf95'), haze: hex('#b9bcc4'), concrete: hex('#bdb4a4'), concD: hex('#8f8676'), brick: hex('#c08a6a'),
  pink: hex('#d9a89c'), cream: hex('#e3cf9f'), teal: hex('#8fc0b6'), shade: [96, 92, 128], dark: hex('#4f4866'), tank: hex('#33302e'),
  sign: hex('#e8c45a'), saffron: hex('#e39a3a'), green: hex('#6b9a52'), maroon: hex('#9a4048'), node: hex('#d9533a'), find: hex('#f0c24a'),
  net: hex('#7fae6a'), sand: hex('#d8bd8a'), door: hex('#3f7f8f'), sky2: hex('#e6c08e'), dusk: hex('#e7a983'), wood: hex('#b07d52'),
  woodL: hex('#c8a86b'), wall: hex('#e6dcb8'), tile: hex('#c99a74'), sheet: hex('#dfe3e6'), steel: hex('#a9adb3'), rig: hex('#d9a441'),
};
export const shadeOf = c => mix3(c, C.shade, .45);
function cv(w, h, fill) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); if (fill) { x.fillStyle = fill; x.fillRect(0, 0, w, h); } return [c, x]; }
export const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
export const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
export const rotP = (poly, cx, cy, a) => poly.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);

const WIN = [0, 1.6];
function page(origin, speed = 1500) {
  const [colorC, cx] = cv(W, H, '#fff'), [inkC, ix] = cv(W, H), [timeC, tx] = cv(W, H, '#fff');
  tx.globalCompositeOperation = 'darken';
  let S = 100;
  const tOf = p => clamp(Math.hypot(p[0] - origin[0], p[1] - origin[1]) / speed) * 1.25;
  const L = (pts, o = {}) => { const st = penStroke(pts, { w: o.w ?? 2.1, wob: o.wob ?? 1, over: o.over ?? 5, gap: o.gap ?? .4, seed: S++, smooth: o.smooth ?? false, alpha: o.alpha ?? 1 }); rasterPen(ix, tx, st, o.t0 ?? tOf(pts[0]), o.dur ?? .2, WIN); };
  const box = (poly, o = {}) => { for (let i = 0; i < poly.length; i++) { if (o.skip && o.skip.includes(i)) continue; L([poly[i], poly[(i + 1) % poly.length]], o); } };
  const Wa = (poly, col, o = {}) => wash(cx, poly, col, { a: .5, j: 5, seed: S++, ...o });
  const eraseInk = poly => { ix.save(); ix.globalCompositeOperation = 'destination-out'; ix.beginPath(); poly.forEach((p, i) => i ? ix.lineTo(p[0], p[1]) : ix.moveTo(p[0], p[1])); ix.closePath(); ix.fill(); ix.restore(); };
  const finish = (sources, blankBL = true, edgeCols = [C.dust, C.concrete, C.brick]) => {
    const mask = (x, y) => { const n = (fbm(x * .004, y * .004, 5, 3) - .5) * 140 + (n2(x * .03, y * .03, 8) - .5) * 30; let m = Math.min(x - 110, W - 110 - x, y - 90, H - 80 - y) + n; if (blankBL) m = Math.min(m, Math.hypot(x - 0, (y - H) * 1.6) - 620 + n); return m; };
    const [mc, mx] = cv(W, H); mx.fillStyle = '#fff';
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (mask(x, y) < 0) mx.fillRect(x, y, 2, 2);
    const R = rng(31);
    for (let i = 0; i < 16000; i++) { const x = R() * W, y = R() * H, m = mask(x, y); if (m > 0 && m < 60 && R() < (1 - m / 60) * .5) dab(mx, x, y, 3 + R() * 7, R() * TAU, [255, 255, 255], .95, i); }
    cx.globalCompositeOperation = 'source-over'; cx.drawImage(mc, 0, 0);
    ix.save(); ix.globalCompositeOperation = 'destination-out'; ix.drawImage(mc, 0, 0); ix.restore();
    cx.globalCompositeOperation = 'multiply';
    for (let i = 0; i < 2500; i++) { const x = R() * W, y = R() * H, m = mask(x, y); if (m < 0 && m > -50 && R() < (1 + m / 50) * .6) dab(cx, x, y, 4 + R() * 9, R() * TAU, edgeCols[i % edgeCols.length], .25 + R() * .25, 40000 + i); }
    cx.globalCompositeOperation = 'source-over';
    const out = new Uint8Array(W * H * 4), A = ix.getImageData(0, 0, W, H).data; for (let i = 0; i < W * H; i++) { out[i * 4] = A[i * 4 + 3]; out[i * 4 + 3] = 255; }
    const tm = new Uint8Array(W * H * 4), T = tx.getImageData(0, 0, W, H).data; for (let i = 0; i < W * H; i++) { tm[i * 4] = T[i * 4]; tm[i * 4 + 3] = 255; }
    const gw = 480, gh = 270; const arr = arrivalField(W, H, gw, gh, sources, { amp: 140 });
    return { W, H, color: colorC, ink: out, time: tm, arr, gw, gh, winA: WIN, winB: [0, 1] };
  };
  return { cx, ix, L, box, Wa, eraseInk, finish };
}

function building(G, x0, x1, yT, yB, col, o = {}) {
  const { L, box, Wa } = G, R = rng(o.seed ?? 3), tilt = o.tilt ?? 0;
  const P = p => rotP([p], (x0 + x1) / 2, yB, tilt)[0];
  const wall = rect(x0, yT, x1, yB).map(P);
  Wa(wall, col, { a: .45, dx: 4, dy: 2 });
  Wa([P([x1 - (x1 - x0) * .22, yT]), P([x1, yT]), P([x1, yB]), P([x1 - (x1 - x0) * .22, yB])], shadeOf(col), { a: .3 });
  L([P([x0, yB + 6]), P([x0, yT - 4])], { w: 2.4 }); L([P([x1, yT - 6]), P([x1, yB + 4])], { w: 2.6 }); L([P([x0 - 10, yT]), P([x1 + 12, yT])], { w: 2.4 });
  const floors = o.floors ?? 3, fh = (yB - yT) / floors;
  for (let f = 0; f < floors; f++) {
    const fy = yT + f * fh;
    if (f) L([P([x0 - 4, fy]), P([lerp(x0, x1, .6 + R() * .4), fy])], { w: 1.6, alpha: .8 });
    const nw = o.win ?? 2;
    for (let k = 0; k < nw; k++) {
      if (R() < .2) continue;
      const wx = lerp(x0, x1, (k + .5) / nw) - 26, wy = fy + fh * .28, ww = 52, wh = fh * .45;
      const wp = rect(wx, wy, wx + ww, wy + wh).map(P);
      Wa(wp, mix3(col, C.dark, .55), { a: .5, j: 3 });
      box(wp, { w: 1.5, skip: R() < .5 ? [1] : [] });
      for (let b = 1; b < 4; b++) L([P([wx + ww * b / 4, wy + 2]), P([wx + ww * b / 4, wy + wh - 2])], { w: 1, alpha: .7 });
      if (o.balcony && R() < .6) { const by = wy + wh + 6; const bp = rect(wx - 14, by - 4, wx + ww + 14, by + 22).map(P); Wa(bp, mix3(col, C.concrete, .5), { a: .35 }); box(bp, { w: 1.6, skip: [3] }); for (let b = 0; b < 6; b++) L([P([wx - 10 + b * 15, by - 4]), P([wx - 10 + b * 15, by + 22])], { w: .9, alpha: .6 }); }
    }
  }
  if (o.tank) { const tx0 = lerp(x0, x1, .65); const tk = [P([tx0, yT - 8]), P([tx0 + 60, yT - 8]), P([tx0 + 56, yT - 70]), P([tx0 + 4, yT - 70])]; Wa(tk, C.tank, { a: .75, j: 2 }); box(tk, { w: 1.8 }); L([P([tx0, yT - 40]), P([tx0 + 60, yT - 40])], { w: 1, alpha: .6 }); }
  return wall;
}
const wire = (G, a, b, sag, o = {}) => G.L([...Array(9)].map((_, i) => { const u = i / 8; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * sag]; }), { w: 1.1, smooth: true, gap: .2, ...o });

// ---------------- A: the street at dusk ----------------
export const STREET = { ground: 1150, door: [1700, 1080] };
export function buildStreet() {
  const G = page([300, 1100], 2200), { cx, L, box, Wa } = G, R = rng(21);
  Wa([[110, 80], [2300, 80], [2300, 420], [110, 470]], C.dusk, { a: .32, j: 40, edge: 0, freq: .006 });
  Wa([[110, 330], [2300, 300], [2300, 700], [110, 720]], C.sky2, { a: .3, j: 40, edge: 0, freq: .006 });
  for (let i = 0; i < 10; i++) { const x = 140 + i * 230 + R() * 50, h = 90 + R() * 120; Wa(rect(x, 760 - h, x + 140 + R() * 50, 800), C.haze, { a: .25, j: 4, edge: .1 }); }
  // neem tree
  L([[250, 1080], [270, 760], [250, 600]], { w: 3, smooth: true }); L([[285, 1080], [300, 780], [340, 610]], { w: 3, smooth: true });
  Wa([[250, 1080], [270, 760], [340, 610], [300, 780], [285, 1080]], hex('#7a6350'), { a: .5 });
  foliage(cx, [{ x: 290, y: 480, r: 200 }, { x: 170, y: 560, r: 140 }, { x: 420, y: 560, r: 150 }], { seed: 4 });
  // tea shop with striped awning
  { const x0 = 420, x1 = 900, yT = 560, yB = 1080;
    Wa(rect(x0, yT, x1, yB), C.cream, { a: .45 }); Wa(rect(x1 - 90, yT, x1, yB), shadeOf(C.cream), { a: .3 });
    box(rect(x0, yT, x1, yB), { w: 2.3, skip: [2] });
    const aw = [[x0 - 30, 760], [x1 + 30, 760], [x1 - 10, 690], [x0 + 10, 690]]; for (let k = 0; k < 8; k++) { const u0 = k / 8, u1 = (k + 1) / 8; Wa([[lerp(aw[3][0], aw[2][0], u0), 690], [lerp(aw[3][0], aw[2][0], u1), 690], [lerp(aw[0][0], aw[1][0], u1), 760], [lerp(aw[0][0], aw[1][0], u0), 760]], k % 2 ? C.saffron : [240, 232, 214], { a: .6, j: 2 }); }
    box(aw, { w: 2 }); for (let k = 0; k < 9; k++) L([[aw[0][0] + k * 67, 760], [aw[0][0] + k * 67 + 6, 776], [aw[0][0] + k * 67 + 30, 770]], { w: 1.3, smooth: true });
    const sg = rect(x0 + 40, 595, x1 - 40, 660); Wa(sg, C.sign, { a: .55 }); box(sg, { w: 1.8 }); for (let k = 0; k < 3; k++) L([[x0 + 80 + k * 120, 630], [x0 + 100 + k * 120, 615], [x0 + 130 + k * 120, 635], [x0 + 160 + k * 120, 620]], { w: 2.2, smooth: true, alpha: .75 });
    const ct = rect(x0 + 30, 900, x1 - 60, 1080); Wa(ct, C.wood, { a: .45 }); box(ct, { w: 2 });
    for (let k = 0; k < 5; k++) { const gx = x0 + 70 + k * 40; L([[gx, 900], [gx + 4, 870], [gx + 24, 870], [gx + 28, 900]], { w: 1.2 }); }
    const ke = ellipse(x1 - 140, 870, 34, 28, 12); Wa(ke, C.steel, { a: .5 }); L([...ke.slice(6), ke[0]], { w: 1.6, smooth: true }); L([[x1 - 110, 860], [x1 - 80, 845]], { w: 1.6 });
    Wa(rect(x0 + 30, 780, x1 - 60, 900), C.dark, { a: .3, j: 6 }); }
  building(G, 930, 1350, 420, 1080, C.pink, { floors: 3, balcony: 1, seed: 6 });
  // electric pole + wires
  L([[1380, 1090], [1370, 300]], { w: 3 }); L([[1394, 1090], [1384, 300]], { w: 2.4 }); L([[1320, 340], [1440, 336]], { w: 2.4 });
  wire(G, [1320, 342], [110, 300], 70); wire(G, [1440, 338], [2300, 290], 90); wire(G, [1380, 336], [2300, 380], 140); wire(G, [1330, 344], [110, 420], 110);
  // Ramesh's house (turquoise, blue door, grille, tank)
  { const x0 = 1420, x1 = 1980, yT = 460, yB = 1080;
    Wa(rect(x0, yT, x1, yB), C.teal, { a: .5, dx: 4, dy: 2 }); Wa(rect(x1 - 120, yT, x1, yB), shadeOf(C.teal), { a: .28 });
    L([[x0, yB + 6], [x0, yT - 4]], { w: 2.6 }); L([[x1, yT - 6], [x1, yB + 6]], { w: 2.8 }); L([[x0 - 30, yT], [x1 + 30, yT]], { w: 2.6 }); L([[x0 - 30, yT + 24], [x1 + 30, yT + 24]], { w: 1.8 });
    L([[x0 - 26, 760], [x1 + 26, 760]], { w: 2.2 }); Wa(rect(x0 - 26, 760, x1 + 26, 780), C.concrete, { a: .4 });
    const wp = rect(1500, 560, 1660, 700); Wa(wp, C.dark, { a: .45 }); box(wp, { w: 1.8 }); for (let b = 1; b < 6; b++) L([[1500 + b * 27, 562], [1500 + b * 27, 698]], { w: 1, alpha: .7 });
    const wp2 = rect(1760, 560, 1920, 700); Wa(wp2, hex('#e9c46a'), { a: .45 }); box(wp2, { w: 1.8 }); for (let b = 1; b < 6; b++) L([[1760 + b * 27, 562], [1760 + b * 27, 698]], { w: 1, alpha: .7 });
    const dp = rect(1640, 820, 1770, 1080); Wa(dp, C.door, { a: .6, dx: 3 }); box(dp, { w: 2.2 }); L([[1705, 822], [1705, 1078]], { w: 1.3 });
    const np = rect(1800, 850, 1880, 890); Wa(np, C.cream, { a: .4 }); box(np, { w: 1.4 });
    const wp3 = rect(1460, 850, 1600, 990); Wa(wp3, C.dark, { a: .4 }); box(wp3, { w: 1.8 }); for (let b = 1; b < 5; b++) L([[1460 + b * 28, 852], [1460 + b * 28, 988]], { w: 1, alpha: .7 });
    const tk = [[1840, yT - 8], [1910, yT - 8], [1905, yT - 90], [1845, yT - 90]]; Wa(tk, C.tank, { a: .75, j: 2 }); box(tk, { w: 1.8 });
    const pot = [[1890, 1030], [1940, 1030], [1932, 1080], [1898, 1080]]; Wa(pot, C.brick, { a: .6 }); box(pot, { w: 1.5 }); foliage(cx, [{ x: 1915, y: 1005, r: 34 }], { seed: 9, scale: .5 }); }
  // construction next door: RCC frame, net, scaffold
  { const x0 = 2020, x1 = 2290;
    for (const y of [760, 470]) { const s = rect(x0 - 10, y, x1 + 10, y + 26); Wa(s, C.concrete, { a: .5 }); box(s, { w: 2 }); }
    for (let k = 0; k < 3; k++) { const x = lerp(x0, x1, k / 2); Wa(rect(x - 14, 470, x + 14, 1080), C.concrete, { a: .45 }); L([[x - 14, 1080], [x - 14, 470]], { w: 1.8 }); L([[x + 14, 470], [x + 14, 1080]], { w: 2 }); for (let r = 0; r < 3; r++) L([[x - 8 + r * 8, 470], [x - 8 + r * 8 + (R() - .5) * 10, 400 - R() * 30]], { w: 1 }); }
    Wa(rect(2060, 500, 2280, 750), C.net, { a: .38, j: 6 }); for (let y = 520; y < 750; y += 30) L([[2060, y], [2280, y + 3]], { w: .7, alpha: .4 }); }
  // road
  L([[130, 1082], [2290, 1086]], { w: 2.2, gap: .4 });
  Wa([[120, 1082], [2300, 1086], [2300, 1290], [120, 1290]], C.dust, { a: .28, j: 20, edge: 0 });
  for (let k = 0; k < 7; k++) { const x = 300 + k * 290; L([[x, 1215], [x + 110, 1216]], { w: 1.4, alpha: .5 }); }
  return G.finish([{ x: 300, y: 1100, t: .55, v: 2400 }], false);
}

// ---------------- B: bedroom cutaway + the site next door ----------------
export const BED = { floor: 1010, head: [505, 818], table: [1300, 862], fan: [850, 172], phone: [760, 1135], sheet: [1000, 1060], wallX: 1520 };
export function buildBed() {
  const G = page([800, 700], 2000), { cx, L, box, Wa } = G, R = rng(9);
  // room
  Wa(rect(150, 170, 1520, 1010), C.wall, { a: .45, j: 6 });
  Wa(rect(150, 1010, 1520, 1270), C.tile, { a: .35, j: 6 });
  L([[140, 170], [1530, 170]], { w: 2.6 }); L([[140, 1010], [1530, 1010]], { w: 2.4 });
  for (let k = 0; k < 6; k++) L([[160, 1060 + k * 40], [1510, 1062 + k * 40]], { w: 1, alpha: .35 + k * .05 });
  for (let k = 0; k < 9; k++) L([[200 + k * 160, 1010], [130 + k * 175, 1270]], { w: .9, alpha: .4 });
  // thick wall (cut)
  const wl = rect(1520, 150, 1580, 1270); Wa(wl, C.concrete, { a: .55 }); box(wl, { w: 2.4 }); for (let y = 170; y < 1260; y += 26) L([[1522, y], [1578, y + 20]], { w: .8, alpha: .45 });
  // tube light, calendar, switchboard
  { const tl = rect(560, 280, 860, 300); Wa(tl, [250, 250, 245], { a: .3 }); box(tl, { w: 1.6 }); L([[580, 300], [580, 312]], { w: 1.2 }); L([[840, 300], [840, 312]], { w: 1.2 });
    const cal = rect(220, 380, 340, 540); Wa(cal, [245, 240, 230], { a: .3 }); box(cal, { w: 1.6 }); Wa(rect(220, 380, 340, 420), C.maroon, { a: .35 }); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) L([[232 + c * 22, 440 + r * 24], [244 + c * 22, 440 + r * 24]], { w: 1, alpha: .5 });
    const sb = rect(1380, 700, 1460, 790); Wa(sb, [240, 236, 226], { a: .3 }); box(sb, { w: 1.4 }); for (let k = 0; k < 3; k++) L([[1395 + k * 22, 730], [1395 + k * 22, 750]], { w: 2 }); }
  // window with grille, sky + rig mast beyond
  { const wp = rect(1180, 360, 1420, 640); Wa(wp, C.sky2, { a: .45 }); Wa(rect(1180, 520, 1420, 640), C.haze, { a: .35 }); L([[1340, 360], [1345, 640]], { w: 2.2 }); box(wp, { w: 2.4 }); box(rect(1165, 345, 1435, 655), { w: 1.6 });
    for (let b = 1; b < 6; b++) L([[1180 + b * 40, 362], [1180 + b * 40, 638]], { w: 1.1, alpha: .8 }); L([[1180, 500], [1420, 500]], { w: 1.1, alpha: .8 });
    const cu = [[1120, 330], [1185, 330], [1175, 700], [1130, 720]]; Wa(cu, C.saffron, { a: .45 }); box(cu, { w: 1.4, skip: [0] }); }
  // bed: headboard, mattress, legs, pillow
  { Wa(rect(380, 700, 425, 1010), C.wood, { a: .6 }); box(rect(380, 700, 425, 1010), { w: 2.2 });
    const m = rect(425, 860, 1180, 935); reserve(cx, m, .9, 2, 4); Wa(m, C.sheet, { a: .35 }); box(m, { w: 2.2 });
    const fr = rect(425, 935, 1180, 965); Wa(fr, C.wood, { a: .55 }); box(fr, { w: 2 });
    for (const x of [440, 1160]) { Wa(rect(x - 12, 965, x + 12, 1010), C.wood, { a: .6 }); box(rect(x - 12, 965, x + 12, 1010), { w: 1.8 }); }
    Wa(rect(1140, 820, 1180, 1010), C.wood, { a: .55 }); box(rect(1140, 820, 1180, 965), { w: 2 });
    const pil = rough(ellipse(510, 852, 92, 26, 16), 4, 3); reserve(cx, pil, .95, 0); Wa(pil, [235, 230, 222], { a: .3 }); L([...pil, pil[0]], { w: 1.8, smooth: true }); }
  // side table
  { const tp = rect(1215, 860, 1385, 880); Wa(tp, C.wood, { a: .6 }); box(tp, { w: 2 }); for (const x of [1228, 1372]) { L([[x, 880], [x, 1010]], { w: 2.2 }); L([[x + 10, 880], [x + 10, 1010]], { w: 1.5 }); }
    Wa(rect(1228, 880, 1382, 1010), C.wood, { a: .2 }); L([[1228, 950], [1382, 950]], { w: 1.4 }); }
  // outside: the site
  Wa([[1580, 120], [2300, 120], [2300, 1010], [1580, 1010]], C.sky2, { a: .28, j: 30, edge: 0, freq: .006 });
  for (let i = 0; i < 4; i++) { const x = 1620 + i * 170, h = 100 + R() * 120; Wa(rect(x, 800 - h, x + 120, 840), C.haze, { a: .28, j: 4, edge: .1 }); }
  L([[1580, 1012], [2290, 1014]], { w: 2.2 }); Wa([[1580, 1012], [2300, 1012], [2300, 1270], [1580, 1270]], C.sand, { a: .35, j: 14, edge: 0 });
  // drill rig: tracked base, cab, mast
  { const base = [[1660, 950], [1960, 950], [1985, 1000], [1640, 1000]]; Wa(base, C.tank, { a: .55 }); L([...ellipse(1812, 980, 160, 24, 18), ellipse(1812, 980, 160, 24, 18)[0]], { w: 2.2, smooth: true });
    for (let k = 0; k < 9; k++) L([[1680 + k * 32, 962], [1684 + k * 32, 998]], { w: 1, alpha: .6 });
    const cab = rect(1690, 820, 1850, 950); Wa(cab, C.rig, { a: .6 }); box(cab, { w: 2.2 }); const gl = rect(1710, 840, 1780, 900); Wa(gl, C.haze, { a: .4 }); box(gl, { w: 1.4 });
    const mast = rect(1872, 250, 1904, 950); Wa(mast, C.rig, { a: .65 }); box(mast, { w: 2.2 }); for (let y = 270; y < 940; y += 40) L([[1872, y], [1904, y + 30]], { w: 1, alpha: .7 });
    L([[1850, 830], [1872, 520]], { w: 2.2 }); L([[1858, 840], [1880, 530]], { w: 1.4 }); L([[1904, 250], [1960, 300], [1960, 340]], { w: 1.6 }); }
  // pile driver frame
  { for (const x of [2110, 2180]) { Wa(rect(x - 9, 230, x + 9, 1010), C.concD, { a: .55 }); L([[x - 9, 1010], [x - 9, 230]], { w: 2 }); L([[x + 9, 230], [x + 9, 1010]], { w: 2.2 }); }
    for (let y = 280; y < 990; y += 70) L([[2101, y], [2189, y + 40]], { w: 1.1, alpha: .7 });
    L([[2090, 228], [2200, 228]], { w: 2.6 }); L([[2190, 232], [2260, 1010]], { w: 1.4 });
    const pile = rect(2130, 900, 2160, 1012); Wa(pile, C.concrete, { a: .6 }); box(pile, { w: 1.8 }); }
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5 - r; c++) { const b = rect(1990 + c * 40 + r * 20, 990 - r * 20, 2026 + c * 40 + r * 20, 1008 - r * 20); Wa(b, C.brick, { a: .5, j: 1.5 }); box(b, { w: 1, skip: [2] }); }
  wire(G, [1580, 300], [2300, 260], 60);
  return G.finish([{ x: 800, y: 700, t: .55, v: 2200 }], false);
}

// ---------------- C: the courtroom ----------------
export const COURT = { board: [560, 520, 1060, 900], rameshAt: [1250, 1120], judge: [1200, 600] };
export function buildCourt() {
  const G = page([1200, 700], 2000), { cx, L, box, Wa } = G, R = rng(14);
  Wa(rect(130, 100, 2270, 980), C.woodL, { a: .35, j: 10 });
  Wa(rect(130, 100, 2270, 420), C.wall, { a: .35, j: 10 });
  L([[130, 420], [2270, 420]], { w: 2 }); for (let x = 200; x < 2260; x += 140) L([[x, 430], [x, 975]], { w: 1, alpha: .5 });
  // arched windows
  for (const x of [280, 1950]) { const wp = [[x, 380], [x, 180], [x + 40, 130], [x + 90, 115], [x + 140, 130], [x + 180, 180], [x + 180, 380]]; Wa(wp, C.haze, { a: .45 }); L(wp, { w: 2.2, smooth: true }); L([[x, 380], [x + 180, 380]], { w: 2 }); L([[x + 90, 116], [x + 90, 380]], { w: 1.2 }); L([[x, 250], [x + 180, 250]], { w: 1.2 }); }
  // clock
  { const cl = ellipse(1200, 240, 46, 46, 18); Wa(cl, [245, 240, 225], { a: .3 }); L([...cl, cl[0]], { w: 2, smooth: true }); L([[1200, 240], [1200, 210]], { w: 2 }); L([[1200, 240], [1222, 250]], { w: 1.8 }); }
  // judge bench (raised)
  { const b = rect(860, 600, 1540, 960); Wa(b, C.wood, { a: .6 }); Wa(rect(1400, 600, 1540, 960), shadeOf(C.wood), { a: .3 }); box(b, { w: 2.6 }); L([[840, 600], [1560, 600]], { w: 3 });
    for (let k = 0; k < 4; k++) { const p = rect(900 + k * 160, 650, 1020 + k * 160, 920); box(p, { w: 1.2, alpha: .6 }); }
    L([[1180, 590], [1205, 560], [1230, 590]], { w: 1.6 }); const gv = rect(1300, 580, 1360, 596); Wa(gv, C.wood, { a: .7 }); box(gv, { w: 1.4 }); }
  // lawyers' table right
  { const tb = rect(1600, 860, 2180, 900); Wa(tb, C.wood, { a: .6 }); box(tb, { w: 2.2 }); for (const x of [1620, 2160]) L([[x, 900], [x, 1040]], { w: 2.2 });
    for (let k = 0; k < 3; k++) { const f = rect(1880 + k * 70, 830 - k * 8, 1950 + k * 70, 860); Wa(f, [k ? 190 : 230, 200, 170], { a: .5 }); box(f, { w: 1.3 }); } }
  // easel legs (board itself is dynamic)
  L([[620, 900], [560, 1110]], { w: 2.4 }); L([[1000, 900], [1060, 1110]], { w: 2.4 }); L([[810, 880], [815, 1100]], { w: 2 }); L([[560, 905], [1060, 905]], { w: 2.4 });
  // floor
  L([[130, 980], [2270, 980]], { w: 2.4 }); Wa(rect(130, 980, 2270, 1290), C.tile, { a: .25, j: 10, edge: 0 });
  for (let k = 0; k < 5; k++) L([[150, 1030 + k * 55], [2250, 1032 + k * 55]], { w: .9, alpha: .3 });
  // gallery bench backs + carrot people heads (foreground)
  { const bb = rect(150, 1220, 820, 1260); Wa(bb, C.wood, { a: .55 }); box(bb, { w: 2.2 }); const bb2 = rect(1650, 1220, 2250, 1260); Wa(bb2, C.wood, { a: .55 }); box(bb2, { w: 2.2 });
    for (const x of [230, 380, 560, 700, 1720, 1880, 2050, 2170]) { const h = rough(ellipse(x, 1180, 38, 44, 12), 3, x); Wa(h, x % 3 ? hex('#2e2622') : hex('#5a4a40'), { a: .55 }); Wa(rect(x - 60, 1215, x + 60, 1260), [C.saffron, C.teal, C.pink, C.haze][x % 4], { a: .35 }); L(h.slice(6, 12).concat([h[0], h[1]]), { w: 1.8, smooth: true }); } }
  // ceiling fans
  for (const x of [600, 1800]) { L([[x, 100], [x, 160]], { w: 2 }); L([[x - 150, 168], [x + 150, 172]], { w: 2.4 }); Wa(ellipse(x, 168, 22, 12, 10), C.concD, { a: .6 }); }
  return G.finish([{ x: 1200, y: 700, t: .55, v: 2200 }], false);
}

// ---------------- D: the rubble (look-test page, auto-rickshaw dropped) ----------------
export const POCKET = [1180, 1075], HAND = [1262, 1048];
export let MOUND_TOP = [];
export function moundY(x) { const t = MOUND_TOP; for (let k = 1; k < t.length; k++) if (t[k][0] >= x) return lerp(t[k - 1][1], t[k][1], (x - t[k - 1][0]) / (t[k][0] - t[k - 1][0])); return 1330; }
export function buildRubble() {
  const G = page(POCKET, 1500), { cx, L, box, Wa, eraseInk } = G, R = rng(11);
  Wa([[110, 80], [2300, 80], [2300, 520], [110, 600]], C.sky2, { a: .28, j: 40, edge: 0, freq: .006 });
  for (let i = 0; i < 6; i++) Wa(ellipse(300 + i * 360 + R() * 80, 430 + R() * 160, 260, 90, 18), C.dust, { a: .18, j: 40, edge: 0, freq: .01 });
  for (let i = 0; i < 9; i++) { const x = 160 + i * 240 + R() * 60, h = 120 + R() * 140; Wa(rect(x, 760 - h, x + 150 + R() * 60, 800), C.haze, { a: .28, j: 4, edge: .1 }); }
  building(G, 170, 560, 340, 900, C.pink, { floors: 3, balcony: 1, tank: 1, seed: 4, tilt: -.015 });
  L([[420, 360], [395, 470], [430, 540], [400, 640]], { w: 1.6 });
  { L([[230, 560], [330, 585], [430, 572]], { w: 1, smooth: true, alpha: .8 }); [[250, C.saffron], [300, C.green], [360, C.maroon]].forEach(([x, c], k) => { const p = [[x, 568 + k * 4], [x + 34, 572 + k * 4], [x + 30, 630 + k * 3], [x + 4, 628 + k * 3]]; Wa(p, c, { a: .6, j: 2 }); box(p, { w: 1.2, skip: [0] }); }); }
  { const slabs = [[600, 560, 1080, 610], [620, 680, 1120, 640], [590, 770, 1100, 790]];
    Wa([[640, 560], [1060, 470], [1100, 900], [600, 900]], C.cream, { a: .3, j: 10 });
    for (const [x0, y0, x1, y1] of slabs) { const s = [[x0, y0], [x1, y1], [x1, y1 + 32], [x0, y0 + 30]]; Wa(s, C.concrete, { a: .55 }); Wa([[x0, y0 + 20], [x1, y1 + 22], [x1, y1 + 32], [x0, y0 + 30]], shadeOf(C.concrete), { a: .4 }); box(s, { w: 2.2 }); for (let k = 0; k < 4; k++) { const x = lerp(x0, x1, R()), y = lerp(y0, y1, (x - x0) / (x1 - x0)); L([[x, y + 30], [x + 8, y + 60 + R() * 30], [x + 18, y + 80]], { w: 1.3, smooth: true }); } }
    L([[640, 900], [650, 560]], { w: 2.4 }); L([[1060, 470], [1080, 610]], { w: 2.4 }); L([[1100, 660], [1110, 900]], { w: 2.2 });
    for (let k = 0; k < 6; k++) { const x = 680 + k * 65; Wa(rect(x, 720, x + 36, 752), C.dark, { a: .4, j: 2 }); } }
  building(G, 1600, 2240, 470, 900, C.teal, { floors: 2, seed: 9, win: 3, tilt: .01 });
  { const sp = rect(1640, 680, 2200, 740); Wa(sp, C.sign, { a: .6 }); box(sp, { w: 2 }); for (let k = 0; k < 4; k++) { const x = 1700 + k * 120; L([[x, 712], [x + 20, 700], [x + 40, 714], [x + 70, 704]], { w: 2.4, smooth: true, alpha: .7 }); }
    for (const x of [1650, 1930]) { const sh = rect(x, 750, x + 250, 900); Wa(sh, C.concD, { a: .3 }); box(sh, { w: 1.8, skip: [2] }); for (let y = 765; y < 900; y += 14) L([[x + 4, y], [x + 246, y + 1]], { w: .8, alpha: .55, gap: .2 }); } }
  { const p0 = [1520, 940], p1 = [1440, 230]; Wa([[p0[0] - 9, p0[1]], [p1[0] - 7, p1[1]], [p1[0] + 7, p1[1]], [p0[0] + 9, p0[1]]], C.concD, { a: .6, j: 1.5 }); L([[p0[0] - 9, p0[1]], [p1[0] - 7, p1[1]]], { w: 2.2 }); L([[p1[0] + 7, p1[1]], [p0[0] + 9, p0[1]]], { w: 2.4 });
    L([[1390, 270], [1500, 262]], { w: 2.4 });
    for (const [a, b, sag] of [[[1395, 272], [120, 330], 90], [[1440, 266], [130, 380], 140], [[1497, 264], [2300, 300], 120], [[1470, 266], [2300, 420], 60]]) wire(G, a, b, sag, { w: 1.2 });
    const tg = [...Array(30)].map((_, i) => { const a = i * .9; return [1460 + Math.cos(a) * (14 + i * .5) + i * .4, 320 + Math.sin(a) * 12 + i * 3]; }); L(tg, { w: 1, smooth: true, alpha: .8 }); }
  const top = []; for (let i = 0; i <= 40; i++) { const x = lerp(330, 2080, i / 40), u = (x - 1200) / 880; top.push([x, 880 - 150 * Math.exp(-u * u * 2.2) * (.8 + .4 * n2(i * .5, 3)) + (n2(i * 1.7, 9) - .5) * 40]); }
  MOUND_TOP = top;
  const mound = [...top, [2140, 1330], [300, 1330]];
  reserve(cx, mound, .95, 6, 5); eraseInk(mound);
  Wa(mound, C.concrete, { a: .38, j: 10, edge: .15 });
  L(top, { w: 2.6, smooth: true, gap: .5 });
  const pocket = rough([[930, 1030], [1010, 1000], [1180, 992], [1360, 1000], [1440, 1040], [1420, 1130], [1300, 1158], [1060, 1160], [950, 1130]], 8, 4, 12);
  const slab = [[860, 930], [1500, 978], [1490, 1028], [850, 984]];
  const keep = (x, y) => !inPoly(slab, x, y) && Math.hypot((x - POCKET[0]) / 300, (y - POCKET[1]) / 125) > 1;
  for (let i = 0; i < 150; i++) {
    const x = 380 + R() * 1700, ytop = moundY(x);
    const y = ytop + 20 + R() * (1290 - ytop); if (!keep(x, y)) continue;
    const brick = R() < .4, sz = brick ? 22 : 26 + R() * 46, a = R() * TAU;
    const poly = brick ? rotP(rect(x - sz, y - sz * .45, x + sz, y + sz * .45), x, y, a) : rotP(ellipse(x, y, sz, sz * (.5 + R() * .3), 5 + (R() * 3 | 0), R()), x, y, a);
    if (y > 1240 && R() < .6) continue;
    Wa(poly, brick ? C.brick : (R() < .5 ? C.concrete : C.concD), { a: .35 + R() * .2, j: 2.5, dx: 2, dy: 1 });
    if (R() < .7) L([...poly.slice(0, 1 + (poly.length * .7 | 0))], { w: 1.4 + R() * .8, gap: .3 });
  }
  for (let i = 0; i < 9; i++) { const x = 500 + R() * 1500, y = 900 + R() * 200; if (!keep(x, y)) continue; L([[x, y], [x + 30 - R() * 60, y - 40 - R() * 30], [x + 60 - R() * 120, y - 70 - R() * 40]], { w: 1.4, smooth: true }); }
  Wa(pocket, C.dark, { a: .62, j: 4, edge: .4 });
  Wa(rough(ellipse(1180, 1110, 230, 45, 18), 6, 9), mix3(C.dark, [0, 0, 0], .2), { a: .25, edge: 0 });
  L([...pocket.slice(pocket.length * .45 | 0), pocket[0]], { w: 2.2, smooth: true, gap: .4 });
  reserve(cx, slab, .95, 2, 3); eraseInk(slab);
  Wa(slab, C.concrete, { a: .6, dx: 3, dy: 2 }); Wa([[850, 965], [1492, 1010], [1490, 1028], [850, 984]], shadeOf(C.concrete), { a: .5 });
  box(slab, { w: 2.8 });
  for (let k = 0; k < 5; k++) { const y = 940 + k * 9; L([[1495, y + 45], [1530 + k * 6, y + 30 + k * 4], [1555 + k * 9, y + 50]], { w: 1.3, smooth: true }); }
  for (let k = 0; k < 4; k++) L([[900 + k * 160, 940 + k * 12], [930 + k * 160, 960 + k * 12]], { w: 1.2, alpha: .7 });
  return G.finish([{ x: 1200, y: 700, t: .55, v: 2600 }]);
}

// ---------------- E: the end card (clean sketchbook page) ----------------
export function buildCard() { const G = page([1200, 675], 2000); return G.finish([{ x: 1200, y: 675, t: -5, v: 3000 }], false); }
