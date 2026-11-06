# D2 source excerpts: Arkiv docs (method: curl https://docs.arkiv.network/<path>/ then tag-strip; date 2026-11-06)
## llms.txt https://docs.arkiv.network/llms.txt (200). /llms-full.txt returned 404.
Excerpt: "- [Watch entity events](https://docs.arkiv.network/querying/watch-events/): `watchEntityEvents`" ; "- [Change and delete](.../writing/change/): `patchEntity`, `changeOwnership`, `deleteEntity`" ; "- [Batches](.../writing/batches/): `executeBatch`, `predictEntityKeys`" ; "- [Paginate results](.../querying/paginate/): `limit` (max 100), `fetch`, `next`, `for await`, `cursor`, `atBlock`" ; "Arkiv is a public database: anyone can write entities of any shape ... filter by owner or creator (`.ownedBy(address)`, `.createdBy(address)`) when you need to trust what you read".
## querying/watch-events
"The SDK polls the node for new events, every half block by default. Set pollingInterval in milliseconds to change it." Handlers: onEntityCreated(owner, expiresAt, creationFlags), onEntityPatched(owner), onExpiryExtended(owner, expiresAt), onOwnershipTransferred(previousOwner, newOwner), onEntityDeleted(owner). "Events carry no attributes." "owner on onExpiryExtended is the entity's owner, not the account that extended it. Arkiv emits no event when an entity expires."
## writing/create
"flags sets properties that can never change afterwards ... readonly: the entity's attributes can never be changed. You can still extend it, hand it over or delete it. permissionlessExtension: anyone can extend the entity, not only its owner. Use this to let others keep an entity alive without letting them change it". "Pass salt: NO_SALT for a key that anyone can work out from the owner's address and counter".
## writing/change
"changeOwnership makes another account the owner. From then on, only the new owner can change the entity ... The entity's $creator stays the account that created it." "Only the owner can do any of these."
## writing/batches
"executeBatch sends many operations in one transaction. Either every operation applies or none does. A batch can mix entities of several schemas, and a create in it can refer to another entity the same batch creates." Lists: creates, patches, extensions, ownershipChanges, deletes. predictEntityKeys + key() column.
## writing/expiration
"No entity lives more than 7,884,000 blocks, about 182.5 days ... To keep an entity longer, extend it before it expires." "A duration counts from now, not from the current expiration." "Only the owner can extend an entity, unless it was created with the permissionlessExtension flag." "Arkiv emits no event when an entity expires. ... use $expiresAt". Filter example: lt("$expiresAt", u64(currentBlock + 43_200n)) = one day.
## start-here/clients
"Arkiv's public RPC is heavily rate limited to prevent abuse, so get a free key from the Arkiv Hub ... In a browser app, read the key from your bundler's public environment variables and lock it to your site."
## reference/limits
32 attributes; name 32 B; str 128 B; bytes 128 KiB per create or patch; lifetime 7,884,000 blocks; 100 rows per page.
## reference/query-language
Operators: = < <= > >= BETWEEN STARTSWITH EXISTS TYPEOF AND OR NOT; ORDER BY one attr; filter+sort fields $key $owner $creator $expiresAt; "A sort sees only the attribute stored with its type."; "$createdAt and $updatedAt can't be sorted on". Only indexed attributes are filterable.
## json-rpc/querying-data
arkiv_query (select key/owner/creator/createdAt/updatedAt/expiresAt/creationFlags/attributes/attributeSchema/count; limit; offset), arkiv_getEntity, arkiv_getBlockTiming.
## SDK package (npm pack @arkiv-network/sdk@1.0.1) src/chains/rabdi.ts
rpcUrls http [https://rpc.rabdi.db-chain.testnet.arkiv.network/<key>] and webSocket [wss://...<key>]; explorer https://rabdi.explorer.arkiv.network; hub URL https://hub.arkiv.network/access-keys (in warning text). src/consts.ts: ARKIV_ADDRESS = 0x4400000000000000000000000000000000000044. watchEntityEvents uses viem publicClient.watchEvent (so a webSocket transport would make it push-based; polling is the default).
