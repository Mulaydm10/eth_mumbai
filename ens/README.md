# ENSv2 in Tremor Witness (ENS: Best Use of ENSv2)

**In one line:** ENSv2 is the **sensor registry that decides whose readings count**. Every phone is a non-transferable, expiring, revocable subname issued by the building's committee, and the quorum reads ENS history to decide what was valid *when it was recorded*. Remove ENS and the product has no answer to "who is allowed to testify?".

- Live demo: https://tremor-witness.vercel.app/dashboard.html?site=test2 (with the phone join page at `/?site=test2`). Code (MIT): this repository.
- Network: **Sepolia, ENSv2** (contracts-v2 deployment `07e55a05`, 1 Oct 2026 set; addresses in `research/tremor-witness/ensv2-recipe.md`).

## The name tree we deployed
```
tremorwitness.eth                         ETHRegistry → our UserRegistry 0xf2EC49c03254C9F4F2843B00B1ECF277dDbeF76B
 ├─ test2.tremorwitness.eth                its OWN UserRegistry 0x094f7B7d657481140aa54c2Faa351057FC775bF0 (one per building)
 │    ├─ phone-b0a8.test2.tremorwitness.eth   owner = that phone's wallet, roleBitmap 0 → non-transferable, 30-day expiry
 │    └─ phone-cad2.test2.tremorwitness.eth
 └─ p3test.tremorwitness.eth               UserRegistry 0x9A0F254985ef7ACD455622eee3C8a9387b18C02C
PermissionedResolver (shared) 0xFA87654E65542Ad82428f3326c322d6a12C55957
  site text records: tw.k (quorum size), tw.window_ms (quorum window), written only by the committee role-holder
```

## ENSv2 features we use, and why each one is load-bearing
| ENSv2 feature (the prize's own words) | What it does in Tremor Witness | Code |
| --- | --- | --- |
| "deploy your own subname registry … under your own rules" | One **UserRegistry per building**, deployed through `VerifiableFactory`. The building's committee holds its roles, and nobody else can add or remove that building's phones. | `packages/chain/src/ens.ts` `ensCreateSite` |
| "expiring, revocable, non-transferable" subnames | A phone name is issued to the phone's own wallet with **roleBitmap 0**, so it lacks `CAN_TRANSFER_ADMIN` and **cannot be sold or handed to someone else**. It expires in 30 days and is revoked with `unregister` (`ROLE_UNREGISTER`). | `ensRegisterPhone`, `ensRevokePhone` |
| "Enhanced Access Control … delegate specific rights, like letting an account edit only certain text records" | Quorum rules are **text records on the site name** (`tw.k`, `tw.window_ms`). Only the committee role can set them, every viewer reads them, and nothing is hard-coded. | `siteParams`, `scripts/ens-setup.ts params` |
| Hierarchical registry + resolution | The dashboard resolves `<phone>.<site>.tremorwitness.eth` with stock viem through the Universal Resolver. The phone list comes from the site registry's own `LabelRegistered` / `LabelUnregistered` events. | `listSitePhones`, `resolvePhones` |

## Why it is central (not cosmetic)
1. **The quorum's membership test *is* an ENS query.** A reading counts only if the phone's ENSv2 name was registered to the wallet that wrote it (the Arkiv `$creator`), **both at the reading's claimed time and at the moment Arkiv recorded it**. We call this the T13 as-of rule.
   - It's computed from the site registry's event history and Sepolia block times (`siteRegistrationHistory` + `packages/core/src/registry.ts`, 8 tests).
   - Consequence: **revoking** a phone stops its *future* readings only, history is never rewritten, and a revoked phone cannot backdate.
   - Verified on site `p3test`: three phones revoked at 22:04 UTC still count for their 21:56 stomp.
2. **Joining needs a committee-signed invite (T14).** `/api/ens-register` registers a subname only with a single-use, 30-minute invite signed by the committee key. Both the issue and the use are logged publicly on Arkiv, so anyone can audit why each name exists.
3. **Evidence packs snapshot ENS.** Every sealed event records, per phone, who its name resolved to at sealing. The printable report shows "ENS at sealing" next to "ENS now".

## No hard-coded values
- Phones, owners, expiries, revocations and quorum parameters are all read **from chain at view time**.
- The only constants are deployment addresses: our parent registry, the shared resolver and the factory deployer. That's the same as any app pinning a contract address.
- **Try it:** register a phone (scan an invite), revoke it from the dashboard, and the dashboard's phone list and trust banner change accordingly. On `p3test` the committee changed `tw.k`, and the dashboard follows the text record.

## Demo moments (live and in the video)
1. A judge scans a one-time invite QR, and their phone becomes `phone-xxxx.test2.tremorwitness.eth` (about 25 s, two Sepolia transactions).
2. The phone list shows "resolves ✓" with the expiry date. A stomp confirms with k from the ENS text record.
3. The committee clicks **Revoke**. That phone's *new* readings are refused, while its earlier confirmed event still stands.

## Verify it yourself
- Open `test2.tremorwitness.eth` on https://sepolia.app.ens.domains, or resolve a phone with any viem client on Sepolia.
- `npx tsx --env-file=.env scripts/ens-setup.ts phones test2` lists live phones from the registry's logs (read-only, no key needed for listing).
- `npx tsx scripts/ens-check.ts test2.tremorwitness.eth tw.k tw.window_ms` prints the site's text records.

## Limits (stated honestly)
- **The committee is a single key today** (our onboarding service). The roles are designed to move to a 2-of-3 Safe, whose owners are pending; see `design/build-plan.md`.
- **Phone addr records are set by that same committee role** (one shared PermissionedResolver). Giving each phone write access only to its own record is on our roadmap (the verdict's T3; per-key setter scoping was tested in research).
- **Sepolia ENSv2 has been redeployed before.** We are on the 1 Oct 2026 set.
- **AI agents as namespaces** (the prize's bonus idea) is not used. Our sealer bot is a roadmap candidate.
