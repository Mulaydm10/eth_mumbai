# Privacy: every host each page talks to (CROPS "P", measured)

**Method:**
- **Dashboard:** measured. We loaded `https://tremor-witness.vercel.app/dashboard.html?site=p3test` in a clean browser (Playwright) for 20 s on 6 Nov 2026 and listed every network request, static assets included. Raw list: `scratch/net-dashboard.txt` (local).
- **Phone page:** derived from the code (`apps/web/src/main.ts`), because a desktop browser has no motion sensor to start a session. Marked "from code" below.

## Dashboard / offline viewer / report (measured: 3 hosts)
| Host | Why | What that host learns |
| --- | --- | --- |
| `tremor-witness.vercel.app` | The page itself (HTML/JS/CSS). `/api/drip` only if you seal or keep-alive an event. | Your IP and which site you view. **The offline viewer skips this host entirely.** |
| `rpc.rabdi.db-chain.testnet.arkiv.network` | Reads readings, phones, events, invites (public Arkiv RPC) | Your IP and the site you query |
| `ethereum-sepolia-rpc.publicnode.com` | Reads the ENSv2 registry, names and text records | Your IP and which names you resolve |
| `api.gateway.ethswarm.org` | Only when sealing or opening an evidence pack / report | Your IP and which pack you open |

**Not contacted:** no analytics, no tracking pixels, no font or CDN hosts, no cookies set by us.

## Phone page (from code)
| Host | When | What is sent |
| --- | --- | --- |
| `tremor-witness.vercel.app` | Page load. `/api/time` (clock sync, every 2 min while sensing). `/api/drip` (gas, once). `/api/ens-register` (join, with the invite). | The phone's **wallet address**, the site and phone name at join. Time requests carry nothing. |
| Arkiv RPC | Each detected event (not a continuous stream), the join record, sound-sync anchors | Event features + a ~1.5 s waveform excerpt, signed by the phone's own key. **Public by design: it is the evidence.** |
| Sepolia RPC | ENS reads, plus the phone's own head record every 5 readings | The reading count (`seq`) and a timestamp |
| Microphone / motion sensors | Only on this device | Audio is analysed **on the phone** for the sync tones and never uploaded. Motion data leaves the phone only as the event excerpts above. |

## What we do NOT collect
Names, phone numbers, GPS location, flat numbers (phone names are pseudonymous, e.g. `phone-b0a8`), continuous recordings, audio, analytics.

## Trade-offs, stated
- Event times and short waveform excerpts are public on Arkiv. That is the evidence, but it also reveals *when* something shook near a registered phone.
- RPC providers see the IP of whoever reads or writes. Routing reads through EF's anon-rpc was tried in research, but its anonymising path failed in our test (`research/playbook/2026-11-06-features/07-converge-feasibility.md`), so it's on the roadmap.
