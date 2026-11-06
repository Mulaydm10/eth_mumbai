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
