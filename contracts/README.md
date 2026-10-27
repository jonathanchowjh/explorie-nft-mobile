# Explorie contracts

An [Aiken](https://aiken-lang.org) minting policy for Explorie NFTs (Plutus V3), in
[validators/explorie_nft.ak](validators/explorie_nft.ak). It is parameterised by the issuer's key hash.

- **Minting:** exactly one token per transaction, signed by the issuer. The token's name must be
  SHA3-256 of the output index (one byte) followed by the transaction id, for an input the transaction spends (the same as Lucid's `getUniqueTokenName`). An output can only be
  spent once, so no two Explorie NFTs can share a name, even if the issuer's server misbehaves.
- **Burning:** anyone may burn tokens they hold, with no issuer signature.

```sh
aiken check   # run the tests
aiken build   # compile to plutus.json, which the server loads
```

`plutus.json` is committed so the server doesn't need Aiken installed. Run `aiken build` after changing the validator.
