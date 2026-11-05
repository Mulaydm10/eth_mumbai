# DIVERGE worker D5: BEHAVIORAL / INFORMATIONAL angle
Frame: change information or behaviour (credible signals, commitments, public tamper-evident records, reputation, incentives, reversing who bears cost). Generation mode; criticism off except the OFF-THE-TABLE list.

## Log
- [read] diverge-context.md in full. Sure: yes.
- [search] "Chainalysis 2025 ... address poisoning approvals". Found (secondary, mixed definitions): Chainalysis 2025 theft >$3.4B; approval phishing driving scam losses (crowdfundinsider 2026/06 URL https://www.crowdfundinsider.com/2026/06/286208-approval-phishing-scammers-increasingly-exploit-wallet-permissions-to-steal-crypto/); academic study 270M address-poisoning attacks on ETH+BSC, 17M victims, >=$83.8M lost; single $50M poisoning case (https://www.theblock.co/post/383423/crypto-trader-loses-50-million-in-address-poisoning-attack-offers-1-million-bounty-for-return). 60% of ERC20 approvals unlimited (deepstrike https://deepstrike.io/blog/crypto-wallet-drainer-statistics). Confidence: medium (secondary).
- [search] India dark patterns. CCPA 2023 dark-pattern guidelines; June 5 2025 advisory requiring self-audit; CCPA penalised IndiGo, Zepto, Physics Wallah, BookMyShow for drip pricing/basket sneaking (https://www.freepressjournal.in/india/ccpa-penalises-indigo-zepto-physics-wallah-others-for-using-deceptive-dark-patterns-online). LocalCircles: 97% of 290 platforms still use dark patterns; Datum: all 12 tracked non-compliant, fix only when detected (https://www.medianama.com/2026/06/223-dark-patterns-indian-online-marketplaces-report/). Confidence: medium (advocacy sources).
- [search] India gig worker wage opacity. IT for Change/NLSIU Mar 2025: pay formula weights change, workers cannot predict earnings; IDInsight 2024: costs ~32% of gross, take-home ~INR115/hr, women ~7% less (https://idronline.org/article/livelihoods/what-the-data-reveals-about-indias-gig-workers/); Karnataka 2025 gig law requires algorithm explanation (https://www.medianama.com/2025/12/223-algorithms-gig-workers-india-new-study/). Construction wage theft: nothing found. Confidence: medium.
- [search] Mumbai air quality. Official AQI from ~30 AQMS stations; two faulty sensors read 985 ug/m3 for 24h in 2020 skewing headline (https://newsletter.carboncopy.info/air-pollution-choke-hold-on-mumbai-revealed-in-first-citizen-science-experiment/); IIT Kanpur low-cost sensors 80-90% accurate vs reference; BMC MANAS 75 sensors planned mid-2026 (unconfirmed). Flood/rainfall: nothing found. Confidence: medium.
- [search] commitment devices. Ariely-Wertenbroch 2002 self-deadlines help but less than external; Bisin-Hyndman 2020 demand for commitment without performance gain. Gine-Karlan-Zinman CARES: 11% uptake, +3pp quit at 6mo, persisted at 12mo (https://es.poverty-action.org/sites/default/files/publications/put_your_money_where_your_butt_is.pdf). Authors tied to stickK. Confidence: high on findings.
- [search] kirana udhaar. Local-shop credit most common borrowing in CMIE data (Bihar 87.9% HH) https://ceda.ashoka.edu.in/where-do-indian-households-borrow-money-from/ ; credit by familiarity/in-group (Sungu 2026 seminar abstract, unverified); no default-rate data found. Confidence: medium.
- [search] India rental deposit disputes. Only advice/news pieces; no national survey. Model Tenancy Act 2021 says return on vacating or within ~15 days with interest (sources conflict; state-specific). Bengaluru viral cases (https://www.businesstoday.in/personal-finance/real-estate/story/the-biggest-scam-in-bengaluru-investment-advisor-calls-out-citys-rental-deposit-trap-472022-2025-04-15). Confidence: low-medium (anecdotal; no stat).
- [search] blind signing. arXiv "What I Sign Is Not What I See" (https://arxiv.org/pdf/2601.16751): signing is most decisive yet least understood step; users click through. No percentages found. Confidence: medium.
- [search] Arkiv docs. Entity = key, owner, payload, attributes, expiration; SQL-like attribute query; expired entities leave queryable DB but history remains; storage cost = size x duration; renewals need spend authorisation (https://raw.githubusercontent.com/Arkiv-Network/claude-plugin/f271ac480cbba2d715b4d840fc0523130768e4bf/plugins/arkiv-codex/skills/arkiv-entity-expiration/SKILL.md ; https://arkiv.dev.golem.network/docs). Docs version drift noted. Confidence: medium.
- [search] EF Anon-RPC. ethereum.org privacy roadmap (https://ethereum.org/roadmap/privacy.md): RPC provider sees IP, device fingerprint, queried addresses, timing; Anon-RPC = "origin privacy" (hides requester); hiding query content needs PIR/ORAM separately. PSE private-RPC working group (https://www.theblock.co/amp/post/370532/ethereum-foundation-sets-end-to-end-privacy-roadmap-with-private-writes-reads-and-proving). Did not confirm current Anon-RPC implementation depth. Confidence: medium.
- [search] India protein supplement labels. Medicine journal lab study of 36 products: ~70% mislabelled, 14% contained toxins (https://pmc.ncbi.nlm.nih.gov/articles/PMC10994440/ ; https://www.nutraingredients.com/Article/2024/04/29/Protein-products-tested-in-India-don-t-meet-label-claims). FSSAI relies on manufacturer-submitted test results that are not public; authors call for public database of tested brands. Brand disputes contest it. Confidence: medium-high on study, low on FSSAI figures.
- [search] Mumbai local trains. ~2,468 deaths 2024, 2,287 in 2025 (https://www.freepressjournal.in/amp/analysis/how-mumbais-local-trains-are-turning-into-death-traps); 29,970 deaths in 11 yrs per GRP (https://www.theweek.in/wire-updates/national/2025/06/10/bom29-mh-train-deaths.html); 7-7.5M daily; design ~1,320/train vs peak ~4,800 (Quint). No real-time coach crowding data found. Confidence: medium (inconsistent definitions).
- [search] ENSv2 docs (https://docs.ens.domains/ensv2/enhanced-access-control , /ensv2/permissioned-registry , /ensv2/permissioned-resolver). Registry perms scoped per name (labelhash + eacVersionId), auto-invalidated on re-registration; EAC up to 64 roles/resource, 15 holders; resolver has 11 roles (8 per-record). CONFLICT between docs pages on whether resolver permissions are per-name; verify against source before relying. Confidence: medium.
- [search] World ID India. Dated/mixed: India verification paused ~2023; World ID 4.0 (Apr 2026 summary) adds Selfie Check iris-free tier. Nothing on nullifier/action semantics; India availability UNVERIFIED. Confidence: low. (Matters for any idea leaning on World ID in India.)
- [search] Mumbai Diwali noise. Awaaz 2023: 72-117 dB vs permissible 50-55 day; Shivaji Park silence zone 105.5 dB (2021); MPCB/Awaaz joint pre-Diwali test skipped in 2023 for first time in a decade (https://ianslive.in/this-diwali-mumbai-recorded-high-noise-pollution-levels-too--20231113172705 ; https://www.freepressjournal.in/mumbai/mumbai-news-diwali-noise-levels-soar-in-parts-of-city-despite-court-order). Single NGO source mostly. Confidence: medium.

## IDEAS (9). Shared note: ideas 3,4,5 use the same "phone sensor -> Arkiv + World ID" skeleton; pick at most one.

### I1. Lookalike-Proof Address Book (address-poisoning defence by social-graph registry)
- Problem: people paste a recent-history address that an attacker seeded to look like a real contact (same first/last chars) and send funds to the thief. Sufferers: any self-custody user; one 2025 victim lost ~$50M of USDT.
- Evidence: https://www.theblock.co/post/383423/crypto-trader-loses-50-million-in-address-poisoning-attack-offers-1-million-bounty-for-return ; academic count 270M attempts / 17M victims / >=$83.8M (reported via https://cointelegraph.com/commissioned/address-poisoning-turns-test-transfers-into-a-wallet-history-trap , secondary).
- What changes: the user's contacts stop being "whatever is in tx history" and become named entries in their own registry; any destination not in the registry but near-matching one that is gets a hard stop. Sticks because the recent-history list (the attack surface) is never the source of truth.
- Mechanism: user owns a name with subnames per contact (alice.me.eth); only the user holds the role to change a contact's resolver record (ENSv2 EAC), optionally a second "family" role holder must co-approve changes. Wallet sends by name only; for raw pastes compute edit-distance/prefix-suffix collision against registry and recent poisoners.
- Ingredients: ENSv2 EAC per-name roles https://docs.ens.domains/ensv2/enhanced-access-control ; Anon-RPC origin privacy https://ethereum.org/roadmap/privacy.md (resolving your contacts otherwise tells the RPC provider your whole counterparty graph).
- Sponsors (2): ENS (roles on contact records are the core security property) ; EF Anon-RPC (contact resolution is exactly the read that leaks who you pay).
- Phone: optional; phone as second-channel co-approver for registry edits (push + biometric).
- Level-3 candidate: collision detector evaluated by replaying real poisoning incidents from chain data; report recall and false-positive rate. Doubles as Dhruv's adversarial-testing strength (generate worse vanity collisions and try to beat it).
- WOW: live: attacker script seeds a poisoned address into the judge's wallet history; paste it; app blocks and names the real contact it imitates.
- Number: detection recall on N historical poisoning txs (we measure) and median grinding cost for attacker to evade the matcher.
- Risk of drift: ENS resolution is a supporting layer, not an "ENS checkout" headline.

### I2. Approval Greed Index (a public grade for how much power each dapp asks for)
- Problem: users cannot tell whether a dapp asks for exact or unlimited token power, so they accept unlimited by default. Sufferers: all ERC20 users.
- Evidence: reviews report ~60% of ERC20 approvals unlimited, 22% of users at high drain risk (https://deepstrike.io/blog/crypto-wallet-drainer-statistics, secondary vendor stats); approval phishing driving scam losses (https://www.crowdfundinsider.com/2026/06/286208-approval-phishing-scammers-increasingly-exploit-wallet-permissions-to-steal-crypto/).
- What changes: dapps get a public, recomputed grade; being "greedy" becomes a visible reputational cost to the party that currently bears none (the dapp). Sticks because measurement is automatic and external, not self-reported.
- Mechanism: a Chainlink CRE workflow samples recent approvals to each protocol's spender contracts, computes share unlimited / share to unverified spender / median residual allowance, writes the grade onchain and into the dapp's ENS text record via a role held only by the workflow. Wallet shows grade at sign time.
- Ingredients: ENSv2 roles https://docs.ens.domains/ensv2/enhanced-access-control ; Chainlink CRE (from team notes; unverified).
- Sponsors (2): Chainlink (periodic trust-minimised computation is the point) ; ENS (grade lives at the dapp's own name, writable only by the CRE role).
- Phone: none required; a mobile web wallet-preview page.
- Level-3 candidate: correctness of the grader (labelled set of benign vs drainer spenders, precision/recall).
- WOW: open a real dapp on a phone, signature prompt shows "D-: 81% of its users granted unlimited".
- Number: % unlimited approvals across the top-50 spenders on one L2, measured by us.
- Drift risk: close to "revoke" tools; headline is the public score, not revocation.

### I3. Wage Ledger (workers measure what the platform will not show)
- Problem: gig workers cannot see or predict how the pay formula treats them, so they cannot bargain or switch. Sufferers: delivery/ride workers.
- Evidence: IT for Change/NLSIU Mar 2025 (formula weights change, earnings unpredictable) and IDInsight 2024 (costs ~32% of gross, take-home ~INR115/hr) via https://idronline.org/article/livelihoods/what-the-data-reveals-about-indias-gig-workers/ ; Karnataka 2025 law requires algorithm explanation https://www.medianama.com/2025/12/223-algorithms-gig-workers-india-new-study/.
- What changes: workers contribute trip records from their own phone (GPS/IMU-verified distance, time, payout) to a pooled, queryable index of true effective hourly pay by zone and hour; the information asymmetry flips. Sticks because individual data is hidden, only k-anonymous aggregates show.
- Mechanism: phone logs trip (GPS + IMU consistency to resist fabricated trips), payout entered or OCR'd from screenshot; raw entries are Arkiv entities with short TTL so personal trails expire; aggregates persist; one-human-one-contributor-per-zone via World ID so a platform cannot flood the index.
- Ingredients: Arkiv expiry+attribute queries https://arkiv.dev.golem.network/docs ; World ID (India availability unverified, see log).
- Sponsors (2): Arkiv (TTL = privacy-by-expiry is native); World ID (sybil-resistance is the integrity of the index).
- Phone: central (sensors + capture).
- Level-3 candidate: trip-authenticity check from IMU/GPS and sybil-poisoning resistance of the aggregate (simulate a platform injecting fakes).
- WOW: drive a short route live; the app computes effective rupees per hour net of fuel cost vs the "advertised" per-km rate.
- Number: effective INR/hr from our own N logged trips; error of distance vs odometer.

### I4. Coach Crowd Truth (Mumbai locals)
- Problem: commuters cannot see which coach or train is dangerously packed before boarding, so they pile into the same ones. Sufferers: ~7M daily riders; ~2,300-2,500 deaths/yr on the network.
- Evidence: https://www.freepressjournal.in/amp/analysis/how-mumbais-local-trains-are-turning-into-death-traps ; https://www.theweek.in/wire-updates/national/2025/06/10/bom29-mh-train-deaths.html (29,970 deaths/11 yrs); no real-time coach occupancy data found.
- What changes: a live per-platform/per-coach crowd signal that is short-lived by nature; riders redistribute along the platform (a coordination/Schelling effect), and the data becomes public pressure on dispatch.
- Mechanism: phones estimate local density from BLE/Wi-Fi scan counts + accelerometer to recognise "in a moving train"; post a coarse reading as an Arkiv entity with 5-minute TTL keyed by line/station/coach-zone; World ID throttles to one reading per human to block spoofing.
- Ingredients: Arkiv TTL https://raw.githubusercontent.com/Arkiv-Network/claude-plugin/f271ac480cbba2d715b4d840fc0523130768e4bf/plugins/arkiv-codex/skills/arkiv-entity-expiration/SKILL.md
- Sponsors (2): Arkiv (data that must vanish in minutes); World ID.
- Phone: central.
- Level-3 candidate: calibration of BLE-count to true headcount (needs ground truth counted by us; real hardness, honest r-value).
- WOW: judges' own phones in the room become a live crowd-density map of the hall.
- Number: Pearson r between phone-estimated and hand-counted headcount at N sites.
- Risk: field data collection in a few days; hall demo is the fallback.

### I5. Decibel Witness (citizen noise record, Diwali week)
- Problem: noise limit breaches go unmeasured by the authority that should enforce them. Sufferers: residents, elderly, patients near silence zones.
- Evidence: Awaaz 2023 readings 72-117 dB vs 50-55 dB limit; Shivaji Park silence zone 105.5 dB; MPCB/Awaaz joint test skipped in 2023 (https://ianslive.in/this-diwali-mumbai-recorded-high-noise-pollution-levels-too--20231113172705).
- What changes: any phone creates a time/place-stamped, calibrated reading that is a public tamper-evident record; breaches become a complaint-ready dataset, shifting the burden of proof off the resident. Sticks because the record cannot be quietly edited and is signed to a unique human.
- Mechanism: mic -> A-weighted dB estimate with per-model calibration offset; Arkiv entity per reading (attributes: geohash, hour, dB band); World ID dedup; auto-flag locations with repeated breach.
- Sponsors (2): Arkiv; World ID. (Same skeleton as I3/I4.)
- Phone: central.
- Level-3: phone-mic calibration across device models against a reference meter, with clipping handling at >100 dB where phone mics saturate (a real hard bit).
- WOW: clap/firecracker sound in the room, reading appears with a confidence band, then on the shared map.
- Number: mean absolute error in dB vs a reference meter across >=3 phone models.

### I6. Drip-Price Notary (prove the price you were first shown)
- Problem: apps show a price then add handling/membership fees later; shoppers cannot prove it. Sufferers: Indian online shoppers.
- Evidence: CCPA penalised IndiGo, Zepto, Physics Wallah etc. for drip pricing/basket sneaking https://www.freepressjournal.in/india/ccpa-penalises-indigo-zepto-physics-wallah-others-for-using-deceptive-dark-patterns-online ; 97% of 290 platforms still use dark patterns (LocalCircles, via https://www.medianama.com/2026/06/223-dark-patterns-indian-online-marketplaces-report/, advocacy source).
- What changes: each checkout step's visible price is captured and notarised; the platform now bears the cost of exposure; a leaderboard shows "rupees added after the first price" per app. Sticks because the delta is measured, not claimed.
- Mechanism: Android share-sheet/accessibility capture of cart screens -> hashed, timestamped entity in Arkiv (attributes: platform, step, price) -> aggregate delta index; evidence bundle auto-formatted for a CCPA complaint; CROPS: evidence can't be taken down by a platform.
- Sponsors (2): Arkiv; EF CROPS (censorship-resistant evidence store).
- Phone: central.
- Level-3: robust price extraction from arbitrary app screens (OCR + layout), measured field-level accuracy; plus replay that no one can backdate an entry.
- WOW: place the same basket on 3 apps live; a bar chart shows INR added between step 1 and pay.
- Number: median INR drip delta per platform from our own >=30 baskets.
- Caveat: TOS risk for automated capture; manual share is the safe path.

### I7. Batch Truth Registry (label claims bound to lab results the brand cannot edit)
- Problem: consumers cannot verify protein/supplement label claims and the test data is manufacturer-held and private. Sufferers: gym-goers; ~70% of 36 products tested mislabelled, 14% with toxins in one study.
- Evidence: https://pmc.ncbi.nlm.nih.gov/articles/PMC10994440/ ; https://www.nutraingredients.com/Article/2024/04/29/Protein-products-tested-in-India-don-t-meet-label-claims (authors call for a public tested-brand database).
- What changes: cost reversal: the brand posts a bond and the lab, not the brand, writes results to the batch record; a QR on the tub shows tested vs claimed. Sticks because the brand physically cannot write its own test outcome.
- Mechanism: brand name -> per-batch subname; resolver result records writable only by the accredited-lab role (ENSv2 EAC); lab report as Arkiv entity whose TTL equals the batch best-before date; bond held in stablecoin, slashable by a failed challenge-test.
- Sponsors (3): ENS (role separation brand vs lab is the core); Arkiv (TTL = shelf life); Whitechain (stablecoin bond, no crypto steps for brand).
- Phone: QR scan by consumer; camera.
- Level-3: the permission model proven by adversarial tests (brand tries 20 escalation paths, all revert) plus challenge/slash flow.
- WOW: scan two tubs; one shows "claimed 24g, lab 15.8g", brand bond partially slashed live.
- Number: count of escalation attempts blocked; time to verify by a shopper (seconds).
- Caveat: real lab data is not ours to create; demo uses team-commissioned test or clearly-labelled sample.

### I8. Deposit Default-Flip (the landlord must prove, not the tenant)
- Problem: landlords withhold deposits and tenants cannot prove the condition at move-in. Sufferers: Indian tenants.
- Evidence: anecdotal Bengaluru cases, Model Tenancy Act 2021 return within ~15 days (state-specific) https://www.businesstoday.in/personal-finance/real-estate/story/the-biggest-scam-in-bengaluru-investment-advisor-calls-out-citys-rental-deposit-trap-472022-2025-04-15 ; no national statistic found.
- What changes: default flip: deposit auto-releases to tenant on day N unless landlord posts photo evidence matching the move-in record. Default effects are the strongest nudge; reversed burden of proof.
- Mechanism: both parties capture move-in photos (provenance-stamped); deposit in stablecoin escrow; landlord claims require evidence referencing the same room/capture; landlord reputation on a name with record writers = past tenants (World ID unique).
- Sponsors (2): Whitechain (zero-crypto-step escrow for tenant); ENS (landlord reputation trail).
- Phone: camera + GPS/Wi-Fi/barometer for proof-of-capture.
- Level-3: proof-of-capture (is this photo of this room at this time, not edited); measure detection of staged/edited photos.
- WOW: edit a photo in-room to hide a stain; the system rejects it live.
- Number: detection rate on N team-made forgeries.
- Weakest evidence of the set.

### I9. Co-Signed Khata (a portable repayment trail for shop credit)
- Problem: kirana credit runs on familiarity and in-group trust, so newcomers and out-group customers are refused and disputes are ledger-vs-memory. Sufferers: poorer households and small shops.
- Evidence: shop credit most common borrowing in CMIE data (https://ceda.ashoka.edu.in/where-do-indian-households-borrow-money-from/); in-group bias in credit offers (Sungu, 2026 seminar abstract, unverified); no default-rate data found.
- What changes: every udhaar entry and repayment is co-signed by shopkeeper and customer; a customer's trail is portable across shops, lowering the information barrier. Sticks because both parties get a shared, undisputable record at zero cost.
- Mechanism: shop registry name with a subname per customer; shop role writes debit entries, customer role writes acknowledgements, neither can alter the other's; entries as Arkiv entities (attributes: shop, amount band, status) with TTL set to the credit term.
- Sponsors (2): ENS (dual role separation); Arkiv.
- Phone: QR/BLE co-sign (not NFC tap-pay).
- Level-3: offline co-sign with conflict resolution when both edit while disconnected.
- WOW: shopkeeper phone and customer phone, airplane mode, both record a purchase, reconcile on reconnect with a visible conflict case.
- Number: reconciliation correctness over N simulated conflicting edits.

## DISCARDED
- D-a RPC read-leak meter: on OFF-THE-TABLE list (team candidate already).
- D-b Agent allowance / revoke / expiry approvals: OFF-THE-TABLE; I2 deliberately avoids it by headlining the public grade.
- D-c Medicine kiosk with verified prescriptions: OFF-THE-TABLE; I7 targets supplements/labels instead.
- D-d Phone checks shop QR payee before UPI pay: OFF-THE-TABLE (UPI already shows payee).
- D-e Auto-rickshaw/taxi fare-check from phone GPS: no evidence fetched this run; likely small stake and crowded in consumer apps. Could be revived with data.
- D-f StickK-style commitment-contract app (stake money, lose to charity): evidence is solid (Gine-Karlan-Zinman: 11% uptake, +3pp quit rate, persisted at 12 months https://es.poverty-action.org/sites/default/files/publications/put_your_money_where_your_butt_is.pdf) but low take-up, existing incumbent, no hard Level-3 component.
- D-g Wallet that refuses what it cannot display: listed as already done by finalists.
- D-h Poisoning honeypot that baits attackers: interesting but legally and ethically messy and does not change user behaviour; folded into I1 evaluation instead.
- D-i Potholes/road-roughness shame map from IMU: plausible, no evidence searched; same skeleton as I3-I5.
- D-j Clean-air indoor sensor network: Mumbai MANAS rollout (75 sensors, unconfirmed) makes it a moving target; low-cost sensor 80-90% accuracy known.
- D-k Public hook-fee study: finalists did it (TARE).

## Searches run / sources fetched / tools used
- WebSearch (standard) x15: Chainalysis/poisoning/approvals; India dark patterns; gig wage opacity; Mumbai air quality; commitment devices; kirana credit; rental deposits; blind signing; Arkiv TTL; Anon-RPC; protein label study; Mumbai local deaths; ENSv2 EAC; World ID India; Mumbai Diwali noise.
- WebFetch: none (all facts are from search-result summaries, i.e. secondary; primary pages not opened). Playwright: not used. No agents spawned. No blocked paths, but: construction wage theft, Mumbai flood/rainfall data, real-time coach crowd data, permit comprehension percentages, World ID nullifier docs returned nothing.
- Unverified: ENS resolver per-name scoping (docs conflict); World ID India availability; Anon-RPC current implementation depth; Chainlink CRE and Arkiv details beyond the team notes and docs search.
