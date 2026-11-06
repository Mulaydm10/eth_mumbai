# DEMO: the rehearsed judge-facing script

Not a feature list. Each scenario is the exact click-by-click / command-by-command happy path, rehearsed.
**Binding:** once any path exists, this file stays runnable at all times. A broken demo outranks every new feature.
Retire a scenario by marking it `superseded by DEMO-####`, never by deleting it.
Time budget and finalist format (demo length, video limits) live in `COMPETITION.md`; do not restate them here.

**Status: DRAFT. The path exists and each step was verified separately (log: `research/tremor-witness/LOG.md`), but the full run has NOT been rehearsed end to end on phones yet.**

## Global reset and rollback (applies to every scenario)
- **Reset to a clean state (about 2 min):**
  1. Use a fresh demo site, e.g. `judge1`. It's created automatically on the first invited join (`/api/ens-register` creates `judge1.tremorwitness.eth` with k=3, 2000 ms).
  2. Reload every phone, then tap **Start**. The phone's key and outbox persist in the browser; to wipe a phone, clear the site data.
  3. Keep 3 phones pre-registered on that site beforehand, so the live part only adds the judge's phone.
- **Deployment rollback:**
  1. `vercel ls tremor-witness` → pick the last known-good URL.
  2. Run `vercel promote <url>` from `apps/web`, or redeploy from git: `git checkout <sha> && cd apps/web && vercel build --prod --yes && vercel deploy --prebuilt --prod --yes`.
- **Fallback if the live demo fails:**
  - **Wi-Fi down:** phones keep detecting and queue uploads offline. Show "N waiting to upload", then the recorded video of the passing path.
  - **Sepolia slow:** use pre-registered phones only; skip the live invite.
  - **Arkiv rate-limited:** the dashboard keeps its last sync; open `/report.html` for an already-sealed event.
  - Never fake output.

---

## DEMO-0001: "Nobody can edit this record" (finalist demo, live)
- **Status:** Draft, not rehearsed
- **Preconditions:**
  - Dashboard open on the laptop at `https://tremor-witness.vercel.app/dashboard.html?site=<site>`.
  - 3 team phones on the table, flat, running, and registered (each shows its ENS name).
  - One spare Android phone ready for "Be the vibration source".
  - The committee passcode at hand (`.env` `COMMITTEE_PASS`; never shown on screen).
- **Steps** (each with expected output):

| # | Action | Expected output |
| --- | --- | --- |
| 1 | Hook (20 s): the Colaba quote and MMRC 2017's "phones can't be that accurate" | — |
| 2 | Committee clicks **Create invite** on the dashboard; a judge scans the QR with their own Android phone and taps Start | The judge's phone shows `ENS: phone-xxxx.<site>.tremorwitness.eth` within ~25 s. The dashboard lists it with "resolves ✓", and the invite audit shows `issued` then `used`. |
| 3 | Someone stomps between the phones (or the spare phone taps **Be the vibration source**) | A **confirmed event** appears with k from the ENS text record. A few seconds later it shows **"sealed ✓ Swarm"**. |
| 4 | One person picks up and shakes a single phone | That reading shows **handling** / **no-quorum**. No event. |
| 5 | Committee clicks **Revoke** on one phone, then stomps again | The revoked phone's new readings are refused ("not-registered-at-…"). **Its earlier confirmed event still stands** (as-of rule). |
| 6 | Kill the backend: close the Vercel tab, then open the **offline viewer** file (downloaded beforehand) on a laptop with no server of ours | The same events and the sealed evidence rebuild from Arkiv, ENS and Swarm. |
| 7 | Click **report** on the sealed event | The printable report shows "✓ the Swarm file matches the hash recorded on Arkiv", the ENS names "at sealing vs now", and verify-yourself steps. |

- **Known-broken edges to avoid:**
  - iPhones can't run the sensor (no Generic Sensor) or the vibration source (no web vibration). Use Android.
  - Without the microphone, sound sync is off; internet sync still works.
  - The judge's phone needs internet to join (ENS registration).
- **Reset procedure:** move to a new site name for the next judge, or revoke the judge's phone (it frees a slot; max 5 per site).

## Video cut list (≤ 3 min, our own voice, no music, laptop screen recording)
| t (approx.) | Shot | Sponsor proof |
| --- | --- | --- |
| 0:00–0:20 | Problem: the Colaba quote and the MMRC "phones can't be accurate" line | — |
| 0:20–0:50 | Invite QR → a phone joins with its ENS name; the audit list ticks `used` | ENSv2 (registry, non-transferable names); Arkiv (invite log) |
| 0:50–1:30 | Stomp → confirmed → **"sealed ✓ Swarm"**; a shake is rejected | Arkiv (signed readings, the quorum is a query); **Swarm moment** (referenced in `arkiv/swarm.md` §6) |
| 1:30–2:00 | Revoke → new readings refused, the old event stands | ENSv2 (as-of rule, revocation) |
| 2:00–2:40 | **Switch off our backend** → the offline viewer still shows everything → report hash ✓ | **EF CROPS "the moment it matters"** |
| 2:40–3:00 | What it does not claim (not geophone-grade), and who uses it | — |
