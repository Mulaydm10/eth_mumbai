#!/bin/zsh
# Render the explainer's code-built scenes at 60 fps in ~450-frame chunks, in parallel; then join chunks per scene.
cd "${0:A:h}"; export DEMO_OUT=$PWD/out/parts; mkdir -p $DEMO_OUT
F="${0:A:h}/../scenes/explainer.html"; R=~/.claude/skills/demo-video/scripts/frames.mjs
typeset -A DUR; DUR=(e_wave 630 e_join 600 e_quake 600 e_mesh 2713 e_end 480)
for n in ${(k)DUR}; do total=$DUR[$n]; f=0; k=0
  while (( f < total )); do c=$(( total - f < 450 ? total - f : 450 ))
    node $R "$F#$n" "$n-c$k" --from $(python3 -c "print($f/60)") --dur $(python3 -c "print($c/60)") > $DEMO_OUT/log-$n-$k.txt 2>&1 &
    f=$(( f + c )); k=$(( k + 1 )); done; done
wait
for n in ${(k)DUR}; do : > $DEMO_OUT/$n.list; for c in $(ls $DEMO_OUT | grep -E "^$n-c[0-9]+\.mp4$" | sort -t c -k2 -V); do echo "file '$c'" >> $DEMO_OUT/$n.list; done
  ffmpeg -v error -y -f concat -safe 0 -i $DEMO_OUT/$n.list -c:v libx264 -crf 15 -preset fast -r 60 out/$n.mp4; done
echo RENDER-DONE
