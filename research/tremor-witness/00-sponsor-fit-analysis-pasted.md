# Sponsor-fit and relevance analysis (pasted by Dhruv, 2026-11-06 ~01:25 IST)

Verbatim copy of the analysis Dhruv pasted into the Claude Code session (its origin is outside this repo). Dhruv's instruction with it: "use playwright mcp to study sponsor tracks in depth of these 4 we will implement", then design a build plan.
**The 4 tracks chosen by Dhruv:** Arkiv Build on Arkiv (+ Swarm bonus) · ENS Best use of ENSv2 · EF Best CROPS app · World IDKit (backup third pick).
Unverified claims in this text are checked in `sponsors/` (deep dive) before the plan relies on them.

---

Yes, it's relevant. ETHGlobal's judging doesn't require DeFi or tokens, and Tremor Witness uses Ethereum for the reason Ethereum exists: a record that no single party controls. Two of your sponsors, ENS and the Ethereum Foundation, are core Ethereum, and Arkiv describes itself as "an Ethereum-aligned DB-Chain".

The real risk is a judge seeing it as civic tech with blockchain sprinkled on top. Your "why a blockchain?" answer handles that: a spreadsheet can be edited by its owner, a WhatsApp video by its sender, a signed PDF has one signer; Tremor Witness is co-signed by many flats in real time and nobody, including you, can rewrite or withhold it.

## ETHGlobal's finalist judging criteria (official, Mumbai info page)
Each team presents for 7 minutes: a 4-minute demo, then 3 minutes of questions. Judges score five things:

| Criterion | ETHGlobal's wording | How Tremor Witness scores |
|---|---|---|
| Technicality | "How complex is the problem you're addressing, and how sophisticated is your solution?" | Strong if you show the signal processing (PPV, aligning phones in time, rejecting fakes) and measured numbers |
| Originality | "Is your project introducing a new idea or creatively solving an existing problem?" | Strong. No ETHGlobal winner did this. |
| Practicality | "How complete and functional is your project? Could it be used by its target audience today?" | Medium. It needs a working multi-phone demo and one real "we'd use this" from a resident. |
| Usability | "How intuitive is your project? Have you made it easy for users to interact with your solution?" | Strong. Judges join from their own phones. |
| WOW factor | "Does your project leave a lasting impression?" | Strong: the stomp on the table, then killing the backend live |

Common questions to prepare: "What inspired your project?", "What tools did you use, and why?", "What challenges did you solve, and how?"

## What each sponsor track requires (from the Mumbai prize page)
**Arkiv, Build on Arkiv ($3,000 / $1,000) + Swarm bonus ($500)**
- "Build a new app whose data lives in Arkiv", using the SDK or JSON-RPC, where "at least one feature users see reads its data from Arkiv".
- Judged from files in your repo: /arkiv/schema.md (entities, fields queried, owners, expiry), /arkiv/friction.md, /arkiv/reach.md, /arkiv/why-arkiv.md, /arkiv/how-you-use-arkiv.md
- Swarm bonus: "Use Swarm in a meaningful way… keep the files your users see on Swarm and point to them from your Arkiv entities." Select it when you submit. It comes on top of the track prize and doesn't use one of your three picks.
- Fit: readings and events are entities, the dashboard reads Arkiv, and evidence packs go on Swarm.

**ENS, Best use of ENSv2 ($3,000 / $2,000 / $1,000)**
- "Must be built on ENSv2 on Ethereum mainnet or Sepolia. ENSv2 features should be central to the product, not a cosmetic add-on. Your demo must be functional and not just include hard-coded values. … a link to a live demo and the code… open source."
- Their brief lists: "deploy your own subname registry… Enhanced Access Control… delegate specific rights, like letting an account edit only certain text records… subname setups: expiring, revocable, non-transferable."
- Fit: show the committee's roles and a live revocation.

**Ethereum Foundation, Best CROPS app ($2,000 / $1,000 / $500)**
- CROPS = censorship resistant, open source, private, secure. "build an app… where one CROPS property is the reason it exists, without giving up the other three."
- EF's judging criteria are "tbc: final review pending". The "show the moment it matters" wording isn't on the page checked; confirm with EF.
- Privacy fix: name sensors pseudonymously (sensor-07); publish only confirmed events in the construction band, not raw readings; keep the code open source.

**World IDKit, backup third pick ($1,250, two winners)**
- "Use IDKit to solve a real trust moment… Use the credential that is proportionate to your use case… We are rewarding the best decision about which credential is needed, why it is needed."
- Fit: Proof of Human at sensor registration, one human per sensor.

## Rules to remember
From scratch (code after hacking began, Thursday 9 PM IST) · commit often · document AI use · video 2–4 min, ≥720p, not sped up, no phone recording, no AI voiceover · submissions due Saturday 9:00 AM IST.
Sources: https://ethglobal.com/events/mumbai/info/details · https://ethglobal.com/events/mumbai/prizes
