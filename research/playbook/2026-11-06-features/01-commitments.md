# 01 Commitments (written before any generation, 2026-11-06 05:42 IST)

## A. Rubrics, verbatim (we select against these, never against novelty)

### Finalist (COMPETITION.md; no weights published, none invented)
Technicality · Originality · Practicality · Usability (UI, UX, DX) · WOW factor.
Session: 4-minute demo + 3 minutes of questions. "Prepare for: what inspired the project, which tools were used and why, and what challenges it solved."
Gates: live deployment; demo video 2–4 min, ≥720p, audio without music, no speed-up, no phone recording, no TTS/AI voice; every form field; public GitHub repo; AI use documented; spec/prompt/planning artifacts in repo; large single commits may disqualify.

### Arkiv: Build on Arkiv (from scratch), $3k/$1k (sponsors/ethglobal-arkiv.md L68–107)
How we judge:
- "Arkiv feedback (25%): /arkiv/friction.md — What should we improve today to make Arkiv better: something that got in your way, or something we don't have yet that would make building easier? When something broke, what did you expect, what happened, and how can we reproduce it?"
- "Reach (25%): /arkiv/reach.md — Who is it for, and would they use it? Can they try it today, and will you keep building it after Mumbai?"
- "Why Arkiv (25%): /arkiv/why-arkiv.md — If you swapped Arkiv for Postgres or any other database, what would your users lose? What did you keep off Arkiv, and why?"
- "How you use Arkiv (25%): /arkiv/how-you-use-arkiv.md — Do the things you filter on, who can edit each entity, and when it expires fit what your app does? Does each Arkiv feature you use change something your users see?"
Qualification: "Your app writes to Arkiv's current testnet … and at least one feature users see reads its data from Arkiv." "In your README: the wallet address(es) that wrote your entities, and one query we can run." "/arkiv/schema.md … /arkiv/friction.md" "Not counted: the SDK installed but never used to read, or Arkiv used only as a log that nothing reads."

### Arkiv + Swarm bonus (from scratch), $500 (sources/sponsor-tracks-verbatim.md L1283–1299 of the 2026-11-05 run)
"Use Swarm … in a meaningful way … For example, keep the files your users see on Swarm and point to them from your Arkiv entities, or upload them encrypted so only the people who get the reference can open them. The most useful integration wins."
/arkiv/swarm.md must state: "What you keep on Swarm, what you keep on Arkiv, and which entity field holds the Swarm reference or feed." · "One Arkiv entity key and the Swarm reference it points to, with a link we can open." · "The postage stamp batch ID you uploaded with and the wallet that bought it (or who gave you the batch), and the Bee node or service you uploaded through." · "The files in your repo that upload to Swarm and read from it." · "Steps to run one upload and one read yourself …" · "The moment in your demo video where Swarm is used." · "What got in your way with Swarm." · "Careful: an encrypted Swarm reference contains its key, and Arkiv entities are public. Never store one in an entity as it is: encrypt it first or keep it off Arkiv."

### ENS: Best Use of ENSv2, $3k/$2k/$1k/$1k (sponsors/ethglobal-ens.md L36 + qualification)
Prize text names: "hierarchical registry structure … resolve subnames straight off a parent's resolver with wildcard resolution, or deploy your own subname registry to tokenize and manage subnames under your own rules. Use Enhanced Access Control … to delegate specific rights, like letting an account edit only certain text records on a name. Give subnames their own Permissioned Resolver so they fully own their data, mix in record aliasing at the resolver level or namespace aliasing via a shared registry, and combine it all to build subname setups: expiring, revocable, non-transferable vs. transferable, even forever names with no parent control. Bonus points if you bring AI agents into the mix. Think agents as namespaces, each with their own identity and permissions."
Qualification: "Project must be built on ENSv2 on Ethereum mainnet or Sepolia. ENSv2 features should be central to the product, not a cosmetic add-on. Your demo must be functional and not just include hard-coded values. Upon submission, your project showcase must have a link to a live demo and the code needs to be open source …"

### EF: Best CROPS App, $2k/$1k/$500 (sponsors/ethglobal-ef-crops.md L132–171)
Judging criteria: "works end to end in the demo" · "depth of the lead property: structural (works without you) beats cosmetic (a setting)" · "the other three still hold, or trade-offs are stated in the README" · "UX: would someone use it without knowing what CROPS means" · "could it ship after the hackathon".
Qualification: README "CROPS" section — "C: what you control that the user depends on (domain, server, RPC, relayer) and what happens if it goes away or refuses them · O: the license, and whether a user can build and run it from the repo alone · P: what each third party (your server, RPC provider, analytics, indexers) learns about the user · S: how keys and user data are protected, and the trust assumptions." · "A demo video (3 minutes max) that shows the lead property working end to end, including the moment it matters: for example you switch off your backend, swap the RPC provider, or show server logs with nothing identifying in them." · "No third-party trackers or analytics in the client." · "One EF prize per project."
EF idea list (verbatim) includes "a frontend that keeps working when its domain, backend or RPC provider disappears" and "a tool that proves the shipped frontend or extension matches the public repo".

## B. Constraints
| Constraint | Status |
| --- | --- |
| Android Chrome phones only; delivered 50–68 Hz | TESTED (2 phones) |
| Microphone and vibration motor usable from the PWA | TESTED (sound sync built; motor used as demo source) |
| No geophone; phone PPV 50–370 mm/s on close stomps is not calibrated | TESTED |
| Up to 3 partner picks; Arkiv (+Swarm bonus free), ENS, EF already chosen | TESTED (rules text) |
| Arkiv Rabdi max entity lifetime ~182.5 d; 128 KiB bytes; 100 rows/page | TESTED (docs + friction log) |
| Swarm public gateway serves JSON but blocks HTML sites until approved | TESTED |
| bzz.link ENS hosting needs a mainnet ENS name | ASSUMED from friction S3; worker must test before it prunes anything |
| A mainnet ENS name is acceptable only if justified (real money) | ASSUMED |
| Safe as ENS role-holder works with ENSv2 EAC | ASSUMED (designed, not exercised) |
| A server in the read/verify path breaks the CROPS claim | TESTED (EF text: "structural (works without you)") |
| Phones' clocks drift by seconds without sync | TESTED |
| Waveform coherence cannot yet detect collusion | TESTED (EXP-0001) |
| Judges will have Android phones to join | ASSUMED |
| Anon-RPC usable from a browser for Arkiv/Sepolia reads | ASSUMED; must be tested before it is ranked |

## C. Scope rule
In scope: features, mechanisms, integrations, evidence, demo moments, materials for the existing product. Out of scope: a different product; generic AI chat; token/speculation mechanics; crowded patterns as a headline (2026-11-05 01-commitments.md §C). Anything that makes our server load-bearing for reading or verifying is rejected.

## D. Config note
DIVERGE buys originality at a usefulness cost (single-pass baseline beat it on usefulness 2.8 vs 3.4). Practicality and Usability are scored, and the brief demands sponsor fit, so a hard CONVERGE pass is planned now: ground each top feature against verbatim sponsor text, against the live code, and against the demo clock of 4 minutes (a demo-length constraint, which is a product property, not the build clock).
Selection order: rubric + sponsor fit → demo-moment strength → impact evidence → crowding.

## E. DIVERGE composition (altitude-diverse + free; one browser user)
| Worker | Frame | Owns | Browser? |
| --- | --- | --- | --- |
| D1 | free generator | unconstrained features for this product | no |
| D2 | in-solution mechanism: Arkiv + Swarm stacks | unused primitives (subscriptions, batch, ownership transfer, extend, node tooling; feeds, ACT, SOC, postage, encryption) | no (WebFetch, GitHub, npm, curl probes) |
| D3 | in-solution mechanism: ENSv2 + EF tooling + other sponsors | wildcard/permissioned resolver, EAC, aliasing, contenthash, expiry/renew; anon-rpc, frame tx, walkaway; 0G/Chainlink/Hedera/World/etc. load-bearing check | no (WebFetch, GitHub, curl, TinyFish fetch) |
| D4 | distant analogy | mechanisms from far domains (ingredients, not answers) | no |
| D5 | narrow-scope + question-the-goal | one extreme user; Indian legal/regulatory route of the record; accessibility (Marathi/Hindi, low-end phones) | no |
| D6 | behavioral/informational (toward judges) | judge psychology, past finalist demos, video + form, Q&A attacks, partner judging from materials | **yes (only one)** |
