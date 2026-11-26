# The TJ Hub — Website redesign

A static, responsive agriculture and consultancy website built using HTML, CSS and vanilla JavaScript. The design adapts the supplied recording's typographic navigation, rolling hover labels and sliding editorial panels to the TJ Hub brand.

## Run locally

1. Extract the ZIP and open this folder in VS Code.
2. Use Live Server on `index.html`, or run `python -m http.server 8000` in the folder and visit `http://localhost:8000`.
3. No npm, installation or build step is required.

## Project structure

- `index.html` — homepage, six interactive content panels, original business information.
- `styles.css` — responsive layout, colour tokens, matte surfaces and animation.
- `script.js` — previews, pointer tilt, panel navigation, scroll reveals, WhatsApp messages and video controls.
- `images/` — original images, a new SVG brand mark and local video poster frames.
- `videos/` — four original project films.

## Design and functionality

The homepage and all six content panels extend edge-to-edge without an outer frame, rounded viewport corners or external gaps. Internal spacing and rounded individual photographs and buttons are retained.

Forest green `#012B1D`, jungle green `#01B36C`, pumpkin orange `#F56D07`. Hovering over the desktop menu changes the text and photographic preview; selecting a section opens a scrollable modal panel. Close it using the Close button or Escape. Touch devices use tap navigation without hover requirements. Solid indigo surfaces replace glass effects while background blur, gradients and layered photos remain. The footer has circular email, WhatsApp and map icon links; the contact panel has icon-led links with contact details. Reduced-motion preferences are respected. The WhatsApp messages, email, coordinates, services, prices, testimonials and videos come from the original project. The logo, editorial headings and layout are new design choices. The website does not process payments or collect form submissions; purchase and booking links open WhatsApp.

## Publish on GitHub Pages

Copy the contents of this folder into your existing website repository (keep its `.git` folder), commit and push. Configure Pages to publish the repository root on your chosen branch. All local assets use relative paths. This package intentionally excludes the old Git history.
