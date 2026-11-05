# CONVERGE brief (read-only input for CONVERGE workers)
Event: ETHGlobal Mumbai 2026, From Scratch, team of 3, Android phones as the only hardware.
- **Finalist rubric (verbatim, unweighted):** "Technicality, Originality, Practicality, Usability (UI, UX, DX), WOW factor".
- **Finalist session:** 4-min live demo + 3 min of questions; the panel screens ~25 teams/3 h.
- **Finalist gates:** a live deployment anyone can open by link; a 2–4 min demo video (not phone-recorded, real voice, no music); a public repo with incremental commits; AI use documented.
- **Partner prizes:** at most 3 picks (all tracks of one partner = 1 pick); at most 1 EF prize; one Arkiv track prize per team (+ Swarm bonus). Judged from the write-up and video in under 2 minutes.
- **Verbatim sponsor text:** `/Users/mulaydm10/Dhruv/ETH mumbai/research/playbook/2026-11-05-ideation/sources/sponsor-tracks-verbatim.md`
- **Sponsor docs and endpoint probes:** `/Users/mulaydm10/Dhruv/ETH mumbai/research/playbook/2026-11-05-ideation/sources/sponsor-docs-notes.md`

## Candidate S-B · Tremor Witness
"Your building is shaking from the metro site next door; the only vibration meter belongs to the contractor; your neighbours' phones now form one they can't own."
- Phones laid on floors and walls in several flats run a browser PWA that logs acceleration and computes peak particle velocity (PPV, mm/s) and dominant frequency.
- Readings are time-aligned across phones, and a quorum rule (one human, one sensor; N phones agree within T seconds) rejects a single faked or hand-shaken phone. Optionally, TDOA arrival differences give a bearing to the source.
- Each confirmed event is an **Arkiv** entity (site, PPV, frequency, quorum size, bearing) with an expiry equal to the complaint window.
- Each building has an **ENSv2** name. Enhanced Access Control roles let a resident-contributor write only its own sensor's data, an auditor role exists, and the contractor gets read-only access.
- **EF CROPS** property: the evidence survives the app's server disappearing, and who reported stays private.
- Alternative anti-sybil: **World ID Agent Pass** (proofs are mocked at this event).
- **Known challenge:** in 2017 the Mumbai metro authority's director said mobile-app readings "cannot be that accurate".
- **Evidence:** Colaba residents demanded shared real-time vibration monitoring (FPJ, 2025-05-23); the Supreme Court ordered MMRCL to file tremor details after Mahim buildings tilted; the 2017 dispute had MMRC saying "below limit" while J.N. Petit alleged 4× the limit.

## Candidate S-A · LIFEBOAT race (frame transactions)
A person whose private key leaked watches sweeper bots steal any ETH sent in for gas, so tokens and approvals left in the wallet cannot be rescued.
- **Rescue:** one EIP-8141 frame transaction submitted to the alternative mempool (ERC-8421). A sponsor or an **ERC20 paymaster** pays gas, and the transaction atomically revokes approvals and moves the assets to a fresh key. No ETH ever touches the compromised address. It is proven against a sweeper bot the team writes.
- **Adversarial twist:** the same ERC20-paymaster capability may let *sweepers* drain tokens from compromised, gas-less wallets. The team measures how much value sits in such wallets (e.g. addresses delegated via EIP-7702 to known sweeper contracts, holding ERC20 but no ETH) and proposes or implements a paymaster/admission rule that keeps the owner ahead.
- A public registry of sweeper delegate contracts on **Arkiv**.
- **Prior art:** EIP-7702 rescue repos (codeesura/eip7702-asset-rescuer, mevdao-org/compromised-wallet-sweeper-rescue), the Flashbots whitehat service ($1k minimum, 5–10% fee), and Aegis7702 (a registry of 7702 delegates).
- **Risk flagged:** a forum comment says 7702-delegated EOAs break frame-transaction signature checks; EIP-8141 tooling is thin.

## Candidate E1 · ReadLeak / LeakMeter (control: the team's earlier "safest" pick)
- Replays a fixed corpus of wallet/DeFi reads through a normal RPC and through EF **Anon-RPC** (`@anon-rpc/browser-harness`).
- Shows what each provider could infer ("after 2 minutes it links these 3 wallets") and publishes a before/after leak and compatibility score.
- Mirrors a licensed chain/RPC registry into **Arkiv**; optionally **ENSv2**.
- EF's Anon-RPC and CROPS track texts list "network health checker / playground" and "a tool that shows what an app leaks" as suggested ideas.
