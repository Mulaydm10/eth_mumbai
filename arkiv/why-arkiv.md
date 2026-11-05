# Why Arkiv

Tremor Witness gives residents next to heavy construction a vibration record **no single party controls**: not the contractor, not the authority, not the housing-society secretary, and not us. Each Arkiv property maps to a requirement the product cannot meet otherwise:

| Requirement | Arkiv property | What we would need without it |
| --- | --- | --- |
| Each phone must speak for itself, verifiably | Every write is a signed transaction, and `$creator` is immutable | A server that collects readings, which is exactly the trusted middleman the residents don't have today |
| The quorum ("k phones within 2 s") must be checkable by anyone | Indexed attributes plus range queries; the quorum is literally a query over `site` + `tMs` | An indexer or database we operate (and could quietly edit) |
| A court, journalist or authority must read the record without asking us | Public JSON-RPC reads, no API key needed to read | An API we would have to keep online forever |
| Raw readings should not live forever (privacy), confirmed events should | Per-entity expiry: 30 days for raw triggers, 180 for sealed events | Cron jobs deleting rows on a server, trusted to do it |
| It must survive us switching our servers off (EF CROPS demo) | The dashboard and the offline single-file viewer read Arkiv directly | Nothing; this is the core of the product |

## Why not just Ethereum L1/L2 events?
We need to *query* by site and time window and to store waveform excerpts (about 3 KB each). Logs on an L2 need an indexer to query and cost more per byte. Arkiv gives queryable, time-scoped, wallet-owned records with no indexer, and it is Ethereum-aligned (same wallets, same tooling: viem).

## Why not IPFS/Swarm alone?
Content-addressed storage proves *what* a file is, not *who* wrote it *when*, and it can't be queried. We use Swarm for the sealed evidence pack (see `swarm.md`) and Arkiv for the signed, queryable, time-scoped records that point to it.
