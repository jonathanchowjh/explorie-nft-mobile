# Explorie – Mobile App

A React Native app that turns NFTs into a real-world scavenger hunt. Brands drop geo-tagged NFTs (vouchers, collectables and digital art) around a city; users find them on a map, walk there, and scan a QR code to claim them.

Built in about a month (Sep–Oct 2021) for **Hack! Cardano**, where our team **[won US$100,000 in seed funding](https://news.smu.edu.sg/news/2021/11/10/smu-team-bags-us100000-seed-funding-develop-nft-platform-international-hackathon)** to develop the platform.

## Features

- **Map discovery** – NFTs pinned at real locations with `react-native-maps`, each with distance, rating and a venue description
- **QR redemption** – camera-based scanning with `expo-camera` to claim an NFT on-site
- **Wallet** – view collected NFTs, redeem vouchers and copy their codes
- **Home feed and search** – filter NFTs by type (vouchers or collectables) or search by name or place

## Tech stack

- **React Native** with **Expo** (SDK 58) and **TypeScript**
- **React Navigation 7** – native stack navigation
- **React Context** for app-wide NFT state
- **Jest** and **React Native Testing Library**
- **ESLint** for linting
- **Aiken** (Plutus V3) minting policy, and a **Hono** claim server on **Lucid Evolution**

## My contributions

I worked across the stack:

- **Smart contract** – a Cardano NFT contract in Plutus, modelled on the ERC-721 standard ([plutus-nft](https://github.com/Explory/plutus-nft))
- **API** – a service that polls the blockchain provider and connects it to the app ([token-API](https://github.com/Explory/token-API))
- **Mobile app** – the shared app state, NFT detail and settings screens, and home feed filters

The rest of the team built the provider connections and handled crypto funds.

## Project status

In 2026 the app was rebuilt on current Expo and React Navigation, since the 2021 toolchain no longer runs. The rebuild kept the original behaviour, fixed known bugs, and added tests. [mobile/BEHAVIOUR.md](mobile/BEHAVIOUR.md) lists what each screen does and what changed.

The rebuild also added a Cardano minting policy in [contracts/](contracts) and a claim server in [server/](server). The server checks a drop's QR code and the phone's location, then mints the NFT to the claimer's address. The original 2021 backend and smart contracts live in the repos below.

## Related repos and documents

- [Token API](https://github.com/Explory/token-API) – API between the app and the blockchain provider
- [Plutus NFT](https://github.com/Explory/plutus-nft) – Cardano smart contracts
- [Whitepaper](https://docs.google.com/document/d/1icdLZj9oOVM4EatDzIAjqqaYFevsHM0cuwCzsfgP2p8/edit?usp=sharing)
- [Pitch deck](https://drive.google.com/file/d/1oaYbIqylIBtEr2xg9Bbuw5I2L5qwA36-/view?usp=sharing)

## Running locally

Prerequisites: [Node.js](https://nodejs.org/en/download/) 24 (see `.nvmrc`), and either the [Expo Go](https://expo.dev/go) app on your phone or an iOS Simulator / Android emulator.

```sh
git clone https://github.com/jonathanchowjh/explorie-nft-mobile.git
cd explorie-nft-mobile/mobile
npm install
npx expo start    # scan the QR code with Expo Go, or press i / a for a simulator
```

In the app's scanner, a QR code containing an NFT's id (for example `5`) collects that NFT.

Checks, from `mobile/`:

```sh
npm run lint
npm run typecheck
npm test
```

The contract and claim server have their own instructions in [contracts/README.md](contracts/README.md) and [server/README.md](server/README.md).
