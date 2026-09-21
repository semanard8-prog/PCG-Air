# AIRLIFE PCG — installing on Android

This folder is a complete, self-contained progressive web app. Put it on any
HTTPS host, open it once in Chrome, install it, and it runs offline from then on.

```
airlife-pwa/
├── index.html              the whole app — protocols, doses, skills, formulary
├── manifest.webmanifest    name, icons, colours, home-screen shortcuts
├── sw.js                   service worker — offline cache
└── icons/                  192, 512, maskable 512, apple-touch, favicon
```

There is nothing to build and no dependencies. `index.html` is one file.

---

## Route 1 — GitHub Pages (free, permanent, ~5 minutes)

1. Create a repository, e.g. `airlife-pcg`. Public or private both work;
   Pages on a private repo needs a paid plan, so public is simpler. There is
   no patient data in this app, but it is your employer's protocol content —
   see **Before you publish** below.
2. Upload the four items above to the repository root (drag the files onto
   the GitHub web uploader, `icons` folder included).
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
4. Wait a minute. Your URL is
   `https://<your-username>.github.io/airlife-pcg/`
5. Open that on your phone in Chrome. An **Install app** button appears
   bottom-right — tap it. Or use ⋮ → *Add to Home screen* / *Install app*.

Updating later: replace `index.html`, bump `CACHE` in `sw.js` from
`airlife-pcg-v1` to `-v2`, push. Phones pick it up on next launch and show a
"New build available — Reload" toast.

## Route 2 — Cloudflare Pages or Netlify (drag and drop)

- **Cloudflare Pages**: dash.cloudflare.com → Workers & Pages → Create →
  Pages → *Upload assets*. Drag the folder in. Free, fast, and supports
  password protection through Cloudflare Access if you want it private.
- **Netlify**: app.netlify.com/drop — drag the folder onto the page. Instant
  HTTPS URL. Site settings → *Password protection* if you want it gated.

Both give HTTPS automatically, which is required — service workers refuse to
register over plain HTTP.

## Route 3 — a real APK, if you want one

Once it's live at an HTTPS URL, **PWABuilder** wraps it into a signed Android
package with no code changes:

1. Go to `pwabuilder.com`, paste your URL, let it score the manifest.
2. **Package for stores → Android → Download**. You get an `.aab` for Play and
   an `.apk` for sideloading, plus a `signing.keystore` — keep that file, you
   need the same key for every future update.
3. Sideload: transfer the `.apk` to the phone, allow *Install unknown apps*
   for your file manager, tap it.

The result is a Trusted Web Activity — a thin native shell around the same
page. It looks and behaves like an installed app, gets a launcher icon, and
still updates whenever you redeploy the web files. For your own use the PWA
install from Route 1 is functionally identical and skips the keystore
bookkeeping; go APK only if you want to hand it to other crew members through
a store or an MDM.

## Route 4 — no hosting at all

Copy `index.html` to the phone and open it from Files. Everything works except
the service worker and the home-screen install, because `file://` has no
origin. Fine as a backup copy on an SD card; poor as the daily tool.

---

## Offline behaviour

- The first load over a signal caches the app shell and the Google Fonts.
  After that it opens with the radio off, in a hangar, or at altitude.
- A yellow **Offline — full guidelines cached** pill appears bottom-left when
  the phone loses signal, so you know the state you are in.
- Patient age, weight, height and presentation live in memory only. They are
  never written to the device and clear when the app closes. Nothing is
  transmitted anywhere — there is no analytics, no network call after load,
  and no backend.

## Phone settings worth changing

- **Display → Screen timeout**: this is a reference you read one-handed with
  gloves on. 2 minutes minimum.
- **Battery → unrestricted** for Chrome, so the cache is not evicted under
  aggressive storage management.
- Chrome ⋮ → **Site settings → Storage** — leave it alone; Android may clear
  "unused" site data, but an *installed* PWA is treated as persistent, which
  is one more reason to install rather than bookmark.
- Consider **Dark theme forced off** for the app; it already ships dark and
  Chrome's auto-darkening can double-apply.

## Before you publish

The protocol text belongs to HCA Houston Healthcare AIRLIFE. A public GitHub
Pages URL is world-readable. Before putting it on an open host:

- Clear it with your Medical Director or Clinical Director, or
- Use a host with access control — Cloudflare Access, Netlify password
  protection, or a private repo with Pages enabled on a paid plan.

The app carries a disclaimer on every screen, but that is not a substitute for
asking. Verify the build against the printed PCGs before anyone flies with it.

---

*Reference tool — not a substitute for the printed Patient Care Guidelines,
clinical judgment, or On-Line Medical Direction.*

---

## Flight Deck UX update — v5

This revision keeps the existing clinical content and calculation engine intact while upgrading the product shell:

- **Clinical Flight Deck** brand header and fast home-screen entry points for Case, PCG Assist, Doses, and MCS/device rescue.
- **PCG Assist status** explicitly shows whether the app is using online grounded reasoning or offline cached retrieval.
- **Offline assistant fallback** never fabricates a synthesized answer without the cloud model. It returns the closest cached PCG references for the clinician to open directly.
- **Connectivity status** is visible in the app chrome in addition to the existing offline badge.
- **PWA shortcuts** now expose Case, PCG Assist, Critical Doses, and Device Rescue from the launcher.
- Service-worker cache bumped to `airlife-pcg-v5-flightdeck` so installed copies discover the update.

### Important clinical-content note

This UX update does **not** claim that the embedded guideline transcription has been reconciled line-by-line against every PDF in the supplied 2024 protocol pack. Treat source ingestion/version reconciliation as a separate controlled clinical-content release, with medical-director/clinical-review sign-off before operational deployment.

### Recommended next product phases

1. **Versioned source library** — Adult, Pediatric, HROB/OB, SOG, and later provider-specific protocol packs with effective dates and superseded-version handling.
2. **Provider profiles** — same app shell, but branded/signed protocol bundles per flight program; shared calculators and skills where appropriate.
3. **Change-review workflow** — import a new PDF pack, show section-by-section diffs, require clinical approval, then publish an immutable signed release.
4. **Secure AI proxy** — keep API keys off crew devices; retrieve only approved protocol chunks; log no PHI by default.
5. **Offline semantic index** — local synonym-aware search and question-to-PCG retrieval even with no data connection.
6. **Crew favorites / flight mode** — pin commonly used pages, one-handed large-target mode, night-flight palette, and optional glove-friendly controls.
7. **Training mode** — case simulations, protocol drills, skills checklists, and debrief questions clearly separated from live-reference mode.
8. **Operational integrations** — controlled links to dispatch/transfer-center workflows, aircraft/device checklists, contact directories, and hospital capability references without mixing them into clinical standing orders.


## Clinical Flight Deck v7 — code mode, bag math, and rapid navigation

Version 7 is a workflow update aimed at actual transport use rather than adding another layer of menus. It preserves the offline-first PWA architecture while making the most time-sensitive jobs available with fewer taps.

### What changed

- **More visible Flight Deck UI:** stronger light-mode background gradients, more obvious section color coding, compact quick-finder controls, and a clearer dark hero area so the app no longer reads as a nearly white reference sheet.
- **Clinical terminology:** presentation shortcuts now use **Tachycardia** and **Bradycardia** rather than “fast rhythm” and “slow rhythm.”
- **Rapid dropdowns:** Clinical presentation, mechanism/environmental, OB/neonatal, protocol section, medication, and calculator selectors sit together at the top of the Case view. Free-text search remains available for one-off terms.
- **Source-visible medication math:** calculated patient doses are displayed beside the original protocol dose/range rather than replacing it. This is deliberate so a crew member can visually cross-check the calculation.
- **Bag / Infusion calculator:** enter the literal drug amount and volume supplied by the sending facility (for example, 4 mg in 250 mL, 8 mg in 1 L, or 1 g in 100 mL). The calculator derives concentration, accepts common weight-based and non-weight-based dose-rate units, displays useful equivalents, and returns the pump rate in mL/hr.
- **Active Cardiac Arrest Companion:** launchable from the adult, pediatric, and newborn arrest references. It keeps the CPR/code timer running, provides cycle timing, rhythm selection, shock/epinephrine event tracking, age-appropriate compression/ventilation guidance, reversible-cause prompts, and protocol-dose-versus-calculated-dose displays.
- **Adult / Pediatric / Newborn branches:** the active tool selects Adult ACLS, Pediatric PALS, or Newborn NRP from patient context when possible, with an explicit manual selector when the crew needs to override it.
- **Offline behavior remains first-class:** the clinical shell, calculators, protocol content, and arrest companion continue to work from the service-worker cache. Cloud AI is never presented as available when disconnected; the Ask surface falls back to local protocol retrieval.

### Cardiac-arrest source reconciliation

The adult arrest reference used by the active companion was reconciled against the supplied **Adult PCG Rev. 2024.04** source, and the pediatric branch was checked against the supplied **Pediatric PCG 24.04** source. The code companion is a navigation/calculation layer over those approved references; it is not intended to create new clinical instructions. The newborn pathway is based on the supplied HROB/NRP material already represented in the app.

Before operational release, have the Medical Director / clinical governance owner perform a final source-to-screen verification of all arrest branches and medication calculations. This is especially important whenever the source PCGs are revised.

### Deploying v7 over the existing GitHub Pages build

Replace `index.html`, `manifest.webmanifest`, and `sw.js` in the deployed repository (and `README.md` if you keep project documentation there). Keep the existing `icons/` directory. The service-worker cache name is now **`airlife-pcg-v7-codebag`**, which causes clients to install the new shell instead of continuing to use the v6 cache. A browser that already has the old app open may need one reload after the new service worker activates.
