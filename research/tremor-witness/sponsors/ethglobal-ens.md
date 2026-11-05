# Track study: ens
Agent: track-study. Date 2026-11-05 (IST).

## Page 1: https://ethglobal.com/events/mumbai/prizes
Fetch time: 01:28 IST | Method: Playwright navigate + evaluate document.body.innerText (page fully rendered, no clicks needed) | Verbatim section for this sponsor:

```text
ENS

$10,000

ens.domains
ensdomains
Open page →
About

ENS is the universal pointer for anything on the internet. It turns wallet addresses into human-readable names like yourname.eth: a portable, onchain profile that works across every app, chain, and wallet.

Developers use ENS to replace raw addresses with real identities, build decentralized websites, and create scalable subname ecosystems. As AI agents become first-class onchain actors, ENS is how you give them a name, a reputation, and a place to be found.

Prizes
🧬 Best Use of ENSv2 ⸺ $7,000
🥇
1st place
$3,000
🥈
2nd place
$2,000
🥉
3rd place
$1,000
🏅
3rd place
$1,000

ENSv2 is now live on Ethereum mainnet. Be among the first to build on it. Explore the new hierarchical registry structure: resolve subnames straight off a parent's resolver with wildcard resolution, or deploy your own subname registry to tokenize and manage subnames under your own rules. Use Enhanced Access Control, the shared, role-based permission system behind both registries and resolvers, to delegate specific rights, like letting an account edit only certain text records on a name. Give subnames their own Permissioned Resolver so they fully own their data, mix in record aliasing at the resolver level or namespace aliasing via a shared registry, and combine it all to build subname setups: expiring, revocable, non-transferable vs. transferable, even forever names with no parent control. Bonus points if you bring AI agents into the mix. Think agents as namespaces, each with their own identity and permissions.

Qualification Requirements

Project must be built on ENSv2 on Ethereum mainnet or Sepolia. ENSv2 features should be central to the product, not a cosmetic add-on. Your demo must be functional and not just include hard-coded values. Upon submission, your project showcase must have a link to a live demo and the code needs to be open source and accessible on Github or a similar platform.

Links and Resources
Permissioned Registry docs
https://docs.ens.domains/ensv2/permissioned-registry
↗
Permissioned Resolver docs
https://docs.ens.domains/ensv2/permissioned-resolver/
↗
Enhanced Access Control docs
https://docs.ens.domains/ensv2/enhanced-access-control/
↗
Guide for Contract Developers
https://docs.ens.domains/ensv2/tutorial-contract-developers/
↗
🔗 Best Integration of ENSv2 into an Existing Project ⸺ $3,000
🆕  This prize is only available to Continuity Track participants →
🥇
1st place
$2,000
🥈
2nd place
$1,000

ENSv2 is now live on Ethereum mainnet. Explore how ENSv2's feature set, including the new registry hierarchy, Enhanced Access Control, Permissioned Resolvers, and record and namespace aliasing, can plug into an existing protocol or project to improve the user experience or unlock entirely new use cases. Take a project you already know, yours or an open one, and integrate it against ENSv2 on Ethereum mainnet.

Qualification Requirements

Integration must use ENSv2 on Ethereum mainnet and integrate it into an existing project. It should be clear how ENSv2 improves the project, not just a cosmetic add-on. Your demo must be functional and not just include hard-coded values. Upon submission, your project showcase must have a link to a live demo and the code needs to be open source and accessible on Github or a similar platform.

Links and Resources
Guide for App Developers
https://docs.ens.domains/ensv2/tutorial-app-developers/
↗
Resources
ENSv2 docs
https://docs.ens.domains/ensv2/overview/
↗
Agent-native CLI
https://github.com/ensdomains/ens-cli
↗
Agent Text Records
https://docs.ens.domains/ensip/26/
↗
Building with AI
https://docs.ens.domains/building-with-ai/
↗
AI Agent Registry ENS Name Verification
https://docs.ens.domains/ensip/25/
↗
Workshop
ENSv2 - Identity for Apps, Agents & Beyond

An introduction to ENS as identity infrastructure for apps, AI agents and beyond, and what changes in ENSv2. Covers...

This workshop is happening in-person

04:00 PM IST — Thursday, Nov 5, 2026 in Workshop Room 1
```


## docs.ens.domains ENSv2 pages
Fetch time: 01:31 IST | Method: Playwright evaluate fetch+DOMParser from docs.ens.domains origin (llms.txt index consulted). Full text of 12 pages: .playwright-mcp/ens_docs_dec.txt (scratch). Verbatim excerpts:

```text
=== https://docs.ens.domains/ensv2/overview (200) ===
ENSv2 Overview
Welcome to the next evolution of the Ethereum Name Service!
ENSv2 introduces a suite of upgraded smart-contracts designed to make the protocol
more scalable, modular and future-proof. This section will outline the high-level
architecture, guiding principles and migration strategy for ENSv2.
What's new in ENSv2?
Hierarchical Registries - While ENSv1 used a single flat registry for all
names, ENSv2 uses a hierarchical model where a full
name like sub.alice.eth is a chain of entries across registries linked by
subregistry pointers. Name owners can deploy their own subname registry on
demand. Registries and resolvers are deployed as proxies via the
Verifiable Factory.
Permissions as Standard - All of the functionality enabled by the Name Wrapper
in ENSv1 has been integrated into the core of ENSv2 via a new role-based
permission system called Enhanced Access Control.
Shorter Grace Period - The grace period has been reduced from 90 days in ENSv1 to 28 days. During this window, the expired name can still be renewed (by anyone, not just the owner). After the grace period, names enter a temporary premium period.
Per-Account Resolvers - Rather than sharing a single Public Resolver, every
account gets its own Permissioned Resolver proxy
with fine-grained per-record permissions and record linking.
What hasn't changed?
Resolvers - while we have developed new resolver contracts to take advantage
of the changed environment enabled by ENSv2, the resolver interface remains the
same. Custom resolver implementations are fully supported.
True Ownership - ENSv2 continues to prioritize trust minimization, enabling
you to own your name fully, without having to worry about interference from
centralized third-parties.
Architecture
PageDescriptionRegistry HierarchyHierarchical registry model, tree structure, resolution, namespace aliasingEnhanced Access ControlRole-based permission system replacing ENSv1 fusesERC1155SingletonGas-optimized token standard with single ownership per tokenMutable Token IDsDynamic token IDs that protect against permission leaks and griefingVerifiable FactoryDeterministic CREATE2 proxy deployment with on-chain verification
Contracts
PageDescriptionPermissioned RegistryTokenized registry managing name ownership, state, and permissionsPermissioned ResolverPer-account resolver with per-record roles and record linkingETH RegistrarCommit-reveal registration and renewal for .eth namesUniversal Resolver V2Single entry point for name resolution across the hierarchyDNS Name ResolutionResolving DNS domain names through the ENS protocolReverse ResolutionPrimary names and multi-chain reverse resolution
Guides
PageDescriptionMigrationGuide to migrating ENSv1 names (locked, unlocked, unwrapped) to ENSv2For App DevelopersWhat changes for apps that resolve ENS namesFor Contract DevelopersTutorial: build a subname registrar on the Permissioned RegistryRegistry TemplateBuilding custom registries, configuration patterns, emancipationIndexingEvents and functions for building indexers and subgraphs
Deployments
The ENSv2 contract addresses are listed in the canonical Deployments section, for both Ethereum Mainnet and Sepolia.
```

```text
=== https://docs.ens.domains/ensv2/subnames (200) ===
Issuing Subnames in ENSv2
An ENSv2 name can serve subnames through its resolver, its subregistry, or both. Choose the setup based on who should own the subnames and who should update their records.
Subnames as Resolver Records
If you manage every subname, you can keep their records in one Permissioned Resolver. Set that resolver on your parent name, such as wallet.eth, and write records for full names such as alice.wallet.eth and bob.wallet.eth.
The Universal Resolver finds the parent's resolver and passes it the full name through wildcard resolution. No subregistry or subname token is required. These are onchain records, even though there is no token for each subname.
The resolver's role holders control the records. Giving Alice an address record does not give her ownership of alice.wallet.eth or permission to edit it.
Subnames stored as resolver recordsOne parent token points to one resolver. Full names, including deeper subnames, map to record bundles inside that resolver. The subnames have no tokens of their own. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.Permissioned Resolverwallet.ethToken owned by youresolverpay.wallet.ethRecord 1ETH addressblog.wallet.ethRecord 2Contenthashl2.pay.wallet.ethRecord 3Base addressOne parent token points to one resolver. Full names, including deeper subnames, map to record bundles inside that resolver. The subnames have no tokens of their own.
Share Records Across Names
A Permissioned Resolver can link several names to the same record bundle. Updating that bundle updates the records returned for every linked name.
Names without their own record bundle use the resolver's default bundle. Write that bundle using the DNS-encoded empty name (0x00). This can provide a shared website, avatar, or address for subnames without individual setup.
A shared default record bundleEach name without its own bundle falls back to the default bundle. Giving a name any record of its own ends fallback for that entire name. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.Permissioned Resolverwallet.ethToken owned by youresolveralice.wallet.ethbob.wallet.ethcarol.wallet.ethFallback for the whole nameDefault bundleWebsite + avatarEmpty name: 0x00Each name without its own bundle falls back to the default bundle. Giving a name any record of its own ends fallback for that entire name.
Default records apply to a whole nameOnce a name has its own record bundle, it stops using the default bundle
entirely. Missing fields in its bundle do not fall back individually.
Unlinking the name with linkToRecord(name, 0) restores the default behavior.
Subnames as Owned Tokens
Use a UserRegistry when subnames need separate owners or should appear as tokens in wallets.
Deploy and initialize a UserRegistry with the required roles.
Attach it to the parent name using setSubregistry() on the registry that holds that name.
Register each label with an owner, resolver, expiry, and role bitmap. For alice.wallet.eth, register alice in the registry attached to wallet.eth.
Each owned entry is an ERC-1155 token. The registry stores its resolver and optional child registry. Several entries can use one resolver, or each can point to a different resolver.
Token ownership and resolver permissions are separate. Giving Alice a token does not grant her roles on an operator's shared Permissioned Resolver. If Alice should control her own records, she can use a resolver she controls, provided her token roles allow changing the resolver.
Subnames with separate token ownersThe parent points to a UserRegistry. Alice and Bob own separate tokens, each pointing to the same resolver. Token ownership does not automatically grant write access to that resolver. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.UserRegistryPermissioned Resolverwallet.ethToken owned by yousubregistryalice.wallet.ethToken owned by AliceresolverRecord 1ETH address + avatarbob.wallet.ethToken owned by BobresolverRecord 2ETH address + URLThe parent points to a UserRegistry. Alice and Bob own separate tokens, each pointing to the same resolver. Token ownership does not automatically grant write access to that resolver.
Choose the Owner's Permissions
The registration's role bitmap determines what the owner may do:
ROLE_SET_RESOLVER: change the name's resolver.
ROLE_SET_SUBREGISTRY: attach a registry for further subnames.
ROLE_RENEW: extend the expiry.
ROLE_CAN_TRANSFER_ADMIN: permit the owner to transfer the token, subject to the registry's transfer checks.
Also decide which roles the operator retains on the registry's root resource. Root permissions can allow the operator to change resolvers, replace child registries, unregister names, or upgrade the registry. Tokenizing a name alone does not remove that control. See Permissioned Registry for emancipation and safe-transfer requirements.
Automate Registration with a Registrar
For a registration service, grant a registrar contract ROLE_REGISTRAR on the registry. That contract can enforce your pricing and eligibility rules. Grant ROLE_RENEW as well if it should handle renewals. The contract developer tutorial walks through this approach.
A registrar enforces your registration policyA registrar contract holds registration and, optionally, renewal roles on the UserRegistry. It applies your rules before calling the registry. The registry holds the tokens, and the resolver holds the records. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.UserRegistryPermissioned Resolverwallet.ethToken owned by yousubregistryalice.wallet.ethToken owned by AliceresolverRecord 1ETH address + avatarbob.wallet.ethToken owned by BobresolverRecord 2ETH address + URLRegistrar contractYour pricing and eligibility rulesRegister / renewA registrar contract holds registration and, optionally, renewal roles on the UserRegistry. It applies your rules before calling the registry. The registry holds the tokens, and the resolver holds the records.
Reserved Entries Without Tokens
A registry entry can have an expiry, resolver, and child registry without having an owner. Registering with the zero address as owner and a zero role bitmap creates a reserved entry without minting a token.
Use reserved entries to route a subtree to a different resolver or to hold protected labels. An unexpired reservation cannot be registered through the ordinary registration path. Assigning it an owner requires ROLE_REGISTER_RESERVED.
Delegate Record Updates
Root Roles and Individual Keys
Roles on a resolver's ROOT_RESOURCE apply across that resolver. A root ROLE_SET_TEXT grant allows updates to every text key. A grant scoped to the url key permits URL updates across the resolver's records, without permitting avatar updates.
Root roles and permissions for individual text keysA root text role covers every text key. A role scoped to the URL key lets the bot edit that key across this resolver’s records, but not the avatar key. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.Permissioned ResolverRoot resourceROLE_SET_TEXT + its admin roleKey: avatarAvatar text recordsKey: urlURL text recordsOwnerAll text keysRoot role covers both keysStatus botURL text roleA root text role covers every text key. A role scoped to the URL key lets the bot edit that key across this resolver’s records, but not the avatar key.
Delegate a Single Address Field
Permissioned Resolver roles can be restricted to a setter argument, such as a text key or address coin type. For example, grantSetterRoles() can authorize a payment service to change Bitcoin addresses without allowing it to change Ethereum addresses or avatars.
For a code example using a text key, see Delegating a Single Text Key.
A delegated writer can update one field across a resolverThe payment agent can update Bitcoin addresses in both record bundles. Its BTC role does not permit changes to Ethereum addresses, but it is not restricted to a single name. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.Permissioned Resolverwallet.ethToken owned by youresolveralice.wallet.ethRecord 1ETH: unchangedBTC: writablebob.wallet.ethRecord 2ETH: unchangedBTC: writablePayment agentBTC address roleOn this resolverThe payment agent can update Bitcoin addresses in both record bundles. Its BTC role does not permit changes to Ethereum addresses, but it is not restricted to a single name.
These permissions apply across every record bundle in that resolver. They are not restricted to one name.
Limit a Writer to a Group of Names
To give a writer access to only a group of names, point those names at a separate resolver instance and grant the role there. Registry entries, including reserved entries, let you assign those resolver pointers.
Separate resolvers limit which names a writer can changeThe agent has a BTC write role only on resolver A. Alice’s records use A, while Bob’s use B. Registry entries can also be reserved without owners when only separate routing is needed. Solid blue arrows show pointers or name-to-record links. Dashed blue arrows show fallback. Dashed arrows in the text color show permissions.UserRegistryResolver AResolver B: no agent rolewallet.ethToken owned by yousubregistryPayment agentBTC address role on A onlyWrite permissionalice.wallet.ethToken owned by AliceresolverRecord 1BTC: writable by agentbob.wallet.ethToken owned by BobresolverRecord 1BTC: unchangedThe agent has a BTC write role only on resolver A. Alice’s records use A, while Bob’s use B. Registry entries can also be reserved without owners when only separate routing is needed.
Choose a Starting Point
For subnames whose records you manage, start with resolver records.
For separately owned or transferable subnames, use a UserRegistry and choose the token roles deliberately.
For routing or holding labels without ownership, use reserved entries.
For automated record updates, limit setter permissions and use separate resolver instances where writers need different access.
These approaches can be combined. Adding a subregistry later does not require replacing existing resolver records, but its resolver pointers determine whether resolution continues to reach those records.
This guide and its diagrams adapt Exploring Subnames in ENSv2. The registry template and Permissioned Resolver pages cover the contract APIs.
```

```text
=== https://docs.ens.domains/ensv2/registry-hierarchy (200) ===
Registry Hierarchy
ENSv2 replaces ENSv1's single flat registry with a hierarchical model where each name can have its own registry for managing subnames. This page explains the tree structure, how resolution works within it, and the implications for name ownership.
From Flat to Hierarchical
ENSv1 used a simple architecture, where a single flat registry maintained a mapping
from all names to their owner and resolver addresses. Hierarchical ownership was enforced
through the use of namehash to calculate IDs for subnames. This has the advantage of simplicity,
but means that ownership rules are enforced by a single, non-upgradeable contract, and
changes in the status of a parent name do not automatically ripple down to affect
subnames.
In ENSv2, registries are hierarchical: each name can have a resolver and a subregistry:
Here, registries are shown as rectangles, while resolvers are shown as notched rectangles.
Note that the registry for .eth has both a subregistry and a resolver defined for montoya.eth.
Note also that there's a resolver defined for inigo.montoya.eth but no subregistry, while
domingo.montoya.eth has a subregistry but no resolver. A name only needs to have a subregistry
defined if it wants the ability to create subnames, and it only needs a resolver defined if it wants to
define records to resolve for that name or its subnames.
Names as Chains of Entries
A full name like inigo.montoya.eth does not exist as a single on-chain object. Instead, it's a chain of entries across registries: inigo is an entry in the montoya.eth registry, montoya is an entry in the .eth registry, and these are linked by the subregistry field on each entry. This means that on-chain, a "name" always refers to a single label within a specific registry. The full name is reconstructed by walking up the registry hierarchy.
The IRegistry Interface
Every registry in the hierarchy, whether it's the root registry, a TLD registry like .eth, or a user's subname registry, must implement the IRegistry interface:
Copyinterface IRegistry is IRegistryEvents {
    /// Returns the child registry for a label, or address(0) if none exists.
    function getSubregistry(string calldata label) external view returns (IRegistry);
    /// Returns the resolver for a label, or address(0) if none exists.
    function getResolver(string calldata label) external view returns (address);
    /// Returns this registry's parent and the label it's registered under.
    function getParent() external view returns (IRegistry parent, string memory label);
}
These three functions are what enable the hierarchical model:
getSubregistry(label): links a name to its child registry. This is how the tree is traversed downward during resolution.
getResolver(label): links a name to its resolver contract. This is how records are found during resolution.
getParent(): links a registry back to its parent. This is how the Universal Resolver V2 verifies canonical registry chains.
IRegistry is deliberately minimal. It says nothing about tokens, permissions, or name lifecycle. The Permissioned Registry is the standard implementation that adds ERC1155Singleton tokenization, Enhanced Access Control, expiry management, and mutable token IDs. But a custom registry could implement IRegistry with entirely different ownership and access models.
IRegistryEvents
IRegistry inherits IRegistryEvents, which defines the events any registry is expected to emit:
EventEmitted whenLabelRegisteredA name is registered with an ownerLabelReservedA name is reserved (no owner)LabelUnregisteredA name is unregisteredExpiryUpdatedExpiry extended via renew()SubregistryUpdatedChild registry pointer changedResolverUpdatedResolver address changedTokenRegeneratedToken ID changed due to role updateParentUpdatedCanonical parent reference changed
Resolution
Resolution works by walking down the registry tree from root, querying getResolver() and getSubregistry() at each level. The deepest resolver found along the path wins (longest-suffix match). If a name has no resolver of its own, it inherits the resolver of its closest ancestor that does.
See Resolution: findResolver on the Universal Resolver V2 page for the full algorithm and step-by-step examples with diagrams.
Subtree Operations
One consequence of this tree structure is that it becomes possible to delete or reassign entire subtrees in a
single operation. For example, suppose montoya.eth is transferred to a new owner, who wants to
configure their own set of subdomains; they can simply replace the subregistry responsible for subnames of
montoya.eth with their own new subregistry:
All resolvers and subregistries previously associated with montoya.eth are thus removed in a single operation.
The new owner will still need to replace the resolver for montoya.eth if they wish to change how the bare
name itself is resolved, however.
Namespace Aliasing
This hierarchical structure need not be limited to trees, either; by reusing the same subregistry for more
than one name, entire namespaces can be aliased to each other:
In this example, both inigo.montoya.eth and inigo.wallet.eth resolve identically, as would any other
subnames with resolvers set. Notably, domingo.montoya.eth will resolve using Resolver 1, while
domingo.wallet.eth will not resolve at all - there are no resolvers set anywhere in its hierarchy! If we
set a resolver for domingo in Registry 3, both names would resolve identically using it, just as they do
for inigo.
This example also illustrates that in ENSv2, registries have no individual concept of 'their name'.
In earlier diagrams we labelled each registry with a name for convenience, but as these examples demonstrate,
there's no requirement that a registry have exactly one name associated with it - it can have thousands, or none
at all!
Token Representation and Permissions
Registries in ENSv2 are typically implemented as ERC1155Singleton token contracts, where each subname is an NFT with exactly one owner. Because of the hierarchical structure, merely owning a subname token does not guarantee anything in isolation: the registry must be referenced by a parent registry, and so on up to the root. Client authors must take care in how they represent names to users. The Universal Resolver V2 provides findCanonicalRegistry() to verify a registry's position in the hierarchy.
Permissions are managed through Enhanced Access Control, a role-based system where each name has its own set of grantable and revokable roles. By selectively revoking roles, all the functionality of the ENSv1 Name Wrapper can be replicated. See the Permissioned Registry page for the full role table, transfer behavior, and code examples.
```

```text
=== https://docs.ens.domains/ensv2/enhanced-access-control (200) ===
Enhanced Access Control
Enhanced Access Control (EAC) is the permission system used throughout ENSv2. It controls who is allowed to do what, and on which names. EAC supports up to 2^256 independent resources (e.g., individual names), 64 roles per resource (32 regular + 32 admin), and up to 15 holders of a role within the context of a single resource.
Think of it like a building where each room has its own set of locks: you can give someone a key to one room, or a master key that opens every room. EAC works the same way, but with ENS names and on-chain permissions.
Resources
A resource is the thing you're controlling access to. In most ENS contracts, a resource is a name - but it can be any uint256 identifier that makes sense for the contract.
Each ENSv2 contract defines how its resources are computed. For example, registries derive resources from a name's labelhash, while resolvers derive resources from a namehash and record type. See How Contracts Use EAC for the specific schemes.
There's also a special resource called ROOT_RESOURCE (0x0) that represents the contract itself. Permissions granted on ROOT_RESOURCE apply everywhere - like a master key. If you have a role on ROOT_RESOURCE, you automatically have that role on every individual resource too.
Roles
A role represents a specific permission - for example, "can set the resolver" or "can register subnames". Each ENS contract defines the roles that are relevant to it.
Roles are always tied to a resource. Granting someone the "set resolver" role on alice.eth doesn't let them set the resolver on bob.eth. To give someone a permission across all names, grant the role on ROOT_RESOURCE instead.
Up to 15 accounts can hold the same role on the same resource, enabling shared management and delegation.
How role checks work: when a contract checks whether an account has a role on a specific name, it looks in two places - the name itself and ROOT_RESOURCE - and allows the action if the role is found in either. This is how the master key effect works.
Admin Roles
Every role has a corresponding admin role that controls who can manage it. If you hold the admin role, you can:
Grant the regular role to other accounts
Grant the admin role itself to other accounts
Revoke either role from other accounts
For example, the admin role for "set resolver" controls who is allowed to grant or revoke the "set resolver" permission. Admin roles follow the same resource-scoping - you can be an admin for a specific name or for all names via ROOT_RESOURCE.
Granting and Revoking
Roles are managed through four functions:
GrantRevokeScopegrantRolesrevokeRolesSpecific resource (name)grantRootRolesrevokeRootRolesROOT_RESOURCE (contract-wide)
The caller must hold the admin role for every role being granted or revoked. Admin role holders can also revoke the admin role itself, including from themselves.
As a safety guardrail, grantRoles and revokeRoles reject ROOT_RESOURCE. You must use grantRootRoles / revokeRootRoles explicitly for contract-wide permissions. This prevents accidental global grants.
All four functions return true if the account's roles actually changed, or false if the roles were already in the desired state.
Callback Hooks
EAC provides five internal hooks that contracts can override to customize permission behavior:
Role Resolution Hook
_getRoles(resource, account): returns the role bitmap for an account on a resource. By default, returns the stored roles directly. Contracts override this to inject additional role logic at read time. The Permissioned Registry overrides _getRoles so that ERC1155-approved operators (via setApprovalForAll) inherit the token owner's roles on that name.
Role Change Callbacks
_onRolesGranted(resource, account, oldRoles, newRoles, roleBitmap): called after a grant that changed the account's roles. Receives the role bitmap before and after the change, plus the bitmap that was passed to the grant call. roleBitmap is the request as made, so it may include roles the account already held; derive the actual change from oldRoles and newRoles.
_onRolesRevoked(resource, account, oldRoles, newRoles, roleBitmap): the revoke counterpart, with the same semantics: roleBitmap is the requested revocation, which may include roles the account never held.
Both are no-ops in the base implementation. The Permissioned Registry overrides these to regenerate ERC1155 tokens when roles change, invalidating stale transfer approvals.
Grant/Revoke Restriction Hooks
_getSettableRoles(resource, account): returns which roles the account is allowed to grant on a given resource. By default, an account can grant any role for which it holds the corresponding admin role. Contracts override this to impose additional restrictions.
_getRevokableRoles(resource, account): returns which roles the account is allowed to revoke on a given resource. Same default behavior as settable roles.
The Permissioned Registry overrides _getSettableRoles to prevent admin role escalation on individual names after registration. Role changes on unregistered or reserved names are blocked implicitly: the same override returns no settable roles when a name has no owner.
Bitmap Layout
Under the hood, roles are packed into a single uint256 bitmap split into two halves. Each role occupies one nybble (4 bits), giving space for up to 32 regular roles and 32 corresponding admin roles:
 255         128 127            0
 ┌──────────────┬───────────────┐
 │ Admin Roles  │ Regular Roles │
 └──────────────┴───────────────┘
 63           32 31             0  ← nybble indices
Each nybble is a 4-bit slot. A regular role at nybble index N occupies bits 4N to 4N + 3, so nybble 0 is bits 0–3, nybble 1 is bits 4–7, and so on. Its admin counterpart sits at the same position in the upper half (4N + 128 to 4N + 131).
EAC tracks role assignments in two mappings:
_roles[resource][account]: stores which roles a given account holds on a given resource. Each nybble is either 0 (no role) or 1 (has role).
_roleCount[resource]: stores how many accounts hold each role on a given resource. Each nybble is a count from 0 to 15, using the same nybble-per-role layout. This is why the maximum number of assignees per role is 15: it's the largest value a 4-bit nybble can store.
Replacing Fuses
EAC replaces the one-way fuse system from the Name Wrapper. The key conceptual shift: in ENSv1, you burned permissions to restrict what could be done. In ENSv2, you revoke roles instead. Both achieve the same end result, but revoking is reversible if you hold the admin role.
FeatureENSv1 FusesENSv2 EACRevocabilityOne-way burn — permanentReversible grant/revoke (while admin role is held)DelegationSingle owner onlyUp to 15 accounts per role per resourceScopePer-name onlyPer-name or contract-wide via ROOT_RESOURCEExtensibilityFixed set of 16 fusesEach contract defines its own roles (up to 32)Transfer controlCANNOT_TRANSFER fuseROLE_CAN_TRANSFER_ADMIN (revoke to make non-transferable)Resolver controlCANNOT_SET_RESOLVER fuseROLE_SET_RESOLVER (revoke to lock resolver)Subdomain controlCANNOT_CREATE_SUBDOMAIN fuseROLE_REGISTRAR (revoke to prevent new subnames)
How Contracts Use EAC
Each ENSv2 contract defines its own roles and its own resource scheme. See the EAC Permissions section on each contract page for details:
Permissioned Registry: EAC Integration: 10 roles, labelhash-based resources with version isolation, anyId polymorphism
Permissioned Resolver: EAC Integration: 10 roles, scoped to the whole resolver or to individual keys, coin types, content types, or interface IDs
Reference
Write Functions
grantRoles(resource, roleBitmap, account)Grant roles on a specific resource. Reverts if resource is ROOT_RESOURCE.revokeRoles(resource, roleBitmap, account)Revoke roles on a specific resource. Reverts if resource is ROOT_RESOURCE.grantRootRoles(roleBitmap, account)Grant roles on ROOT_RESOURCE (contract-wide).revokeRootRoles(roleBitmap, account)Revoke roles on ROOT_RESOURCE (contract-wide).
View Functions
roles(resource, account)Get the effective role bitmap for an account on a resource. Delegates to the internal _getRoles hook, so contracts that override _getRoles may return additional roles beyond those explicitly granted.roleCount(resource)Get the assignee count bitmap for a resource (nybble per role).hasRoles(resource, roleBitmap, account)Check whether an account has all specified roles. Checks both the resource and ROOT_RESOURCE.hasRootRoles(roleBitmap, account)Check whether an account has all specified roles on ROOT_RESOURCE only.hasAssignees(resource, roleBitmap)Check whether any accounts hold the specified roles on a resource.getAssigneeCount(resource, roleBitmap)Get per-role assignee counts for the specified roles.
Constants
ROOT_RESOURCEThe root resource constant (0). Roles on ROOT_RESOURCE apply to all resources.
Events
EACRolesChanged(resource, account, oldRoleBitmap, newRoleBitmap)Roles granted or revoked for an account on a resource.
For code examples of granting and revoking roles, see the Permissioned Registry and Permissioned Resolver pages.
```

```text
=== https://docs.ens.domains/ensv2/permissioned-resolver (200) ===
Permissioned Resolver
In ENSv1, most names shared a single Public Resolver contract. In ENSv2, each account gets its own resolver instance, deployed as a UUPS-upgradeable proxy. All names owned by the same account share one resolver. Records are stored as numbered bundles that names link to, so several names can share one set of records, and permissions are managed per record type through fine-grained roles.
What Changed from ENSv1
FeatureENSv1 Public ResolverENSv2 Permissioned ResolverDeploymentSingle shared contract by defaultPer-account proxy instances by defaultRecord storageOne record set per nameNumbered records, shareable between names via linksWrite interfaceNode-based settersName-based settersPermissionsOwner controls all recordsPer-record-type roles via EACRecord clearingclearRecords() by ownerUnlink the name and start a fresh recordUpgradeabilityNot upgradeableUUPS proxy pattern
Supported Record Types
The Permissioned Resolver supports the following record types:
RecordRead profileSetterStandardAddress (ETH)addr(bytes32 node)setAddress(bytes name, 60, addressBytes)ENSIP-1Address (multichain)addr(bytes32 node, uint256 coinType)setAddress(bytes name, uint256, bytes)ENSIP-9Address (default)fallback for EVM coin typessetAddress(bytes name, 0x80000000, bytes)ENSIP-19Address existencehasAddr(bytes32 node, uint256)(none)Texttext(bytes32 node, string key)setText(bytes name, string, string)ENSIP-5Content hashcontenthash(bytes32 node)setContenthash(bytes name, bytes)ENSIP-7Name (reverse)name(bytes32 node)setName(bytes name, string)EIP-181ABIABI(bytes32 node, uint256)setABI(bytes name, uint256, bytes)EIP-205InterfaceinterfaceImplementer(bytes32, bytes4)setInterface(bytes name, bytes4, address)ENSIP-8Datadata(bytes32 node, string key)setData(bytes name, string, bytes)ENSIP-24
Resolution starts at the Universal Resolver,
which calls the resolver's resolve(name, data) function with the profile
calldata shown in the Read column as data. The node argument inside it is
ignored (the resolver derives the node from name), and the contract has no
standalone getters for record values.
Setters take the DNS-encoded name (bytes), not a namehash.
Records and Linking
The resolver stores values in records: numbered bundles holding all of a name's addresses, text records, content hash, and other values. A name is associated with a record through a link from its namehash to a record ID:
In the diagram above, alice.eth and wallet.eth serve the same set of records because both names are linked to record 1. A write to a shared record changes the values served for every name linked to it. The records of bob.eth are not shared, since it is the only name linked to record 2. The unlinked name has no record of its own and falls back to the default record, which is the record linked to the root name 0x00.
Records are created automatically: the first write to a name mints a new record (IDs start at 1), links the name to it, and emits Linked(recordId, node, name). Every later write through that name mutates the same record.
Linking Names
Two functions manage the links, both requiring ROLE_LINK on ROOT_RESOURCE (see EAC Integration):
linkToNode(sourceName, targetNode) makes sourceName use the record that targetNode currently uses. This is the way to make two names resolve identically without duplicating values.
linkToRecord(sourceName, recordId) links sourceName to a record by number. Passing 0 unlinks the name.
Both end in the same effect, setting the name's record ID. They differ only in how the record is identified: by example of another name, or directly by number. Linking is bundle-level: a name serves either all of a record's values or none of them.
Records are never deleted: unlinking a name leaves the record in place for any other names still linked to it.
The Default Record
A name with no record of its own serves the default record, the record linked to the root name 0x00 (namehash bytes32(0)). Writing records via the root name manages the defaults for every unlinked name on the resolver. The fallback is per name, not per value: once a name has its own record, missing values in it return empty results instead of the default record's values.
Use Cases
Multiple names, same records: point wallet.eth, brand.eth, and company.eth at the same resolver, then link them to one record so they share one set of values
Name migration: link a new name to the old name's record, then unlink the old name. The record moves without copying a single value
Shared defaults: set records on the root name once and let all subnames serve them until they get records of their own
Note that record linking at the resolver level is different from namespace aliasing at the registry level. Record links share record bundles; registry aliasing shares entire namespaces.
EAC Integration
All permissions are managed through Enhanced Access Control.
Roles
Each record type has its own role. A role is always held at a resource: either ROOT_RESOURCE, which covers the whole resolver, or the resource of a setter argument such as a text key or coin type. The same role bit granted at different resources yields independent permissions, which is how a single ROLE_SET_TEXT bit can be restricted to one specific key.
There is no per-name scoping: a role holder can write the covered records on every name served by the resolver instance. For example, if the owner of alice.eth grants an account ROLE_SET_TEXT for the description text key, that account can modify the description record of every name served by the instance, including alice.eth itself.
RoleValueScopePurposeROLE_SET_ADDRESS1 << 0root or coin typeSet address recordsROLE_SET_TEXT1 << 4root or text keySet text recordsROLE_SET_CONTENTHASH1 << 8rootSet the content hashROLE_SET_ABI1 << 12root or content typeSet ABI recordsROLE_SET_INTERFACE1 << 16root or interface IDSet interface recordsROLE_SET_NAME1 << 20rootSet the reverse nameROLE_SET_DAT
```

```text
=== https://docs.ens.domains/learn/deployments (200) ===
Deployments
InfoThis page contains information that is only relevant to developers who would
like to interact with the contract manually. Most libraries will handle this
for you.
ENS is multichain (read more here) and can be used in any application.
In addition to being able to query many address formats and record types, data can be stored practically anywhere.
However, resolution needs to start somewhere, so the entrypoint for resolution is Ethereum Mainnet, alongside the most popular testnets.
Ethereum Mainnet→BaseArbitrumOffchain...
Deployments
Below you will find an abbreviated list of our latest contract deployments. The deployment sources are ensdomains/ens-contracts for ENSv1 and ensdomains/contracts-v2 for ENSv2.
Mainnet (ENSv2)
The ENSv2 contracts are deployed on Ethereum Mainnet ahead of the ENSv2 launch. Until the launch completes, resolution and registrations on Mainnet continue through the ENSv1 contracts below.
ContractAddressBatchRegistrarABISource0xf0ccfbf6dba1e01ccb833ced6d551a8f000e9721BoxedENSURIRendererABISource0x6f412ff4144d525f791777d3384e9a1b170492fbContractNamerABISource0x5cdaf63d4c2a01218149dde707e5bc239c68730cDefaultReverseRegistrarAdapterABISource0xd86e32499ecafe9c181dd7410f93a1a9bb61ef0dDNSAliasResolverABISource0x13285e928c65befd90904f77a68fe4e7d9a43882DNSSECGatewayProviderABI0xa646bcee466d77669a087f3379640cb03aca7c3dDNSTLDResolverABISource0xab48304a2520ce420e636aacd48a8bb3e7e485eeDNSTXTResolverABISource0xbb76e2ae1a61ef91d095ec044abf563e4c464e3eENSURIRendererABISource0x82cac0d801b9a392a4ff217d5e68145801e90a41ENSV1ResolverABISource0x394d8eb4a4fdf599384deab25f31d111d755c398ENSV2ResolverABISource0x3071ad643ce4ed8b3d67b289845b45db82b068a4ETHRegistrarABISource0xd6d8369e55c94ae8afa714e6cf7ab5be54d5cc81ETHRegistryABISource0xf60aba43e1f7f3dab1186ff03b561401c9df85e2ETHRenewerV1ABISource0x56c447f308f463a01121c41e72b0e7e7557fcb68GraveyardABISource0xda021a2c1c2f99574d861ef8c6fa745851beb7f6HCAOwnerAndSessionValidatorABISource0xa818428ed2f3f949bdc71b8a15bdd7b5d27ce938HCAUpgradeSetABISource0x85e115f5b43c72e2ba4419a9a95e325db18431c2LabelStoreABISource0x31e5e081fe38d15b3e8214ba5cb08dc4708b70baLockedMigrationControllerABISource0x3cea18620883a69ed349b23328a3b6302598e51aManagedUniversalResolverProxyABISource0xcffd2ae680cd110d28739a70922636b5937b022bMigrationHelperABISource0x6c8452afc6043b5af32eb345a8135108906f07eePermissionedResolverImplABISource0x565b0f456a04ac9b48758190e90030623cff57c5PublicResolverSetABISource0xffceda021cbdf20f1a66ebbef32e49d208cabf62PublicResolverV2ABISource0x66f9f566ff2f26309c1bd9134388478a801da3e1RegistryUpgradeSetABISource0x573a73c0b3c0c90bb8bd728519434af19fb88935ReverseRegistrarAdapterABISource0x349151735790269a9c14668b58d7c83b5ecb9607RootBatchRegistrarABISource0xe467ae049ddd65a21fb85b5f1de5f7997a8eb164RootRegistryABISource0x2553c09be6447beffdb86fa622ad41fb8f77a91eStandaloneHCAFactoryABISource0x742bf21897a78e2c98cc5f5c5473a370a081e561StandaloneHCAImplementationABISource0x116f462fa078ec0009e9b25dcd60309e70aac4f4StandardRentPriceOracleABISource0x76f29609a363a8a1a2a6abe2e859c0f8916af469UniversalHelperABISource0x46ae127d14683ac74ef151e46ae2117a1a25c676UniversalResolverV1ABISource0x804bf0d289c8353a0bafdaaf9069ab14c92b2099UniversalResolverV2ABISource0x06fdd07f007adac667177b46ab2eb9a75132cfd5UnlockedMigrationControllerABISource0xab821ca676cf2e0790fa273526a165cfa86aeb64UpgradableUniversalResolverProxyABISource0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEeUserRegistryImplABISource0xfaa23592aca10a6d8875b18ea86954e8eb6d8d72VerifiableFactoryABISource0x77510ba162dfea3d8989e3f0928a691b345730d2WrapperRegistryImplABISource0xe86a4ef4d7a210aaa1d6a9594fc7add7cd2cf888
Mainnet (ENSv1)
Interact with ENS on Ethereum Mainnet via app.ens.domains.
ContractAddressRegistryABISource0x00000000000C2E074eC69A0dFb2997BA6C7d2e1eBase RegistrarABISource0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85ETH Registrar Controller (Latest)ABISource0x59E16fcCd424Cc24e280Be16E11Bcd56fb0CE547Wrapped ETH Registrar ControllerABI0x253553366Da8546fC250F225fe3d25d0C782303bDNS RegistrarABISource0x8284c9d6e7882fe1de49c79062a4c797f0988b3dL1 Reverse RegistrarABISource0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7CbDefault Reverse RegistrarABISource0x283F227c4Bd38ecE252C4Ae7ECE650B0e913f1f9Name WrapperABISource0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401Public ResolverABISource0xF29100983E058B709F3D539b0c765937B804AC15Universal ResolverABISource0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe
Sepolia (ENSv2)
Sepolia runs the ENSv2 contracts: the Universal Resolver and the ENS apps for Sepolia resolve through this deployment. Interact with it via the ENS App and the ENS Explorer.
ContractAddressBatchRegistrarABISource0x4a4c8b7cdab6b19dc2cdb417cdb53a2ccbaf5322BoxedENSURIRendererABISource0x0f5b101b6fc626b9b210bb5e70f60f3dd9ca0d96ContractNamerABISource0x606f2453484f4fa85b6e5fdb0e0bf777064bf9f3DefaultReverseRegistrarAdapterABISource0x36f97328e843e37520cbf530e9402791c2754066DNSAliasResolverABISource0xe30c9374929de41b71b6fb999b945553f2194c5fDNSSECGatewayProviderABI0xd542a53982fdd0c456f02c5a54734c06073fa915DNSTLDResolverABISource0x0c9f5e9ae61165140b49919f0df13c0a6642e80dDNSTXTResolverABISource0x00263173b7de91594eb4140ad8dd3a723b8e4eb3ENSURIRendererABISource0x4d7f0349dffb8e7bed9ffba1b9e45f7ecbd4f0f8ENSV1ResolverABISource0x322b7581ca210a69c6d0e0d7c88a7688d2789cb0ENSV2ResolverABISource0x1cf3989ed3e5ec3cb1d731fc3777323813b61acfETHRegistrarABISource0xf633e7fc17e2bbe0d0965d18ec1821dcb754a3d3ETHRegistryABISource0xd4ebcbbdf463c9c45784603db0ddd499bc44a8b4ETHRenewerV1ABISource0xf2ece44980778966b8a0fccb3a9e339440f6e045GraveyardABISource0xb58a90a39d13cce1d0e192b5da5c47640855b04dHCAOwnerAndSessionValidatorABISource0x4bf641590ab18e31b9f8789a3417a2620f860466HCAUpgradeSetABISource0xcde956d6e2949bc25a4273f93e0db6f68a1a6f34LabelStoreABISource0xed8246ff02203a4d4cb262bd78beaa7408a57caeLockedMigrationControllerABISource0x6029a063d69b09d23c52a754a90e4fe43adac3a8ManagedUniversalResolverProxyABISource0x6d80F2172CFdEc5730fE683860C33d26fC42e6F1MigrationHelperABISource0xa8f86ee5cdd28703bd876f3a8c10b1de70f36899MockDAIABISource0xf6fac8a58a0be13b9197f27c41b73162fe32572bMockUSDCABISource0x240b0316df57887dbbe58b586508b19e633a14aaPermissionedResolverImplABISource0x115eb53f0c60696633855f90b138178fb40b2b2cPublicResolverSetABISource0x5b2bd5208dac31905106d8e5a4973ae1cd7414f2PublicResolverV2ABISource0xdc4a563d00f5c3012b699794eb9e13a561be386fRegistryUpgradeSetABISource0xf0a6f68c28603bdf2881ca17476ee477c72cd2feReverseRegistrarAdapterABISource0x56bce5e727faa9d237341bb5b9e8a03d5919779dRootBatchRegistrarABISource0x4cdedc6b514a6bc9b64854dfe2d6849d5b1369a6RootRegistryABISource0xb458d6a3a77919449d03e7a6903c26827c1ec43fStandaloneHCAFactoryABISource0x6bad0176236e97b346b5dd13bcc8325b931ee8abStandaloneHCAImplementationABISource0xc940e5c5bf263c0e097054aecf73826769a72ceeStandardRentPriceOracleABISource0x8196665d4ca7488b6474a9ec8e7d2719fb42263aUniversalHelperABISource0xd453e5bdb62cc3bea84341b1e306319c8ffd7dfeUniversalResolverV2ABISource0x24e1d8e068620b647ca097f961a61055f4f42d72UnlockedMigrationControllerABISource0x2a35b94df22cc7354570be2284655e2cdc0e64a2UpgradableUniversalResolverProxyABISource0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEeUserRegistryImplABISource0x9bd8a88719068d09ecee662f36c0e3856708366aVerifiableFactoryABISource0xda70306c98e97ece36f997a21368e53298572991WrapperRegistryImplABISource0xbe768b63e5fbbfbb0ae97e9064e0002df8001880
Sepolia (Legacy)
ExclamationThese ENSv1 contracts still exist on Sepolia but are no longer in use: the Universal Resolver and the ENS apps for Sepolia are linked against the ENSv2 deployment above.
ContractAddressRegistryABISource0x00000000000C2E074eC69A0dFb2997BA6C7d2e1eBase RegistrarABISource0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85ETH Registrar ControllerABISource0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968DNS RegistrarABISource0x7466e17416a7d27e922a0e0efab719581fa24f63L1 Reverse RegistrarABISource0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6Default Reverse RegistrarABISource0x4F382928805ba0e23B30cFB75fC9E848e82DFD47Name WrapperABISource0x0635513f179D50A207757E05759CbD106d7dFcE8Public ResolverABISource0xE99638b40E4Fff0129D56f03b55b6bbC4BBE49b5Universal ResolverABISource0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe
Holesky
ExclamationHolesky testnet support is being phased out. Please migrate your workflows to Sepolia.
Interact with ENS on the Holesky testnet via holesky.app.ens.domains.
ContractAddressRegistryABISource0x00000000000C2E074eC69A0dFb2997BA6C7d2e1eBase RegistrarABISource0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85ETH Registrar ControllerABISource0xFce6ce4373CB6E7e470EAa55329638acD9Dbd202DNS RegistrarABISource0x458d278AEd4cE82BAeC384170f39198b01B8351cL1 Reverse RegistrarABISource0x132AC0B116a73add4225029D1951A9A707Ef673fDefault Reverse RegistrarABISource0x169835AC9057d22494Be5De9Cc26B460D93b1612Name WrapperABISource0xab50971078225D365994dc1Edcb9b7FD72Bb4862Public ResolverABISource0x6925affDa98274FE0376250187CCC4aC62866dCdUniversal ResolverABISource0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe
But what about multichain?
While the core ENS protocol lives on Ethereum Mainnet, it can be used to resolve data for any chain!
Offchain / L2 ResolversLearn more about ENS on Layer 2 and offchain solutions
```

```text
=== https://docs.ens.domains/ensv2/mutable-token-ids (200) ===
Mutable Token IDs
Names in the Permissioned Registry are represented as ERC1155Singleton tokens, where each registered name is a token with exactly one owner. ENSv2's Enhanced Access Control system allows name owners to delegate fine-grained permissions to multiple accounts. This flexibility requires a mechanism to keep permissions in sync with a name's lifecycle, for example invalidating delegated roles when a name changes hands or expires. ENSv2 solves this with mutable token IDs that change in response to security-relevant events, providing automatic protection against two attack vectors: stale permissions and transfer griefing.
The Problem
Stale Permissions
Imagine Alice registers alice.eth and grants Bob ROLE_SET_RESOLVER. Later, Alice's name expires, and Carol registers alice.eth. If permissions were tied to a fixed identifier, Bob's role grant from Alice's registration would carry over - Carol wouldn't know that Bob has resolver permissions on her newly-registered name.
Transfer Griefing
Imagine Alice owns alice.eth with ROLE_CAN_TRANSFER_ADMIN and ROLE_SET_RESOLVER_ADMIN, and lists it for sale on a marketplace. The marketplace holds an approval to transfer the token. A buyer submits a purchase transaction, which enters the mempool. Alice sees it and frontruns with a revokeRoles call that strips ROLE_SET_RESOLVER_ADMIN from the name. The buyer's transaction then executes - they receive the name, but it's been silently degraded: they can no longer change the resolver. Without mutable token IDs, the buyer would have no protection against this.
How Token IDs Work
Canonical ID
Each name in the registry is internally tracked by its canonical ID, a stable 256-bit identifier derived from the name's labelhash (keccak256 of the label string) with the lower 32 bits zeroed out. The canonical ID never changes for a given label, regardless of how many times the name is registered, transferred, or has its permissions modified.
The registry uses the canonical ID as the key to look up the name's storage entry, which contains the name's current state: subregistry, resolver, expiry, and two version counters. From this entry, the registry derives the name's current token ID (used for ERC1155 ownership) and its current resource (used as the key for EAC permission storage). Both are produced by encoding a version counter into the lower 32 bits of the canonical ID.
Version Counters
The Permissioned Registry maintains two version counters in each name's storage entry:
CounterIncremented whenEncoded intoPurposetokenVersionIdRoles are granted or revoked, name is unregistered or re-registeredToken IDInvalidates marketplace approvals when the name's permission profile changeseacVersionIdName is unregistered or re-registeredResourceIsolates permissions across different registrations of the same label
When a counter increments, the derived ID changes, producing a new token ID or a new resource. Re-registra
```

```text
=== https://docs.ens.domains/building-with-ai (200) ===
Building with AI
ENS provides tools and resources for developers building with large language models (LLMs) and AI assistants. Whether you're using AI to help write code, building agentic applications, or integrating ENS into AI-powered products, these resources will help.
Plain Text Documentation
LLMs work best with plain text content that has fewer formatting tokens. ENS hosts machine-readable versions of this documentation following the emerging llms.txt standard.
FileDescription/llms.txtConcise overview of ENS documentation with links/llms-full.txtComplete documentation in plain text format
You can provide these URLs to AI assistants or include them in your RAG (Retrieval-Augmented Generation) pipelines to give your AI tools up-to-date knowledge about ENS.
Example Usage
When working with an AI assistant, you can reference these files directly:
CopyPlease read https://docs.ens.domains/llms.txt to learn about ENS,
then help me integrate ENS name resolution into my application.
Context7 MCP
Context7 provides a Model Context Protocol (MCP) server that gives your AI coding assistant access to up-to-date ENS documentation. Once installed, you can simply ask your AI to use Context7 when working on ENS integrations.
Installation
Install the Context7 MCP in your preferred AI coding tool:
Claude CodeCursor (~/.cursor/mcp.json)WindsurfTerminalClaude CodeCopyclaude mcp add context7 -- npx -y @upstash/context7-mcp
Example Prompts
Once Context7 is connected, you can use prompts like:
CopyAdd ENS name resolution to this address input field. Use context7.
CopyShow me how to fetch a user's avatar from their ENS name. Use context7 for ensdomains/docs.
CopyHelp me implement reverse resolution to show ENS names instead of addresses. Use context7.
The key is adding "use context7" to your prompt, which tells your AI assistant to fetch the latest ENS documentation before responding.
Community MCP Servers
The community has built additional MCP servers that may be useful for ENS and greater Ethereum ecosystem development:
Ethereum MCP - General-purpose EVM tools including ENS resolution, ABI parsing, and more
ENS MCP by Namespace - Lets AI agents query ENS names, subnames, ownership, profiles, pricing, availability, and history.
These are independently maintained by community members. Check their documentation for installation instructions and available features.
Tips for AI-Assisted Development
When building ENS integrations with AI assistance:
Use the full docs - For comprehensive context, use /llms-full.txt in your prompts
Specify your stack - Mention which library you're using (viem, ethers.js, ENSjs) for more relevant code examples
Ensure ENSv2 readiness - Point your AI to the ENSv2 readiness guide to make sure your integration is compatible
Get Help
For human support, join the ENS Developers Telegram group.
See Also
Getting Started with ENS - Introduction to integrating ENS
Preparing for ENSv2 - Ensure your app works with ENSv2
Tools & Libraries - SDKs and libraries for ENS development
```


## KEY FACTS / ANSWERS (ENS) (01:32 IST)
- Network: prize says verbatim "Project must be built on ENSv2 on Ethereum mainnet or Sepolia." (Best Use of ENSv2, $7,000: 3,000/2,000/1,000/1,000 = 4 winners; the mainnet-only rule applies to the Continuity "Best Integration" prize). Docs nuance: deployments page says "The ENSv2 contracts are deployed on Ethereum Mainnet ahead of the ENSv2 launch. Until the launch completes, resolution and registrations on Mainnet continue through the ENSv1 contracts"; "Sepolia runs the ENSv2 contracts"; App-dev tutorial: "ENSv2 is currently deployed on Sepolia for testing." => Sepolia is the practical target. Prize page's "ENSv2 is now live on Ethereum mainnet" conflicts with docs wording (docs say launch not complete). Risk: flag as discrepancy.
- Sepolia ENSv2 addresses (docs, verbatim): ETHRegistry 0xd4ebcbbdf463c9c45784603db0ddd499bc44a8b4; ETHRegistrar 0xf633e7fc17e2bbe0d0965d18ec1821dcb754a3d3; RootRegistry 0xb458d6a3a77919449d03e7a6903c26827c1ec43f; UserRegistryImpl 0x9bd8a88719068d09ecee662f36c0e3856708366a; PermissionedResolverImpl 0x115eb53f0c60696633855f90b138178fb40b2b2c; VerifiableFactory 0xda70306c98e97ece36f997a21368e53298572991; UniversalResolverV2 0x24e1d8e068620b647ca097f961a61055f4f42d72; Universal Resolver proxy 0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe (same on mainnet and Sepolia); StandardRentPriceOracle 0x8196665d4ca7488b6474a9ec8e7d2719fb42263a; MockUSDC 0x240b0316df57887dbbe58b586508b19e633a14aa. Mainnet list is on the same page (recorded above). Source repo: ensdomains/contracts-v2.
- Named ENSv2 features in prize text: hierarchical registry structure; wildcard resolution; "deploy your own subname registry to tokenize and manage subnames under your own rules"; Enhanced Access Control ("shared, role-based permission system behind both registries and resolvers"); "Give subnames their own Permissioned Resolver"; record aliasing (resolver level), namespace aliasing (shared registry); "subname setups: expiring, revocable, non-transferable vs. transferable, even forever names with no parent control". "Bonus points if you bring AI agents into the mix. Think agents as namespaces."
- Mechanics from docs for our design: UserRegistry attached via setSubregistry(); register(label, owner, registry, resolver, roleBitmap, expiry); registrar contract needs ROLE_REGISTRAR (1<<0) + ROLE_RENEW (1<<16) on ROOT_RESOURCE; ROLE_UNREGISTER (1<<12) = revocation ("unregister() sets the name's expiry to block.timestamp ... token is burned"); NON-TRANSFERABLE = simply do not give owner ROLE_CAN_TRANSFER_ADMIN: "Transferring a name's token requires ROLE_CAN_TRANSFER_ADMIN on the current owner of the token (the transfer reverts with TransferDisallowed otherwise)"; expiry is per-label set at register and extendable via renew (ROLE_RENEW), "Cannot reduce the current expiry". Revocation needs the committee to keep ROLE_UNREGISTER (root) => registry NOT emancipated => transfers revert with TransferUnsafeUntilRegistryIsEmancipated, which is fine for non-transferable. Resolver roles: ROLE_SET_ADDRESS 1<<0, ROLE_SET_TEXT 1<<4 (scope: root or text key), etc.; "no per-name scoping" inside a shared resolver instance (a text-key role applies to every name served by that resolver instance) => per-phone own PermissionedResolver needed if a phone must write only its own records. EAC: 64 roles/resource, up to 15 holders per role per resource. Safe as the committee: a contract account can hold admin roles (any address); not documented specially, so unverified.
- Grace period: 28 days (v1 90). Names are ERC1155Singleton tokens; token IDs mutable.
- "no hard-coded values" is only the prize sentence: "Your demo must be functional and not just include hard-coded values." Meaning not further defined on the page. Also: "ENSv2 features should be central to the product, not a cosmetic add-on." Submission: "your project showcase must have a link to a live demo and the code needs to be open source and accessible on Github or a similar platform."
- Number of winners 4 (3rd place listed twice); no judging weights given; no list of ideas beyond the prize text; no disqualifier list beyond the above.
- Docs pages: Building with AI = llms.txt, llms-full.txt, Context7 MCP; no prompt injection seen. The ChatGPT "open page" link hrefs are standard doc-site buttons.

## Pages visited / blocked / tools used
Visited: ethglobal.com/events/mumbai/prizes (ENS section), docs.ens.domains/ensv2/{overview,subnames,registry-hierarchy,permissioned-registry,enhanced-access-control,permissioned-resolver,registry-template,tutorial-contract-developers,tutorial-app-developers,mutable-token-ids}, /learn/deployments, /building-with-ai, /llms.txt. Not visited: ENSIP-25/26 pages, ens-cli repo, workshop video. Blocked: none. Tools: Playwright MCP (navigate, evaluate), Bash.
