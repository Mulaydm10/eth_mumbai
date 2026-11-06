// Dashboard: reads phones and triggers straight from Arkiv and recomputes the quorum in the browser.
// Prototype 1 trust rule: the first MAX_PHONES distinct phones (by join time) at a site count; a trigger counts only
// if its Arkiv $creator is the wallet that registered that phone name. Prototype 2 replaces this with ENS names.
import { alignBySound, asOfCheck, coherence, type AsOfReason, type RegistrationInterval, computeQuorum, correctTime, type CoherenceResult, type SyncSession, type Trigger } from "@tw/core";
import { ENS_DEPLOYER, encodeInvite as _encInv, fetchInviteRecords, ensPublic, siteRegistrationHistory, listSitePhones, resolvePhones, siteExists, siteName, siteParams, type EnsPhone, fetchEvents, fetchSensors, fetchSyncs, fetchTriggers, publicClientFor, swarmUploadJson, swarmUrl, walletClientFor, writeEvent, type SensorRow, type TriggerRow } from "@tw/chain";
import { keccak256, toHex, type Hex } from "viem";
import QRCode from "qrcode";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const MAX_PHONES = 5;
const EXPLORER = "https://rabdi.explorer.arkiv.network";
const ACCESS_KEY = (import.meta.env.VITE_ARKIV_ACCESS_KEY as string | undefined) ?? "";
const client = publicClientFor(ACCESS_KEY);

// ---- Sealing: any viewer can seal a confirmed event (Swarm pack + Arkiv pointer). Same event => same eventId. ----
function ls(k: string, v?: string) {
  try {
    if (v !== undefined) localStorage.setItem(k, v);
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
let sealKey = ls("tw.sealkey") as Hex | null;
if (!sealKey) sealKey = ls("tw.sealkey", generatePrivateKey()) as Hex | null;
const sealPk = (sealKey ?? generatePrivateKey()) as Hex;
const sealAddr = privateKeyToAccount(sealPk).address;
const sealWallet = walletClientFor(sealPk, ACCESS_KEY);
let gasState: "unknown" | "ok" | "unavailable" = "unknown";
async function ensureSealGas() {
  if (gasState !== "unknown") return gasState === "ok";
  try {
    const r = await fetch("/api/drip", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: sealAddr }) });
    gasState = r.ok && ((await r.json()) as { ok: boolean }).ok ? "ok" : "unavailable";
  } catch {
    gasState = "unavailable"; // e.g. the Swarm-hosted copy has no /api: it stays read-only, which is the point
  }
  return gasState === "ok";
}
const sealing = new Map<string, "sealing" | "error">();
const eventIdOf = (memberKeys: string[]) => keccak256(toHex([...memberKeys].sort().join(","))).slice(0, 34);

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const q = new URLSearchParams(location.search);
const ui = {
  site: $<HTMLInputElement>("site"),
  k: $<HTMLInputElement>("k"),
  win: $<HTMLInputElement>("win"),
  mins: $<HTMLInputElement>("mins"),
  sync: $("sync"),
  nSensors: $("nSensors"),
  nEvents: $("nEvents"),
  nTriggers: $("nTriggers"),
  nRejected: $("nRejected"),
  joinLink: $("joinLink"),
  sensors: $("sensors"),
  events: $("events"),
  triggers: $("triggers"),
  autoseal: $<HTMLInputElement>("autoseal"),
  trust: $("trust"),
  inviteNote: $("inviteNote"),
  invites: $("invites"),
  sealedAll: $("sealedAll"),
};
ui.site.value = q.get("site") ?? "demo";
if (q.get("k")) ui.k.value = q.get("k")!;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const time = (ms: number) => new Date(ms).toLocaleTimeString();
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

/** First MAX_PHONES distinct phone names by earliest join; each name is bound to the wallet that first registered it. */
function admitted(sensors: SensorRow[]) {
  const byName = new Map<string, SensorRow>();
  for (const s of [...sensors].sort((a, b) => a.startedMs - b.startedMs)) {
    if (!byName.has(s.sensor)) byName.set(s.sensor, s);
  }
  const all = [...byName.values()];
  return { inside: all.slice(0, MAX_PHONES), over: all.slice(MAX_PHONES) };
}

type QEvent = ReturnType<typeof computeQuorum>["events"][number];

/** Evidence pack → Swarm, then a pointer + hash entity on Arkiv. Sequential via `sealQueue`. */
let sealQueue: Promise<unknown> = Promise.resolve();
function seal(site: string, id: string, e: QEvent, k: number, windowMs: number, registry: SensorRow[]) {
  sealing.set(id, "sealing");
  sealQueue = sealQueue.then(async () => {
    try {
      if (!(await ensureSealGas())) throw new Error("no gas (read-only copy)");
      const memberKeys = new Set(e.members.map((m) => m.id));
      const full: TriggerRow[] = (await fetchTriggers(client, site, e.tMs - windowMs - 60_000, true)).filter((r) => memberKeys.has(r.key));
      const pack = {
        app: "tremor-witness",
        packVersion: 1,
        claim: "A corroborated vibration event in this band occurred at this time, co-signed by these registered phones. Not a claim that any legal limit was exceeded.",
        site,
        eventId: id,
        quorum: { k, windowMs, rule: "k distinct registered phones, structural label, within windowMs (packages/core/src/quorum.ts)" },
        membershipRule: "as-of (T13): each phone's ENSv2 name was registered to the writing wallet at the reading's claimed time AND at the Arkiv block that recorded it (packages/core/src/registry.ts). Revocation stops future readings only.",
        event: { tMs: e.tMs, iso: new Date(e.tMs).toISOString(), sensors: e.sensors, ppvBandMmS: [e.ppvMinMmS, e.ppvMaxMmS] },
        members: full,
        registry: registry.map((r) => ({ sensor: r.sensor, wallet: r.creator, joinedMs: r.startedMs, arkivKey: r.key })),
        ens: lastEns.ok ? { site: lastEns.siteName, phones: lastEns.phones.map((p) => ({ ...p, resolvesTo: lastEns.ok ? lastEns.resolved.get(p.label) : null })), k: lastEns.k, windowMs: lastEns.windowMs, snapshotAt: new Date().toISOString() } : null,
        source: { arkiv: { chain: "rabdi", chainId: 7794095 }, triggerSchema: "tremor-witness.v1.trigger" },
        coherence: (() => {
          const c = eventCoherence(id, e);
          return c ? { experimental: true, note: "indicator only; thresholds not yet measured (EXP-0001)", score: c.score, pairs: c.pairs } : null;
        })(),
        clockAlignment: lastSync ? { method: "sound", refMs: lastSync.refMs, correctionsMs: Object.fromEntries(lastSync.corrections) } : { method: "phone clocks (+ internet reference sync when online)" },
        sealedBy: sealAddr,
        sealedAt: new Date().toISOString(),
      };
      const json = JSON.stringify(pack);
      const packHash = keccak256(toHex(json));
      const swarmRef = await swarmUploadJson(`tremor-witness-${site}-${id}.json`, pack);
      await writeEvent(sealWallet, { site, eventId: id, tMs: e.tMs, k, sensors: e.sensors, ppvMinMmS: e.ppvMinMmS, ppvMaxMmS: e.ppvMaxMmS, swarmRef, packHash });
      sealing.delete(id);
    } catch (err) {
      console.warn("seal failed", err);
      sealing.set(id, "error");
    }
  });
}

// ---- ENSv2 registry reads (browser, public Sepolia RPC; no server of ours) ----
const ensClient = ensPublic();
let lastEns: EnsState = { ok: false, error: "not read yet" };
let lastSync: SyncSession | null = null;
const asOfWhy = new Map<string, AsOfReason>();
type EnsState =
  | { ok: true; siteName: string; phones: EnsPhone[]; resolved: Map<string, string | null>; history: RegistrationInterval[]; k: number | null; windowMs: number | null }
  | { ok: false; error: string };
async function readEns(site: string): Promise<EnsState> {
  try {
    if (!(await siteExists(ensClient, site))) return { ok: false, error: "no such site name" };
    const [phones, params, history] = await Promise.all([listSitePhones(ensClient, site), siteParams(ensClient, site), siteRegistrationHistory(ensClient, site)]);
    const resolved = await resolvePhones(ensClient, site, phones.map((p) => p.label));
    return { ok: true, siteName: siteName(site), phones, resolved, history, k: params.k, windowMs: params.windowMs };
  } catch (e) {
    return { ok: false, error: String((e as Error).message ?? e).slice(0, 80) };
  }
}

// Committee revoke (passcode-protected endpoint; the transaction itself is an ENSv2 unregister by the committee).
document.addEventListener("click", async (ev) => {
  const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>("button[data-revoke]");
  if (!btn) return;
  const label = btn.dataset.revoke!;
  let pass = sessionStorage.getItem("tw.pass") ?? "";
  if (!pass) pass = prompt(`Committee passcode to revoke ${label}:`) ?? "";
  if (!pass) return;
  btn.disabled = true;
  btn.textContent = "Revoking…";
  try {
    const r = await fetch("/api/ens-revoke", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ site: ui.site.value.trim(), label, pass }) });
    const j = (await r.json()) as { ok: boolean; error?: string };
    if (!j.ok) throw new Error(j.error ?? String(r.status));
    sessionStorage.setItem("tw.pass", pass);
    btn.textContent = "Revoked ✓";
    void refresh();
  } catch (e) {
    if (String(e).includes("passcode")) sessionStorage.removeItem("tw.pass");
    btn.textContent = `Failed: ${String((e as Error).message ?? e).slice(0, 40)}`;
    btn.disabled = false;
  }
});

// ---- Waveform coherence (EXPERIMENTAL indicator, see EXP-0001): do member waveforms look like one source? ----
const waveCache = new Map<string, NonNullable<TriggerRow["wave"]>>();
const cohCache = new Map<string, CoherenceResult>();
async function ensureWaves(site: string, sinceMs: number, keys: string[]) {
  if (keys.every((k) => waveCache.has(k))) return;
  for (const r of await fetchTriggers(client, site, sinceMs, true)) if (r.wave) waveCache.set(r.key, r.wave);
}
function eventCoherence(id: string, e: QEvent): CoherenceResult | null {
  if (cohCache.has(id)) return cohCache.get(id)!;
  const waves = e.members.map((m) => ({ m, w: waveCache.get(m.id) }));
  if (waves.some((x) => !x.w)) return null;
  // m.tMs is already clock-corrected (sound sync); the excerpt starts 300 ms before the trigger.
  const r = coherence(waves.map(({ m, w }) => ({ sensor: m.sensor, fs: w!.fs, x: w!.x, y: w!.y, z: w!.z, t0Ms: m.tMs - 300 })));
  cohCache.set(id, r);
  return r;
}
const cohCell = (r: CoherenceResult | null) => {
  if (!r) return `<span class="muted">…</span>`;
  const lag = Math.max(...r.pairs.map((p) => Math.abs(p.lagMs)), 0);
  return `<span title="experimental indicator; thresholds not yet measured (EXP-0001)">${r.score.toFixed(2)} · lag ${Math.round(lag)} ms</span>`;
};

// ---- T14 invites: committee creates a one-time QR; every issue/use is public on Arkiv ----
let activeInvite: { url: string; exp: number } | null = null;
document.getElementById("inviteBtn")!.addEventListener("click", async () => {
  const site = ui.site.value.trim();
  let pass = sessionStorage.getItem("tw.pass") ?? "";
  if (!pass) pass = prompt("Committee passcode to create an invite:") ?? "";
  if (!pass) return;
  ui.inviteNote.textContent = "Signing invite and logging it on Arkiv…";
  try {
    const r = await fetch("/api/ens-invite", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ site, pass }) });
    const j = (await r.json()) as { ok: boolean; invite?: string; exp?: number; inviteId?: string; error?: string };
    if (!j.ok || !j.invite) throw new Error(j.error ?? String(r.status));
    sessionStorage.setItem("tw.pass", pass);
    const base = location.origin.startsWith("http") && !location.origin.includes("localhost") ? location.origin : "https://tremor-witness.vercel.app";
    activeInvite = { url: `${base}/?site=${encodeURIComponent(site)}&inv=${j.invite}`, exp: j.exp! };
    ui.joinLink.textContent = `one-time invite ${j.inviteId!.slice(0, 8)}… (valid until ${new Date(j.exp!).toLocaleTimeString()})`;
    ui.inviteNote.textContent = "Scan with ONE new phone. Single use, 30 minutes; the issue and the use are logged publicly on Arkiv.";
    void QRCode.toCanvas($<HTMLCanvasElement>("joinQr"), activeInvite.url, { width: 220, margin: 1 });
  } catch (e) {
    if (String(e).includes("passcode")) sessionStorage.removeItem("tw.pass");
    ui.inviteNote.textContent = `Invite failed: ${String((e as Error).message ?? e).slice(0, 80)}`;
  }
});
let invitesBusy = false;
async function refreshInvites(site: string) {
  if (invitesBusy) return;
  invitesBusy = true;
  try {
    const recs = await fetchInviteRecords(client, site, ENS_DEPLOYER);
    const issued = recs.filter((r) => r.kind === "issued");
    const used = recs.filter((r) => r.kind === "used");
    ui.invites.innerHTML = `Invites (public audit on Arkiv, committee-signed): <b>${issued.length}</b> issued · <b>${used.length}</b> used${used.length ? " — " + used.slice(0, 5).map((u) => `${esc(u.label)} ← ${esc(u.inviteId.slice(0, 8))}`).join(", ") : ""}`;
  } catch {
    /* audit list is best-effort */
  } finally {
    invitesBusy = false;
  }
}
void _encInv;

let busy = false;
async function refresh() {
  if (busy) return;
  busy = true;
  const site = ui.site.value.trim();
  const join = `${location.origin.startsWith("http") && !location.origin.includes("localhost") ? location.origin : "https://tremor-witness.vercel.app"}/?site=${encodeURIComponent(site)}`;
  if (activeInvite && activeInvite.exp < Date.now()) {
    activeInvite = null;
    ui.inviteNote.textContent = "Invite expired. New phones need a committee invite.";
  }
  void refreshInvites(site);
  if (!activeInvite && ui.joinLink.textContent !== join) {
    ui.joinLink.textContent = join;
    void QRCode.toCanvas($<HTMLCanvasElement>("joinQr"), join, { width: 220, margin: 1 });
  }
  try {
    const since = Date.now() - Number(ui.mins.value || 30) * 60_000;
    const [sensors, allRows, ens] = await Promise.all([fetchSensors(client, site, since - 6 * 3600_000), fetchTriggers(client, site, since), readEns(site)]);
    lastEns = ens;
    // Ignore triggers stamped more than 1 min in the future (pre-fix phones used a boot-time clock).
    const rows = allRows.filter((r) => r.tMs < Date.now() + 60_000);
    // Offline clock alignment: if phones heard a sound-sync signal, correct each phone's timestamps to the shared instant.
    // Only anchors written by a phone's own wallet count (same $creator rule as triggers).
    const syncs = await fetchSyncs(client, site, since - 6 * 3600_000).catch(() => []);
    const creatorOf = new Map(rows.map((r) => [r.sensor, r.creator.toLowerCase()]));
    const session: SyncSession | null = alignBySound(syncs.filter((a) => !creatorOf.has(a.sensor) || creatorOf.get(a.sensor) === a.creator.toLowerCase()));
    lastSync = session;
    const triggers: Trigger[] = rows.map((r) => ({ id: r.key, sensor: r.sensor, creator: r.creator, tMs: correctTime(r.sensor, r.tMs, session), ppvMmS: r.ppvMmS, fDomHz: r.fDomHz, label: r.label, createdAtMs: r.createdAtMs }));

    // TRUST RULE (Prototype 3): a trigger counts only if <sensor>.<site>.tremorwitness.eth resolves RIGHT NOW to the
    // trigger's Arkiv $creator. Revoked or expired names resolve to nothing, so their readings stop counting.
    // Fallback (site not in ENS): first-writer rule from Prototype 2, flagged on screen as weaker.
    let isLive: (sensor: string, creator: string, tMs: number, t: Trigger) => boolean;
    let phoneCount: number;
    if (ens.ok) {
      // T13 as-of rule: registered to this wallet at the reading's claimed time AND when Arkiv recorded it.
      // Uses the RAW claimed time (what the phone signed), not the sound-sync-corrected one.
      const rawT = new Map(rows.map((r) => [r.key, r.tMs]));
      isLive = (_s, _c, _t, t) => {
        const why = asOfCheck(ens.history, { sensor: t.sensor, creator: t.creator, tMs: rawT.get(t.id) ?? t.tMs, createdAtMs: t.createdAtMs });
        asOfWhy.set(t.id, why);
        return why === "ok";
      };
      phoneCount = ens.phones.length;
      ui.trust.innerHTML = `${lastSync ? `<span class="ok">Clocks aligned by sound sync</span> (${[...lastSync.corrections].map(([k, v]) => `${esc(k)} ${v >= 0 ? "−" : "+"}${Math.abs(Math.round(v))} ms`).join(", ")}) · ` : ""}<span class="ok">Registry: ENSv2 (as-of: registered when recorded)</span> · <a href="https://sepolia.app.ens.domains/${esc(ens.siteName)}" target="_blank" rel="noopener">${esc(ens.siteName)}</a> · params from ENS text records: k=${ens.k ?? "–"}, window=${ens.windowMs ?? "–"} ms`;
    } else {
      const { inside } = admitted(sensors);
      const owner = new Map(inside.map((s) => [s.sensor, s.creator.toLowerCase()]));
      isLive = (sensor, creator) => owner.get(sensor) === creator.toLowerCase();
      phoneCount = inside.length;
      ui.trust.innerHTML = `<span class="bad">Site not registered in ENS (${esc(ens.error)})</span>: using the weaker first-writer rule.`;
    }
    // k / window: manual override → ENS text records → auto.
    const k = ui.k.value ? Math.max(1, Math.min(MAX_PHONES, Number(ui.k.value))) : (ens.ok && ens.k) || Math.max(2, Math.min(3, phoneCount));
    const windowMs = ui.win.value ? Number(ui.win.value) : (ens.ok && ens.windowMs) || 2000;
    const res = computeQuorum(triggers, { k, windowMs, isLive });

    ui.nSensors.textContent = String(phoneCount);
    ui.nEvents.textContent = String(res.events.length);
    ui.nTriggers.textContent = String(rows.length);
    ui.nRejected.textContent = String(res.rejected.length);

    const arkivInfo = new Map(sensors.map((s) => [s.sensor, s]));
    ui.sensors.innerHTML = ens.ok
      ? ens.phones
          .map((p) => {
            const a = arkivInfo.get(p.label);
            const live = (ens.resolved.get(p.label) ?? "").toLowerCase() === p.owner.toLowerCase();
            return `<tr><td><b>${esc(p.label)}</b><br><span class="muted small">${esc(p.name)}</span></td><td>${a ? `${a.rateHz.toFixed(1)} Hz` : "–"}</td><td>${live ? '<span class="ok">resolves ✓</span>' : '<span class="bad">not resolving</span>'}<br><span class="muted small">expires ${new Date(p.expiry * 1000).toLocaleDateString()}</span></td><td><a href="${EXPLORER}/address/${p.owner}" target="_blank" rel="noopener">${short(p.owner)}</a></td><td><button class="ghost" data-revoke="${esc(p.label)}">Revoke</button></td></tr>`;
          })
          .join("") || `<tr><td colspan="5" class="muted">No phones registered in ENS yet. Open the join link on a phone and press Start.</td></tr>`
      : sensors
          .map((s) => `<tr><td><b>${esc(s.sensor)}</b></td><td>${s.rateHz.toFixed(1)} Hz</td><td class="muted">no ENS</td><td><a href="${EXPLORER}/address/${s.creator}" target="_blank" rel="noopener">${short(s.creator)}</a></td><td></td></tr>`)
          .join("") || `<tr><td colspan="5" class="muted">No phones yet.</td></tr>`;

    // Tier 0.6: always show the latest sealed evidence regardless of the time window, so a judge opening the link
    // alone sees real records (the live window above is for what is happening now).
    void fetchEvents(client, site, 0).then((all) => {
      const seen = new Set<string>();
      const latest = all.sort((a, b) => b.tMs - a.tMs).filter((e) => !seen.has(e.eventId) && seen.add(e.eventId)).slice(0, 10);
      ui.sealedAll.innerHTML =
        latest
          .map((e) => `<tr><td>${new Date(e.tMs).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "medium" })}</td><td>${e.sensors.map(esc).join(", ")}</td><td>${e.ppvMinMmS.toFixed(2)}–${e.ppvMaxMmS.toFixed(2)} mm/s</td><td><a href="./report.html?site=${encodeURIComponent(site)}&event=${e.eventId}" target="_blank" rel="noopener">report</a> · <a href="${swarmUrl(e.swarmRef)}" target="_blank" rel="noopener">Swarm pack</a></td></tr>`)
          .join("") || `<tr><td colspan="4" class="muted">No sealed events at this site yet.</td></tr>`;
    }).catch(() => undefined);
    // Sealed events on Arkiv (first seal per eventId wins; duplicates from other viewers are harmless).
    const sealed = new Map<string, { swarmRef: string; key: string }>();
    for (const ev of (await fetchEvents(client, site, since)).sort((a, b) => a.tMs - b.tMs)) {
      if (!sealed.has(ev.eventId)) sealed.set(ev.eventId, { swarmRef: ev.swarmRef, key: ev.key });
    }
    const withIds = res.events.map((e) => ({ e, id: eventIdOf(e.members.map((m) => m.id)) }));
    if (withIds.length) await ensureWaves(site, since, withIds.flatMap(({ e }) => e.members.map((m) => m.id))).catch(() => undefined);
    ui.events.innerHTML =
      withIds
        .slice()
        .reverse()
        .map(({ e, id }) => {
          const s = sealed.get(id);
          const st = s
            ? `<a class="ok" href="${swarmUrl(s.swarmRef)}" target="_blank" rel="noopener">sealed ✓ Swarm</a>`
            : sealing.get(id) === "sealing"
              ? `<span class="muted">sealing…</span>`
              : sealing.get(id) === "error"
                ? `<span class="bad">seal failed</span>`
                : `<span class="muted">not sealed</span>`;
          return `<tr><td>${time(e.tMs)}</td><td class="ok">${e.sensors.length}/${k}+ · ${e.sensors.map(esc).join(", ")}</td><td>${e.ppvMinMmS.toFixed(2)}–${e.ppvMaxMmS.toFixed(2)} mm/s</td><td>${cohCell(eventCoherence(id, e))}</td><td>${st}${s ? ` · <a href="./report.html?site=${encodeURIComponent(site)}&event=${id}" target="_blank" rel="noopener">report</a>` : ""}</td></tr>`;
        })
        .join("") || `<tr><td colspan="5" class="muted">None yet. Stomp near ${k} phones at once.</td></tr>`;
    if (ui.autoseal.checked) {
      for (const { e, id } of withIds) {
        if (!sealed.has(id) && !sealing.has(id)) void seal(site, id, e, k, windowMs, sensors);
      }
    }

    const reason = new Map(res.rejected.map((r) => [r.trigger.id, r.reason]));
    const confirmed = new Set(res.events.flatMap((e) => e.members.map((m) => m.id)));
    ui.triggers.innerHTML =
      rows
        .map((r) => {
          const why = confirmed.has(r.key) ? `<span class="ok">in event</span>` : reason.has(r.key) ? `<span class="bad">${reason.get(r.key) === "not-registered" && asOfWhy.get(r.key) ? asOfWhy.get(r.key) : reason.get(r.key)}</span>` : `<span class="muted">grouped</span>`;
          return `<tr><td>${time(r.tMs)}</td><td>${esc(r.sensor)}</td><td>${r.ppvMmS.toFixed(2)} mm/s</td><td>${r.fDomHz.toFixed(1)} Hz</td><td>${r.label}</td><td>${why}</td></tr>`;
        })
        .join("") || `<tr><td colspan="6" class="muted">No triggers in this window.</td></tr>`;

    ui.sync.textContent = `synced ${new Date().toLocaleTimeString()} from Arkiv`;
    ui.sync.className = "muted small";
  } catch (e) {
    ui.sync.textContent = `Arkiv read failed: ${String((e as Error).message ?? e).slice(0, 120)}`;
    ui.sync.className = "bad small";
  } finally {
    busy = false;
  }
}

for (const el of [ui.site, ui.k, ui.win, ui.mins]) el.addEventListener("change", () => void refresh());
void refresh();
setInterval(() => void refresh(), 4000);
