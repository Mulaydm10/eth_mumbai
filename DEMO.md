# DEMO: the rehearsed judge-facing script

Not a feature list. Each scenario is the exact click-by-click / command-by-command happy path, rehearsed.
**Binding:** once any path exists, this file stays runnable at all times. A broken demo outranks every new feature.
Retire a scenario by marking it `superseded by DEMO-####`, never by deleting it.
Time budget and finalist format (demo length, video limits) live in `COMPETITION.md`; do not restate them here.

## Global reset and rollback (applies to every scenario)
- **Reset to clean state:** TODO(Dhruv): exact commands/steps; fill when the stack (`ADR-0002`) and build exist. Target: a clean state in under 2 minutes.
- **Deployment rollback:** TODO(Dhruv): how to redeploy the last known-good version of the live deployment (a finalist requirement in `COMPETITION.md`).
- **Fallback if live demo fails:** TODO(Dhruv): e.g. recorded video of the passing path. Never fake output.

---

## DEMO-0001: TODO(Dhruv) happy path
- **Status:** Not started (no thesis yet, `Q-0001`)
- **Preconditions:** TODO(Dhruv)
- **Steps** (each with expected output):

| # | Action | Expected output |
| --- | --- | --- |
| 1 | TODO(Dhruv) | TODO(Dhruv) |

- **Known-broken edges to avoid:** TODO(Dhruv)
- **Reset procedure:** TODO(Dhruv) (must return to the clean state needed by Preconditions)
