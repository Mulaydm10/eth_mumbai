# Timing plan without a voice: every narration line gets a window spoken calmly at ~2.4 words/s
# (+0.6 s per "…"), with estimated per-word times so picture beats land where the words will fall.
# Writes timeline.json (read by the page and mix.py), out/vo_cues.json and out/vo_cues.srt (the recording guide).
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LINES = {l["id"]: l["text"] for l in json.load(open(os.path.join(HERE, "lines.json")))}
WPS, ELL, SENT = 2.4, 0.6, 0.22
GAP_IN, GAP_OUT = 0.35, 0.3          # scene start -> line start, line end -> next scene start


def words_of(text):
    toks = text.replace("—", " — ").split()
    ws = [w for w in toks if w != "—"]
    n = len(ws)
    dur = n / WPS + ELL * text.count("…")
    # weights: letters + pauses after sentence ends / ellipses / dash / commas
    base, pauses = [], []
    for i, w in enumerate(ws):
        base.append(len(re.sub(r"[^\w']", "", w)) + 2.0)
        p = 0.0
        if w.endswith("…"): p = ELL
        elif w.endswith((".", "?")): p = SENT
        elif w.endswith(","): p = 0.12
        if i + 1 < len(ws) and toks[toks.index(w) + 1 if w in toks else 0] == "—": p = max(p, .25)
        pauses.append(p if i + 1 < n else 0)
    k = (dur - sum(pauses)) / sum(base)
    t, out = 0.0, []
    for w, b, p in zip(ws, base, pauses):
        out.append({"w": w, "t0": round(t, 3), "t1": round(t + b * k, 3)}); t += b * k + p
    return out, dur


scenes = []
t = 0.0
order = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"]
lines = []
for sid in order:
    s = {"id": sid, "t0": round(t, 3)}
    if sid == "s8":
        t += 3.2
    else:
        lead = 0.5 if sid == "s1" else GAP_IN
        ws, dur = words_of(LINES[sid])
        l0 = t + lead
        lines.append({"id": sid, "t0": round(l0, 3), "t1": round(l0 + dur, 3), "text": LINES[sid],
                      "words": [{"w": w["w"], "t0": round(l0 + w["t0"], 3), "t1": round(l0 + w["t1"], 3)} for w in ws]})
        t = l0 + dur + GAP_OUT
    if sid == "s10": t += 2.4                 # logo hold
    s["t1"] = round(t, 3)
    scenes.append(s)

def word_at(lid, word, nth=0):
    L = next(l for l in lines if l["id"] == lid)
    hits = [w for w in L["words"] if re.sub(r"[^\w]", "", w["w"]).lower() == word.lower()]
    return hits[nth]["t0"]

beats = {
    "walk_home": word_at("s1", "home"), "sleep": word_at("s1", "sleep"),
    "drilling": word_at("s2", "drilling"), "bed_shakes": word_at("s2", "shakes"), "walls": word_at("s2", "walls"), "sleepless": word_at("s2", "sleepless"),
    "records": word_at("s3", "records"), "every_tremor": word_at("s3", "tremor"), "every_night": word_at("s3", "night"),
    "court": word_at("s4", "court"), "tampered": word_at("s4", "tampered"), "rewritten": word_at("s4", "rewritten"),
    "officially": word_at("s4", "officially"), "never": word_at("s4", "never"), "construction4": word_at("s4", "construction"),
    "handed": word_at("s5", "handed"), "defamation": word_at("s5", "defamation"),
    "that_night": word_at("s6", "night"), "shakes6": word_at("s6", "shakes"), "this_time": word_at("s6", "time"), "isnt": word_at("s6", "isnt"),
    "morning": word_at("s7", "morning"), "rubble": word_at("s7", "rubble"), "trapped": word_at("s7", "trapped"), "no_one": word_at("s7", "one", 2),
    "vibrations": word_at("s9", "vibrations"), "save": word_at("s9", "save"), "tomorrow": word_at("s9", "tomorrow"),
    "introducing": word_at("s10", "Introducing"), "tm1": word_at("s10", "TremorMesh"), "sense": word_at("s10", "Sense"), "map": word_at("s10", "map"),
    "prove": word_at("s10", "prove"), "story": word_at("s10", "story"), "tm2": word_at("s10", "TremorMesh", 1), "matters": word_at("s10", "Matters"),
}
TL = {"dur": scenes[-1]["t1"], "scenes": scenes, "lines": lines, "beats": beats}
json.dump(TL, open(os.path.join(HERE, "timeline.json"), "w"), indent=1)
os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
json.dump([{"id": l["id"], "t0": l["t0"], "t1": l["t1"], "text": l["text"], "words": l["words"]} for l in lines], open(os.path.join(HERE, "out", "vo_cues.json"), "w"), indent=1)

def ts(x):
    ms = int(round(x * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
with open(os.path.join(HERE, "out", "vo_cues.srt"), "w") as f:
    for i, l in enumerate(lines, 1):
        f.write(f"{i}\n{ts(l['t0'])} --> {ts(l['t1'])}\n{l['text']}\n\n")
for s in scenes: print(s)
print("dur", TL["dur"]); print(json.dumps(beats))
