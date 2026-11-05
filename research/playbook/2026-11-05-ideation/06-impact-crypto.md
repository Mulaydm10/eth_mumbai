# 06 Impact validation, crypto candidates (S-A, E1, E2, E4)
Angle: adversarial impact validator. Try to prove the problem is not worth solving; size only what survives. Date 2026-11-05. Build difficulty ignored.
Process note: log entries were first written incrementally, but my append calls used a full-file Write and overwrote earlier entries; this file is the reconstructed complete log plus verdicts.

## Log (chronological)
1. [read] candidates-brief.md: S-A, E1, E2, E4 entries. Sure.
2. [search, SNIPPET] EIP-7702 sweeper stats: Wintermute (June 2025) >80% of delegations to one sweeper script; other outlets 90-97%; Protos headline 48%. No reliable aggregate dollar total. 7702 sweepers mostly streamline theft from already-leaked keys. Odaily claim of a $5.5B Binance theft: single source, UNVERIFIED, excluded.
3. [search, SNIPPET] Topaz Blue/Bancor 49.5%: see fetches below. Bancor co-author (conflict).
4. [search, SNIPPET] RPC privacy / Infura: orientation; academic paper on IP-to-address deanonymization via RPC (par.nsf.gov) not opened.
5. [FETCHED] https://www.theblock.co/news/ecosystems/2025-06-01-wintermute-warns-pectra-upgrade-leaves-ethereum-users-at-risk-of-automated-attacks-356481 : "over 80% of EIP-7702 delegations" went to copy-pasted sweeper bytecode ("CrimeEnjoyor"), per Wintermute's Dune dashboard. No delegation count, no aggregate dollar loss; only a Scam Sniffer single wallet ~$150k. This is delegation SHARE, not dollars stolen.
6. [FETCHED] https://arxiv.org/abs/2111.09192 (Loesch, Hindman, Richardson, Welch, Nov 2021): 17 pools ~43% of v3 TVL; fees $199.3M vs IL $260.1M; "in aggregate those LPs would have been better off by USD 60.8m had they simply HODLd". The 49.5% is NOT on the abstract page.
7. [FETCHED] https://cointelegraph.com/news/half-of-uniswap-v3-liquidity-providers-are-losing-money-new-research : "49.5% of liquidity providers (LP) on Uniswap v3 have incurred negative returns from impermanent loss (IL)", 5 May to 20 Sep 2021, attributed to Topaz Blue and Bancor.
8. [FETCHED] https://consensys.com/blog/consensys-data-retention-update : Infura: "We do not store wallet account address information when a MetaMask user makes a 'read' request"; "We collect wallet and IP address information in connection with 'write' requests"; IP and wallet data "are not stored together or in a way that allows our systems to associate those two pieces of data"; working toward 7-day retention (not yet in effect). Undercuts E1's premise for Infura.
9. [search, SNIPPET] S-A rescue: MetaMask page and Flashbots forum.
10. [FETCHED] https://support.metamask.io/stay-safe/protect-yourself/fighting-back-against-sweeper-bots : bots watch mempool and move assets near-instantly; Flashbots sponsor bundle "will require significant technical know-how and research"; Flashbots whitehat service: "a $1,000 asset recovery minimum", "5-10% cut of the recovered assets". No prevalence data.
11. [FETCHED] https://collective.flashbots.net/t/need-flashbots-bundle-help-for-eoa-wallet-drained-by-sweeper-bot-170k-usdt/5502 (21 Jan 2026): victim: EOA compromised, ~170,000 USDT at risk, any ETH sent for gas "is drained almost immediately"; only reply: follow the whitehat page. Single stated instance.
12. [search, SNIPPET] E2: no documented stablecoin CHECKOUT vanishing with customer funds. Only provider shutdowns: Kulipa (stablecoin card issuer, closed 4 months after $6.2M seed), Lazerpay, Wyre, IBEX Pay US. None about stranded customer refund rights.
13. [search, SNIPPET] E1: EF anon-rpc guide (https://ethereum.github.io/anon-rpc/): reads concentrated in few providers, "vulnerable to censorship and surveillance"; EF post: gateways "see who's asking what". Design-stage; maturity unverified.
14. [search, SNIPPET] LVR: Milionis/Moallemi/Roughgarden (arXiv 2208.06046); Fritsch & Canidio 2024 (arXiv 2404.05803), 2022-2023 fees vs LVR; no retail-LP-specific or hedging-adoption study found.
15. [search, SNIPPET] Scam Sniffer 2025 and Chainalysis 2025 (see 17, 18).
16. [FETCHED] https://arxiv.org/abs/2306.08170 (Torres et al., USENIX 2023): 211 of 616 dApps leak wallet address to third parties (>2,000 leaks); 13 of 100 wallets leak. Third-party leakage, not RPC-read linking specifically.
17. [FETCHED] https://drops.scamsniffer.io/scam-sniffer-2025-crypto-phishing-losses-fall-83-to-84-million/ : 2025 drainer losses $83.85M, 106,106 victims (EVM only); private key compromises "not captured in drainer statistics"; EIP-7702 batch cases $1.54M and $1.00M. No figure for rescuable leaked-key wallets.
18. [search, SNIPPET] Chainalysis 2025 (https://www.theblock.co/post/382477): ~$3.41B stolen; personal-wallet compromises ~20% ($713M) vs 44% in 2024. Context only.
19. [search, SNIPPET] E4 2021 detail (REKT/secondary): ~17,000 addresses, 49.5% worse than holding, IL > fees in 80% of pools; IL ~1.1x fees over a month vs 1.8x within a day.
Gaps: no E2 customer-demand source; no hedging-adoption data for E4; no count of gas-less compromised wallets with assets; ERC-8421/EIP-8141 live status not checked.

# VERDICTS

## S-A LIFEBOAT race: REAL & COSTLY per victim; aggregate UNSIZED (population small/unknown)
- Stated: the 170k USDT victim quote (#11) and MetaMask's documented trap (#10).
- Who/how many: unsized. Searched Scam Sniffer, Chainalysis, Wintermute; none count leaked-key wallets still holding assets.
- Cost: unsized in aggregate; single incidents $1.00M-$1.54M (#17).
- Today: Flashbots sponsor bundle (DIY) or whitehat service ($1,000 minimum, 5-10% cut). Already works for >= $1k holders.
- Switching: free self-serve helps sub-$1k victims and those who do not know the service; modest gain over a working incumbent. Also depends on EIP-8141/ERC-8421 being live (not verified).
- Resists: sweeper operators, MEV builders; the paymaster admission-rule twist needs client/ERC buy-in.
- If solved: small leftover balances and the 5-10% fee recovered; aggregate unsized.
- Strongest case against: Flashbots whitehat serves the high-value cases; nobody has measured the pool.
- Opening line: "Over 80% of EIP-7702 delegations went to one copy-pasted sweeper contract" (#5, theblock URL above), paired with the 170k USDT quote. Do not claim it is dollars stolen.

## E1 ReadLeak: NICE-TO-HAVE (leaning REAL BUT MINOR); pain inferred, not stated by users
- Stated by EF (#13) and academics (#16), not by victims; no fines, incidents or user complaints found.
- Infura says reads are not stored and IP/wallet are not linkable (#8), which contradicts the premise for the biggest provider. Other providers unverified.
- Today: default RPC, VPN, own node. No visible loss, so low switching urgency.
- Resists: RPC providers, wallet default-RPC deals.
- Strongest against: harm inferred, provider denies linking, Anon-RPC design-stage.
- Opening line: "13 of 100 wallets and 211 of 616 dApps leaked the user's address to third parties" (https://arxiv.org/abs/2306.08170). Say it is third-party leakage, not RPC reads.

## E2 Fallback Checkout: NICE-TO-HAVE / not evidenced (weakest)
- No documented case of customers' refund rights stranded at a crypto checkout (#12); no customer quotes; sizing: unsized, nothing credible found.
- Buyer is the merchant, who gains nothing from surviving their own disappearance; refunds require locked funds merchants avoid.
- Strongest against: failures found were card issuers/custodians, not direct-settlement checkouts.
- Opening line: no honest pain number. Only "Kulipa closed four months after a $6.2M seed" (SNIPPET, unopened; mark unverified).

## E4 Hedged LP: REAL & COSTLY as a market fact; REAL BUT MINOR as unmet consumer need
- 2021, 17 pools: fees $199.3M vs IL $260.1M; $60.8M worse than holding (#6); 49.5% of LPs negative (#7). Conflict (Bancor co-author), 2021 bull window, stale.
- Today: hold instead, perp hedges, Arrakis/Gamma vaults, IL-protection products, longer holds (IL ~1.1x fees monthly, SNIPPET).
- Switching: no retail-hedge demand data; hedges cost fees and cap upside; crowded space.
- Resists: little.
- Opening line: "Uniswap v3 LPs earned $199.3M in fees but lost $260.1M to impermanent loss, $60.8M worse than holding" (https://arxiv.org/abs/2111.09192), labelled 2021, 17 pools.

# Ranking by impact-evidence strength
1. E4 (two fetched numbers; stale, conflicted). 2. S-A (vivid fetched quote and fee structure; pool unsized; incumbent works). 3. E1 (inferred; provider denies). 4. E2 (nothing). Lead with E4 or S-A (S-A only if the team measures the gas-less compromised-wallet pool itself); drop E2.

# Searches run / sources fetched / tools used
Tools: WebSearch (11 standard queries: EIP-7702 sweepers; Topaz/Bancor; RPC privacy/Infura; Flashbots rescue; LVR; stablecoin processor shutdowns; Anon-RPC; Scam Sniffer 2025; LP profitability 2024-25; wallet fingerprinting; private-key compromise share), WebFetch (8 fetched sources: #5, #6, #7, #8, #10, #11, #16, #17), Read, Grep, Write.
Blocked/failed: consensys.io redirected (retried on consensys.com, ok). Not opened: Chainalysis report, Fritsch & Canidio, arXiv 2501.07828, EF anon-rpc pages, E2 incident articles, EIP-8141/ERC-8421 status. Odaily $5.5B claim excluded. No ethglobal.com visited, no agents spawned.
