# D3 probe: is the shipped frontend reproducible? (2026-11-06, local, no network writes)
Method: in apps/web run `npx vite build --outDir <scratch>/b{1,2} --emptyOutDir` twice at commit 962b7ea (apps/ and packages/ clean). sha256 over sorted per-file sha256 list of the whole output dir:
- build1 = build2 = 53171b193e62c5d031166a4b4d780067e46514e2c781e5e09b2589766ee4f74a (12 files, ~1 MB) => deterministic on this machine.
- https://tremor-witness.vercel.app/ (curl): index.html sha256 59063232af4a005ecf51b7cbd76760cf93699f6f41bf7d053d035b893b40f77a == local build index.html (byte-identical). Live /assets/main-L25m9f-2.js sha256 3903e2e0... == local; /assets/dashboard-iu_4Bcjn.js 885325fe... == local.
=> the LIVE deployment can be matched to the public repo commit by a fresh build today. NOT tested: cross-machine / CI reproducibility (Node 24.x pinned in engines), Vercel-vs-other-host.
Existing assets: apps/web/dist-swarm (assets, dashboard.html, index.html), public/tremor-witness-viewer.html (single-file viewer via vite-plugin-singlefile) already exist in the tree.
