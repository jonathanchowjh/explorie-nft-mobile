# Explorie app

The Expo app. [BEHAVIOUR.md](BEHAVIOUR.md) lists what each screen does and what the 2026 rebuild changed.

```sh
npm install
npx expo start    # scan the QR code with Expo Go, or press i / a for a simulator
npm run lint
npm run typecheck
npm test
```

In the scanner, a QR code containing an NFT's id (for example `5`) collects that NFT. Android builds outside Expo Go
need `GOOGLE_MAPS_ANDROID_API_KEY` set, or the map renders blank.
