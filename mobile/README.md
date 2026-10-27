# Explorie app

The Expo app. [BEHAVIOUR.md](BEHAVIOUR.md) lists what each screen does and what the 2026 rebuild changed.

```sh
npm install
npx expo start    # scan the QR code with Expo Go, or press i / a for a simulator
npm run lint
npm run typecheck
npm test
npm run test:e2e   # the app against the real claim server; needs ../server installed
```

`npm test` runs against [test/FakeServer.ts](test/FakeServer.ts). `test:e2e` starts the real server and runs the app's
claim, wallet and redemption flows against it, so the fake can't drift from the real thing.

The app needs the [claim server](../server) running, and a wallet address in `.env.local`: copy
[.env.example](.env.example), which has the server's demo address. The wallet shows what that address holds on-chain,
as the server reports it, and redeeming a voucher records it on the server. The scanner reads a drop's QR poster (`explorie:<drop id>:<claim code>`; the server writes them
to `server/posters/`), or takes that text typed in, then sends the code and the phone's location to the server, which mints the NFT to that address.

The app finds the server on port 8787 of the machine running Expo, so a phone on the same Wi-Fi reaches it without
setup. Set `EXPO_PUBLIC_SERVER_URL` to use another server.

## Building with EAS

[eas.json](eas.json) has two profiles. `preview` makes an internal build (an APK on Android) to install on your own
devices, and `production` makes store builds. The app id is `com.jonathanchowjh.explorie` on both platforms; change
it in [app.json](app.json) before the first store build, because it can't change after that.

```sh
npm install -g eas-cli
eas login
eas init      # links the app to your Expo account
eas env:create --environment preview --name EXPO_PUBLIC_SERVER_URL --value http://<server host>:8787
eas env:create --environment preview --name EXPO_PUBLIC_WALLET_ADDRESS --value addr_test1…
eas env:create --environment preview --name GOOGLE_MAPS_ANDROID_API_KEY --value <key> --visibility secret
eas build --profile preview --platform android
```

A build has no Expo dev server to find the claim server through, so it needs `EXPO_PUBLIC_SERVER_URL`. Preview builds
may use plain `http`, for the local server. Production builds may not, so give them an `https` server. Without
`GOOGLE_MAPS_ANDROID_API_KEY` the map renders blank on Android.

`package.json` overrides `zod` to 4.x: Expo's CLI pins 3.x, which has a high-severity advisory, and only uses zod
features that 4.x keeps.
