#!/bin/zsh
# Render the hype cut: 9 code-built scenes (60 fps) + real table footage in the LIVE frame -> one video.
set -e
cd "${0:A:h}"; export DEMO_OUT=$PWD/out/hype; mkdir -p $DEMO_OUT
F="$PWD/scenes/hype.html"; R=~/.claude/skills/demo-video/scripts/frames.mjs
ORDER=(news:14 idea:15 wave:18 join:18 live:24 refused:14 proof:24 mesh:25 claim:12)
for sc in $ORDER; do n=${sc%%:*}; d=${sc##*:}; node $R "$F#$n" "h-$n" --dur $d > $DEMO_OUT/log-$n.txt 2>&1 & done; wait
V=../media/videos
# footage: only the parts that film the table (not the laptop screen); real speed, no audio, 439x780 portrait slot
ffmpeg -v error -y -ss 2.0 -t 11.5 -i $V/VID-20261106-WA0015.mp4 -ss 0.5 -t 12.2 -i $V/VID-20261106-WA0014.mp4 -filter_complex \
 "[0:v]scale=439:780:force_original_aspect_ratio=increase,crop=439:780,fps=60,setsar=1[a];[1:v]scale=439:780:force_original_aspect_ratio=increase,crop=439:780,fps=60,setsar=1[b];[a][b]concat=n=2:v=1[v]" \
 -map "[v]" -an -c:v libx264 -crf 16 $DEMO_OUT/footage.mp4
ffmpeg -v error -y -i $DEMO_OUT/h-live.mp4 -itsoffset 0.3 -i $DEMO_OUT/footage.mp4 -filter_complex "[0:v][1:v]overlay=150:150:eof_action=pass[v]" -map "[v]" -c:v libx264 -crf 14 -preset fast -r 60 $DEMO_OUT/h-live-footage.mp4
: > $DEMO_OUT/list.txt
for sc in $ORDER; do n=${sc%%:*}; f=h-$n.mp4; [[ $n == live ]] && f=h-live-footage.mp4; echo "file '$f'" >> $DEMO_OUT/list.txt; done
ffmpeg -v error -y -f concat -safe 0 -i $DEMO_OUT/list.txt -c:v libx264 -crf 16 -preset medium -r 60 -pix_fmt yuv420p -movflags +faststart $DEMO_OUT/tremor-mesh-hype-cut.mp4
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate,nb_frames -of compact $DEMO_OUT/tremor-mesh-hype-cut.mp4
