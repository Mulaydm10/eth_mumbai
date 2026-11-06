# D3 source: ENS docs llms-full.txt excerpts
URL: https://docs.ens.domains/llms-full.txt ; fetched 2026-11-06 via curl (1,790,939 bytes). Verbatim excerpts.

## ENSIP-24 (arbitrary bytes data resolution, status draft) lines 15330-15362
## ENSIP-24: Arbitrary Data Resolution

<EnsipHeader authors={["premm.eth","raffy.eth","clowes.eth"]} created="September 25, 2025" status="draft" />

### Abstract

This ENSIP proposes a new resolver profile for resolving arbitrary `bytes` data.

### Motivation

ENS has seen significant adoption across the blockchain ecosystem, but the current resolver profiles are too restrictive for many emerging applications.

There is a clear need for a richer record type that can store unstructured binary data. This would provide a flexible, gas-efficient mechanism for associating any data with an ENS name. This would enable direct support for resolution of things like:

* Hashed data commitments for off-chain data verification
* Interoperable addresses
* Context data

### Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

#### Overview

This ENSIP introduces a new interface for the resolution of arbitrary `bytes` data:

```
/// @dev Interface selector: `0xecbfada3`
interface IDataResolver {
    /// @notice For a specific `node`, get the data associated with the key, `key`.
    /// @param node The node (namehash) for which data is being fetched.
    /// @param key The key.
    /// @return The associated arbitrary `bytes` data.

## ENSIP-25 + 26 agent records lines 15480-15516, 15578-15600
This ENSIP defines a standardized method for directly verifying, using text records, the association between an ENS name and an AI agent identity registered in a specific on-chain AI agent registry.

### Motivation

With the introduction of on-chain AI agent identity registries, such as ERC-8004, in which agents may declare an associated ENS name, there is a need for a standardized verification method. This verification process is essential for establishing trust between an AI agent identity and the ENS name it claims to control. This ENSIP defines a direct lookup method using a parameterized text record key that includes a unique agent identifier.

### Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

#### Parameterized Verification Text Record Key

To enable verification of an ENS name from a specific AI agent registry entry, this ENSIP defines a global parameterized ENS text record key:

```
agent-registration[<registry>][<agentId>]
```

Where:

* `<registry>` is the ERC-7930 interoperable address of the registry contract (hexadecimal string with `0x` prefix),
* `<agentId>` is the registry-defined agent identifier (string) and MUST NOT contain the characters `[` or `]`.

The combination of `<registry>` and `<agentId>` MUST uniquely identify an agent within the context of the referenced registry.

The value of this text record MUST be a non-empty string. Implementations SHOULD set the value to `"1"`. The specific value has no semantic meaning; the presence of a non-empty value is interpreted as an attestation by the ENS name owner that the ENS name is associated with the referenced AI agent registry entry. Verification clients MUST NOT depend on the specific value beyond it being non-empty.

#### Verification Flow (Registry-to-ENS)

Clients performing verification starting from an AI agent registry entry MUST follow the steps below:

1. Obtain the claimed ENS name, agent identifier, and registry address from the AI agent registry entry.
2. Construct the text record key `agent-registration[<registry>][<agentId>]`.
3. Resolve the text record with this key on the claimed ENS name.
4. If the resolved value is non-empty, the ENS name is considered verified for that specific agent registry entry.

If the text record does not exist or resolves to an empty value, verification MUST fail.
This ENSIP extends ENSIP‑5: Text Records by standardizing the `agent-context` text record key and `agent-endpoint[<protocol>]` for agent interface discovery. An ENS name provides a single, multichain identity for an AI agent. The `agent-context` is the entry point: it describes the agent and may reference agent registries (e.g. ENSIP-25) or endpoints set via `agent-endpoint` records. Clients discover one identity, one context, and connect via the indicated registries or endpoints.

### Motivation

Agentic systems require a single, verifiable identity that works across chains. An ENS name provides that: one identity, one place for context and discovery. This ENSIP standardizes how agents declare themselves via `agent-context` and `agent-endpoint`. The context can point to whether the agent is registered in agent registries (e.g. ENSIP-25) or has protocol endpoints (MCP, A2A) set via `agent-endpoint` text records.

### Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

#### Text Record Keys

##### agent-context

* **Key**: `agent-context`
* **Format**: Any format suitable for agentic systems (plain text, Markdown, YAML, JSON, etc.)

The key **MUST** be published via `text(bytes32,string)` as defined in ENSIP‑5. The content describes the agent and how to interact with it. The content MAY reference whether the agent is registered in agent registries (e.g. ENSIP-25 `agent-registration` records) or has endpoints published via `agent-endpoint` text records. This gives clients a single entry point to understand the agent's identity and how to reach it.

##### agent-endpoint

* **Key**: `agent-endpoint[<protocol>]`
* **Format**: A URL (e.g. `https://`, `http://`) identifying the endpoint for the specified agent protocol.
## ENSIP-28 lines 15916-15950
## ENSIP-28: ENS Name Owned Accounts

<EnsipHeader authors={["premm.eth","workemon.eth","raffy.eth"]} created="August 13, 2026" status="draft" />

### Abstract

This ENSIP lets an ENS name list more than one account per chain, for example a Safe or a token bound account, and requires each listed account to prove that it consents to the association. The proof is a signature over an [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed message, stored as a data record alongside the listing. It covers EOAs, deployed smart accounts (via [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271)), and token bound accounts ([ERC-6551](https://eips.ethereum.org/EIPS/eip-6551)).

### Motivation

ENS names often represent a user identity, for both human users and AI agents. A user frequently controls more than one account on a chain and wants those accounts associated with a single ENS name. [ENSIP-9](/ensip/9) resolves one address per chain, which suits a payment address but not an identity that spans several accounts.

An association is only meaningful if both sides agree to it. A record written by the name owner alone is a claim about someone else's account, and anyone who controls a name can name any address in it. This ENSIP therefore defines both halves: how a name lists its accounts, and how each account proves that it consents to being listed.

### Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

#### Account Data Records

An ENS name lists its accounts on a chain as an [ENSIP-24](/ensip/24) data record on its own node under the reserved key:

```
accounts[<chain-id>]
```

where `<chain-id>` is the EVM chain ID as an unsigned base-10 integer without leading zeros.

The value MUST be the accounts encoded as consecutive 32-byte words, each holding an address in its low 20 bytes:

```
abi.encode(address account1, address account2, ...)
```

The number of accounts is the length of the value divided by 32. Accounts MAY appear in any order.
## Issuing Subnames (delegation/wildcard) lines 9836-9938 (already in research/tremor-witness/sponsors/docs-ensv2.md)

## Permissioned Resolver (llms-full L8497+), verbatim bits
"In ENSv2, each account gets its own resolver instance, deployed as a UUPS-upgradeable proxy. All names owned by the same account share one resolver. Records are stored as numbered bundles that names link to ..."
Record types table: Address, multichain address, Text, Content hash (setContenthash(bytes name, bytes)), Name (reverse), ABI, Interface, Data (data(bytes32,string) / setData(bytes name,string,bytes), ENSIP-24).
"Argument-scoped permissions (a single text key, coin type, content type, or interface ID) are granted with grantSetterRoles(setter, account): setter is ABI-encoded calldata of the setter to authorize..."
Delegating a Single Text Key example: grantSetterRoles(encodeFunctionData(setText,['0x','avatar','']), dappAddress); "Argument-scoped grants apply to every name served by the resolver instance: the dApp above can set the avatar key on all of them. To give an account access to records of specific names only, serve those names from their own resolver instance."
Link functions: linkToNode(source,target), linkToRecord(name, 0) require root-only ROLE_LINK. Default record = record linked to the root name 0x00.

## Reverse Resolution (llms-full L9721+)
"At launch, the reverse namespace stays on v1 infrastructure ... ReverseMirror"; v1 ReverseRegistrar setName()/setNameForAddr(); "Multi-Chain Reverse Resolution (Upcoming)": L2ReverseRegistrar setNameForAddrWithSignature(claim, signature) "ERC-191 signature from the address | Gasless or cross-chain claims for EOAs"; setNameForContractWithSignature supports "Safe, ERC-4337".
