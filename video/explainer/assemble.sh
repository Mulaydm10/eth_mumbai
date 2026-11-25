#!/bin/zsh
# Wait for the scene render, then: captions → explainer with guide voice → explainer without voice → join after the intro → check → Omen.
cd "${0:A:h}"; S=~/.claude/skills/demo-video; O=$PWD/out; I="${0:A:h}/../../media/intro"
until grep -q RENDER-DONE out/render.log 2>/dev/null; do sleep 10; done
cd cut
node $S/cut/render.mjs > ../out/captions.log 2>&1
SAFE_BOTTOM=132 MUSIC=0 AUTO_SFX=0 DEMO_SRC=../out/ python3 $S/cut/build.py ../out/explainer-voice.mp4 > ../out/build.log 2>&1
cd ..
# no-voice explainer: same picture and captions, silent track (for dubbing)
ffmpeg -v error -y -i $O/explainer-voice.mp4 -f lavfi -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest $O/explainer-novoice.mp4
# join after the intro (intro is 24 fps: converted to 60 fps by repeating frames, no speed change; intro audio levelled to -14 LUFS)
J() { ffmpeg -v error -y -i "$1" -i "$2" -filter_complex "[0:v]fps=60,scale=1920:1080,setsar=1,format=yuv420p[v0];[0:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a0];[1:v]fps=60,setsar=1,format=yuv420p[v1];[1:a]aresample=48000[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 17 -preset medium -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$3"; }
J $I/tremormesh.mp4 $O/explainer-voice.mp4 $O/TremorMesh-full-with-voice.mp4
J $I/tremormesh_novoice.mp4 $O/explainer-novoice.mp4 $O/TremorMesh-full-no-voice.mp4
for f in TremorMesh-full-with-voice TremorMesh-full-no-voice explainer-voice explainer-novoice; do echo "$f $(ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact=p=0:nk=1 $O/$f.mp4 | tr '\n' ' ') $(du -h $O/$f.mp4 | cut -f1)"; done > $O/final-stats.txt
ffmpeg -v error -y -i $O/TremorMesh-full-with-voice.mp4 -vf "fps=1/6,scale=320:-1,tile=8x5" -frames:v 1 $O/final-sheet.jpg
ssh omen 'mkdir -p ~/Downloads/tremor-mesh-video' && scp -q $O/TremorMesh-full-with-voice.mp4 $O/TremorMesh-full-no-voice.mp4 $O/explainer-voice.mp4 $O/explainer-novoice.mp4 omen:Downloads/tremor-mesh-video/ && ssh omen 'cd ~/Downloads/tremor-mesh-video && sha256sum TremorMesh-full-*.mp4 explainer-*.mp4' > $O/omen-sha.txt
(cd $O && shasum -a 256 TremorMesh-full-*.mp4 explainer-*.mp4) >> $O/omen-sha.txt
echo ALLDONE >> $O/final-stats.txt
