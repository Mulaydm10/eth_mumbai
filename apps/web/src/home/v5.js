// @ts-nocheck
// The team's v5 design (Claude Design export "Tremor Witness v5.dc.html"), run by ./dc.ts. Edits for honesty and
// real wiring are marked "TM:".
import { DCLogic, React } from "./dc";
const MONO = "'Courier Prime', monospace";
const AMB = '#f5f5f3', OK = '#e63946', BAD = '#8a8a8a', MUT = '#bdbdbd', BLUE = '#cfcfcf';
const PHONES = ['adityas-nothing', 'phone-dhruv', 'somnath', 'dhruv2', 'phone-iphn'];
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

const STEPS = [
  { title: 'Sense', sub: 'dsp.ts · PPV + STA/LTA', kicker: 'STAGE 01 · ON THE PHONE', head: 'Every phone becomes a seismometer.',
    body: 'LinearAccelerationSensor streams ~60 Hz. Each axis is band-passed (2 Hz high-pass kills tilt and hand sway, 25 Hz low-pass), integrated to velocity, and an STA/LTA detector fires on sudden energy. Output: PPV in mm/s and dominant frequency.',
    file: 'packages/core/src/dsp.ts',
    code: 'const a = this.lp[i].step(this.hp[i].step(raw[i]));\nconst vInt = this.v[i] + ((a + this.prevA[i]) / 2) * this.dt;\nconst vf = this.vhp[i].step(vInt); // second HP kills drift\n...\nreturn { accBand: Math.sqrt(a2), velMmS: Math.sqrt(v2) * 1000 };' },
  { title: 'Reject the hand', sub: 'tilt 15° · lowFreqRatio', kicker: 'STAGE 02 · ANTI-SPOOF', head: 'A shaken phone is not a building.',
    body: 'Hand sway lives below 3 Hz; structural vibration doesn\u2019t. Readings with a high low-frequency energy share, or tilted past 15°, are labelled "handling" and can never enter the quorum.',
    file: 'packages/core/src/quorum.ts',
    code: '// share of energy below 3 Hz: high for hand sway\nexport function lowFreqRatio(x, fs, cutHz = 3) { ... }\n\nelse if (t.label !== "structural")\n  rejected.push({ trigger: t, reason: "handling" });' },
  { title: 'Sign to Arkiv', sub: 'own key · $creator', kicker: 'STAGE 03 · ARKIV (RABDI 7794095)', head: 'Each phone signs its own reading.',
    body: 'The key is generated in the browser and never leaves the phone. Every trigger is a signed Arkiv transaction, so $creator is immutable — no relayer, no middleman. Raw triggers expire after 30 days; sealed events live 180.',
    file: 'schema tremor-witness.v1.trigger',
    code: '{\n  "site": "ethmumbai-demo",\n  "sensor": "phone-dhruv",\n  "tMs": 1793986241431,\n  "ppvMmS": 241.336,\n  "label": "structural"\n}\n// $creator = 0xB0A8F94e…6739b60096EDE1' },
  { title: 'ENS as-of gate', sub: 'registry.ts · T13', kicker: 'STAGE 04 · ENSv2 (SEPOLIA)', head: 'ENS decides who counts — as of then.',
    body: 'A reading counts only if <phone>.<site>.tremorwitness.eth was registered to its writer both at the claimed time AND when Arkiv recorded it. Revocation stops future readings only; a revoked phone cannot backdate.',
    file: 'packages/core/src/registry.ts',
    code: 'if (r.tMs > r.createdAtMs + future) return "claims-future-time";\nif (!registeredAt(iv, r.sensor, r.creator, r.tMs, join))\n  return "not-registered-at-reading-time";\nif (!registeredAt(iv, r.sensor, r.creator, r.createdAtMs, join))\n  return "not-registered-at-upload-time";\nreturn "ok";' },
  { title: 'Quorum', sub: 'k = 3 within 2000 ms', kicker: 'STAGE 05 · RECOMPUTED BY EVERY VIEWER', head: 'k phones, one window, zero arbiters.',
    body: 'Pure and deterministic: sort valid triggers, slide a window from each anchor, take the first trigger per phone. If at least k distinct phones agree, it\u2019s an event. Every dashboard, judge or court gets the same answer from the same public data.',
    file: 'packages/core/src/quorum.ts',
    code: 'for (let j = i; j < valid.length &&\n     valid[j].tMs - anchor.tMs <= p.windowMs; j++) {\n  const c = valid[j];\n  if (!used.has(c.id) && !bySensor.has(c.sensor))\n    bySensor.set(c.sensor, c);\n}\nif (bySensor.size >= p.k) events.push({ ... });\nelse rejected.push({ trigger: anchor, reason: "no-quorum" });' },
  { title: 'Seal to Swarm', sub: 'keccak on Arkiv', kicker: 'STAGE 06 · SWARM + ARKIV', head: 'Sealed once. Checkable forever.',
    body: 'The confirmed event, its members and an ENS snapshot are packed and uploaded to Swarm. The pack\u2019s keccak hash is written to an Arkiv event entity, so anyone can prove the file was never altered — even after Arkiv\u2019s ~182-day expiry.',
    file: 'logs/…/summary.json → sealed[0]',
    code: '{\n  "eventId": "0x74442665754745ddde7554eafa31b123",\n  "phones": ["adityas-nothing","phone-dhruv","somnath"],\n  "swarmRef": "609a0261…fd783718374d16b83fa2933f5",\n  "packHash": "0x96bafdb1…ccaab47755d81f",\n  "expiresAt": "2027-05-05T17:31:12Z"\n}' },
  { title: 'Kill the backend', sub: 'EF CROPS · offline viewer', kicker: 'STAGE 07 · CENSORSHIP RESISTANCE', head: 'Switch our servers off. The record stands.',
    body: 'Our Vercel functions only drip gas, sign invites and register names — none of them is needed to read or verify. The offline viewer is one HTML file that reads Arkiv, ENS and Swarm directly.',
    file: 'scripts/verify-event.ts',
    code: '$ npx tsx scripts/verify-event.ts ethmumbai-demo 100000\n# re-verifies every sealed event:\n#   Swarm pack hash  <->  Arkiv event entity\n#   member phones exist and resolve in ENS\n# no server of ours in the read path' },
];


// TM: partner tabs (Arkiv, ENS, EF CROPS). Facts match packages/chain + packages/core; the offline ENS certificate is described as our disaster-mode design.
const PARTNER = {
  arkiv: {
    stats: [{ num: '7', label: 'entity types we write (+ evidence packs on Swarm)' }, { num: '0', label: 'relayers: each phone signs its own' }, { num: '141', label: 'readings in the live test' }, { num: '100', label: 'entities per query page' }],
    items: [
      { title: 'Signed at the source', body: 'Each phone generates its own key in the browser. Every trigger is an Arkiv entity written by that key, so $creator is the phone itself. No relayer, no server signing on its behalf.', file: 'packages/chain/src/arkiv.ts · writeTrigger()', code: 'w.createEntity(TriggerSchema, {\n  site, sensor, tMs, ppvUm, fDomCHz,\n  lowFPct, label, seq, wave\n}, { expiration: ExpirationTime.fromDays(30),\n     flags: { readonly: true } })' },
      { title: 'The quorum is a query', body: 'Viewers query triggers by site and time window and recompute the quorum themselves. The dashboard, the offline viewer and the Android app all reach the same answer from the same signed entities.', file: 'packages/chain/src/arkiv.ts · fetchTriggers()', code: '.from(TriggerSchema)\n.where(and(eq("site", site),\n           gt("tMs", since), lt("tMs", until)))\n.orderBy(desc("tMs")).limit(100)\n// → computeQuorum(triggers, { k, windowMs })' },
      { title: 'Seven entity types', body: 'trigger (a reading), sensor (heartbeat), sync (sound-sync clock anchor), event (confirmed + sealed, with the Swarm pack hash), invite (issued / used), dtrigger and checkin (disaster mesh).', file: 'schemas tremor-witness.v1.*', code: 'trigger · sensor · sync · event\ninvite · dtrigger · checkin' },
      { title: 'Expiry is a privacy feature', body: 'Raw readings fade after 30 days and heartbeats after 7. Confirmed events live 180 days and anyone can extend them (permissionless extension), so the proof outlives the noise.', file: 'packages/chain/src/arkiv.ts · writeEvent()', code: '{ expiration: ExpirationTime.fromDays(180),\n  flags: { readonly: true,\n           permissionlessExtension: true } }' },
      { title: 'Sealed on Swarm, anchored on Arkiv', body: 'When the quorum confirms an event, the dashboard packs the members, readings and an ENS snapshot, hashes it with keccak256, uploads the pack to Swarm and writes an Arkiv event entity holding both the Swarm reference and the hash. Anyone can download the pack and check it matches.', file: 'apps/web/src/dashboard.ts · packages/chain/src/swarm.ts', code: 'const packHash = keccak256(toHex(json));\nconst swarmRef = await swarmUploadJson(name, pack);\nawait writeEvent(w, { site, eventId, tMs, k,\n  sensors, swarmRef, packHash });\n// live: swarm 609a0261…2933f5 ↔ packHash on Arkiv ✓' },
    ],
  },
  ens: {
    stats: [{ num: '4', label: 'phones named on ethmumbai-demo' }, { num: '6', label: 'public rule records' }, { num: '2', label: 'as-of checks per reading' }, { num: '1', label: 'invite per phone' }],
    items: [
      { title: 'A building is a name', body: 'Each site is an ENSv2 name on Sepolia, and every invited phone gets its own subname, registered through a one-time committee invite QR. Disaster-mesh phones get mesh- subnames under a separate cap.', file: 'packages/chain/src/ens.ts', code: 'ethmumbai-demo.tremorwitness.eth\n ├ somnath.ethmumbai-demo.tremorwitness.eth\n ├ phone-dhruv.…   ├ adityas-nothing.…\n └ mesh-….ethmumbai-demo.tremorwitness.eth' },
      { title: 'The rules are text records', body: 'How many phones must agree, the time window and the phone caps are public ENS text records. Every change is a public Sepolia transaction, so the committee cannot change the rules quietly.', file: 'packages/chain/src/ens.ts · siteParams()', code: 'tw.k = 3          tw.window_ms = 2000\ntw.max_phones = 5 tw.max_mesh = 5\ntw.dk = 3         tw.dwindow_ms = 2000' },
      { title: 'Who counted, as of then', body: 'A reading counts only if the subname belonged to its writer at the claimed time AND when Arkiv recorded it. Revoking a phone stops its future readings; what it witnessed before still stands, and it cannot backdate.', file: 'packages/core/src/registry.ts · asOfCheck()', code: 'if (!registeredAt(iv, sensor, creator, tMs))\n  return "not-registered-at-reading-time";\nif (!registeredAt(iv, sensor, creator, createdAtMs))\n  return "not-registered-at-upload-time";' },
      { title: 'Disaster-mode ENS design: offline resolution certificates', body: 'Phones verify each other’s membership after connectivity is lost. The Android EnsClient (EnsPermissionClient, EnsV2RegistryClient, UniversalResolverClient) keeps a roster + ENS cache: the cached block, the universal-resolver output for each phone and a committee-signed snapshot. A Roster Certificate Verifier checks the snapshot signature against a freshness policy before the offline mesh accepts a phone. Trust model: committee trust remains (medium).', file: 'Android · Roster Certificate Verifier', code: 'snapshot = { block, resolverOutput[], sig }\naccept(phone) =\n  verify(sig, committee) &&\n  fresh(snapshot.block) &&\n  phone ∈ snapshot.resolverOutput' },
    ],
  },
  crops: {
    stats: [{ num: '0', label: 'servers of ours needed to verify' }, { num: '1', label: 'HTML file: the offline viewer' }, { num: 'MIT', label: 'licence (mesh app GPL-3.0)' }, { num: '0', label: 'analytics · GPS · data streams' }],
    items: [
      { title: 'C · Censorship-resistant', body: 'Evidence is signed at the source and lives on Arkiv and Swarm. Switch our servers off and a single offline HTML file rebuilds and verifies every event from Arkiv, ENS and Swarm directly.', file: 'tremor-witness-viewer.html · scripts/verify-event.ts', code: 'Swarm pack ──keccak256──▶ packHash\n                           ║\nArkiv event entity ──────▶ packHash  ✓ match' },
      { title: 'O · Open source', body: 'The whole monorepo is public: core DSP and quorum, chain clients, web app, website and the Android mesh app. Anyone can rerun the quorum on the same signed data.', file: 'github.com/Mulaydm10/eth_mumbai', code: 'packages/core   packages/chain\napps/web        extensions/disaster-mesh' },
      { title: 'P · Private', body: 'Keys are generated on the phone and never leave it. Only detected events are written, never a continuous stream. No analytics, no GPS, and the mesh is location-free.', file: 'apps/web · in-browser key', code: 'key ⟲ phone   (never uploaded)\nsigned event ─▶ Arkiv\nraw stream   ✕' },
      { title: 'S · Secure', body: 'A quorum of independent registered phones, handling rejection, the ENS as-of rule against backdating, and a keccak hash on Arkiv for every sealed evidence pack.', file: 'packages/core · quorum.ts · registry.ts', code: 'k distinct phones ∧ structural ∧\nregistered(then) ∧ hash(pack) = packHash' },
      { title: 'Disaster-mode ENS design (ENS + CROPS)', body: 'Offline ENS resolution certificates: phones keep a cached block, the resolver output and a committee-signed roster snapshot, and verify membership offline with a snapshot signature + freshness policy, so the mesh keeps checking who belongs with no internet and no server. Trust model: committee trust remains (medium), stated openly.', file: 'Android · roster certificate', code: 'offline? → verify(snapshot.sig) ∧ fresh ✓' },
    ],
  },
};

// TM: visual flows for the "how we implemented it" cards (step chips + one plain line; code folds away)
const FLOWS = {
  arkiv: [
    ['phone key (made in browser)', 'sign the reading', 'Arkiv entity', '$creator = the phone'],
    ['query: site + time window', 'signed readings', 'computeQuorum()', 'k = 3 ✓ event'],
    ['trigger', 'sensor', 'sync', 'event', 'invite', 'dtrigger', 'checkin'],
    ['reading · 30 days', 'heartbeat · 7 days', 'sealed event · 180 days', 'anyone can extend'],
    ['quorum confirms event', 'pack: members + readings + ENS snapshot', 'keccak256 → packHash', 'upload pack → Swarm', 'Arkiv event: swarmRef + packHash', 'anyone re-checks ✓'],
  ],
  ens: [
    ['tremorwitness.eth', 'ethmumbai-demo', 'somnath · phone-dhruv · …', 'mesh-… (Android)'],
    ['committee changes a rule', 'public Sepolia tx', 'tw.k = 3 · tw.window_ms = 2000', 'every phone reads the same rules'],
    ['reading at time T', 'name owned at T?', 'owned when Arkiv recorded it?', 'counts ✓ / refused ✕'],
    ['online: cache block + resolver output', 'committee signs roster snapshot', 'internet ✕', 'verify signature + freshness', 'phone accepted ✓'],
  ],
  crops: [
    ['our server OFF', 'offline viewer (1 HTML file)', 'reads Arkiv · ENS · Swarm', 'hash matches ✓'],
    ['public repo', 'same signed data', 'anyone reruns the quorum', 'same answer'],
    ['key made on the phone', 'never uploaded', 'only events written', 'no GPS · no analytics'],
    ['k registered phones', 'not handled (tilt / < 3 Hz)', 'registered as of then', 'pack hash on Arkiv ✓'],
    ['cached block', 'resolver output', 'committee-signed snapshot', 'verify offline ✓'],
  ],
};
const SHORT = {
  arkiv: ['Each phone signs its own readings. No relayer, no server in between.', 'Every viewer runs the same query and gets the same answer.', 'Readings, heartbeats, clock anchors, sealed events, invites and the disaster mesh all live on Arkiv.', 'The noise fades on its own; the proof stays, and anyone can keep it alive.', 'The full evidence lives on Swarm; its fingerprint lives on Arkiv, so any edit to the pack shows.'],
  ens: ['One name per building, one subname per invited phone.', 'The rules are public. Changing them is a public transaction.', 'Revoking a phone stops its future readings and never rewrites the past.', 'Offline, phones still check who belongs, using a committee-signed roster snapshot. Committee trust remains (medium).'],
  crops: ['Our servers are optional: the record verifies without us.', 'Anyone can check our work on the same public data.', 'Your key and your location never leave your phone.', 'Four independent checks before anything counts.', 'Membership checks keep working with no internet. Committee trust remains (medium).'],
};
for (const k of Object.keys(PARTNER)) PARTNER[k].items.forEach((it, i) => { it.n = String(i + 1).padStart(2, '0'); it.flow = FLOWS[k][i] || []; it.short = SHORT[k][i] || ''; });

export class Component extends DCLogic {
  state = { tab: 'landing', dash: 'monitor', step: 0, auto: true, sensorOn: false, health: -1, stomps: 0, flash: false, probIdx: 0, lang: 'EN', senTick: 0, verify: -1, feed: [
    { id: 1, time: '23:00:49', tag: 'SEALED', color: OK, who: 'swarm', text: '609a0261…2933f5 · hash on Arkiv' },
    { id: 2, time: '23:00:41', tag: 'EVENT', color: OK, who: 'k = 3', text: 'adityas-nothing · phone-dhruv · somnath' },
    { id: 3, time: '23:00:41', tag: 'TRIGGER', color: AMB, who: 'phone-dhruv', text: 'structural · 241.3 mm/s' },
    { id: 4, time: '22:58:39', tag: 'SYNC', color: MUT, who: 'chirp #4', text: 'phone-dhruv −13 755 ms' },
    { id: 5, time: '22:57:36', tag: 'ENS', color: BLUE, who: 'somnath', text: 'registered · invite used' },
    { id: 6, time: '22:57:12', tag: 'INVITE', color: BLUE, who: 'committee', text: 'issued · admits 4 phones' },
    { id: 7, time: '22:55:41', tag: 'ENS', color: BLUE, who: 'adityas-nothing', text: 'registered · invite used' } ] };
  heroRef = React.createRef(); heroTextRef = React.createRef(); tickerRef = React.createRef();
  seisRef = React.createRef(); meshRef = React.createRef(); ledgerRef = React.createRef(); blowRef = React.createRef(); quoteRef = React.createRef();
  evRef = React.createRef(); heatRef = React.createRef(); fxRef = React.createRef(); weaveRef = React.createRef();
  arkRef = React.createRef(); ensRef = React.createRef(); cropsRef = React.createRef(); // TM: partner tabs
  probRef = React.createRef(); solRef = React.createRef(); tlRef = React.createRef(); senRef = React.createRef();

  componentDidMount() {
    this.stepStart = performance.now(); this.probStart = performance.now();
    this.mouse = { x: 0, y: 0 }; this.lastQuake = -10;
    const now = performance.now();
    this.tl = [];
    for (let i = 0; i < 46; i++) { const lane = Math.floor(hash(i) * 5); this.tl.push({ lane, t: now - hash(i + 99) * 90000, kind: lane === 4 ? 'unreg' : (hash(i + 7) < 0.45 ? 'rej' : 'wait'), ppv: 30 + hash(i + 3) * 120 }); }
    this.addEvent(now - 34000);
    this.nextSpawn = now + 800;
    this.cracks = [];
    for (let i = 0; i < 9; i++) { let u = 0.1 + hash(i * 3) * 0.8, v = 0.15 + hash(i * 5) * 0.6; const pts = [[u, v]]; let a = hash(i * 7) * Math.PI * 2; for (let j = 0; j < 9; j++) { a += (hash(i * 11 + j) - 0.5) * 1.4; u += Math.cos(a) * 0.05; v += Math.sin(a) * 0.04 + 0.012; pts.push([u, v]); } this.cracks.push({ pts, start: i * 0.9 }); }
    this.onMove = (e) => { this.mouse.x = (e.clientX / innerWidth) * 2 - 1; this.mouse.y = (e.clientY / innerHeight) * 2 - 1; };
    addEventListener('pointermove', this.onMove);
    const loop = (n) => { try { this.frame(n); } catch (e) { if (!this.errLogged) { console.error(e); this.errLogged = true; } } this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.iv = setInterval(() => {
      const s = this.state, n = performance.now();
      // TM: no random activity entries; the feed shows the recorded 6 Nov session only.
      if (s.tab === 'solution' && s.auto && n - this.stepStart > 7500) this.setStep((s.step + 1) % STEPS.length);
      if (s.tab === 'problem' && n - (this.lastProb || 0) > 1300) { this.lastProb = n; this.setState({ probIdx: (s.probIdx + 1) % 4 }); }
      if (s.sensorOn) this.setState({ senTick: s.senTick + 1 });
    }, 500);
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); clearInterval(this.iv); removeEventListener('pointermove', this.onMove); if (this.three) this.three.r.dispose(); }

  setStep(i) { this.stepStart = performance.now(); this.setState({ step: i }); }
  setTab(tab) { if (tab === 'problem') this.probStart = performance.now(); if (tab === 'solution') this.stepStart = performance.now(); this.setState({ tab }); window.scrollTo(0, 0); }
  addEvent(t) { [0, 1, 2].forEach((l, i) => this.tl.push({ lane: l, t: t + i * 420 + hash(t + i) * 200, kind: 'ok', ppv: 118 + i * 60 })); this.tl.push({ lane: 3, t: t + 3400, kind: 'wait', ppv: 40 }); (this.bands = this.bands || []).push({ t: t + 400 }); }

  fit(c) {
    const d = Math.min(2, devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * d) || c.height !== Math.round(h * d)) { c.width = Math.round(w * d); c.height = Math.round(h * d); }
    const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, w, h); return [x, w, h];
  }

  frame(n) {
    const t = n / 1000;
    const hc = this.heroRef.current;
    if (hc) { if (hc !== this._threeCanvas) this.initThree(hc); else if (this.three) this.updateThree(t); }
    if (this.tickerRef.current) { const el = this.tickerRef.current; this.tick = (this.tick || 0) + 0.55; const half = el.scrollWidth / 2 || 1; el.style.transform = 'translateX(' + (-(this.tick % half)) + 'px)'; }
    if (this.probRef.current) this.drawProblem(this.probRef.current, (n - this.probStart) / 1000);
    if (this.solRef.current) this.drawSolution(this.solRef.current, (n - this.stepStart) / 1000);
    if (this.tlRef.current) this.drawTimeline(this.tlRef.current, n);
    if (this.senRef.current) this.drawSensor(this.senRef.current, t);
    if (this.seisRef.current) this.drawSeis(this.seisRef.current);
    if (this.meshRef.current) this.drawMesh(this.meshRef.current, t);
    if (this.ledgerRef.current) this.drawLedger(this.ledgerRef.current, (n - this.probStart) / 1000);
    if (this.blowRef.current) this.blowRef.current.textContent = Math.floor((n - this.probStart) / 950);
    if (this.evRef.current) this.drawReplay(this.evRef.current, t);
    if (this.heatRef.current) this.drawHeat(this.heatRef.current, t);
    if (this.fxRef.current) this.drawFx(this.fxRef.current, t);
    if (this.arkRef.current) this.drawArkiv(this.arkRef.current, t);
    if (this.ensRef.current) this.drawEns(this.ensRef.current, t);
    if (this.cropsRef.current) this.drawCrops(this.cropsRef.current, t);
    this.scrollFx(n);
  }

  // ---------- TM: partner tab animations ----------
  drawArkiv(c, t) {
    const [x, w, h] = this.fit(c), cx = w / 2, cy = h / 2, f = Math.min(w, h);
    x.save(); x.translate(cx, cy); x.rotate(Math.sin(t * 0.18) * 0.06); x.translate(-cx, -cy);
    x.strokeStyle = 'rgba(245,245,243,0.05)'; x.lineWidth = 1;
    for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2 + t * 0.03; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w); x.stroke(); }
    for (let r = 0; r < 12; r++) { const z = ((r * 0.38 - t * 0.5) % 4.5 + 4.5) % 4.5 + 0.15, s = f * 0.42 / z; x.strokeStyle = `rgba(245,245,243,${0.16 * Math.min(1, (4.6 - z) / 2)})`; x.strokeRect(cx - s * 1.7, cy - s, s * 3.4, s * 2); }
    const names = ['phone-dhruv', 'somnath', 'adityas-nothing', 'dhruv2'], qz = 1.35, hits = [];
    const cards = [];
    for (let i = 0; i < 40; i++) { const z = ((hash(i) * 4.5 - t * 0.5) % 4.5 + 4.5) % 4.5 + 0.15; cards.push({ i, z }); }
    cards.sort((a, b) => b.z - a.z);
    // query window plane
    const qs = f * 0.42 / qz; x.fillStyle = 'rgba(230,57,70,0.06)'; x.fillRect(cx - qs * 1.7, cy - qs, qs * 3.4, qs * 2);
    x.strokeStyle = 'rgba(230,57,70,0.85)'; x.lineWidth = 2; x.strokeRect(cx - qs * 1.7, cy - qs, qs * 3.4, qs * 2);
    x.font = '600 12px ' + MONO; x.fillStyle = '#e63946'; x.fillText('QUERY · site = "ethmumbai-demo" · tMs in window', cx - qs * 1.7 + 8, cy - qs - 8);
    for (const { i, z } of cards) {
      const a = hash(i + 7) * Math.PI * 2 + t * 0.12, rad = 0.35 + hash(i + 3) * 0.55, s = f * 0.42 / z;
      const px = cx + Math.cos(a) * rad * s * 1.6, py = cy + Math.sin(a) * rad * s * 0.95, sc = Math.min(2.2, 0.55 / z * 1.6);
      const expiring = hash(i + 11) > 0.78, struct = hash(i + 5) > 0.35;
      let al = Math.min(1, (4.6 - z) / 1.5) * Math.min(1, (z - 0.15) / 0.35);
      if (expiring && z < 1.0) { const k = (1.0 - z) / 0.85; al *= 1 - k; for (let p = 0; p < 10; p++) { const pa = hash(i * 31 + p) * 6.28, pr = k * 60 * sc; x.fillStyle = `rgba(245,245,243,${0.5 * (1 - k)})`; x.fillRect(px + Math.cos(pa) * pr, py + Math.sin(pa) * pr, 2, 2); } }
      if (al <= 0.02) continue;
      const inQ = Math.abs(z - qz) < 0.16 && struct;
      if (inQ) hits.push({ px, py });
      const cw = 150 * sc, ch = 52 * sc;
      x.globalAlpha = al; x.fillStyle = inQ ? 'rgba(230,57,70,0.22)' : 'rgba(11,11,11,0.92)'; x.fillRect(px - cw / 2, py - ch / 2, cw, ch);
      x.strokeStyle = inQ ? '#e63946' : 'rgba(245,245,243,0.35)'; x.lineWidth = 1; x.strokeRect(px - cw / 2, py - ch / 2, cw, ch);
      x.font = `600 ${Math.max(6, 10 * sc)}px ${MONO}`; x.fillStyle = inQ ? '#e63946' : '#f5f5f3';
      x.fillText(`tremor-witness.v1.trigger`, px - cw / 2 + 6 * sc, py - ch / 2 + 14 * sc);
      x.fillStyle = '#bdbdbd'; x.fillText(`${names[i % 4]} · ${(20 + hash(i + 9) * 220).toFixed(1)} mm/s`, px - cw / 2 + 6 * sc, py - ch / 2 + 28 * sc);
      x.fillStyle = '#8a8a8a'; x.fillText(`$creator 0x${Math.floor(hash(i + 2) * 0xffffff).toString(16).padStart(6, '0')}…  ${expiring ? 'expires 30d' : struct ? 'structural' : 'handling'}`, px - cw / 2 + 6 * sc, py - ch / 2 + 42 * sc);
      x.globalAlpha = 1;
    }
    const qx = w - 120, qy = 70;
    if (hits.length >= 3) {
      hits.slice(0, 5).forEach((p) => { x.strokeStyle = 'rgba(230,57,70,0.7)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(p.px, p.py); x.lineTo(qx, qy); x.stroke(); });
      x.fillStyle = '#e63946'; x.shadowColor = '#e63946'; x.shadowBlur = 30; x.beginPath(); x.arc(qx, qy, 26, 0, 7); x.fill(); x.shadowBlur = 0;
      x.fillStyle = '#050505'; x.font = '700 15px ' + MONO; x.textAlign = 'center'; x.fillText('k=3 ✓', qx, qy + 5); x.textAlign = 'left';
    } else { x.strokeStyle = '#4a4a4a'; x.beginPath(); x.arc(qx, qy, 26, 0, 7); x.stroke(); x.fillStyle = '#8a8a8a'; x.font = '600 13px ' + MONO; x.textAlign = 'center'; x.fillText(`${hits.length}/3`, qx, qy + 5); x.textAlign = 'left'; }
    x.fillStyle = '#bdbdbd'; x.font = '600 12px ' + MONO; x.textAlign = 'center'; x.fillText('computeQuorum() · in your browser', qx, qy + 48); x.textAlign = 'left';
    x.restore();
  }

  drawEns(c, t) {
    const [x, w, h] = this.fit(c), cx = w / 2, cy = h * 0.47, R0 = Math.min(w * 0.42, h * 0.62), L = t % 14;
    const P3 = (ang, r, tilt, spin) => { const X = Math.cos(ang) * r, Y0 = Math.sin(ang) * r; const Y = Y0 * Math.cos(tilt), Z = Y0 * Math.sin(tilt); const cs = Math.cos(spin), sn = Math.sin(spin); const X2 = X * cs - Z * sn, Z2 = X * sn + Z * cs; const s = 1 / (1 + Z2 / (R0 * 3)); return { x: cx + X2 * s, y: cy + Y * s, s, z: Z2 }; };
    const spin = t * 0.25, items = [];
    const rings = [{ r: R0 * 0.5, tilt: 0.95, sp: 0.35 }, { r: R0 * 0.78, tilt: 1.12, sp: -0.22 }, { r: R0 * 1.0, tilt: 0.88, sp: 0.14 }];
    rings.forEach((rg, k) => { x.strokeStyle = 'rgba(245,245,243,0.12)'; x.lineWidth = 1; x.beginPath(); for (let a = 0; a <= 64; a++) { const p = P3(a / 64 * 6.283, rg.r, rg.tilt, spin + k * 0.7); a ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y); } x.stroke(); });
    const phones = ['somnath', 'phone-dhruv', 'adityas-nothing', 'dhruv2'];
    const revoked = L > 5.5 && L < 9.5, offline = L > 9.5;
    phones.forEach((n, i) => items.push({ kind: 'phone', n, ...P3(i / 4 * 6.283 + t * rings[0].sp, rings[0].r, rings[0].tilt, spin), dead: revoked && n === 'dhruv2' }));
    ['mesh-7f3a', 'mesh-c19e'].forEach((n, i) => items.push({ kind: 'mesh', n, ...P3(i * 3.14 + 1 + t * rings[1].sp, rings[1].r, rings[1].tilt, spin + 0.7) }));
    ['tw.k = 3', 'tw.window_ms = 2000', 'tw.max_phones = 5', 'tw.max_mesh = 5', 'tw.dk = 3', 'tw.dwindow_ms = 2000'].forEach((n, i) => items.push({ kind: 'rec', n, ...P3(i / 6 * 6.283 + t * rings[2].sp, rings[2].r, rings[2].tilt, spin + 1.4) }));
    items.sort((a, b) => b.z - a.z);
    // links from center
    items.forEach((it) => { if (it.kind === 'rec') return; x.strokeStyle = it.dead ? 'rgba(138,138,138,0.25)' : 'rgba(245,245,243,0.18)'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(it.x, it.y); x.stroke(); });
    // center site name
    x.fillStyle = '#0b0b0b'; x.strokeStyle = offline ? '#e63946' : '#f5f5f3'; x.lineWidth = 2; x.shadowColor = offline ? '#e63946' : '#f5f5f3'; x.shadowBlur = 24; x.beginPath(); x.arc(cx, cy, 58, 0, 7); x.fill(); x.stroke(); x.shadowBlur = 0;
    x.textAlign = 'center'; x.fillStyle = '#f5f5f3'; x.font = '700 15px ' + MONO; x.fillText('ethmumbai-demo', cx, cy - 2); x.fillStyle = '#8a8a8a'; x.font = '600 12px ' + MONO; x.fillText('.tremorwitness.eth', cx, cy + 16);
    items.forEach((it) => {
      const fs = Math.max(11, 15 * it.s), al = 0.45 + 0.55 * it.s;
      x.globalAlpha = Math.min(1, al);
      if (it.kind === 'rec') { const tw = x.measureText(it.n).width; x.font = `600 ${fs}px ${MONO}`; const ww = x.measureText(it.n).width + 14; x.fillStyle = 'rgba(11,11,11,0.92)'; x.fillRect(it.x - ww / 2, it.y - 12, ww, 22); x.strokeStyle = 'rgba(245,245,243,0.4)'; x.strokeRect(it.x - ww / 2, it.y - 12, ww, 22); x.fillStyle = '#bdbdbd'; x.fillText(it.n, it.x, it.y + 4); }
      else if (it.dead) { for (let p = 0; p < 14; p++) { const a = hash(p) * 6.28, d = (L - 5.5) * 40 * (0.4 + hash(p + 3)); x.fillStyle = '#8a8a8a'; x.fillRect(it.x + Math.cos(a) * d, it.y + Math.sin(a) * d, 3, 3); } x.fillStyle = '#8a8a8a'; x.font = `600 ${fs}px ${MONO}`; x.fillText(it.n + ' · revoked', it.x, it.y - 22); x.fillStyle = '#e63946'; x.fillText('its past event 23:00:41 still stands ✓', it.x, it.y + 32); }
      else { const col = it.kind === 'mesh' ? '#bdbdbd' : '#f5f5f3'; x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 14; x.beginPath(); x.arc(it.x, it.y, 9 * it.s + 4, 0, 7); x.fill(); x.shadowBlur = 0; x.font = `600 ${fs}px ${MONO}`; x.fillText(it.n + (it.kind === 'mesh' ? '' : '.…'), it.x, it.y - 14); if (offline) { x.strokeStyle = '#e63946'; x.lineWidth = 1.5; x.beginPath(); x.arc(it.x, it.y, 12 * it.s + 6, 0, 7); x.stroke(); x.fillStyle = '#e63946'; x.fillText('✓ cert', it.x, it.y + 22); } }
      x.globalAlpha = 1;
    });
    if (offline) {
      const k = Math.min(1, (L - 9.5) / 0.6), rr = 78 + (1 - k) * 120;
      x.save(); x.translate(cx, cy); x.rotate(t * 0.6); x.strokeStyle = `rgba(230,57,70,${k})`; x.lineWidth = 3; x.setLineDash([10, 7]); x.beginPath(); x.arc(0, 0, rr, 0, 7); x.stroke(); x.setLineDash([]);
      x.fillStyle = `rgba(230,57,70,${k})`; x.font = '700 11px ' + MONO; const txt = ' COMMITTEE-SIGNED SNAPSHOT · CACHED BLOCK · RESOLVER OUTPUT ·';
      for (let i = 0; i < txt.length; i++) { const a = i / txt.length * 6.283; x.save(); x.rotate(a); x.fillText(txt[i], 0, -rr - 6); x.restore(); }
      x.restore();
      x.fillStyle = '#e63946'; x.font = '700 13px ' + MONO; x.fillText('INTERNET ✕ · roster verified offline: signature + freshness ✓', cx, h - 22);
    } else if (revoked) { x.fillStyle = '#bdbdbd'; x.font = '700 13px ' + MONO; x.fillText('REVOKE: new readings refused · counted as of then (registered at claimed time AND at Arkiv record)', cx, h - 22); }
    else { x.fillStyle = '#bdbdbd'; x.font = '700 13px ' + MONO; x.fillText('ENSv2 on Sepolia · one subname per invited phone · rules in public text records', cx, h - 22); }
    x.textAlign = 'left';
  }

  drawCrops(c, t) {
    const [x, w, h] = this.fit(c), cx = w / 2, cy = h * 0.44, S = Math.min(w, h) * 0.13;
    const V = []; for (let i = 0; i < 16; i++) V.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
    const rot = (p, i, j, a) => { const q = p.slice(), c1 = Math.cos(a), s1 = Math.sin(a); q[i] = p[i] * c1 - p[j] * s1; q[j] = p[i] * s1 + p[j] * c1; return q; };
    const P = V.map((p) => { let q = rot(p, 0, 3, t * 0.45); q = rot(q, 1, 2, t * 0.31); q = rot(q, 2, 3, t * 0.23); q = rot(q, 0, 1, t * 0.11); const ww = 2.6 / (2.6 - q[3]); const X = q[0] * ww, Y = q[1] * ww, Z = q[2] * ww; const zz = 4 / (4 - Z); return { x: cx + X * S * zz, y: cy + Y * S * zz, d: Z + q[3] }; });
    const E = []; for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (j > i) E.push([i, j, b]); }
    E.sort((a, b2) => (P[a[0]].d + P[a[1]].d) - (P[b2[0]].d + P[b2[1]].d));
    const phase = Math.floor(t / 3.2) % 4;
    E.forEach(([i, j, b]) => { const hot = b === phase; x.strokeStyle = hot ? 'rgba(230,57,70,0.95)' : `rgba(245,245,243,${0.18 + 0.12 * ((P[i].d + P[j].d) / 4 + 0.5)})`; x.lineWidth = hot ? 2.6 : 1.2; if (hot) { x.shadowColor = '#e63946'; x.shadowBlur = 16; } x.beginPath(); x.moveTo(P[i].x, P[i].y); x.lineTo(P[j].x, P[j].y); x.stroke(); x.shadowBlur = 0; });
    P.forEach((p) => { x.fillStyle = '#f5f5f3'; x.beginPath(); x.arc(p.x, p.y, 2.6, 0, 7); x.fill(); });
    const L = [['C', 'CENSORSHIP-RESISTANT', 'switch our servers off → still verifiable'], ['O', 'OPEN SOURCE', 'anyone reruns the quorum on the same data'], ['P', 'PRIVATE', 'keys never leave the phone · no GPS · no stream'], ['S', 'SECURE', 'quorum · as-of rule · keccak hash on Arkiv']][phase];
    const ph = (t % 3.2) / 3.2, a = Math.min(1, ph * 6) * Math.min(1, (1 - ph) * 6);
    x.textAlign = 'center'; x.globalAlpha = a; x.fillStyle = '#e63946'; x.font = `700 ${Math.round(S * 0.9)}px 'Courier Prime', monospace`; x.fillText(L[0], cx, cy + S * 0.32);
    x.fillStyle = '#f5f5f3'; x.font = '700 20px ' + MONO; x.fillText(L[1], cx, h - 62); x.fillStyle = '#bdbdbd'; x.font = '600 14px ' + MONO; x.fillText(L[2], cx, h - 36); x.globalAlpha = 1;
    // server going dark, data still flowing (left) · key orbiting inside the phone (right)
    const on = Math.sin(t * 0.9) > 0, sx = 70, sy = 70;
    x.strokeStyle = on ? '#f5f5f3' : '#3a3a3a'; x.lineWidth = 2; x.strokeRect(sx - 34, sy - 22, 68, 44); x.fillStyle = on ? '#bdbdbd' : '#3a3a3a'; x.font = '600 11px ' + MONO; x.fillText(on ? 'our server' : 'server OFF', sx, sy + 4);
    ['ARKIV', 'ENS', 'SWARM'].forEach((n, i) => { const yy = sy + 60 + i * 26; x.fillStyle = '#8a8a8a'; x.fillText(n, sx - 6, yy); const u = (t * 0.8 + i * 0.3) % 1; x.fillStyle = '#e63946'; x.beginPath(); x.arc(sx + 28 + u * 80, yy - 4, 3, 0, 7); x.fill(); });
    x.fillStyle = '#e63946'; x.fillText('✓ verified', sx + 70, sy + 140);
    const px = w - 80, py = 90; x.strokeStyle = '#f5f5f3'; x.strokeRect(px - 22, py - 40, 44, 80); const ka = t * 2; x.fillStyle = '#e63946'; x.beginPath(); x.arc(px + Math.cos(ka) * 12, py + Math.sin(ka) * 22, 4, 0, 7); x.fill(); x.fillStyle = '#bdbdbd'; x.fillText('key stays', px, py + 58); x.fillText('on phone', px, py + 72);
    x.textAlign = 'left';
  }

  drawFx(c, t) {
    if (this.reduce == null) this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [x, w, h] = this.fit(c);
    if (this.reduce) return;
    const F = this.fx || (this.fx = { ash: Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), s: 0.4 + Math.random() * 1.8, v: 0.008 + Math.random() * 0.02, p: Math.random() * 6 })), scr: [], nextTear: t + 5, tear: -1, lt: t });
    const dt = Math.min(0.05, t - F.lt); F.lt = t;
    x.fillStyle = 'rgba(0,0,0,' + (Math.random() * 0.06) + ')'; x.fillRect(0, 0, w, h);
    F.ash.forEach((a) => { a.y += a.v * dt * 3; a.x += Math.sin(t * 0.6 + a.p) * 0.0004; if (a.y > 1.02) { a.y = -0.02; a.x = Math.random(); } x.fillStyle = 'rgba(190,190,188,' + (0.12 + a.s * 0.08) + ')'; x.fillRect(a.x * w, a.y * h, a.s, a.s * 1.4); });
    if (Math.random() < 0.025 && F.scr.length < 3) F.scr.push({ x: Math.random() * w, life: 0.2 + Math.random() * 0.9, a: 0.08 + Math.random() * 0.22 });
    F.scr = F.scr.filter((sc) => { sc.life -= dt; sc.x += (Math.random() - 0.5) * 3; x.fillStyle = 'rgba(245,245,243,' + sc.a * (0.6 + Math.random() * 0.4) + ')'; x.fillRect(sc.x, 0, 1, h); return sc.life > 0; });
    for (let i = 0; i < 3; i++) if (Math.random() < 0.35) { x.fillStyle = Math.random() < 0.6 ? 'rgba(0,0,0,0.7)' : 'rgba(245,245,243,0.5)'; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 0.5 + Math.random() * 2.2, 0, 6.283); x.fill(); }
    if (Math.random() < 0.004) { x.strokeStyle = 'rgba(0,0,0,0.55)'; x.lineWidth = 1; x.beginPath(); let px = Math.random() * w, py = Math.random() * h; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (Math.random() - 0.5) * 24; py += Math.random() * 18; x.lineTo(px, py); } x.stroke(); }
    if (t > F.nextTear) { F.tear = t; F.nextTear = t + 6 + Math.random() * 6; }
    const wv = this.weaveRef.current, ta = t - F.tear;
    if (ta >= 0 && ta < 0.22) {
      for (let k = 0; k < 4; k++) { const y = Math.random() * h, bh = 2 + Math.random() * 26; x.fillStyle = k % 2 ? 'rgba(230,57,70,0.16)' : 'rgba(245,245,243,0.07)'; x.fillRect(0, y, w, bh); }
      x.fillStyle = 'rgba(230,57,70,0.05)'; x.fillRect(0, 0, w, h);
      if (wv) wv.style.transform = 'translate(' + ((Math.random() - 0.5) * 6).toFixed(1) + 'px,' + ((Math.random() - 0.5) * 3).toFixed(1) + 'px)';
    } else if (wv && wv.style.transform) wv.style.transform = '';
  }

  istNow() { return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' }); }
  pushFeed() {
    const P = [['TRIGGER', AMB, 'phone-dhruv', 'structural · 52 Hz · 64.1 mm/s'], ['TRIGGER', AMB, 'somnath', 'structural · 49 Hz · 38.7 mm/s'], ['REFUSED', BAD, 'phone-iphn', 'not-registered at upload time'], ['REFUSED', BAD, 'adityas-nothing', 'handling · tilt 22°'], ['REFUSED', BAD, 'somnath', 'no-quorum · alone in window'], ['ENS', BLUE, 'tw.k', 'resolved = 3 on ethmumbai-demo'], ['SYNC', MUT, 'dhruv2', 'chirp heard · offset 0 ms'], ['ARKIV', AMB, 'block', '#' + (4812300 + Math.floor(Math.random() * 900)) + ' · 3 entities indexed']];
    const it = P[Math.floor(Math.random() * P.length)];
    this.setState((s) => ({ feed: [{ id: Math.random(), time: this.istNow(), tag: it[0], color: it[1], who: it[2], text: it[3], born: performance.now() }].concat(s.feed).slice(0, 8) }));
  }
  runVerify() {
    if (this.vRun) return; this.vRun = true; this.setState({ verify: 0 });
    const step = () => this.setState((s) => ({ verify: s.verify + 1 }), () => { if (this.state.verify < 4) setTimeout(step, 600 + Math.random() * 500); else this.vRun = false; });
    setTimeout(step, 700);
  }

  drawReplay(c, t) {
    const [x, w, h] = this.fit(c), lt = t % 9, L = 120, R = w - 16, top = 34, lh = (h - top - 34) / 3, X = (s) => L + (s / 4) * (R - L);
    const names = ['adityas-nothing', 'phone-dhruv', 'somnath'], init = [0.25, -1.35, 0.6], res = [0, 0.32, 0.55], ppv = [118.1, 241.3, 173.4], amps = [0.5, 1, 0.72], cols = [AMB, OK, BLUE];
    const e = Math.max(0, Math.min(1, (lt - 0.4) / 1.4)), ee = 1 - Math.pow(1 - e, 3), head = lt < 2 ? -1 : Math.min(4, (lt - 2) / 4.5 * 4);
    x.font = '400 13px ' + MONO; x.textBaseline = 'middle';
    x.fillStyle = lt < 2 ? AMB : MUT; x.fillText(lt < 2 ? 'APPLYING SOUND-SYNC CORRECTIONS…' : 'REPLAY · 23:00:41 IST · aligned clocks', 12, 14);
    const peaks = [];
    names.forEach((nm, i) => {
      const off = init[i] * (1 - ee) + res[i] * ee, y = top + i * lh + lh / 2, burst = 1.2 + off;
      x.fillStyle = '#d6d6d6'; x.fillText(nm, 12, y); x.strokeStyle = '#2c2c2c'; x.beginPath(); x.moveTo(L, y); x.lineTo(R, y); x.stroke();
      if (lt < 2 && i === 1) { x.fillStyle = AMB; x.fillText((init[i] * (1 - ee) * 10170).toFixed(0) + ' ms', 12, y + 16); }
      for (let pass = 0; pass < 2; pass++) {
        x.beginPath(); x.strokeStyle = cols[i]; x.lineWidth = 1.5; x.globalAlpha = pass ? 1 : 0.25;
        let started = false;
        for (let px = L; px <= R; px += 1.5) {
          const s = ((px - L) / (R - L)) * 4; if (pass && s > head) break;
          const d = s - burst, v = d > 0 ? Math.exp(-d * 3.2) * Math.sin(d * 2 * Math.PI * 9) * amps[i] : 0, n2 = (hash(Math.floor(px) + i * 1000) - 0.5) * 0.06;
          const yy = y - (v + n2) * lh * 0.42; started ? x.lineTo(px, yy) : (x.moveTo(px, yy), (started = true));
        }
        x.stroke(); x.globalAlpha = 1;
      }
      peaks.push(burst + 0.03);
      if (head >= burst + 0.03) { const px = X(burst + 0.03), py = y - amps[i] * lh * 0.38; x.fillStyle = cols[i]; x.beginPath(); x.arc(px, py, 4, 0, 6.283); x.fill(); x.font = '700 13px ' + MONO; x.fillText(ppv[i] + ' mm/s', px + 8, py - 2); x.font = '400 13px ' + MONO; }
    });
    if (head >= 0) { x.strokeStyle = '#f5f5f3'; x.lineWidth = 1; x.beginPath(); x.moveTo(X(head), top - 6); x.lineTo(X(head), top + lh * 3); x.stroke(); }
    const lastPeak = Math.max(...peaks);
    if (head >= lastPeak) {
      const a = Math.min(1, (head - lastPeak) / 0.4), w0 = X(Math.min(...peaks) - 0.15), w1 = X(Math.min(...peaks) - 0.15 + 2);
      x.globalAlpha = a; x.fillStyle = 'rgba(230,57,70,0.12)'; x.fillRect(w0, top - 6, w1 - w0, lh * 3 + 6); x.strokeStyle = OK; x.strokeRect(w0, top - 6, w1 - w0, lh * 3 + 6);
      x.fillStyle = OK; x.font = '700 13px ' + MONO; x.fillText('k = 3 ✓ within 2000 ms', w0 + 8, h - 14); x.globalAlpha = 1;
    }
    x.font = '400 12px ' + MONO; x.fillStyle = '#a3a3a3'; for (let k = 0; k <= 4; k++) x.fillText(k + 's', X(k) - 6, top + lh * 3 + 10);
    x.textBaseline = 'alphabetic';
  }

  drawHeat(c, t) {
    const [x, w, h] = this.fit(c);
    if (c !== this._heatC) { this._heatC = c; this.heatT0 = t; }
    const names = ['adityas-nothing', 'phone-dhruv', 'somnath', 'dhruv2', 'phone-iphn'], per = [29, 58, 40, 0, 14], cols = 35, L = 120, top = 6, gw = (w - L - 10) / cols, gh = (h - 34) / 5, el = (t - this.heatT0) * 40;
    x.font = '400 13px ' + MONO; x.textBaseline = 'middle';
    names.forEach((nm, r) => {
      x.fillStyle = r === 4 ? '#a3a3a3' : '#d6d6d6'; x.fillText(nm, 10, top + r * gh + gh / 2);
      for (let k = 0; k < cols; k++) {
        const ord = k + r * 3; if (ord > el) continue;
        let v = per[r] ? hash(r * 97 + k * 13) * (per[r] / 58) : 0; if (Math.abs(k - 15) < 2 && r < 3) v = Math.min(1, v + 0.6); if (r === 4 && k < 18) v = 0;
        const grow = Math.min(1, (el - ord) / 6);
        x.fillStyle = v > 0.05 ? 'rgba(242,240,235,' + (0.12 + v * 0.8) + ')' : '#1a1a1a';
        const cw = (gw - 3) * grow, ch = (gh - 3) * grow;
        x.beginPath(); x.roundRect(L + k * gw + (gw - 3 - cw) / 2, top + r * gh + (gh - 3 - ch) / 2, cw, ch, 3); x.fill();
      }
    });
    if (el > 30) { const ex = L + 15 * gw - 2, pulse = 0.5 + 0.5 * Math.sin(t * 3); x.strokeStyle = OK; x.lineWidth = 2; x.strokeRect(ex, top - 2, gw + 1, gh * 3 + 1); x.globalAlpha = pulse; x.strokeRect(ex - 3, top - 5, gw + 7, gh * 3 + 7); x.globalAlpha = 1; x.lineWidth = 1; }
    x.fillStyle = '#a3a3a3'; for (let k = 0; k <= cols; k += 5) { const mm = 45 + k, lab = (mm >= 60 ? '23:' + String(mm - 60).padStart(2, '0') : '22:' + mm); x.fillText(lab, L + k * gw - 14, h - 12); }
    x.textBaseline = 'alphabetic';
  }

  scrollFx(n) {
    const H = innerHeight;
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el._rv) return;
      const r = el.getBoundingClientRect();
      if (!el._init) { el._init = 1; if (r.top < H * 0.92) { el._rv = 1; return; } el.style.opacity = '0'; el.style.transform = 'translateY(48px) scale(0.98)'; el.style.transition = 'opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)'; }
      if (r.top < H * 0.86) { el._rv = 1; el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    document.querySelectorAll('[data-count]').forEach((el) => {
      if (el._cd === 2) return;
      if (!el._seen) { el._seen = 1; el.textContent = '0'; }
      if (!el._cd) { const r = el.getBoundingClientRect(); if (r.top < H * 0.95 && r.bottom > 0) { el._cd = 1; el._t0 = n; } else return; }
      const p = Math.min(1, (n - el._t0) / 1600), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(+el.dataset.count * e); if (p >= 1) el._cd = 2;
    });
    const q = this.quoteRef.current;
    if (q) {
      if (!q._full) { q._full = q.textContent; q.textContent = ''; }
      if (!q._t0) { const r = q.getBoundingClientRect(); if (r.top < H * 0.85) q._t0 = n; }
      if (q._t0) { const k = Math.floor((n - q._t0) / 55), cur = Math.floor(n / 450) % 2 ? '▍' : ' '; q.textContent = q._full.slice(0, k) + (k < q._full.length || cur === '▍' ? '▍' : ''); }
    }
  }

  drawSeis(c) {
    const [x, w, h] = this.fit(c), mid = h * 0.6, a = this.heroAmp || 0;
    const b = this.seis || (this.seis = []);
    b.push((Math.random() - 0.5) * 0.07 + a * (Math.random() - 0.5) * 2.2 + a * Math.sin(performance.now() / 18) * 0.6);
    const N = Math.ceil(w / 2); while (b.length > N) b.shift();
    const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(242,240,235,0)'); g.addColorStop(0.35, 'rgba(242,240,235,0.55)'); g.addColorStop(1, 'rgba(242,240,235,1)');
    x.strokeStyle = g; x.lineWidth = 1.4; x.beginPath();
    for (let i = 0; i < b.length; i++) { const px = w - (b.length - 1 - i) * 2, py = mid - Math.max(-1.3, Math.min(1.3, b[i])) * h * 0.38; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke();
    for (let px = w; px > 0; px -= 60) { x.fillStyle = 'rgba(189,189,189,0.25)'; x.fillRect(px, h - 6, 1, 6); }
    x.fillStyle = a > 0.1 ? AMB : '#a3a3a3'; x.font = '400 12px ' + MONO; x.fillText(a > 0.1 ? 'SEISMOGRAPH · PEAK ' + (a * 172).toFixed(0) + ' mm/s' : 'SEISMOGRAPH · LISTENING', 16, 14);
    x.fillStyle = AMB; x.beginPath(); x.arc(w - 2, mid - Math.max(-1.3, Math.min(1.3, b[b.length - 1] || 0)) * h * 0.38, 3, 0, 6.283); x.fill();
  }

  meshClick(e) { const r = e.currentTarget.getBoundingClientRect(); this.mesh = { ex: e.clientX - r.left, ey: e.clientY - r.top, t0: performance.now() / 1000, hits: new Map(), seed: Math.random() }; }
  drawMesh(c, t) {
    const [x, w, h] = this.fit(c), cols = w < 560 ? 5 : 7, rows = 5, pad = 20, top = 48, cw = (w - pad * 2) / cols, ch = (h - top - pad) / rows;
    if (!this.mesh || t - this.mesh.t0 > 5) this.mesh = { ex: pad + Math.random() * (w - pad * 2), ey: top + Math.random() * (h - top - pad), t0: t, hits: new Map(), seed: Math.random() };
    const M = this.mesh, age = t - M.t0, R = age * Math.max(w, h) * 0.42;
    const phones = [];
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const i = r * cols + q, cx = pad + q * cw + cw / 2, cy = top + r * ch + ch / 2, d = Math.hypot(cx - M.ex, cy - M.ey);
      const wob = 4 * Math.exp(-((d - R) * (d - R)) / 900) * Math.sin(d * 0.15 - age * 20);
      x.fillStyle = '#0a0a0a'; x.strokeStyle = '#2c2c2c'; x.lineWidth = 1; x.beginPath(); x.roundRect(pad + q * cw + 3 + wob, top + r * ch + 3, cw - 6, ch - 6, 6); x.fill(); x.stroke();
      x.fillStyle = '#6e6e6e'; x.font = '400 12px ' + MONO; x.fillText(String.fromCharCode(69 - r) + (q + 1), pad + q * cw + 10 + wob, top + r * ch + 16);
      if (hash(i * 1.7 + 0.3) < 0.42) {
        const handled = hash(i * 2.3 + M.seed * 10) < 0.14;
        if (R >= d && !M.hits.has(i)) M.hits.set(i, t);
        phones.push({ i, cx: cx + wob, cy, d, handled, hit: M.hits.get(i) });
      }
    }
    for (let k = 0; k < 3; k++) { const rr = R - k * 34; if (rr <= 0) continue; x.strokeStyle = 'rgba(242,240,235,' + Math.max(0, 0.6 - age * 0.13 - k * 0.15) + ')'; x.lineWidth = 2 - k * 0.5; x.beginPath(); x.arc(M.ex, M.ey, rr, 0, 6.283); x.stroke(); }
    if (age < 0.3) { x.fillStyle = 'rgba(242,240,235,' + (1 - age / 0.3) + ')'; x.beginPath(); x.arc(M.ex, M.ey, 10 + age * 80, 0, 6.283); x.fill(); }
    x.fillStyle = AMB; x.beginPath(); x.arc(M.ex, M.ey, 4, 0, 6.283); x.fill();
    const valid = phones.filter((p) => p.hit != null && !p.handled).sort((a, b) => a.hit - b.hit);
    if (valid.length >= 3) {
      const tri = valid.slice(0, 3); x.strokeStyle = OK; x.lineWidth = 1.5; x.setLineDash([5, 5]); x.lineDashOffset = -t * 30;
      x.beginPath(); tri.forEach((p, k) => (k ? x.lineTo(p.cx, p.cy) : x.moveTo(p.cx, p.cy))); x.closePath(); x.stroke(); x.setLineDash([]);
      x.fillStyle = 'rgba(230,57,70,0.07)'; x.fill();
      valid.slice(3).forEach((p) => { x.strokeStyle = 'rgba(230,57,70,0.25)'; x.lineWidth = 1; x.beginPath(); x.moveTo(tri[0].cx, tri[0].cy); x.lineTo(p.cx, p.cy); x.stroke(); });
    }
    phones.forEach((p) => {
      const on = p.hit != null, col = !on ? '#6e6e6e' : p.handled ? BAD : OK;
      x.fillStyle = col; x.beginPath(); x.roundRect(p.cx - 5, p.cy - 8, 10, 16, 2.5); x.fill();
      if (on) { const a = t - p.hit; if (a < 0.8) { x.strokeStyle = col; x.globalAlpha = 1 - a / 0.8; x.lineWidth = 1.5; x.beginPath(); x.arc(p.cx, p.cy, 10 + a * 30, 0, 6.283); x.stroke(); x.globalAlpha = 1; } if (p.handled) { x.font = '700 12px ' + MONO; x.fillText('HANDLED', p.cx - 20, p.cy + 20); } }
    });
    x.font = '700 13px ' + MONO;
    if (valid.length >= 3) { x.fillStyle = OK; x.fillText('k = 3 ✓  CONFIRMED · ' + valid.length + ' flats co-sign', pad, 26); }
    else { x.fillStyle = '#f5f5f3'; x.fillText('witnesses: ' + valid.length + ' / 3', pad, 26); }
    if (w >= 620) { x.font = '400 13px ' + MONO; x.fillStyle = '#a3a3a3'; x.textAlign = 'right'; x.fillText('CLICK A FLAT TO STOMP', w - pad, 26); x.textAlign = 'left'; }
  }

  drawLedger(c, t) {
    const [x, w, h] = this.fit(c), p = t % 7.5, gap = 16, pw = (w - gap * 3) / 2;
    const rows = [['22:58:12', '34.2'], ['22:59:40', '61.8'], ['23:00:41', '241.3'], ['23:01:05', '88.0'], ['23:02:30', '12.4']];
    const small = pw < 300;
    const panel = (x0, signed) => {
      const fail = signed && p > 2.6 && p < 3.8, sh = fail ? (Math.random() - 0.5) * 8 : 0, X0 = x0 + sh;
      x.fillStyle = '#0a0a0a'; x.strokeStyle = fail ? BAD : signed && p >= 3.8 ? OK : '#4a4a4a'; x.lineWidth = 1.5; x.beginPath(); x.roundRect(X0, 14, pw, h - 28, 14); x.fill(); x.stroke();
      x.font = '700 ' + (small ? 11 : 13) + 'px ' + MONO; x.fillStyle = signed ? AMB : '#d6d6d6'; x.fillText(signed ? 'tremor-witness event' : 'contractor_log.xlsx', X0 + 16, 40);
      x.font = '400 12px ' + MONO; x.fillStyle = '#a3a3a3'; x.fillText(signed ? 'co-signed by 3 phones' : '1 owner · edit rights', X0 + 16, 56);
      rows.forEach((r, i) => {
        const y = 92 + i * 34, tgt = i === 2;
        x.strokeStyle = '#2c2c2c'; x.lineWidth = 1; x.beginPath(); x.moveTo(X0 + 12, y + 14); x.lineTo(X0 + pw - 12, y + 14); x.stroke();
        x.font = '500 ' + (small ? 11 : 13) + 'px ' + MONO; x.fillStyle = MUT; x.fillText(r[0], X0 + 16, y);
        let v = r[1], col = '#f5f5f3';
        if (tgt) {
          if (p > 1.4 && p < 2.2) { x.fillStyle = 'rgba(207,207,207,0.35)'; x.fillRect(X0 + pw * 0.5 - 4, y - 12, 62, 20); }
          if (p >= 2.2 && p < 2.6) v = '';
          else if (p >= 2.6 && (!signed || p < 3.8)) { v = '8.1'.slice(0, Math.min(3, Math.floor((p - 2.6) / 0.18) + 1)); col = signed ? BAD : '#f5f5f3'; }
          if (signed && p >= 3.8) col = OK;
        }
        x.fillStyle = col; x.fillText(v + (v ? ' mm/s' : ''), X0 + pw * 0.5, y);
        if (tgt && !signed && p > 3.6) { x.font = '400 12px ' + MONO; x.fillStyle = '#a3a3a3'; x.fillText(small ? 'edited' : 'edited · no trace', X0 + pw - (small ? 50 : 104), y); }
      });
      const fy = h - 48;
      if (signed) {
        ['adityas', 'dhruv', 'somnath'].forEach((n, k) => { const bw = (pw - 40) / 3, bx = X0 + 16 + k * (bw + 4); x.fillStyle = fail ? 'rgba(138,138,138,0.15)' : 'rgba(230,57,70,0.12)'; x.beginPath(); x.roundRect(bx, fy - 12, bw, 24, 6); x.fill(); x.fillStyle = fail ? BAD : OK; x.font = '600 ' + (small ? 9 : 11) + 'px ' + MONO; x.fillText(n + (fail ? ' ✕' : ' ✓'), bx + 8, fy + 4); });
        if (fail) { x.fillStyle = BAD; x.font = '700 ' + (small ? 10 : 12) + 'px ' + MONO; x.fillText("✕ signatures don't match · rejected", X0 + 16, fy - 30); }
        if (p >= 3.8) { x.fillStyle = OK; x.font = '700 ' + (small ? 10 : 12) + 'px ' + MONO; x.fillText('✓ original restored from Arkiv', X0 + 16, fy - 30); }
      } else { x.font = '500 ' + (small ? 10 : 12) + 'px ' + MONO; x.fillStyle = p > 3.6 ? BAD : '#a3a3a3'; x.fillText(p > 3.6 ? '241.3 → 8.1. Nobody can tell.' : 'last modified: owner', X0 + 16, fy + 4); }
      if (p > 0.3 && p < 2.6) { const k = Math.min(1, (p - 0.3) / 1.1), e = 1 - Math.pow(1 - k, 3), cx = X0 + pw + 20 - e * (pw * 0.5 - 10), cy = h - 10 - e * (h - 10 - 92 - 2 * 34 + 2); x.fillStyle = '#f5f5f3'; x.strokeStyle = '#0b0b0b'; x.lineWidth = 1; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy + 16); x.lineTo(cx + 4.5, cy + 12); x.lineTo(cx + 8, cy + 19); x.lineTo(cx + 10.5, cy + 18); x.lineTo(cx + 7, cy + 11); x.lineTo(cx + 12, cy + 11); x.closePath(); x.fill(); x.stroke(); }
    };
    panel(gap, false); panel(gap * 2 + pw, true);
  }

  // ---------- 3D hero ----------
  async loadThree() {
    if (this.T) return this.T;
    if (window.THREE && window.THREE.WebGLRenderer) return (this.T = window.THREE);
    const urls = ['https://unpkg.com/three@0.184.0/build/three.module.js', 'https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js', 'https://esm.sh/three@0.184.0'];
    for (const u of urls) {
      try { const m = await Promise.race([import(u), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout ' + u)), 8000))]); if (m && m.WebGLRenderer) return (this.T = m); }
      catch (e) { console.warn('three.js load failed', u, e); }
    }
    throw new Error('three.js unavailable');
  }
  initThree(canvas) {
    this._threeCanvas = canvas;
    if (this.three) { this.three.r.dispose(); this.three = null; }
    this.buildThree(canvas).catch((e) => console.error('hero 3D init failed', e));
  }
  async buildThree(canvas) {
    const T = await this.loadThree();
    if (this._threeCanvas !== canvas) return;
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(38, 1, 0.1, 200); cam.position.set(0, 0, 10);
    const root = new T.Group(); scene.add(root);
    const orb = new T.Group(); orb.name = 'tremorOrb'; root.add(orb);
    scene.add(new T.HemisphereLight(0xffffff, 0x1a1a1a, 1.4));
    const key = new T.DirectionalLight(0xffffff, 2.4); key.position.set(-4, 5, 6); scene.add(key);
    const rim = new T.DirectionalLight(0xffffff, 1.1); rim.position.set(5, -2, -4); scene.add(rim);
    const inner = new T.PointLight(0xe63946, 0, 7, 2); orb.add(inner);
    const coreMat = new T.MeshStandardMaterial({ name: 'core', color: 0xb3121f, emissive: 0xe63946, emissiveIntensity: 0.25, roughness: 0.72 });
    const core = new T.Mesh(new T.SphereGeometry(1.08, 64, 64), coreMat); core.name = 'core'; orb.add(core);
    const swirlMat = new T.MeshBasicMaterial({ name: 'swirl', color: 0x6e282b });
    for (let k = 0; k < 4; k++) {
      const pts = [];
      for (let i = 0; i <= 140; i++) { const u = i / 140, th = 0.2 + u * 2.7, ph = u * Math.PI * 2.6 + k * Math.PI / 2, rr = 1.1; pts.push(new T.Vector3(rr * Math.sin(th) * Math.cos(ph), rr * Math.cos(th), rr * Math.sin(th) * Math.sin(ph))); }
      const tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 220, 0.022, 8, false), swirlMat); tube.name = 'swirl' + k; core.add(tube);
    }
    const ico = new T.IcosahedronGeometry(1.36, 2).toNonIndexed(); const p = ico.attributes.position;
    const shardMat = new T.MeshStandardMaterial({ name: 'shard', color: 0xd4d1ca, roughness: 0.8, metalness: 0.0, flatShading: true, side: T.DoubleSide });
    const edgeMat = new T.LineBasicMaterial({ name: 'edge', color: 0x6e282b, transparent: true, opacity: 0.6 });
    const shards = [];
    for (let i = 0; i < p.count; i += 3) {
      const a = new T.Vector3().fromBufferAttribute(p, i), b = new T.Vector3().fromBufferAttribute(p, i + 1), c = new T.Vector3().fromBufferAttribute(p, i + 2);
      const cen = a.clone().add(b).add(c).divideScalar(3), nrm = cen.clone().normalize();
      const o = [a, b, c].map((v) => v.clone().sub(cen).multiplyScalar(0.88));
      const q = o.map((v) => v.clone().addScaledVector(nrm, -0.1));
      const tri = [o[0], o[1], o[2], q[0], q[2], q[1]];
      for (let e = 0; e < 3; e++) { const e2 = (e + 1) % 3; tri.push(o[e], q[e], q[e2], o[e], q[e2], o[e2]); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(tri.flatMap((v) => [v.x, v.y, v.z]), 3)); g.computeVertexNormals();
      const m = new T.Mesh(g, shardMat); m.name = 'shard' + i / 3; m.position.copy(cen); orb.add(m);
      const ed = new T.LineSegments(new T.EdgesGeometry(g, 20), edgeMat); m.add(ed);
      shards.push({ m, n: nrm, base: cen.clone(), ph: hash(i) * 6.28, sp: 0.5 + hash(i + 1) * 1.0, rx: (hash(i + 2) - 0.5) * 2, ry: (hash(i + 3) - 0.5) * 2 });
    }
    const gc = document.createElement('canvas'); gc.width = gc.height = 256; const gx = gc.getContext('2d');
    const gr = gx.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(230,57,70,0.35)'); gr.addColorStop(0.3, 'rgba(230,57,70,0.08)'); gr.addColorStop(1, 'rgba(230,57,70,0)'); gx.fillStyle = gr; gx.fillRect(0, 0, 256, 256);
    const glow = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(gc), blending: T.NormalBlending, depthWrite: false, transparent: true })); glow.scale.set(6, 6, 1); orb.add(glow);
    for (let k = 0; k < 3; k++) { const ring = new T.Mesh(new T.TorusGeometry(2.1 + k * 0.55, 0.006, 6, 160), new T.MeshBasicMaterial({ color: k === 1 ? 0x8a8a8a : 0xf2f0eb, transparent: true, opacity: 0.45 })); ring.rotation.x = 1.2 + k * 0.25; ring.rotation.y = k * 0.5; ring.name = 'orbit' + k; orb.add(ring); }
    const N = 2200, dp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const u = hash(i) * 2 - 1, th = hash(i + 0.5) * 6.283, rr = 2.6 + Math.pow(hash(i + 0.7), 0.6) * 13, s = Math.sqrt(1 - u * u); dp[i * 3] = rr * s * Math.cos(th); dp[i * 3 + 1] = rr * u; dp[i * 3 + 2] = rr * s * Math.sin(th); }
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
    const dust = new T.Points(dg, new T.PointsMaterial({ color: 0xbdbdbd, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false })); root.add(dust);
    this.three = { T, r, scene, cam, root, orb, core, coreMat, glow, inner, shards, dust, fx: [], w: 0, h: 0 };
    this.lastQuake = performance.now() / 1000 - 4.4;
  }

  quake() {
    const t = performance.now() / 1000; this.lastQuake = t;
    const th = this.three; if (!th) return;
    const T = th.T, segs = [], rays = 18, rayPts = [];
    for (let i = 0; i < rays; i++) {
      let ang = (i / rays) * Math.PI * 2 + (Math.random() - 0.5) * 0.3, r = 0.25, x = 0, y = 0; const arr = [[0, 0, 0]];
      while (r < 11) {
        r += 0.3 + Math.random() * 0.7; ang += (Math.random() - 0.5) * 0.32;
        const nx = Math.cos(ang) * r, ny = Math.sin(ang) * r; segs.push([x, y, nx, ny, r]); x = nx; y = ny; arr.push([x, y, r]);
        if (Math.random() < 0.2) { let ba = ang + (Math.random() < 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6), bx = x, by = y; for (let j = 0; j < 3; j++) { const L = 0.25 + Math.random() * 0.55, ex = bx + Math.cos(ba) * L, ey = by + Math.sin(ba) * L; segs.push([bx, by, ex, ey, r + j * 0.3]); bx = ex; by = ey; ba += (Math.random() - 0.5) * 0.6; } }
      }
      rayPts.push(arr);
    }
    const near = (arr, R) => arr.reduce((b, p) => (Math.abs(p[2] - R) < Math.abs(b[2] - R) ? p : b), arr[0]);
    for (const R of [1.7, 2.9, 4.5, 6.6, 9]) for (let i = 0; i < rays; i++) { if (Math.random() < 0.3) continue; const a = near(rayPts[i], R), b = near(rayPts[(i + 1) % rays], R), mx = ((a[0] + b[0]) / 2) * 0.9, my = ((a[1] + b[1]) / 2) * 0.9; segs.push([a[0], a[1], mx, my, R + 0.1], [mx, my, b[0], b[1], R + 0.1]); }
    segs.sort((a, b) => a[4] - b[4]);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(segs.flatMap((s) => [s[0], s[1], 0, s[2], s[3], 0]), 3));
    const crack = new T.LineSegments(g, new T.LineBasicMaterial({ color: 0xf2f0eb, transparent: true, opacity: 1, blending: T.NormalBlending, depthWrite: false }));
    crack.name = 'airCrack'; crack.position.copy(th.orb.position); crack.position.z = 2.2; crack.rotation.z = Math.random() * 6.28; crack.userData.count = segs.length * 2; th.scene.add(crack);
    const rings = [0, 1].map((k) => { const m = new T.Mesh(new T.RingGeometry(0.96, 1, 160), new T.MeshBasicMaterial({ color: k ? 0xf2f0eb : 0xe63946, transparent: true, side: T.DoubleSide, blending: T.NormalBlending, depthWrite: false })); m.position.copy(th.orb.position); if (k) m.rotation.x = 1.25; th.scene.add(m); return m; });
    th.fx.push({ t, crack, rings });
  }

  updateThree(t) {
    const th = this.three, { r, cam, root, orb, core, coreMat, glow, inner, shards, dust } = th;
    const c = r.domElement, w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    if (th.w !== w || th.h !== h) { r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); th.w = w; th.h = h; }
    const ar = w / h, wide = ar > 1.15, vw = 2 * 10 * Math.tan((cam.fov * Math.PI) / 360) * ar; orb.position.set(wide ? Math.min(vw * 0.5 - 2.2, 2.4 + (ar - 1.15) * 1.6) : 0, wide ? 0.4 : 2.1, 0); orb.scale.setScalar(wide ? (w < 1100 ? 0.72 : 0.95) : 0.62);
    if (t - this.lastQuake > 6.5) this.quake();
    let amp = 0;
    th.fx = th.fx.filter((f) => {
      const age = t - f.t; amp += Math.exp(-age * 3) * (age < 0.05 ? age / 0.05 : 1);
      f.crack.geometry.setDrawRange(0, Math.floor(f.crack.userData.count * Math.min(1, age / 0.22)));
      f.crack.material.opacity = Math.max(0, 1 - Math.max(0, age - 0.5) / 1.4);
      f.crack.scale.setScalar(1 + age * 0.04);
      f.rings.forEach((m, k) => { const a = age - k * 0.12; m.scale.setScalar(1.4 + Math.max(0, a) * 8); m.material.opacity = a < 0 ? 0 : Math.max(0, 0.9 * (1 - a / 1.3)); });
      if (age > 2.2) { th.scene.remove(f.crack); f.crack.geometry.dispose(); f.crack.material.dispose(); f.rings.forEach((m) => { th.scene.remove(m); m.geometry.dispose(); m.material.dispose(); }); return false; }
      return true;
    });
    amp = Math.min(1.4, amp); this.heroAmp = amp;
    shards.forEach((s) => { const off = 0.035 * Math.sin(t * 1.4 + s.ph) + amp * 0.85 * s.sp; s.m.position.copy(s.base).addScaledVector(s.n, off); s.m.rotation.set(amp * s.rx * 0.7, amp * s.ry * 0.7, 0); });
    core.rotation.y = t * 0.35; orb.rotation.y = t * 0.12; orb.rotation.x = Math.sin(t * 0.3) * 0.18;
    coreMat.emissiveIntensity = 0.22 + amp * 1.4; glow.scale.setScalar(5.6 + amp * 5); inner.intensity = amp * 40;
    root.rotation.y += (this.mouse.x * 0.18 - root.rotation.y) * 0.05; root.rotation.x += (this.mouse.y * 0.1 - root.rotation.x) * 0.05;
    cam.position.x = (Math.random() - 0.5) * amp * 0.3; cam.position.y = (Math.random() - 0.5) * amp * 0.3;
    dust.rotation.y = t * 0.02; dust.scale.setScalar(1 + amp * 0.05);
    r.render(th.scene, cam);
    const tx = this.heroTextRef.current;
    if (tx) tx.style.transform = amp > 0.02 ? 'translate(' + ((Math.random() - 0.5) * amp * 10).toFixed(1) + 'px,' + ((Math.random() - 0.5) * amp * 10).toFixed(1) + 'px)' : '';
  }

  // ---------- Problem ----------
  drawProblem(c, t) {
    const [x, w, h] = this.fit(c);
    const P = 0.95, ph = t % P, hit = Math.floor(t / P), speed = w * 0.9, gy = h * 0.74, rx = Math.max(60, w * 0.11);
    const kick = Math.exp(-ph * 9) * 6;
    x.save(); x.translate((hash(hit) - 0.5) * kick, (hash(hit + 9) - 0.5) * kick);
    for (let k = 0; k < 3; k++) { const age = ph + k * P, rr = age * w * 0.7; x.strokeStyle = 'rgba(242,240,235,' + Math.max(0, 0.2 - age * 0.08) + ')'; x.lineWidth = 1; x.beginPath(); x.arc(rx, gy - 70, rr, Math.PI, Math.PI * 2); x.stroke(); }
    const disp = (px, py) => { const d = Math.hypot(px - rx, py - gy); let v = 0; for (let k = 0; k < 3; k++) { const age = ph + k * P, q = d - age * speed; v += 1.5 * Math.exp(-age * 1.5) * Math.sin(q * 0.07) * Math.exp(-(q * q) / 5000) * (1 + 120 / (d + 40)); } return v; };
    for (let py = gy + 12; py < h; py += 13) for (let px = 6; px < w; px += 13) {
      const v = disp(px, py), ang = Math.atan2(py - gy, px - rx), av = Math.abs(v);
      x.fillStyle = av > 0.25 ? 'rgba(242,240,235,' + Math.min(1, 0.25 + av * 0.8) + ')' : 'rgba(189,189,189,' + (0.22 + av) + ')';
      x.beginPath(); x.arc(px + Math.cos(ang) * v * 5, py + Math.sin(ang) * v * 5, 1.1 + av * 2.4, 0, 6.283); x.fill();
    }
    x.strokeStyle = '#f5f5f3'; x.lineWidth = 1.5; x.beginPath(); for (let px = 0; px <= w; px += 3) { const y = gy - disp(px, gy) * 4; px ? x.lineTo(px, y) : x.moveTo(px, y); } x.stroke();
    const hh = ph < 0.75 ? 70 * (ph / 0.75) : 70 * (1 - (ph - 0.75) / 0.2);
    x.strokeStyle = '#d6d6d6'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(rx - 20, gy); x.lineTo(rx - 20, gy - 170); x.lineTo(rx + 20, gy - 170); x.lineTo(rx + 20, gy); for (let yy = gy; yy > gy - 170; yy -= 22) { x.moveTo(rx - 20, yy); x.lineTo(rx + 20, yy - 22); } x.stroke();
    x.fillStyle = '#f5f5f3'; x.fillRect(rx - 15, gy - 32 - hh, 30, 28); x.fillStyle = '#f5f5f3'; x.fillRect(rx - 4, gy - 4, 8, 36);
    if (ph < 0.12) { x.fillStyle = 'rgba(242,240,235,' + (1 - ph / 0.12) * 0.6 + ')'; x.beginPath(); x.arc(rx, gy, 50 * (ph / 0.12) + 8, 0, 6.283); x.fill(); }
    const bw = Math.min(w * 0.36, 360), bx = Math.min(w - bw - 30, w * 0.5), floors = 7, top = Math.max(72, h * 0.16), fh = (gy - top) / floors;
    const la0 = (((ph - (bx + bw / 2 - rx) / speed) % P) + P) % P, swayAt = (la) => 13 * Math.exp(-la * 2.6) * Math.sin(la * 22), shake = Math.exp(-la0 * 5);
    const off = (f, la) => swayAt(la) * Math.pow(f / floors, 1.4);
    ['rgba(242,240,235,0.55)', 'rgba(230,57,70,0.55)', 'rgba(207,207,207,0.55)'].forEach((col, gI) => {
      const la = Math.max(0, la0 - (gI + 1) * 0.045);
      x.strokeStyle = col; x.lineWidth = 1.5; x.beginPath(); x.moveTo(bx + off(0, la), gy);
      for (let f = 1; f <= floors; f++) x.lineTo(bx + off(f, la), gy - f * fh);
      x.lineTo(bx + bw + off(floors, la), top); for (let f = floors - 1; f >= 0; f--) x.lineTo(bx + bw + off(f, la), gy - f * fh); x.stroke();
    });
    const rowsPer = 3, nb = Math.max(5, Math.floor(bw / 40)), bwk = bw / nb, rh = fh / rowsPer, phones = [];
    for (let r = 0; r < floors * rowsPer; r++) {
      const f = r / rowsPer, o = off(f, la0), y = gy - (r + 1) * rh, st = r % 2 ? bwk / 2 : 0, fl = Math.floor(f), win = r % rowsPer === 1;
      for (let k = -1; k < nb; k++) {
        let x0 = bx + st + k * bwk, x1 = x0 + bwk; x0 = Math.max(bx, x0); x1 = Math.min(bx + bw, x1); if (x1 - x0 < 3) continue;
        const id = r * 31 + k, jx = (hash(id) - 0.5) * shake * 5, jy = (hash(id + 0.5) - 0.5) * shake * 4;
        const isWin = win && k >= 0 && k % 2 === 1 && k < nb - 1;
        x.fillStyle = isWin ? '#080808' : (id % 3 ? '#0e0e0e' : '#101010'); x.strokeStyle = '#4a4a4a'; x.lineWidth = 1;
        x.beginPath(); x.rect(x0 + o + jx + 1, y + jy + 1, x1 - x0 - 2, rh - 2); x.fill(); x.stroke();
        if (isWin && (fl % 2 === 1) && k === (fl % 4 === 1 ? 1 : 3)) phones.push({ x: x0 + o + jx + (x1 - x0) / 2, y: y + rh / 2, fl });
      }
    }
    x.strokeStyle = 'rgba(230,57,70,' + shake * 0.8 + ')'; x.setLineDash([4, 4]); x.lineDashOffset = -t * 40; x.lineWidth = 1.2; x.beginPath(); phones.forEach((p, i) => (i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y))); x.stroke(); x.setLineDash([]);
    phones.forEach((p) => { const a2 = la0 - p.fl * 0.015; x.fillStyle = '#e63946'; x.beginPath(); x.roundRect(p.x - 4, p.y - 6, 8, 12, 2); x.fill(); if (a2 > 0 && a2 < 0.7) { x.strokeStyle = 'rgba(230,57,70,' + (0.8 - a2) + ')'; x.lineWidth = 1.5; x.beginPath(); x.arc(p.x, p.y, 8 + a2 * 46, 0, 6.283); x.stroke(); } });
    if (!this.pcr) { const segs = []; const grow = (u, v, an, len, depth, ord) => { const u2 = u + Math.cos(an) * len, v2 = v + Math.sin(an) * len; segs.push([u, v, u2, v2, ord]); if (depth < 5 && u2 > 0.02 && u2 < 0.98 && v2 > 0.02 && v2 < 0.98) { grow(u2, v2, an + (Math.random() - 0.5) * 0.9, len * 0.85, depth + 1, ord + 1); if (Math.random() < 0.5) grow(u2, v2, an + (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.6), len * 0.6, depth + 2, ord + 1); } }; for (let i = 0; i < 8; i++) grow(0.1 + Math.random() * 0.8, 0.1 + Math.random() * 0.75, Math.PI / 2 + (Math.random() - 0.5) * 2.4, 0.07, 0, i * 1.5); this.pcr = segs; }
    const vis = (hit % 34) / 2.2; let nVis = 0;
    this.pcr.forEach((sg) => { if (sg[4] > vis) return; nVis++; const fresh = vis - sg[4] < 0.5; const m = (u, v) => [bx + u * bw + off((1 - v) * floors, la0), top + v * (gy - top)]; const p1 = m(sg[0], sg[1]), p2 = m(sg[2], sg[3]); x.strokeStyle = fresh ? '#f5f5f3' : 'rgba(242,240,235,0.8)'; x.lineWidth = fresh ? 2.2 : 1.2; x.beginPath(); x.moveTo(p1[0], p1[1]); x.lineTo(p2[0], p2[1]); x.stroke(); });
    x.restore();
    x.font = '700 13px ' + MONO; x.fillStyle = '#f5f5f3'; x.fillText('BLOW #' + hit, Math.max(8, rx - 30), gy - 186);
    x.font = '400 13px ' + MONO; x.fillStyle = MUT; x.fillText('60-YEAR-OLD BUILDING · ' + nVis + ' CRACK SEGMENTS', bx, top - 12);
    x.fillStyle = '#e63946'; x.fillText('● phones feel every blow', bx, gy + 24);
  }

  // ---------- Solution ----------
  drawSolution(c, lt) {
    const [x, w, h] = this.fit(c);
    x.strokeStyle = 'rgba(242,240,235,0.05)'; x.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 32) { x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx, h); x.stroke(); }
    for (let gy = 0; gy < h; gy += 32) { x.beginPath(); x.moveTo(0, gy); x.lineTo(w, gy); x.stroke(); }
    x.font = '400 13px ' + MONO; x.textBaseline = 'middle';
    this['s' + this.state.step](x, w, h, lt);
    x.textBaseline = 'alphabetic';
  }
  phone(x, cx, cy, col, rot, label) {
    x.save(); x.translate(cx, cy); x.rotate(rot || 0);
    x.fillStyle = '#0e0e0e'; x.strokeStyle = col; x.lineWidth = 1.5; x.beginPath(); x.roundRect(-16, -28, 32, 56, 6); x.fill(); x.stroke();
    x.fillStyle = col; x.globalAlpha = 0.25; x.fillRect(-12, -22, 24, 40); x.globalAlpha = 1; x.restore();
    if (label) { x.fillStyle = MUT; x.textAlign = 'center'; x.fillText(label, cx, cy + 44); x.textAlign = 'left'; }
  }
  sig(tt) { const bt = ((tt % 3.2) + 3.2) % 3.2; let b = 0, env = 0; if (bt > 1.6 && bt < 2.6) { const a = bt - 1.6; env = Math.exp(-a * 4.5); b = Math.sin(a * 2 * Math.PI * 16) * env; } return { b, env, n: hash(Math.floor(tt * 60)) - 0.5 }; }
  s0(x, w, h, lt) {
    const gw = w - 130, lh = (h - 50) / 3, names = ['RAW  ·  LinearAccelerationSensor ~60 Hz', 'BAND  ·  HP 2 Hz → LP 25 Hz', 'VELOCITY  ·  ∫ trapezoid → mm/s'];
    let best = { v: 0, px: 0 };
    for (let i = 0; i < 3; i++) {
      const y0 = 40 + i * lh, mid = y0 + lh / 2;
      x.fillStyle = MUT; x.fillText(names[i], 20, y0 + 6);
      x.strokeStyle = '#2c2c2c'; x.beginPath(); x.moveTo(20, mid); x.lineTo(gw, mid); x.stroke();
      x.beginPath(); x.strokeStyle = [MUT, AMB, OK][i]; x.lineWidth = 1.6;
      for (let px = 20; px <= gw; px += 2) {
        const tt = lt - ((gw - px) / gw) * 4, s = this.sig(tt);
        let v = i === 0 ? s.b + 0.45 * Math.sin(tt * 1.3) + 0.22 * Math.sin(tt * 0.41) + 0.12 * s.n : i === 1 ? s.b + 0.05 * s.n : s.env * 0.95 + 0.02;
        if (i === 2 && v > best.v) best = { v, px };
        const y = mid - v * lh * (i === 2 ? 0.6 : 0.36); px === 20 ? x.moveTo(px, y) : x.lineTo(px, y);
      }
      x.stroke();
      if (i === 2 && best.v > 0.2) { const y = mid - best.v * lh * 0.6; x.fillStyle = OK; x.beginPath(); x.arc(best.px, y, 4, 0, 6.283); x.fill(); x.fillText('PPV ' + (best.v * 254).toFixed(1) + ' mm/s', best.px + 10, y); }
    }
    const s = this.sig(lt), ratio = 1 + s.env * 17, gx = w - 90, gh = h - 110, trig = ratio > 4;
    x.fillStyle = MUT; x.fillText('STA/LTA', gx - 4, 40);
    x.fillStyle = '#0b0b0b'; x.fillRect(gx, 60, 28, gh);
    const fh = Math.min(1, ratio / 18) * gh; x.fillStyle = trig ? OK : AMB; x.fillRect(gx, 60 + gh - fh, 28, fh);
    const thy = 60 + gh - (4 / 18) * gh; x.strokeStyle = BAD; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(gx - 8, thy); x.lineTo(gx + 36, thy); x.stroke(); x.setLineDash([]);
    x.fillStyle = trig ? OK : '#f5f5f3'; x.font = '700 14px ' + MONO; x.fillText(ratio.toFixed(1), gx - 2, 60 + gh + 20);
    if (trig) { x.fillText('TRIGGER', gx - 18, 60 + gh + 40); }
    x.font = '400 13px ' + MONO;
  }
  s1(x, w, h, lt) {
    const n = 4, gap = w / (n + 1), fy = h * 0.5;
    x.fillStyle = '#0b0b0b'; x.fillRect(30, fy + 34, w - 60, 4);
    for (let i = 0; i < n; i++) {
      const cx = gap * (i + 1), lifted = i === 2;
      const burst = Math.sin(lt * 2) > 0.2;
      if (lifted) {
        const yy = fy - 40 - 14 * Math.sin(lt * 1.6), rot = 0.45 * Math.sin(lt * 1.2);
        x.fillStyle = 'rgba(0,0,0,0.6)'; x.beginPath(); x.ellipse(cx, fy + 34, 18, 4, 0, 0, 6.283); x.fill();
        this.phone(x, cx, yy, BAD, rot);
        x.fillStyle = BAD; x.textAlign = 'center'; x.fillText('HANDLING ✕', cx, fy + 64); x.fillStyle = MUT; x.fillText('tilt ' + Math.abs(rot * 57).toFixed(0) + '° · low-f 0.82', cx, fy + 82); x.textAlign = 'left';
      } else {
        const j = burst ? Math.sin(lt * 90 + i) * 1.6 : 0;
        this.phone(x, cx + j, fy, OK, 0);
        x.fillStyle = OK; x.textAlign = 'center'; x.fillText('STRUCTURAL ✓', cx, fy + 64); x.fillStyle = MUT; x.fillText((48 + i * 3) + ' Hz · low-f 0.06', cx, fy + 82); x.textAlign = 'left';
      }
      const ty = fy + 120; x.beginPath(); x.strokeStyle = lifted ? BAD : OK; x.lineWidth = 1.4;
      for (let k = 0; k <= 80; k++) { const px = cx - 50 + k * 1.25, tt = lt + k / 80; const v = lifted ? Math.sin(tt * 4) * 16 : (burst ? Math.sin(tt * 90) * 8 * Math.exp(-(k % 40) / 20) : Math.sin(tt * 90) * 1); k ? x.lineTo(px, ty + v) : x.moveTo(px, ty + v); }
      x.stroke();
    }
    x.fillStyle = MUT; x.fillText('Hand sway = slow, big, tilted.  Building = fast, small, flat.', 20, 44);
  }
  s2(x, w, h, lt) {
    const cols = [AMB, OK, BLUE], addrs = ['0x940C…', '0xB0A8…', '0xCAd2…'], py = [h * 0.28, h * 0.52, h * 0.76];
    py.forEach((y, i) => { this.phone(x, 60, y, cols[i], 0); x.fillStyle = MUT; x.fillText(addrs[i], 90, y); });
    const bs = 58, sp = 76, scroll = (lt * 26) % sp, bx0 = w * 0.42;
    const nb = Math.ceil((w - bx0) / sp) + 1, last = bx0 + (nb - 2) * sp - scroll;
    for (let k = 0; k < nb; k++) {
      const bx = bx0 + k * sp - scroll, by = h * 0.52 - bs / 2; if (bx < bx0 - 20) continue;
      x.globalAlpha = Math.min(1, (bx - bx0 + 20) / 60);
      x.strokeStyle = k === nb - 2 ? AMB : '#4a4a4a'; x.lineWidth = 1.5; x.fillStyle = '#0b0b0b'; x.beginPath(); x.roundRect(bx, by, bs, bs, 8); x.fill(); x.stroke();
      for (let e = 0; e < 3; e++) { x.fillStyle = cols[(k + e) % 3]; x.globalAlpha *= 0.9; x.fillRect(bx + 8, by + 10 + e * 14, bs - 16 - e * 8, 8); }
      x.globalAlpha = 1;
      if (k < nb - 1) { x.strokeStyle = '#4a4a4a'; x.beginPath(); x.moveTo(bx + bs, h * 0.52); x.lineTo(bx + sp, h * 0.52); x.stroke(); }
    }
    for (let k = 0; k < 3; k++) {
      const pt = ((lt + k * 0.55) % 1.6) / 1.4; if (pt > 1) continue;
      const i = (Math.floor((lt + k * 0.55) / 1.6) + k) % 3, sx = 80, sy = py[i], ex = last + bs / 2, ey = h * 0.52, mx = (sx + ex) / 2, my = Math.min(sy, ey) - 80;
      const e = pt < 0.5 ? 2 * pt * pt : 1 - Math.pow(-2 * pt + 2, 2) / 2;
      const X = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * mx + e * e * ex, Y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * my + e * e * ey;
      x.strokeStyle = cols[i]; x.globalAlpha = 0.3; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(mx, my, ex, ey); x.stroke(); x.globalAlpha = 1;
      x.fillStyle = cols[i]; x.beginPath(); x.roundRect(X - 26, Y - 9, 52, 18, 5); x.fill(); x.fillStyle = '#050505'; x.font = '700 12px ' + MONO; x.fillText('SIGNED', X - 18, Y); x.font = '400 13px ' + MONO;
    }
    x.fillStyle = MUT; x.fillText('every write is a signed tx → $creator is immutable', 20, 44);
    x.fillStyle = AMB; x.fillText('ARKIV · RABDI 7794095', bx0, h * 0.52 + 56);
  }
  s3(x, w, h, lt) {
    const gx = w * 0.5, top = 70, bot = h * 0.52;
    x.fillStyle = '#2c2c2c'; x.fillRect(gx - 34, top, 10, bot - top); x.fillRect(gx + 24, top, 10, bot - top);
    x.fillStyle = BLUE; x.fillText('ENS AS-OF CHECK', gx - 50, top - 14);
    const list = [['adityas-nothing', 1], ['phone-dhruv', 1], ['phone-iphn', 0], ['somnath', 1], ['dhruv2', 1], ['phone-iphn1', 0]];
    for (let k = 0; k < 3; k++) {
      const T = lt + k * 0.9, idx = Math.floor(T / 2.7) * 3 + k, it = list[idx % list.length], p = (T % 2.7) / 2.7, y = top + 30 + k * ((bot - top - 40) / 3);
      let X, col = '#f5f5f3', a = 1;
      if (it[1]) { X = 20 + p * (w - 60); col = X > gx ? OK : '#f5f5f3'; }
      else { X = p < 0.55 ? 20 + (p / 0.55) * (gx - 120) : gx - 100 - (p - 0.55) * 300; col = p < 0.5 ? '#f5f5f3' : BAD; a = p > 0.55 ? Math.max(0, 1 - (p - 0.55) * 2.2) : 1; }
      x.globalAlpha = a; x.strokeStyle = col; x.lineWidth = 1.4; x.fillStyle = '#0b0b0b'; x.beginPath(); x.roundRect(X, y - 12, 120, 24, 6); x.fill(); x.stroke();
      x.fillStyle = col; x.fillText(it[0], X + 10, y);
      if (!it[1] && p > 0.5) { x.fillText('not-registered', X, y + 24); x.fillStyle = 'rgba(138,138,138,0.25)'; x.fillRect(gx - 34, top, 68, bot - top); }
      x.globalAlpha = 1;
    }
    const rl = 40, rr = w - 40, rw = rr - rl;
    const ruler = (y, a, b, tm, cm, okv, label) => {
      x.fillStyle = MUT; x.fillText(label, rl, y - 22);
      x.strokeStyle = '#4a4a4a'; x.beginPath(); x.moveTo(rl, y); x.lineTo(rr, y); x.stroke();
      x.fillStyle = 'rgba(230,57,70,0.18)'; x.fillRect(rl + a * rw, y - 8, (b - a) * rw, 16); x.strokeStyle = OK; x.strokeRect(rl + a * rw, y - 8, (b - a) * rw, 16);
      const mk = (v, c, t) => { x.fillStyle = c; x.beginPath(); x.arc(rl + v * rw, y, 5, 0, 6.283); x.fill(); x.fillText(t, rl + v * rw - 20, y + 22); };
      const pr = Math.min(1, lt / 2.4);
      mk(tm, '#f5f5f3', 'tMs'); if (pr > 0.5) mk(cm * Math.min(1, (pr - 0.5) * 2) + tm * (1 - Math.min(1, (pr - 0.5) * 2)), okv ? OK : BAD, '$createdAt');
      if (pr >= 1) { x.fillStyle = okv ? OK : BAD; x.fillText(okv ? '✓ ok' : '✕ not-registered-at-upload-time', rr - (okv ? 40 : 230), y - 22); }
    };
    ruler(h * 0.7, 0.15, 0.85, 0.48, 0.58, true, 'phone-dhruv · registered interval');
    ruler(h * 0.9, 0.05, 0.42, 0.36, 0.74, false, 'revoked phone tries to backdate');
  }
  s4(x, w, h, lt) {
    const L = 140, R = w - 30, span = 12, top = 70, lh = (h - 120) / 5, X = (s) => L + (s / span) * (R - L);
    const dots = [[0, 1.0, 'h'], [3, 2.2, 's'], [1, 5.1, 's'], [0, 5.5, 's'], [4, 5.8, 'u'], [2, 6.4, 's'], [3, 9.4, 's'], [2, 10.5, 'h']];
    const sweep = Math.min(span + 2, (lt / 6.5) * (span + 2)), ws = sweep - 2;
    PHONES.forEach((p, i) => { const y = top + i * lh + lh / 2; x.fillStyle = i === 4 ? '#a3a3a3' : MUT; x.fillText(p, 16, y); x.strokeStyle = '#2c2c2c'; x.beginPath(); x.moveTo(L, y); x.lineTo(R, y); x.stroke(); });
    const inW = new Set(); dots.forEach((d) => { if (d[2] === 's' && d[1] >= ws && d[1] <= sweep) inW.add(d[0]); });
    if (inW.size >= 3 && this.qConfirmAt == null) this.qConfirmAt = ws;
    if (lt < 0.1) this.qConfirmAt = null;
    if (this.qConfirmAt != null) { x.fillStyle = 'rgba(230,57,70,0.16)'; x.fillRect(X(this.qConfirmAt), top, X(this.qConfirmAt + 2) - X(this.qConfirmAt), lh * 5); x.strokeStyle = OK; x.strokeRect(X(this.qConfirmAt), top, X(this.qConfirmAt + 2) - X(this.qConfirmAt), lh * 5); }
    x.strokeStyle = AMB; x.lineWidth = 2; x.fillStyle = 'rgba(242,240,235,0.06)';
    const a = X(Math.max(0, ws)), b = X(Math.min(span, sweep)); if (b > a) { x.fillRect(a, top - 8, b - a, lh * 5 + 16); x.beginPath(); x.moveTo(a, top - 8); x.lineTo(a, top + lh * 5 + 8); x.moveTo(b, top - 8); x.lineTo(b, top + lh * 5 + 8); x.stroke(); }
    x.lineWidth = 1;
    dots.forEach((d) => { if (d[1] > sweep) return; const y = top + d[0] * lh + lh / 2, cx = X(d[1]); const col = d[2] === 'h' ? BAD : d[2] === 'u' ? '#a3a3a3' : (this.qConfirmAt != null && d[1] >= this.qConfirmAt && d[1] <= this.qConfirmAt + 2 ? OK : '#f5f5f3'); x.fillStyle = col; x.beginPath(); x.arc(cx, y, 6, 0, 6.283); x.fill(); if (col === OK) { x.strokeStyle = 'rgba(230,57,70,0.4)'; x.beginPath(); x.arc(cx, y, 11, 0, 6.283); x.stroke(); } });
    x.font = '700 13px ' + MONO; x.fillStyle = inW.size >= 3 || this.qConfirmAt != null ? OK : '#f5f5f3';
    x.fillText(this.qConfirmAt != null ? 'k = 3 ✓  CONFIRMED EVENT' : 'distinct phones in window: ' + inW.size + ' / 3', L, 40);
    x.font = '400 13px ' + MONO; x.fillStyle = AMB; x.fillText('← 2000 ms window →', Math.max(L, a), top + lh * 5 + 24);
  }
  s5(x, w, h, lt) {
    const cx = w / 2, cy = h * 0.4, src = [[w * 0.12, h * 0.15], [w * 0.1, h * 0.5], [w * 0.15, h * 0.82]];
    const p = Math.min(1, lt / 1.1), e = 1 - Math.pow(1 - p, 3);
    src.forEach((s) => { const X = s[0] + (cx - s[0]) * e, Y = s[1] + (cy - s[1]) * e; x.fillStyle = OK; x.globalAlpha = 1 - Math.max(0, p - 0.85) * 6; x.beginPath(); x.arc(X, Y, 7, 0, 6.283); x.fill(); x.globalAlpha = 1; });
    if (lt > 0.9) {
      const g = Math.min(1, (lt - 0.9) / 0.6), R = 70 * (1 - Math.pow(1 - g, 3)), rot = lt * 0.4;
      for (let k = 0; k < 3; k++) { x.strokeStyle = k ? 'rgba(242,240,235,' + (0.4 / k) + ')' : AMB; x.lineWidth = k ? 1 : 2; x.beginPath(); for (let i = 0; i <= 6; i++) { const a = rot * (k % 2 ? -1 : 1) + (i * Math.PI) / 3, rr = R + k * 16; i ? x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.stroke(); }
      x.fillStyle = '#f5f5f3'; x.textAlign = 'center'; x.fillText('EVIDENCE PACK', cx, cy - 6); x.fillStyle = MUT; x.fillText('3 members · ENS snapshot', cx, cy + 12);
      const full = '0x96bafdb136febafe6acfd83fbae4b13a9068f1d66dae2d84e8ccaab47755d81f', hx = '0123456789abcdef';
      const lock = Math.max(0, Math.min(full.length, Math.floor((lt - 1.6) * 40)));
      let s = full.slice(0, lock); for (let i = lock; i < full.length; i++) s += i < 2 ? full[i] : hx[Math.floor(Math.random() * 16)];
      x.font = '500 ' + (w < 640 ? 8 : 11) + 'px ' + MONO; x.fillStyle = lock >= full.length ? AMB : '#a3a3a3'; x.fillText('keccak  ' + s, cx, cy + 112); x.font = '400 13px ' + MONO;
      if (lt > 3.4) {
        const bw = Math.min(260, w * 0.38), by = h * 0.8, a = Math.min(1, (lt - 3.4) / 0.5);
        x.globalAlpha = a;
        [[cx - bw - 20, 'SWARM', '609a0261…2933f5', AMB], [cx + 20, 'ARKIV EVENT', 'hash ✓ matches pack', OK]].forEach((b) => {
          x.strokeStyle = b[3]; x.fillStyle = '#0b0b0b'; x.beginPath(); x.roundRect(b[0], by - 24, bw, 48, 10); x.fill(); x.stroke();
          x.fillStyle = b[3]; x.fillText(b[1], b[0] + bw / 2, by - 7); x.fillStyle = '#f5f5f3'; x.fillText(b[2], b[0] + bw / 2, by + 10);
          x.strokeStyle = 'rgba(242,240,235,0.4)'; x.setLineDash([3, 4]); x.beginPath(); x.moveTo(cx, cy + 124); x.lineTo(b[0] + bw / 2, by - 24); x.stroke(); x.setLineDash([]);
        });
        x.globalAlpha = 1;
      }
      x.textAlign = 'left';
    }
  }
  s6(x, w, h, lt) {
    const bxp = [w * 0.5, h * 0.78], srv = [w * 0.2, h * 0.3], nodes = [[w * 0.8, h * 0.22, 'ARKIV', AMB], [w * 0.86, h * 0.5, 'ENS', BLUE], [w * 0.8, h * 0.78, 'SWARM', OK]];
    const dead = lt > 1.6;
    nodes.forEach((n) => {
      x.strokeStyle = n[3]; x.globalAlpha = 0.35; x.beginPath(); x.moveTo(n[0], n[1]); x.lineTo(bxp[0], bxp[1]); x.stroke(); x.globalAlpha = 1;
      for (let k = 0; k < 3; k++) { const p = ((lt * 0.7 + k / 3) % 1); x.fillStyle = n[3]; x.beginPath(); x.arc(n[0] + (bxp[0] - n[0]) * p, n[1] + (bxp[1] - n[1]) * p, 3, 0, 6.283); x.fill(); }
      x.fillStyle = '#0b0b0b'; x.strokeStyle = n[3]; x.beginPath(); x.arc(n[0], n[1], 30, 0, 6.283); x.fill(); x.stroke(); x.fillStyle = n[3]; x.textAlign = 'center'; x.fillText(n[2], n[0], n[1]); x.textAlign = 'left';
    });
    if (!dead) {
      x.strokeStyle = 'rgba(189,189,189,0.4)'; x.setLineDash([4, 4]); x.beginPath(); x.moveTo(srv[0], srv[1]); x.lineTo(bxp[0], bxp[1]); x.stroke(); x.setLineDash([]);
      const j = lt > 1.0 ? (Math.random() - 0.5) * 6 * (lt - 1) : 0;
      x.fillStyle = '#0b0b0b'; x.strokeStyle = MUT; x.beginPath(); x.roundRect(srv[0] - 80 + j, srv[1] - 30, 160, 60, 10); x.fill(); x.stroke();
      x.fillStyle = '#f5f5f3'; x.textAlign = 'center'; x.fillText('OUR SERVERS', srv[0] + j, srv[1] - 6); x.fillStyle = MUT; x.fillText('vercel functions', srv[0] + j, srv[1] + 12); x.textAlign = 'left';
      this.frags = null;
    } else {
      if (!this.frags) { this.frags = []; for (let i = 0; i < 22; i++) this.frags.push({ x: srv[0] + (Math.random() - 0.5) * 150, y: srv[1] + (Math.random() - 0.5) * 50, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 200, r: Math.random() * 6, vr: (Math.random() - 0.5) * 8, s: 6 + Math.random() * 16 }); this.fragT = lt; }
      const dt = lt - this.fragT;
      this.frags.forEach((f) => { const X = f.x + f.vx * dt, Y = f.y + f.vy * dt + 420 * dt * dt; if (Y > h + 30) return; x.save(); x.translate(X, Y); x.rotate(f.r + f.vr * dt); x.fillStyle = '#4a4a4a'; x.strokeStyle = MUT; x.beginPath(); x.moveTo(-f.s / 2, -f.s / 3); x.lineTo(f.s / 2, -f.s / 4); x.lineTo(0, f.s / 2); x.closePath(); x.fill(); x.stroke(); x.restore(); });
      if (dt < 0.25) { x.fillStyle = 'rgba(138,138,138,' + (0.5 - dt * 2) + ')'; x.beginPath(); x.arc(srv[0], srv[1], 40 + dt * 300, 0, 6.283); x.fill(); }
      x.fillStyle = BAD; x.textAlign = 'center'; x.fillText('SERVERS OFF', srv[0], srv[1]); x.textAlign = 'left';
    }
    x.fillStyle = '#0b0b0b'; x.strokeStyle = dead ? OK : '#f5f5f3'; x.lineWidth = dead ? 2 : 1.4; x.beginPath(); x.roundRect(bxp[0] - 100, bxp[1] - 32, 200, 64, 12); x.fill(); x.stroke(); x.lineWidth = 1;
    x.textAlign = 'center'; x.fillStyle = '#f5f5f3'; x.fillText('YOUR BROWSER', bxp[0], bxp[1] - 8); x.fillStyle = dead ? OK : MUT; x.fillText(dead ? '✓ still verifiable' : 'recomputes the quorum', bxp[0], bxp[1] + 12); x.textAlign = 'left';
  }

  // ---------- Dashboard timeline ----------
  drawTimeline(c, n) {
    const [x, w, h] = this.fit(c);
    const span = 90000, L = 130, R = w - 16, top = 14, lh = (h - 40) / 5, X = (t) => R - ((n - t) / span) * (R - L);
    if (n > this.nextSpawn) { const lane = Math.floor(Math.random() * 5); this.tl.push({ lane, t: n, kind: lane === 4 ? 'unreg' : Math.random() < 0.45 ? 'rej' : 'wait', ppv: 20 + Math.random() * 110 }); this.nextSpawn = n + 1200 + Math.random() * 1800; }
    this.tl = this.tl.filter((d) => n - d.t < span + 2000);
    x.font = '400 13px ' + MONO; x.textBaseline = 'middle';
    for (let s = 0; s <= 90; s += 15) { const gx = X(n - s * 1000); x.strokeStyle = '#1a1a1a'; x.beginPath(); x.moveTo(gx, top); x.lineTo(gx, top + lh * 5); x.stroke(); x.fillStyle = '#a3a3a3'; x.fillText(s ? '-' + s + 's' : 'now', gx - 12, h - 12); }
    (this.bands || []).forEach((b) => { const a = X(b.t - 1000), bb = X(b.t + 1000); if (bb < L) return; const age = (n - b.t) / 1000; x.fillStyle = 'rgba(230,57,70,' + (age < 2 ? 0.35 - age * 0.08 : 0.18) + ')'; x.fillRect(Math.max(L, a), top, bb - Math.max(L, a), lh * 5); x.strokeStyle = 'rgba(230,57,70,0.6)'; x.strokeRect(Math.max(L, a), top, bb - Math.max(L, a), lh * 5); });
    PHONES.forEach((p, i) => { const y = top + i * lh + lh / 2; x.fillStyle = i === 4 ? '#a3a3a3' : '#d6d6d6'; x.fillText(p, 12, y); x.strokeStyle = '#2c2c2c'; x.beginPath(); x.moveTo(L, y); x.lineTo(R, y); x.stroke(); });
    this.tl.forEach((d) => { const cx = X(d.t); if (cx < L) return; const y = top + d.lane * lh + lh / 2, r = 3 + Math.min(8, d.ppv / 30), age = (n - d.t) / 1000; const col = d.kind === 'ok' ? OK : d.kind === 'rej' ? BAD : d.kind === 'unreg' ? '#5e5e5e' : MUT;
      if (age < 1) { x.strokeStyle = col; x.globalAlpha = 1 - age; x.beginPath(); x.arc(cx, y, r + age * 22, 0, 6.283); x.stroke(); x.globalAlpha = 1; }
      x.fillStyle = col; x.beginPath(); x.arc(cx, y, r, 0, 6.283); x.fill(); if (d.kind === 'ok') { x.shadowColor = OK; x.shadowBlur = 12; x.fill(); x.shadowBlur = 0; } });
    x.textBaseline = 'alphabetic';
  }
  stomp() { this.addEvent(performance.now() - 1200); this.setState((s) => ({ stomps: s.stomps + 1, flash: true })); clearTimeout(this.fto); this.fto = setTimeout(() => this.setState({ flash: false }), 2400); }

  drawSensor(c, t) {
    const [x, w, h] = this.fit(c), mid = h / 2;
    x.strokeStyle = '#2c2c2c'; x.beginPath(); x.moveTo(0, mid); x.lineTo(w, mid); x.stroke();
    x.beginPath(); x.strokeStyle = this.state.sensorOn ? AMB : '#6e6e6e'; x.lineWidth = 1.5;
    for (let px = 0; px <= w; px += 2) { const tt = t - (w - px) / w * 10; const s = this.sig(tt * 0.9); const v = this.state.sensorOn ? s.b * 0.9 + s.n * 0.08 : 0; const y = mid - v * h * 0.4; px ? x.lineTo(px, y) : x.moveTo(px, y); }
    x.stroke(); x.font = '400 12px ' + MONO; x.fillStyle = MUT; x.fillText('BAND-PASSED ACCELERATION · LAST 10 s', 10, 16);
  }

  runHealth() { if (this.hRun) return; this.hRun = true; this.setState({ health: 0 }); const step = () => { this.setState((s) => ({ health: s.health + 1 }), () => { if (this.state.health < 8) setTimeout(step, 380 + Math.random() * 300); else this.hRun = false; }); }; setTimeout(step, 450); }

  renderVals() {
    const s = this.state;
    const tabDefs = [['landing', '01', 'Landing'], ['problem', '02', 'Problem'], ['solution', '03', 'Solution'], ['dashboard', '04', 'Dashboard'], ['arkiv', '05', 'Arkiv'], ['ens', '06', 'ENS'], ['crops', '07', 'CROPS · EF']];
    const tabs = tabDefs.map(([id, num, label]) => ({ num, label, onClick: () => this.setTab(id), bg: s.tab === id ? '#f5f5f3' : 'transparent', color: s.tab === id ? '#0b0b0b' : '#d6d6d6' }));
    const dashDefs = [['monitor', 'Monitor'], ['sensor', 'Sensor'], ['setup', 'Setup (committee)'], ['report', 'Report'], ['health', 'Health']];
    const dashTabs = dashDefs.map(([id, label]) => ({ label, onClick: () => this.setState({ dash: id }), bg: s.dash === id ? '#2c2c2c' : 'transparent', color: s.dash === id ? '#f5f5f3' : '#bdbdbd' }));
    const steps = STEPS.map((st, i) => ({ num: String(i + 1).padStart(2, '0'), title: st.title, sub: st.sub, onClick: () => { this.setStep(i); this.setState({ auto: false }); }, bg: i === s.step ? 'rgba(242,240,235,0.10)' : 'transparent', border: i === s.step ? '#f5f5f3' : '#2c2c2c', numBg: i === s.step ? '#f5f5f3' : '#2c2c2c', numColor: i === s.step ? '#0b0b0b' : '#bdbdbd' }));
    const cur = STEPS[s.step];
    const recs = [['Contractor', 'The site log', 'Kept by the party being accused. Entries can be rewritten after the fact.', 'REWRITTEN'], ['Authority', 'The official monitor', 'One sensor, one owner, one switch. Data appears when they choose.', 'WITHHELD'], ['Society secretary', 'The spreadsheet', 'Whoever owns the file can change any cell, any time.', 'EDITED'], ['A resident', 'The WhatsApp video', 'The sender can trim it, and nobody can check when or where it was shot.', 'TRIMMED']];
    const records = recs.map((r, i) => { const on = i === s.probIdx; return { owner: r[0], title: r[1], body: r[2], verb: r[3], op: on ? 1 : 0, deco: on ? 'line-through' : 'none', border: on ? 'rgba(138,138,138,0.5)' : '#2c2c2c', bg: on ? 'linear-gradient(180deg,rgba(138,138,138,0.08),#0a0a0a)' : '#0a0a0a' }; });
    const tk = [['adityas-nothing', '118.1 mm/s · structural', OK], ['phone-dhruv', '241.3 mm/s · structural', OK], ['somnath', '173.4 mm/s · structural', OK], ['EVENT 0x7444…b123', 'k=3 confirmed', AMB], ['phone-iphn', 'not-registered', BAD], ['phone-dhruv', 'handling · tilt', BAD], ['SWARM 609a02…', 'sealed ✓', OK], ['dhruv2', 'sync 0 ms', MUT], ['somnath', 'no-quorum', BAD], ['ENS', 'tw.k = 3 · tw.window_ms = 2000', BLUE]];
    const ticker = tk.concat(tk).map((r) => ({ a: r[0], b: r[1], c: r[2] }));
    const hDefs = [['ARKIV', 'JSON-RPC reachable · Rabdi 7794095', '212 ms'], ['ARKIV', 'Query triggers for site ethmumbai-demo', '488 ms'], ['ENS', 'Resolve tremorwitness.eth on Sepolia', '341 ms'], ['ENS', 'Read tw.k / tw.window_ms text records', '296 ms'], ['ENS', 'Phones resolve to their writing wallets', '702 ms'], ['SWARM', 'Download latest sealed pack', '1.18 s'], ['SWARM', 'keccak(pack) equals Arkiv hash', '9 ms'], ['TIME', '/api/time reference clock (optional)', '88 ms']];
    const sc = { ARKIV: AMB, ENS: BLUE, SWARM: OK, TIME: MUT };
    const healthRows = hDefs.map((d, i) => { const done = s.health > i, run = s.health === i; return { stack: d[0], stackColor: sc[d[0]], check: d[1], result: done ? '✓ pass' : run ? 'running…' : '–', color: done ? OK : run ? AMB : '#a3a3a3', time: done ? d[2] : '' }; });
    const on = s.sensorOn;
    return {
      tabs, dashTabs, steps, records, ticker, healthRows,
      isLanding: s.tab === 'landing', isProblem: s.tab === 'problem', isSolution: s.tab === 'solution', isDash: s.tab === 'dashboard',
      isArkiv: s.tab === 'arkiv', isEns: s.tab === 'ens', isCrops: s.tab === 'crops', arkRef: this.arkRef, ensRef: this.ensRef, cropsRef: this.cropsRef,
      arkItems: PARTNER.arkiv.items, arkStats: PARTNER.arkiv.stats, ensItems: PARTNER.ens.items, ensStats: PARTNER.ens.stats, cropsItems: PARTNER.crops.items, cropsStats: PARTNER.crops.stats,
      isMon: s.dash === 'monitor', isSensor: s.dash === 'sensor', isSetup: s.dash === 'setup', isReport: s.dash === 'report', isHealth: s.dash === 'health',
      goLanding: () => this.setTab('landing'), goProblem: () => this.setTab('problem'), goSolution: () => this.setTab('solution'), goDash: () => this.setTab('dashboard'),
      goReport: () => this.setState({ dash: 'report' }),
      quake: () => this.quake(),
      heroRef: this.heroRef, heroTextRef: this.heroTextRef, tickerRef: this.tickerRef, probRef: this.probRef, solRef: this.solRef, tlRef: this.tlRef, senRef: this.senRef,
      evRef: this.evRef, heatRef: this.heatRef, fxRef: this.fxRef, weaveRef: this.weaveRef,
      feed: s.feed.map((f) => ({ time: f.time, tag: f.tag, color: f.color, who: f.who, text: f.text, bg: f.born && performance.now() - f.born < 1500 ? 'rgba(242,240,235,0.10)' : '#0a0a0a' })),
      runVerify: () => { location.href = '/report.html?site=' + 'ethmumbai-demo'; }, verifyLabel: 'Verify it live ↗',
      verifySteps: ['Fetch pack from Swarm gateway', 'keccak256(pack)', 'Read packHash on Arkiv entity', 'Compare hashes'].map((l, i) => { const done = s.verify > i, run = s.verify === i; return { label: l, status: done ? (i === 1 ? '0x96ba…d81f' : i === 3 ? 'match ✓' : 'ok ✓') : run ? 'running…' : '–', color: done ? OK : run ? AMB : '#a3a3a3', bg: done ? 'rgba(230,57,70,0.08)' : '#050505' }; }),
      seisRef: this.seisRef, meshRef: this.meshRef, ledgerRef: this.ledgerRef, blowRef: this.blowRef, quoteRef: this.quoteRef, meshClick: (e) => this.meshClick(e),
      stepKicker: cur.kicker, stepTitle: cur.head, stepBody: cur.body, stepCode: cur.code, stepFile: cur.file,
      prevStep: () => { this.setStep((s.step + STEPS.length - 1) % STEPS.length); this.setState({ auto: false }); },
      nextStep: () => { this.setStep((s.step + 1) % STEPS.length); this.setState({ auto: false }); },
      toggleAuto: () => { this.stepStart = performance.now(); this.setState({ auto: !s.auto }); },
      autoLabel: s.auto ? '❚❚ AUTOPLAY' : '▶ AUTOPLAY',
      stomp: () => this.stomp(),
      nEvents: 1, nTriggers: 141, // TM: the recorded session's real counts; the stomp button is an animation only
      heroTitle: s.stomps ? 'Simulated stomp' : 'Confirmed event · 23:00:41 IST',
      heroSub: s.stomps ? 'Animation only: real events come from phones. Open the live dashboard to see them.' : '3 registered phones agreed within 2000 ms · PPV 118.1–241.3 mm/s · sealed ✓ Swarm',
      heroBorder: s.flash ? '#e63946' : '#2c2c2c', heroBg: s.flash ? 'linear-gradient(135deg,rgba(230,57,70,0.2),#0b0b0b)' : 'linear-gradient(135deg,rgba(230,57,70,0.06),#0b0b0b)', heroShadow: s.flash ? '0 0 60px rgba(230,57,70,0.25)' : 'none',
      langs: ['EN', 'मराठी', 'हिंदी'].map((l) => ({ label: l, onClick: () => this.setState({ lang: l }), border: s.lang === l ? '#f5f5f3' : '#4a4a4a' })),
      // TM: the real sensor lives on the sensor page (DSP, ENS registration, signed Arkiv uploads).
      toggleSensor: () => { location.href = '/?site=' + 'ethmumbai-demo'; },
      goSensor: () => { location.href = '/?site=' + 'ethmumbai-demo'; },
      goSetup: () => { location.href = '/dashboard.html?site=' + 'ethmumbai-demo' + '#setup'; },
      goRealReport: () => { location.href = '/report.html?site=' + 'ethmumbai-demo'; },
      sensorBtnLabel: 'Open the sensor on this phone ↗', sensorBtnBg: on ? '#8a8a8a' : '#f5f5f3', sensorBtnColor: on ? '#ffffff' : '#0b0b0b',
      sensorHint: 'Opens the real sensor page. Lay the phone flat on the floor, screen up, then press Start.',
      senRate: on ? (59.6 + (s.senTick % 3) * 0.2).toFixed(1) + ' Hz' : '–', senFreq: on ? (48 + (s.senTick % 5)) + ' Hz' : '–', senClock: on ? 'synced' : 'not synced', senOutbox: on ? Math.floor(s.senTick / 6) + ' sent' : '–',
      runHealth: () => { location.href = '/health.html?site=' + 'ethmumbai-demo'; }, healthSummary: 'runs live in your browser',
    };
  }
}
