# TremorMesh — The Story of Ramesh (story film)

77.5 s narrated pitch film, made 2026-11-07 with Lemo-Opuscar, style **Urban Sketch · Pen & Wash**. Picture, sound effects and mix are all code; no music (competition rule).

## Where things are

| What | Where |
|---|---|
| **Final film** | `../out/tremormesh-story/tremormesh.mp4` (+ `tremormesh.srt`) — also on the Omen `~/Downloads/` |
| No-voice cut + voice-recording guide | `../out/tremormesh-story/tremormesh_novoice.mp4`, `vo_cues.srt`, `vo_cues.json` |
| Contact sheet | `../out/tremormesh-story/sheet.jpg` |
| Intermediates (renders, mixes, VO clips, stills) | `../out/tremormesh-story/work/` (= `out/` symlink here) |
| Style tests (Paper-cut Lightbox / Halftone Dossier / Urban Sketch, 5 s each) | `../out/tremormesh-story/style-tests/` |
| Script (source of truth) | `SCRIPT.md` · treatment `TREATMENT.md` |
| Lemo-Opuscar library (render tools, venv) | `~/Dhruv/infra/video-skills/lemo-opuscar` (the other 4 skills we evaluated sit next to it) |

`../out/` is git-ignored; this source folder is not committed yet.

## Decisions
- Story: tampering is the core beat (graph erased, logs rewritten, permit stamped NO ACTIVITY) → sets up Tremor Witness's tamper-proof signed records ("prove every tremor"). Earthquake hits the same night as the defamation notice, same bedroom.
- Ending: mesh locks on Ramesh → rescuers lift him out alive → card "TREMORMESH · for Ramesh · Every Tremor Matters."
- Voice: ElevenLabs "Eric" (`cjVigY5qzO86Huf0OWal`), `eleven_multilingual_v2`, 865 chars. Key in `~/.config/elevenlabs/api_key` (free plan; old past-due key in `api_key.old`).

## Rebuild
```sh
./build.sh          # no-voice cut  -> out/tremormesh_novoice.mp4
./build.sh voice    # voiced cut    -> out/tremormesh.mp4 (+ .srt); reuses out/vo/ unless voice.py is re-run
```
Then copy the finals from `out/` (= `work/`) up into `../out/tremormesh-story/`.

## Known weak spots (not fixed)
Strong camera tilt in the bed close-ups (~0:03, 0:12, 0:39); collapse reads as a buckling wave; stiff flop onto the bed; officials' cap-like hair.
