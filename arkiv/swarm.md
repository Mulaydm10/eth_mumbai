# Swarm usage (Arkiv + Swarm bonus)

**What lives on Swarm:** the **evidence pack** of every sealed, quorum-confirmed event. This is the file a resident hands to a court or journalist. It contains:
- the claim, worded carefully ("a corroborated vibration event in this band occurred at this time… not a claim that any legal limit was exceeded");
- the quorum rule used (k, window);
- every member trigger with its Arkiv entity key, the phone's wallet (`$creator`), PPV, frequency, and the **raw waveform excerpt**;
- the phone registry at sealing time;
- who sealed it, and when.

**How it points from Arkiv:** each `tremor-witness.v1.event` entity stores `swarmRef` (the 64-hex Swarm reference, indexed) and `packHash` (the keccak256 of the pack JSON). See `schema.md`.

**Upload path:** browser `fetch` POST to the public gateway `https://api.gateway.ethswarm.org/bzz?name=…` with the null postage stamp. There is no Bee node and no backend. Code: `packages/chain/src/swarm.ts`, sealing in `apps/web/src/dashboard.ts`.

**Why Swarm and not our server:**
- The pack must outlive us and must not be editable by us.
- Content addressing means a court can check that the file it holds is the one the Arkiv record points to: recompute the keccak hash and compare it with `packHash`.
- If the free gateway ever drops the upload, anyone holding a copy can re-upload it and the hash still verifies.

**Verify it yourself:**
```bash
npx tsx scripts/verify-event.ts p2test 1440
# → <eventId> … swarm=bd1f901262d3… hash=OK members-on-arkiv=OK (3 with waveforms)
```

**Limits we hit:** see `friction.md` S1–S2. The public gateway won't serve our HTML dashboard without approval. Our CROPS fallback is the offline single-file viewer, and the JSON packs themselves are served fine.
