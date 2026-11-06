// Health / debug page: live, read-only checks against every sponsor stack (Arkiv, ENSv2 on Sepolia, Swarm) plus gas,
// integrity and sound sync, all from public endpoints, so anyone (a judge) can run it. Each check reports ✓ / ⚠ / ✗.
import { alignBySound, emitLags, gapCount, seqGaps } from "@tw/core";
import {
  ENS_DEPLOYER,
  ENS_RESOLVER,
  SEPOLIA_RPC,
  ensPublic,
  fetchEvents,
  fetchInviteRecords,
  fetchSensors,
  fetchSyncs,
  fetchTriggers,
  listSitePhones,
  phoneHeadKey,
  publicClientFor,
  readPhoneHead,
  resolvePhones,
  siteExists,
  siteName,
  siteParams,
  swarmUrl,
} from "@tw/chain";
import { ResolverRoles, permissionedResolverAbi } from "../../../packages/chain/src/ensv2-abi";
import { formatEther, getAddress, keccak256, stringToHex, toHex, type Address } from "viem";
import { showBuild } from "./build";

const ACCESS_KEY = (import.meta.env.VITE_ARKIV_ACCESS_KEY as string | undefined) ?? "";
const arkiv = publicClientFor(ACCESS_KEY);
const ens = ensPublic();
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: unknown) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const q = new URLSearchParams(location.search);
$<HTMLInputElement>("site").value = q.get("site") ?? "test2";

type Status = "ok" | "warn" | "fail";
let counts = { ok: 0, warn: 0, fail: 0 };
const icon = { ok: '<span class="ok">✓</span>', warn: '<span style="color:var(--accent)">⚠</span>', fail: '<span class="bad">✗</span>' };
function row(stack: string, check: string, status: Status, detail: string, ms?: number) {
  counts[status]++;
  $("rows").insertAdjacentHTML("beforeend", `<tr><td>${esc(stack)}</td><td>${esc(check)}</td><td>${icon[status]} ${detail}</td><td class="muted small">${ms === undefined ? "" : `${ms} ms`}</td></tr>`);
  $("summary").textContent = `${counts.ok} ok · ${counts.warn} warn · ${counts.fail} fail`;
}
/** Run a check with timing; any throw becomes a ✗ row instead of stopping the page. */
async function check<T>(stack: string, name: string, f: () => Promise<T>, judge: (v: T) => [Status, string]) {
  const t0 = performance.now();
  try {
    const v = await f();
    const [st, d] = judge(v);
    row(stack, name, st, d, Math.round(performance.now() - t0));
    return v;
  } catch (e) {
    row(stack, name, "fail", esc(String((e as { shortMessage?: string }).shortMessage ?? (e as Error).message ?? e).slice(0, 160)), Math.round(performance.now() - t0));
    return undefined;
  }
}
const ist = (ms: number) => new Date(ms).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });

async function run() {
  const site = $<HTMLInputElement>("site").value.trim().toLowerCase();
  $("dashLink").setAttribute("href", `/dashboard.html?site=${encodeURIComponent(site)}`);
  $("rows").innerHTML = "";
  counts = { ok: 0, warn: 0, fail: 0 };
  const day = Date.now() - 24 * 3600_000;

  // ---------------- Arkiv ----------------
  await check("Arkiv", "RPC reachable, chain 7794095", () => arkiv.getChainId(), (id) => (id === 7794095 ? ["ok", `chain ${id}${ACCESS_KEY ? " · access key in use" : " · public endpoint"}`] : ["fail", `wrong chain ${id}`]));
  await check("Arkiv", "Block timing", () => arkiv.getBlockTiming(), (t) => {
    const lag = Date.now() / 1000 - t.currentBlockTime;
    return [lag < 30 ? "ok" : "warn", `block ${t.currentBlock} · ${t.blockDuration}s blocks · head ${Math.round(lag)} s old`];
  });
  const trig = await check("Arkiv", "Readings (last 24 h)", () => fetchTriggers(arkiv, site, day), (r) => [r.length ? "ok" : "warn", `${r.length} readings${r.length === 100 ? " (page limit)" : ""} · ${r.filter((x) => x.readonly).length} edit-proof`]);
  await check("Arkiv", "Phones joined (24 h)", () => fetchSensors(arkiv, site, day), (r) => [r.length ? "ok" : "warn", `${r.length} join records`]);
  const evs = await check("Arkiv", "Sealed events (all time)", () => fetchEvents(arkiv, site, 0), (r) => [r.length ? "ok" : "warn", `${r.length} sealed${r[0]?.expiresAtMs ? ` · newest stays ${Math.round((r[0].expiresAtMs - Date.now()) / 86_400_000)} more days` : ""}`]);
  const syncs = await check("Arkiv", "Sound-sync anchors (24 h)", () => fetchSyncs(arkiv, site, day), (r) => [r.length ? "ok" : "warn", `${r.length} anchors (${r.filter((a) => a.role === "emit").length} emit, ${r.filter((a) => a.role === "hear").length} hear)`]);
  await check("Arkiv", "Invites audit", () => fetchInviteRecords(arkiv, site, ENS_DEPLOYER), (r) => ["ok", `${r.filter((x) => x.kind === "issued").length} issued · ${r.filter((x) => x.kind === "used").length} used`]);

  // ---------------- ENSv2 ----------------
  const exists = await check("ENSv2", `${siteName(site)} exists`, () => siteExists(ens, site), (ok) => (ok ? ["ok", "registered"] : ["fail", "site name not registered (joins create it on first invited phone)"]));
  if (exists) {
    await check("ENSv2", "Quorum text records", () => siteParams(ens, site), (p) => (p.k && p.windowMs ? ["ok", `tw.k=${p.k} · tw.window_ms=${p.windowMs}`] : ["warn", `tw.k=${p.k} tw.window_ms=${p.windowMs}`]));
    const phones = (await check("ENSv2", "Live phones (registry logs)", () => listSitePhones(ens, site), (p) => [p.length ? "ok" : "warn", `${p.length}: ${p.map((x) => esc(x.label)).join(", ")}`])) ?? [];
    const resolved = await resolvePhones(ens, site, phones.map((p) => p.label)).catch(() => new Map<string, string | null>());
    for (const p of phones) {
      const r = resolved.get(p.label);
      row("ENSv2", `${p.label}: resolves to owner`, r && getAddress(r) === getAddress(p.owner) ? "ok" : "fail", `${r ? esc(r.slice(0, 10)) + "…" : "not resolving"} · expires ${new Date(p.expiry * 1000).toLocaleDateString()}`);
      const resource = BigInt(keccak256(stringToHex(phoneHeadKey(site, p.label))));
      await check("ENSv2", `${p.label}: head-write grant (EAC)`, () => ens.readContract({ address: ENS_RESOLVER, abi: permissionedResolverAbi, functionName: "roles", args: [resource, getAddress(p.owner)] }) as Promise<bigint>, (roles) =>
        (roles & ResolverRoles.ROLE_SET_TEXT) !== 0n ? ["ok", "may write its own head key only"] : ["fail", "missing: rejoin the phone (ens-register backfills it)"],
      );
      const head = await readPhoneHead(ens, site, p.label);
      const mine = (trig ?? []).filter((t) => t.sensor === p.label);
      const maxSeq = Math.max(0, ...mine.map((t) => t.seq ?? 0));
      const gaps = seqGaps(mine.map((t) => t.seq ?? NaN));
      row("Integrity", `${p.label}: readings`, gaps.length ? "warn" : mine.length ? "ok" : "warn", mine.length ? `last ${ist(Math.max(...mine.map((t) => t.tMs)))} · highest #${maxSeq} · ${gaps.length ? `${gapCount(gaps)} missing` : "no gaps"}` : "no readings in 24 h");
      row("Integrity", `${p.label}: ENS head`, head ? (maxSeq && head.seq > maxSeq ? "warn" : "ok") : "warn", head ? `#${head.seq} at ${ist(head.tMs)}${maxSeq && head.seq > maxSeq ? ` · Arkiv only up to #${maxSeq}` : ""}` : "never published (publishes every 5 readings and on Stop)");
      // Gas for this phone on both chains.
      await check("Gas", `${p.label}: tGLM (Arkiv) + Sepolia ETH`, async () => [await arkiv.getBalance({ address: p.owner as Address }), await ens.getBalance({ address: p.owner as Address })] as const, ([a, s]) => [
        a > 0n && s > 0n ? "ok" : "warn",
        `${Number(formatEther(a)).toFixed(4)} tGLM · ${Number(formatEther(s)).toFixed(5)} SepETH${a === 0n ? " · no Arkiv gas" : ""}${s === 0n ? " · can't write ENS head" : ""}`,
      ]);
    }
  }
  await check("Gas", "Committee / funder balances", async () => [await arkiv.getBalance({ address: ENS_DEPLOYER }), await ens.getBalance({ address: ENS_DEPLOYER })] as const, ([a, s]) => [
    a > 10n ** 18n && s > 10n ** 16n ? "ok" : "warn",
    `${Number(formatEther(a)).toFixed(3)} tGLM · ${Number(formatEther(s)).toFixed(4)} SepETH (drips phones)`,
  ]);
  await check("ENSv2", "Sepolia RPC", () => ens.getBlockNumber(), (b) => ["ok", `block ${b} via ${SEPOLIA_RPC.replace("https://", "")}`]);

  // ---------------- Swarm ----------------
  const latest = (evs ?? []).sort((a, b) => b.tMs - a.tMs)[0];
  if (latest) {
    await check("Swarm", "Latest evidence pack: download + hash", async () => {
      const text = await (await fetch(swarmUrl(latest.swarmRef))).text();
      return keccak256(toHex(text)) === latest.packHash ? text.length : -1;
    }, (n) => (n > 0 ? ["ok", `${(n / 1024).toFixed(1)} KB · keccak matches Arkiv · <a href="${swarmUrl(latest.swarmRef)}" target="_blank" rel="noopener">open</a>`] : ["fail", "hash MISMATCH"]));
  } else row("Swarm", "Latest evidence pack", "warn", "no sealed event at this site yet");

  // ---------------- Sound sync ----------------
  if (syncs && syncs.length) {
    const s = alignBySound(syncs);
    const lags = emitLags(syncs);
    row("Sound sync", "Latest session", s ? "ok" : "warn", s ? `#${s.chirp ?? "v1"} · ${[...s.corrections].map(([k, v]) => `${esc(k)} ${Math.round(v)} ms`).join(", ")}` : "no chirp heard by ≥2 phones yet");
    row("Sound sync", "Learned emit→hear lag", lags.size ? "ok" : "warn", lags.size ? [...lags].map(([k, v]) => `${esc(k)} ${v} ms`).join(", ") : "no phone has heard its own chirp yet");
  }
}

$("run").addEventListener("click", () => void run());
$<HTMLInputElement>("site").addEventListener("change", () => void run());
void run();
showBuild();
