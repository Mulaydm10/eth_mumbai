# Swarm in Tremor Witness (Arkiv + Swarm bonus)

Tremor Witness uses **both Arkiv and Swarm**: Arkiv holds the signed, queryable, time-scoped records, and Swarm holds the evidence file people hand to a court or journalist. The sections below answer each of the bonus's qualification items in order.

## 1. What we keep on Swarm, what we keep on Arkiv, and which field holds the reference
| On Swarm | On Arkiv | Linking field |
| --- | --- | --- |
| The **evidence pack** of every sealed, quorum-confirmed event (JSON). It contains:<ul><li>the claim wording;</li><li>the quorum rule and the as-of membership rule;</li><li>every member reading with its Arkiv entity key, the phone wallet (`$creator`), PPV, frequency and **raw waveform excerpt**;</li><li>the ENS snapshot of each phone (who it resolved to at sealing);</li><li>the clock alignment;</li><li>the experimental coherence score;</li><li>who sealed it, and when.</li></ul> | Each phone's readings (`tremor-witness.v1.trigger`), joins (`.sensor`), sound-sync anchors (`.sync`), invites (`.invite`) and the sealed-event pointer (`tremor-witness.v1.event`) | `tremor-witness.v1.event.swarmRef` (64-hex Swarm reference, **indexed**) and `packHash` (keccak-256 of the pack JSON) |

Why the split: the pack must be **immutable and content-addressed**, so anyone holding a copy can prove it is the sealed one. The records must be **signed per phone and queryable**, so the quorum can be recomputed by anyone.

## 2. One Arkiv entity key and the Swarm reference it points to
- Arkiv entity (site `p3test`, Rabdi chain 7794095): `0xce0a5ebb417522010bc37995ca67c118f2a7a89725497e58a73a09b7fc792b9a`, written by `0xb529c8E35A00581b685EB58bdACf43377ea553BA` (the dashboard viewer that sealed it).
- Its `swarmRef`: `c68cde652fa0daed9baf5d7f4a276d28fb13ff685aa5755015da956ac7fc8a18`. **Open it:** https://api.gateway.ethswarm.org/bzz/c68cde652fa0daed9baf5d7f4a276d28fb13ff685aa5755015da956ac7fc8a18/
- Its `packHash`: `0x3bbaef28c927fd68e4e9d41c7c1ebfef3fd77f8c96a37e3a65171d5f9198dcf8` (keccak-256 of the bytes served at that link).
- Human-readable view of the same event, which re-checks the hash live: https://tremor-witness.vercel.app/report.html?site=p3test&event=0x8bc4e17f64e343a1dd0e7532b3e4d6dd

A second example (site `p2test`): entity `0xdcf04817cddf9a05f6453ecf999a7697beca61741854cb3b073133a01d5798ef` → https://api.gateway.ethswarm.org/bzz/bd1f901262d3b6096b8785b8daf58c8073ae1a8baed664da5bc52ac29ed99627/

## 3. Postage stamp, wallet and upload service
- **Batch ID:** `0000000000000000000000000000000000000000000000000000000000000000`, the **null stamp** accepted by the public gateway.
- **Wallet that bought it:** none. We did **not** buy a batch. Uploads are sponsored by the public gateway operated by Swarm (`api.gateway.ethswarm.org`), and we run no Bee node.
- **Service:** the Swarm public gateway, called from the **browser** (CORS `*`), so no server of ours touches the upload.
- **Honest consequence:** retention of null-stamp uploads is not documented (see `friction.md` S2). That's why the pack hash is also on Arkiv and printed in the report: any holder can re-upload the same bytes and the hash still verifies.

## 4. Files that upload to Swarm and read from it
- `packages/chain/src/swarm.ts`: `swarmUploadJson()` (POST `/bzz?name=…` with the stamp header), `swarmFetchJson()`, `swarmUrl()`.
- `apps/web/src/dashboard.ts`: `seal()` builds the pack, uploads it, then writes the Arkiv `event` entity with `swarmRef` and `packHash`.
- `apps/web/src/report.ts`: reads the pack from Swarm and re-checks its keccak-256 against Arkiv.
- `scripts/verify-event.ts`: command-line verification of every sealed event at a site (Arkiv, then Swarm, then the hash).

## 5. Run one upload and one read yourself
Needs: `curl` (upload and read) and, for the full check, Node ≥ 22 with this repo (`npm install`).
```bash
# Upload (public gateway, null stamp). Expect HTTP 201 and {"reference":"<64 hex>"}
curl -s -X POST "https://api.gateway.ethswarm.org/bzz?name=hello.json" \
  -H "content-type: application/json" \
  -H "swarm-postage-batch-id: 0000000000000000000000000000000000000000000000000000000000000000" \
  --data '{"hello":"tremor-witness"}'

# Read it back. Expect your JSON
curl -s "https://api.gateway.ethswarm.org/bzz/<reference>/"

# Read + verify a real sealed event against Arkiv. Expect "hash=OK members-on-arkiv=OK"
npx tsx scripts/verify-event.ts p3test 100000
```

## 6. The moment in our demo video
The confirmed event's row flips from **"sealing…" to "sealed ✓ Swarm"**. Clicking **report** shows "✓ the Swarm file matches the hash recorded on Arkiv". The exact timestamp in the final video is listed in `DEMO.md` (the video cut list).

## 7. What got in our way
See `arkiv/friction.md`, Swarm section:
- **S1:** the public gateway won't serve HTML sites until a hash is approved.
- **S2:** null-stamp retention is undocumented.
- **S3:** `<name>.bzz.link` needs a mainnet ENS name.

## 8. Encrypted references
We **do not** upload encrypted content. Evidence packs are public by design, because public verifiability is the point. We are aware that **an encrypted Swarm reference contains its decryption key**, and Arkiv entities are public. If we add private annexes later (roadmap), the reference will be encrypted for the recipient or kept off Arkiv. It will never be stored in an entity as-is.
