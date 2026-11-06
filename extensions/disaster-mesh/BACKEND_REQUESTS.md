# Backend requests from the Disaster Mesh app

The app session writes rows here. The main Tremor Witness session decides and implements them. The web app and backend stay locked to the app session (see `BRIEF.md` §0).

| ID | Date IST | What & why | Proposed shape | Status |
|---|---|---|---|---|
| R1 | 2026-11-06 | Mesh device registration without using one of the 5 slots (or confirm the `<name>-m` label) | see BRIEF §8 | proposed |
| R2 | 2026-11-06 | `tremor-witness.v1.dtrigger` schema + `tw.dk` / `tw.dwindow_ms` | see BRIEF §8 | proposed |
| R3 | 2026-11-06 | `tremor-witness.v1.checkin` schema (+ dashboard roster panel, main session decides) | see BRIEF §8 | proposed |
| R4 | 2026-11-06 | Bundle upload of relayed signed messages | see BRIEF §8 | proposed |
