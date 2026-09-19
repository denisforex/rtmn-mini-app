# RTMN / Beyond the surface

The landing page moves from a physical graphite gallery to an inverted architectural landscape. The supplied concepts inform scale, material and sequence; neither reference image is used as a background or shipped with the site.

## Implementation

- `src/components/RTMNWorld.jsx`: reusable journey, hero, catalog atmosphere, collection, story, transition and inverted-world components. SVG geometry builds the space. A vector clip places the existing photographic jacket inside the hero.
- `src/styles/rtmn-world.css`: composition, monochrome tokens, responsive treatments, focus styles and reduced-motion behavior. Existing commerce styles remain in `rtmn-dark.css`; the only edit to that file is its fabric image URL. Pre-existing edits to it are preserved.
- `src/assets/graphite-surface.svg` and `graphite-grain.svg`: small static SVG material textures. No canvas, WebGL, added runtime packages, remote image dependencies or generated campaign bitmap.
- `src/assets/optimized`: WebP copies of existing project assets. The six assets total 623,850 bytes (approximately 624 KB). Originals are retained. Product images retain lazy loading and have explicit dimensions.

Scroll motion uses one passive listener and at most one requested frame per scroll event. IntersectionObserver limits updates to visible scenes. Changes are written to CSS variables without React renders. Mobile motion intensity is 38% of desktop. Enabling reduced motion at runtime removes listeners, cancels pending frames and resets the scene transforms. All decorative layers ignore pointer events and are hidden from assistive technology; scene actions remain upright and focusable.

The existing DROP 002 designation, product data, browser persistence, cart, filters, search, wishlist, profile, inventory demo, checkout preview and Telegram integration are retained. Collections navigation now targets the collection feature. Catalog “View all” and empty-state reset clear the active collection, query and filters. New editorial copy is available in EN, DE and UK. Product gallery's first tab has an accessible name, and the mobile modal close button stays reachable while scrolling.

## Verification

- `npm test`: 34 passing tests across six files, including four new motion/accessibility tests. Existing coverage exercises search, filtering, sorting, size choice, cart quantities and stock limits, wishlist, localization, profile/admin demo, checkout validation/persistence, keyboard dismissal/focus and mocked Telegram initialization/haptics.
- `npm run build`: production build passes. JavaScript is approximately 89 KB gzipped; CSS approximately 14 KB gzipped. No new dependency was installed.
- Browser checks: desktop 1440×900; mobile 390×844; additional overflow checks at 320×740 and 768×1024. Hero, catalog, product dialog, cart, checkout, menu, localization and inverted scene inspected. Mobile size selection, adding/removing items, quantity totals, checkout validation and return navigation exercised. No broken images or application console errors observed.
- Performance scope: asset/bundle size, bounded scroll work, lazy loading and DOM/layer inspection. This is not a device FPS or Lighthouse score. Real Telegram WebView and physical-device performance still require testing on those devices; unit tests use a Telegram mock. The Telegram SDK reports unsupported native-color/haptic features in an ordinary browser, as expected.

This remains a local frontend with the existing demo checkout. No payment, order backend or public deployment was introduced.
