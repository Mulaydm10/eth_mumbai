// Swarm storage via the public gateway (no Bee node, no postage purchase: the gateway's null stamp).
// Verified by live probes in research/tremor-witness/sponsors/docs-swarm.md. Retention of free uploads is not
// documented, so every pack's keccak hash is also recorded on Arkiv: anyone can re-upload and re-verify it.
export const SWARM_GATEWAY = "https://api.gateway.ethswarm.org";
const NULL_STAMP = "0".repeat(64);

export async function swarmUploadJson(name: string, obj: unknown, gateway = SWARM_GATEWAY): Promise<string> {
  const r = await fetch(`${gateway}/bzz?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "content-type": "application/json", "swarm-postage-batch-id": NULL_STAMP },
    body: JSON.stringify(obj),
  });
  if (!r.ok) throw new Error(`Swarm upload failed: HTTP ${r.status} ${await r.text().catch(() => "")}`.slice(0, 200));
  const { reference } = (await r.json()) as { reference: string };
  if (!/^[0-9a-f]{64}$/i.test(reference)) throw new Error(`Swarm returned an unexpected reference: ${reference}`);
  return reference;
}

export const swarmUrl = (ref: string, gateway = SWARM_GATEWAY) => `${gateway}/bzz/${ref}/`;

export async function swarmFetchJson<T = unknown>(ref: string, gateway = SWARM_GATEWAY): Promise<T> {
  const r = await fetch(swarmUrl(ref, gateway));
  if (!r.ok) throw new Error(`Swarm read failed: HTTP ${r.status}`);
  return (await r.json()) as T;
}
