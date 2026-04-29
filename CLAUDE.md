# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`mustache-app` — Expo / React Native app (iOS, Android, Web via `react-native-web`) for the **AI Mustache Generator**. The mobile/web client uploads a selfie, lets the user pick a mustache style, polls a backend job until it's `done`, and shows the composited result.

This repo is **frontend only**. The backend it talks to lives elsewhere; the API contract is implemented in `src/api/` and the matching shapes are in `src/types/index.ts`.

## Commands

```bash
npm start            # Expo dev server (QR for device, web option in menu)
npm run android      # Build/run on Android emulator
npm run ios          # Build/run on iOS simulator
npm run web          # Run web target locally
npm run typecheck    # tsc --noEmit (strict mode)
npm run lint         # eslint . --ext .ts,.tsx
```

There is **no test suite** in this repo — `typecheck` and `lint` are the verification gates.

`npm install` requires `legacy-peer-deps=true` (set in `.npmrc`) due to React 19 / Expo 55 peer-dep conflicts. Don't remove that file.

Web production builds use `npx expo export --platform web` (configured in `vercel.json`, output to `dist/`).

## Configuring the backend URL

`src/api/client.ts` resolves the API base URL in this order:
1. `EXPO_PUBLIC_API_URL` env var
2. `expo.extra.apiUrl` in `app.json` (currently `http://localhost:8000`)
3. Fallback `http://localhost:8000`

For device testing against a local backend, edit `app.json → expo.extra.apiUrl` to your LAN IP — `localhost` from a device points at the device, not your dev machine.

## Architecture

### Navigation flow

`App.tsx` defines a single React Navigation stack with no native headers (each screen draws its own). The flow:

```
Home → SignIn / SignUp → Upload → StylePicker → Processing → Result
```

Auth-gated screens (`Upload`, `StylePicker`, `Processing`, `Result`) check `token` from the Zustand store on mount and `navigation.replace('SignIn')` if absent. Keep that guard when adding new authed screens.

### State (Zustand)

`src/store/useAppStore.ts` is the single source of truth:

- **Auth**: `token`, `user`, `setAuth`, `logout`
- **Flow**: `selectedImageUri`, `selectedStyle`, `currentJob`
- **Catalog**: `styles` (mustache options fetched once)

Persistence via `AsyncStorage` is **partial** — only `token`, `user`, and `styles` are persisted. `selectedImageUri`, `selectedStyle`, and `currentJob` are intentionally session-only and cleared by `resetSession()` (called after Result or on retry). When adding new state, decide explicitly whether it belongs in `partialize`.

The Axios client (`src/api/client.ts`) reads the token straight from `useAppStore.getState()` in a request interceptor and calls `logout()` on any 401, which causes auth-gated screens to bounce to `SignIn`. Don't add a separate auth-state mechanism.

### API layer (`src/api/`)

Thin wrappers, one per resource: `auth.ts`, `jobs.ts`, `styles.ts`, with shared `client.ts`. Endpoints:

- `POST /api/auth/signup`, `POST /api/auth/signin`, `GET /api/auth/me`
- `GET  /api/styles`         — backend caches 5 min, safe to call on every mount
- `POST /api/jobs`           — `multipart/form-data` with `image` + `style_id`
- `GET  /api/jobs/{id}`      — polled every **2 s** by `ProcessingScreen`

`createJob` in `src/api/jobs.ts` has **platform-split FormData**: web fetches the picker URI as a Blob; native passes the `{uri,name,type}` object trick. If you change image upload, preserve both branches.

### Theme system (`src/screens/theme.tsx`)

All styling constants are exported from `theme.tsx`: `C` (colors — warm ivory + cognac brown palette), `S` (spacing), `R` (radius), `SHADOW`, `T` (typography w/ Playfair Display + DM Sans), `BTN`, `CARD`, `L`, plus responsive helpers `IS_WEB`, `isTablet`, `isDesktop`, `WEB_MAX_W`. Spacing and font sizes auto-scale by breakpoint via `fontScale`/`spaceScale` — pass base numbers through `S.*` and `T.*` rather than hard-coding pixels so small phones, tablets, and desktop web stay consistent.

**Note**: this file contains several large blocks of commented-out previous theme iterations (Midnight Barbershop, Apple light, etc.) above the active export. Only the code from line ~471 onward (`import { Dimensions, Platform }`) is live. Don't reformat the dead code; the team keeps it for visual reference.

### Screens

The same pattern repeats across every screen file in `src/screens/`: large commented-out previous redesigns above the live `export default function`. When editing, search for the active `export default` (often deep in the file) — don't try to read top-down.

`ProcessingScreen` polls `getJobStatus` on a 2-second `setInterval`, swaps to `Result` on `status === 'done'`, and surfaces `error` on `'failed'`. Both intervals (poll + UI step cycler + elapsed timer) must be cleared on success/failure and unmount.

`ResultScreen` uses `expo-media-library`, `expo-sharing`, and `expo-file-system/legacy` for save/share. The `legacy` import is intentional — Expo 55 split FileSystem APIs and the legacy module is what works with the rest of the flow.

### Types (`src/types/index.ts`)

Mirrors the backend contract exactly. `RootStackParamList` is the canonical list of routes — update it whenever you add/remove a stack screen, and the `Stack.Screen` registrations in `App.tsx` accordingly.

## Conventions worth knowing

- TypeScript `strict: true` is on; the `@/*` path alias maps to `src/*` (in `tsconfig.json`) but most existing code uses relative imports — match the surrounding file.
- Metro is configured (`metro.config.js`) to **strip `.mjs`** from `sourceExts` to force CJS resolution of `zustand` (the ESM build uses `import.meta.env`, which breaks Metro). Don't undo this without a Zustand upgrade plan.
- Bundle identifier / package: `com.spectrumlabs.mustacheapp` (iOS + Android, in `app.json`).
- Camera, photo library, and media-library permissions are declared in `app.json`. Any new native permission needs both an Android `permissions` entry and an iOS `infoPlist` usage description.
