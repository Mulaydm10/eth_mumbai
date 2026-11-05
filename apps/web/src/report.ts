// Evidence report for one sealed event: everything a resident attaches to a complaint, plus how anyone can verify it.
// Built entirely from public data (Arkiv event entity → Swarm evidence pack → live ENS resolution). No server of ours.
import { ENS_PARENT, ensPublic, fetchEvents, phoneName, publicClientFor, resolvePhones, swarmUrl } from "@tw/chain";
import { keccak256, toHex } from "viem";
import QRCode from "qrcode";

const q = new URLSearchParams(location.search);
const site = (q.get("site") ?? "").toLowerCase();
const eventId = q.get("event") ?? "";
const $ = (id: string) => document.getElementById(id)!;
const esc = (s: unknown) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const ist = (ms: number) => new Date(ms).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "medium" }) + " IST";
const ARKIV_EXPLORER = "https://rabdi.explorer.arkiv.network";

interface Pack {
  claim: string;
  site: string;
  eventId: string;
  quorum: { k: number; windowMs: number; rule: string };
  event: { tMs: number; sensors: string[]; ppvBandMmS: [number, number] };
  members: { key: string; creator: string; sensor: string; tMs: number; ppvMmS: number; fDomHz: number; label: string }[];
  ens: { site: string; phones: { label: string; name: string; owner: string; resolvesTo: string | null; expiry: number }[]; k: number | null; windowMs: number | null } | null;
  // Optional: packs sealed by earlier versions may not carry these fields. The report must still render them.
  coherence?: { score: number; experimental: boolean } | null;
  clockAlignment?: { method: string; correctionsMs?: Record<string, number> };
  sealedBy: string;
  sealedAt: string;
}

$("print").addEventListener("click", () => window.print());

async function main() {
  if (!site || !eventId) throw new Error("open this page from a sealed event on the dashboard (needs ?site=&event=)");
  const ev = (await fetchEvents(publicClientFor(), site, 0)).filter((e) => e.eventId === eventId).sort((a, b) => a.tMs - b.tMs)[0];
  if (!ev) throw new Error(`no sealed event ${eventId} found on Arkiv for site ${site}`);
  const text = await (await fetch(swarmUrl(ev.swarmRef))).text();
  const hashOk = keccak256(toHex(text)) === ev.packHash;
  const pack = JSON.parse(text) as Pack;
  const live = await resolvePhones(ensPublic(), site, pack.event.sensors).catch(() => new Map<string, string | null>());

  $("subtitle").textContent = `${site}.${ENS_PARENT}.eth · event ${eventId} · generated ${ist(Date.now())}`;
  const members = pack.members
    .map((m) => {
      const name = phoneName(site, m.sensor);
      const now = live.get(m.sensor);
      const snap = pack.ens?.phones.find((p) => p.label === m.sensor);
      return `<tr>
        <td><b>${esc(name)}</b><br><span class="muted small">ENS at sealing: ${snap?.resolvesTo ? esc(snap.resolvesTo) : "–"}<br>ENS now: ${now ? esc(now) : "not resolving (revoked or expired since)"}</span></td>
        <td>${ist(m.tMs).split(", ")[1] ?? ""}</td><td>${m.ppvMmS.toFixed(2)} mm/s</td><td>${m.fDomHz.toFixed(1)} Hz</td>
        <td><a class="mono" href="${ARKIV_EXPLORER}/address/${esc(m.creator)}" target="_blank" rel="noopener">${esc(m.creator)}</a><br><span class="mono muted">entity ${esc(m.key)}</span></td></tr>`;
    })
    .join("");

  const corr = pack.clockAlignment?.correctionsMs ? Object.entries(pack.clockAlignment.correctionsMs).map(([k, v]) => `${esc(k)} ${Math.round(v)} ms`).join(", ") : "";
  $("body").innerHTML = `
    <div class="claim"><b>What this record shows.</b> ${esc(pack.claim)}</div>

    <h2>Event</h2>
    <div class="kv">
      <div>Time</div><div><b>${ist(pack.event.tMs)}</b></div>
      <div>Site</div><div>${esc(site)}.${ENS_PARENT}.eth</div>
      <div>Phones that co-signed</div><div>${pack.event.sensors.length} (quorum rule: at least ${pack.quorum.k} registered phones within ${pack.quorum.windowMs} ms)</div>
      <div>Vibration band (PPV)</div><div><b>${pack.event.ppvBandMmS[0].toFixed(2)} – ${pack.event.ppvBandMmS[1].toFixed(2)} mm/s</b> across the phones</div>
      <div>Clock alignment</div><div>${esc(pack.clockAlignment?.method ?? "phone clocks (pack sealed before clock alignment was recorded)")}${corr ? ` (${corr})` : ""}</div>
      <div>Waveform coherence</div><div>${pack.coherence?.score !== undefined ? `${pack.coherence!.score.toFixed(2)} (experimental indicator, not a verdict)` : "not computed"}</div>
      <div>Sealed</div><div>${esc(pack.sealedAt)} by <span class="mono">${esc(pack.sealedBy)}</span></div>
    </div>

    <h2>Co-signing phones</h2>
    <table><thead><tr><th>Phone (ENS name)</th><th>Time</th><th>PPV</th><th>Freq</th><th>Wallet · Arkiv entity</th></tr></thead><tbody>${members}</tbody></table>

    <h2>Tamper evidence</h2>
    <div class="kv">
      <div>Evidence pack (Swarm)</div><div><a class="mono" href="${swarmUrl(ev.swarmRef)}" target="_blank" rel="noopener">${esc(ev.swarmRef)}</a></div>
      <div>Pack hash (keccak256, on Arkiv)</div><div class="mono">${esc(ev.packHash)}</div>
      <div>Re-checked just now</div><div>${hashOk ? '<b class="ok">✓ the Swarm file matches the hash recorded on Arkiv</b>' : '<b class="bad">✗ MISMATCH: the file does not match the recorded hash</b>'}</div>
      <div>Arkiv event entity</div><div class="mono">${esc(ev.key)} (Rabdi testnet, chain 7794095)</div>
    </div>

    <h2>How to verify this yourself (no account, no permission from us)</h2>
    <ol class="steps">
      <li>Download the evidence pack from the Swarm link above and compute its keccak-256 hash. It must equal the pack hash recorded in the Arkiv event entity.</li>
      <li>Open each wallet on the Arkiv explorer: every reading is a transaction signed by that phone's own key, with a block time.</li>
      <li>Look up each phone's name on <a href="https://sepolia.app.ens.domains/${esc(site)}.${ENS_PARENT}.eth" target="_blank" rel="noopener">ENS (Sepolia)</a>. It is issued by the housing-society committee, cannot be transferred, and can be revoked.</li>
      <li>Re-run the check with the open-source tool: <span class="mono">npx tsx scripts/verify-event.ts ${esc(site)}</span> (repository linked from the dashboard).</li>
    </ol>

    <h2>Limits (stated honestly)</h2>
    <ul class="small">
      <li>Phones are not calibrated geophones. Readings are a corroborated trigger record in a vibration band, not a measurement against a legal limit.</li>
      <li>Phone wall clocks can differ by seconds. Timestamps are aligned by internet reference time and/or the sound-sync signal, as stated above.</li>
      <li>Waveform coherence is an experimental indicator; its thresholds are still being measured.</li>
    </ul>

    <h2>This report</h2>
    <div style="display:flex;gap:14px;align-items:center"><canvas id="qr" width="120" height="120"></canvas><span class="small mono">${esc(location.href)}</span></div>`;
  void QRCode.toCanvas(document.getElementById("qr") as HTMLCanvasElement, location.href, { width: 120, margin: 1 });
}

main().catch((e) => {
  $("body").innerHTML = `<p class="bad">${esc((e as Error).message ?? e)}</p>`;
});
