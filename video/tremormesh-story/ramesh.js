// Ramesh as a full figure: engine figure (head off) + belt, pocket pen, shoulder bag + his own head from face.js.
import { hex, mix3, lerp, penStroke, figure, skeleton, projector, drawPrims, R3 } from './engine.js';
import { rameshHead } from './face.js';
const { V, add3, sc3 } = R3;

export const RAMESH = { skin: hex('#a46a49'), top: hex('#a8c2db'), bottom: hex('#4d535e'), hair: hex('#2a2320'), shoe: hex('#3b2e26'), pants: 1, sleeve: 'long', torso: [.086, .098, .108] };
const BAG = hex('#7a5a3c');

export function ramesh(pose, place, o = {}) {
  const S = place.S, seed = o.seed ?? 3, boil = o.boil ?? 0;
  const prims = figure(o.look ?? RAMESH, pose, place, { seed, boil, noHead: true });
  const pr = projector(place.x, place.y, S, place.yaw ?? 0, place.pitch ?? .28), j = skeleton(pose), P = v => pr(v);
  const lw = Math.max(1.1, .005 * S), sd = seed * 31 + boil * 7, ex = [];
  { const a = P(add3(j.hpL, V(-.03, .03, 0))), b = P(add3(j.hpR, V(.03, .03, 0)));
    ex.push({ k: 'ink', st: penStroke([[a[0], a[1]], [lerp(a[0], b[0], .5), lerp(a[1], b[1], .5) + lw * .6], [b[0], b[1]]], { w: lw * 1.4, wob: lw * .2, seed: sd + 1, over: lw }) }); }
  if (o.bag) {
    const nearL = P(j.hpL)[2] < P(j.hpR)[2], far = nearL ? j.shR : j.shL, hip = nearL ? j.hpL : j.hpR;
    const a = P(add3(far, V(0, .005, 0))), bc = P(add3(hip, V(nearL ? -.05 : .05, -.02, -.02)));
    ex.push({ k: 'ink', st: penStroke([[a[0], a[1]], [lerp(a[0], bc[0], .5) + lw, lerp(a[1], bc[1], .5)], [bc[0], bc[1] - .04 * S]], { w: lw * 1.3, wob: lw * .2, seed: sd + 8, over: lw }) });
    const bw = .16 * S, bh = .12 * S, ang = o.bagTilt ?? 0;
    const rot = ([x, y]) => [bc[0] + x * Math.cos(ang) - y * Math.sin(ang), bc[1] + x * Math.sin(ang) + y * Math.cos(ang)];
    const bag = [[-bw / 2, -bh * .45], [bw / 2, -bh * .5], [bw / 2 + 2, bh * .5], [-bw / 2, bh * .55]].map(rot);
    const flap = [[-bw / 2, -bh * .45], [bw / 2, -bh * .5], [bw * .45, bh * .05], [-bw * .45, bh * .08]].map(rot);
    ex.push({ k: 'knock', poly: bag }, { k: 'wash', poly: bag, col: BAG, a: .7, seed: sd + 9, dx: lw, dy: lw * .5 });
    ex.push({ k: 'wash', poly: flap, col: mix3(BAG, [70, 72, 115], .35), a: .35, seed: sd + 10 });
    ex.push({ k: 'ink', st: penStroke([...bag, bag[0], bag[1]], { w: lw, wob: lw * .3, seed: sd + 11, smooth: false, over: lw * 2, gap: .4 }) });
    ex.push({ k: 'ink', st: penStroke([flap[0], flap[3], flap[2], flap[1]], { w: lw * .7, wob: lw * .3, seed: sd + 12, smooth: false, over: lw }), alpha: .8 });
  }
  const { c, r, fwd } = prims.head;
  const back = fwd[2] > .45;
  const head = rameshHead(r * .95, o.turn ?? Math.max(-.45, Math.min(.45, fwd[0] * .5)), o.ex ?? {}, { seed, boil, bust: false, back });
  ex.push({ k: 'fn', fn: (ctx, opt) => { ctx.save(); ctx.translate(c[0], c[1] + r * .08); ctx.rotate(o.headRot ?? 0); drawPrims(ctx, head, opt); ctx.restore(); } });
  const out = [...prims, ...ex]; out.head = prims.head; out.hand = prims.hand; out.joints = { j, P };
  return out;
}
