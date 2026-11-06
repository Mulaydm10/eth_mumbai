# D3 Sepolia read-only probes (2026-11-06, viem eth_call via https://ethereum-sepolia-rpc.publicnode.com, no key, no tx). Scripts: D3-readonly-probe-{1,2,3}.mts.txt
Results (verbatim console):
- supportsInterface on our resolver 0xFA87654E65542Ad82428f3326c322d6a12C55957 (a 156-byte proxy): ENSIP-24 data 0xecbfada3 false; contenthash false; text false; addr false; ENSIP-10 extended 0x9061b923 TRUE. (False for profile ids is expected: ENSv2 resolver is called via resolve(name,data); see next lines.)
- resolver.resolve(dnsName("phone-b0a8.test2.tremorwitness.eth"), calldata) for data(bytes32,string), contenthash(bytes32), name(bytes32), text(bytes32,string): each returns ABI-encoded empty (0x..20 ..00) i.e. SUPPORTED, no value set. Unsupported selector foo(bytes32) REVERTS (0x7b1c461b). => the deployed impl serves data/contenthash/name profiles.
- viem getEnsResolver for UNREGISTERED "event-abc.test2.tremorwitness.eth" returns 0xFA87...5957 (our PermissionedResolver) => wildcard/parent-resolver resolution reaches our resolver for names with no registry entry. Direct resolve of text on that name returns empty (nothing written).
- tremorwitness.eth expiry 1825451172 (2027-11-05 21:46 UTC), test2 site expiry same value. Phone phone-b0a8.test2 expiry 1796509023 (2026-12-05).
- roles(0, committee EOA 0x32DE..500F) on resolver root = 7237005577332262213973186563042994246635441927191047785309928239799115710481 (non-zero: committee holds set-address/text/upgrade roles + admin forms).
- registry.roles(phone token, phone owner) = 0 : phone owns token but holds NO roles (cannot change resolver/renew/transfer). Phone resolver pointer = shared 0xFA87...5957.
- Reverse: viem getEnsName(0xB0A8F94e...EDE1) = null (phones have no primary name set).
- site test2: tw.k = "2" text readable via getEnsText.

## Probe 4 (2026-11-06, anon-rpc nox specifier on Sepolia, script D3-readonly-probe-4-anonrpc.mjs.txt)
Specifier 0x35133267A8F7EC35046a83DCA0f4Ca8A6e1b7A9A on Sepolia: workerHash() = 0xd9fa04b080a33062680a27cad828196bfb04615a0ebc76bcbffedb6dcbe838d4; owner() = 0xb18ddF10a9F6a0b9143d05B294815a83d3fa69C5; workerResolvers = raw.githubusercontent hisoka-io/anon-rpc, jsdelivr+unpkg @hisoka-io/anon-rpc-worker@0.4.1, and 3 kps: peers. Worker bundle via jsdelivr = 1,831,246 bytes (1.8 MB) (curl).

## Probe 5 (2026-11-06, eth_call simulation only, no tx, committee PUBLIC address as `from`, no key; script D3-readonly-probe-5-grantsetter.mjs.txt)
Resolver 0xFA87...5957: simulate grantSetterRoles(setText("tw.calib.test"), 0x...dEaD) from committee 0x32DE...500F => OK (returns 1n); from a stranger => reverts 0xd1a3b355 (access control). So argument-scoped delegation is DEPLOYED and callable by the committee on our existing resolver. Simulate setContenthash / setData from committee => reverts 0x4b27a133 (likely missing role: COMMITTEE_RESOLVER_ROLES covers only SET_ADDRESS, SET_TEXT, UPGRADE; or the dummy empty name arg 0x; cause not decoded = UNVERIFIED). Hence contenthash/data features need the committee to grantRootRoles(ROLE_SET_CONTENTHASH|ROLE_SET_DATA) first (needs admin role; assumed available).
