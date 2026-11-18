# Place the real ElevenLabs lines into their planned cue windows (shift a line earlier only if it would overrun the next one;
# the last line may extend the film), re-derive the picture beats from the real word times, and write captions.
# Writes timeline_voice.json, out/vo_place.json, out/subs.json, out/tremormesh.srt
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, "timeline.json")))
CUES = json.load(open(os.path.join(HERE, "out", "vo_cues.json")))
META = json.load(open(os.path.join(HERE, "out", "vo", "voice.json")))
GAP = .35
place, lines, prev_end = [], [], 0.0
for i, c in enumerate(CUES):
    words = json.load(open(os.path.join(HERE, "out", "vo", c["id"] + ".words.json")))
    dur = META["lines"][c["id"]]["dur"]
    at = c["t0"]
    if i + 1 < len(CUES) and at + dur > CUES[i + 1]["t0"] - GAP:
        at = max(prev_end + GAP, CUES[i + 1]["t0"] - GAP - dur)
    at = max(at, prev_end + GAP) if i else at
    prev_end = at + dur
    place.append({"id": c["id"], "at": round(at, 3), "wav": os.path.join(HERE, "out", "vo", c["id"] + ".wav")})
    ws = [{"w": w["w"], "t0": round(at + w["t0"], 3), "t1": round(at + w["t1"], 3)} for w in words]
    lines.append({"id": c["id"], "t0": round(at, 3), "t1": round(at + dur, 3), "text": c["text"], "words": ws})
    print(f"{c['id']}: planned {c['t0']:.2f}-{c['t1']:.2f}  placed {at:.2f}-{at + dur:.2f}")

def word_at(lid, word, nth=0):
    L = next(l for l in lines if l["id"] == lid)
    hits = [w for w in L["words"] if re.sub(r"[^\w]", "", w["w"]).lower() == word.lower()]
    return hits[nth]["t0"]
old = TL["beats"]
spec = {"walk_home": ("s1", "home"), "sleep": ("s1", "sleep"), "drilling": ("s2", "drilling"), "bed_shakes": ("s2", "shakes"), "walls": ("s2", "walls"), "sleepless": ("s2", "sleepless"),
        "records": ("s3", "records"), "every_tremor": ("s3", "tremor"), "every_night": ("s3", "night"), "court": ("s4", "court"), "tampered": ("s4", "tampered"), "rewritten": ("s4", "rewritten"),
        "officially": ("s4", "officially"), "never": ("s4", "never"), "construction4": ("s4", "construction"), "handed": ("s5", "handed"), "defamation": ("s5", "defamation"),
        "that_night": ("s6", "night"), "shakes6": ("s6", "shakes"), "this_time": ("s6", "time"), "isnt": ("s6", "isnt"), "morning": ("s7", "morning"), "rubble": ("s7", "rubble"),
        "trapped": ("s7", "trapped"), "no_one": ("s7", "one", 2), "vibrations": ("s9", "vibrations"), "save": ("s9", "save"), "tomorrow": ("s9", "tomorrow"), "introducing": ("s10", "Introducing"),
        "tm1": ("s10", "TremorMesh"), "sense": ("s10", "Sense"), "map": ("s10", "map"), "prove": ("s10", "prove"), "story": ("s10", "story"), "tm2": ("s10", "TremorMesh", 1), "matters": ("s10", "Matters")}
beats = {k: word_at(*v) for k, v in spec.items()}
for k in beats: print(f"  {k:14s} {old[k]:7.2f} -> {beats[k]:7.2f}")
TL2 = json.loads(json.dumps(TL))
TL2["lines"], TL2["beats"] = lines, beats
end = lines[-1]["t1"] + 2.4
TL2["scenes"][-1]["t1"] = round(max(TL2["scenes"][-1]["t1"], end), 3); TL2["dur"] = TL2["scenes"][-1]["t1"]
json.dump(TL2, open(os.path.join(HERE, "timeline_voice.json"), "w"), indent=1)
json.dump(place, open(os.path.join(HERE, "out", "vo_place.json"), "w"), indent=1)

# captions: sentence chunks from real word times, merged until each holds >= 1.8 s and <= ~80 chars
subs = []
for L in lines:
    chunks, cur = [], []
    for w in L["words"]:
        cur.append(w)
        if re.search(r"[.?…]$", w["w"]): chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    merged = []
    for ch in chunks:
        if merged and ((merged[-1][-1]["t1"] - merged[-1][0]["t0"]) < 1.8 or (ch[-1]["t1"] - ch[0]["t0"]) < 1.2) and len(" ".join(w["w"] for w in merged[-1] + ch)) <= 80:
            merged[-1] = merged[-1] + ch
        else: merged.append(ch)
    for k, ch in enumerate(merged):
        t0 = ch[0]["t0"]; t1 = max(ch[-1]["t1"] + .6, t0 + 1.8)
        if k + 1 < len(merged): t1 = min(t1, merged[k + 1][0]["t0"] - .05)
        subs.append({"t0": round(t0, 3), "t1": round(t1, 3), "text": " ".join(w["w"] for w in ch)})
for a, b in zip(subs, subs[1:]):
    if a["t1"] > b["t0"] - .05: a["t1"] = round(b["t0"] - .05, 3)
json.dump(subs, open(os.path.join(HERE, "out", "subs.json"), "w"), indent=1)
def ts(x):
    ms = int(round(x * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
with open(os.path.join(HERE, "out", "tremormesh.srt"), "w") as f:
    for i, s in enumerate(subs, 1): f.write(f"{i}\n{ts(s['t0'])} --> {ts(s['t1'])}\n{s['text']}\n\n")
print("dur", TL2["dur"], "subs", len(subs))
