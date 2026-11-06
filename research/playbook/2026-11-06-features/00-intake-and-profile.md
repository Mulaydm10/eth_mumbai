# 00 Intake and profile (orchestrator, 2026-11-06 05:40 IST)

## Intake check
BRIEF.md is complete for this task. No INTAKE REQUEST needed.
- Problem: scoped feature generation for the existing product (Tremor Witness). Verbatim ask is in BRIEF.md "The ask".
- Rubric: finalist rubric (5 criteria, no weights) + sponsor rubrics, verbatim in 01-commitments.md.
- Judges: ETHGlobal finalist panel (4-min demo + 3-min Q&A); partners judge from submitted materials (booth optional).
- Field: ~unknown entrants at Mumbai; crowded list carried from the 2026-11-05 run (01-commitments.md there, §C).
- User position: product live; three picks chosen (Arkiv+Swarm, ENSv2, EF CROPS).
- Ambition: finalist first, then partner prizes.

**Clock:** timing information was present in the repo (COMPETITION.md deadline, STATE.md, build plan timeline). Per the playbook clock rule I read it but deliberately do not use it for scoping. No branch is pruned for time or build difficulty; difficulty appears as a note only. Sequencing is Dhruv's call.

## Repo facts the orchestrator observed while reading (feed into CONVERGE)
- `README.md` says "ENSv2 → `ens/` (Prototype 3)", but **no `ens/` directory exists** (checked `ls ens`). ENS judges read materials; this is a gap.
- `notes/judging_alignment.md` is all `TODO(Dhruv)`; `VISION.md` has 5 TODOs; `DEMO.md` has 8 TODOs.
- `arkiv/swarm.md` versus the Swarm bonus qualification list (verbatim in 01): it does not state the **postage stamp batch ID / who gave it** (we use the null stamp via the public gateway; this must be stated as such), **one entity key + Swarm reference with a link**, or **"the moment in your demo video where Swarm is used"**. Gaps.
- `arkiv/data-quality.md` is required only for the Mirror track, not Build on Arkiv. Not a gap.
- `packages/chain/src/ens.ts` hard-codes contract addresses (resolver, parent registry). The sensor set, k and window are read from ENS at runtime. ENS's "not just hard-coded values" refers to demo data; contract addresses are normal. Note, not a finding.
- Repo is private; must go public (known).

## Stage 1b: what kind of competition is this?
1. **What does a judge physically receive?** Finalist: a 4-minute live demo + 3-min Q&A, plus a 2–4 min video and the project page. Partners (Arkiv, ENS, EF): the repo files (`/arkiv/*.md`, README CROPS, an ENS write-up), the video (EF: ≤3 min with "the moment it matters"), the live link. Partners judge from materials.
2. **Who judges, against what?** A finalist panel reacting in minutes against Technicality / Originality / Practicality / Usability / WOW; sponsor engineers reading files against explicit 25% criteria (Arkiv), "central not cosmetic, not hard-coded" (ENS), and "structural beats cosmetic" (EF).
3. **What separates the top few here?** A live physical moment that works (stomp → quorum → kill backend), framing that answers "why blockchain" crisply, sponsor-native depth that a sponsor engineer recognises as using their newest primitives, and an honest measured number.
4. **Where is the real bottleneck for this human?** The product exists. The bottleneck is *which additions* raise rubric and sponsor scores without diluting the pitch or the demo, plus the materials and factors the team does not know about. That is an idea-selection problem (DIVERGE) followed by "is each addition real, native and safe" (CONVERGE).

## Derived profile
- **Mode:** DIVERGE (features, mechanisms, integrations, evidence, demo moments) → CONVERGE (rank, ground, stress-test). Never blended.
- **Selection dimensions:** finalist rubric + verbatim sponsor requirements first; then (from Q3) demo-moment strength and sponsor-native depth; then impact evidence; then crowding. Never novelty first.
- **Impact validation weight:** medium. The product's problem was validated in the 2026-11-05 run (REAL, narrow, locally costly). Here impact-validation applies to *features* that claim a resident/legal use (e.g. "a BMC complaint/RTI artifact"): is that use real?
- **Out of scope for me:** building any feature, recording the video, delivering the pitch, real-phone tests, contacting a housing society, booth conversations. I hand those back.
- **Mix:** the event mixes an idea problem (which features) and an execution problem (building and demoing them). I serve the first and hand back the second.

## Stage 2: triage
> Could a competent single expert plausibly miss this in one careful pass?

**Yes.** Reasons it is subtle:
- Wide design space across four stacks (Arkiv, Swarm, ENSv2, EF tooling), each with newly shipped primitives that a single pass reasons about from memory rather than from current docs.
- Coupled constraints: a feature that deepens one sponsor can break another (e.g. a server-side helper raises UX but weakens the EF "structural" C claim; World ID raises sybil-resistance but needs a backend and a 4th pick).
- Non-technical factors (Indian legal admissibility, judge psychology, video/form rules) live in different sources from the code.
- The "is it native or bolted on" judgement is the actual scoring axis for two of three sponsors, and is easy to get wrong without reading their newest examples.

Mode: **Both — DIVERGE then CONVERGE**, as the brief directs.
