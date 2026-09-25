# Sajith-Quote

A personal quotation generator with exactly two pages: Generator and History. All quotation records and serial reservations are stored in IndexedDB in your browser. No authentication, remote API, database server, analytics, email sending or cloud services are used.

## Run locally

Requires Node.js 20.9 or newer and npm. From this directory:

```sh
npm install
npm run build
npm start
```

Open **http://127.0.0.1:3000**. The start command serves the static `out/` directory on loopback only; there is no application backend. Keep the same URL, port and browser profile to retain access to your data. Do not open `out/index.html` with `file://`: browser modules, IndexedDB origins and clipboard permissions require a proper local origin.

After the first successful load and service-worker installation, both pages and all bundled assets are available offline, even if the local static server stops. Product datasheet links still require connectivity to their respective sites. Dependencies are needed only during setup/build; fonts and runtime assets are bundled locally. You can also serve `out/` with any static HTTP file server at the root of a local origin. `npm run dev` runs the development server; offline caching is enabled only in production.

## Workflow

1. Upload or paste schema 1.0 product JSON and choose **Import Products**.
2. Enter customer details, quotation serial, per-product prices, weights and lead times. USD is fixed at 3.70 AED; AED is 1.00. Configure EUR/GBP manually when used.
3. Choose **Modify Template** to validate and regenerate. Copy/download/save remain disabled until the preview reflects the latest inputs.
4. **Copy Quotation** writes formatted HTML and plain text to the clipboard. Paste into Outlook using source formatting. If clipboard access is blocked, download the HTML, open it in your browser, select the quotation and copy it.
5. **Save Quotation** stores a Draft. Mark it as Sent separately in History after actually sending it; a customer name is required and an actual timestamp is recorded.
6. Export backups regularly, preferably to another device. Browser storage is not a backup and may be cleared or evicted.

The original reference is retained at `reference/original-template.html`. Rendering preserves its nine-column merged-cell layout, inline typography/borders/padding, commercial defaults and exact warranty/condition text. The closing paragraph, including “Best regards” and the MW Group email signature, is removed as requested. The supplied lead time is only `[Lead time]`, so the editor requires your own lead time instead of inventing one. Manufacturer and weight remain inside the existing description cell; no columns were added. Customer email and quotation date are stored; the template has no separate cells for them. The date is reflected in the quotation number, and the customer name in the salutation.

Prices use decimal arithmetic with half-up rounding. Shipping is calculated from each unit's weight rounded upward to the next 0.25 kg, at AED 30/kg. Final unit prices round to two decimals before multiplication; VAT is 5% of the subtotal rounded to two decimals. Each quotation snapshots its manually configured rates.

Full numbers are reserved atomically with saves. Reservations survive deletion, and suggestions use the year's highest reserved serial plus one. Reusing a serial on a different day warns but is allowed; reusing another quotation's full number is blocked, including after deletion.

## Backup and restore

History offers a readable JSON export of quotations, original imports, edited values, totals, complete generated HTML, status timestamps, rate settings and the serial ledger. Import validates the entire file and recomputes totals/HTML before any mutation. Merge preserves existing settings and rejects conflicting records atomically. Replace requires explicit confirmation and replaces all local data, including the ledger. Backups with modified or incompatible HTML are rejected instead of rendering untrusted markup. Keep original backup files unchanged.

## Verification

```sh
npm run typecheck
npm test
npm run build
npm start
# In a second terminal, with Microsoft Edge installed:
node scripts/browser-test.mjs
```

The browser test uses a separate disposable profile under `test-results/`, never the user's browser profile. It exercises import errors, multiple product rows, missing weights/rates, calculations, real rich-HTML clipboard writes, stale preview gating, save/edit/Sent, search, backup merge, persistent browser restart, offline navigation, mobile layout and deletion-safe serial suggestions. Screenshots are saved there as well. Actual Outlook rendering is a manual acceptance check and requires the user's Outlook installation.

Next.js static export is configured with `output: 'export'`, following the [official static export documentation](https://nextjs.org/docs/app/guides/static-exports).

## Vercel deployment

Deploy the `main` branch from the repository root. This application deliberately uses Next.js static export, so `vercel.json` selects Vercel's **Other** framework preset, installs dependencies using `npm ci`, runs the complete `npm run build` command (including the offline service worker), and publishes the static `out/` directory. No runtime application server or cloud database is introduced.

Do not combine Vercel's `nextjs` framework preset with `outputDirectory: "out"`. The Next.js adapter treats the configured output directory as its framework build directory and looks there for internal files such as `routes-manifest.json`. Static export correctly writes those internal files to `.next/` and only deployable HTML, JavaScript, CSS, text payloads and `sw.js` to `out/`. Using the Other preset tells Vercel to serve that completed static export directly, so no framework manifest is required in `out/`.

Only source files, templates, assets, configuration, tests and the dependency lockfile belong in Git. Do not force-add `node_modules`, `.next`, `out`, test browser profiles or TypeScript build caches. Windows-generated npm launchers committed with Git mode `100644` cannot execute on Vercel's Linux builders; a fresh install creates the correct platform-specific launchers. `.gitignore` protects Git commits and `.vercelignore` excludes local artifacts from CLI uploads.

For a clean checkout, run `npm ci`, `npm run build`, `npm run typecheck` and `npm test`. Build first to generate Next.js's type declarations. If retrying a deployment that cached the previously committed dependencies, redeploy the corrected commit with the existing build cache disabled.

The Clean Linux build workflow also performs a fresh install on Ubuntu, checks both Next.js executable permissions, builds the static export, runs the type check and tests, and rejects accidentally tracked generated files.
