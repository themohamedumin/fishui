# Smart Fish Pond — Dashboard (React)

A React + Vite rebuild of the pond monitoring dashboard. Same Firebase project,
same data shape, same device (`pond_02`) — just a proper component-based
front end instead of one long HTML file.

## What monitors what

- **Temperature** — live reading, badge (SAFE/CAUTION while the aerator is
  cooling the pond), risk bar.
- **pH** — live reading with SAFE/DANGER badge against the 6.5–8.5 range.
- **Turbidity (water clarity)** — % impurity derived from the raw ADC value,
  with SAFE/DANGER badge.
- **Water level — two float switches**, shown as one animated SVG "sight
  glass" of the pond with two tick marks:
  - **Upper sensor** = FULL (top of pond)
  - **Lower sensor** = EMPTY (bottom of pond)

  The fill animates live between them, and shows rising bubbles whenever the
  aerator/air pump is on. No static images anywhere — every visual (level
  gauge, feeder dial, trend chart) is inline SVG driven by the live Firebase
  data.

## Run it locally

```bash
npm install
npm run dev
```

## Build for Firebase Hosting

```bash
npm run build
firebase deploy
```

`npm run build` outputs to `dist/`, which is what `firebase.json` now points
`hosting.public` at (previously `.`, since there was no build step). That is
the only change made to the Firebase config — `database.rules.json`,
`.firebaserc`, and the `auth`/`database` sections of `firebase.json` are
untouched.

## Project structure

```
src/
  firebase.js            Firebase config + init (unchanged values)
  context/AuthContext.jsx
  hooks/usePondData.js    live data, thresholds, feed-now
  hooks/useLogs.js        last-50 log fetch for chart/table
  components/             MetricCard, PondVessel (water level), FeederPanel,
                           TrendChart, LogsPanel, SettingsPanel, Nav, TopBar…
  pages/Login.jsx
  pages/Dashboard.jsx      tab switcher: Overview / Water / Feeder / Logs / Settings
```

## Firmware

`smart_fish_pond.ino` (ESP32) is included unchanged — it writes to
`/smart_fish_pond/pond_02/live`, reads `/control`, and appends to `/logs`,
which this app reads/writes exactly as the original dashboard did.
