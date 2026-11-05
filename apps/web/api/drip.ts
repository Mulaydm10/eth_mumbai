// Onboarding only: top up a new phone's wallet with a little tGLM so it can write its own Arkiv entities.
// Not in the data path: readings are written and read without this function (CROPS: kill it and records survive).
import { createPublicClient, createWalletClient, http, isAddress, parseEther, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { rabdi } from "@arkiv-network/sdk/chains";

const MIN = parseEther(process.env.DRIP_MIN ?? "0.02");
const AMOUNT = parseEther(process.env.DRIP_AMOUNT ?? "0.05");

export async function POST(req: Request): Promise<Response> {
  try {
    const { address } = (await req.json()) as { address?: string };
    if (!address || !isAddress(address)) return Response.json({ ok: false, error: "bad address" }, { status: 400 });
    const key = process.env.FUNDER_PRIVATE_KEY as Hex | undefined;
    if (!key) return Response.json({ ok: false, error: "funder not configured" }, { status: 503 });
    const chain = rabdi({ accessKey: process.env.ARKIV_ACCESS_KEY ?? "" });
    const pub = createPublicClient({ chain, transport: http() });
    const bal = await pub.getBalance({ address });
    if (bal >= MIN) return Response.json({ ok: true, funded: false, balance: bal.toString() });
    const wallet = createWalletClient({ chain, transport: http(), account: privateKeyToAccount(key) });
    const hash = await wallet.sendTransaction({ to: address, value: AMOUNT });
    await pub.waitForTransactionReceipt({ hash, timeout: 30_000 });
    return Response.json({ ok: true, funded: true, hash });
  } catch (e) {
    return Response.json({ ok: false, error: String((e as Error).message ?? e).slice(0, 300) }, { status: 500 });
  }
}
