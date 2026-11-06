# Proof shot: phone A's check-in, read back from Arkiv with the Tremor Witness repo's own fetchCheckins.
Output out/readback.mp4
Set Shell "bash"
Set FontSize 34
Set Width 1920
Set Height 1080
Set Framerate 60
Set Padding 40
Set Theme "Builtin Dark"
Set TypingSpeed 18ms
Hide
Type `cd .. && export TW_REPO="$HOME/Dhruv/ETH mumbai" PS1='$ ' && clear` Enter
Sleep 1s
Show
Type "# Read back from Arkiv with the Tremor Witness web app's own code (fetchCheckins)" Enter
Sleep 600ms
Type "node tools/golden/arkiv-readback.mjs meshtest 1793971742000 0xbfeb58178C6E2997350deef336A62C665fA78621 2>/dev/null" Enter
Sleep 9s
