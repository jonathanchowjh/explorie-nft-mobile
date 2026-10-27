use aiken/collection/dict
use aiken/collection/list
use aiken/collection/pairs
use aiken/crypto.{VerificationKeyHash, sha3_256}
use aiken/primitive/bytearray
use cardano/address.{Address, VerificationKey}
use cardano/assets.{AssetName, PolicyId}
use cardano/transaction.{Input, NoDatum, Output, OutputReference, Transaction}

/// The name an NFT must have when it is minted by spending `ref`: SHA3-256 of
/// the output index as one byte followed by the transaction id. This matches
/// Lucid's `getUniqueTokenName`; an index above 255 fails rather than wrapping.
/// An output can be spent only once, so no two Explorie NFTs can share a name.
pub fn nft_name(ref: OutputReference) -> AssetName {
  ref.transaction_id
    |> bytearray.push(ref.output_index)
    |> sha3_256
}

/// Explorie's NFT minting policy, parameterised by the issuer's key.
///
/// Minting: exactly one token per transaction, signed by the issuer, named
/// after one of the inputs the transaction spends.
/// Burning: anyone may burn tokens they hold (the ledger already requires
/// them to spend the outputs that hold the tokens).
validator explorie_nft(issuer: VerificationKeyHash) {
  mint(_redeemer: Data, policy_id: PolicyId, self: Transaction) {
    when dict.to_pairs(assets.tokens(self.mint, policy_id)) is {
      [Pair(name, 1)] -> and {
          list.has(self.extra_signatories, issuer),
          list.any(
            self.inputs,
            fn(input) { nft_name(input.output_reference) == name },
          ),
        }
      tokens -> pairs.values(tokens) |> list.all(fn(quantity) { quantity < 0 })
    }
  }

  else(_) {
    fail
  }
}

// Tests

const issuer: VerificationKeyHash =
  #"11111111111111111111111111111111111111111111111111111111"

const policy: PolicyId =
  #"22222222222222222222222222222222222222222222222222222222"

const seed =
  OutputReference {
    transaction_id: #"3333333333333333333333333333333333333333333333333333333333333333",
    output_index: 1,
  }

fn spending(ref: OutputReference) -> Input {
  Input {
    output_reference: ref,
    output: Output {
      address: Address {
        payment_credential: VerificationKey(issuer),
        stake_credential: None,
      },
      value: assets.from_lovelace(5_000_000),
      datum: NoDatum,
      reference_script: None,
    },
  }
}

fn minting(
  mint: assets.Assets,
  signers: List<VerificationKeyHash>,
) -> Transaction {
  Transaction {
    ..transaction.placeholder,
    inputs: [spending(seed)],
    mint,
    extra_signatories: signers,
  }
}

fn validate(tx: Transaction) -> Bool {
  explorie_nft.mint(issuer, Void, policy, tx)
}

test mints_one_nft_named_after_a_spent_input() {
  validate(minting(assets.from_asset(policy, nft_name(seed), 1), [issuer]))
}

test rejects_mint_without_issuer_signature() {
  !validate(minting(assets.from_asset(policy, nft_name(seed), 1), []))
}

test rejects_mint_signed_by_someone_else() {
  let other = #"44444444444444444444444444444444444444444444444444444444"
  !validate(minting(assets.from_asset(policy, nft_name(seed), 1), [other]))
}

test rejects_more_than_one_of_a_token() {
  !validate(minting(assets.from_asset(policy, nft_name(seed), 2), [issuer]))
}

test rejects_a_name_not_derived_from_a_spent_input() {
  let unspent = OutputReference { ..seed, output_index: 2 }
  !validate(minting(assets.from_asset(policy, nft_name(unspent), 1), [issuer]))
}

test rejects_a_chosen_name() {
  !validate(minting(assets.from_asset(policy, "Pop UP #1", 1), [issuer]))
}

test rejects_two_tokens_in_one_transaction() {
  let second = OutputReference { ..seed, output_index: 2 }
  let tx = Transaction {
    ..minting(
      assets.from_asset(policy, nft_name(seed), 1)
        |> assets.add(policy, nft_name(second), 1),
      [issuer],
    ),
    inputs: [spending(seed), spending(second)],
  }
  !validate(tx)
}

test lets_a_holder_burn_without_the_issuer() {
  validate(minting(assets.from_asset(policy, nft_name(seed), -1), []))
}

test rejects_burning_one_token_while_minting_another() {
  let other = OutputReference { ..seed, output_index: 2 }
  let mint = assets.from_asset(policy, nft_name(seed), 1)
    |> assets.add(policy, nft_name(other), -1)
  !validate(minting(mint, [issuer]))
}

// The value Lucid's getUniqueTokenName gives for the same output reference;
// server/test pins it too, so on-chain and off-chain names agree.
test name_matches_lucid() {
  nft_name(seed) == #"72037a4e3948b11ecdd039e095c8c5cb2b6878c8d9265fac7dd17d91ad9e5723"
}

test names_differ_by_output_index() {
  nft_name(seed) != nft_name(OutputReference { ..seed, output_index: 2 })
}
