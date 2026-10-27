# Explorie – Mobile App

A React Native app that turns NFTs into a real-world scavenger hunt. Brands drop geo-tagged NFTs (vouchers, collectables and digital art) around a city; users find them on a map, walk there, and scan a QR code to claim them.

Built in about a month (Sep–Oct 2021) for **Hack! Cardano**, where our team **[won US$100,000 in seed funding](https://news.smu.edu.sg/news/2021/11/10/smu-team-bags-us100000-seed-funding-develop-nft-platform-international-hackathon)** to develop the platform.

## Features

- **Map discovery** – NFTs pinned at real locations with `react-native-maps`, each with a rating, a venue description, and the live distance from the phone
- **On-site claiming** – scan a drop's QR poster with `expo-camera` (or type the code printed under it); the server checks the code and the phone's location, then mints the NFT on Cardano
- **On-chain wallet** – the wallet shows what the address actually holds on-chain, so an NFT sent elsewhere leaves it
- **Voucher redemption** – signed with the wallet's key, so only the owner can redeem; copy a redeemed voucher's code
- **Home feed and search** – filter NFTs by type (vouchers or collectables) or search by name or place

## How it works

The repo has three parts:

- **[mobile/](mobile)** – the Expo app.
- **[server/](server)** – a claim server. It checks each claim, mints the NFT to the claimer's address, reads wallets from the chain, and records redemptions. It runs on an in-memory Cardano chain by default, or on the Preview testnet.
- **[contracts/](contracts)** – the Aiken minting policy the server mints with. It allows one token per mint, signed by the issuer, with a name no other Explorie NFT can share.

A claim needs the code from the drop's QR poster, which is an HMAC only the server can make, and a phone within 100 m of the drop. A redemption needs a signature from the wallet's key.

## Tech stack

- **React Native** with **Expo** (SDK 58) and **TypeScript**
- **React Navigation 7** – native stack navigation
- **React Context** for app-wide NFT state
- **@noble/curves** for the wallet's ed25519 signatures on the phone
- **Hono** claim server on **Node.js 24**, with **Lucid Evolution** for Cardano and **node:sqlite** for its records
- **Aiken** (Plutus V3) minting policy
- **Jest** and **React Native Testing Library**, **node:test** on the server, and an end-to-end suite that runs the app against the real server
- **ESLint** for linting, and **EAS** build profiles

## My contributions

I worked across the stack:

- **Smart contract** – a Cardano NFT contract in Plutus, modelled on the ERC-721 standard ([plutus-nft](https://github.com/Explory/plutus-nft))
- **API** – a service that polls the blockchain provider and connects it to the app ([token-API](https://github.com/Explory/token-API))
- **Mobile app** – the shared app state, NFT detail and settings screens, and home feed filters

The rest of the team built the provider connections and handled crypto funds.

## Project status

In 2026 the app was rebuilt on current Expo and React Navigation, since the 2021 toolchain no longer runs. The rebuild kept the original behaviour, fixed known bugs, and added tests. [mobile/BEHAVIOUR.md](mobile/BEHAVIOUR.md) lists what each screen does and what changed.

The rebuild then added the minting policy and the claim server, so claims, the wallet and redemptions are real Cardano operations instead of app state. The original 2021 backend and smart contracts live in the repos below.

**Status:**
- **Works locally, end to end**, on the server's emulator chain. Tests cover the app, the server, the contract, and the app running against the real server.
- **Ready for a testnet demo, not for production.** Testnet mode hasn't been run against Blockfrost yet, nothing has been tried on a physical phone, and the wallet key ships inside the app, so use testnet keys only. See [Deploying](#deploying).

## Related repos and documents

- [Token API](https://github.com/Explory/token-API) – API between the app and the blockchain provider
- [Plutus NFT](https://github.com/Explory/plutus-nft) – Cardano smart contracts
- [Whitepaper](https://docs.google.com/document/d/1icdLZj9oOVM4EatDzIAjqqaYFevsHM0cuwCzsfgP2p8/edit?usp=sharing)
- [Pitch deck](https://drive.google.com/file/d/1oaYbIqylIBtEr2xg9Bbuw5I2L5qwA36-/view?usp=sharing)

## Running locally

Prerequisites: [Node.js](https://nodejs.org/en/download/) 24 (see `.nvmrc`), and either the [Expo Go](https://expo.dev/go) app on your phone or an iOS Simulator / Android emulator.

Start the claim server first. It runs its own in-memory Cardano chain, so it needs no keys, accounts or network:

```sh
git clone https://github.com/jonathanchowjh/explorie-nft-mobile.git
cd explorie-nft-mobile/server
npm install
CLAIM_RADIUS_METRES=20000000 npm start   # the drops are in Manhattan; a wide radius lets you claim from anywhere
```

It mints a demo wallet of three NFTs and writes a QR poster for each drop to `server/posters/`. Then, in another terminal, start the app with the demo wallet's key:

```sh
cd explorie-nft-mobile/mobile
npm install
cp .env.example .env.local   # the demo wallet's key; testnet only
npx expo start               # scan the QR code with Expo Go, or press i / a for a simulator
```

Open a poster on screen and scan it with the app. On a simulator, which has no camera, type the line printed under the QR code (such as `explorie:5:e7e7b1c205e7ee6d`) into the scanner instead. A phone on the same Wi-Fi finds the server without setup.

## Checks

```sh
cd mobile && npm run lint && npm run typecheck && npm test
cd mobile && npm run test:e2e   # the app against the real claim server; needs server/ installed
cd server && npm run typecheck && npm test
cd contracts && aiken check
```

## Deploying

- **Server:** set `BLOCKFROST_PROJECT_ID`, `ISSUER_PRIVATE_KEY` (holding test ada) and `CLAIM_SECRET` to run on the Preview testnet, and give `DATA_FILE` a persistent disk. Put it behind HTTPS. Without the Blockfrost settings it runs the in-memory chain, which resets on restart. Details are in [server/README.md](server/README.md).
- **App:** build with EAS, setting `EXPO_PUBLIC_SERVER_URL` and `EXPO_PUBLIC_WALLET_KEY` for the build. Details are in [mobile/README.md](mobile/README.md#building-with-eas).

[contracts/README.md](contracts/README.md) covers the minting policy.
