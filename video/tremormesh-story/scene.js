// TREMORMESH (Urban Sketch · Pen & Wash). Timing comes from timeline.json (plan.py); ?subs=<cues.json> burns handwritten captions.
import { rng, n2, hex, mix3, lerp, clamp, ss, ellipse, rough, penStroke, drawPen, wash, dab, compositor, drawPrims, handwrite, figure, INK, PAPER, TAU, rgba, R3 } from './engine.js';
import { walk, stand, prone } from './poses.js';
import { ramesh, RAMESH } from './ramesh.js';
import { rameshHead, SHIRT, SKIN } from './face.js';
import { W, H, C, rect, buildStreet, buildBed, buildCourt, buildRubble, buildCard, BED, COURT, POCKET, HAND, moundY, MOUND_TOP } from './pages.js';
const { V } = R3;
const TL = await (await fetch(new URLSearchParams(location.search).get('tl') || 'timeline.json')).json();
const q = new URLSearchParams(location.search);
const SUBS = q.get('subs') ? await (await fetch(q.get('subs'))).json() : null;
await document.fonts.load('60px "Bradley Hand"').catch(() => {});
const B = TL.beats, SC = Object.fromEntries(TL.scenes.map(s => [s.id, s]));
const FONT = '"Bradley Hand"';
const eio = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (t, a, b) => clamp((t - a) / (b - a));
const bump = (t, a, b) => (t > a && t < b) ? Math.sin((t - a) / (b - a) * Math.PI) : 0;
const st = (pts, o) => penStroke(pts, { w: 2, wob: 1, over: 3, seed: 1, ...o });
const OFFICIAL = { skin: hex('#b98262'), top: hex('#4a4f5c'), bottom: hex('#3c404a'), hair: hex('#231d1a'), shoe: hex('#222222'), pants: 1, sleeve: 'long', torso: [.09, .1, .115] };
const JUDGE = { skin: hex('#a8775a'), top: hex('#2b2a2e'), bottom: hex('#2b2a2e'), hair: hex('#d8d2c8'), pants: 1, sleeve: 'long', torso: [.1, .11, .12] };
const RESCUER = { skin: hex('#9c6a50'), top: C.saffron, bottom: hex('#4d5566'), hair: hex('#231c1a'), shoe: hex('#3b2e26'), pants: 1, sleeve: 'long' };
const SURVIVOR = { skin: hex('#c48a6a'), top: C.pink, bottom: hex('#6a6a70'), hair: hex('#2e2622'), pants: 1, sleeve: 'short' };
const NIGHT = [92, 98, 150];
const RESC0 = B.prove + .7, CARD0 = Math.max(B.tm2, RESC0 + 3.2), FORR = CARD0 + .75, TAGT = Math.max(B.matters - .5, CARD0 + 1.2), END = TAGT + 1.05 + 2.9;

// ---------- shots ----------
const T_BED = 7.7, TURN = .75;
const SHOTS = [
  { id: 'street', page: 'street', t0: 0 }, { id: 'bed', page: 'bed', t0: T_BED }, { id: 'court', page: 'court', t0: SC.s4.t0 },
  { id: 'night', page: 'bed', t0: SC.s6.t0 + .35 }, { id: 'rubble', page: 'rubble', t0: SC.s7.t0 }, { id: 'card', page: 'card', t0: CARD0 },
];
SHOTS.forEach((s, i) => s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : END);
const SHOCK = Math.max(B.construction4, B.officially + .15 + 2.4), T_TEAR = B.isnt + .05, T_STREETFALL = T_TEAR + .75;

// ---------- pages (lazy) ----------
const BUILD = { street: buildStreet, bed: buildBed, court: buildCourt, rubble: buildRubble, card: buildCard }, cache = {};
function getPage(n) { if (!cache[n]) { const world = BUILD[n](); const glc = document.createElement('canvas'); glc.width = 1920; glc.height = 1080; cache[n] = { world, glc, comp: compositor(glc, world) }; } return cache[n]; }
function drawPage(ctx, n, cam, lt) { const P = getPage(n); P.comp(cam, lt); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.drawImage(P.glc, 0, 0); }
function worldT(ctx, cam) { ctx.setTransform(1, 0, 0, 1, 960, 540); ctx.rotate(cam.rot || 0); ctx.scale(cam.z, cam.z); ctx.translate(-cam.cx, -cam.cy); }
const toScreen = (cam, [x, y]) => { const c = Math.cos(cam.rot || 0), s = Math.sin(cam.rot || 0), dx = (x - cam.cx) * cam.z, dy = (y - cam.cy) * cam.z; return [960 + dx * c - dy * s, 540 + dx * s + dy * c]; };
function camPath(keys, t) {
  const K = (k) => ({ cx: k[1], cy: k[2], z: k[3], rot: k[5] || 0 });
  for (let i = 1; i < keys.length; i++) if (keys[i][0] < keys[i - 1][0] + .05) { keys[i] = keys[i].slice(); keys[i][0] = keys[i - 1][0] + .05; }
  if (t <= keys[0][0]) return K(keys[0]);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], e = (a[4] ?? eio)(seg(t, a[0], b[0])); return { cx: lerp(a[1], b[1], e), cy: lerp(a[2], b[2], e), z: a[3] * Math.pow(b[3] / a[3], e), rot: lerp(a[5] || 0, b[5] || 0, e) }; }
  return K(keys[keys.length - 1]);
}
const mixCam = (a, b, e) => ({ cx: lerp(a.cx, b.cx, e), cy: lerp(a.cy, b.cy, e), z: a.z * Math.pow(b.z / a.z, e), rot: lerp(a.rot || 0, b.rot || 0, e) });
function shake(cam, t, amp, f = 23) { if (amp <= 0) return cam; return { ...cam, cx: cam.cx + (n2(t * f, 1.3) - .5) * 2 * amp / cam.z, cy: cam.cy + (n2(t * f, 7.7) - .5) * 2 * amp / cam.z, rot: (cam.rot || 0) + (n2(t * f * .7, 4.1) - .5) * amp * .0012 }; }
const fan = (ctx, x, y, t, boil, k = 1) => {
  drawPen(ctx, st([[x, y], [x, y + 70]], { w: 2.2, seed: 5 + boil })); const hy = y + 76;
  for (let b = 0; b < 3; b++) { const a = t * 7.5 + b * TAU / 3, ca = Math.cos(a), sa = Math.sin(a); const tip = [x + ca * 230, hy + sa * 34], s1 = [x + ca * 40 - sa * 16, hy + sa * 6 + ca * 3], s2 = [x + ca * 40 + sa * 16, hy + sa * 6 - ca * 3];
    const bl = [s1, [tip[0] - sa * 22, tip[1] + ca * 4], [tip[0] + sa * 22, tip[1] - ca * 4], s2];
    drawPrims(ctx, [{ k: 'knock', poly: bl, a: .7 }, { k: 'wash', poly: bl, col: C.concD, a: .5, seed: b }, { k: 'ink', st: st([...bl, bl[0]], { w: 1.6, seed: 20 + b + boil, smooth: false }) }]);
    drawPen(ctx, st(ellipse(x, hy, 225, 34, 30).slice(0, 8).map(([px, py]) => [px, py]), { w: 1, seed: 30 + b + boil, smooth: true }), 1, INK, .15 * k); }
  drawPrims(ctx, [{ k: 'wash', poly: ellipse(x, hy, 26, 14, 12), col: C.concD, a: .8 }, { k: 'ink', st: st([...ellipse(x, hy, 26, 14, 12), ellipse(x, hy, 26, 14, 12)[0]], { w: 1.8, seed: 40 + boil, smooth: true }) }]);
};
const glass = (ctx, x, y, ang, boil) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const g = [[-21, -72], [21, -72], [17, 0], [-17, 0]];
  drawPrims(ctx, [{ k: 'knock', poly: g }, { k: 'wash', poly: g, col: C.steel, a: .55, seed: 3 }, { k: 'wash', poly: [[6, -70], [14, -70], [11, -2], [5, -2]], col: [255, 255, 255], a: .0 },
    { k: 'ink', st: st([...g, g[0]], { w: 2, seed: 50 + boil, smooth: false }) }, { k: 'ink', st: st(ellipse(0, -72, 21, 5, 12).concat([[21, -72]]), { w: 1.4, seed: 51 + boil, smooth: true }) }, { k: 'ink', st: st([[-8, -64], [-6, -8]], { w: 1, seed: 52 + boil }), alpha: .5 }]);
  ctx.restore();
};
const vibLines = (ctx, x, y, k, boil, n = 3, r = 40) => { if (k <= 0) return; r *= 1.4; for (let i = 0; i < n; i++) for (const s of [-1, 1]) { const rr = r + i * 26; drawPen(ctx, st([[x + s * rr, y - 34], [x + s * (rr + 12), y - 6], [x + s * rr, y + 22]], { w: 2.4, seed: 60 + i + boil * 3 + (s > 0 ? 9 : 0), smooth: true }), 1, INK, k * (1 - i * .22)); } };
const BAG = hex('#7a5a3c');
const bagOnFloor = (ctx, x, y, boil) => { const b = [[x - 55, y - 40], [x + 50, y - 44], [x + 54, y], [x - 56, y + 2]]; drawPrims(ctx, [{ k: 'knock', poly: b }, { k: 'wash', poly: b, col: BAG, a: .7, seed: 7 }, { k: 'ink', st: st([...b, b[0]], { w: 1.8, seed: 70 + boil, smooth: false }) }, { k: 'ink', st: st([[x - 40, y - 42], [x - 10, y - 80], [x + 30, y - 44]], { w: 1.5, seed: 71 + boil, smooth: true }) }]); };

// his tremor graph: the same shape in the bedroom, the court and the echo
const SPK = [.07, .2, .33, .47, .6, .74, .88];
const graphAmp = u => { let a = 0; SPK.forEach((c, i) => { const d = (u - c) / .022; a += Math.exp(-d * d) * (.65 + .35 * n2(i * 3.1, 2)) * (Math.sin(d * 5) * .5 + .8); }); return a + (n2(u * 60, 4) - .5) * .06; };
function graphPts(x0, x1, y0, h, kfn) { const P = []; for (let i = 0; i <= 140; i++) { const u = i / 140; P.push([lerp(x0, x1, u), y0 - graphAmp(u) * h * kfn(u)]); } return P; }

// ---------- dynamic Ramesh in bed (head frame: head centre, rotated; body below the chin) ----------
const BED_HIP = [725, 852], HEAD_OFF = [BED.head[0] - BED_HIP[0], BED.head[1] - BED_HIP[1]], A_REST = Math.atan2(HEAD_OFF[1], HEAD_OFF[0]), HEAD_D = Math.hypot(...HEAD_OFF);
function rameshInBed(ctx, t, ex, boil, o = {}) {
  const a = o.ang ?? A_REST, jit = o.jit ?? [0, 0];
  const hip = [BED_HIP[0] + jit[0], BED_HIP[1] + jit[1]];
  const legs = [[hip[0] - 10, hip[1] - 36], [1100, 842], [1135, 832], [1150, 858], [1135, 892], [hip[0] - 10, hip[1] + 36]];
  drawPrims(ctx, [{ k: 'knock', poly: legs }, { k: 'wash', poly: legs, col: RAMESH.bottom, a: .55, seed: 4 }, { k: 'ink', st: st(legs.slice(0, 4), { w: 2, seed: 80 + boil, smooth: true }) }, { k: 'ink', st: st(legs.slice(3), { w: 2.2, seed: 81 + boil, smooth: true }) }, { k: 'ink', st: st([[900, 846], [1090, 852]], { w: 1.2, seed: 82 + boil }), alpha: .6 }]);
  const hc = [hip[0] + Math.cos(a) * HEAD_D, hip[1] + Math.sin(a) * HEAD_D], hr = a + Math.PI / 2;
  const r = 46;
  ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(hr);
  const torso = [[-r * 1.75, r * 2.5], [r * 1.75, r * 2.5], [r * 1.5, r * 4.6], [-r * 1.5, r * 4.6]];
  drawPrims(ctx, [{ k: 'knock', poly: torso }, { k: 'wash', poly: torso, col: SHIRT, a: .6, seed: 5 }, { k: 'ink', st: st([torso[0], torso[3]], { w: 2, seed: 83 + boil }) }, { k: 'ink', st: st([torso[1], torso[2]], { w: 2.2, seed: 84 + boil }) },
    { k: 'ink', st: st([[-r * 1.5, r * 4.3], [0, r * 4.4], [r * 1.5, r * 4.3]], { w: 2.2, seed: 85 + boil, smooth: true }) }]);
  drawPrims(ctx, rameshHead(r, 0, ex, { seed: 3, boil, shoulder: 1.75 }));
  ctx.restore();
  return { hc, hr, r };
}

// ---------- shot renderers: each draws page + dynamic for absolute time t ----------
const walkX = t => { const u = seg(t, .7, 6.5); const e = u < .1 ? u * u / .2 : u > .9 ? 1 - (1 - u) * (1 - u) / .2 : .05 + (u - .1) * 1.1125 ; return lerp(150, 1600, clamp(e)); };
const STRIDE = 196;
function shotStreet(ctx, t, o = {}) {
  const boil = Math.floor(t * 12), x = walkX(t), moving = t > .7 && t < 6.5;
  const turnK = eio(seg(t, 6.3, 7.0));
  const ph = (x - 150) / STRIDE * Math.PI;
  let pose = moving ? walk(ph, { nod: .25 }) : stand({ nod: .3, lean: .06 });
  pose = { ...pose, lean: (pose.lean ?? 0) + .1, nod: .25 };
  const yaw = lerp(Math.PI / 2, 2.55, turnK);
  const exr = { lid: lerp(.5, .38, seg(t, 6.6, 7.4)), brow: -.25, mouth: 'tired' };
  const pr = ramesh(pose, { x, y: 1150, S: 560, yaw }, { seed: 8, boil, bag: true, bagTilt: .1, ex: exr, turn: lerp(.42, .25, turnK) });
  const hc = pr.head.c;
  const wide = { cx: 1200, cy: 675, z: .84 };
  const follow = { cx: walkX(t - .4) + 140, cy: 900, z: 1.25 };
  const face = { cx: hc[0] + 10, cy: hc[1] + 45, z: 3.0 };
  let cam = mixCam(wide, follow, eio(seg(t, 1.3, 2.6)));
  cam = mixCam(cam, face, eio(seg(t, 6.0, 7.3)));
  if (o.night) cam = o.cam;
  drawPage(ctx, 'street', cam, o.night ? 99 : t);
  worldT(ctx, cam);
  if (!o.night) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba([150, 130, 120], .22); ctx.beginPath(); ctx.ellipse(x, 1154, 120, 14, 0, 0, TAU); ctx.fill(); ctx.restore();
    drawPrims(ctx, pr, { color: seg(t, .9, 1.6), ink: seg(t, .6, 1.2) });
  }
  return cam;
}
function shotBed(ctx, t, night) {
  const boil = Math.floor(t * 12);
  let keys, ex, ang = A_REST, jit = [0, 0], sh = 0, drill = 0, glassA = 0, glassP = [BED.table[0], BED.table[1] - 2], fanK = 1;
  if (!night) {
    keys = [[T_BED, 900, 700, .92], [8.9, 880, 720, .95], [Math.min(10.1, B.drilling - .2), 575, 840, 2.5, , .7], [B.drilling + .15, 575, 840, 2.6, , .7], [B.drilling + 1.15, 1960, 640, 1.1], [B.bed_shakes - .3, 1960, 650, 1.12, t => t * t * t], [B.bed_shakes, 830, 800, 1.3], [B.sleepless - .9, 820, 800, 1.36], [B.sleepless - .25, 700, 560, 1.05], [B.sleepless - .05, 700, 560, 1.06], [B.sleepless + .7, 575, 830, 2.45, , .7], [Math.max(B.sleepless + 1.15, SC.s3.t0 + .2), 575, 830, 2.5, , .7], [19.25, 960, 1120, 1.75], [SC.s4.t0, 980, 1125, 1.85]];
    const fall = eio(seg(t, 8.45, 8.85)); ang = lerp(-Math.PI / 2 - .25, A_REST, fall) + bump(t, 8.85, 9.1) * .03;
    jit = [0, -(1 - fall) * 30];
    const sleepK = seg(t, 9.3, 9.95), wake = seg(t, B.drilling - .05, B.drilling + .12);
    ex = { lid: wake > 0 ? lerp(.05, 1, wake) - seg(t, 13, 14) * .1 + seg(t, 16.8, 17.6) * -.05 : lerp(.5, .04, sleepK), brow: wake > 0 ? lerp(.6, -.25, seg(t, 13, 15)) : -.2, mouth: wake > 0 && t < 13 ? 'open' : 'tired', look: wake > 0 ? [.9, -.1] : [0, 0], tired: 1.2 };
    drill = t > B.drilling - .3 && t < SC.s4.t0 ? 1 : 0;
    sh = (bump(t, B.bed_shakes - .05, B.bed_shakes + 1.1) * 9 + bump(t, B.walls - .05, B.walls + 1.0) * 6 + drill * 1.2) * (t < 18.4 ? 1 : .3);
    jit = [jit[0] + (n2(t * 31, 2) - .5) * sh * .6, jit[1] + (n2(t * 29, 5) - .5) * sh * .6];
    glassA = (n2(t * 40, 9) - .5) * .04 * sh; glassP = [glassP[0] + (n2(t * 37, 3) - .5) * sh * .5, glassP[1]];
  } else {
    keys = [[SC.s6.t0, 900, 700, .95], [B.shakes6 - 1.3, 900, 700, .95], [B.shakes6 - .3, 860, 800, 1.4], [B.this_time - .1, 860, 800, 1.45], [B.this_time + .5, 575, 830, 2.3, , .7], [B.isnt - .45, 575, 830, 2.35, , .7], [B.isnt, 900, 690, .95]];
    const q1 = seg(t, B.shakes6 - .1, B.shakes6 + .3), q2 = seg(t, B.this_time, B.isnt);
    sh = q1 * 5 + q2 * q2 * 30 + (t > B.isnt ? 30 : 0);
    jit = [(n2(t * 31, 2) - .5) * sh * .8, (n2(t * 29, 5) - .5) * sh * .8];
    ex = { lid: t > B.this_time ? 1 : .88, brow: t > B.this_time ? .9 : -.35, mouth: t > B.this_time + .2 ? 'o' : 'grim', look: t > B.this_time ? [.3, -.5] : [.9, -.1], tired: 1.2, sweat: t > B.shakes6 };
    const fallG = seg(t, B.this_time + .5, B.this_time + .95);
    glassA = (n2(t * 40, 9) - .5) * .05 * sh + fallG * 1.4; glassP = [glassP[0] + (n2(t * 37, 3) - .5) * sh * .4 + fallG * 60, glassP[1] + fallG * fallG * 150];
    fanK = 1;
  }
  let cam = shake(camPath(keys, t), t, sh * (night ? 1.6 : 1.2));
  drawPage(ctx, 'bed', cam, night ? 99 : t - T_BED);
  if (night && sh > 8) { const P = getPage('bed'); ctx.globalAlpha = clamp((sh - 8) / 40) * .45; ctx.drawImage(P.glc, (n2(t * 50, 1) - .5) * sh * .6, (n2(t * 50, 2) - .5) * sh * .6); ctx.globalAlpha = 1; }
  worldT(ctx, cam);
  const dk = night ? 1 : seg(t, T_BED + .9, T_BED + 1.5);
  // the site next door: auger + hammer
  { const hamP = drill ? ((t - B.drilling) % .9 + .9) % .9 : .5, hy = drill ? (hamP < .12 ? lerp(300, 790, (hamP / .12) ** 2) : lerp(790, 300, eio((hamP - .12) / .78))) : 300;
    const hm = rect(2115, hy, 2175, hy + 110); drawPrims(ctx, [{ k: 'knock', poly: hm }, { k: 'wash', poly: hm, col: C.tank, a: .7 }, { k: 'ink', st: st([...hm, hm[0]], { w: 2, seed: 90 + boil, smooth: false }) }, { k: 'ink', st: st([[2145, 232], [2145, hy]], { w: 1.2, seed: 91 }) }], { color: dk, ink: dk });
    if (drill && hamP < .3) vibLines(ctx, 2145, 1000, 1 - hamP / .3, boil, 3, 50);
    const ph = drill ? t * 9 : 0; drawPen(ctx, st([[1888, 300], [1888, 1010]], { w: 3, seed: 92 }), dk);
    for (let k = 0; k < 18; k++) { const y = 320 + ((k * 40 + ph * 12) % 690); drawPen(ctx, st([[1876, y], [1900, y + 14]], { w: 1.5, seed: 93 + k }), dk, INK, .8); }
    if (drill) vibLines(ctx, 1888, 1010, .7 + .3 * Math.sin(t * 30), boil, 2, 34); }
  // walls crack on "walls"
  { const cp = seg(t, night ? 99 : B.walls, (night ? 99 : B.walls) + .5); const crack = night ? 1 : cp;
    if (crack > 0) { drawPen(ctx, st([[1505, 200], [1470, 330], [1500, 420], [1460, 560]], { w: 1.8, seed: 95 }), crack); drawPen(ctx, st([[160, 600], [230, 640], [215, 720], [270, 790]], { w: 1.6, seed: 96 }), crack); drawPen(ctx, st([[980, 175], [1010, 240], [990, 300]], { w: 1.5, seed: 97 }), crack); }
    if (!night && t > B.walls && t < B.walls + 1.4) { vibLines(ctx, 1490, 380, 1 - seg(t, B.walls + .6, B.walls + 1.4), boil, 3, 30); vibLines(ctx, 200, 680, 1 - seg(t, B.walls + .6, B.walls + 1.4), boil, 3, 30); } }
  fan(ctx, BED.fan[0] + (night ? (n2(t * 8, 3) - .5) * sh * 1.5 : 0), BED.fan[1], t, boil, fanK);
  bagOnFloor(ctx, 330, 1100, boil);
  // notice on the table (night): the same paper from court
  if (night) { const np = [[1230, 852], [1330, 846], [1336, 858], [1236, 864]]; const np2 = [[1290, 860], [1385, 852], [1392, 872], [1300, 878]]; drawPrims(ctx, [{ k: 'knock', poly: np2 }, { k: 'wash', poly: np2, col: [240, 232, 214], a: .4 }, { k: 'ink', st: st([...np2, np2[0]], { w: 1.4, seed: 99, smooth: false }) }]); ctx.save(); ctx.translate(1300, 869); ctx.rotate(-.08); ctx.font = `700 14px ${FONT}`; ctx.fillStyle = rgba(INK, .9); ctx.fillText('DEFAMATION', 0, 0); ctx.restore(); }
  glass(ctx, glassP[0], glassP[1], glassA, boil);
  if (!night && sh > 2) vibLines(ctx, glassP[0], glassP[1] - 40, clamp(sh / 8), boil, 2, 30);
  if (t >= 8.4 || night) rameshInBed(ctx, t, ex, boil, { ang, jit });
  if (!night && t < 8.45 && t > T_BED + .3) rameshInBed(ctx, t, ex, boil, { ang, jit });
  if (!night && sh > 5) { vibLines(ctx, 760, 900, clamp(sh / 12), boil, 3, 70); vibLines(ctx, 1150, 980, clamp(sh / 12), boil, 2, 40); }
  // s3: the phone, the graph sheet, the pile of dated logs
  if (!night && t > 18.3) {
    const pk = seg(t, B.records - .3, B.records + .2);
    ctx.save(); ctx.translate(BED.phone[0], BED.phone[1]); ctx.rotate(.12);
    const ph = rect(-45, -85, 45, 85), scr = rect(-37, -70, 37, 68);
    drawPrims(ctx, [{ k: 'knock', poly: ph }, { k: 'wash', poly: ph, col: hex('#3a3a40'), a: .8 }, { k: 'ink', st: st([...ph, ph[0]], { w: 2, seed: 101, smooth: false }) }, { k: 'knock', poly: scr, a: .9 * pk }]);
    if (pk > 0) { drawPen(ctx, st(graphPts(-34, 34, 20, 40, u => seg(t, B.records + u * 1.5, B.records + u * 1.5 + .1)).map(([x, y]) => [x, y]), { w: 1.6, seed: 102, wob: .3, smooth: false }), clamp((t - B.records) / 1.5), INK); handwrite(ctx, 'REC', -30, -50, 16, pk, { font: FONT, weight: 700 }); }
    ctx.restore();
    // big graph sheet
    const sp = seg(t, 18.7, 19.3), gx0 = 920, gx1 = 1450, gy0 = 1215;
    const sheet = rough(rect(890, 1030, 1475, 1250), 2, 5);
    drawPrims(ctx, [{ k: 'knock', poly: sheet, a: .96 * sp }, { k: 'ink', st: st([...sheet, sheet[0]], { w: 1.6, seed: 103, smooth: false }) }], { ink: sp });
    if (sp > 0) {
      for (let k = 0; k < 4; k++) drawPen(ctx, st([[905, 1070 + k * 45], [1460, 1071 + k * 45]], { w: .8, seed: 104 + k }), sp, hex('#7f9fbf'), .5);
      drawPen(ctx, st([[gx0, 1060], [gx0, gy0], [gx1, gy0]], { w: 1.8, seed: 108, smooth: false }), sp);
      handwrite(ctx, 'vibration log', 960, 1062, 26, seg(t, 19.0, 19.6), { font: FONT, weight: 700 });
      SPK.forEach((u, i) => handwrite(ctx, `N${i + 1}`, lerp(gx0, gx1, u) - 10, gy0 + 26, 15, seg(t, 19.4 + i * .1, 19.6 + i * .1), { font: FONT, alpha: .7 }));
      const gp = graphPts(gx0, gx1, gy0 - 6, 120, () => 1);
      drawPen(ctx, st(gp, { w: 2.2, seed: 110, wob: .5, smooth: false, over: 0 }), eio(seg(t, B.records + .2, B.every_tremor + 1.0)));
    }
    // dated sheets pile up
    const dates = ['3 Nov', '4 Nov', '5 Nov', '6 Nov', '7 Nov', '8 Nov'];
    dates.forEach((d, i) => { const t0 = B.every_night - .3 + i * .17, p = seg(t, t0, t0 + .22); if (p <= 0) return;
      const x = 500 + (n2(i, 3) - .5) * 30, y = 1190 - i * 7 - (1 - p) * 220, a = (n2(i, 7) - .5) * .3;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); const s = rect(-80, -55, 80, 55);
      drawPrims(ctx, [{ k: 'knock', poly: s }, { k: 'wash', poly: s, col: [240, 234, 220], a: .3, seed: i }, { k: 'ink', st: st([...s, s[0]], { w: 1.4, seed: 120 + i, smooth: false }) }]);
      handwrite(ctx, d + ' · 2 am', -66, -26, 19, 1, { font: FONT, weight: 700 });
      drawPen(ctx, st([[-66, 20], [-40, 18], [-30, -14], [-20, 30], [-8, 12], [20, 16], [30, -20], [40, 24], [66, 16]], { w: 1.4, seed: 130 + i, smooth: false }), 1);
      ctx.restore(); });
  }
  if (night) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba(NIGHT, .55 + clamp(sh / 60) * .1); ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
    const ws = toScreen(cam, [1300, 500]); ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(ws[0], ws[1], 10, ws[0], ws[1], 420 * cam.z); g.addColorStop(0, 'rgba(120,120,150,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
    worldT(ctx, cam); handwrite(ctx, '14 Nov · 2:10 am', 160, 82, 40, seg(t, SC.s6.t0 + .3, SC.s6.t0 + 1.1), { font: FONT, weight: 700, col: [230, 222, 205], alpha: .9 }); }
  return cam;
}
function official(x, y, yaw, ph, moving, seed, boil, o = {}) { const pose = moving ? walk(ph) : stand({ lean: .02 }); if (o.handR) Object.assign(pose, { handR: o.handR, elbR: V(1, -.5, -.3) }); return figure(OFFICIAL, pose, { x, y, S: 540, yaw }, { seed, boil }); }
function shotCourt(ctx, t) {
  const boil = Math.floor(t * 12), lt = t - SC.s4.t0;
  // Ramesh standing centre, facing the camera, turned a little toward the board
  const shock = t > SHOCK - .25 && t < SC.s5.t0 + .8;
  const rp = ramesh(stand({ lean: .04, nod: shock ? -.1 : .15, armL: .05, armR: shock ? .5 : -.05, bendR: shock ? 1.6 : .2 }), { x: COURT.rameshAt[0], y: COURT.rameshAt[1], S: 430, yaw: Math.PI - .35 }, { seed: 8, boil, ex: shock ? { lid: 1, brow: 1, mouth: 'o', tired: .7 } : t > B.court + 3 ? { lid: .7, brow: -.5, mouth: 'grim' } : { lid: .55, brow: -.2, mouth: 'flat' }, turn: -.25 });
  const hc = rp.head.c;
  const keys = [[SC.s4.t0, 1200, 675, .84], [B.court + .25, 1200, 675, .84], [B.court + 1.2, 812, 712, 2.3], [SHOCK - .2, 812, 712, 2.3], [SHOCK + .12, hc[0], hc[1] + 40, 4.6, t => 1 - (1 - t) ** 3], [SC.s5.t0 + .25, hc[0], hc[1] + 40, 4.5], [SC.s5.t0 + 1.2, 1300, 880, 1.15], [B.handed + .15, 1300, 880, 1.15], [B.defamation - .2, 1250, 760, 2.9, t => 1 - (1 - t) ** 3], [SC.s6.t0 + 1, 1250, 760, 2.95]];
  let sh = bump(t, 29.2 + (B.officially - 29.108) + .12, B.officially + .55) * 10 + bump(t, SHOCK + .05, SHOCK + .4) * 8 + bump(t, B.defamation - .12, B.defamation + .25) * 9;
  const stampT = B.officially + .15;
  sh = bump(t, stampT, stampT + .35) * 10 + bump(t, SHOCK + .05, SHOCK + .4) * 8 + bump(t, B.defamation - .12, B.defamation + .25) * 9;
  const cam = shake(camPath(keys, t), t, sh);
  drawPage(ctx, 'court', cam, lt);
  worldT(ctx, cam);
  const dk = seg(lt, .9, 1.6);
  handwrite(ctx, 'District Court · 14 Nov', 160, 82, 40, seg(lt, .5, 1.3), { font: FONT, weight: 700 });
  // judge behind the bench (clipped by it)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 600); ctx.clip(); drawPrims(ctx, figure(JUDGE, stand({ nod: .12 }), { x: 1200, y: 830, S: 520, yaw: Math.PI }, { seed: 4, boil }), { color: dk, ink: dk, knock: dk }); ctx.restore();
  // gavel tap on "court"
  { const gp = bump(t, B.court - .25, B.court + .05); const g = rect(1290, 560 - gp * 30, 1340, 578 - gp * 30); drawPrims(ctx, [{ k: 'wash', poly: g, col: C.wood, a: .8 }, { k: 'ink', st: st([...g, g[0]], { w: 1.6, seed: 140 + boil, smooth: false }) }], { color: dk, ink: dk }); if (t > B.court && t < B.court + .5) vibLines(ctx, 1315, 575, 1 - seg(t, B.court, B.court + .5), boil, 2, 40); }
  // ---- the evidence board ----
  const [bx0, by0, bx1, by1] = COURT.board;
  const fade = 1 - .75 * eio(seg(t, stampT + .25, stampT + 2.0));
  const brd = rough(rect(bx0, by0, bx1, by1), 2, 9);
  drawPrims(ctx, [{ k: 'knock', poly: brd, a: .97 }, { k: 'wash', poly: brd, col: [244, 238, 222], a: .25 }, { k: 'ink', st: st([...brd, brd[0]], { w: 2.2, seed: 141, smooth: false }) }], { ink: dk, color: dk });
  if (dk > 0) {
    const gx0 = 590, gx1 = 890, gy0 = 740;
    drawPen(ctx, st([[gx0, 560], [gx0, gy0], [gx1, gy0]], { w: 1.8, seed: 142, smooth: false }), dk);
    handwrite(ctx, 'Ramesh · vibration log', 598, 572, 21, dk, { font: FONT, weight: 700, alpha: .9 * fade });
    // eraser sweep: left of ex the spikes are gone
    const ep = seg(t, B.tampered - .05, B.tampered + 1.35), ex = lerp(gx0 - 20, gx1 + 30, eio(ep)) + Math.sin(t * 26) * 18 * bump(ep, 0, 1);
    const flat = u => clamp((lerp(gx0, gx1, u) - (ep > 0 ? ex : -1e9) + 10) / 20);
    drawPen(ctx, st(graphPts(gx0 + 4, gx1, gy0 - 8, 150, flat), { w: 2.3, seed: 143, wob: .4, smooth: false, over: 0 }), 1, INK, fade);
    if (ep > 0) { for (let k = 0; k < 14; k++) { const u = n2(k, 1), x = lerp(gx0, Math.min(ex, gx1), u); const fallY = gy0 + 4 + ((t - B.tampered) * 80 * (.4 + n2(k, 3))) % 140; if (x < ex - 10) dab(ctx, x, fallY, 2.5, k, [215, 205, 195], .8 * fade, k); }
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; wash(ctx, rect(gx0, 600, Math.min(ex, gx1), gy0 - 4), [200, 196, 205], { a: .25 * fade, j: 6, seed: 3, edge: 0 }); ctx.restore(); }
    // dates column: crossed out and rewritten
    const dates = ['3 Nov  2:14 am', '4 Nov  1:50 am', '5 Nov  2:31 am', '6 Nov  3:05 am', '7 Nov  2:20 am'];
    dates.forEach((d, i) => { const y = 600 + i * 34, x = 905;
      handwrite(ctx, d, x, y, 19, dk, { font: FONT, weight: 700, alpha: .9 * fade });
      const sk = seg(t, B.rewritten - .15 + i * .12, B.rewritten + i * .12);
      if (sk > 0) { drawPen(ctx, st([[x - 4, y - 6], [x + 145, y - 8]], { w: 2.4, seed: 150 + i }), sk, INK, fade); handwrite(ctx, 'no record', x + 18, y + 15, 15, seg(t, B.rewritten + .05 + i * .12, B.rewritten + .3 + i * .12), { font: FONT, alpha: .85 * fade }); } });
    // permit card
    const pc = rough(rect(590, 780, 1030, 885), 1.5, 4);
    drawPrims(ctx, [{ k: 'wash', poly: pc, col: hex('#d8cfa8'), a: .45, seed: 9 }, { k: 'ink', st: st([...pc, pc[0]], { w: 1.6, seed: 160, smooth: false }) }], { color: dk, ink: dk });
    handwrite(ctx, 'SITE 14 · Building permit', 606, 812, 22, dk, { font: FONT, weight: 700, alpha: .9 * fade });
    handwrite(ctx, 'Piling + drilling: 1 Oct – 30 Nov', 606, 844, 18, dk, { font: FONT, alpha: .85 * fade });
    // the eraser + the hand holding it (an official's sleeve from the right)
    if (ep > 0 && ep < 1 || bump(t, B.tampered - .4, B.tampered + 1.8) > 0) {
      const inK = eio(seg(t, B.tampered - .45, B.tampered - .05)) * (1 - eio(seg(t, B.tampered + 1.35, B.tampered + 1.8)));
      const exx = ep > 0 && ep < 1 ? ex : ep >= 1 ? gx1 + 30 : gx0 - 20, eyy = lerp(560, 690, .5) + (n2(t * 9, 3) - .5) * 30 * bump(ep, 0, 1);
      const off = (1 - inK) * 600;
      const sl = [[exx + 30 + off, eyy - 10 - off * .5], [1400 + off, 300 - off * .5], [1440 + off, 360 - off * .5], [exx + 40 + off, eyy + 22 - off * .5]];
      drawPrims(ctx, [{ k: 'knock', poly: sl }, { k: 'wash', poly: sl, col: OFFICIAL.top, a: .75 }, { k: 'ink', st: st([sl[0], sl[1]], { w: 2.2, seed: 170 + boil }) }, { k: 'ink', st: st([sl[3], sl[2]], { w: 2.2, seed: 171 + boil }) }]);
      const hd = ellipse(exx + 22 + off, eyy + 5 - off * .5, 26, 20, 12); drawPrims(ctx, [{ k: 'knock', poly: hd }, { k: 'wash', poly: hd, col: OFFICIAL.skin, a: .55 }, { k: 'ink', st: st(hd.slice(2, 10), { w: 1.6, seed: 172 + boil }) }]);
      const er = rect(exx - 30 + off, eyy - 14 - off * .5, exx + 30 + off, eyy + 18 - off * .5); drawPrims(ctx, [{ k: 'knock', poly: er }, { k: 'wash', poly: er, col: hex('#ece6d6'), a: .5 }, { k: 'wash', poly: rect(er[0][0], er[0][1], er[0][0] + 22, er[2][1]), col: hex('#7f9fbf'), a: .45 }, { k: 'ink', st: st([...er, er[0]], { w: 1.8, seed: 173 + boil, smooth: false }) }]);
    }
    // the NO ACTIVITY stamp
    const sp = seg(t, stampT - .35, stampT), lift = seg(t, stampT + .12, stampT + .5);
    if (sp > 0 && lift < 1) { const sy = lerp(400, 832, eio(sp)) - lift * 420, sx = 900; const hdl = [[sx - 22, sy - 120], [sx + 22, sy - 120], [sx + 22, sy - 30], [sx - 22, sy - 30]], bl = rect(sx - 90, sy - 30, sx + 90, sy);
      drawPrims(ctx, [{ k: 'knock', poly: hdl }, { k: 'wash', poly: hdl, col: C.wood, a: .7 }, { k: 'ink', st: st([...hdl, hdl[0]], { w: 2, seed: 180 + boil, smooth: false }) }, { k: 'knock', poly: bl }, { k: 'wash', poly: bl, col: C.tank, a: .7 }, { k: 'ink', st: st([...bl, bl[0]], { w: 2, seed: 181 + boil, smooth: false }) }]); }
    if (t > stampT) { ctx.save(); ctx.translate(810, 834); ctx.rotate(-.1); const pop = 1 + .15 * (1 - seg(t, stampT, stampT + .15)); ctx.scale(pop, pop);
      const fr = rough(rect(-170, -40, 170, 34), 3, 7); drawPen(ctx, st([...fr, fr[0], fr[1]], { w: 4, seed: 190, wob: 1.5, smooth: false, over: 0 }), 1, INK, .92);
      ctx.font = `700 54px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = rgba(INK, .9); ctx.fillText('NO ACTIVITY', 0, 16); ctx.restore(); }
    // a grey wash floods the evidence
    const fl = eio(seg(t, stampT + .2, stampT + 2.2));
    if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; wash(ctx, rough(ellipse(810, 710, 80 + 330 * fl, 60 + 250 * fl, 30), 18, 4, 14, .03), [150, 150, 170], { a: .45 * fl, j: 12, seed: 6, edge: .5, layers: 3 }); ctx.restore();
      if (fl < 1) for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + .3, rr = (80 + 330 * fl) * (.95 + .05 * n2(k, 1)); dab(ctx, 810 + Math.cos(a) * rr, 710 + Math.sin(a) * rr * .75, 8, a, [150, 150, 170], .3 * (1 - fl), k); } }
  }
  // officials: three identical suits, standing by the table, then converging on Ramesh
  const wk = seg(t, SC.s5.t0 + .1, B.handed - .2);
  const from = [[1760, 1000], [1940, 1000], [2120, 1000]], to = [[980, 1150], [1560, 1160], [1450, 1040]];
  const offs = from.map((f, i) => { const p = eio(seg(wk, i * .08, .84 + i * .08)); return [lerp(f[0], to[i][0], p), lerp(f[1], to[i][1], p), p > 0 && p < 1]; });
  const handOut = eio(seg(t, B.handed - .6, B.handed));
  [1, 2, 0].forEach(i => { const [x, y, mv] = offs[i]; const yaw = i === 0 && wk > .5 ? Math.PI / 2 + .3 : -Math.PI / 2 - .3;
    const pr = official(x, y, mv ? yaw : (wk > 0 ? yaw : Math.PI + .5), (x - from[i][0]) / 160 * Math.PI, mv, 7, boil, i === 1 ? { handR: V(.05, lerp(.45, .78, handOut), lerp(.1, .42, handOut)) } : {});
    drawPrims(ctx, pr, { color: dk, ink: dk, knock: dk });
    if (i === 1 && t < B.handed && wk > 0) { const h = pr.hand.R; const np = rect(h[0] - 40, h[1] - 52, h[0] + 30, h[1] + 40); drawPrims(ctx, [{ k: 'knock', poly: np }, { k: 'wash', poly: np, col: [240, 232, 214], a: .3 }, { k: 'ink', st: st([...np, np[0]], { w: 1.6, seed: 200 + boil, smooth: false }) }]); }
  });
  drawPrims(ctx, rp, { color: dk, ink: dk, knock: dk });
  // the notice in Ramesh's hands, raised to camera, stamped DEFAMATION
  if (t >= B.handed) { const up = eio(seg(t, B.handed, B.defamation - .25)); const cxn = lerp(1290, 1250, up), cyn = lerp(900, 770, up), sw = lerp(70, 230, up), sh2 = lerp(92, 290, up);
    const np = rect(cxn - sw / 2, cyn - sh2 / 2, cxn + sw / 2, cyn + sh2 / 2);
    drawPrims(ctx, [{ k: 'knock', poly: np, a: .98 }, { k: 'wash', poly: np, col: [240, 232, 214], a: .3 }, { k: 'ink', st: st([...np, np[0]], { w: 1.8, seed: 210 + boil, smooth: false }) }]);
    if (up > .5) { const a = seg(up, .5, 1); handwrite(ctx, 'LEGAL NOTICE', cxn - sw * .4, cyn - sh2 * .34, 22 * up, a, { font: FONT, weight: 700 }); for (let k = 0; k < 5; k++) drawPen(ctx, st([[cxn - sw * .4, cyn - sh2 * .22 + k * 22], [cxn + sw * (.2 + .2 * n2(k, 2)), cyn - sh2 * .22 + k * 22]], { w: 1.1, seed: 220 + k }), a, INK, .6); }
    const hs = [[cxn - sw / 2 + 4, cyn + sh2 * .35], [cxn + sw / 2 - 4, cyn + sh2 * .35]]; hs.forEach((h, k) => { const hp = ellipse(h[0], h[1], 18 + up * 8, 13 + up * 6, 10); drawPrims(ctx, [{ k: 'knock', poly: hp }, { k: 'wash', poly: hp, col: RAMESH.skin, a: .55 }, { k: 'ink', st: st(hp.slice(1, 9), { w: 1.4, seed: 230 + k + boil }) }]); });
    if (t > B.defamation - .05) { ctx.save(); ctx.translate(cxn, cyn + 50); ctx.rotate(-.14); const pop = 1 + .2 * (1 - seg(t, B.defamation - .05, B.defamation + .12)); ctx.scale(pop, pop);
      const fr = rough(rect(-108, -30, 108, 22), 2, 8); drawPen(ctx, st([...fr, fr[0], fr[1]], { w: 3.2, seed: 240, wob: 1.2, smooth: false, over: 0 }), 1, INK, .92);
      ctx.font = `700 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = rgba(INK, .92); ctx.fillText('DEFAMATION', 0, 8); ctx.restore(); } }
  return cam;
}
// rubble: rescuers, survivors, Ramesh, ripples, the graph echo, the mesh, the title
const NODES = [[520, 960], [760, 880], [990, 815], [1420, 840], [1680, 960], [1900, 1080], [700, 1170], [1600, 1200], [1150, 1260], [1040, 900]];
const LINKS = []; NODES.forEach((a, i) => NODES.forEach((b, k) => { if (k > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 420) LINKS.push([i, k]); }));
const TAPS = [56.25, 56.85, 57.45, 58.15, 59.25, 59.95, 60.65, 61.35, 62.05, 62.75, 63.45, 64.15, 64.85, 65.55, 66.25, 67.0].map(x => x + (SC.s8.t0 - 55.85));
const rescuer = (x, y, yaw, pose, seed, boil, dk) => { const pr = figure(RESCUER, pose, { x, y, S: 330, yaw }, { seed, boil }); drawPrims(ctx0, pr, { color: dk, ink: dk }); const { c, r } = pr.head; const hel = [...ellipse(c[0], c[1] - r * .2, r * 1.15, r * .9, 14).filter(([, yy]) => yy < c[1] - r * .15), [c[0] + r * 1.3, c[1] - r * .1], [c[0] - r * 1.3, c[1] - r * .1]]; drawPrims(ctx0, [{ k: 'knock', poly: hel }, { k: 'wash', poly: hel, col: C.sign, a: .8 }, { k: 'ink', st: st([...hel, hel[0]], { w: 1.4, seed: seed + boil, smooth: true }) }], { color: dk, ink: dk }); return pr; };
let ctx0;
function torchBeam(ctx, h, dir, k) { if (k <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'screen'; const L2 = 300; const a = Math.atan2(dir[1], dir[0]); const p = [h, [h[0] + Math.cos(a - .22) * L2, h[1] + Math.sin(a - .22) * L2], [h[0] + Math.cos(a + .22) * L2, h[1] + Math.sin(a + .22) * L2]]; const g = ctx.createRadialGradient(h[0], h[1], 4, h[0], h[1], L2); g.addColorStop(0, `rgba(255,236,170,${.5 * k})`); g.addColorStop(1, 'rgba(255,236,170,0)'); ctx.fillStyle = g; ctx.beginPath(); p.forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q)); ctx.fill(); ctx.restore(); }
function shotRubble(ctx, t) {
  const boil = Math.floor(t * 12), lt = t - SC.s7.t0;
  getPage('rubble');
  // Ramesh in the pocket
  const tapK = TAPS.reduce((m, tp) => { const d = t - tp; return d > -.12 && d < .12 ? Math.max(m, 1 - Math.abs(d) / .12) : m; }, 0);
  const found = seg(t, B.prove + .7, B.prove + 1.3);
  const pose = { ...prone(), hipY: .08, lean: 1.35, nod: -.55, handR: V(.08, .3 + .05 * (1 - tapK), .55), elbR: V(1, -.6, 0), handL: V(-.12, .03, .5), elbL: V(-1, -1, 0), footL: V(-.1, .04, -.78), footR: V(.08, .05, -.72) };
  const rp = ramesh(pose, { x: 1110, y: 1138, S: 400, yaw: Math.PI / 2, pitch: .2 }, { seed: 5, boil, turn: .42, headRot: -.25, ex: { lid: found > 0 ? lerp(.6, .95, found) : .6, brow: found > 0 ? .5 : -.45, mouth: found > .5 ? 'open' : 'grim', dust: 1, tired: 1.2 } });
  const hc = rp.head.c, hand = rp.hand.R;
  const keys = [[SC.s7.t0, 1200, 675, .84], [SC.s7.t0 + 1.2, 1200, 675, .84], [B.rubble - .6, 700, 760, 1.35], [B.rubble + .9, 700, 760, 1.35], [B.rubble + 1.9, 1700, 780, 1.35], [B.trapped - 1.1, 1700, 780, 1.35], [B.trapped + .4, 1180, 1060, 2.0], [B.no_one + .4, hc[0] + 20, hc[1] + 20, 3.3], [SC.s8.t0 + .4, hc[0] + 60, hc[1] + 10, 2.6], [SC.s9.t0 + .2, hc[0] + 60, hc[1] + 10, 2.6], [B.vibrations + .4, 1200, 720, .95], [SC.s10.t0 + .2, 1200, 720, .95], [B.map + .4, 1200, 850, 1.15], [B.prove + .8, 1180, 1030, 1.6], [RESC0, 1180, 1030, 1.6], [RESC0 + 1.0, 1185, 960, 1.6], [RESC0 + 2.3, 1190, 865, 2.6], [END, 1190, 855, 2.95]];
  const cam = shake(camPath(keys, t), t, tapK * 3);
  drawPage(ctx, 'rubble', cam, lt);
  worldT(ctx, cam); ctx0 = ctx;
  const dk = seg(lt, .9, 1.7);
  handwrite(ctx, '15 Nov · 6:40 am', 160, 82, 40, seg(lt, .7, 1.5), { font: FONT, weight: 700 });
  // rescuers with torches, survivors lifted one by one
  const pairs = [{ x: 680, t0: B.morning + .4 }, { x: 1760, t0: B.rubble + 1.4 }];
  pairs.forEach((P, k) => {
    const y = moundY(P.x), up = eio(seg(t, P.t0, P.t0 + 2.0));
    const clip = () => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, moundY(2080)); for (let i = MOUND_TOP.length - 1; i >= 0; i--) ctx.lineTo(...MOUND_TOP[i]); ctx.lineTo(0, moundY(330)); ctx.closePath(); };
    ctx.save(); clip(); ctx.clip();
    const sv = figure(SURVIVOR, { ...stand({ nod: .3, lean: .25 }), armL: -2.6 * up + .1, armR: -2.6 * up + .1, abdL: .4, abdR: .4 }, { x: P.x, y: y + lerp(300, 30, up), S: 300, yaw: Math.PI }, { seed: 30 + k, boil });
    drawPrims(ctx, sv, { color: dk, ink: dk }); ctx.restore();
    const lean = .5 - .3 * up;
    const ra = rescuer(P.x - 95, y + 10, Math.PI / 2 + .3, { ...stand({ lean, nod: .3 }), handR: V(.06, lerp(.35, .7, up), .3), handL: V(-.05, .55, .22) }, 40 + k, boil, dk);
    const rb = rescuer(P.x + 95, y + 14, -Math.PI / 2 - .3, { ...stand({ lean, nod: .3 }), handR: V(.06, lerp(.35, .7, up), .3), handL: V(-.06, .6, .25) }, 50 + k, boil, dk);
    torchBeam(ctx, ra.hand.L, [1, .9], dk * .8); torchBeam(ctx, rb.hand.L, [-1, .9], dk * .8);
  });
  // dust motes drifting in morning light
  if (t < SC.s8.t0) for (let k = 0; k < 40; k++) { const x = 200 + n2(k, 1) * 2000 + (t * 12 * (n2(k, 2) - .3)) % 200, y = 300 + n2(k, 3) * 700 - (t * 8) % 300; dab(ctx, x, y, 2 + n2(k, 5) * 3, k, C.dust, .35 * dk, k); }
  // the glow when found
  if (found > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; wash(ctx, rough(ellipse(1180, 1085, 60 + 230 * ss(found), 22 + 70 * ss(found), 24), 10, 3, 12), C.find, { a: .55 * ss(found), j: 8, seed: 9, edge: .4 }); ctx.restore(); }
  if (t < RESC0 + 1.25) drawPrims(ctx, rp, { color: 1, ink: 1 });
  bagOnFloor(ctx, 1395, 1150, boil);
  // darkness (s8) with a pool of light at his hand
  const dark = eio(seg(t, SC.s8.t0 - .2, SC.s8.t0 + .35)) * (1 - eio(seg(t, SC.s9.t0 + .1, SC.s9.t0 + 1.2)));
  if (dark > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); const hs = toScreen(cam, [lerp(hand[0], hc[0], .5), lerp(hand[1], hc[1], .5)]); const g = ctx.createRadialGradient(hs[0], hs[1], 60, hs[0], hs[1], 520); g.addColorStop(0, `rgba(22,18,16,${.35 * dark})`); g.addColorStop(1, `rgba(22,18,16,${.93 * dark})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); worldT(ctx, cam); }
  const ripCol = mix3(INK, PAPER, dark);
  // tap marks + ripples
  TAPS.forEach((tp, i) => { const d = t - tp; if (d < 0) return;
    if (d < .5) for (let k = -1; k <= 1; k += 2) drawPen(ctx, st([[hand[0] + k * 14, hand[1] - 18], [hand[0] + k * 26, hand[1] - 32], [hand[0] + k * 30, hand[1] - 48]], { w: 2, seed: 90 + i * 3 + k, smooth: true }), 1, ripCol, 1 - d / .5);
    const big = tp > SC.s9.t0 - .2, life = big ? 2.4 : 1.5, speed = big ? 820 : 360;
    for (let r = 0; r < 3; r++) { const dd = d - r * .14; if (dd <= 0 || dd > life) continue;
      const rad = 30 + dd * speed, a = Math.min(1, Math.pow(1 - dd / life, 1.1) * 1.3);
      const pts = [...Array(72)].map((_, k) => { const ang = k / 71 * TAU; const jj = 1 + (n2(k * .4, i * 7 + r + boil * .3) - .5) * .08; return [hand[0] + Math.cos(ang) * rad * jj, hand[1] + Math.sin(ang) * rad * .55 * jj]; });
      const s = penStroke(pts, { w: (big ? 5 : 4) - r * 1.2, wob: 2, over: 0, gap: 1, seed: 200 + i * 10 + r + boil, smooth: false });
      for (let g = 0; g < 3; g++) drawPen(ctx, s, (g + .85) / 3, ripCol, a, g / 3 + .04); } });
  // the graph echo: flattened in court, it draws itself again and cannot be erased
  const cardK = seg(t, B.vibrations - .5, B.vibrations + .1) * (1 - seg(t, B.introducing + .2, B.introducing + 1.0));
  if (cardK > 0) {
    const cx0 = 760, cx1 = 1640, cy0 = 170, cy1 = 450, base = 420;
    const card = rough(rect(cx0, cy0, cx1, cy1), 3, 12);
    drawPrims(ctx, [{ k: 'knock', poly: card, a: .96 * cardK }, { k: 'ink', st: st([...card, card[0]], { w: 2.2, seed: 250, smooth: false }) }], { ink: cardK });
    handwrite(ctx, 'Ramesh · vibration log', cx0 + 30, cy0 + 40, 28, cardK, { font: FONT, weight: 700, alpha: .9 * cardK });
    const rise = u => { const arrive = SC.s9.t0 + .5 + u * 2.6; return eio(seg(t, arrive, arrive + .5)); };
    const ep = seg(t, B.save - .45, B.save + .75), ex = lerp(cx0, cx1, eio(ep)) + Math.sin(t * 26) * 22 * bump(ep, 0, 1);
    const kfn = u => { const x = lerp(cx0 + 20, cx1 - 20, u); const d = Math.abs(x - ex); const press = ep > 0 && ep < 1 ? Math.max(0, 1 - d / 60) : 0; return rise(u) * (1 - .85 * press); };
    drawPen(ctx, st(graphPts(cx0 + 20, cx1 - 20, base, 190, kfn), { w: 3, seed: 251, wob: .5, smooth: false, over: 0 }), 1, INK, cardK);
    if (ep > 0 && ep < 1) { const er = rect(ex - 40, base - 120, ex + 40, base - 76); drawPrims(ctx, [{ k: 'knock', poly: er }, { k: 'wash', poly: er, col: hex('#ece6d6'), a: .5 }, { k: 'wash', poly: rect(er[0][0], er[0][1], er[0][0] + 28, er[2][1]), col: hex('#7f9fbf'), a: .45 }, { k: 'ink', st: st([...er, er[0]], { w: 2, seed: 252 + boil, smooth: false }) }]); for (let k = 0; k < 3; k++) vibLines(ctx, ex, base - 98, .8, boil + k, 1, 50 + k * 10); }
  }
  // the mesh: red nodes, links, bearings (stays faintly visible through the rescue)
  ctx.save(); ctx.globalAlpha = 1 - .55 * seg(t, RESC0 + .8, RESC0 + 1.8);
  NODES.forEach(([x, y], i) => {
    const t0 = B.introducing + .15 + i * .07, p = seg(t, t0, t0 + .25); if (p <= 0) return;
    ctx.save(); ctx.fillStyle = rgba(PAPER, .75 * p); ctx.beginPath(); ctx.ellipse(x, y, 34, 30, 0, 0, TAU); ctx.fill(); ctx.restore();
    const disc = ellipse(x, y, 17, 14, 12);
    drawPrims(ctx, [{ k: 'wash', poly: disc, col: C.node, a: .9, dx: 2, dy: 1, seed: i }, { k: 'ink', st: st([...disc, disc[0], disc[1]], { w: 2.4, seed: 300 + i + boil, smooth: true }) }, { k: 'ink', st: st([[x + 4, y - 14], [x + 8, y - 38]], { w: 1.8, seed: 320 + i + boil }) }], { color: ss(seg(t, t0 + .1, t0 + .35)), ink: p });
    const pp = ((t - t0 - .3) % 1.4 + 1.4) % 1.4 / 1.4; if (t > t0 + .3) { const rr = 18 + pp * 46; drawPen(ctx, st(ellipse(x, y, rr, rr * .6, 20).slice(2, 16), { w: 1.4, seed: 340 + i, smooth: true }), 1, C.node, (1 - pp) * .7); }
  });
  LINKS.forEach(([a, b], i) => { const t0 = B.sense + i * .03, p = seg(t, t0, t0 + .4); if (p <= 0) return; drawPen(ctx, st([NODES[a], NODES[b]], { w: 1.8, wob: 1.4, over: 0, gap: 1, seed: 400 + i + boil }), eio(p), C.node, .7); });
  const target = [hand[0] - 40, hand[1] + 30];
  NODES.forEach((n, i) => { const t0 = B.prove - .1 + i * .04, p = seg(t, t0, t0 + .5); if (p <= 0) return;
    const s = st([n, [lerp(n[0], target[0], .5), lerp(n[1], target[1], .5) - 10], target], { w: 1.6, wob: .8, over: 0, seed: 500 + i + boil, smooth: true });
    for (let g = 0; g < 10; g++) drawPen(ctx, s, eio(p) * Math.min(1, (g + .6) / 10), C.node, .85, g / 10); });
  if (found > 0) { const loop = [...Array(40)].map((_, k) => { const a = -2.6 + k / 39 * (TAU + .5); return [1180 + Math.cos(a) * (300 + k * .8), 1080 + Math.sin(a) * (115 + k * .4)]; }); drawPen(ctx, st(loop, { w: 3, wob: 1.6, over: 6, seed: 600, smooth: true }), eio(seg(t, B.prove + .75, B.prove + 1.2)), C.node, .9); }
  ctx.restore();
  // the rescue: the helmeted pair dig at the glowing spot and lift Ramesh out alive
  if (t > RESC0 - .2) {
    const ri = eio(seg(t, RESC0 - .2, RESC0 + .4)), lift = eio(seg(t, RESC0 + 1.2, RESC0 + 2.4)), dig = 1 - lift, ph = t * 9;
    for (let k = 0; k < 16 * dig; k++) { const a = n2(k, 3) * Math.PI, life = ((t * 1.3 + n2(k, 5)) % 1); dab(ctx, 1185 + Math.cos(a) * 120 * life * (n2(k, 7) * 2 - 1), 1010 - Math.sin(a) * 160 * life + life * life * 120, 4 + n2(k, 9) * 6, k, k % 3 ? C.concrete : C.brick, .7 * (1 - life) * ri, k); }
    if (lift > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1140); ctx.clip();
      const rr = ramesh({ ...stand({ nod: -.05, lean: .02 }), handL: V(-.24, .8, .06), handR: V(.24, .8, .06), elbL: V(-1, .3, 0), elbR: V(1, .3, 0) }, { x: 1188, y: lerp(1330, 1132, lift), S: 360, yaw: Math.PI }, { seed: 6, boil, turn: 0, ex: { lid: lerp(.6, .92, seg(t, RESC0 + 1.6, RESC0 + 2.2)), brow: .35, mouth: t > RESC0 + 2.0 && t < RESC0 + 2.9 ? 'open' : 'flat', dust: 1, tired: .8 } });
      drawPrims(ctx, rr); ctx.restore(); }
    const lean = lerp(.95, .25, lift);
    const pa = rescuer(lerp(1000, 1080, ri), 1012, Math.PI / 2 + .25, { ...stand({ lean: lean + .08 * Math.sin(ph) * dig, nod: .3 }), handR: lift > .3 ? V(.08, .62, .22) : V(.06, .12 + .1 * Math.sin(ph) , .38), handL: V(-.05, .5, .25) }, 60, boil, ri);
    const pb = rescuer(lerp(1380, 1300, ri), 1016, -Math.PI / 2 - .25, { ...stand({ lean: lean + .08 * Math.sin(ph + 1.7) * dig, nod: .3 }), handR: lift > .3 ? V(.08, .62, .22) : V(.06, .12 + .1 * Math.sin(ph + 1.7), .38), handL: V(-.06, .5, .25) }, 61, boil, ri);
    torchBeam(ctx, pa.hand.L, [1, 1.1], ri * .9); torchBeam(ctx, pb.hand.L, [-1, 1.1], ri * .9);
  }
  return cam;
}
function shotCard(ctx, t) {
  const cam = { cx: 1200, cy: 675, z: .8 }, boil = Math.floor(t * 12);
  drawPage(ctx, 'card', cam, 99); worldT(ctx, cam);
  const mk = seg(t, CARD0 + .2, CARD0 + .9), ring = [...Array(6)].map((_, i) => { const a = -Math.PI / 2 + i / 6 * TAU; return [1200 + Math.cos(a) * 95, 395 + Math.sin(a) * 62]; });
  ring.forEach((n, i) => drawPen(ctx, st([n, [1200, 395]], { w: 1.6, wob: 1, over: 0, seed: 700 + i + boil }), mk, C.node, .7));
  ring.forEach((n, i) => drawPen(ctx, st([n, ring[(i + 1) % 6]], { w: 1.4, wob: 1, over: 0, seed: 710 + i + boil }), mk, C.node, .5));
  ring.forEach(([x, y], i) => { const d = ellipse(x, y, 13, 11, 10); drawPrims(ctx, [{ k: 'wash', poly: d, col: C.node, a: .9, seed: i }, { k: 'ink', st: st([...d, d[0]], { w: 2, seed: 720 + i + boil, smooth: true }) }], { color: ss(mk), ink: mk }); });
  { const d = ellipse(1200, 395, 22, 18, 12); drawPrims(ctx, [{ k: 'wash', poly: d, col: C.find, a: .9, seed: 9 }, { k: 'ink', st: st([...d, d[0]], { w: 2.2, seed: 730 + boil, smooth: true }) }], { color: ss(mk), ink: mk }); }
  handwrite(ctx, 'TREMORMESH', 1200, 640, 170, eio(seg(t, CARD0 + .35, CARD0 + 1.3)), { font: FONT, weight: 700, align: 'center', alpha: .93 });
  handwrite(ctx, 'for Ramesh', 1200, 745, 66, eio(seg(t, FORR, FORR + .7)), { font: FONT, weight: 400, align: 'center', alpha: .85 });
  drawPen(ctx, st([[1040, 790], [1360, 786]], { w: 1.4, seed: 740, wob: 1.2 }), eio(seg(t, FORR + .5, FORR + .9)), INK, .6);
  handwrite(ctx, 'Every Tremor Matters.', 1200, 900, 84, eio(seg(t, TAGT, TAGT + 1.05)), { font: FONT, weight: 700, align: 'center', alpha: .9 });
  return cam;
}
// earthquake night → the street buckles (drawn into ctx)
const bufS = document.createElement('canvas'); bufS.width = 1920; bufS.height = 1080; const bS = bufS.getContext('2d');
function streetCollapse(ctx, t) {
  const sh = 26, cam0 = { cx: 1200, cy: 760, z: .84 };
  const cam = shake(cam0, t, sh);
  shotStreet(bS, 7.5, { night: true, cam });
  bS.setTransform(1, 0, 0, 1, 0, 0);
  bS.save(); bS.globalCompositeOperation = 'multiply'; bS.fillStyle = rgba(NIGHT, .6); bS.fillRect(0, 0, 1920, 1080); bS.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(PAPER, 1); ctx.fillRect(0, 0, 1920, 1080);
  const gy = toScreen(cam, [1200, 1082])[1];
  const fall = seg(t, T_STREETFALL - .2, T_STREETFALL + 1.1);
  for (let x = 0; x < 1920; x += 12) { const k = fall * (.55 + .45 * n2(x * .004, 3)), del = n2(x * .002, 9) * .35; const d = clamp((fall - del) / (1 - del)) * (gy - 150) * (.45 + .5 * n2(x * .005, 5)) * k; const tilt = (n2(x * .003, 11) - .5) * 60 * k;
    ctx.drawImage(bufS, x, 0, 12, gy, x, d + tilt, 12, Math.max(1, gy - d - tilt)); }
  ctx.drawImage(bufS, 0, gy, 1920, 1080 - gy, 0, gy, 1920, 1080 - gy);
  // dust boiling up from the base
  for (let k = 0; k < 18; k++) { const x = k * 115 + 40, r = 60 + fall * 160 * (.6 + n2(k, 2)); wash(ctx, rough(ellipse(x, gy - r * .4, r, r * .6, 18), 12, k), C.dust, { a: .35 * fall, j: 10, seed: k, edge: .2 }); }
  return cam;
}
function shotNight(ctx, t) {
  if (t < T_TEAR) return shotBed(ctx, t, true);
  // the page tears down the middle and opens onto the street, which buckles
  const op = eio(seg(t, T_TEAR, T_TEAR + .7));
  const camS = streetCollapse(ctx, t);
  if (op < 1) { const tmp = bufT; const tc = tmp.getContext('2d'); tc.setTransform(1, 0, 0, 1, 0, 0); shotBed(tc, t, true); tc.setTransform(1, 0, 0, 1, 0, 0);
    const tear = [...Array(25)].map((_, i) => [960 + (n2(i * .7, 3) - .5) * 160 + (i % 2 ? 18 : -18), -20 + i * 47]);
    for (const s of [-1, 1]) { ctx.save(); ctx.translate(s * op * 1100, op * 120); ctx.rotate(s * op * .18); ctx.beginPath(); ctx.moveTo(s < 0 ? -200 : 2200, -200); tear.forEach(p => ctx.lineTo(...p)); ctx.lineTo(s < 0 ? -200 : 2200, 1300); ctx.closePath(); ctx.clip(); ctx.drawImage(tmp, 0, 0);
      ctx.strokeStyle = rgba(PAPER, .95); ctx.lineWidth = 7; ctx.beginPath(); tear.forEach((p, i) => i ? ctx.lineTo(p[0] + s * 4, p[1]) : ctx.moveTo(p[0] + s * 4, p[1])); ctx.stroke(); ctx.restore(); } }
  return camS;
}
const bufT = document.createElement('canvas'); bufT.width = 1920; bufT.height = 1080;

const RENDER = { street: shotStreet, bed: (c, t) => shotBed(c, t, false), court: shotCourt, night: shotNight, rubble: shotRubble, card: shotCard };
const bufA = document.createElement('canvas'); bufA.width = 1920; bufA.height = 1080; const bA = bufA.getContext('2d');
const ctx = document.getElementById('c').getContext('2d');

function captions(ctx, t) {
  if (!SUBS) return;
  const c = SUBS.find(c => t >= c.t0 && t < c.t1); if (!c) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = `700 40px ${FONT}`;
  const words = c.text.split(' '), lines = [''];
  for (const w of words) { const tryL = lines[lines.length - 1] ? lines[lines.length - 1] + ' ' + w : w; if (ctx.measureText(tryL).width > 1500 && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = tryL; }
  const y0 = 1040 - (lines.length - 1) * 46;
  const CX = 960;
  const wmax = Math.max(...lines.map(l => ctx.measureText(l).width));
  ctx.save(); ctx.fillStyle = rgba(PAPER, .82); const band = rough(rect(CX - wmax / 2 - 40, y0 - 46, CX + wmax / 2 + 40, 1062), 6, 3, 18); ctx.beginPath(); band.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.restore();
  lines.forEach((l, i) => handwrite(ctx, l, CX, y0 + i * 46, 40, clamp((t - c.t0) / .35), { font: FONT, weight: 700, align: 'center', alpha: .95 }));
}

window.DUR = END;
window.render = t => {
  t = Math.min(t, END - 1e-3);
  let i = SHOTS.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SHOTS.length - 1;
  const S = SHOTS[i];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  RENDER[S.id](ctx, t);
  // page turn: the previous shot keeps playing on the leaving page
  if (i > 0 && t < S.t0 + TURN) {
    const prev = SHOTS[i - 1], p = eio(seg(t, S.t0, S.t0 + TURN));
    bA.setTransform(1, 0, 0, 1, 0, 0); RENDER[prev.id](bA, t); bA.setTransform(1, 0, 0, 1, 0, 0);
    const fx = lerp(2050, -500, p), sl = 260;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(fx + sl, -10); ctx.lineTo(fx - sl * .2, 1090); ctx.lineTo(-10, 1090); ctx.closePath(); ctx.clip(); ctx.drawImage(bufA, 0, 0); ctx.restore();
    const fw = Math.min(380, (2050 - fx) * .3);
    const g = ctx.createLinearGradient(fx, 0, fx + 160, 0); g.addColorStop(0, 'rgba(60,50,40,.28)'); g.addColorStop(1, 'rgba(60,50,40,0)');
    ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(fx + sl, -10); ctx.lineTo(fx + sl + 200, -10); ctx.lineTo(fx - sl * .2 + 200, 1090); ctx.lineTo(fx - sl * .2, 1090); ctx.closePath(); ctx.fill(); ctx.restore();
    const fl = ctx.createLinearGradient(fx - fw, 0, fx, 0); fl.addColorStop(0, 'rgb(236,228,210)'); fl.addColorStop(.8, 'rgb(246,240,226)'); fl.addColorStop(1, 'rgb(220,210,190)');
    ctx.save(); ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(fx + sl, -10); ctx.lineTo(fx + sl - fw, -10); ctx.lineTo(fx - sl * .2 - fw * .7, 1090); ctx.lineTo(fx - sl * .2, 1090); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(INK, .5); ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
  }
  captions(ctx, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

// texts for readcheck (screen boxes approximated from the camera at that moment are not tracked; boxes are page-fixed where the camera holds)
window.TEXTS = t => {
  const out = [];
  const stampT = B.officially + .15;
  if (t > stampT + .05 && t < SHOCK - .1) out.push({ id: 'noact', text: 'NO ACTIVITY', x0: 500, y0: 600, x1: 1300, y1: 800 });
  if (t > B.defamation && t < SC.s6.t0 + .35 + TURN * .5) out.push({ id: 'defam', text: 'DEFAMATION', x0: 600, y0: 450, x1: 1300, y1: 700 });
  if (t > CARD0 + 1.3) out.push({ id: 'title', text: 'TREMORMESH', x0: 500, y0: 300, x1: 1420, y1: 500 });
  if (t > FORR + .7) out.push({ id: 'forr', text: 'for Ramesh', x0: 700, y0: 520, x1: 1220, y1: 600 });
  if (t > TAGT + 1.05) out.push({ id: 'tag', text: 'Every Tremor Matters.', x0: 500, y0: 640, x1: 1420, y1: 720 });
  return out;
};

// sound events for mix.py
const EV = [];
{ let last = -1; for (let t = .7; t < 6.6; t += 1 / 96) { const k = Math.floor((walkX(t) - 150) / STRIDE); if (k > last) { EV.push({ t: +t.toFixed(3), type: 'step', pan: (walkX(t) - 1200) / 1400 }); last = k; } } }
SHOTS.forEach((s, i) => { if (i) EV.push({ t: s.t0, type: 'pageturn' }); });
EV.push({ t: 0.05, type: 'sketch', dur: 1.6 }, { t: T_BED + .1, type: 'sketch', dur: 1.4 }, { t: SC.s4.t0 + .1, type: 'sketch', dur: 1.5 }, { t: SC.s7.t0 + .1, type: 'sketch', dur: 1.6 });
EV.push({ t: 8.5, type: 'bagdrop' }, { t: 8.8, type: 'bedflop' });
EV.push({ t: B.drilling - .3, type: 'drill_on', until: SC.s4.t0 + .2 });
for (let tt = B.drilling; tt < SC.s4.t0; tt += .9) EV.push({ t: +(tt + .12).toFixed(3), type: 'hammer', pan: .6 });
EV.push({ t: B.bed_shakes, type: 'shake', dur: 1.1 }, { t: B.walls, type: 'crack' }, { t: B.walls, type: 'shake', dur: 1.0 });
EV.push({ t: B.records, type: 'phone' }, { t: B.records + .2, type: 'scribble', dur: 2.2 });
['3', '4', '5', '6', '7', '8'].forEach((_, i) => EV.push({ t: +(B.every_night - .3 + i * .17 + .22).toFixed(3), type: 'paper' }));
EV.push({ t: B.court, type: 'gavel' }, { t: B.tampered - .05, type: 'eraser', dur: 1.4 }, { t: B.rewritten - .15, type: 'scribble', dur: .9 }, { t: B.officially + .15, type: 'stamp' }, { t: B.officially + .3, type: 'washbloom' }, { t: SHOCK, type: 'hit' });
EV.push({ t: SC.s5.t0 + .1, type: 'footsteps_suits', dur: 2.2 }, { t: B.handed, type: 'paper' }, { t: B.defamation - .05, type: 'stamp' });
EV.push({ t: B.shakes6 - .1, type: 'quake', until: SC.s7.t0 + .6 }, { t: B.this_time + .95, type: 'glassbreak' }, { t: T_TEAR, type: 'tear' }, { t: T_STREETFALL, type: 'collapse' });
EV.push({ t: SC.s7.t0, type: 'morning', until: SC.s8.t0 - .2 }, { t: B.morning + .4, type: 'rubble_lift', dur: 2 }, { t: B.rubble + 1.4, type: 'rubble_lift', dur: 2 });
TAPS.forEach(tp => EV.push({ t: tp, type: 'tap' }));
NODES.forEach((_, i) => EV.push({ t: +(B.introducing + .15 + i * .07).toFixed(3), type: 'node', pan: (NODES[i][0] - 1200) / 1200 }));
EV.push({ t: B.sense, type: 'scribble', dur: 1.0 }, { t: B.prove + .7, type: 'washbloom' }, { t: RESC0, type: 'dig', dur: 1.4 }, { t: RESC0 + 1.2, type: 'rubble_lift', dur: 1.2 }, { t: RESC0 + 2.05, type: 'exhale' }, { t: CARD0, type: 'card' });
EV.push({ t: SC.s9.t0 + .5, type: 'scribble', dur: 2.6 }, { t: B.save - .45, type: 'eraser', dur: 1.2 });
window.EV = EV.sort((a, b) => a.t - b.t);
window.READY = true;
