# Shared context for DIVERGE workers (read-only input, written by the orchestrator)

## The event
ETHGlobal Mumbai 2026 (Devcon week): a hackathon with about 250–600 projects. Team of 3, **From Scratch** track.
- **Finalist judging:** a 4-minute LIVE demo plus 3 minutes of questions, from a panel screening about 25 teams in 3 hours. Rubric, verbatim, with no weights: **"Technicality, Originality, Practicality, Usability (UI, UX, DX), WOW factor"**. Judges ask: what inspired it, which tools and why, what challenges it solved. The finalist gate needs a **live deployment anyone can open by link**, a public repo and a demo video.
- **Sponsor prizes** are judged from the write-up and video in under 2 minutes each. A team may pick **at most 3 sponsors**, and **at most 1 Ethereum Foundation prize**. Sponsors reward the **deepest use of their newest, most specific feature**. Stacking sponsors only works when the sponsors genuinely depend on each other in the design.
- **What wins now:** "a Level 2 product with one Level 3 component". That means an end-to-end working product with ONE part that is hard, real and proven, plus a number the team measured themselves. Integration-only apps win nothing in 2026, because AI writes the glue. 5 of 16 recent finalists had a physical or real-world element. Each winner states its problem in one plain sentence.

## The team
- **Dhruv:** full-stack, smart contracts, product/design; **RF/radar signal-processing researcher**, ML/data, energy systems (grid flexibility); deep Solana/Anchor; trust-and-safety and adversarial-testing mindset (636 tests, attack search). Won a robot-fleet trust-and-safety track before.
- **Akhilesh:** full-stack.
- **Somnath:** generalist.
- **Hardware: none except Android phones.** A phone offers a camera, microphone/speaker (acoustic ranging and ultrasound), IMU (accelerometer/gyro/magnetometer), NFC (Android host card emulation), BLE, Wi-Fi RSSI, GPS, a vibration motor, a light sensor and a flashlight. Based in India; Mumbai context (UPI, local trains, monsoon, kirana shops, Diwali week).

## Sponsor menu (summaries from the team's notes; treat details as unverified)
| Sponsor | From Scratch tracks (pool) | Newest/specific feature they push |
|---|---|---|
| Ethereum Foundation | Best Use of **Anon-RPC** ($5k); Best Use of the **Frame Transaction Alternative Mempool** ($5k); Best **CROPS** App ($3.5k: censorship resistance, open source, privacy, security) | private RPC reads that hide who is asking; frame transactions (a new account-abstraction tx type) and an alternative mempool; apps that structurally survive censorship and vendor disappearance |
| Arkiv | Mirror something Ethereum depends on ($4k); Build on Arkiv ($4k); Node tooling ($2k); +Swarm bonus. All Arkiv = one pick | a queryable data chain: entities with attributes and **expiry (TTL)**, query by attribute; judged partly on schema.md / friction.md / reach.md / why-arkiv.md / data-quality.md |
| ENS | Best Use of **ENSv2** ($7k) | ENSv2: per-name registries/hierarchy, **access-control roles (EAC)**, permissioned and wildcard resolvers; must be central, live, no hard-coded values |
| 0G | Build with 0G PC (consumer app, $5k); **Physical AI: Agents with a Body** ($5k incl. a best-real-hardware prize; "robot, drone, wearable or **pocket device**"; simulated allowed; rejects "chatbot with a robot avatar, pre-recorded motion, 0G used only for logs"; wants a **safe stop** if 0G is unreachable and no faked decisions); Agents That Pay for Themselves ($2k) | decentralized AI compute/inference in the decision loop |
| Uniswap | Build with Uniswap ($10k: $4k/$3k/$2k/$1k) | v4 hooks, the Trading API |
| Whitechain (+Optimism) | Stablecoin Payments for Business ($5k); Tokenize Real-World Finance ($4k); **Payments Nobody Notices** (no gas for the payer, $3k) | USDT payments with zero crypto steps for the user; merchant + customer views; refunds/renewals/accounting |
| World | **World ID Agent Pass** ($5k): "a meaningful action that needs a human identity or approval layer, not simply a login screen"; must show request → completion → validated → protected action, plus a denied/expired path; IDKit ($2.5k) | proof of a unique human approving an action |
| Hedera | AI agents that pay with x402 ($6.5k); Tokenize anything with Hedera Studios ($5k); No-Solidity SDK builds ($2k) | x402, HTS tokenization |
| Arc (Circle) | five $3k tracks, all must start in Arc Studio: DeFi app; mobile consumer agent using the Marketplace Discovery API; advanced stablecoin contracts; Bridge Kit for non-USDC assets | USDC-native chain, Arc Studio |
| 1inch | Build an Aqua App ($5k), custom SwapVM opcodes allowed | shared liquidity (Aqua), a programmable swap VM |
| Definitive | Flash advanced orders in a social app ($2.5k); most creative use of Flash ($2.5k) | limit/stop/TWAP advanced orders API |
| Chainlink | CCIP 2.0 ($3.5k, must change state cross-chain); best CRE workflow ($1.5k) | CRE (Chainlink Runtime Environment) workflows |

## OFF THE TABLE as the headline (crowded in earlier winners; may appear only as a supporting feature)
Agent spending caps / allowlists / expiry / revoke / budget trees · x402 pay-per-call tool or data marketplaces for agents · agent identity / legal wrappers / guardians / "route only what needs a human" · LP automation, copy-LP, dynamic-fee or anti-arbitrage hooks, delta-neutral LP · ENS-branded stablecoin checkout/invoices, onchain refunds · generic integration apps · calendar-as-wallet · AI copy trading · Bluetooth-mesh offline transactions · NFC event payments / tap-to-pay · UPI crypto ramps · medicine kiosks with verified prescriptions · Uniswap hooks giving humans lower fees · AI shopping agents for non-crypto families · phone checking a shop's QR before paying (UPI already shows the payee) · RPC-read privacy leak meters (already a team candidate) · checkout that survives merchant disappearance (already a team candidate) · pay-only-during-verified-machine-use rental (already a team candidate) · one-click hedging for LPs (already a team candidate).
Already done by finalists, so avoid copying: a hook-fee measurement study (TARE), two-phone acoustic proximity proof (Enconomy), radio through the mempool, a hardware wallet that refuses what it cannot display, fractional collectible cards in an auction, prediction-market parlays.
