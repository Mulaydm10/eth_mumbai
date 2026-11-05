// Independently verify sealed events: Arkiv pointer → Swarm pack → keccak hash matches → members exist on Arkiv.
// Usage: npx tsx scripts/verify-event.ts <site> [minutes=180]
import { fetchEvents, fetchTriggers, publicClientFor, swarmUrl } from "@tw/chain";
import { keccak256, toHex } from "viem";

const site = process.argv[2] ?? "demo";
const since = Date.now() - Number(process.argv[3] ?? 180) * 60_000;
const p = publicClientFor(process.env.ARKIV_ACCESS_KEY ?? "");
const [events, triggers] = await Promise.all([fetchEvents(p, site, since), fetchTriggers(p, site, since - 3600_000)]);
const keys = new Set(triggers.map((t) => t.key));
for (const e of events) {
  const text = await (await fetch(swarmUrl(e.swarmRef))).text();
  const hashOk = keccak256(toHex(text)) === e.packHash;
  const pack = JSON.parse(text) as { members: { key: string }[]; event: { sensors: string[] } };
  const membersOk = pack.members.every((m) => keys.has(m.key));
  console.log(`${e.eventId} ${new Date(e.tMs).toISOString()} sensors=${e.sensors.join(",")} swarm=${e.swarmRef.slice(0, 12)}… hash=${hashOk ? "OK" : "MISMATCH"} members-on-arkiv=${membersOk ? "OK" : "MISSING"} (${pack.members.length} with waveforms)`);
}
if (!events.length) console.log("no sealed events");
