# Phase Rev — Mobile App (Expo · React Native · JavaScript)

The member app for **Phase Rev** — _Rework, rebuild, recharge._
One connected system for **physical performance, athletic development, nutrition and mental wellness**.

This app is the mobile version of **Rev** (the member area of the website at
[`phaser2023/PHASEREV`](https://github.com/phaser2023/PHASEREV)). It uses the same brand,
colours, fonts, coach assets, demo account and data shapes, so the website and the app feel
like one product.

![Phase Rev app screens](docs/screens.png)

- **Expo SDK 58** · React Native 0.88 · React 19.3 · **Expo Router** (file-based navigation)
- **Plain JavaScript only** — no `.ts` / `.tsx` files. Data shapes are documented with JSDoc in
  [`src/types/models.js`](src/types/models.js).
- **Zustand + AsyncStorage** for state that survives restarts (even mid-workout).
- Runs in **Expo Go** — every native module used ships with Expo Go.

---

## Quick start

```bash
npm install
npm start            # then press i (iOS), a (Android) or scan the QR code with Expo Go
npm run web          # optional: run it in the browser
```

**Demo account** (same as the website): `demo@phaserev.com` / `demo1234`
— or tap **"Use demo account"** on the login screen.

| Script                   | What it does                                    |
| ------------------------ | ----------------------------------------------- |
| `npm start`              | Expo dev server                                 |
| `npm test`               | Unit tests for the training logic (Jest)        |
| `npm run lint`           | ESLint (Expo rules + import/alias checks)       |
| `npm run format`         | Prettier over `src/`                            |
| `npm run export:android` | Production bundle check (Hermes) without a device |

---

## What's in the app

| Tab / screen      | What the member can do                                                                                   | Web equivalent            |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| **Home**          | Today's focus, start/resume workout, weekly rhythm, fuel, mood, recent activity, wins                    | `/rev/overview`           |
| **Train → Today** | Today's routine with **last time vs aim for** on every exercise                                          | `/rev/workouts`           |
| **Active workout**| Log weight · reps · RIR (or hold seconds), auto rest timer (±30s, pause, skip), PR feedback, add sets    | Active mode               |
| **Session done**  | Duration, sets, volume, PRs, volume vs last time, streak → saved to history                              | SessionComplete           |
| **Train → Library** | Gym & calisthenics exercise library (search, muscle filters, favourites), skills, sport programs, **routine builder**, "set as today" | Library |
| **Train → Progress** | This week, volume trend (7/30/90 days), bench e1RM chart, muscle balance, consistency heatmap, PRs, insights, history, body weight | Progress |
| **Fuel**          | Macro rings, water, meal log (tick to log), **interactive regional globe** (14 regions, drag to rotate), meal plans | `/rev-nutrition`       |
| **Mind**          | Daily mood check-in + note, mood week chart, guided breathing (3 patterns), session library               | `/mental-wellness`        |
| **Profile**       | Baseline assessment, coaches, membership, appearance (system/light/dark), haptics, reset demo, sign out  | —                         |
| **Assessment**    | 4-step BMI wizard → saved to profile with recommended pillar path                                        | Homepage `#assessment`    |
| **Coaches**       | Roster with real coach photos + official flyers                                                          | `/coaches`                |
| **Membership**    | Essential / Performance / Elite + comparison table                                                       | `/pricing`                |

---

## Folder guide (where to look)

```
phaserev-app/
├── app.json                 Expo config (name, icons, splash, plugins)
├── jsconfig.json            "@/…" → src/…  and  "@assets/…" → assets/…
├── assets/
│   ├── brand/               App icon, splash, adaptive icons (generated from the Oswald wordmark)
│   ├── images/coaches/      Coach portraits + official flyers (from the website, resized)
│   └── video/hero.mp4       Website hero video (re-encoded for mobile, ~1 MB)
├── docs/ARCHITECTURE.md     ← read this to understand how everything connects
└── src/
    ├── app/                 ROUTES ONLY — every file is a screen (Expo Router)
    ├── components/          Reusable, domain-free building blocks
    │   ├── ui/              Button, Card, AppText, Screen, SegmentedControl, Dialog…
    │   ├── charts/          LineChart, BarChart, ProgressRing, Heatmap (SVG, no chart lib)
    │   └── brand/           Wordmark ("PHASE REV"), HeroVideo
    ├── features/            Domain code, one folder per pillar
    │   ├── workouts/        lib/ (pure math) · hooks/ · components/ · views/
    │   ├── nutrition/       globe + fuel cards
    │   ├── mental/          mood, breathing
    │   ├── assessment/      wizard steps + BMI helpers
    │   └── home/ auth/ coaches/ membership/ profile/
    ├── stores/              Zustand stores (session, profile, training, preferences)
    ├── services/            The only code that talks HTTP (api-client, auth-service)
    ├── hooks/               useMember, useProfile, useNow, useStoresHydrated
    ├── constants/           All copy + catalog + seed data (ported from the website)
    ├── theme/               Brand palette → light/dark tokens, fonts, spacing
    ├── providers/           ThemeProvider (useTheme), AppProviders
    ├── lib/                 dates, formatting, haptics, ids
    └── types/models.js      JSDoc data models (User, Routine, WorkoutSession…)
```

**The one rule:** `app/` (screens) → `features/` (domain UI + logic) → `components/` (generic UI)
→ `theme/`. Imports only ever point _down_ that list.

---

## Brand system (from the website)

| Token            | Value                          | Where it comes from                     |
| ---------------- | ------------------------------ | --------------------------------------- |
| Brand black      | `#050505`                      | `globals.css` `--bg-primary`            |
| Deep teal        | `#085F70`                      | `globals.css` `--accent-primary`        |
| Champagne        | `#C4A265`                      | `globals.css` `--accent-champagne`      |
| Rev cyan (dark)  | `#00BCD4`                      | `rev-app.css` dark `--rev-accent`, "REV" in the wordmark |
| Rev cyan (light) | `#00A9C7`                      | `rev-app.css` `--rev-accent`            |
| App surfaces     | `#0F1215` / `#171B20` (dark), `#F4F6F8` / `#FFFFFF` (light) | `rev-app.css` |
| Fonts            | **Outfit** (UI), **Oswald** (wordmark, headlines), **JetBrains Mono** (eyebrows, timers) | `layout.tsx` |
| Radius           | 24 cards · 16 tiles · pill buttons | `rev-app.css`                       |

See [`src/theme/palette.js`](src/theme/palette.js) and [`src/theme/themes.js`](src/theme/themes.js).

---

## Connecting a real backend

The app runs in **demo mode** until you set an API URL:

```bash
# .env  (see .env.example)
EXPO_PUBLIC_API_URL=https://api.phaserev.com/v1
```

`services/auth-service.js` then calls `POST /auth/login` instead of checking the demo account,
and `services/api-client.js` attaches the bearer token. The endpoints match the website's
`FRONTEND_BACKEND_INTEGRATION.md`. Details in [docs/ARCHITECTURE.md → Backend](docs/ARCHITECTURE.md#7-connecting-the-backend).

---

## Building for the stores

```bash
npx eas-cli@latest build --platform android   # or ios
```

Bundle IDs are `com.phaserev.app` (change in `app.json`). `ios/` and `android/` are generated
(Continuous Native Generation) — don't create them by hand.
