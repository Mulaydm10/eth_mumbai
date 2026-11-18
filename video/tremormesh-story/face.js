// Ramesh's head, drawn in pen & wash at any size. Built around (0,0) with head radius r; draw with a ctx transform.
// turn: -1 profile facing screen-left … 0 front … 1 profile facing screen-right. back: seen from behind.
// ex: { lid 0..1 (eye openness), brow -1 (frown) .. 1 (raised), mouth 'flat'|'tired'|'o'|'grim'|'open', look [dx,dy] pupils, dust 0..1 }
import { penStroke, ellipse, rough, mix3, hex, lerp, clamp, rng, n2, TAU } from './engine.js';

export const SKIN = hex('#a46a49'), HAIR = hex('#2a2320'), GREY = hex('#9a958e'), SHIRT = hex('#a8c2db'), SPEC = hex('#3a2e26');
const SHADE = [70, 72, 115];

export function rameshHead(r, turn = 0, ex = {}, o = {}) {
  const boil = o.boil ?? 0, sd = (o.seed ?? 11) * 13 + boil * 7, lw = Math.max(1.1, r * .045);
  const pr = [];
  const S = (pts, w = 1, x = {}) => pr.push({ k: 'ink', st: penStroke(pts, { w: lw * w, wob: lw * (x.wob ?? .25), seed: sd + pr.length, over: x.over ?? lw * .8, smooth: x.smooth ?? true, gap: x.gap ?? 0 }), alpha: x.alpha ?? 1 });
  const Wp = (poly, col, a, x = {}) => pr.push({ k: 'wash', poly, col, a, j: x.j ?? r * .03, layers: 2, edge: x.edge ?? .3, seed: sd + pr.length, dx: x.dx ?? lw * .6, dy: x.dy ?? lw * .3 });
  const K = (poly, a = .95) => pr.push({ k: 'knock', poly, a });
  // face-surface mapping: lateral u (-1..1), vertical v (-1 top .. 1 chin) → screen
  const A = u => u * .95 + turn * 1.25;
  const fx = (u, v) => { const w = .86 - .1 * Math.max(0, v) * Math.max(0, v); return r * w * Math.sin(A(u)) * (1 - .12 * Math.abs(v)); };
  const vis = u => Math.cos(A(u));
  const F = (u, v, dz = 0) => [fx(u, v) + dz * r * Math.sin(turn * 1.25), v * r * 1.12];
  // neck + collar
  if (o.bust !== false) {
    const nw = r * .42;
    const neck = [[-nw + turn * r * .1, r * .7], [nw + turn * r * .1, r * .7], [nw * 1.15, r * 1.55], [-nw * 1.15, r * 1.55]];
    const sh = r * (o.shoulder ?? 2.0);
    const torso = [[-sh, r * 2.6], [-sh * .92, r * 1.75], [-r * .6, r * 1.38], [r * .6, r * 1.38], [sh * .92, r * 1.75], [sh, r * 2.6], [sh, r * 3.4], [-sh, r * 3.4]];
    K(torso); Wp(torso, SHIRT, .6); Wp(torso.slice(3, 7), mix3(SHIRT, SHADE, .4), .25);
    S([torso[0], torso[1], torso[2]], 1.1); S([torso[3], torso[4], torso[5]], 1.2);
    K(neck); Wp(neck, SKIN, .5); Wp([[nw * .1, r * .75], neck[1], neck[2], [nw * .1, r * 1.5]], mix3(SKIN, SHADE, .45), .3);
    S([neck[0], neck[3]], .9); S([neck[1], neck[2]], 1);
    // collar: two flaps + placket, pocket with a pen
    const cL = [[-r * .62, r * 1.36], [-r * .05, r * 1.82], [-r * .55, r * 1.85]], cR = [[r * .62, r * 1.36], [r * .05, r * 1.82], [r * .55, r * 1.85]];
    for (const c of [cL, cR]) { K(c, .9); Wp(c, SHIRT, .4); S([...c, c[0]], .9, { smooth: false }); }
    S([[0, r * 1.82], [r * .02, r * 3.3]], .7, { alpha: .7 });
    for (let k = 0; k < 3; k++) S([[r * .05, r * (2.1 + k * .45)], [r * .1, r * (2.12 + k * .45)]], 1.4, { over: 0 });
    const pk = [[-r * 1.25, r * 2.3], [-r * .65, r * 2.3], [-r * .66, r * 2.95], [-r * 1.24, r * 2.95]];
    S([pk[0], pk[3], pk[2], pk[1]], .7, { smooth: false });
    Wp([[-r * 1.05, r * 2.0], [-r * .97, r * 2.0], [-r * .97, r * 2.5], [-r * 1.05, r * 2.5]], hex('#2c4a8a'), .85, { j: .3, edge: 0 });
  }
  // head shape
  const head = ellipse(turn * r * .06, 0, r * .86, r * 1.12, 26).map(([x, y]) => [x, y + (y > 0 ? y * .06 : 0)]);
  K(head, .97);
  if (o.back) {
    Wp(head, SKIN, .45);
    const hm = rough(ellipse(0, -r * .1, r * .9, r * 1.02, 22), r * .05, sd + 3, Math.max(3, r * .15), .1);
    Wp(hm, HAIR, .62); Wp(ellipse(0, -r * .62, r * .35, r * .25, 12), mix3(HAIR, [240, 230, 215], .55), .3);
    S(hm.slice(12, 22), 1);
    for (let k = 0; k < 10; k++) { const x = (k / 9 - .5) * r * 1.4; S([[x, -r * .9], [x * 1.08, -r * .2], [x * 1.1, r * .5]], .45, { alpha: .6 }); }
    S(head.slice(4, 11), 1);
    return pr;
  }
  Wp(head, SKIN, .5);
  // shadow side of the face (light from top-left): a crescent along the right of the skull
  { const out = [], inn = []; for (let i = 0; i <= 10; i++) { const a = -1.1 + i * .23; out.push([turn * r * .06 + Math.cos(a) * r * .86, Math.sin(a) * r * 1.12]); inn.unshift([turn * r * .06 + Math.cos(a) * r * .62 - r * .04, Math.sin(a) * r * 1.0]); }
    Wp([...out, ...inn], mix3(SKIN, SHADE, .5), .28, { edge: .1 }); }
  // ears
  for (const s of [-1, 1]) { const vv = vis(s * 1.05); if (vv > .55) continue; const e = F(s * 1.0, -.02); const ear = ellipse(e[0] + s * Math.sign(Math.sin(A(s))) * r * .04, e[1] + r * .02, r * .13, r * .22, 10); K(ear); Wp(ear, SKIN, .55); S(ear.slice(s > 0 ? 7 : 2, s > 0 ? 10 : 8).concat(s > 0 ? ear.slice(0, 3) : []), .8); }
  // hair: receding hairline, darker crown + back, grey temples, strand strokes (never a solid cap)
  const top = [];
  for (let i = 0; i <= 18; i++) { const a = Math.PI + .1 + i / 18 * (Math.PI - .2); top.push([turn * r * .06 + Math.cos(a) * r * .9, Math.sin(a) * r * 1.16 - r * .02]); }
  const hl = [];   // hairline across the forehead, receding at the temples (M shape)
  for (let i = 0; i <= 12; i++) { const u = 1 - i / 6; const rec = Math.exp(-Math.pow((Math.abs(u) - .55) / .22, 2)) * .22; hl.push(F(u * .98, -.6 - rec + (Math.abs(u) > .85 ? .3 * (Math.abs(u) - .85) / .15 : 0))); }
  const hairPoly = rough([...top, ...hl], r * .035, sd + 5, Math.max(3, r * .12), .12);
  K(hairPoly, .45); Wp(hairPoly, HAIR, .55, { j: r * .04 });
  // grey temples
  for (const s of [-1, 1]) { if (vis(s * .95) < -.2) continue; const g = F(s * .92, -.3); const gp = ellipse(g[0], g[1], r * .1, r * .26, 8); K(gp, .5); Wp(gp, GREY, .45); for (let k = 0; k < 3; k++) S([[g[0] - r * .03, g[1] - r * .2 + k * r * .12], [g[0] + r * .03 * s, g[1] - r * .1 + k * r * .12]], .4, { alpha: .6, over: 0 }); }
  // strands
  const R = rng(sd + 77);
  for (let k = 0; k < 16; k++) { const u = k / 15 * 1.8 - .9; const p0 = F(u * .9, -.66 - .08 * R()); const p1 = [p0[0] * .8 + (R() - .5) * r * .1, -r * (1.0 + .08 * R())]; S([p0, [lerp(p0[0], p1[0], .5) + r * .05, lerp(p0[1], p1[1], .5)], p1], .45, { alpha: .75, over: 0, wob: .4 }); }
  S(top.slice(1, 17), 1.05, { gap: .3, wob: .5 });
  S(hl.slice(1, 12), .55, { alpha: .6 });
  // face outline: jaw + cheek on the light side, chin
  S(head.slice(3, 11), 1.05);
  S([F(-.3, .97), F(0, 1.02), F(.3, .97)], .8, { alpha: .7 });
  // brows
  const brow = ex.brow ?? 0, lid = ex.lid ?? .6, look = ex.look ?? [0, 0];
  for (const s of [-1, 1]) {
    if (vis(s * .38) < .05) continue;
    const inner = F(s * .14, -.36 - brow * .1 + (brow < 0 ? .04 : 0)), outer = F(s * .66, -.36 - brow * .02 + (brow > 0 ? .02 : -.04) + (brow < -0.3 ? -.06 : 0));
    const mid = F(s * .4, -.42 - brow * .08);
    const bp = [inner, mid, outer, [outer[0], outer[1] + r * .06], [mid[0], mid[1] + r * .07], [inner[0], inner[1] + r * .06]];
    Wp(bp, HAIR, .7, { j: r * .01, edge: .2 }); S([inner, mid, outer], 1.5, { over: 0 });
  }
  // eyes: upper lid, iris, lower lid, tired bags
  for (const s of [-1, 1]) {
    const vv = vis(s * .38); if (vv < .05) continue;
    const c = F(s * .38, -.12), ew = r * .17 * Math.max(.3, vv), eh = r * .12;
    const op = clamp(lid);
    const white = ellipse(c[0], c[1], ew, eh * (.25 + .75 * op), 12);
    K(white, .9);
    const ir = r * .065, ic = [c[0] + look[0] * ew * .5 + turn * ew * .25, c[1] + look[1] * eh * .4 + eh * .1 * (1 - op)];
    if (op > .12) pr.push({ k: 'wash', poly: ellipse(ic[0], ic[1], ir * 1.1, ir * 1.1 * Math.min(1, .3 + op), 10), col: hex('#3a2a20'), a: .9, j: .2, layers: 1, edge: 0, seed: sd + 90 + (s > 0) });
    const lidTop = c[1] - eh * (.2 + .8 * op);
    S([[c[0] - ew * 1.1, c[1] + eh * .05], [c[0] - ew * .3, lidTop], [c[0] + ew * .5, lidTop + eh * .05], [c[0] + ew * 1.1, c[1] + eh * .15]], 1.25, { over: lw * .5 });
    if (op < .7) S([[c[0] - ew * .9, lidTop + eh * .25], [c[0] + ew, lidTop + eh * .3]], .6, { alpha: .6, over: 0 });  // heavy lid crease
    S([[c[0] - ew * .7, c[1] + eh * .55], [c[0] + ew * .8, c[1] + eh * .5]], .5, { alpha: .6, over: 0 });
    // tired bags: two arcs under the eye + a violet shadow
    Wp(ellipse(c[0], c[1] + eh * 1.25, ew * 1.0, eh * .55, 10), SHADE, .22 * (ex.tired ?? 1), { edge: .1 });
    S([[c[0] - ew * .8, c[1] + eh * 1.05], [c[0], c[1] + eh * 1.6], [c[0] + ew * .9, c[1] + eh * 1.15]], .55, { alpha: .65 * (ex.tired ?? 1), over: 0 });
  }
  // spectacles: two rounded frames + bridge + arms
  const lens = [];
  for (const s of [-1, 1]) {
    const vv = vis(s * .38); if (vv < -.1) continue;
    const c = F(s * .38, -.1), w = r * .27 * Math.max(.25, vv), h = r * .2;
    const L = [...Array(16)].map((_, i) => { const a = i / 16 * TAU; const k = Math.pow(Math.abs(Math.cos(a)), .6) * Math.sign(Math.cos(a)), m = Math.pow(Math.abs(Math.sin(a)), .6) * Math.sign(Math.sin(a)); return [c[0] + k * w, c[1] + m * h * (a > Math.PI ? 1 : .9)]; });
    lens.push(L); S([...L, L[0], L[1]], 1.15, { smooth: true, over: 0, wob: .15 });
    pr.push({ k: 'knock', poly: [[c[0] - w * .6, c[1] - h * .7], [c[0] - w * .35, c[1] - h * .75], [c[0] - w * .75, c[1] + h * .1]], a: .35 });   // glint
    const ear = F(s * .98, -.1);
    if (vis(s * .98) < .6) S([[c[0] + s * w, c[1] - h * .5], ear], .9, { over: 0, smooth: false });
  }
  { const a = F(-.12, -.14), b = F(.12, -.14); S([a, [lerp(a[0], b[0], .5), a[1] - r * .04], b], 1, { over: 0 }); }
  // nose: bridge line on the shadow side, tip, nostril
  { const s = turn >= 0 ? 1 : -1; const tipDz = .22;
    S([F(s * .1, -.08), F(s * .08 + turn * .05, .22, tipDz * .6), F(turn * .1, .36, tipDz)], .9, { over: 0 });
    S([F(-.14 + turn * .08, .38, tipDz * .5), F(turn * .1, .44, tipDz * .7), F(.14 + turn * .08, .38, tipDz * .5)], .9, { over: 0 });
    Wp([F(.05, .1), F(.16, .3), F(.12, .42), F(.02, .4)], mix3(SKIN, SHADE, .5), .25); }
  // nasolabial folds (age)
  for (const s of [-1, 1]) if (vis(s * .35) > .2) S([F(s * .24, .38), F(s * .36, .62), F(s * .36, .78)], .6, { alpha: .55, over: 0 });
  // moustache: a thick drooping mass with hair ticks
  {
    const mu = ex.mouth ?? 'flat', open = mu === 'o' ? 1 : mu === 'open' ? .6 : 0;
    const pts = [F(-.5, .62 + open * .05), F(-.38, .5), F(-.12, .45), F(0, .48), F(.12, .45), F(.38, .5), F(.5, .62 + open * .05), F(.3, .6), F(0, .58), F(-.3, .6)];
    const mp = pts.filter((_, i) => vis([-.5, -.38, -.12, 0, .12, .38, .5, .3, 0, -.3][i]) > -.05);
    if (mp.length > 3) { K(mp, .6); Wp(mp, HAIR, .82, { j: r * .012, edge: .3 }); S(mp.slice(0, 7), 1.1, { over: 0 }); }
    for (let k = 0; k < 9; k++) { const u = -.4 + k * .1; if (vis(u) < .1) continue; const a = F(u, .5 + Math.abs(u) * .08), b = F(u * 1.08, .6 + Math.abs(u) * .08); S([a, b], .5, { alpha: .8, over: 0, smooth: false }); }
    // mouth
    const my = .74;
    if (mu === 'o') { const c = F(0, my + .04); const m = ellipse(c[0], c[1], r * .11, r * .1, 10); Wp(m, hex('#4a2a24'), .8, { edge: 0 }); S([...m, m[0]], .9, { over: 0 }); }
    else if (mu === 'open') { const c = F(0, my + .02); const m = ellipse(c[0], c[1], r * .16, r * .06, 10); Wp(m, hex('#4a2a24'), .75, { edge: 0 }); S([...m, m[0]], .8, { over: 0 }); }
    else if (mu === 'grim') S([F(-.24, my + .04), F(0, my - .01), F(.24, my + .04)], .9, { over: 0 });
    else S([F(-.22, my), F(0, my + .02), F(.22, my - .01)], .8, { over: 0 });
    S([F(-.1, .86), F(.1, .86)], .5, { alpha: .5, over: 0 });
  }
  // forehead lines
  for (let k = 0; k < 2; k++) S([F(-.3, -.5 + k * .08 - (ex.brow ?? 0) * .04), F(0, -.52 + k * .08 - (ex.brow ?? 0) * .06), F(.3, -.5 + k * .08 - (ex.brow ?? 0) * .04)], .45, { alpha: .45, over: 0 });
  // dust / sweat
  if (ex.dust) { const R2 = rng(5); for (let k = 0; k < 14; k++) { const p = F(R2() * 1.6 - .8, R2() * 1.6 - .7); Wp(ellipse(p[0], p[1], r * (.04 + R2() * .06), r * (.03 + R2() * .04), 6), hex('#8f8676'), .35 * ex.dust, { edge: 0 }); } }
  if (ex.sweat) { const p = F(.55, -.4); const d = [[p[0], p[1]], [p[0] + r * .05, p[1] + r * .14], [p[0], p[1] + r * .19], [p[0] - r * .05, p[1] + r * .14]]; S([...d, d[0]], .6, { over: 0 }); }
  return pr;
}
