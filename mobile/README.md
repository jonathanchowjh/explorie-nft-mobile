# Explorie app

The Expo app. [BEHAVIOUR.md](BEHAVIOUR.md) lists what each screen does and what the 2026 rebuild changed.

```sh
npm install
npx expo start    # scan the QR code with Expo Go, or press i / a for a simulator
npm run lint
npm run typecheck
npm test
```

The app needs the [claim server](../server) running, and a wallet address in `.env.local`: copy
[.env.example](.env.example), which has the server's demo address. The wallet shows what that address holds on-chain,
as the server reports it, and redeeming a voucher records it on the server. The scanner reads a drop's QR poster (`explorie:<drop id>:<claim code>`, printed by the
server), then sends the code and the phone's location to the server, which mints the NFT to that address.

The app finds the server on port 8787 of the machine running Expo, so a phone on the same Wi-Fi reaches it without
setup. Set `EXPO_PUBLIC_SERVER_URL` to use another server.

Android builds outside Expo Go need `GOOGLE_MAPS_ANDROID_API_KEY` set, or the map renders blank.

`package.json` overrides `zod` to 4.x: Expo's CLI pins 3.x, which has a high-severity advisory, and only uses zod
features that 4.x keeps.
