# ElevenLabs narration, one clip per scene line, with word timestamps.
# Key is read from ~/.config/elevenlabs/api_key and never printed or written anywhere.
# Writes out/vo/<id>.mp3, <id>.wav (48 kHz mono), <id>.words.json and out/vo/voice.json (durations + chars used).
import base64, json, os, subprocess, sys, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out", "vo")
VOICE = "cjVigY5qzO86Huf0OWal"  # Eric
LINES = json.load(open(os.path.join(HERE, "lines.json")))
os.makedirs(OUT, exist_ok=True)
key = open(os.path.expanduser("~/.config/elevenlabs/api_key")).read().strip()


def tts(text, prev, nxt, base):
    body = {"text": text, "model_id": "eleven_multilingual_v2", "previous_text": prev, "next_text": nxt,
            "voice_settings": {"stability": 0.55, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True}}
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": key, "content-type": "application/json", "accept": "application/json"})
    try:
        resp = urllib.request.urlopen(req, timeout=180)
    except urllib.error.HTTPError as e:
        print("ElevenLabs HTTP", e.code, e.read()[:400].decode(errors="replace")); sys.exit(3)
    cost = resp.headers.get("character-cost")
    r = json.loads(resp.read())
    open(base + ".mp3", "wb").write(base64.b64decode(r["audio_base64"]))
    al = r.get("alignment") or r.get("normalized_alignment") or {}
    words, cur, t0, t1 = [], "", 0.0, 0.0
    for ch, a, b in zip(al.get("characters", []), al.get("character_start_times_seconds", []), al.get("character_end_times_seconds", [])):
        if ch.isspace():
            if cur: words.append({"w": cur, "t0": round(t0, 3), "t1": round(t1, 3)}); cur = ""
        else:
            if not cur: t0 = a
            cur += ch; t1 = b
    if cur: words.append({"w": cur, "t0": round(t0, 3), "t1": round(t1, 3)})
    json.dump(words, open(base + ".words.json", "w"))
    return int(cost) if cost and cost.isdigit() else len(text)


meta = json.load(open(os.path.join(OUT, "voice.json"))) if os.path.exists(os.path.join(OUT, "voice.json")) else {"chars": 0, "lines": {}}
for i, L in enumerate(LINES):
    base = os.path.join(OUT, L["id"])
    if not os.path.exists(base + ".mp3") or "--force" in sys.argv and L["id"] in sys.argv:
        prev = LINES[i - 1]["text"] if i else None
        nxt = LINES[i + 1]["text"] if i + 1 < len(LINES) else None
        meta["chars"] += tts(L["text"], prev, nxt, base)
        print("tts", L["id"])
    # trim leading/trailing silence lightly, 48 kHz mono
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", base + ".mp3", "-ar", "48000", "-ac", "1", base + ".wav"], check=True)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", base + ".wav"]).decode())
    words = json.load(open(base + ".words.json"))
    meta["lines"][L["id"]] = {"dur": round(d, 3), "speech0": words[0]["t0"], "speech1": words[-1]["t1"]}
json.dump(meta, open(os.path.join(OUT, "voice.json"), "w"), indent=1)
print(json.dumps(meta, indent=1))
