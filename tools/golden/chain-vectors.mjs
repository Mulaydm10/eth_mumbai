// Regenerates app/src/test/resources/golden/chain-v1.json with viem from the Tremor Witness repo (read-only).
// Usage: TW_REPO=/path/to/tremor-witness node tools/golden/chain-vectors.mjs > app/src/test/resources/golden/chain-v1.json
const R = process.env.TW_REPO; if (!R) throw new Error("set TW_REPO");
const imp = (p) => import(R + p);
const v = await imp("/node_modules/viem/_esm/index.js");
const { privateKeyToAccount } = await imp("/node_modules/viem/_esm/accounts/index.js");
const { namehash, normalize, packetToBytes } = await imp("/node_modules/viem/_esm/ens/index.js");
const { sepolia } = await imp("/node_modules/viem/_esm/chains/index.js");
const { keccak256, stringToHex, toHex, encodeFunctionData, parseAbi, recoverMessageAddress } = v;
const out = {};
const pk = "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"; // public test key (web3 docs), never funded
const acct = privateKeyToAccount(pk);
out.key = { privateKey: pk, address: acct.address, publicKey: acct.publicKey };
out.keccak = { empty: keccak256("0x"), hello: keccak256(stringToHex("hello")) };
const msg = "tremor-witness invite v1|site=test2|id=0123456789abcdef0123456789abcdef|exp=1762425600000";
const sig = await acct.signMessage({ message: msg });
out.personalSign = { message: msg, signature: sig, recovered: await recoverMessageAddress({ message: msg, signature: sig }), hash: v.hashMessage(msg) };
const inv = { site: "test2", inviteId: "0123456789abcdef0123456789abcdef", exp: 1762425600000, sig };
const b64 = Buffer.from(JSON.stringify(inv), "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
out.invite = { obj: inv, encoded: b64, url: "https://tremor-witness.vercel.app/?site=test2&inv=" + b64 };
const site = "test2", label = "dhruv-m", name = normalize(label + "." + site + ".tremorwitness.eth");
const salt = BigInt(keccak256(stringToHex("tremor-witness:tremorwitness:" + site + ":registry")));
out.ens = { name, namehash: namehash(name), dns: toHex(packetToBytes(name)), salt: toHex(salt, { size: 32 }),
  labelId: toHex(BigInt(keccak256(stringToHex(label))), { size: 32 }) };
const fab = parseAbi(["function predictProxyAddress(address deployer, uint256 salt) view returns (address proxy)"]);
out.ens.predictCalldata = encodeFunctionData({ abi: fab, functionName: "predictProxyAddress", args: ["0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F", salt] });
const addrData = encodeFunctionData({ abi: parseAbi(["function addr(bytes32 node) view returns (address)"]), functionName: "addr", args: [namehash(name)] });
out.ens.addrCalldata = addrData;
out.ens.resolveCalldata = encodeFunctionData({ abi: parseAbi(["function resolve(bytes name, bytes data) view returns (bytes, address)"]), functionName: "resolve", args: [toHex(packetToBytes(name)), addrData] });
out.events = {
  LabelRegistered: keccak256(stringToHex("LabelRegistered(uint256,bytes32,string,address,uint64,address)")),
  LabelUnregistered: keccak256(stringToHex("LabelUnregistered(uint256,address)")),
  ExpiryUpdated: keccak256(stringToHex("ExpiryUpdated(uint256,uint64,address)")),
  TokenRegenerated: keccak256(stringToHex("TokenRegenerated(uint256,uint256)")),
};
// Mesh message canonical JSON (keys sorted, no whitespace) + personal_sign, as the app must produce it.
{
  const f = { v: 1, type: "checkin", site: "test2", sender: "dhruv-m", addr: acct.address, tMs: 1762425600123, nonce: "00112233aabbccdd",
    status: "help", note: "Floor 3 \"B\" wing\nstairs blocked – é ☃ \u0001" };
  const canon = JSON.stringify(Object.fromEntries(Object.keys(f).sort().map((k) => [k, f[k]])));
  const sig = await acct.signMessage({ message: canon });
  const withSig = { ...f, sig };
  const wire = JSON.stringify(Object.fromEntries(Object.keys(withSig).sort().map((k) => [k, withSig[k]])));
  out.mesh = { fields: f, canonical: canon, signature: sig, wire, id: keccak256(stringToHex(wire)).slice(2) };
}
// live reads (Sepolia, read-only)
const pub = v.createPublicClient({ chain: sepolia, transport: v.http("https://ethereum-sepolia-rpc.publicnode.com") });
out.live = {};
for (const s of ["test2", "demo"]) {
  const r2 = await pub.readContract({ address: "0xda70306c98e97ece36f997a21368e53298572991", abi: fab, functionName: "predictProxyAddress", args: ["0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F", BigInt(keccak256(stringToHex("tremor-witness:tremorwitness:" + s + ":registry")))] });
  out.live[s] = { registry: r2 };
}
console.log(JSON.stringify(out, null, 1));
