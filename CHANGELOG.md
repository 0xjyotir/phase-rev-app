# Changelog

## 1.1.0 — Liquid Glass, native navigation and full website parity

### The whole website is now in the app

- **Explore tab** — the homepage story: hero video, the Phase Rev method, the four pillars,
  "one system", ecosystem dimensions, coaches carousel, membership teaser, community, member
  stories and the final call to action. Guests get the same feed from **Explore Phase Rev** on
  the welcome screen (`/discover`).
- **Pillar pages** for Physical, Athletic, Nutrition and Mental, with every section from the
  website. Each call to action opens the working tool in the app instead of a sales page.
- **Ecosystem** page, rebuilt **Coaches** page (specialties, filters, philosophy, testimonial)
  and coach profiles, **Book a consultation** (format, time, note), rebuilt **Membership**
  (tiers, comparison, 7-day trial). Public pages work without an account.
- **Mind**: guided sessions (Deep Focus, Pre-game focus, Visualization, Evening wind-down),
  journal with prompt sets, 5-step thought reframe, wellbeing check with trend, mind streak.
- **Athletic**: reaction drill with history; sport programs link to visualization and focus.
- **Fuel**: quick-add meals, remove meals, a real day rollover with 30-day history, live weekly
  calories and nutrition score, nutrition expert with consultation request.
- **Today**: at-a-glance tiles including a **recovery score** (training load, rest, mood).
- **Progress photos** from the camera or library, stored on the device.

### Feels native on iOS

- iOS 26: system tab bar with Liquid Glass that minimises on scroll, live workout as the tab
  bar accessory, glass cards/buttons/chips (`expo-glass-effect`), transparent glass headers.
- Native large titles and header buttons (SF Symbols, menus, prominent Save), page sheets and
  form sheets with detents, `UISegmentedControl`, native alerts and action sheets.
- SF Pro / SF Rounded / SF Mono type on iOS with UIKit sizes; Oswald kept for brand headlines.
- Honours **Reduce Transparency**; in-app appearance drives native chrome.
- iOS 18 and earlier: blurred system headers and a solid tab bar; Android keeps a clean
  Material-leaning version of the same design.

### Cleaner, calmer UI

- One `Screen` component for every page: consistent gutters (20 pt iOS / 16 pt Android),
  section spacing, keyboard handling and floating footers.
- iOS Settings-style grouped lists on Profile, Mind tools, Journal and Today.
- Pillar heroes put the photo in a band above the text so copy never sits on a face.
- Disabled buttons stay opaque; tab bar labels get breathing room on devices without a home
  indicator.

### Under the hood

- Each tab owns a native stack; heavy tabs render on first visit; brand videos pause when
  their screen isn't visible.
- `profile-store` v2 with a migration; new store fields for mind, journal, reaction, coaching.
- New dependencies: `expo-glass-effect`, `expo-symbols`, `expo-image-picker`,
  `expo-file-system`, `expo-asset`, `@react-native-segmented-control/segmented-control`.
- Tests: unit tests for nutrition rollover, recovery, mind and reaction logic, plus smoke tests
  that render every route as a member, as a guest and with Liquid Glass on.
