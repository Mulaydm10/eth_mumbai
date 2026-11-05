> **LOCKED governing file.** Do not edit in place. See `GOVERNANCE.md`.

# Design

Architecture lives here; decisions live in `design/decisions/` as ADRs.

## Architecture
TODO(Dhruv): blocked on the thesis (`Q-0001`) and the stack (`ADR-0002`).

## ADR process
1. Copy `decisions/ADR-0000-template.md` to `ADR-####-<slug>.md` (next free number).
2. Status starts `Proposed`. Only the Main Agent sets `Accepted`.
3. Accepted ADRs are immutable; supersede with a new ADR and mark the old one `Superseded by ADR-####`.
4. Cross-reference `Q-####` / `EXP-####` / `DEMO-####` so `grep -rn '<ID>' .` recovers the trace.
