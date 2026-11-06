# Arkiv schema: Tremor Mesh

Network: **Rabdi testnet** (chain ID 7794095). SDK: `@arkiv-network/sdk` 1.0.1. Code: `packages/chain/src/arkiv.ts`.
All schemas are tagged `tremor-witness.v1.*`, so a query through a schema only sees our tag. Anyone can copy a tag, so **readers trust an entity only by its `$creator`** (see "Trust" below).

## Entities

### `tremor-witness.v1.trigger`: one detected vibration on one phone
| Attribute | Type | Indexed | Meaning |
| --- | --- | --- | --- |
| `site` | str | yes | Building/site id (e.g. `test2`) |
| `sensor` | str | yes | Phone name at that site (Prototype 3: an ENSv2 subname) |
| `tMs` | u64 | yes | Wall-clock time of the trigger, ms |
| `ppvUm` | u64 | yes | Peak particle velocity, µm/s (mm/s × 1000) |
| `fDomCHz` | u64 | no | Dominant frequency, centi-Hz |
| `lowFPct` | u64 | no | % of energy below 3 Hz (hand-sway indicator) |
| `rateCHz` | u64 | no | Sample rate the phone actually delivered, centi-Hz |
| `label` | str | yes | `structural` or `handling` |
| `wave` | bytes | no | JSON waveform excerpt (~1.5 s, 3 axes) + tilt and peak acceleration, for independent re-analysis |
- **Owner / creator:** the phone's own wallet (key generated and kept in the phone's browser).
- **Expiry:** 30 days. Raw triggers are short-lived on purpose (privacy); confirmed events outlive them.

### `tremor-witness.v1.sensor`: a phone joining a site
| Attribute | Type | Indexed | Meaning |
| --- | --- | --- | --- |
| `site` | str | yes | Site id |
| `sensor` | str | yes | Phone name |
| `startedMs` | u64 | yes | When the phone started sensing |
| `rateCHz` | u64 | no | Delivered sample rate |
| `api` | str | no | Sensor API used (`Accelerometer` / `DeviceMotion+g`) |
| `ua` | str | no | Browser user agent (truncated), for reproducibility |
- **Owner / creator:** the phone's wallet. **Expiry:** 7 days.

### `tremor-witness.v1.event`: a sealed, quorum-confirmed event
| Attribute | Type | Indexed | Meaning |
| --- | --- | --- | --- |
| `site` | str | yes | Site id |
| `eventId` | str | yes | keccak256 of the sorted member trigger keys: the same event has the same id whoever seals it |
| `tMs` | u64 | yes | Median member time |
| `k` | u64 | no | Quorum used |
| `nSensors` | u64 | no | Phones in the event |
| `ppvMinUm`, `ppvMaxUm` | u64 | no | PPV band across phones |
| `sensors` | str | no | Comma list of member phones |
| `swarmRef` | str | yes | Swarm reference of the evidence pack (see `swarm.md`) |
| `packHash` | str | no | keccak256 of the pack JSON, so any copy can be verified |
- **Owner / creator:** whoever sealed it (any dashboard viewer's wallet). **Expiry:** 180 days (just under Arkiv's ~182.5-day maximum).

## Queries we run (all through the SDK query builder)
| Purpose | Query |
| --- | --- |
| Triggers for the quorum | `from(trigger).where(and(eq("site", s), gt("tMs", u64(since)))).orderBy(desc("tMs")).limit(100)` |
| Phones at a site | `from(sensor).where(and(eq("site", s), gt("startedMs", u64(since))))` |
| Sealed events | `from(event).where(and(eq("site", s), gt("tMs", u64(since))))` |

## Trust
- A trigger counts only if its immutable `$creator` equals the wallet that registered that phone name at the site.
  - Prototype 2: the first wallet to register the name, with a maximum of 5 phones per site.
  - Prototype 3: the address the phone's ENSv2 subname resolves to.
- An `event` entity is a convenience and permanence pointer only. Readers recompute the quorum from triggers and verify `packHash`.
