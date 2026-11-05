# Idea candidates (verbatim)

The text under each divider is verbatim as supplied by Dhruv. No idea has been chosen.

---

MachineLease — hardware-attested equipment rental. A pocket/ESP32 device determines whether rented physical equipment is actually being used; payment accrues only during verified use. Target 0G Physical AI + Whitechain Scale + Arkiv Build. The hardware sends sensor/image checkpoints to 0G; 0G's decision is inside the usage loop and every decision/request ID is recorded in 0G Storage; Whitechain settles USDT and optionally refunds unused prepaid balance; Arkiv stores expiring rental-session entities queried by renter and owner. This directly matches 0G's physical decision-loop + safe-stop requirements, Whitechain's zero-crypto-step/software-payment emphasis and Arkiv's TTL/shared-state model. 
 The novelty is payment based on independently classified physical usage rather than merely unlocking a device after payment. IOFY already tokenized IoT rental sessions; Kleeto and MACH402 already meter rented computers; Paybot already combines robot control with gasless payment, so a basic "pay to use hardware" product is not new. The differentiator must be that disputed/ambiguous usage is decided by the 0G physical-agent checkpoint and the device safely stops rather than continuing if inference becomes unavailable. 
 MVP: one ESP32/camera or phone-as-hardware, one relay/LED representing machine state, Arkiv session TTL, one Whitechain USDT charge/refund, 0G request IDs and safe-stop. Fast validation: unplug 0G/network during an active rental and verify the hardware stops metering/access rather than fabricating a decision. Team: embedded/IoT + web3 + frontend; feasibility medium.

---

ReadLeak — privacy compatibility lab for DeFi RPC reads. A developer test runner shows exactly what wallet/pool information a DeFi app leaks through normal RPC reads and whether the same workflow works through Anon-RPC. Target Ethereum Foundation Anon-RPC + Arkiv Mirror + Uniswap. Run a fixed corpus of Uniswap pool, allowance, quote and wallet-state reads through normal RPC and Anon-RPC; mirror a suitably licensed public chain/RPC registry into Arkiv; publish queryable compatibility/latency fingerprints keyed by network and method. EF explicitly suggests network-health/playground and leakage-oriented tooling; Arkiv explicitly suggests chain/RPC registries for its mirror track; Uniswap accepts tooling for its broader ecosystem. 
 The targeted showcase search did not surface an exact project that combines public reproducible RPC compatibility fingerprints + private Uniswap read paths, although EF itself proposes adjacent health-checker tooling. The novelty therefore has to be the reproducible corpus and public compatibility dataset, not simply a private Uniswap frontend. Fast validation: capture RPC traffic for the same wallet-watchlist operation using ordinary RPC and Anon-RPC and demonstrate the measurable difference. MVP: 10–15 representative methods, two networks/endpoints, Arkiv importer/query, CI-style pass/fail report. Team: infra/TypeScript + data + frontend; feasibility high, but first confirm the chosen registry's redistribution license because Arkiv Mirror requires it.

---

Fallback Checkout
Elevator pitch: A stablecoin checkout where customers can still verify, reclaim or complete their transaction after the merchant's website and backend vanish.

Target partners: Whitechain + ENSv2 + Ethereum Foundation CROPS. Addressable track pools: approximately $15.5K. 

Rubric mapping. Whitechain gets a genuine merchant-ready USDT payment with refund/post-payment behavior. ENS gets a functional ENSv2 hierarchy such as merchant.fallback.eth and invoice-42.merchant.fallback.eth, with EAC separating treasury, customer-service and recovery permissions. EF gets a structural CROPS property: kill the merchant backend during the demo and the user still reaches a local/static interface, resolves onchain configuration and exercises the refund/settlement right. 

Concrete design. CheckoutVault.sol on Whitechain accepts the required test USDT, records invoice/refund deadlines and supports merchant refund plus narrowly scoped customer recovery conditions. ENSv2 stores durable merchant identity, supported settlement contract and recovery metadata under Permissioned Resolvers. The frontend is static/open-source with no analytics and can reconstruct the required state without the original backend. Whitechain's rubric explicitly asks for both merchant and customer views and gives extra credit for refunds/renewals/accounting after the initial payment. 

Novel edge. Most payment products optimize successful checkout. This product optimizes the merchant-disappearance failure case, where the payment has happened but the SaaS vendor, backend or domain no longer cooperates.

Existing overlap. Unwind already provides onchain refund infrastructure, AnyAsset Checkout already provides ENS-branded stablecoin checkout and Enscribe already combines invoices with ENS. The difference must therefore be demonstrable survivability: the judge watches you stop the merchant server and remove the primary frontend, then the customer independently reconstructs the invoice state and executes the allowed post-payment action. That's precisely the structural distinction EF's CROPS rubric rewards. 

Three-day MVP. Day 1: deploy/verify Whitechain checkout contract and settle one required USDT payment; deploy ENSv2 merchant hierarchy. Day 2: implement refund deadline, EAC roles and a static recovery frontend. Day 3: polished two-party checkout demo followed by deliberate backend shutdown and recovery; test double-refund, expired refund, unauthorized resolver edit and incorrect invoice ID.

Fast validation test: create one Whitechain payment, close the backend process completely, open a fresh browser against only the static client and public chain/ENS endpoints, and prove the receipt can still be independently reconstructed.

Skills / risk: one Solidity engineer plus one frontend/full-stack engineer is sufficient; a third person can own ENS/testing/demo. The principal risk is accidentally depending on the same backend during the "failure" demo. Design the recovery path browser-first from the start.
