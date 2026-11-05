# Track study: world-idkit
Agent: track-study. Date 2026-11-05 (IST).

## Page 1: https://ethglobal.com/events/mumbai/prizes
Fetch time: 01:28 IST | Method: Playwright navigate + evaluate document.body.innerText (page fully rendered, no clicks needed) | Verbatim section for this sponsor:

```text
World

$12,500

world.org
worldnetwork
Open page →
About

World’s developer stack helps builders create products for verified humans and AI-assisted interactions. World ID enables apps to confirm someone is a unique human without revealing their identity.

Prizes
💿 World ID Agent Pass ⸺ $2,500
🆕  This prize is only available to Continuity Track participants →
🥇
1st place
$1,500
🥈
2nd place
$1,000

Integrate World ID Agent Pass into your project. We are especially interested in agentic products, but any compelling use case is eligible.

Show what becomes possible when an application can ask a person to authenticate or complete a fresh verification at the moment.

Strong submissions will show a meaningful action that needs a human identity or approval layer, not simply a login screen added to an existing product.

Qualification Requirements
Integrate with the official World ID Agent Pass.
Demonstrate the complete journey: identity or verification request, user completion, validated result, and the protected application or agent action.
Demonstrate a denied, expired, cancelled, or otherwise unsuccessful path where the protected action does not occur.
Validate identity results in a secure backend; do not expose client secrets or treat an unvalidated client response as authorization.
Include a short integration debrief/feedback: time to first success, friction encountered, missing capability or documentation, and the one improvement with the greatest impact.
Links and Resources
World ID Agent Pass
https://auth.world.org/
↗
World ID Agent Pass Docs
https://auth.world.org/docs
↗
World ID Agent Pass Portal
https://auth.world.org/portal
↗
🚀 World ID Agent Pass ⸺ $5,000
🥇
1st place
$2,500
🥈
2nd place
$1,500
🥉
3rd place
$1,000

![We are mocking proofs now, so you don't need sandbox app anymore]!

Build an application using World ID Agent Pass. We are especially interested in agentic products, but any compelling use case is eligible.

Show what becomes possible when an application can ask a person to authenticate or complete a fresh verification at the moment.

Strong submissions will show a meaningful action that needs a human identity or approval layer, not simply a login screen added to an existing product.

NOTE: Proofs are using fake identities, DO NOT rely in them for production

Qualification Requirements
Integrate with the official World ID Agent Pass.
Demonstrate the complete journey: identity or verification request, user completion, validated result, and the protected application or agent action.
Demonstrate a denied, expired, cancelled, or otherwise unsuccessful path where the protected action does not occur.
Validate identity results in a secure backend; do not expose client secrets or treat an unvalidated client response as authorization.
Include a short integration debrief/feedback: time to first success, friction encountered, missing capability or documentation, and the one improvement with the greatest impact.
Links and Resources
World ID Agent Pass
https://auth.world.org/
↗
World ID Agent Pass Portal
https://auth.world.org/portal
↗
World ID Agent Pass Docs
https://auth.world.org/docs
↗
🪪 Best Use of IDKit ⸺ $2,500
Up to 2 teams will receive $1,250

Build a product that uses IDKit to solve a real trust moment: an event where a product needs to know something meaningful about a person before it grants access, completes an action, or changes a user’s experience.

Use the credential that is proportionate to your use case—such as Proof of Human, Passport/NFC, or Selfie Check (Now live with Sybil score). We are not rewarding the most credentials used. We are rewarding the best decision about which credential is needed, why it is needed, and how it improves a real product experience.

Strong examples could include fair access to a scarce benefit, a privacy-preserving eligibility check, recovery or protection of an important account action, or a workflow that becomes safer or simpler because it can verify the right level of human trust.

Qualification Requirements
Integrate IDKit in a functioning application, mini app, or onchain flow.
Use at least one supported World ID credential and verify the result on the server or onchain as appropriate.
Clearly explain the specific product event requiring trust and why the chosen credential is the minimum sufficient assurance.
Demonstrate a successful verification and one meaningful alternative path, such as cancellation, unavailable credential, rejection, or an ineligible user.
Include a short integration debrief/feedback: time to first success, friction encountered, missing capability or documentation, and the one improvement with the greatest impact.
Links and Resources
IDKit JS Example
https://idkit-js-example.vercel.app/
↗
IDKit integration guide
https://docs.world.org/world-id/idkit/integrate
↗
Configure credentials
https://docs.world.org/world-id/idkit/credentials
↗
Proof of Human credential
https://docs.world.org/world-id/credentials/1
↗
Passport/NFC credential
https://docs.world.org/world-id/credentials/9303
↗
Selfie Check Beta
https://docs.world.org/world-id/credentials/11
↗
Verification flows
https://docs.world.org/world-id/idkit/verification-flows
↗
Developer Portal
https://developer.worldcoin.org
↗
🎉 [Cont] Best Use of IDKit ⸺ $2,500
🆕  This prize is only available to Continuity Track participants →
Up to 2 teams will receive $1,250

Build a product that uses IDKit to solve a real trust moment: an event where a product needs to know something meaningful about a person before it grants access, completes an action, or changes a user’s experience.

Use the credential that is proportionate to your use case—such as Proof of Human, Passport/NFC, or Selfie Check (Now live with Sybil score). We are not rewarding the most credentials used. We are rewarding the best decision about which credential is needed, why it is needed, and how it improves a real product experience.

Strong examples could include fair access to a scarce benefit, a privacy-preserving eligibility check, recovery or protection of an important account action, or a workflow that becomes safer or simpler because it can verify the right level of human trust.

Qualification Requirements
Integrate IDKit in a functioning application, mini app, or onchain flow.
Use at least one supported World ID credential and verify the result on the server or onchain as appropriate.
Clearly explain the specific product event requiring trust and why the chosen credential is the minimum sufficient assurance.
Demonstrate a successful verification and one meaningful alternative path, such as cancellation, unavailable credential, rejection, or an ineligible user.
Include a short integration debrief/feedback: time to first success, friction encountered, missing capability or documentation, and the one improvement with the greatest impact.
Links and Resources
IDKit Docs
https://docs.world.org/world-id/overview
↗
Resources
World ID Simulator
https://simulator.worldcoin.org/id/0x18310f83
↗
iOS Sandbox App
https://testflight.apple.com/join/Tub7zuyD
↗
Workshop
Watch Video →
```


## docs.world.org pages
Fetch time: 01:33 IST | Method: Playwright evaluate fetch+DOMParser from docs.world.org origin; full text in .playwright-mcp/world_docs_dec.txt and world_docs2_dec.txt (scratch). Verbatim excerpts:

```text
=== https://docs.world.org/world-id/idkit/integrate (200) ===
IDKitIDKitCopy pageCopy pageIntegrate World ID into your appCopy pageCopy pageIDKit is the SDK for integrating World ID into your app. It handles proof requests, verification flows and communication with the World ID App, so your backend receives cryptographic proof of human, not personal data.
Use the React widget for drop-in integration, or the JS, Swift and Kotlin SDKs for custom flows. For the core concepts of World ID, see this page.
Tip: To integrate faster, give your coding agent the Build with LLMs prompt — copy it once, then paste into Claude, Cursor or any AI coding assistant.
​How it works
Use IDKit to request a proof and verify it on your backend: follow this guide for one-time checks, or use session proofs for returning users.
Four components are involved: your client (where IDKit runs), your backend (which signs requests and verifies proofs), the World ID App (on the user’s device) and the Developer Portal (which validates proofs on-chain). The steps below cover each one.
​Step 1: Install IDKit
Use the latest 4.x version.
JavaScriptReactSwift (SPM)Kotlin (Gradle)npm i @worldcoin/idkit-core
npm i @worldcoin/idkit
.package(url: "https://github.com/worldcoin/idkit-swift.git", from: "<version>")
dependencies {
    implementation("com.worldcoin:idkit:<version>")
}
​Step 2: Create an app in the Developer Portal
Create your app in the Developer Portal. If you’re migrating from an old app, complete RP registration by clicking the Enable World ID 4.0 banner. Keep these values:
app_id
rp_id
signing_key - this should be stored as a secret.
​Step 3: Generate an RP signature in your backend
Signatures verify that proof requests come from your app, preventing impersonation attacks.
JavaScriptGoimport { NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit-core/signing";
export async function POST(request: Request): Promise<Response> {
  const { action } = await request.json();
  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: process.env.RP_SIGNING_KEY!,
    action,
  });
  return NextResponse.json({
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt,
  });
}
package main
import (
	"encoding/json"
	"net/http"
	"os"
	"github.com/worldcoin/idkit/go/idkit"
)
func handleRPSignature(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var body struct {
		Action string `json:"action"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)
	sig, err := idkit.SignRequest(
		os.Getenv("RP_SIGNING_KEY"),
		idkit.WithAction(body.Action),
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("content-type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"sig":        sig.Sig,
		"nonce":      sig.Nonce,
		"created_at": sig.CreatedAt,
		"expires_at": sig.ExpiresAt,
	})
}
Never generate RP signatures on the client and never expose your RP signing
key. If the key leaks, attackers can forge requests from your app.
The steps below cover the standard request flow. Depending on whether the user
already has World ID and the credential you’re requesting, they may see a
different experience. See Verification flows
for details.
​Step 4: Generate the connect URL and collect proof
To test during development, use the simulator and set environment to "staging".
JavaScriptReactSwiftKotlinimport { IDKit, orbLegacy } from "@worldcoin/idkit-core";
const rpSig = await fetch("/api/rp-signature", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ action: "my-action" }),
}).then((r) => r.json());
const request = await IDKit.request({
  // App ID: `app_id` from the Developer Portal
  app_id: "app_xxxxx",
  // Action: Context that scopes what the user is proving uniqueness for
  // e.g., "verify-account-2026" or "claim-airdrop-2026".
  action: "my-action",
  rp_context: {
    rp_id: "rp_xxxxx", // Your app's `rp_id` from the Developer Portal
    nonce: rpSig.nonce,
    created_at: rpSig.created_at,
    expires_at: rpSig.expires_at,
    signature: rpSig.sig,
  },
  allow_legacy_proofs: true,
  environment: "production", // Only set this to staging for testing with the simulator
  return_to: "myapp://verify-done", // Optional: mobile deep-link callback URL
  // Signal (optional): Bind specific context into the requested proof.
  // Examples: user ID, wallet address. Your backend should enforce the same value.
}).preset(orbLegacy({ signal: "local-election-1" }));
const connectUrl = request.connectorURI;
const response = await request.pollUntilCompletion();
import {
  IDKitRequestWidget,
  orbLegacy,
  type RpContext,
} from "@worldcoin/idkit";
const rpSig = await fetch("/api/rp-signature", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ action: "my-action" }),
}).then((r) => r.json());
const rp_context: RpContext = {
  rp_id: "rp_xxxxx", // Your app's `rp_id` from the Developer Portal
  nonce: rpSig.nonce,
  created_at: rpSig.created_at,
  expires_at: rpSig.expires_at,
  signature: rpSig.sig,
};
// ...
<IDKitRequestWidget
  open={open}
  onOpenChange={setOpen}
  app_id="app_xxxxx" // Your app's `app_id` from the Developer Portal
  // Action: Context that scopes what the user is proving uniqueness for
  // e.g., "verify-account-2026" or "claim-airdrop-2026".
  action="my-action"
  rp_context={rp_context}
  allow_legacy_proofs={true}
  // Signal (optional): Bind specific context into the requested proof.
  // Examples: user ID, wallet address. Your backend should enforce the same value.
  preset={orbLegacy({ signal: "local-election-1" })}
  handleVerify={async (result) => {
    const response = await fetch("/api/verify-proof", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rp_id: rp_context.rp_id,
        idkitResponse: result,
      }),
    });
    if (!response.ok) {
      throw new Error("Backend verification failed");
    }
  }}
  onSuccess={(result) => {
    // Runs after `handleVerify` succeeds. Update app state/UI here.
  }}
/>;
import IDKit
// Fetch the RP signature from your backend
let rpSig = try await yourBackend.fetchRpSignature(action: "my-action")
let rpContext = try RpContext(
  rpId: "rp_xxxxx", // Your app's `rp_id` from the Developer Portal
  nonce: rpSig.nonce,
  createdAt: rpSig.createdAt,
  expiresAt: rpSig.expiresAt,
  signature: rpSig.sig
)
let config = IDKitRequestConfig(
  // App ID: `app_id` from the Developer Portal
  appId: "app_xxxxx", 
  // Action: Context that scopes what the user is proving uniqueness for
  // e.g., "verify-account-2026" or "claim-airdrop-2026".
  action: "my-action",
  rpContext: rpContext,
  actionDescription: "Verify user",
  bridgeUrl: nil,
  allowLegacyProofs: true,
  overrideConnectBaseUrl: nil,
  environment: .production
)
// Signal (optional): Bind specific context into the requested proof.
// Examples: user ID, wallet address. Your backend should enforce the same value.
let request = try IDKit.request(config: config).preset(orbLegacy(signal: "local-election-1"))
let connectUrl = request.connectorURL
let completion = await request.pollUntilCompletion()
import com.worldcoin.idkit.IDKit
import com.worldcoin.idkit.IDKitRequestConfig
import com.worldcoin.idkit.RpContext
import com.worldcoin.idkit.Environment
import com.worldcoin.idkit.orbLegacy
// Fetch the RP signature from your backend (see Step 2)
val rpSig = yourBackend.fetchRpSignature(action = "my-action")
val rpContext = RpContext(
  rpId = "rp_xxxxx", // Your app's `rp_id` from the Developer Portal
  nonce = rpSig.nonce,
  createdAt = rpSig.createdAt.toULong(),
  expiresAt = rpSig.expiresAt.toULong(),
  signature = rpSig.sig,
)
val config = IDKitRequestConfig(
  // App ID: `app_id` from the Developer Portal
  appId = "app_xxxxx", 
  // Action: Context that scopes what the user is proving uniqueness for
  // e.g., "verify-account-2026" or "claim-airdrop-2026".
  action = "my-action",
  rpContext = rpContext,
  allowLegacyProofs = true,
)
// Signal (optional): Bind specific context into the requested proof.
// Examples: user ID, wallet address. Your backend should enforce the same value.
val request = IDKit.request(config).preset(orbLegacy(signal = "local-election-1"))
val connectorURI = request.connectorURI
val completion = request.pollUntilCompletion()
​IDKit response
After the user completes the verification flow, IDKit returns one of the following response shapes, depending on the protocol version and proof type.
World ID 3.0 (Legacy)World ID 4.0 UniquenessSelfie CheckWorld ID 4.0 Session{
  "protocol_version": "3.0",
  "nonce": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "action": "my-action",
  "environment": "production",
  "responses": [
    {
      "identifier": "orb",
      "signal_hash": 
```

```text
=== https://docs.world.org/world-id/idkit/credentials (200) ===
IDKitConfigure CredentialsCopy pageCopy pageCopy pageCopy pageA Credential is a statement an issuer makes about a World ID holder. In IDKit, the credential you request determines what the user proves to your app.
​What you can request with IDKit
OfferingWhat it provesCommon SDK pathProof of HumanThe user is a unique human, backed by anonymous biometric verification by the Orb.proofOfHumanProof of Attributes (Passport)The user holds a verified NFC passport credential.passportProof of Presence (Selfie Check)A medium-assurance biometric credential using the device camera for liveness and facial similarity.selfieCheckProof of Attributes (Identity Check)An attestation that a document-backed property about the user matches your requested attributes.identityCheck with attributes like minimum_age, nationality, or document_type.
You can also add a liveness check to any preset with require_user_presence.
If you have an existing legacy integration, see the World ID 4.0 migration guide.
​SDK presets
Preset helpers cover common credential requests: proofOfHuman, passport, selfieCheck, identityCheck, and the legacy presets.
The snippets below assume rp_context was already generated and signed by your backend. See Integrate IDKit for the full RP-signing flow.
​Proof of Human
Use proofOfHuman for the current World ID 4.0 Proof of Human credential. The preset also includes legacy Orb fallback for users without a World ID 4.0 proof.
JavaScriptReactimport { IDKit, proofOfHuman } from "@worldcoin/idkit-core";
const preset = proofOfHuman({ signal: "user-123" });
const request = await IDKit.request({
  app_id: "app_xxxxx",
  action: "my-action",
  rp_context,
  allow_legacy_proofs: true,
}).preset(preset);
import { IDKitRequestWidget, proofOfHuman } from "@worldcoin/idkit";
const preset = proofOfHuman({ signal: "user-123" });
<IDKitRequestWidget
  open={open}
  onOpenChange={setOpen}
  app_id="app_xxxxx"
  action="my-action"
  rp_context={rpContext}
  allow_legacy_proofs={true}
  preset={preset}
  handleVerify={handleVerify}
  onSuccess={(result) => { /* ... */ }}
/>;
​Proof of Attributes (Passport)
Use passport for the current World ID 4.0 Passport credential. The preset also includes legacy Document fallback for users without a World ID 4.0 proof.
JavaScriptReactimport { IDKit, passport } from "@worldcoin/idkit-core";
const preset = passport({ signal: "user-123" });
const request = await IDKit.request({
  app_id: "app_xxxxx",
  action: "my-action",
  rp_context,
  allow_legacy_proofs: true,
}).preset(preset);
import { IDKitRequestWidget, passport } from "@worldcoin/idkit";
const preset = passport({ signal: "user-123" });
<IDKitRequestWidget
  open={open}
  onOpenChange={setOpen}
  app_id="app_xxxxx"
  action="my-action"
  rp_context={rpContext}
  allow_legacy_proofs={true}
  preset={preset}
  handleVerify={handleVerify}
  onSuccess={(result) => { /* ... */ }}
/>;
​Proof of Presence (Selfie Check)
Use CredentialRequest("selfie") with session proofs to verify
users when they first arrive and when they return. Create a session once, save its
verified session_id, then prove that same session on later checks.
Anyone with World ID App can complete the flow—no Orb or document credential is
required.
import { IDKit, CredentialRequest } from "@worldcoin/idkit-core";
const request = await IDKit.createSession({
  app_id: "app_xxxxx",
  rp_context,
}).constraints(CredentialRequest("selfie"));
Follow the session guide for the complete
create-and-return flow. Forward the complete result, including sybil_score and
integrity_bundle, to your backend and only use the score after verification
succeeds.
For a one-time check, use IDKit.request(...).preset(selfieCheck()) with an
action and allow_legacy_proofs: false. Each user can complete that action once;
see the integration guide.
If you use selfieCheckLegacy, migrate to selfieCheck for World ID 4.0.
​Proof of Attributes (Identity Check, Preview)
Identity Check is currently in preview. To use it or learn more, contact us.
Identity Check lets your app ask the user to attest that document-backed attributes match your policy, without handling the underlying document data. Use it for eligibility checks such as minimum age, document type, issuing country, or nationality. Request attributes such as:
AttributeValue typedocument_type"passport", "eid" or "mnc"document_numberstringissuing_countryISO 3166-1 alpha-3 country codefull_namestringminimum_agenumbernationalityISO 3166-1 alpha-3 country code
JavaScriptReactimport { IDKit, identityCheck } from "@worldcoin/idkit-core";
const preset = identityCheck({
  attributes: [
    { type: "document_type", value: "passport" },
    { type: "minimum_age", value: 18 },
  ],
});
const request = await IDKit.request({
  app_id: "app_xxxxx",
  action: "my-action",
  rp_context,
  allow_legacy_proofs: false,
}).preset(preset);
import { IDKitRequestWidget, identityCheck } from "@worldcoin/idkit";
const preset = identityCheck({
  attributes: [
    { type: "document_type", value: "passport" },
    { type: "minimum_age", value: 18 },
  ],
});
<IDKitRequestWidget
  open={open}
  onOpenChange={setOpen}
  app_id="app_xxxxx"
  action="my-action"
  rp_context={rpContext}
  allow_legacy_proofs={false}
  preset={preset}
  handleVerify={handleVerify}
  onSuccess={(result) => { /* ... */ }}
/>;
Successful Identity Check responses include identity_attested so your backend can tell whether the requested attributes matched.
​User presence and liveness
To check for user presence and liveness, add the require_user_presence flag to your request. This is a request-level flag, not a credential; it asks World ID for a fresh liveness check before returning the proof and fails with user_presence_failed if the check does not complete.
Depending on the credential requested, World ID matches the user’s live selfie to the credential image, such as the passport photo or the image captured during Orb verification.
JavaScriptReactimport { IDKit, proofOfHuman } from "@worldcoin/idkit-core";
const preset = proofOfHuman({ signal: "user-123" });
const request = await IDKit.request({
  app_id: "app_xxxxx",
  action: "my-action",
  rp_context,
  allow_legacy_proofs: true,
  require_user_presence: true,
}).preset(preset);
import { IDKitRequestWidget, proofOfHuman } from "@worldcoin/idkit";
const preset = proofOfHuman({ signal: "user-123" });
<IDKitRequestWidget
  open={open}
  onOpenChange={setOpen}
  app_id="app_xxxxx"
  action="my-action"
  rp_context={rpContext}
  allow_legacy_proofs={true}
  require_user_presence={true}
  preset={preset}
  handleVerify={handleVerify}
  onSuccess={(result) => { /* ... */ }}
/>;
​Other legacy presets
These presets only return World ID 3.0 proofs. Use them for existing integrations or when you need the older verification level.
PresetWhat it requestsorbLegacyOrb verification.secureDocumentLegacyAt least a Secure Document verification. Returns the user’s highest legacy credential: Secure Document or Orb.documentLegacyAt least a Document verification. Returns the user’s highest legacy credential: Document, Secure Document, or Orb.deviceLegacyDeprecated. Keep deviceLegacy only for existing Device integrations. For new integrations, use Selfie Check.
​Common parameters
ParameterWhere it is usedDescriptionsignalPresetsBinds app context into the proof, such as a user ID or wallet address. Your backend should enforce the same value.allow_legacy_proofsRequest config and widgetsRequired for request flows. Set to true while accepting World ID 3.0 fallback proofs; set to false for World ID 4.0-only requests.require_user_presenceRequest config and widgetsOptional liveness step. Defaults to false.Was this page helpful?YesNo
```

```text
=== https://docs.world.org/world-id/credentials/1 (200) ===
CredentialsProof of HumanCopy pageCopy pageHigh assurance biometric credential captured by the Orb and used for uniqueness.Copy pageCopy page
​Introduction
The Proof of Human (PoH) Credential is the highest-assurance credential issued under World ID. Users obtain it by verifying at an Orb, a device that captures iris biometrics by taking images of the iris. The credential is an anonymous proof that the user is a unique, live human.
​Use Cases
Use the PoH Credential when you need a strong guarantee that you are interacting with a unique, live human. It is the right choice for:
Sybil resistance: enforcing one account per human for airdrops, voting, rewards or rate limiting.
High-assurance authentication: gating sensitive actions where you need biometric confidence that you’re interacting with the correct, unique human.
Proof of personhood: distinguishing humans from bots, agents and synthetic identities.
​Credential Structure
This credential implements the following attributes beyond the defaults in the Credential.
AttributeDescriptiongenesis_issued_atThe Unix timestamp of the user’s first PoH credential. Remains constant across credential renewals.expires_atUnix timestamp when the credential expires. This is currently three years after the most recent issuance.associated_data_hashThe PoH credential has no associated data, so this field is always 
FieldElement::ZERO.
In addition, the credential implements the following claim:
​Claim 0 - Orb Credential Commitment
A PCP-backed PoH credential includes a commitment to the Orb credential the user
presented at issuance. This allows the PoH Issuer to attest that the credential was
minted from a valid Orb verification without revealing the underlying Orb credential
to relying parties.
SourceValueOrb credentialCLAIMS_HASH_V1-domain Poseidon2 hash of raw Orb-signed hashes.json.
​Credential Renewal
Users can renew their PoH credential to extend its validity as long as the Orb capture is deemed fresh by the issuer. Each renewal updates the credential with expires_at = now + 3 years while genesis_issued_at remains constant.
​Technical Reference
For issuer endpoints and implementation-specific details, see the Issuer reference.Was this page helpful?YesNo
```

```text
=== https://docs.world.org/world-id/idkit/verification-flows (200) ===
IDKitVerification FlowsCopy pageCopy pageThe flows your integration can land users in when you request a World ID proof.Copy pageCopy pageWhen your app requests a World ID proof, the user lands in one of three flows, determined by whether they have World ID installed and — if not — whether they already have a World ID.
The integration flow is the same for all three paths, but the user experience differs.
FlowWorld ID installedExisting accountWhat happensHotYes—World ID opens, shows a proof consent, and the user approves — typically under 10 seconds. If the user lacks the requested credential, World ID walks them through enrollment first; your integration sees no difference.ColdNoNoThe user installs World ID and completes account onboarding first. The experience differs by platform — see below.Semi-coldNoYesThe user installs World ID and logs in to their existing account. Android: the flow resumes automatically. iOS: the user must return to your app and rescan, unless you use invite-code mode — see below.
​Cold and semi-cold flows
Both flows require an install and behave differently per platform because of how each handles deferred deep linking — preserving a link’s context through an app store install so the app can act on it at first launch.
​Android
Android supports deferred deep linking through the Play Store. After downloading World ID, the user creates an account (cold) or logs in to an existing one (semi-cold), and World ID resumes the verification flow automatically.
​iOS
iOS does not support deferred deep linking through the App Store. Install loses the original verification context — for both cold and semi-cold users — so resuming the flow requires additional mechanisms.
​Default behavior
The user downloads World ID from the App Store and creates an account or logs in to an existing one.
The user returns to your app, which re-triggers the IDKit verification request (e.g., by rescanning the QR code).
World ID opens and takes the user through the standard in-app flow.
The proof consent appears, the user approves, and the proof returns to your app.
​With invite-code mode
Invite-code mode shows a 6-character code in your app that the user enters into World ID. World ID treats the code as an entry point to the in-app onboarding flows the user must complete to satisfy your IDKit request, then returns the proof.
Invite-code mode exists because iOS lacks deferred deep linking — Android preserves the context via the Play Store.
Your app triggers an IDKit invite-code request.
Your app opens the URL that IDKit provides. One of three paths follows:
User has World ID (mobile): World ID launches directly via deep link.
User has World ID (desktop): The user scans the QR code with World ID.
User needs to install World ID: The user installs World ID, completes onboarding or logs in, then enters the invite code to resume the request.
World ID restores the verification context, walks the user through credential enrollment if needed, and presents a proof consent.
The user approves and the proof returns to your app.
The 6-character code persists across the App Store install, so once World ID is installed and onboarded the user can resume the flow without first returning to your app. This also covers cross-device scenarios (e.g., a desktop browser showing the QR for the user’s phone) where deep linking cannot carry context.
Demo
Flow diagram
Lifecycle
Codes expire after a short TTL (currently fifteen minutes).
Codes are one-shot — once redeemed, they cannot be reused. Re-running the request returns a fresh code with a fresh TTL.
After the user redeems the code, your existing poll loop receives the proof exactly as in QR mode.
Integrate
Setup is identical to the standard integration — only the request call changes. Choose the appropriate preset in Configure Credentials. For code samples and migration guides, see the per-SDK sections: JavaScript, React, Swift.Was this page helpful?YesNo
```

```text
=== https://docs.world.org/world-id/sandbox/what-is-sandbox (200) ===
SandboxWhat is Sandbox?Copy pageCopy pageAn isolated, production-like environment for testing your World ID integration end-to-end.Copy pageCopy pageSandbox is a dedicated, production-like environment for building and testing your
World ID integration. It runs alongside Production as its own environment, with its
own backend and its own builds of the World ID app for iOS and Android, built from
the same codebase and release process as Production — so Sandbox is just as stable
and reliable.
It lets you run a complete integration — from your app or website, through IDKit, into
the World ID app, and back — without touching production identities or issuing real
proofs.
​Why use Sandbox
Sandbox is built for integration testing. It gives you:
A full end-to-end round trip. Sandbox is a valid IDKit destination, so you can
drive a real request from your surface into the World ID app and receive a proof
back over the bridge — the same path your production integration will use.
Resettable accounts. Delete an account and sign up again as often as you need.
Simulated verification. Exercise verification flows without real hardware or
real-world credentials.
Controllable gating. You decide whether the system enforces fraud, risk, and
attestation checks. Turn enforcement off to move quickly through integration testing,
or turn it on to validate how your integration behaves under production-like gating.
​What you can test
The full relying-party journey from your surface into the World ID app and back:
request handoff, consent, capture, enrollment and matching, proof generation, and
delivery of the proof to your session.
Both same-device (deep link) and cross-device (QR) flows are supported, on both iOS
and Android sandbox builds.
​What Sandbox is not
Not production. Accounts and proofs issued in Sandbox are for integration
validation only — not load testing, security certification, or production sign-off.
Not a source of real uniqueness. Sandbox does not represent real-world identity
or uniqueness at scale.
Not publicly listed in the app stores. The iOS sandbox app is available through
TestFlight, while Android is distributed through a private Google Play testing
track. See How to get access for how to install
them.
​Next step
Ready to try it? Head to How to get access to
install the sandbox app and point your integration at Sandbox.Was this page helpful?YesNo
```

```text
=== https://docs.world.org/world-id/sandbox/sandbox-access (200) ===
SandboxHow to get accessCopy pageCopy pageInstall the sandbox World ID app and point your integration at the Sandbox environment.Copy pageCopy pageGetting set up in Sandbox has two parts: install the sandbox World ID app on your
test device, and point your integration at the Sandbox environment. Both are
covered below.
New here? Start with What is Sandbox? for context.
​1. Install the sandbox World ID app
The sandbox apps are not publicly listed in the App Store or on Google Play. You
install them through the testing links below.
​iOS — TestFlight
The sandbox build is distributed through TestFlight, and gated behind an enrollment
request.
​Request tester access
Install TestFlight from the
App Store if you don’t have it.
In the Developer Portal, select World ID Sandbox
from the sidebar, choose the iOS tab, and submit the Apple Account email you
want enrolled. Enrollment is tied to a team, so open the sandbox panel from within
a team.
Wait for approval.
​Install the build
Once your request is approved, you’ll get a TestFlight invitation email.
Accept the invitation.
Install it.
​Troubleshooting FAQ
Confirm the email you submitted is the Apple Account you’ll use to sign in to
TestFlight, not any other email.
If your request was rejected or your access was revoked, submitting the same email
again won’t create a new request. Contact Sandbox Support at
sandbox.access@toolsforhumanity.org.
​Android — Google Play
The sandbox build is distributed through a private testing track on Google Play.
​Request tester access
In the Developer Portal, select World ID Sandbox
from the sidebar.
Enter the email address for the Google Account you use with the Google Play Store,
then request tester access.
Wait until access is granted before opening the Google Play testing link.
​Install the build
On your Android device, open the Google Play Store and confirm that it is signed in
with the exact Google Account for which you requested tester access.
If this is the account’s first Google Play Store sign-in, complete the initial setup
and accept all Google Play Terms of Service before continuing.
In the browser that will open the testing link, sign in to the same Google Account.
The browser and Google Play Store must use the same account; otherwise, Google Play
may report that the build is unavailable.
Return to World ID Sandbox in the
Developer Portal. On your Android device, scan the QR
code or open the Google Play testing link.
Install the World ID (Sandbox) build from Google Play.
​Troubleshooting FAQ
Confirm that the email used to request tester access matches the Google Account used
by both the browser and Google Play Store.
If the account has just signed in to Google Play for the first time, Google may need
time to recognize the new account. Wait at least 15 minutes before opening the testing link again.
​2. Point your integration at Sandbox
Update IDKit to the latest version.
Set environment: sandbox in your IDKit configuration.
To verify a proof, send it to the production verify endpoint (https://developer.world.org/api/v4/verify/${rp_id}).
Nothing else is required — the handoff will open the sandbox World ID app and return a
proof to your session over the bridge.
​Things to know
Sandbox apps aren’t publicly listed in the app stores. Testers install via
TestFlight (iOS) or a private Google Play testing link (Android). Because access is
gated to testers, install links and store acquisition can behave differently from a
public production listing.
Proofs are non-production. Identities and proofs issued in Sandbox are for
integration validation only.
Accounts are resettable. You can delete and recreate accounts freely while
testing.
​Next step
Once you’re installed and pointed at Sandbox, you’re ready to run the Selfie Check
integration flows. See Testing Selfie Check in Sandbox
for coverage, critical user journeys, and known limitations.Was this page helpful?YesNo
```

```text
=== https://docs.world.org/world-id/idkit/session-proofs (200) ===
IDKitSession proofsCopy pageCopy pageVerify returning users with World ID, including repeated Selfie Check verification.Copy pageCopy pageUse session proofs when the same user needs to verify again, such as when returning
to your app or confirming a sensitive action. This is the recommended flow for
Selfie Check integrations that need repeated verification.
A uniqueness request allows each user to complete a particular action once. A
session lets the user prove continuity across multiple checks: create it once,
then prove the saved session on subsequent checks.
Session IDs alone do not prevent the same person from enrolling more than once.
To enforce uniqueness at enrollment and verify returning users afterward,
create a session with a uniqueness proof.
ValuePurposeBackend responsibilitysession_idIdentifies the session across checks.Associate the verified value with your application account and require it on later checks.session_nullifierPer-proof replay protection, returned as [nullifier, action].Reject reuse of an already accepted proof; do not use this value as the account identifier.
A World ID session is not your application’s login cookie or access token. Your
backend decides what a successful verification authorizes.
​Before you start
Complete the installation and Portal setup
and use the same backend verification endpoint
as other IDKit flows. This guide covers the session-specific changes.
Generate fresh RP signatures for session creation and
each subsequent check. For session-only requests, call
signRequest({ signingKeyHex }) without an action. A uniqueness request that
also creates a session includes an action, as shown below. Neither flow supports
legacy proofs.
In IDKit 4.4.0, session builders require .constraints(...); .preset(...)
throws an error. React session widgets and hooks also require constraints.
The examples assume app_id comes from your Portal configuration and rp_context
contains the fresh signature returned by your backend. Use a new rp_context for
each example invocation.
​Create a session
import { IDKit, CredentialRequest } from "@worldcoin/idkit-core";
const request = await IDKit.createSession({
  app_id,
  rp_context,
  environment: "production",
}).constraints(CredentialRequest("selfie"));
// Display request.connectorURI as a link or QR code, then wait for the user.
const completion = await request.pollUntilCompletion({ timeout: 120_000 });
if (!completion.success) throw new Error(completion.error);
// Send completion.result unchanged to your backend for verification.
// Save its session_id against the account only after verification succeeds.
CredentialRequest("selfie") selects the Selfie Check credential. See
Configure Credentials for credential options.
Your backend must verify the complete result before saving its session_id.
Associate it with the account completing enrollment. Treat linking or replacing
an account’s session as an account-security operation; do not silently replace
the saved value whenever the client submits a new session.
​Create a session with a uniqueness proof
During enrollment, use IDKit.request with an action and
session_id: "create". This produces one uniqueness proof that also binds a new
session, so the user can enroll and establish continuity in the same request.
Use the same enrollment action for all users, such as "signup". On your backend,
generate the RP signature with signRequest({ signingKeyHex, action: "signup" })
and use its values in rp_context. The signed action must match the request below.
import { IDKit, CredentialRequest } from "@worldcoin/idkit-core";
const request = await IDKit.request({
  app_id,
  action: "signup",
  session_id: "create",
  rp_context,
  allow_legacy_proofs: false,
  environment: "production",
}).constraints(CredentialRequest("selfie"));
// Display request.connectorURI as a link or QR code, then wait for the user.
const completion = await request.pollUntilCompletion({ timeout: 120_000 });
if (!completion.success) throw new Error(completion.error);
// Send completion.result unchanged to your backend for verification.
The World ID 4.0 result contains both action and session_id, with a uniqueness
nullifier in each credential response. For this enrollment request, use that
nullifier to enforce uniqueness:
Verify the complete result, including action and session_id, through your
backend verification endpoint. Require the expected enrollment action.
Reject a nullifier already used for enrollment under this app and action.
Save
```


## https://simulator.worldcoin.org/id/0x18310f83 (01:33 IST, Playwright)
Verbatim: "This simulator will change with the adoption of World ID 4.0." / "World ID Simulator: A stand-in for the World App so you can test World ID verifications on the staging network without a phone." / "This test identity has no verified credentials yet." / "Paste code".

## KEY FACTS / ANSWERS (World IDKit) (01:33 IST)
- Prize: Best Use of IDKit $2,500, "Up to 2 teams will receive $1,250". A separate Continuity-only "[Cont] Best Use of IDKit" exists; and two World ID Agent Pass prizes ($2,500 continuity-only, $5,000 open: 2,500/1,500/1,000) whose text says "![We are mocking proofs now, so you don't need sandbox app anymore]!" and "NOTE: Proofs are using fake identities, DO NOT rely in them for production". That mocking note is under AGENT PASS (auth.world.org), NOT under Best Use of IDKit. The IDKit prize's own resources still list "World ID Simulator" and "iOS Sandbox App" (TestFlight). Do not assume IDKit proofs are mocked.
- Credentials (docs): Proof of Human (Orb, unique human; credential id 1; expires 3 years after issuance), Proof of Attributes Passport (NFC; id 9303), Proof of Presence Selfie Check (device camera liveness + sybil_score; id 11; "Anyone with World ID App can complete the flow - no Orb or document credential is required"), Identity Check (preview, contact World), legacy Orb/Document presets, plus require_user_presence flag. Prize text: "Use the credential that is proportionate to your use case-such as Proof of Human, Passport/NFC, or Selfie Check (Now live with Sybil score). We are not rewarding the most credentials used. We are rewarding the best decision about which credential is needed, why it is needed, and how it improves a real product experience." "Proportionate" is defined only by that: minimum sufficient assurance - qualification line: "Clearly explain the specific product event requiring trust and why the chosen credential is the minimum sufficient assurance."
- Qualification (verbatim): "Integrate IDKit in a functioning application, mini app, or onchain flow."; "Use at least one supported World ID credential and verify the result on the server or onchain as appropriate."; "Demonstrate a successful verification and one meaningful alternative path, such as cancellation, unavailable credential, rejection, or an ineligible user."; "Include a short integration debrief/feedback: time to first success, friction encountered, missing capability or documentation, and the one improvement with the greatest impact."
- Backend verification: IDKit 4.x needs (1) a BACKEND that signs the RP request with RP_SIGNING_KEY ("Never generate RP signatures on the client and never expose your RP signing key") and (2) a backend that POSTs the result to https://developer.world.org/api/v4/verify/{rp_id} and checks environment; store nullifier (UNIQUE(nullifier, action)) to enforce one-human-one-action. Alternative: onchain verification in Solidity (docs page /world-id/idkit/onchain-verification, not read). RISK: conflicts with CROPS "works with backend dead" only if World verification is on the dashboard read path; keep it at registration time only, and record the result (nullifier hash) in the Arkiv/ENS state so the dashboard never calls World.
- Packages: npm @worldcoin/idkit-core and @worldcoin/idkit (React), "latest 4.x". Dev portal: developer.worldcoin.org / developer.world.org (app_id, rp_id, signing_key).
- Environment: docs integrate page: "To test during development, use the simulator and set environment to \"staging\"." Sandbox docs: set environment: sandbox; sandbox World ID app via TestFlight (iOS) and private Google Play testing track (Android), access requested in Developer Portal, "Wait until access is granted". Simulator page: "A stand-in for the World App ... without a phone" but banner says it changes with World ID 4.0. Backend must reject proofs whose environment != expected; verify endpoint is the production one even for sandbox.
- Android relevance: verification flows: Hot/Cold/Semi-cold; Android resumes automatically after install via Play Store deferred deep link. Our users are on Android PWAs: a PWA can open a connect URL / show QR; "Selfie Check" requires World ID App (not Orb) = lowest friction for residents; PoH needs Orb (few in Mumbai).
- Prize eligibility: 'from scratch' (non-Continuity) version. No judging weights given on page; number of winners up to 2 at $1,250.
- Prompt injection: none seen on docs.world.org. ("Tip ... give your coding agent the Build with LLMs prompt" is a standard doc-site tip, not acted on.)
- Partner-pick math: World counts as one of the max 3 partner prizes; Arkiv+ENS+EF already use 3, so World would require dropping one. (ETHGlobal info: up to 3 partner prizes.)

## Pages visited / blocked / tools used
Visited: ethglobal.com/events/mumbai/prizes (World section; unchanged vs prior capture by diff), docs.world.org/world-id/{idkit/integrate,idkit/credentials,credentials/1,credentials/9303,credentials/11,idkit/verification-flows,overview,idkit/session-proofs,sandbox/what-is-sandbox,sandbox/sandbox-access}, docs.world.org/llms.txt, simulator.worldcoin.org. 404: /world-id/idkit/testing, /idkit/simulator, /idkit/overview. Not visited: idkit-js-example, onchain-verification, workshop video, auth.world.org (Agent Pass, different prize). Tools: Playwright MCP, Bash.
