#!/bin/zsh
# Resume the hype render from the frames already on disk, split the rest into ~480-frame chunks, assemble, send to the Omen.
cd "${0:A:h}"; O=$PWD/out/hype; export DEMO_OUT=$O/parts; mkdir -p $DEMO_OUT
F="$PWD/scenes/hype.html"; R=~/.claude/skills/demo-video/scripts/frames.mjs
typeset -A DUR; DUR=(news 14 idea 15 wave 18 join 18 live 24 refused 14 proof 24 mesh 25 claim 12)
ORDER=(news idea wave join live refused proof mesh claim)
for n in $ORDER; do
  total=$(( DUR[$n] * 60 )); done_f=$(ffprobe -v error -select_streams v -count_packets -show_entries stream=nb_read_packets -of csv=p=0 $O/h-$n.mp4 | tr -dc 0-9)
  echo "$n $done_f/$total" ; echo "$done_f" > $DEMO_OUT/$n.done
  f=$done_f; k=0
  while (( f < total )); do c=$(( total - f < 480 ? total - f : 480 ))
    node $R "$F#$n" "$n-c$k" --from $(python3 -c "print($f/60)") --dur $(python3 -c "print($c/60)") > $DEMO_OUT/log-$n-$k.txt 2>&1 &
    f=$(( f + c )); k=$(( k + 1 )); done
done
wait
for n in $ORDER; do
  d=$(cat $DEMO_OUT/$n.done); : > $DEMO_OUT/$n.list
  ffmpeg -v error -y -i $O/h-$n.mp4 -frames:v $d -c:v libx264 -crf 14 -preset fast -r 60 $DEMO_OUT/$n-c_.mp4; echo "file '$n-c_.mp4'" >> $DEMO_OUT/$n.list
  for c in $(ls $DEMO_OUT | grep -E "^$n-c[0-9]+\.mp4$" | sort -t c -k2 -V); do echo "file '$c'" >> $DEMO_OUT/$n.list; done
  ffmpeg -v error -y -f concat -safe 0 -i $DEMO_OUT/$n.list -c:v libx264 -crf 14 -preset fast -r 60 $O/full-$n.mp4
done
V=../media/videos
ffmpeg -v error -y -ss 2.0 -t 11.5 -i $V/VID-20261106-WA0015.mp4 -ss 0.5 -t 12.2 -i $V/VID-20261106-WA0014.mp4 -filter_complex \
 "[0:v]scale=439:780:force_original_aspect_ratio=increase,crop=439:780,fps=60,setsar=1[a];[1:v]scale=439:780:force_original_aspect_ratio=increase,crop=439:780,fps=60,setsar=1[b];[a][b]concat=n=2:v=1[v]" \
 -map "[v]" -an -c:v libx264 -crf 16 $O/footage.mp4
ffmpeg -v error -y -i $O/full-live.mp4 -itsoffset 0.3 -i $O/footage.mp4 -filter_complex "[0:v][1:v]overlay=150:150:eof_action=pass[v]" -map "[v]" -c:v libx264 -crf 14 -preset fast -r 60 $O/full-live-footage.mp4
: > $O/final.list; for n in $ORDER; do f=full-$n.mp4; [[ $n == live ]] && f=full-live-footage.mp4; echo "file '$f'" >> $O/final.list; done
ffmpeg -v error -y -f concat -safe 0 -i $O/final.list -c:v libx264 -crf 16 -preset medium -r 60 -pix_fmt yuv420p -movflags +faststart $O/tremor-mesh-hype-cut.mp4
ffprobe -v error -count_frames -show_entries format=duration:stream=width,height,r_frame_rate,nb_read_frames -of compact $O/tremor-mesh-hype-cut.mp4 > $O/final-stats.txt
ffmpeg -v error -y -i $O/tremor-mesh-hype-cut.mp4 -vf "fps=1/6,scale=384:-1,tile=6x5" -frames:v 1 $O/final-sheet.jpg
scp -q $O/tremor-mesh-hype-cut.mp4 omen:Downloads/tremor-mesh-video/ && ssh omen 'sha256sum ~/Downloads/tremor-mesh-video/tremor-mesh-hype-cut.mp4' > $O/omen-sha.txt
shasum -a 256 $O/tremor-mesh-hype-cut.mp4 >> $O/omen-sha.txt
echo ALLDONE >> $O/final-stats.txt
