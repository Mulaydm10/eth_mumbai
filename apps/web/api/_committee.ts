// Shared by the committee endpoints. The committee key is the team funder key (Vercel secret), Sepolia only.
// Prototype 3: the committee auto-approves phone joins at a site (max 5); a 2-of-3 Safe holding these roles is the next step.
import { createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { SEPOLIA_RPC, ensPublic } from "../../../packages/chain/src/ens.js";

export function committee() {
  const key = process.env.FUNDER_PRIVATE_KEY as Hex | undefined;
  if (!key) throw new Error("committee not configured");
  const rpc = process.env.SEPOLIA_RPC_URL ?? SEPOLIA_RPC;
  return { wallet: createWalletClient({ account: privateKeyToAccount(key), chain: sepolia, transport: http(rpc) }), pub: ensPublic(rpc) };
}
export const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status });
