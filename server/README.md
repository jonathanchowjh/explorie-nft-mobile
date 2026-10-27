# Explorie server

Verifies NFT claims and mints them with the [contract](../contracts) to the claimer's own Cardano address.
It runs against [Lucid Evolution](https://github.com/Anastasia-Labs/lucid-evolution)'s in-memory emulator
chain, so it needs no keys, accounts or network.

```sh
npm install
npm start   # prints the demo wallet address and each drop's QR poster contents
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

`GET /wallet/:address` lists the Explorie NFTs the address holds on-chain, in the order they were minted:
`{ nfts: [{ unit, dropId, redeemed }] }`. Holdings come from the chain, so an NFT the user sends elsewhere leaves
their wallet. The server only adds which drop each NFT came from and whether it was redeemed.

`POST /redemptions` with `{ address, unit }` marks a voucher redeemed. The address must hold it. Returns `201`, or
`400`, `403`, `404` or `409` with `{ error }`.

On start-up the server mints the original app's demo wallet to a fixed demo address (or `DEMO_ADDRESS`): Etherials,
Pop UP, and Chef's special already redeemed. It does this through its own API, so the seed passes the same checks.

The server listens on all interfaces, so a phone on the same network can reach it.

The on-chain policy enforces the rest independently of the server: one token per mint, the issuer's signature, and a
name derived from a spent output. The tests submit forged transactions to the emulator and check that the compiled
contract rejects them.

## Limits

- **State is in memory**: the chain, the claims, which drop each NFT came from, and redemptions. It all resets on
  restart.
- **Redemptions aren't authenticated.** Anyone who knows an address and a voucher it holds can redeem it, because the
  app has no key to sign with. A wallet that can sign (CIP-8 `signData`) would prove ownership.
- **To run on a real network**, give `Lucid` a Blockfrost provider and the issuer's key from the environment instead of
  the emulator in `src/main.ts`. `Minter` and the API don't change.
- **The drops come from the app's [drops.json](../mobile/src/data/drops.json)**, so both sides always agree on ids and
  coordinates.
