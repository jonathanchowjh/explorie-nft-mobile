# Explorie server

Verifies NFT claims and mints them with the [contract](../contracts) to the claimer's own Cardano address.
It runs against [Lucid Evolution](https://github.com/Anastasia-Labs/lucid-evolution)'s in-memory emulator
chain, so it needs no keys, accounts or network.

```sh
npm install
npm start   # prints a wallet address for the app and each drop's QR poster contents
npm test
```

## API

`GET /drops` lists the drops, the policy id and the claim radius.

`POST /claims` mints a drop's NFT:

```json
{ "dropId": "6", "code": "<from the drop's QR poster>", "address": "addr_test1…",
  "location": { "latitude": 40.7747, "longitude": -73.9656 } }
```

A claim needs all of:

- **The code from the drop's QR poster.** It's an HMAC of the drop id with the server's `CLAIM_SECRET`, so codes can't
  be guessed.
- **A location within 100 m of the drop.** Start the server with `CLAIM_RADIUS_METRES` to change this, for example to
  demo away from Manhattan.
- **An address on the server's network** that hasn't claimed this drop before.

It returns `201 { txHash, unit }`, or `400`, `403`, `404` or `409` with `{ error }`.

A drop's QR poster holds `explorie:<drop id>:<code>`, which the app's scanner reads.

The server listens on all interfaces, so a phone on the same network can reach it.

The on-chain policy enforces the rest independently of the server: one token per mint, the issuer's signature, and a
name derived from a spent output. The tests submit forged transactions to the emulator and check that the compiled
contract rejects them.

## Limits

- **State is in memory**, both the chain and the record of claims, so it resets on restart.
- **To run on a real network**, give `Lucid` a Blockfrost provider and the issuer's key from the environment instead of
  the emulator in `src/main.ts`. `Minter` and the API don't change.
- **The drops come from the app's [drops.json](../mobile/src/data/drops.json)**, so both sides always agree on ids and
  coordinates.
