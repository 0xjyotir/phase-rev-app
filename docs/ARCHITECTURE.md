# Phase Rev App — Architecture

A guided tour of how the code is organised and how the pieces link together.
If you only read one section, read **§2 Layers** and **§4 The workout loop**.

---

## 1. Mental model

```
 Screen (src/app/…)            "what's on this page"           thin: layout + wiring
   └─ Feature UI (src/features/<pillar>/components | views)    domain cards, lists, forms
        ├─ Hooks (features/*/hooks, src/hooks)                  read stores, derive data
        │     └─ Stores (src/stores)                            Zustand state, persisted
        │           └─ Pure logic (features/*/lib)              math, planning, analytics
        └─ UI kit (src/components/ui | charts | brand)         Button, Card, LineChart…
              └─ Theme (src/theme + providers/ThemeProvider)   colours, fonts, spacing
```

- **Screens** never contain business logic; they compose feature components.
- **Feature components** may read stores (via hooks) and call store actions.
- **`lib/` files are pure JavaScript** — no React, no stores — so they're unit-tested
  (`*.test.js`) and safe to reuse on a server later.
- **UI kit components know nothing about workouts or meals.** They take props only.

This mirrors the website's rule: _pages import sections, sections import components_.

---

## 2. Layers and their files

### Routes — `src/app/`

Expo Router turns files into screens. `_layout.js` files define navigators.

```
_layout.js              Root Stack: auth gate (Stack.Protected), fonts, splash, day rollover
(auth)/welcome.js       Hero video + "REWORK YOUR BODY…" → Enter Rev / Explore Phase Rev
(auth)/login.js         Email/password + demo account card
(tabs)/_layout.js       iOS 26: NativeTabs (Liquid Glass, workout accessory)
                        else:   JS tabs + floating "Resume workout" pill
(tabs)/(home)/          Today         ┐ each group's _layout.js is a TabStack:
(tabs)/(train)/train.js Train         │ its own native stack, large titles on iOS,
(tabs)/(fuel)/fuel.js   Fuel          │ so pushes keep the tab bar visible
(tabs)/(mind)/mind.js   Mind          │ (?view=&sub= in Train's URL)
(tabs)/(explore)/       Explore       ┘
profile.js              Account + settings (pushed from the avatar)
discover.js             Guest version of Explore (public)
ecosystem.js            Four pillars, one journey (public)
pillar/[id].js          physical | athletic | nutrition | mental (public)
coaches/index.js        Specialties, filters, roster (public)
coaches/[id].js         Coach profile (public)
coaches/request.js      Book a consultation (sheet, members)
membership.js           Tiers + comparison + trial (public)
assessment.js           4-step baseline (sheet, public — saving needs sign-in)
workout/active.js       Live logging (full-screen, keeps screen awake)
workout/complete.js     Session summary
history/[id].js         A past workout
exercise/[id].js        Exercise detail (form video, PR, e1RM, chart, cues)
routine/new.js          Routine builder (sheet)
breathing.js            Breathing player (full-screen)
session/[id].js         Guided meditation / visualization player (full-screen)
reaction.js             Reaction drill (full-screen)
journal/index.js        Journal entries + prompt sets
journal/new.js          New entry (sheet)
reframe.js              5-step thought reframe (sheet)
wellbeing.js            Wellbeing check (form sheet with detents)
meal/new.js             Quick-add a meal (sheet)
+not-found.js           404
```

**Auth gate.** `src/app/_layout.js` wraps routes in two `Stack.Protected` groups, and leaves
the website's public pages outside both:

```js
<Stack.Protected guard={!isSignedIn} redirectTo="/">       {/* (auth) */}
<Stack.Protected guard={isSignedIn} redirectTo="/welcome"> {/* (tabs), workout/*, journal… */}
{/* discover, ecosystem, pillar/[id], coaches, membership, assessment — anyone */}
```

`isSignedIn` comes from `session-store`. Signing in or out flips it and Expo Router moves the
user automatically — no screen calls `router.replace` after login. Buttons on public pages
use `useMemberLink()`: members go to the tool, guests go to sign-in first; links to a tab
dismiss any modals and switch tab.

**Splash.** The splash screen stays up until fonts are loaded **and** every persisted store
has re-hydrated from AsyncStorage (`hooks/useStoresHydrated.js`), so a signed-in member never
sees a flash of the Welcome screen.

### Stores — `src/stores/`

| Store                  | Holds                                                                                   | Persist key            |
| ---------------------- | --------------------------------------------------------------------------------------- | ---------------------- |
| `session-store.js`     | `user`, `accessToken`                                                                   | `phaserev.session`     |
| `profile-store.js`     | Per-user: assessment, nutrition (macros, water, meal log, 30-day history, region), mood, mind log, journal, reframes, wellbeing checks, reaction results, coach requests | `phaserev.profiles` (v2) |
| `training-store.js`    | Routines, week plan, history, **active session**, rest timer, favourites, body log, progress photos | `phaserev.training`    |
| `preferences-store.js` | Appearance (system/light/dark), haptics, rest-timer step                                | `phaserev.preferences` |

All use `persist` + AsyncStorage via `stores/storage.js`. `profile-store` has `version: 2` and a
`migrate` that fills new fields (`withProfileDefaults`) so 1.0 installs upgrade cleanly.

**Day rollover.** `useDayRollover()` (root layout, on launch and when the app returns to the
foreground) calls `rolloverDay()`: yesterday's macros and water move into nutrition history and
today starts at zero with the planned meals unlogged (`features/nutrition/lib/nutrition-day.js`).

> **Rule:** stores hold _source data_. Derived numbers (streaks, PRs, scores, charts) are
> computed in `features/*/lib/*` and memoised in hooks — never stored, so they can't drift.

### Hooks — `src/hooks/` and `features/*/hooks/`

| Hook                          | Returns                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| `useMember()`                 | `user, firstName, isSignedIn, signIn(email, pw), signOut()`          |
| `useProfile()`                | `{ profile, actions, isMember }` — actions bound to the signed-in user, profile filled with defaults |
| `useTodayPlan()`              | Today's routine + planned session with previous/targets              |
| `useWeekSchedule()`           | Mon→Sun with completed / today / missed / rest / upcoming            |
| `useStreak()`                 | Current streak (rest days don't break it)                            |
| `useActiveSession()`          | Live session + `{ completedSets, totalSets, volumeKg }`              |
| `useStartWorkout()`           | One function for every "Start workout" button                        |
| `useNow(ms, enabled)`         | Re-render tick for timers                                            |
| `useMemberLink()`             | `go(href)` — guests → sign-in, tab routes → dismiss modals + switch tab |
| `useDayRollover()`            | Rolls nutrition over to a new day (launch + foreground)              |
| `useFirstFocus()`             | `true` once a tab has been focused — heavy tabs render lazily        |
| `useReduceTransparency()`     | iOS accessibility setting; turns glass off                            |

### Theme — `src/theme/` + `providers/ThemeProvider.js`

- `palette.js` — raw hex values copied from the website CSS.
- `themes.js` — semantic tokens (`background`, `surface`, `surfaceSoft`, `text`, `textMuted`,
  `separator`, `accent`, `champagne`…) for light & dark, modelled on iOS system colours.
- `typography.js` — per-platform faces (SF Pro / Rounded / Mono on iOS; Outfit / JetBrains Mono
  elsewhere; Oswald everywhere for brand headlines) + variants (`largeTitle`, `h1`, `body`,
  `eyebrow`, `metric`, `timer`…). iOS body text is 17 pt like UIKit.
- `layout.js` — spacing scale, radii, `GUTTER` (20 on iOS, 16 on Android), `CARD_PADDING`.

```js
const { colors, glass } = useTheme();          // tokens + "is Liquid Glass on?"
const styles = useThemedStyles(createStyles);  // StyleSheet that updates with the theme
<AppText variant="h2" color="textMuted" />     // never set fontFamily by hand
```

`theme.glass` is `LIQUID_GLASS && !reduceTransparency`. `AppearanceSync` pushes the in-app
appearance to `Appearance.setColorScheme`, so native headers, tab bar, alerts and keyboards
follow it. The (auth) screens use `<ThemeProvider forceScheme="dark">`.

### The UI kit in one minute — `src/components/ui/`

| Component        | Why it exists                                                                     |
| ---------------- | --------------------------------------------------------------------------------- |
| `Screen`         | Every screen. `variant="tab" | "detail" | "modal" | "bare"` sets the native header (large title, glass/blur, back button, `headerActions` → SF Symbol bar items or menus), safe areas, keyboard insets, top glow and a floating `footer`. |
| `Surface`        | `GlassView` when `theme.glass`, otherwise a solid card with a hairline border. `Card`, `Button`, `Chip`, `IconButton`, `ListSection` all draw through it. |
| `ListSection` / `ListRow` | iOS Settings-style inset grouped lists with coloured icon tiles.          |
| `SegmentedControl` | `UISegmentedControl` on iOS, a capsule control elsewhere.                       |
| `Dialog`         | Native `Alert` on iOS/Android (spaced so two never collide), drawn dialog on web. |
| `Icon`           | SF Symbols on iOS, Feather elsewhere; names are mapped in `icon-map.json`.       |

`lib/header-items.js` turns `headerActions` descriptors (`{ label, icon, onPress, prominent,
menu }`) into react-native-screens header items on iOS; `HeaderActions` renders the same
descriptors on Android/web.

---

## 3. Data flow examples

**Logging water (Fuel tab)**

```
HydrationCard "+250 ml"
  → onAdd(0.25)                       (prop from fuel.js)
  → useProfile().actions.addWater     (binds userId)
  → profile-store.addWater(userId, 0.25)
  → AsyncStorage (persist)            → every screen using useProfile() re-renders
```

**Booking a consultation (public page → member action)**

```
Coach profile "Train with Anikait" → router.push("/coaches/request?coachId=anikait")
  → (guest? Stack.Protected sends them to /welcome → sign in)
  → pick format + time + note → actions.requestCoach({...}) → profile.coaching.requests
  → Alert "Request sent" → Profile → "Session requests" lists it
```

**Picking a region on the globe**

```
RegionalMealsCard chevron → actions.setSelectedRegion("mediterranean")
  → profile-store → RegionGlobe receives new region → glides to it (requestAnimationFrame)
  → highlight set from world-map.getHighlightedCountries(region.coverage)
```

---

## 4. The workout loop (Plan → Train → Log → Analyze → Progress → Adapt)

```
training-store.routines + weekPlan + todayOverride
        │ selectTodayRoutine()
        ▼
session-plan.buildSessionPlan(routine, history)      ← "last time" vs "aim for"
        │ startWorkout()
        ▼
activeSession { session, startedAt, currentExerciseId }
        │ updateSet() / completeSet()  → rest timer (timestamp based)
        │ addSet()
        ▼
finishWorkout() → session-plan.summarizeSession() → history[0] + lastSummary
        │
        ▼
training-analytics.*  → Progress tab, Home, exercise detail, insights
```

### Progressive overload rules (`features/workouts/lib/session-plan.js`)

1. **Previous** for set N = what you logged for set N last time.
2. If last time's **first set reached the top of the rep range**, today's target adds one load
   step (`+2.5 kg` barbell/cable, `+2 kg` dumbbell, `+5 kg` machine).
3. Otherwise keep the weight and beat the reps.
4. Holds work the same way in seconds.

### PRs, streaks and insights (`features/workouts/lib/training-analytics.js`)

- **PR** = a set whose score beats every previous set of that exercise. Score is estimated 1RM
  (Epley `w × (1 + reps/30)`) for weighted sets, seconds for holds, reps for bodyweight.
- **Streak** counts consecutive days that were either trained or a planned rest day.
- **Insights** are rule-based (bench trend, push/pull balance, load trend, PRs this month,
  next-session tip). Replace `getInsights()` with an API/AI call later — the UI won't change.

### Timers survive backgrounding

The stopwatch uses `startedAt` and the rest timer stores `endsAt` (or `pausedRemaining`).
`useNow()` only triggers redraws, so locking the phone mid-rest doesn't break the countdown,
and an active session survives an app restart (it's persisted).

### Demo history

`constants/training-seed.js` generates ~12 weeks of history **relative to the first launch**
(load climbs one step every two weeks). That's why every chart is "real" — logging a new
workout immediately changes Progress. **Profile → Reset demo data** regenerates it.

---

## 5. Content & catalog (`src/constants/`)

All copy and catalog data came from the website's `src/constants/*.ts`:

| App file               | From the website                                  |
| ---------------------- | ------------------------------------------------- |
| `brand.js`             | `navigation.ts` (siteMeta), `homepage.ts` (hero, method, one system, dimensions, community, stories, final CTA) |
| `pillars.js`           | `pillars.ts` + each pillar page + `ecosystem` page |
| `coaches.js`           | `coaches.ts` + `public/images/coaches/*`          |
| `membership.js`        | `pricing.ts`                                      |
| `assessment.js`        | `assessment.ts`                                   |
| `nutrition.js`         | `dashboard.ts` (targets), `nutrition-page.ts`     |
| `nutrition-regions.js` | `nutrition-regions.ts` + `nutrition-region-coverage.ts` |
| `mental.js`            | mood tracker, `mentalSessions`, mental-wellness page (practices, breathing, scripts written for the app) |
| `athletic` (in `pillars.js`) | athletic-performance page: sports, features, programs |
| `exercises.js`         | `physical-data.ts` (same IDs) + extra common lifts |
| `training-seed.js`     | `physical-data.ts` routines / plan / body data    |
| `dashboard.js`         | `dashboard.ts` achievements                       |
| `demo-account.js`      | `test-auth.ts`                                    |

Keep IDs (`goalId`, `moodId`, region ids, exercise ids, tier ids) stable — they're stored per
user and will be stored in the database.

---

## 6. Conventions

| Thing                | Convention                                                     |
| -------------------- | -------------------------------------------------------------- |
| Language             | JavaScript (ES2022) — no TypeScript; JSDoc for shapes          |
| Components           | `PascalCase.js`, one component per file, named exports         |
| Screens (routes)     | Expo Router file names, `export default function XScreen()`    |
| Logic / stores       | `kebab-case.js`                                                |
| Imports              | `@/…` for `src/`, `@assets/…` for `assets/` (see `jsconfig.json`) |
| Styles               | `StyleSheet.create` at the bottom; theme-dependent → `createStyles(theme)` + `useThemedStyles` |
| Text                 | Always `<AppText variant=…>`                                   |
| Icons                | `<Icon name=…>` — SF Symbols on iOS, Feather elsewhere (`icon-map.json`) |
| Confirmations        | `<Dialog>` (native alert on iOS/Android, drawn on web)         |
| Haptics              | `haptics.tap() / success() / warning()` from `lib/haptics.js`  |
| Formatting           | Prettier (`npm run format`), ESLint (`npm run lint`)           |
| Tests                | `*.test.js` next to the file; screen smoke tests in `src/__tests__/` |
| Platform checks      | Only via `lib/platform.js` (`IS_IOS`, `LIQUID_GLASS`) and `theme.glass` |

### Adding a new screen

1. Create `src/app/my-screen.js` with `export default function MyScreen()` and wrap it in
   `<Screen title="My screen">…</Screen>` (`variant="modal"` for sheets).
2. Register it in `src/app/_layout.js` — inside the members' `Stack.Protected` group, or
   outside both groups if guests may see it. Add `options={SHEET}` for a sheet.
3. Build the UI from `features/<area>/components` + `components/ui`.
4. Navigate with `router.push("/my-screen")`, or `useMemberLink()` from public pages.
5. Add the route to `src/__tests__/screens.smoke.test.js`.

### Adding a new piece of member data

1. Add the field + action to the right store (`profile-store` for per-user profile data).
2. Expose the action in `hooks/useProfile.js`.
3. Document the shape in `types/models.js`.

---

## 7. Connecting the backend

Everything HTTP goes through `src/services/`:

- `api-client.js` — `apiRequest(path, { method, body })`, base URL from
  `EXPO_PUBLIC_API_URL`, bearer token from `session-store`.
- `auth-service.js` — `signInWithEmail()` uses `POST /auth/login` when the URL is set,
  the demo account otherwise; `signOutRemote()` → `POST /auth/logout`.

Endpoints to implement (same list as the website's `FRONTEND_BACKEND_INTEGRATION.md`):

| Store action                         | Endpoint                         |
| ------------------------------------ | -------------------------------- |
| sign in / out                        | `POST /auth/login`, `/auth/logout` |
| `profile-store.ensureProfile`        | `GET /users/me/profile`          |
| `saveAssessment`                     | `PUT /users/me/assessment`       |
| `toggleMealLogged`, `addMealToLog`, `addWater` | `PATCH /users/me/nutrition` |
| `setSelectedRegion`                  | `PATCH /users/me/nutrition/region` |
| `setMood`                            | `POST /users/me/mood`            |
| `addJournalEntry` / `deleteJournalEntry` | `POST/DELETE /users/me/journal` (new) |
| `saveReframe`                        | `POST /users/me/reframes` (new)  |
| `saveWellbeingCheck`                 | `POST /users/me/wellbeing` (new) |
| `saveReactionResult`                 | `POST /users/me/athletic/reaction` (new) |
| `requestCoach`                       | `POST /coaching/requests` (new)  |
| `training-store.finishWorkout`       | `POST /users/me/workouts` (new)  |
| `saveRoutine` / `deleteRoutine`      | `PUT/DELETE /users/me/routines/:id` (new) |

Suggested order: auth → read profile on login → write actions one by one (optimistic: update
the store, then call the API, roll back on error). Screens don't change — only stores/services.

---

## 8. Known gaps (deliberate, same as the web MVP)

- No payments (membership buttons show a request dialog, then a confirmation).
- Coach booking is a request saved on the device, not a live calendar.
- Form videos use the brand clip until coach-recorded videos exist.
- Progress photos are stored on the device only (`lib/photo-storage.js`); upload them once a
  storage API exists.
- Achievements are sample data; the weekly calorie trend is live from nutrition history.
