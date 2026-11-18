#!/bin/sh
# One-command build. ./build.sh            -> out/tremormesh_novoice.mp4 (effects only, ~-20 LUFS, no subtitles)
#                    ./build.sh voice      -> out/tremormesh.mp4 (+ .srt): ElevenLabs narration, burned captions, -14 LUFS
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/Dhruv/infra/video-skills/lemo-opuscar}
export LIB
cd "$LIB"
PY="$LIB/.venv/bin/python"
"$PY" "$HERE/plan.py" > /dev/null
node core/render/events.mjs "$HERE"
if [ "$1" = voice ]; then
  "$PY" "$HERE/voice.py"
  "$PY" "$HERE/place_voice.py"
  node core/render/video.mjs "$HERE" --fps 24 --workers 5 --q 'subs=out/subs.json' --out "$HERE/out/video_subs.mp4"
  "$PY" "$HERE/mix.py" "$HERE/out/mix_voice.wav" --voice "$HERE/out/vo_place.json"
  sh core/render/mux.sh "$HERE/out/video_subs.mp4" "$HERE/out/mix_voice.wav" "$HERE/out/tremormesh.mp4" 24 1
else
  node core/render/video.mjs "$HERE" --fps 24 --workers 5 --out "$HERE/out/video.mp4"
  "$PY" "$HERE/mix.py" "$HERE/out/mix_novoice.wav"
  ffmpeg -hide_banner -loglevel error -y -i "$HERE/out/video.mp4" -i "$HERE/out/mix_novoice.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "$HERE/out/tremormesh_novoice.mp4"
fi
