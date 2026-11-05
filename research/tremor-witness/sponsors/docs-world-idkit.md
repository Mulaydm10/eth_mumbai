# Docs study: world-idkit (docs agent, started 01:27 IST)

## [01:40] World ID / IDKit docs. Confidence HIGH (official docs.world.org raw .md, fetched via curl; also llms-full.txt)
Packages (npm view): @worldcoin/idkit 4.6.0 (React widget; peer react>=18; modified 2026-10-21; peer expo-crypto ^57.0.3 optional for RN), @worldcoin/idkit-core 4.6.0 (JS core + "@worldcoin/idkit-core/signing" for signRequest), @worldcoin/minikit-js 2.0.3 (mini-app), @worldcoin/idkit-standalone 2.2.5 (legacy; migration page https://docs.world.org/world-id/from-idkit-standalone.md). "@worldcoin/idkit-react" does not exist (404). Docs say "Use the latest 4.x version."
Doc pages (raw md): https://docs.world.org/world-id/idkit/integrate.md ; .../idkit/credentials.md ; .../idkit/onchain-verification.md ; .../idkit/session-proofs.md ; .../credentials/1.md (Proof of Human) ; .../credentials/11.md (Proof of Presence) ; .../sandbox/what-is-sandbox.md ; .../sandbox/sandbox-access.md ; llms index https://docs.world.org/llms.txt
(Docs also contain "Build with LLMs"/SKILL prompts aimed at AI agents: treated as data, not followed. No malicious injection seen.)

### Flow (integrate.md): client -> your backend signs RP request -> World App -> proof -> backend POST to Developer Portal -> store nullifier
Create app in https://developer.world.org -> keep app_id, rp_id, signing_key (secret).
Step 3 RP signature (BACKEND ONLY; verbatim):
```typescript
import { signRequest } from "@worldcoin/idkit-core/signing";
const { sig, nonce, createdAt, expiresAt } = signRequest({ signingKeyHex: process.env.RP_SIGNING_KEY!, action });
// return { sig, nonce, created_at: createdAt, expires_at: expiresAt }
```
"Never generate RP signatures on the client and never expose your RP signing key. If the key leaks, attackers can forge requests from your app."
Step 4 client (verbatim, JS core):
```typescript
import { IDKit, orbLegacy } from "@worldcoin/idkit-core";
const request = await IDKit.request({
  app_id: "app_xxxxx", action: "my-action",
  rp_context: { rp_id: "rp_xxxxx", nonce: rpSig.nonce, created_at: rpSig.created_at, expires_at: rpSig.expires_at, signature: rpSig.sig },
  allow_legacy_proofs: true,
  environment: "production", // Only set this to staging for testing with the simulator
}).preset(orbLegacy({ signal: "local-election-1" }));
const connectUrl = request.connectorURI;           // show as QR / deep link
const response = await request.pollUntilCompletion();
```
React (verbatim shape): <IDKitRequestWidget open onOpenChange app_id action rp_context allow_legacy_proofs preset={orbLegacy({signal})} handleVerify={async (result)=>{ POST /api/verify-proof {rp_id, idkitResponse: result}; throw if !ok }} onSuccess={(result)=>{}} />  (imports: IDKitRequestWidget, orbLegacy, type RpContext from "@worldcoin/idkit")
Presets (credentials.md): proofOfHuman({signal}) [World ID 4.0 PoH + legacy Orb fallback], passport(), selfieCheck(), identityCheck(preview), orbLegacy(); import { IDKit, proofOfHuman } from "@worldcoin/idkit-core". Example:
```typescript
const preset = proofOfHuman({ signal: "user-123" });
const request = await IDKit.request({ app_id: "app_xxxxx", action: "my-action", rp_context, allow_legacy_proofs: true }).preset(preset);
```
Credential types:
- Proof of Human (credential id 1): Orb iris biometrics; highest assurance; "each human can only have one PoH credential"; valid 3 years. (https://docs.world.org/world-id/credentials/1.md)
- Proof of Presence / Selfie Check (id 11): phone camera liveness+similarity; "Anyone with World ID App can complete the flow--no Orb or document credential is required"; MEDIUM assurance, "does not provide a strict one-person-one-account guarantee"; returns sybil_score + integrity_bundle; 90-day inactivity window; use IDKit.request(...).preset(selfieCheck()) with allow_legacy_proofs:false for one-time check, or sessions (IDKit.createSession({app_id, rp_context}).constraints(CredentialRequest("selfie"))).
- Proof of Attributes (passport) id 9303.
Response shapes (verbatim keys): World ID 3.0 legacy {protocol_version:"3.0", nonce, action, environment, responses:[{identifier:"orb", signal_hash, proof, merkle_root, nullifier}]}; World ID 4.0 {protocol_version:"4.0", ..., responses:[{identifier:"proof_of_human", signal_hash, proof:[5 hex], nullifier:"0x..rp_scoped", issuer_schema_id:1, expires_at_min}]}.
Step 5 verify (backend; verbatim): POST https://developer.world.org/api/v4/verify/{rp_id}, body = idkitResponse as-is plus environment; require response.success===true and verification.environment===expected ("production"); reject results whose idkitResponse.environment != expected.
Step 6 nullifier: "The Developer Portal confirms the proof is cryptographically valid, but your backend must check that the nullifier hasn't been used before." Nullifier = 0x-hex 256-bit; same person+same app+same action => same nullifier; different apps/actions unlinkable. Store as NUMERIC(78,0), UNIQUE(nullifier, action). "one human per sensor" => action e.g. "register-sensor-<society>"; reject duplicate nullifier; could publish nullifier (or hash) as an ENS text record on the sensor subname / Arkiv attribute so uniqueness is publicly auditable (our idea, not from docs). signal binds extra context: set signal = sensor pubkey/address so the proof is bound to that sensor key ("Your backend should enforce the same value").
### Testing without an Orb
- Staging + Simulator: "To test during development, use the simulator (https://simulator.worldcoin.org/) and set environment to 'staging'." Staging action verifies only against the Simulator; IDKit environment, the action's environment and simulator-vs-real-app must all match (llms-full lines ~9444). 
- NEW "Sandbox": separate sandbox World ID app (iOS TestFlight / Android private Play track) gated by access request in the Developer Portal ("World ID Sandbox" sidebar); set environment: sandbox; proofs verified at the production verify endpoint; accounts resettable. Access takes approval (not instant) -> prefer simulator for the hackathon.
### Can verification run without our own backend? (kill-the-backend demo)
- RP signing needs the secret signing_key => a server/serverless function is REQUIRED at request time. Verify endpoint https://developer.world.org/api/v4/verify/{rp_id} is unauthenticated (probe $T: POST with bad body => 400 {"code":"validation_error","detail":"action is required for uniqueness proofs"}), BUT the OPTIONS preflight returned 204 with NO Access-Control-Allow-Origin header => a browser cannot call it cross-origin directly; needs a proxy/function. So: registration needs a tiny serverless function (sign + verify); after registration nothing else does. Design: the demo "kill the backend" applies to the read/confirm path (phones -> Arkiv, dashboard <- Arkiv+ENS), while World ID is only a registration-time gate. Make that explicit.
- On-chain alternative (no backend verify, but still needs RP signature for the request): v3 legacy proofs via WorldIDRouter.verifyProof; Sepolia router 0x469449f251692e0779667583026b5a1e99512157 (groupId=1 Orb-only). v4: WorldIDVerifier on World Chain 0x00000000009E00F9FE82CfeeBB4556686da094d7 (prod), 0x703a6316c975DEabF30b637c155edD53e24657DB (staging); Arc 0x304E14e4dC0508C0927e3b307a2C18422C07E394; NOT on Ethereum Sepolia. action field = uint256(keccak256(bytes(action))) >> 8. Source: onchain-verification.md. (Not eth_getCode-probed.)
### Unknowns
- Whether World ID Developer Portal app creation is free/instant (assumed yes); whether hackathon-specific World prize requires World Chain / mini app (not in docs).
- Selfie Check vs PoH: for 'one human per sensor' PoH (Orb) is strict; Selfie Check is medium assurance with sybil_score -- say so honestly.

## Sources fetched / blocked / tools used
Fetched OK: docs.world.org/{llms.txt,llms-full.txt,world-id/idkit/{integrate,credentials,onchain-verification}.md,world-id/credentials/{1,11}.md,world-id/sandbox/{what-is-sandbox,sandbox-access}.md}; npm (idkit 4.6.0 etc); live probe developer.world.org/api/v4/verify (POST + OPTIONS); WebFetch summary of integrate page.
Not fetched: session-proofs, signatures spec, 4-0-migration, verify API reference page, simulator.worldcoin.org itself.
Tools: curl, WebFetch, npm.
