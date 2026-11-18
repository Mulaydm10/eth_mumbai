# Sound for TREMORMESH. No music. Effects from events.json (exported from the page) + timeline.json.
# usage: mix.py out.wav [--voice placements.json]   (placements: [{id, at, wav}])
# Without voice: effects ducked in the planned narration windows, normalised to about -20 LUFS (headroom for a voice).
# With voice: voice compressed + placed, effects ducked under it; mastered later by mux.sh to -14 LUFS.
import json, os, sys, subprocess
import numpy as np, soundfile as sf
LIB = os.environ.get("LIB") or os.path.expanduser("~/Dhruv/infra/video-skills/lemo-opuscar")
sys.path.insert(0, os.path.join(LIB, "core", "audio"))
import sfx
from sfx import SR, noise, bp, lp, hp, env_exp, t_, norm, brown, click, clack, crash, whoosh, creak, thump, step, rumble, add, compress, limit

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, os.environ.get("TLFILE", "timeline.json"))))
EV = json.load(open(os.path.join(HERE, os.environ.get("EVFILE", "events.json"))))["ev"]
OUT = sys.argv[1]
VOICE = sys.argv[sys.argv.index("--voice") + 1] if "--voice" in sys.argv else None
B = TL["beats"]; SC = {s["id"]: s for s in TL["scenes"]}
EVJ = json.load(open(os.path.join(HERE, os.environ.get("EVFILE", "events.json"))))
DUR = EVJ["dur"]; N = int((DUR + .3) * SR)
CARD = next((e["t"] for e in EV if e["type"] == "card"), DUR)
rng = np.random.default_rng(7)
buf = np.zeros((N, 2))

def env_win(d, a=.3, r=.5):
    d = round(d * SR) / SR
    tt = t_(d); return np.minimum(1, tt / max(a, 1e-3)) * np.minimum(1, (d - tt) / max(r, 1e-3)).clip(0)
def S(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
def bed(x, t0, gain, pan=0., a=.4, r=.6):
    add(buf, x * env_win(len(x) / SR, a, r), t0, gain, pan)

# ---------- beds ----------
# paper room tone throughout (dropped to silence in scene 8)
rt = lp(hp(noise(DUR), 120), 2500); rt = norm(rt) * .02
s8a, s8b = SC["s8"]["t0"], SC["s9"]["t0"]
g = np.ones(len(rt)); tt = t_(DUR); g[(tt > s8a + .3) & (tt < s8b)] = 0; g = np.convolve(g, np.ones(4800) / 4800, "same")
add(buf, rt * g, 0, 1.0)
# street: traffic hum + distant chatter
d = 8.2; tr = norm(lp(brown(d), 500)) * .5 + norm(bp(noise(d), 300, 1400)) * .25 * (.6 + .4 * np.sin(2 * np.pi * .3 * t_(d)))
ch = np.zeros(len(tr))
for k in range(40):
    s = int(rng.random() * (d - .5) * SR); L = int((.15 + rng.random() * .3) * SR); seg_ = bp(noise(L / SR), 500 + rng.random() * 600, 1800); ch[s:s + len(seg_)] += seg_ * np.hanning(len(seg_)) * .4
bed(tr + ch, 0, .16, 0, .5, .9)
# fan whirr in the bedroom (both visits)
for a, b in [(7.7, SC["s4"]["t0"]), (SC["s6"]["t0"], B["isnt"] + .3)]:
    d = b - a; x = norm(lp(noise(d), 900)) * (.55 + .45 * np.abs(np.sin(np.pi * 3.6 * t_(d))))
    bed(x, a, .05, -.1)
# crickets at night (gated band noise)
a, b = SC["s6"]["t0"], B["isnt"]; d = b - a; tt = t_(d)
gate = ((np.sin(2 * np.pi * 28 * tt) > .2) * (np.sin(2 * np.pi * .9 * tt) > -.2)).astype(float)
bed(bp(noise(d), 4300, 5200) * np.convolve(gate, np.ones(60) / 60, "same"), a, .03, .4, .8, .3)
# court room tone: murmur
a, b = SC["s4"]["t0"], SC["s6"]["t0"]; d = b - a
bed(norm(bp(noise(d), 150, 900)) * (.7 + .3 * np.sin(2 * np.pi * .23 * t_(d))), a, .05, 0, .6, .4)
# morning wind on the rubble
a, b = SC["s7"]["t0"], SC["s8"]["t0"] - .2; d = b - a
bed(norm(lp(noise(d), 700)) * (.5 + .5 * np.sin(2 * np.pi * .17 * t_(d)) ** 2), a, .08, -.2, .8, .4)
a, b = SC["s9"]["t0"] + .6, CARD + .3; d = b - a
bed(norm(lp(noise(d), 600)) * (.5 + .5 * np.sin(2 * np.pi * .13 * t_(d)) ** 2), a, .05, .2, 1.2, 1.0)

# ---------- one-shots ----------
def pen(d):
    n = int(d * SR); x = bp(noise(d), 1600, 7500)
    strokes = np.zeros(n); p = 0
    while p < n:
        L = int((.04 + rng.random() * .12) * SR); strokes[p:p + L] = np.hanning(min(L, n - p) * 2)[:min(L, n - p)] * (.4 + .6 * rng.random()); p += L + int(rng.random() * .03 * SR)
    grain = (rng.random(n) > .997) * rng.standard_normal(n) * 2
    return norm(x * strokes + hp(grain, 3000) * .3)
def paper(v=1.):
    d = .35; return norm(bp(noise(d), 900, 6000) * env_exp(d, .07) * (1 + .5 * np.sin(2 * np.pi * 40 * t_(d)))) * v
def rub(d):
    tt = t_(d); return norm(bp(noise(d), 700, 3200) * (.3 + .7 * np.abs(np.sin(2 * np.pi * 4.1 * tt))) * env_win(d, .05, .1))
def wet(d=1.2):
    tt = t_(d); return norm(lp(noise(d), 1800) * np.sin(np.pi * tt / d) ** 2)
def tink(v=1.):
    d = .12; tt = t_(d); f = 3200 + rng.random() * 3000
    return norm(hp(noise(d), 4000) * env_exp(d, .002) + np.sin(2 * np.pi * f * tt) * env_exp(d, .02) * .6 + np.sin(2 * np.pi * f * 1.51 * tt) * env_exp(d, .012) * .3) * v
def tear(d=.7):
    n = int(d * SR); x = bp(noise(d), 800, 9000); gates = (rng.random(n) > .6).astype(float); gates = np.convolve(gates, np.ones(90) / 90, "same")
    return norm(x * gates * (np.linspace(.3, 1, n)) * env_win(d, .02, .15))
def stone_tap(v=1.):
    return S(clack(.55, 1) * .7, thump(.6, 140)[:int(.09 * SR)] * .5) * v
def drill(d):
    tt = t_(d); motor = bp(noise(d), 250, 2600) * (.6 + .4 * np.sin(2 * np.pi * 31 * tt))
    buzz = np.sign(np.sin(2 * np.pi * 96 * tt + .3 * np.sin(2 * np.pi * 3 * tt))) * .25; grind = hp(noise(d), 2500) * (.5 + .5 * np.sin(2 * np.pi * 7 * tt)) * .4
    return norm(lp(motor + bp(buzz, 150, 1500) + grind, 6000))
def tick(v=1.):
    d = .05; return norm(hp(noise(d), 2500) * env_exp(d, .003)) * v

for e in EV:
    t, ty, pan = e["t"], e["type"], e.get("pan", 0.)
    if ty == "step": add(buf, S(step(1) * .7, lp(noise(.06), 500) * env_exp(.06, .01) * .5), t, .22, pan)
    elif ty == "pageturn": add(buf, whoosh(.55), t - .05, .16, .3); add(buf, paper(), t + .25, .18, -.2)
    elif ty == "sketch": add(buf, pen(e["dur"]), t, .07, 0)
    elif ty == "scribble": add(buf, pen(e["dur"]), t, .09, .1)
    elif ty == "bagdrop": add(buf, thump(1, 110), t, .3, -.4); add(buf, paper(.6), t, .12, -.4)
    elif ty == "bedflop": add(buf, thump(1, 60), t, .45, -.2); add(buf, creak(), t + .05, .2, -.2); add(buf, creak(), t + .25, .12, -.1)
    elif ty == "drill_on":
        d = e["until"] - t; x = drill(d); tt = t_(d)
        lvl = np.where(tt + t < SC["s3"]["t0"], 1.0, .45); lvl = np.convolve(lvl, np.ones(9600) / 9600, "same")
        add(buf, x * lvl * env_win(d, .25, .8), t, .17, .55)
    elif ty == "hammer":
        lv = 1. if t < SC["s3"]["t0"] else .45
        add(buf, thump(1, 55), t, .55 * lv, .6); add(buf, clack(.7, 1), t, .2 * lv, .6)
        for k in range(3): add(buf, tink(.5), t + .02 + k * .05 + rng.random() * .03, .05 * lv, -.05)   # glass answers each blow
    elif ty == "shake":
        d = e["dur"]; add(buf, rumble(d, 1), t, .5, 0)
        for k in range(int(d * 22)): add(buf, tink(), t + rng.random() * d, .09, -.05 + rng.random() * .1)
        for k in range(4): add(buf, creak(), t + rng.random() * d, .12, -.3)
    elif ty == "crack": add(buf, norm(hp(noise(.25), 800) * env_exp(.25, .03)), t, .25, .5); add(buf, creak(), t + .1, .15, -.5)
    elif ty == "phone": add(buf, tick(), t, .2, -.3)
    elif ty == "paper": add(buf, paper(), t, .2, -.2)
    elif ty == "gavel": add(buf, clack(.6, 1), t - .02, .45, .1); add(buf, clack(.62, 1), t + .16, .3, .1)
    elif ty == "eraser": add(buf, rub(e["dur"]), t, .22, -.1)
    elif ty == "stamp": add(buf, thump(1, 85), t, .6, 0); add(buf, clack(.5, 1), t, .3, 0); add(buf, paper(.5), t + .02, .15, 0)
    elif ty == "washbloom": add(buf, wet(1.4), t, .12, 0)
    elif ty == "hit": add(buf, thump(1, 50), t, .4, 0); add(buf, whoosh(.25), t - .18, .12, 0)
    elif ty == "footsteps_suits":
        for k in range(int(e["dur"] / .42)): add(buf, S(clack(1.3, 1) * .6, step(1) * .4), t + k * .42 + rng.random() * .05, .14, .3 - k * .05)
    elif ty == "quake":
        d = e["until"] - t; tt = t_(d); ab = t + tt
        grow = np.clip((ab - t) / (B["isnt"] - t), 0, 1) ** 2 * .8 + .2
        grow = np.where(ab > B["isnt"], 1.25, grow); grow *= np.clip((e["until"] - ab) / .6, 0, 1)
        x = norm(lp(brown(d), 120)) * 1.0 + norm(bp(brown(d), 80, 400)) * .5
        add(buf, x * grow, t, .75, 0)
        for k in range(int(d * 14)):
            tk = t + rng.random() ** .6 * d; w = float(np.interp(tk, ab, grow))
            add(buf, tink(), tk, .07 * w, rng.random() * .6 - .3)
            if rng.random() < .3: add(buf, creak(), tk, .1 * w, rng.random() - .5)
    elif ty == "glassbreak": add(buf, thump(1, 120)[:int(.1 * SR)], t, .3, .3); [add(buf, tink(), t + .02 + rng.random() * .4, .16, .3 + rng.random() * .2) for _ in range(14)]
    elif ty == "tear": add(buf, tear(.75), t, .5, 0)
    elif ty == "collapse":
        add(buf, crash(1), t, .5, 0); add(buf, crash(1), t + .35, .4, -.3); add(buf, crash(1), t + .7, .35, .3)
        add(buf, rumble(2.2, 1), t, .6, 0)
        for k in range(30): add(buf, clack(.5 + rng.random() * .6, 1), t + .3 + rng.random() * 1.6, .08, rng.random() - .5)
    elif ty == "morning":
        d = e["until"] - t
        for k in range(int(d * 2.5)): tk = t + rng.random() * d; [add(buf, clack(.6 + rng.random() * .5, 1), tk + j * .06, .05, rng.random() - .5) for j in range(1 + int(rng.random() * 3))]
    elif ty == "rubble_lift":
        d = e["dur"]
        for k in range(14): add(buf, clack(.5 + rng.random() * .5, 1), t + rng.random() * d, .1, -.3 + rng.random() * .6)
        add(buf, norm(lp(noise(d), 1200)) * env_win(d, .4, .6), t, .05, 0)
    elif ty == "dig":
        d = e["dur"]; tt = t_(d); add(buf, norm(bp(noise(d), 500, 4000) * (.3 + .7 * np.abs(np.sin(2 * np.pi * 2.2 * tt))) * env_win(d, .1, .3)), t, .14, 0)
        for k in range(16): add(buf, clack(.5 + rng.random() * .5, 1), t + rng.random() * d, .1, -.4 + rng.random() * .8)
    elif ty == "exhale":
        d = 1.1; tt = t_(d); add(buf, norm(bp(noise(d), 250, 1800) * np.sin(np.pi * tt / d) ** 1.5 * np.exp(-tt * .8)), t, .1, 0)
    elif ty == "card": pass
    elif ty == "tap": add(buf, stone_tap(), t, .55 if t < SC["s9"]["t0"] else .35, .05)
    elif ty == "node": add(buf, tick(), t, .18, pan); add(buf, click(1.4, 1) * .3, t, .08, pan)

# ---------- duck under narration ----------
duck = np.ones(N); tt = np.arange(N) / SR
lines = TL["lines"]
for L in lines: duck[(tt > L["t0"] - .1) & (tt < L["t1"] + .15)] = .5
duck = np.convolve(duck, np.ones(7200) / 7200, "same")
buf *= duck[:, None]
buf[:, 0] = hp(buf[:, 0], 35); buf[:, 1] = hp(buf[:, 1], 35)

if VOICE:
    vb = np.zeros(N)
    for p in json.load(open(VOICE)):
        v, sr = sf.read(p["wav"]); v = v if v.ndim == 1 else v.mean(1)
        assert sr == SR, sr
        v = compress(v / (np.abs(v).max() + 1e-9) * .9, thr=.3, ratio=3)
        s = int(p["at"] * SR); e = min(N, s + len(v)); vb[s:e] += v[:e - s]
    # effects at about -10 dB under the voice (by RMS), voice centred
    vr = np.sqrt(np.mean(vb[vb != 0] ** 2)); fr = np.sqrt(np.mean(buf ** 2)) + 1e-9
    buf = buf * (vr / fr) * 10 ** (-13 / 20)
    buf += vb[:, None] * .95
    for c in range(2): buf[:, c] = limit(buf[:, c], .9)
    sf.write(OUT, buf.astype(np.float32), SR, subtype="FLOAT")
else:
    for c in range(2): buf[:, c] = limit(buf[:, c], .95)
    sf.write(OUT + ".tmp.wav", buf.astype(np.float32), SR, subtype="FLOAT")
    m = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", OUT + ".tmp.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float([l for l in m.splitlines() if l.strip().startswith("I:")][-1].split()[1])
    gain = 10 ** ((-18.7 - I) / 20)
    y = buf * gain
    for c in range(2): y[:, c] = limit(y[:, c], 10 ** (-4 / 20))
    sf.write(OUT, y.astype(np.float32), SR, subtype="FLOAT"); os.remove(OUT + ".tmp.wav")
    print(f"integrated before {I:.1f} LUFS, gain {20*np.log10(gain):+.1f} dB -> ~-20 LUFS")
print("wrote", OUT)
