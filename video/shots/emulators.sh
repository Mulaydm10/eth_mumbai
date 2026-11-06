#!/usr/bin/env zsh
# M7 take: records three emulators (adb screenrecord) while the scene is played through the real app UI.
# A = emulator-5554 (mesh-8621), B = emulator-5556 (mesh-3c2a), C = emulator-5558 (mesh-36bb), all joined to site
# meshtest (quorum: k = 3 within 2 s, from the site's ENS text records). "No internet" is real: Wi-Fi + mobile data off
# (Bluetooth stays on). The shaking is the app's labelled TEST signal (real detection needs >= 96 mm/s; an emulator
# can't shake). Output: out/{a,b,c}.webm (30 fps, wall clock) + out/marks.txt (rec-a/b/c = each recording's start)
set -u
cd "$(dirname "$0")/.."
A=emulator-5554; B=emulator-5556; C=emulator-5558; ALL=($A $B $C)
now() { python3 -c 'import time;print(int(time.time()*1000))'; }
T0=0; mark() { echo "$(( ($(now) - T0) / 1000.0 )) $1" | tee -a out/marks.txt; }
pos() { adb -s $1 shell uiautomator dump /sdcard/u.xml >/dev/null 2>&1
  local b=$(adb -s $1 shell cat /sdcard/u.xml | grep -o "$2[^>]*bounds=\"[^\"]*\"" | head -1 | grep -o 'bounds="[^"]*"' | grep -o '[0-9][0-9]*' | tr '\n' ' ')
  local p=(${=b}); [ ${#p} -eq 4 ] && echo "$(( (p[1]+p[3])/2 )) $(( (p[2]+p[4])/2 ))"; }
tap() { local xy=$(pos $1 "$2"); [ -n "$xy" ] && adb -s $1 shell input tap ${=xy} || echo "!! no '$2' on $1"; }
tapall() { typeset -A XY; for d in $ALL; do XY[$d]=$(pos $d "$1"); [ -z "${XY[$d]}" ] && echo "!! no '$1' on $d"; done
  for d in $ALL; do [ -n "${XY[$d]}" ] && adb -s $d shell input tap ${=XY[$d]} & done; wait; }   # look up each phone, then tap all at once
top() { adb -s $1 shell input swipe 540 500 540 2200 250; adb -s $1 shell input swipe 540 500 540 2200 250; }
down() { adb -s $1 shell input swipe 540 1900 540 $2 900; }
net() { adb -s $1 shell svc wifi $2; adb -s $1 shell svc data $2; }

mkdir -p out; : > out/marks.txt
for d in $ALL; do net $d enable; adb -s $d shell am force-stop dev.dhruv.twmesh
  adb -s $d shell run-as dev.dhruv.twmesh rm -f files/mesh-meshtest.jsonl files/uploaded-meshtest.json
  adb -s $d shell am start -n dev.dhruv.twmesh/com.bitchat.android.MainActivity >/dev/null; done
sleep 12
for d in $ALL; do down $d 700; tap $d 'text="Update site list'; done; sleep 25     # everyone knows all 6 phones
for d in $ALL; do top $d; done; sleep 2

# Host-side emulator recording: constant 30 fps on wall-clock time (adb screenrecord compresses still periods).
T0=$(now)
for f in a b c; do rm -f out/$f.webm; done
adb -s $A emu screenrecord start --time-limit 170 --fps 30 "$PWD/out/a.webm" >/dev/null; mark rec-a
adb -s $B emu screenrecord start --time-limit 170 --fps 30 "$PWD/out/b.webm" >/dev/null; mark rec-b
adb -s $C emu screenrecord start --time-limit 170 --fps 30 "$PWD/out/c.webm" >/dev/null; mark rec-c
sleep 3; mark start
for d in $ALL; do net $d disable; done; mark offline; sleep 6

# Test shaking signal on all three phones at once (the site's quorum: 3 phones within 2 s)
for d in $ALL; do down $d 900 & done; wait; sleep 1.5; mark scroll-alert
tapall 'text="Test: send a shaking signal"'; sleep 1.5; mark dialogs
tapall 'text="Send test signal"'; mark sent; sleep 2
for d in $ALL; do top $d & done; wait; mark confirmed; sleep 7

# Check-ins: B needs help (with a note), A is safe, C stays silent
tap $B 'text="Optional note'; adb -s $B shell input text "flat%s302,%sstairs%sblocked"; adb -s $B shell input keyevent 4; sleep 1; mark note
tap $B 'text="I need help"'; mark help; sleep 2
tap $A 'text="I.m safe"'; mark safe; sleep 4
for d in $ALL; do down $d 1100 & done; wait; mark lists; sleep 9

# Back online: phone A only. It writes its own messages to Arkiv.
net $A enable; mark online-A
for i in $(seq 1 40); do
  adb -s $A shell uiautomator dump /sdcard/u.xml >/dev/null 2>&1
  adb -s $A shell cat /sdcard/u.xml | grep -q 'Saved on Arkiv: [1-9]' && break; sleep 1; done
mark arkiv-saved; sleep 6; mark end
for d in $ALL; do adb -s $d emu screenrecord stop >/dev/null; done; sleep 4
for d in $B $C; do net $d enable; done
ls -la out/*.webm; cat out/marks.txt
