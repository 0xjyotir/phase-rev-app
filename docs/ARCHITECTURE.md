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
_layout.js            Root Stack + auth gate (Stack.Protected), fonts, splash, providers
(auth)/_layout.js     Dark-brand stack for guests
(auth)/welcome.js     Hero video + "REWORK YOUR BODY…"
(auth)/login.js       Email/password + demo account card
(tabs)/_layout.js     Bottom tabs + "workout in progress" pill
(tabs)/index.js       Home
(tabs)/train.js       Today | Library | Progress   (?view=&sub= in the URL)
(tabs)/fuel.js        Nutrition
(tabs)/mind.js        Mental wellness
(tabs)/profile.js     Account + settings
workout/active.js     Live logging (full-screen modal, keeps screen awake)
workout/complete.js   Session summary
history/[id].js       A past workout
exercise/[id].js      Exercise detail (form video, PR, e1RM, chart, cues)
routine/new.js        Routine builder (modal)
assessment.js         4-step baseline wizard (modal)
breathing.js          Guided breathing player
coaches/index.js      Coach roster
coaches/[id].js       Coach profile
membership.js         Tiers + comparison
+not-found.js         404
```

**Auth gate.** `src/app/_layout.js` wraps routes in two `Stack.Protected` groups:

```js
<Stack.Protected guard={!isSignedIn} redirectTo="/">       {/* (auth) */}
<Stack.Protected guard={isSignedIn} redirectTo="/welcome"> {/* (tabs), workout/*, … */}
```

`isSignedIn` comes from `session-store`. Signing in or out flips it and Expo Router moves the
user automatically — no screen calls `router.replace` after login.

**Splash.** The splash screen stays up until fonts are loaded **and** every persisted store
has re-hydrated from AsyncStorage (`hooks/useStoresHydrated.js`), so a signed-in member never
sees a flash of the Welcome screen.

### Stores — `src/stores/`

| Store                  | Holds                                                                                   | Persist key            |
| ---------------------- | --------------------------------------------------------------------------------------- | ---------------------- |
| `session-store.js`     | `user`, `accessToken`                                                                   | `phaserev.session`     |
| `profile-store.js`     | Per-user: assessment, nutrition (macros, water, meal log, region), mood entries, mind stats | `phaserev.profiles` |
| `training-store.js`    | Routines, week plan, history, **active session**, rest timer, favourites, body log      | `phaserev.training`    |
| `preferences-store.js` | Appearance (system/light/dark), haptics                                                 | `phaserev.preferences` |

All use `persist` + AsyncStorage via `stores/storage.js`. These are the mobile versions of the
website's `session-store.ts`, `user-data-store.ts` and `physical-training-store.ts`.

> **Rule:** stores hold _source data_. Derived numbers (streaks, PRs, charts) are computed in
> `features/workouts/lib/*` and memoised in hooks — never stored, so they can't drift.

### Hooks — `src/hooks/` and `features/*/hooks/`

| Hook                          | Returns                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| `useMember()`                 | `user, firstName, isSignedIn, signIn(email, pw), signOut()`          |
| `useProfile()`                | `{ profile, actions }` — actions already bound to the signed-in user |
| `useTodayPlan()`              | Today's routine + planned session with previous/targets              |
| `useWeekSchedule()`           | Mon→Sun with completed / today / missed / rest / upcoming            |
| `useStreak()`                 | Current streak (rest days don't break it)                            |
| `useActiveSession()`          | Live session + `{ completedSets, totalSets, volumeKg }`              |
| `useStartWorkout()`           | One function for every "Start workout" button                        |
| `useNow(ms, enabled)`         | Re-render tick for timers                                            |

### Theme — `src/theme/` + `providers/ThemeProvider.js`

- `palette.js` — raw hex values copied from the website CSS.
- `themes.js` — semantic tokens (`background`, `surface`, `text`, `accent`…) for light & dark.
- `typography.js` — Outfit / Oswald / JetBrains Mono + text variants (`h1`, `eyebrow`, `timer`…).
- `layout.js` — spacing scale, radii, shadow.

```js
const { colors } = useTheme();                 // read tokens
const styles = useThemedStyles(createStyles);  // StyleSheet that updates with the theme
<AppText variant="h2" color="textMuted" />     // never set fontFamily by hand
```

The (auth) screens use `<ThemeProvider forceScheme="dark">` so welcome/login always look like
the website, whatever the device setting.

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
| `brand.js`             | `navigation.ts` (siteMeta), `homepage.ts` (hero)  |
| `pillars.js`           | `pillars.ts`                                      |
| `coaches.js`           | `coaches.ts` + `public/images/coaches/*`          |
| `membership.js`        | `pricing.ts`                                      |
| `assessment.js`        | `assessment.ts`                                   |
| `nutrition.js`         | `dashboard.ts` (targets), `nutrition-page.ts`     |
| `nutrition-regions.js` | `nutrition-regions.ts` + `nutrition-region-coverage.ts` |
| `mental.js`            | mood tracker + `mentalSessions`                   |
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
| Icons                | Feather via `<Icon name=…>` (tab bar uses MaterialCommunityIcons) |
| Confirmations        | `<Dialog>` (works on web too; `Alert.alert` doesn't)           |
| Haptics              | `haptics.tap() / success() / warning()` from `lib/haptics.js`  |
| Formatting           | Prettier (`npm run format`), ESLint (`npm run lint`)           |
| Tests                | `*.test.js` next to the file, Jest (`npm test`)                |

### Adding a new screen

1. Create `src/app/my-screen.js` with `export default function MyScreen()`.
2. Register it in `src/app/_layout.js` inside the members' `Stack.Protected` group.
3. Build the UI from `features/<pillar>/components` + `components/ui`.
4. Navigate with `const router = useRouter(); router.push("/my-screen")`.

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
| `training-store.finishWorkout`       | `POST /users/me/workouts` (new)  |
| `saveRoutine` / `deleteRoutine`      | `PUT/DELETE /users/me/routines/:id` (new) |

Suggested order: auth → read profile on login → write actions one by one (optimistic: update
the store, then call the API, roll back on error). Screens don't change — only stores/services.

---

## 8. Known gaps (deliberate, same as the web MVP)

- No payments (membership buttons show a confirmation dialog).
- Coach booking is a request dialog, not a calendar.
- Form videos use the brand clip until coach-recorded videos exist.
- Progress photos are placeholders (add `expo-image-picker` + storage API).
- Weekly calorie trend and achievements are static sample data.
