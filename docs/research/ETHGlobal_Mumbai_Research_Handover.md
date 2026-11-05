# ETHGlobal Mumbai 2026: Research Handover

Nov 5, 2026 · @dhruv mulay

## Start here

Dhruv's team is confirmed for ETHGlobal Mumbai, and submissions close Saturday, November 7, 2026 at 9:00 AM IST. The main research finding is that capped spending for AI agents, the team's earlier idea, is already crowded, so it needs a sharper angle.

This document hands over everything gathered so far. The next Claude should use it to pick and pressure-test an idea, then plan the build around the finalist requirements.

**How far to trust it**

| Level | Applies to | Basis |
| --- | --- | --- |
| High | Mumbai rules, schedule, sponsor pools, finalist email | Read directly from the ETHGlobal site and the email |
| High | Winner lists and prize labels | Read from each project page's prize data |
| Medium | Project summaries | First part of each description and build notes only |
| Low | Reasons projects won | Inference from winners only, with no comparison against losers |

**Known gaps**

- No winner's code or demo video was reviewed. Project summaries come from excerpts.
- Only 3 events were scanned: ETHOnline 2026, Tokyo 2026 and New Delhi 2025. Open Agents and Agentic Ethereum, the agent-focused events, were not.
- 30 of the 176 winning projects were read. They were chosen for finalist status or agent relevance, so the sample leans toward agents.
- New Delhi had 1 failed page out of 614, so a winner could be missing. The Tokyo scan did not log failures, and the final failure count for ETHOnline was not captured.
- Dashboard state was last read on October 27 and may have changed. Re-check it before relying on it.
- No idea has been chosen. Nothing in this document is a team decision unless it says so.

**Corrections to earlier chat answers.** This document overrides them.

- ETHOnline partner counts were wrong in chat: Hedera has 10 winners (not 9), ENS 5 (not 6) and 1inch 5 (not 6).
- Tokyo's ENS count was wrong in chat: it has 6 winners (not 7).
- "About 10 finalist teams" at Mumbai was an unconfirmed estimate. Past counts found are 8 at ETHOnline 2026 and 10 at New Delhi 2025.
- The chat's "1×" label on some sponsor tracks was an assumption. The page gives no split for those tracks.

## Team and account status

The team has 3 members, which puts it in the top finalist prize tier.

| Person | Role listed on ETHGlobal |
| --- | --- |
| Dhruv Mulay | Backend, frontend, fullstack, product, design, smart contracts, other |
| Akhilesh Nawale | Fullstack developer |
| Somnath Ghadge | Other |

**ETHGlobal Mumbai status, as last read on October 27**

- Fully confirmed to attend. The ticket was due by email about a week before the event.
- Discord (`mulaydm10`) connected and Hacker Pack claimed. Builder and Pioneer Packs were offered as free mints.
- Track **not yet selected**. All teammates must be on the same track.
- Mumbai project **not yet created**. Partner prize selection opens with submissions.
- Pragma Mumbai appeared under open applications. Whether Dhruv applied or bought a ticket is unknown.

**Past event: ETHOnline 2026 (September 4–16)**

- Project: Capability Descent, category Infrastructure.
- Pitch: "Capped, revocable spending authority for AI agents: real HBAR settles, over-budget is refused."
- Applied for Hedera and ENS. It is not among the 63 winners.
- The project page shows an error fetching `github.com/Mulaydm10/ehl-switzerland-hackathon`. The repo may be private, renamed or deleted, and its name suggests it may be the wrong repo. This has not been investigated.
- Under Mumbai's rules, a repo in that state would block finalist judging.

## Mumbai rules and schedule

To be judged as a finalist, a project needs a live deployment, a compliant demo video, a complete form and a public repo. If the email and the site differ, follow the email: it is newer and stricter.

**Event basics**

- ETHGlobal Mumbai runs November 5–7, 2026, as part of Devcon Week.
- Venue: Jio World Convention Centre, Jio World Centre, G Block, Bandra Kurla Complex, Bandra East, Mumbai 400098.
- The site advertises 800+ attendees, 11+ protocols, 29+ workshops and $175,000 in prizes.

**Key times (IST)**

| Date | Time | Item |
| --- | --- | --- |
| Thu, Nov 5 | 8:00 PM | Welcome and opening ceremonies |
| Thu, Nov 5 | 9:30 PM | Team formation and idea brainstorming |
| Sat, Nov 7 | 9:00 AM | **Project submissions due; late entries are not accepted** |
| Sat, Nov 7 | 9:30 AM | Partner prize judging and main finalist judging start |
| Sat, Nov 7 | 3:15 PM | Finalists notified |
| Sat, Nov 7 | 3:30 PM | Closing ceremonies |

Main finalist judging is scheduled for 180 minutes in the Live Judging Rooms. Partner judging is listed at Partner Booths.

**Finalist email.** Pascal at ETHGlobal sent "ETHGlobal Mumbai Finalist Prize Updates!" on October 31, 2026.

| Team size | Prize per person | Travel reimbursement per person |
| --- | --- | --- |
| Solo | 250 USDC | None |
| 2 people | 250 USDC | 250 USDC |
| 3–5 people | 1,000 USDC | 500 USDC |

Travel money applies to one in-person ETHGlobal hackathon within 365 days. For this team, a finalist place means 3,000 USDC in prizes and 1,500 USDC in travel reimbursement in total.

**Finalist requirements (all four are mandatory)**

1. Live deployment accessible to anyone with the link. A video, slide deck or similar link does not qualify.
2. Demo video on the project page: 2–4 minutes, at least 720p, audio without music.
3. Every required field in the submission form completed.
4. Public GitHub repository.

ETHGlobal says it will run secondary eligibility checks in the judging line.

**Email compared with the website, as checked on October 31**

| Point | Email | Website | Status |
| --- | --- | --- | --- |
| USDC tiers and travel money | Stated | Not found on the dashboard, event, prizes or rules pages | Email only |
| Demo video | Required for finalists | "Optional", strongly encouraged | Conflict; follow the email |
| Live deployment | Required | Not mentioned | Email only |
| Public repo | Required | A GitHub repo or equivalent is required; the current-event rules do not say public | Email is stricter |
| Video 2–4 min, 720p | Required | Same; uploads outside the limits fail | Confirmed |
| No music | Audio without music | Bans music with text in place of talking | Broadly consistent |
| Team session, Nov 5, 9:30 PM | Stated | In the schedule | Confirmed |

**Rules from the Mumbai rules page**

- **Partner prizes:** select up to 3 on the last submission step. All tracks from one partner count as 1 pick.
- **Partner judging:** based on submitted materials. Visiting a booth is optional.
- **Each partner prize:** explain how you integrated the tool, and give feedback and comments.
- **Submission options:** "Finalist and Partner Prizes" requires presenting to judges. "Partner Prizes Only" does not.
- **From Scratch track:** all project work must begin after the start. Earlier project code, designs or assets are not allowed, except public libraries and starter kits. Earlier work can still take part, but cannot win partner prizes or finalist.
- **Continuity tracks (Extend Open Source, Ship a Feature):** clearly document earlier work and include new features built at the event. Partner eligibility may vary.
- **Version control:** large single commits or missing history may lead to disqualification.
- **AI tools:** allowed, but document where and how they were used. Projects relying entirely on AI may lose eligibility.
- **Spec-driven workflows:** include all spec files, prompts and planning artifacts in the repo.
- **Video bans:** no speeding up, no phone recording, no text-to-speech or AI voiceover.

**Judging**

- Each finalist session lasts 7 minutes: a 4-minute demo, then 3 minutes of questions.
- Criteria: technicality, originality, practicality, usability (UI, UX, DX) and WOW factor.
- Prepare for: what inspired the project, which tools and why, and what challenges it solved.

**Pragma Mumbai, November 6, same venue**

- 09:30–18:00 IST. Kartik Talwar, ETHGlobal co-founder, is the only speaker listed.
- Hacker ticket $49 for confirmed Mumbai attendees, Network Pass $29 without lunch, General $69.
- It falls on hackathon day 2, so attending costs build time.

## Mumbai sponsor tracks

The 12 sponsors offer 41 tracks, and their pools add up to the advertised $175,000. Pools are sponsor totals split across tracks and places, so one win is usually $1,000–$3,000 per team.

You qualify only for tracks matching your chosen track. "Scratch" means From Scratch and "Continuity" means existing work. "Not stated" means no split was found on the page.

| Sponsor (total) | Track | Pool | Split | Eligibility |
| --- | --- | --- | --- | --- |
| World ($12,500) | World ID Agent Pass | $5,000 | $2,500 / $1,500 / $1,000 | Scratch |
| World | World ID Agent Pass (Continuity) | $2,500 | $1,500 / $1,000 | Continuity |
| World | Best Use of IDKit | $2,500 | Up to 2 teams at $1,250 | Scratch |
| World | \[Cont\] Best IDKit Use Case | $2,500 | Up to 2 teams at $1,250 | Continuity |
| 1inch ($7,000) | Build an Aqua App | $5,000 | $2,500 / $1,500 / $1,000 | Scratch |
| 1inch | Build an Aqua App, Continuity | $2,000 | $1,500 / $500 | Continuity |
| 0G ($15,000) | Build with 0G PC | $5,000 | $2,500 / $1,500 / $1,000 (site shows the typo "$1,0000") | Scratch |
| 0G | Physical AI: Agents with a Body | $5,000 | $2,500 / $1,500 / remainder not captured | Scratch |
| 0G | Keep Building on 0G | $3,000 | Up to 2 teams at $1,500 | Continuity |
| 0G | Agents That Pay for Themselves | $2,000 | Up to 2 teams at $1,000 | Scratch |
| Uniswap Foundation ($15,000) | Build with Uniswap | $10,000 | $4,000 / $3,000 / $2,000 / $1,000 | Scratch |
| Uniswap Foundation | Build with Uniswap, Continuity | $5,000 | 4 prizes at $1,250 | Continuity |
| Arc ($15,000) | Best DeFi / Onchain Finance App Built End to End in Arc Studio | $3,000 | Not stated | Scratch |
| Arc | Best Mobile Web Consumer Agent Using the Marketplace Discovery API | $3,000 | Not stated | Scratch |
| Arc | Best Smart Contracts with Advanced Stablecoin Logic, in Arc Studio | $3,000 | Not stated | Scratch |
| Arc | Best Use of Bridge Kit for Non-USDC Assets, in Arc Studio | $3,000 | Not stated | Scratch |
| Arc | Arc Studio Continuity Track: Bring Your Project to Arc | $3,000 | Not stated | Continuity |
| Hedera ($15,000) | AI Agents That Pay: x402 on Hedera | $6,500 | $3,000 / $2,000 / $1,500 | Scratch |
| Hedera | Tokenize Anything with Hedera Studios | $5,000 | $2,500 / $1,500 / $1,000 | Scratch |
| Hedera | "No Solidity Allowed": Build with Hedera SDKs | $2,000 | Up to 2 teams at $1,000 | Scratch |
| Hedera | Built on Hedera (Continuity Track) | $1,500 | Up to 2 teams at $750 | Continuity |
| Arkiv ($15,000) | Mirror something Ethereum depends on | $4,000 | $3,000 / $1,000 | Scratch |
| Arkiv | Build on Arkiv (from scratch) | $4,000 | $3,000 / $1,000 | Scratch |
| Arkiv | Build on Arkiv (existing projects) | $4,000 | $3,000 / $1,000 | Continuity |
| Arkiv | Node tooling | $2,000 | Not stated | Scratch |
| Arkiv | Arkiv + Swarm bonus (from scratch) | $500 | Not stated | Scratch |
| Arkiv | Arkiv + Swarm bonus (existing projects) | $500 | Not stated | Continuity |
| Whitechain, with Optimism ($15,000) | Operate: Stablecoin Payments for Business | $5,000 | $2,500 / $1,500 / $1,000 | Scratch |
| Whitechain | Tokenize: Real World Finance on Whitechain | $4,000 | $2,500 / $1,500 | Scratch |
| Whitechain | Scale: Payments Nobody Notices | $3,000 | $2,000 / $1,000 | Scratch |
| Whitechain | Continuity: Bring Your Product to Whitechain | $3,000 | $1,500 / $1,500 | Continuity |
| Ethereum Foundation ($15,000) | Best Use of Anon-RPC | $5,000 | $2,500 / $1,500 / $1,000 | Scratch |
| Ethereum Foundation | Best Use of the Frame Transaction Alternative Mempool | $5,000 | $2,500 / $1,500 / $1,000 | Scratch |
| Ethereum Foundation | Best CROPS App | $3,500 | $2,000 / $1,000 / $500 | Scratch |
| Ethereum Foundation | Best CROPS Upgrade to an Existing Project | $1,500 | Not stated | Continuity |
| ENS ($10,000) | Best Use of ENSv2 | $7,000 | $3,000 / $2,000 / $1,000 / $1,000 | Scratch |
| ENS | Best Integration of ENSv2 into an Existing Project | $3,000 | $2,000 / $1,000 | Continuity |
| Definitive ($5,000) | Best Use of Flash Advanced Orders in a Social App | $2,500 | Not stated | Scratch |
| Definitive | Most Creative Use of Definitive Flash Advanced Orders | $2,500 | Not stated | Unclear; verify |
| Chainlink ($5,000) | Best Use of Chainlink CCIP 2.0 | $3,500 | Up to 2 teams at $1,750 | Scratch |
| Chainlink | Best Workflow with CRE | $1,500 | Not stated | Scratch |

Eligibility and splits were extracted by script from one long page. Check the [prizes page](https://ethglobal.com/events/mumbai/prizes) for any track you commit to, including its qualification requirements.

**World ID Agent Pass requirements, read in full.** Other tracks' requirements were not reviewed.

- Integrate the official World ID Agent Pass, and show the full journey: request, user completion, validated result, then the protected action.
- Show a denied, expired or cancelled path where the protected action does not occur.
- Validate results in a secure backend, and do not expose client secrets.
- Include a short integration debrief: time to first success, friction, gaps and the top improvement.

**Tracks closest to an agent-payments idea (From Scratch):** Hedera AI Agents That Pay, World ID Agent Pass, 0G Agents That Pay for Themselves, Whitechain Payments Nobody Notices, and Arc Mobile Web Consumer Agent. With 3 sponsor picks, not all five can be selected.

## ETHGlobal event timeline

Mumbai is the only hackathon listed as upcoming, and ETHConf 2027 is the only other new event. The events page lists 337 past events, and this table leaves out meetups and co-working days.

**Scan status:** Scanned means winners were extracted. Everything else is unscanned.

| Dates | Event | Format | Scan status |
| --- | --- | --- | --- |
| Jun 14–16, 2027 | ETHConf 2027, New York City | Conference | Upcoming |
| Nov 6, 2026 | Pragma Mumbai | Conference | Upcoming |
| Nov 5–7, 2026 | ETHGlobal Mumbai | In person | Target event |
| Oct 19, 2026 | Ethereum Stablecoin Summit at Money20/20, Las Vegas | Conference | Not applicable |
| Sep 26, 2026 | Pragma Tokyo 2026 | Conference | Not applicable |
| Sep 25–27, 2026 | ETHGlobal Tokyo 2026 | In person | Scanned |
| Sep 4–16, 2026 | ETHOnline 2026 | Online | Scanned |
| Jul 25, 2026 | Pragma Lisbon 2026 | Conference | Not applicable |
| Jul 24–26, 2026 | ETHGlobal Lisbon 2026 | In person | Unscanned |
| Jun 12–14, 2026 | ETHGlobal New York 2026 | In person | Unscanned |
| Jun 8–10, 2026 | ETHConf, New York City | Conference | Not applicable |
| Apr 24–May 6, 2026 | Open Agents | Online | Unscanned; high value |
| Apr 3–5, 2026 | ETHGlobal Cannes 2026 | In person | Unscanned |
| Apr 2, 2026 | Pragma Cannes 2026 | Conference | Not applicable |
| Jan 30–Feb 11, 2026 | Online DeFi hackathon (listed by tagline only) | Online | Unscanned |
| Nov 21–23, 2025 | ETHGlobal Buenos Aires | In person | Unscanned |
| Oct 10–31, 2025 | ETHOnline 2025 | Online | Unscanned |
| Sep 26–28, 2025 | ETHGlobal New Delhi | In person | Scanned |
| Aug 15–17, 2025 | ETHGlobal New York 2025 | In person | Unscanned |
| Jul 25–Aug 8, 2025 | "Think beyond limits: shape boundless Web3" (tagline only) | Online | Unscanned |
| Jul 4–6, 2025 | ETHGlobal Cannes | In person | Unscanned |
| May 30–Jun 1, 2025 | ETHGlobal Prague | In person | Unscanned |
| Apr 4–6, 2025 | ETHGlobal Taipei | In person | Unscanned |
| Mar 20–26, 2025 | "ETHGlobal's First Competition" (tagline only) | Online | Unscanned |
| Jan 31–Feb 14, 2025 | Agentic Ethereum | Online | Unscanned; high value |
| Nov 15–17, 2024 | ETHGlobal Bangkok | In person | Unscanned |
| Oct 18–20, 2024 | ETHGlobal San Francisco | In person | Unscanned |
| Sep 20–22, 2024 | ETHGlobal Singapore | In person | Unscanned |
| Aug 23–Sep 13, 2024 | ETHOnline 2024 | Online | Unscanned |
| Aug 2–16, 2024 | Superhack 2024 | Online | Unscanned |
| Jul 12–14, 2024 | ETHGlobal Brussels | In person | Unscanned |
| Jun 13–26, 2024 | StarkHack | Online | Unscanned |
| May 17–Jun 7, 2024 | HackFS 2024 | Online | Unscanned |
| May 3–5, 2024 | ETHGlobal Sydney | In person | Unscanned |
| Apr 5–26, 2024 | Scaling Ethereum 2024 | Online | Unscanned |
| Mar 22–24, 2024 | Frameworks | Online | Unscanned |
| Mar 15–17, 2024 | ETHGlobal London | In person | Unscanned |
| Feb 2–21, 2024 | Circuit Breaker | Online | Unscanned |
| Jan 12–24, 2024 | LFGHO | Online | Unscanned |

**Earlier events**

- **2023 in person:** ETHGlobal Tokyo, Lisbon, Waterloo, Paris, New York, Istanbul, and ETHIndia in Bengaluru.
- **2023 online:** FVM Space Warp, Scaling Ethereum, Autonomous Worlds, HackFS, Superhack, ETHOnline.
- **2022:** ETHAmsterdam, ETHNewYork, Mexico City, ETHBogotá, ETHSanFrancisco, and Bengaluru's "Asia's Biggest Ethereum Hackathon".
- **2017–2020:** events include ETHWaterloo, ETHSanFrancisco, ETHSingapore, ETHParis, ETHCapeTown, ETHNewYork, ETHBoston and ETHLondonUK.

Showcase filter slugs known to work: `ethonline2026`, `tokyo2026`, `newdelhi`. Slugs for other events have not been tested.

## Winners across three events

Of 1,680 projects scanned, 176 won at least one award, and 28 won more than one. Each project's page carries a `prizes` field, which is empty for non-winners.

| Event | Projects | Winning projects | Finalists | Projects with 2+ awards | Total awards |
| --- | --- | --- | --- | --- | --- |
| ETHOnline 2026 | 812 | 63 (7.8%) | 8 | 6 | 70 |
| ETHGlobal Tokyo 2026 | 254 | 25 (9.8%) | None in data | 7 | 32 |
| ETHGlobal New Delhi 2025 | 614 | 88 (14.3%) | 10 | 15 | 104 |

No project at any of these events won three partner prizes in this data. The most awards was 3, including the finalist award: OpenBook and Autonome. Sponsors differ per event, so win rates do not transfer directly to Mumbai.

### Projects with more than one award

| Event | Project | Awards |
| --- | --- | --- |
| ETHOnline 2026 | OpenBook | Finalist; Arc Best Agentic Economy App with Circle Agent Stack; The Graph Composable Products 3rd |
| ETHOnline 2026 | Aqua0 | 1inch Aqua App Continuity 1st; The Graph AI Tooling Continuity 1st |
| ETHOnline 2026 | SoulVault | ENS ENSv2 into an Existing Project; Ledger Extend to Ledger 1st |
| ETHOnline 2026 | Turnstile | Hedera AI and Agentic Payments; The Graph AI Tooling From Scratch 2nd |
| ETHOnline 2026 | TARE | Finalist; Uniswap Best Stack Contribution |
| ETHOnline 2026 | Novi Corpus | Finalist; World AgentKit Continuity |
| Tokyo 2026 | Kagi Wallet | Intercepta Safe Agent-to-Agent Payments 1st; Curvegrid Best AI Agent |
| Tokyo 2026 | VexiHakari | 1inch Aqua App Continuity 1st; Uniswap Best Stack Contribution |
| Tokyo 2026 | UnSui | Sui DeFi, Payments, Agents 1st; Curvegrid Best Digital Asset Dashboard |
| Tokyo 2026 | Kura | Uniswap Best Stack Contribution 1st; ENS Best Use of ENSv2 3rd |
| Tokyo 2026 | Lortnoc Tahc | ENS ENSv2 into an Existing Project 2nd; World Continuity IDKit |
| Tokyo 2026 | XSwap | Uniswap Best Stack Contribution 2nd; Intercepta Payment Screening |
| Tokyo 2026 | Lifeline | Sui DeFi, Payments, Agents 3rd; World ID for Agents |
| New Delhi 2025 | Autonome | Finalist; Polygon x402 Agentic Payments 1st; The Graph Hypergraph 2nd |
| New Delhi 2025 | NoNet | Finalist; Hedera EVM 1st |
| New Delhi 2025 | calendefi | Finalist; ENS Most Creative 3rd |
| New Delhi 2025 | UniPerp | Finalist; Uniswap v4 Hooks 2nd |
| New Delhi 2025 | ad-402 | Finalist; Polygon x402 5th |
| New Delhi 2025 | Dhal Way | Hedera Overall Winner; Flow Killer App 1st |
| New Delhi 2025 | Hide&Seek | 1inch Non-EVM Fusion+ 2nd; The Graph Token API 1st |
| New Delhi 2025 | Cross Chain NS | Walrus 1st; ENS Most Creative 3rd |
| New Delhi 2025 | ECHONET | The Graph Hypergraph 1st; ASI Alliance 4th |
| New Delhi 2025 | SecGit | ASI Alliance 1st; 0G Onchain AI 5th |
| New Delhi 2025 | BrandX | ASI Alliance 2nd; Kadena dApp or Integration |
| New Delhi 2025 | EthOs ID | ENS Most Creative 2nd; Self Onchain SDK 3rd |
| New Delhi 2025 | FitterCoin | Self Onchain SDK 2nd; Citrea Open Innovation |
| New Delhi 2025 | MoFo | ASI Alliance 3rd; World Best Mini App |
| New Delhi 2025 | ZKred Agent ID | Hedera AI 2nd; Polygon x402 4th |

### ETHOnline 2026 winners

**Finalists (8):** OpenBook, TARE, Novi Corpus, ETH Arcade, Cordon, Petri, OnchainRouter, LeekDIYHardwareWallet.

| Sponsor | Track | Winners (place where listed) |
| --- | --- | --- |
| Hedera (10) | AI and Agentic Payments | Turnstile, Carpool, AutoVoyage |
| Hedera | Tokenization of Anything | Facture, NameGate, Rialto |
| Hedera | Open Source: Improve the Hedera Harness | Scenario Engine, Hanvil |
| Hedera | Built on Hedera, Continuity | Aivy Quorum, YourTurn 2.0 |
| The Graph (9) | Composable or Standardized Products | Alpha Markets 1st, Sentinel 2nd, OpenBook 3rd |
| The Graph | AI Tooling, From Scratch | Covenant 1st, Turnstile 2nd, TrueTick 3rd, presign 3rd |
| The Graph | AI Tooling, Continuity | Aqua0 1st, Hermes v2 2nd |
| Bazantic (8) | Agentify a New API | Margit 1st, LATCH 2nd, Legwork 3rd |
| Bazantic | Best Recipe Using Sponsor APIs | NotYet 1st, Mandate-app 2nd, Assay 3rd |
| Bazantic | Help an Agent Use Your Project | LedgerMind, payOrRefuse |
| World (6) | AgentKit Continuity | Novi Corpus, hors-luma, Maneki |
| World | Selfie Check | Automator, Creance, ArcAsset |
| ENS (5) | Best Use of ENSv2 | Herit 1st, Batas 2nd, Verdict.eth 3rd, Capsule runner-up |
| ENS | ENSv2 into an Existing Project | SoulVault |
| 1inch (5) | Build an Aqua App | Solvent 1st, coldcascade 2nd, Superposition 3rd |
| 1inch | Aqua App, Continuity | Aqua0 1st, Smile 2nd |
| Ledger (5) | AI Agents x Ledger | Harness 1st, GhostKey 2nd, ITHACA 3rd |
| Ledger | Extend to Ledger | SoulVault 1st, Preflight MCP 2nd |
| Uniswap (5) | Best Stack Contribution, placed | lpTOKEN.fun 1st, Priime 2nd |
| Uniswap | Best Stack Contribution, no place listed | TARE, Otter, ClosingBell-Hook |
| Chainlink (4) | Best Confidential Workflow | Sovereign, Deflow |
| Chainlink | Best Chainlink-Powered Upgrade | Karwan |
| Chainlink | Automated Liquidation Protection Challenge | AquaGhost Protocol |
| Arc (3) | Agentic Economy with Circle Agent Stack | OpenBook |
| Arc | Best DeFi or Agentic Application | ACR |
| Arc | Best DeFi/Onchain Finance Application | T-REX Capital Market |
| Privy (2) | Best Financial Flow | Sweem |
| Privy | Best B2B Financial Product | PayGate |

### ETHGlobal Tokyo 2026 winners

The scan found no finalist awards. Whether Tokyo had none or simply did not record them this way is unknown.

| Sponsor | Track | Winners (place where listed) |
| --- | --- | --- |
| ENS (6) | Best Use of ENSv2 | Relay 1st, ENS Drive 2nd, Tide 3rd, Kura 3rd |
| ENS | ENSv2 into an Existing Project | Radius 1st, Lortnoc Tahc 2nd |
| Uniswap (6) | Best Stack Contribution | Kura 1st, XSwap 2nd, Bailiff 2nd, OniBlock 3rd, Reckn 3rd, VexiHakari (no place listed) |
| World (6) | World ID for Agents | Surety, Airlock, Lifeline |
| World | Best Use of IDKit | Placed, Pupille |
| World | \[Cont\] Best IDKit Use Case | Lortnoc Tahc |
| 1inch (5) | Build an Aqua App | OddsFlow 1st, Wamia 2nd, watermark 3rd |
| 1inch | Aqua App, Continuity | VexiHakari 1st, Takarabako 2nd |
| Curvegrid (3) | AI Agent; RWA Tokenization; Digital Asset Dashboard | Kagi Wallet; DayTrader; UnSui |
| Intercepta (3) | Safe Agent-to-Agent Payments with x402 | Kagi Wallet 1st, x402 Guard 2nd |
| Intercepta | Payment Screening | XSwap |
| Sui (3) | DeFi, Payments, Agents | UnSui 1st, AntiScalper Protocol 2nd, Lifeline 3rd |

### ETHGlobal New Delhi 2025 winners

**Finalists (10):** calendefi, KagamiAI, NoNet, Autonome, UniPerp, Nox, MemeWarp, ad-402, Dike, Igris AI.

| Sponsor | Track | Winners (place where listed) |
| --- | --- | --- |
| 1inch (9) | Extend Limit Order Protocol | DeFiDuck 1st, CrossYield 2nd, Tzunami 3rd |
| 1inch | Non-EVM Fusion+ Extensions | Melswap 1st, Hide&Seek 2nd, fusion 3rd |
| 1inch | Utilize 1inch APIs | d8n, Singularity, Nakal |
| Polygon (5) | x402 Agentic Payments | Autonome 1st, Director.AI 2nd, Instant 3rd, ZKred Agent ID 4th, ad-402 5th |
| Hedera (5) | Overall Winner | Dhal Way |
| Hedera | EVM Smart Contracts and Cross-Chain | NoNet 1st, All Weather Finance 2nd |
| Hedera | AI on Hedera | YieldCraft AI 1st, ZKred Agent ID 2nd |
| ASI Alliance (5) | Best Use | SecGit 1st, BrandX 2nd, MoFo 3rd, ECHONET 4th, CareCrypt 5th |
| 0G (5) | Onchain AI dApps | Whale.fun 1st, nebula-sdk 2nd, Melon 3rd, WEAVE 4th, SecGit 5th |
| Uniswap (5) | v4 Hooks | BondZero 1st, UniPerp 2nd, MEVengers 2nd, DepegSentinel 3rd, Qlick 3rd |
| ENS (5) | Most Creative Use | Opensource Orchestra 1st, EthOs ID 2nd, calendefi 3rd, Cross Chain NS 3rd, PAYANY.LINK 3rd |
| The Graph (5) | Token API, Substreams or AI MCPs | Hide&Seek 1st, Robin Hood DAO 2nd |
| The Graph | Hypergraph | ECHONET 1st, Autonome 2nd |
| The Graph | GRC-20-ts | AutomationX |
| Flow (5) | Killer App | Dhal Way 1st, PyPI 2nd, OffGrid Pay 3rd |
| Flow | Automation and Actions | Arcane:COE, Eternal Flow (runner-up) |
| Filecoin (5) | Filecoin Track | FileThetic 1st, Stream Verse 2nd, WhaleEye 3rd |
| Filecoin | Akave; Lighthouse Data DAOs | P2P-Fed-Learning; MYRAD |
| Pyth (5) | Pull Oracle | Oryn Finance 1st, Delta Zero Hook 2nd, Judge me if you can 3rd |
| Pyth | Entropy Pool Prize | APT-Casino, Karam |
| Rootstock (5) | Freestyle; Everyday DeFi; RIF Economy | J.A.R.V.I.S AI, zk-btc-sdk; zattak, Monte Carlo; BlockBundlr |
| World (5) | Best Mini App | FlashArb 1st, ShieldRamp 2nd, MoFo, GhostLink and WorldBNB (honorable mentions for the last two) |
| Self (4) | Onchain SDK | GlobalX.money 1st, FitterCoin 2nd, EthOs ID 3rd |
| Self | Offchain SDK | Eth Connect |
| Citrea (4) | Open Innovation | T-Rex Protocol 1st, FitterCoin |
| Citrea | DeFi Bapps | Itô Protocol 1st, Super Defi 2nd |
| Ethereum Foundation (4) | General Privacy | zkETHer 1st, Wisk 2nd, ZeroSurf 3rd |
| Ethereum Foundation | Client-Side Privacy Infrastructure | AccessFi |
| PayPal (3) | PYUSD | Raven 1st, BURP 2nd, Wattwealth 3rd |
| Walrus (3) | Use or Tooling | Cross Chain NS 1st, AVENOX 2nd, SuiVerify 3rd |
| Fluence (3) | Virtual Servers | TensorNode 1st, SynapseModel 2nd, Flux 3rd |
| Kadena (3) | dApp; Multichain; RWA | BrandX; KROSS; AssetX |
| Integra (1) | Real Estate | Flashflow |

## What 30 winners built

23 of the 30 projects read list a live demo, including all 8 ETHOnline finalists but only 5 of 10 New Delhi finalists. Details below come from page excerpts, so stacks may be incomplete and project claims are unverified.

Full pages are at `https://ethglobal.com/showcase/<slug>`. Slugs are given for New Delhi; find the others through the event's showcase filter.

### ETHOnline 2026 finalists

| Project | What it does | Build details seen | Live demo |
| --- | --- | --- | --- |
| OpenBook | Addresses agents paying for stale data, with a market around data freshness | Solidity and Foundry; TypeScript seller, buyer CLI and MCP server on Bun; Graph subgraph; Circle wallets and x402 | Yes |
| TARE | Measures the undisclosed take of Uniswap v4 hooks; cites 1,559 hooks across 200,000 Base blocks | Python; Anvil fork of Base; swaps hook bytecode for an inert stub and compares quotes | Yes |
| Novi Corpus | Forms a Wyoming LLC for an AI agent, with a human guardian and an on-chain treasury enforcing spending rules | Solidity on Arc; Hono, SQLite and MCP server; Next.js; World ID guardians; ERC-8004 and ENS identity | Yes |
| Cordon | Enforces budgets across a tree of delegating agents; cites 63 reported overrun incidents | 3 Solidity contracts on Arc; ancestor debit; refusals published to ERC-8004 reputation; no admin key | Yes |
| Petri | Evolves AI agent harnesses and keeps only verified improvements | TypeScript engine and CLI; Next.js 16; SPEC.md written first as a binding contract | Yes |
| OnchainRouter | Catalogue of paid onchain tools for agents, paid per call | Next.js; MCP and HTTP; x402 v2 on Hedera and Arc; Graph subgraphs; no wallet held and no commission | Yes |
| ETH Arcade | Handheld console and SDK for games driven by live ETH price | Raspberry Pi; 3D-printed enclosure; knob and buttons; contracts and data pipeline | Yes |
| LeekDIYHardwareWallet | Low-cost open-source hardware wallet that refuses anything it cannot clearly display | C firmware on ESP32-S3; OLED and buttons; BIP39/32/44; AES-256-GCM storage | Yes |

### ETHOnline 2026 Hedera agent-payment winners

These beat Capability Descent's Hedera application, though track-level judging notes were not seen.

| Project | What it does | Build details seen | Live demo |
| --- | --- | --- | --- |
| Turnstile | Agent marketplace for onchain analysis, with ENS records as the offer and a spending limit the agent cannot raise | x402 on Hedera and USDC on Arc; Messari-schema subgraph via Subgraph MCP; Rust Substreams for ERC-8004 | Yes |
| Carpool | Registry where agents buy finished research rather than redo it; authors earn royalties and prices decay | TypeScript monorepo; `@x402/hedera` with Blocky402 facilitator; MCP server; Next.js dashboard | Yes |
| AutoVoyage | Travel agent that pays per query for flight data under a user-approved budget | Next.js; Express supplier; self-hosted x402 facilitator; HIP-336 HBAR allowance; HashPack | Yes |

### Tokyo 2026 agent winners

| Project | What it does | Build details seen | Live demo |
| --- | --- | --- | --- |
| Kagi Wallet | Capped, expiring agent key; the controlling key is split across hardware | FROST threshold signatures; 2 M5Stack ESP32-S3 boards; Bluetooth and IR | Yes |
| Surety | Parametric insurance for agents that lose money after being manipulated | 8 Solidity contracts on Sepolia; Hono; Next.js 16; World ID; ENS names | Yes |
| x402 Guard | MetaMask Agent Wallet plugin that screens x402 payments: pay, cap, ask a human or refuse | TypeScript plugin; Intercepta API; ships a SKILL.md for agents; live tests against a real wallet | No |
| Airlock | OpenAI-compatible gateway that redacts data and requires human consent before frontier model calls | Hono; local Qwen on vLLM; World ID for Agents; policy read from ENS | Yes |
| Lifeline | Credit line for agents, with the debt owed by a verified human | World IDKit; Move contract on Sui; credit line on Arc; Intercepta screening | Yes |
| XSwap | Chrome extension adding a buy button to X ticker cards; not an agent project | Manifest V3; Node proxy; Uniswap Trading API; Intercepta; World ID | Yes |

### New Delhi 2025 finalists

| Project and slug | What it does | Build details seen | Live demo |
| --- | --- | --- | --- |
| Autonome (`autonome-d8cxe`) | Payment and identity layer so agents pay websites for content | Forked Gemini CLI; decentralized identity; on-chain micropayments; x402 | No |
| ad-402 (`ad-402-5bnqt`) | Direct advertiser-to-publisher payments; claims publishers keep 93–95% | x402 micropayments; script-tag integration | Yes |
| Igris AI (`igris-ai-nvfh6`) | Personal security agent with a dead man's switch | EIP-7702 delegation; Privy; ZeroDev; Pimlico | Yes |
| KagamiAI (`kagamiai-h7yq4`) | Copy trading of AI-driven DeFi workflows | MCP server and OpenAI; DeFiLlama data | No |
| calendefi (`calendefi-6d3ji`) | Schedules crypto transactions through calendar events | Google Calendar API; natural-language intent parsing | Yes |
| NoNet (`nonet-xyebu`) | Sends blockchain transactions over a Bluetooth mesh without internet | React Native and Expo; BLE libraries; custom chunking protocol | No |
| UniPerp (`uniperp-g9sx1`) | Perpetual futures embedded in Uniswap v4 hooks | vAMM on virtual reserves | Yes |
| Nox (`nox-fah3x`) | Privacy layer for perpetual trading | Dark pool; ZK notes; Poseidon commitments; Merkle tree | No |
| MemeWarp (`memewarp-ymsfd`) | Cross-chain memecoins where price differences are the arbitrage feature | Solidity factory, bonding curve and pool on Flow and Hedera | Yes |
| Dike (`dike-zn1gm`) | Prediction market with branching child bets | Solidity on Sepolia; Pyth price feeds | No |

### New Delhi 2025 agent winners

| Project and slug | What it does | Build details seen | Live demo |
| --- | --- | --- | --- |
| Director.AI (`director-ai-1gsss`) | Orchestrates paid AI agents to complete complex tasks | Next.js; Reown; Gemini orchestrator; Hono agent servers; x402 | Yes |
| Instant (`instant-kopi2`) | Chrome extension that finds and buys items seen in Instagram reels | x402 with USDC on Polygon Amoy; OpenAI Vision; dual-agent design | Yes |
| ZKred Agent ID (`zkred-agent-id-4aesd`) | Decentralized identity for agents | Extended ERC-8004 with DIDs on Polygon Amoy, Hedera and 0G | No |

## Patterns and next steps

A spending cap alone is unlikely to stand out at Mumbai, because at least 7 of the 30 winners read already include spending limits, payment gating or agent-loss protection. These patterns describe winners only, so treat them as hypotheses rather than causes.

### Competition for the agent-spending idea

| Project | Overlap with capped spending | What it added beyond the cap |
| --- | --- | --- |
| Cordon | Budgets across an agent tree | Delegation limits and public refusal records |
| AutoVoyage | One approved budget with on-chain ceilings | A complete consumer travel product |
| Novi Corpus | Treasury enforcing spending rules | Legal entity and verified human guardian |
| Turnstile | Limit the agent cannot raise | Marketplace and ENS-based offers |
| Kagi Wallet | Capped, expiring agent key | Threshold signatures on physical hardware |
| x402 Guard | Pay, cap, ask or refuse decisions | Counterparty screening and a demonstrated wallet gap |
| Surety | Protects against manipulated agents | Insurance payouts and policy enforcement |

### Patterns seen

1. **Specific problem backed by evidence.** TARE measured hooks, Cordon cited incidents, and x402 Guard tested a real wallet against a sanctioned address.
2. **Live demos.** All 8 ETHOnline finalists had one, against 5 of 10 at New Delhi. Mumbai now requires one for finalist judging.
3. **Agent projects rising.** About 5 of 8 ETHOnline finalists were agent-related, against about 3–4 of 10 at New Delhi. These counts rely on judgment.
4. **Physical builds.** ETH Arcade and LeekDIYHardwareWallet made finalist, and Kagi Wallet won two prizes.
5. **x402 pay-per-call.** It appeared in winners at all three events, and Hedera's largest Mumbai track is built around it.
6. **Sponsor tools doing real work.** Turnstile uses ENS records as the seller's offer, and Airlock reads policy from ENS.
7. **Non-agent ideas still win.** TARE, NoNet, UniPerp, Nox and Dike show that agents are not required.

### Implications for the team

- Prioritize finalist: 3,000 USDC plus 1,500 USDC in travel reimbursement, compared with a top track prize of about $3,000 shared by the team. No sponsor pool is guaranteed to a team.
- Treat partner prizes as additions: they need no live presentation and can be won alongside finalist.
- If staying with agent spending, pick one specific failure that limits do not solve, test it for real, and show the refusal live.
- A refusal demo fits World Agent Pass, which requires an unsuccessful path where the protected action does not occur.
- Hedera plus World is a natural starting pair for an agent-payments idea. The third pick should depend on the idea.

### Open questions for the team

- [ ] Is the Mumbai idea chosen? If so, compare it with the tables above.
- [ ] From Scratch or Continuity? Capability Descent could only continue through a Continuity track, whose prize set differs.
- [ ] Will anyone attend Pragma Mumbai during the build?
- [ ] Is the ETHOnline repo link broken or simply wrong? Check before reusing any of that work.

### Suggested next work

1. Re-check the Mumbai dashboard for track selection, project status and any newly posted finalist rules.
2. Read full requirements on the prizes page for each candidate sponsor.
3. Compare winners against non-winners from the same track to test the patterns above.
4. If time allows, scan Open Agents and Agentic Ethereum. Test their showcase slugs first.
5. Check winning repos and demo videos for depth and presentation style.
6. From the first commit: public repo, frequent commits, AI-use notes, and spec files in the repo.
7. Before Saturday 9:00 AM IST: live link, compliant laptop-recorded video with a real voice, full form and up to 3 partner picks.

### Method notes

- The site rate-limits fast reading with HTTP 429. Three parallel readers with short delays and retries completed the scans, with progress saved in browser storage.
- The Playwright browser was logged in to Dhruv's ETHGlobal account. Showcase pages may not need a login, but this was not tested.
- Raw scan data lives only in that browser's storage and in this document. The local storage keys are `scan_newdelhi` and `read_winners`.

### Sources

- [ETHGlobal Mumbai event page](https://ethglobal.com/events/mumbai)
- [Mumbai rules and submission details](https://ethglobal.com/events/mumbai/info/details)
- [Mumbai prizes](https://ethglobal.com/events/mumbai/prizes)
- [Pragma Mumbai](https://ethglobal.com/events/pragma-mumbai)
- [ETHGlobal events list](https://ethglobal.com/events)
- [ETHOnline 2026 showcase](https://ethglobal.com/showcase?events=ethonline2026)
- [Tokyo 2026 showcase](https://ethglobal.com/showcase?events=tokyo2026)
- [New Delhi 2025 showcase](https://ethglobal.com/showcase?events=newdelhi)
- ETHGlobal email "ETHGlobal Mumbai Finalist Prize Updates!", sent October 31, 2026 to Dhruv's inbox
