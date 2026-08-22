# Rust Presentation Website

A single-page, slideshow-style interactive presentation built with plain HTML/CSS/JS.
No build step, no server, no dependencies beyond two Google Fonts loaded via CDN link.

## File structure

```
rust-presentation/
├── index.html          content + structure for all 11 slides
├── style.css           all styling (design tokens at the top)
├── script.js           slide logic, video config, keyboard/fullscreen/mobile nav
└── assets/
    ├── videos/         <- put your .mp4 files here
    ├── images/         (unused, reserved for future images)
    └── icons/           (unused, reserved for future icons)
```

## 1. Add your videos

For local preview, keep these two files in `assets/videos/`:

- `main-video.mp4` — your main 16:9 video (e.g. Subway Surfers gameplay)
- `sign-language.mp4` — your sign-language interpreter video

The Subway Surfers file is larger than GitHub's 100 MB repository-file limit. Create a GitHub Release
tagged `v1.0.0` and upload the original `Subway Surfers Gameplay No Copyright - Vertical (1 HOUR).mp4`
as a release asset. The deployed page is already configured to load that asset without compressing it.
Also commit `assets/videos/sign-language.mp4` to the repository. Do not use a GitHub `blob` URL for videos.
  mainVideo: "assets/videos/main-video.mp4",
  signLanguageVideo: "assets/videos/sign-language.mp4"
};
```

Video behavior (autoplay/loop/mute/controls) is set just below that, in `VIDEO_SETTINGS`.

## 2. Edit presentation content

All slide content lives directly in `index.html` as plain HTML `<section class="slide">` blocks —
no JavaScript templating to worry about. Each slide is clearly commented, e.g. `<!-- SLIDE 3: CHARACTERISTICS -->`.
Edit text, add/remove `<li>` or `<article class="card">` items freely; the layout and styling adapt automatically.

## 3. Add or remove a section

To add a new slide:

1. Copy an existing `<section class="slide" ...>` block in `index.html`, give it a new `id` and `data-slide` number.
2. Add a matching `<li><a data-slide="N">...</a></li>` entry in the sidebar `<nav class="slide-nav">`.
3. Renumber any `data-slide` values after your insertion point so they stay sequential (0-indexed).

Removing a section: delete both its `<section>` block and its nav `<li>`, then renumber the rest.

## 4. Run it locally

No build tools needed — just open `index.html` in a browser, or serve the folder locally:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

(Opening `index.html` directly by double-clicking also works, but a local server avoids
occasional browser restrictions on local video/file loading.)

## 5. Deploy online

This is a fully static site — works on GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.

**GitHub Pages:** push this folder to a repo, then enable Pages in the repo settings
(Settings → Pages → Deploy from branch → root).

**Netlify / Vercel / Cloudflare Pages:** drag-and-drop the whole `rust-presentation` folder
into their dashboard (or connect the repo) — no build command needed, root directory is the publish directory.

## What to replace

- [ ] `assets/videos/main-video.mp4` — your main video file
- [ ] `assets/videos/sign-language.mp4` — your sign-language video file
- [ ] Title text in `index.html` `<title>` tag and the Home slide, if you want something other than
      "Rust: From Fundamentals to a Real-World Case Study"
- [ ] Anything in the presentation content you'd like to reword — it's all plain HTML in `index.html`

## Controls

- Click any sidebar item to jump to that section
- Prev / Next buttons or **Arrow Left / Arrow Right** to step through slides
- **Home** / **End** keys jump to first/last slide
- Fullscreen button (or browser fullscreen) for projector use — **Esc** exits
- On mobile, tap the hamburger icon (top-left) to open navigation
