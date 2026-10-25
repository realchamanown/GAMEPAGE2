# Split It Out — Proposed Store Page (Mockup)

Academic UI/UX prototype showing how *Split It Out* could look on a PC game store page.
The layout follows the public Steam store page for PEAK; all code and artwork are original.
It is **not** a real store listing and is not affiliated with Steam or Valve.

## Run it

No build step or dependencies.

- **Quickest:** double-click `index.html` to open it in Chrome, Edge or Firefox.
- **Local server (optional):** in this folder run `python -m http.server 8000`, then open http://localhost:8000

Present at 1920×1080 in full screen (F11) for the closest match to the reference.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure: header, store nav, gallery, summary, purchase preview, About, requirements, sidebar, footer |
| `css/store.css` | All styling and the responsive breakpoints (972px, 760px, 420px) |
| `js/game-data.js` | **Edit this** to change the title, gallery list, tags and system requirements |
| `js/store.js` | Gallery, thumbnail slider, search, wishlist/follow/ignore, mobile menu, toasts |
| `assets/` | Placeholder images (replace with real ones, same filename) |
| `tools/make_placeholders.py` | Regenerates the placeholder art (needs Python + Pillow) |

## Replacing placeholders

| Placeholder | File / location | Size |
|---|---|---|
| Trailer poster | `assets/screenshots/trailer_poster.jpg` | 1920×1080 |
| Screenshots 1–6 | `assets/screenshots/ss_01.jpg` … `ss_06.jpg` | 1920×1080 |
| Header capsule + logo | `assets/header_capsule.jpg` | 460×215 |
| Page background art | `assets/page_bg.jpg` | 1438×810 |
| About section images | `assets/about_1.jpg`, `assets/about_2.jpg` | 1232×400 (any 616px-wide ratio works) |
| Studio name | `index.html` — search for `[studio TBD]` | |
| Publisher | `index.html` — search for `[publisher TBD]` | |
| Contact, website, Discord | `index.html` — sidebar links block | |
| Languages | `index.html` — `lang-table` | |
| Price | `index.html` — `Price TBA` | |
| Release date | `index.html` — `To be announced` (3 places) | |
| Hardware requirements | `js/game-data.js` — `sysreq` (`"TBD"` values) | |

To add or remove gallery items, edit the `media` list in `js/game-data.js`.

## What works

- Thumbnails switch the main image; arrows and keyboard ←/→ cycle with wrap-around; slider scrolls the strip.
- Search filters this page's sections, features and tags; arrow keys + Enter jump to a result.
- Wishlist, Follow and Ignore toggle and stay saved in the browser (localStorage). Wishlist count shows in the store nav.
- Header and store nav links scroll to sections; links to features not in the prototype show a short notice.
- Mobile: hamburger menu, single-column layout.
- Add to Cart is disabled. There is no sign-in, account or payment flow.
- The only external link (layout reference in the footer) is labelled external and opens in a new tab.
