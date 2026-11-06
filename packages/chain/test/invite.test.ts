import { describe, expect, it } from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { decodeInvite, encodeInvite, inviteMessage, inviteSigner, MAX_INVITE_USES } from "../src/invite";
import { isMeshLabel, MAX_MESH_PHONES_PER_SITE, MAX_PHONES_PER_SITE } from "../src/ens";

const committee = privateKeyToAccount(generatePrivateKey());
const id = "0123456789abcdef0123456789abcdef";

describe("invites v1 + v2 (Disaster Mesh R5)", () => {
  it("v1 message is unchanged (existing phones' invites keep working)", () => {
    expect(inviteMessage("test2", id, 5)).toBe(`tremor-witness invite v1|site=test2|id=${id}|exp=5`);
  });

  it("v2 round-trips and recovers the committee", async () => {
    const exp = Date.now() + 60_000;
    const sig = await committee.signMessage({ message: inviteMessage("demo", id, exp, 12) });
    const inv = decodeInvite(encodeInvite({ site: "demo", inviteId: id, exp, sig, uses: 12 }))!;
    expect(inv.uses).toBe(12);
    expect(await inviteSigner(inv)).toBe(committee.address);
    expect(inviteMessage("demo", id, exp, 12)).toBe(`tremor-witness invite v2|site=demo|id=${id}|exp=${exp}|uses=12`);
  });

  it("a v1 signature cannot be upgraded to multi-use by adding `uses`", async () => {
    const sig = await committee.signMessage({ message: inviteMessage("demo", id, 9) });
    const forged = decodeInvite(encodeInvite({ site: "demo", inviteId: id, exp: 9, sig, uses: 20 }))!;
    expect(await inviteSigner(forged)).not.toBe(committee.address);
  });

  it("rejects out-of-range uses", () => {
    for (const uses of [0, -1, 1.5, MAX_INVITE_USES + 1]) expect(decodeInvite(encodeInvite({ site: "d", inviteId: id, exp: 1, sig: "0x00", uses }))).toBeNull();
  });
});

describe("mesh labels (R1)", () => {
  it("mesh-… labels have their own cap", () => {
    expect(isMeshLabel("mesh-b0a8")).toBe(true);
    expect(isMeshLabel("dhruv-m")).toBe(false);
    expect(MAX_MESH_PHONES_PER_SITE).toBeGreaterThan(MAX_PHONES_PER_SITE);
  });
});
