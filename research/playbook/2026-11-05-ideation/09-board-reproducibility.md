# Board member: REPRODUCIBILITY
Angle: can the measured claims in VERDICT.md be reproduced from scratch? Read-only; no keys.

## Entry 1: devnet + Arkiv probes (curl, today 2026-11-05)
- https://altmempool.forshtat.com and /rpc: eth_chainId = 0x539 (1337) both; eth_blockNumber = 0x62c51 (404561) both. REPRODUCED. Sure: high.
- https://rpc.rabdi.db-chain.testnet.arkiv.network eth_chainId = 0x76edaf. REPRODUCED (live). Sure: high. (I did not check whether the number matches a number quoted in the run files.)
## Entry 2: ENSv2 Sepolia eth_getCode (publicnode Sepolia, own opcode-aware script)
- 0xb458d6a3...c43f (RootRegistry): 16000 bytes of code; 0x24e1d8e0...2d72 (UniversalResolverV2): 18792 bytes. REPRODUCED (code exists). Existence only, as VERDICT already admits ("probed, not exercised"). Sure: high. Did not check the other Sepolia addresses in sponsor-docs-notes.md.
## Entry 3: C2 sweeper delegates (mainnet publicnode eth_getCode, linear opcode walk skipping PUSH1-32 data)
- Walked all 5 delegates listed in 07-converge-technical-SA.md: 0x710f..(1042 B), 0x8904..(3933 B), 0xa03f..(2267 B), 0x6b78..(2267 B), 0xb678..(1837 B). Zero 0xAA at opcode positions in all 5. REPRODUCED. 0x8904 has 6 raw 0xAA bytes, all inside PUSH data/metadata (so a naive byte grep would false-positive there: a note-taker doing so would be wrong; SA's claim of opcode-aware check holds).
- Caveats (LOW): (a) 0xAA is an unassigned opcode before EIP-8141, so absence is expected, a weak test; (b) absence of APPROVE does not prove inability if delegate DELEGATECALLs elsewhere, but APPROVE must be executed by the frame target itself, so that is moot. (c) Etherscan labels came from search-result titles, not fetched pages (SA says so itself); I did not verify labels. Note 0xa03f and 0x6b78 have identical size 2267, plausible copy-paste clones, consistent with the story.
## Entry 4: C3 simulation (venv python -I sim.py, seed 1, original untouched)
- Rerun output is byte-identical to scratchpad/c3/sim_out2.txt (only the `time` line differs). REPRODUCED deterministically. Sure: high.
- INTERVENTION: copies in scratchpad/board/ with default_rng(1) replaced by seeds 7, 123, 2024 (outputs out_s7/123/2024.txt). Medians, PPV 3 and 5 mm/s:
  - Taped, 60 Hz, impacts: -17..-30% (all seeds; pipelines "A" and "A-ts"); burst: +40..+55% when jittered samples treated uniform ("A"), +14..+16% when resampled by timestamp ("A-ts"). Survives: yes, "biased by tens of %" holds. BUT the VERDICT range "-25% to +17%" matches only the timestamp-resampled burst case; the naive-pipeline burst bias is ~+40% and seed-1 (and every seed) shows it. 
  - Taped, 200 Hz, impacts: median -5.1..+1.8% across seeds/pipelines (A, A-ts, A2, B). Survives. Burst taped 200 Hz: +11..+14% naive (A), +3..+8% ts-resampled, ~0..+1% with the 70 ug/rtHz IMU. Per-run p10..p90 spans up to -10..+14% (pipeline B) so "within ±5%" is a median statement, not a per-event one. At PPV 1 mm/s, 200 Hz impacts show +16.5% (noise-limited, seed 1).
  - Loose coupling at 200 Hz: burst +31..+36% (seeds all agree; 400 Hz +34..+39%); impacts only +8..+11% at 200 Hz (+13..+15% at 400 Hz). 60 Hz loose: impacts -18..-21%, burst +46..+55%. So "+30-60%" is true for the 20 Hz burst (near the 30 Hz modelled tile resonance) but NOT for impacts (~+8-15%). Not seed-fragile; it is scenario/parameter-fragile.
- Verdict statements: qualitatively all survive seed change. Fragile points: (i) quoted ranges mix pipelines; (ii) the loose-coupling range is burst-only; (iii) the whole thing is a self-built model with chosen noise (160 ug/rtHz), tile resonance, 10% jitter; no real-phone data (VERDICT admits). Severity: MED for (i)/(ii) as wording precision, LOW for qualitative conclusions.
## Entry 5: Chromium 60 Hz cap (GitHub MCP search_code, chromium/chromium)
- services/device/public/cpp/generic_sensor/sensor_traits.h: base `SensorTraits` has `static constexpr double kMaxAllowedFrequency = 60.0;` (AMBIENT_LIGHT specialisation is 10.0). services/device/public/cpp/generic_sensor/sensor_mojom_traits.cc: `constexpr double kMaxAllowedFrequency = 60.0;` and rejects `data.frequency() > kMaxAllowedFrequency`. REPRODUCED at source level (default branch at search time, commit ref 33ec05f8). Sure: high for the constant; I did not confirm the ACCELEROMETER specialisation line explicitly (search showed only the generic 60.0 and ambient-light 10.0), nor that Android Chrome's delivered rate actually reaches 60 (VERDICT concedes no phone tested). kDefaultPumpFrequencyHz was not searched; not needed.

## Findings
- [MED] Sim ranges quoted in VERDICT mix pipelines: "-25% to +17%" at 60 Hz matches only timestamp-resampled bursts; the naive-uniform pipeline gives ~+40% burst bias (all 4 seeds). Qualitative claim (tens of %) survives.
- [MED] "Coupling +30-60%" holds only for the 20 Hz burst scenario (near the modelled 30 Hz tile resonance); loose-coupled impacts at 200 Hz read only +8..+11%. Seed-robust, but scenario-specific; wording should say so.
- [LOW] "200 Hz within ±5% taped" is a median statement (impacts, ts-resampled); per-run p10..p90 reaches about -10..+14%, naive-pipeline bursts are +11..+14%, and 1 mm/s events +16%. Survives for medians across seeds 1/7/123/2024.
- [LOW] C2 "no APPROVE (0xAA) opcode" in the 5 labelled delegates: reproduced with an opcode-aware walk; test is weak by construction (0xAA unassigned pre-8141). One delegate has raw 0xAA bytes in PUSH data, so naive byte grep would be wrong; the claim as stated is correct.
- [LOW] Etherscan labels of the 5 delegates came from search-result titles, not fetched pages (SA discloses). Not re-verified here.
- [LOW] ENSv2 Sepolia: existence reproduced only (VERDICT already says so). Devnet chainId 0x539 and blocks advancing, Arkiv RPC live (chainId 0x76edaf): reproduced; live-ness is time-dependent (devnet "may be reset at any time").
- Everything else in "Measured" that I tested: CLEAR. Not tested: 6,788-authority C2 scan, Playwright sponsor-text quotes.

## Searches run / sources fetched / tools used
- curl: altmempool.forshtat.com (+/rpc) eth_chainId/blockNumber; rpc.rabdi.db-chain.testnet.arkiv.network eth_chainId.
- python3 -I urllib eth_getCode: ethereum-sepolia-rpc.publicnode.com (2 addrs), ethereum-rpc.publicnode.com (5 delegates), own opcode walker at scratchpad/code.py.
- Original sim.py via scratchpad/c3/venv/bin/python -I; seed-intervention copies in scratchpad/board/.
- mcp__github__search_code "kMaxAllowedFrequency repo:chromium/chromium".
- Local reads: VERDICT.md, 07-converge-technical-SA.md/SB.md (grep), sources/sponsor-docs-notes.md (grep). No blocked paths. Did not read all of the 07 files in full (grepped for addresses/claims).
