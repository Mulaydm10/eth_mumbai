// Dashboard: reads phones and triggers straight from Arkiv and recomputes the quorum in the browser.
// Prototype 1 trust rule: the first MAX_PHONES distinct phones (by join time) at a site count; a trigger counts only
// if its Arkiv $creator is the wallet that registered that phone name. Prototype 2 replaces this with ENS names.
import { computeQuorum, type Trigger } from "@tw/core";
import { fetchSensors, fetchTriggers, publicClientFor, type SensorRow } from "@tw/chain";

const MAX_PHONES = 5;
const EXPLORER = "https://rabdi.explorer.arkiv.network";
const ACCESS_KEY = (import.meta.env.VITE_ARKIV_ACCESS_KEY as string | undefined) ?? "";
const client = publicClientFor(ACCESS_KEY);

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

let busy = false;
async function refresh() {
  if (busy) return;
  busy = true;
  const site = ui.site.value.trim();
  ui.joinLink.textContent = `${location.origin}/?site=${encodeURIComponent(site)}`;
  try {
    const since = Date.now() - Number(ui.mins.value || 30) * 60_000;
    const [sensors, rows] = await Promise.all([fetchSensors(client, site, since - 6 * 3600_000), fetchTriggers(client, site, since)]);
    const { inside, over } = admitted(sensors);
    const owner = new Map(inside.map((s) => [s.sensor, s.creator.toLowerCase()]));
    const triggers: Trigger[] = rows.map((r) => ({ id: r.key, sensor: r.sensor, creator: r.creator, tMs: r.tMs, ppvMmS: r.ppvMmS, fDomHz: r.fDomHz, label: r.label }));
    const k = Math.max(1, Math.min(MAX_PHONES, Number(ui.k.value || 3)));
    const res = computeQuorum(triggers, {
      k,
      windowMs: Number(ui.win.value || 2000),
      isLive: (sensor, creator) => owner.get(sensor) === creator.toLowerCase(),
    });

    ui.nSensors.textContent = `${inside.length}${over.length ? ` (+${over.length} over limit)` : ""}`;
    ui.nEvents.textContent = String(res.events.length);
    ui.nTriggers.textContent = String(rows.length);
    ui.nRejected.textContent = String(res.rejected.length);

    ui.sensors.innerHTML =
      [...inside.map((s) => [s, ""] as const), ...over.map((s) => [s, " <span class='bad'>over limit</span>"] as const)]
        .map(
          ([s, extra]) =>
            `<tr><td><b>${esc(s.sensor)}</b>${extra}</td><td>${s.rateHz.toFixed(1)} Hz</td><td>${esc(s.api)}</td><td>${time(s.startedMs)}</td><td><a href="${EXPLORER}/address/${s.creator}" target="_blank" rel="noopener">${short(s.creator)}</a></td></tr>`,
        )
        .join("") || `<tr><td colspan="5" class="muted">No phones yet. Open the join link on a phone and press Start.</td></tr>`;

    ui.events.innerHTML =
      res.events
        .slice()
        .reverse()
        .map((e) => `<tr><td>${time(e.tMs)}</td><td class="ok">${e.sensors.length}/${k}+ · ${e.sensors.map(esc).join(", ")}</td><td>${e.ppvMinMmS.toFixed(2)}–${e.ppvMaxMmS.toFixed(2)} mm/s</td></tr>`)
        .join("") || `<tr><td colspan="3" class="muted">None yet. Stomp near ${k} phones at once.</td></tr>`;

    const reason = new Map(res.rejected.map((r) => [r.trigger.id, r.reason]));
    const confirmed = new Set(res.events.flatMap((e) => e.members.map((m) => m.id)));
    ui.triggers.innerHTML =
      rows
        .map((r) => {
          const why = confirmed.has(r.key) ? `<span class="ok">in event</span>` : reason.has(r.key) ? `<span class="bad">${reason.get(r.key)}</span>` : `<span class="muted">grouped</span>`;
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
