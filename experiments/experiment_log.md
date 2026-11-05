# Experiment log (append-only)

Schema is locked in `experiments/README.md`.

| ID | Date+time (IST) | Question / hypothesis | Method | Result | Decision/next | Log dir | Links |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EXP-0001 | 2026-11-06 05:07 | Does waveform coherence (envelope xcorr + spectral cosine + peak-freq agreement, `packages/core/src/coherence.ts`) separate "one stomp felt by 2 phones" from "two different stomps"? | Real round-2 data from 2 phones (57 Arkiv triggers with waveforms). Same-stomp pairs matched after removing the measured clock offset (−2.8 s / −3.3 s). Different-stomp pairs re-timed to overlap. `npx tsx scripts/coherence-eval.ts <log> <offsetMs>` | Weak separation: same-stomp median 0.47–0.53 (n=10–11), different-stomp median 0.42 (n=234). At 0.5: same passes 40–64%, different passes 37%. Caveat: all stomps were one person at one spot (same source type), so this is NOT the collusion scenario. | Do NOT claim collusion detection. Ship coherence as an experimental indicator (score + inter-phone lag, no verdict). Next, EXP-0002: a real collusion test (A: one stomp between phones; B: two people stomping by their own phones on a countdown), compared on lag after sound sync + coherence. | logs/arkiv-test2-2026-11-05T22-22-09-902Z.json | Q-0001, design/build-plan.md |
