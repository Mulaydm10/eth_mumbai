# 09 Board: REPRODUCIBILITY angle
Lens: can VERDICT.md's key measured claims be reproduced from what the run left behind? Read-only; scratch in $TMPDIR/pb-board-repro.

## 1. verify-event test2 1440 (ran in repo, read-only) - REPRODUCED
4 sealed events, all `hash=OK members-on-arkiv=OK (2 with waveforms)`; wall time 2.988 s total. Sure: high.

## 2. Fresh clone build (git clone of HEAD to $TMPDIR/pb-board-repro/repo, npm ci, npm run build -w apps/web) - REPRODUCED
Fails: `cp: public/tremor-witness-viewer.html: No such file or directory` (apps/web/package.json build script `vite build -c vite.single.config.ts && cp dist-single/dashboard.html public/... && vite build`). After `mkdir -p apps/web/public` in the scratch clone, build succeeds (vite built in 760 ms). Note: `git ls-files apps/web/public` is empty in the main repo, so public/ exists only as an untracked dir locally (see below). HIGH-ish for deploy-from-clean-checkout; fix = `mkdir -p public &&` in script. Sure: high. (npm ci warned about esbuild postinstall allow-scripts; did not block.)

## 3. C3 physics scripts - PRESENT, REPRODUCED
/private/tmp/claude-501/pb-c3 exists (a1-a3.py, sync_sim.ts, rank_sim*.py, motor.ts, nyq.ts, venv v). a3.py output: off -3380 tol 300, 7 pairs, resid [43,126,13,-138,-66,44,82] sd 83; PPV ratio ln mean 0.15 sd 0.19. Matches 07-converge-physics (83 ms, 0.19). Caveats (LOW): scripts are in /private/tmp (volatile, outside repo, not committed), no README, absolute paths hardcoded, offset -3380 hand-chosen in a3 (acknowledged circular in F5), tol-1000 variant gives sd 333 ms / ln sd 0.38. Only a1-a3 re-run; sync_sim/rank_sim/motor/nyq not re-run.

## 4. C2 scripts - PRESENT, not run
$TMPDIR/pb-c2 has t1.mts t1b.mts t2.mts t3.mts t6.mts(+.bak), anon/, live/, node_modules, package.json, plus Solidity sources and t1.out. Not re-run (write to chain/drip). LOW: hardcodes throwaway private keys A/B in t1.mts (testnet, abandoned, per report) and relies on the drip having funded them (not repeatable without new drip call); stored in volatile $TMPDIR, no README; 07-converge-feasibility documents method but not exact run commands. Re-running t1 requires new funded keys.

## 5. npm test - GREEN
4 files, 21 tests passed (quorum 5, dsp 6, coherence 4, sync 6), 223 ms.

## Summary
CRITICAL: none. HIGH: fresh-clone build fails (confirmed, one-line fix). MED: none. LOW: scratch evidence only in volatile /tmp dirs, uncommitted, no run instructions; C2 results depend on live network state/drip.

## Searches run / sources fetched / tools used
Bash only: verify-event, git clone, npm ci, npm run build (x2), python3 a1-a3, npm test, ls/grep/head. No failures or blocked paths. No .env keys used, no drip calls, no repo edits.
