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
