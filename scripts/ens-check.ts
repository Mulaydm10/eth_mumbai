// Resolve Tremor Mesh ENS names with stock viem on Sepolia, exactly as the browser dashboard will.
// Usage: npx tsx scripts/ens-check.ts <name> [textKey...]
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";
const c = createPublicClient({ chain: sepolia, transport: http("https://ethereum-sepolia-rpc.publicnode.com") });
const name = normalize(process.argv[2]!);
console.log(name, "addr =", await c.getEnsAddress({ name }));
for (const key of process.argv.slice(3)) console.log(`  text ${key} =`, await c.getEnsText({ name, key }));
