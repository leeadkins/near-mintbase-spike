// Find all our documentation at https://docs.near.org
// Good notes on how to keep track of cross-contract gas
// https://stackoverflow.com/questions/70452485/exceeded-prepaid-gas-common-solutions
import {
  NearBindgen,
  near,
  call,
  view,
  LookupMap,
  bytes,
  NearPromise,
  AccountId,
} from "near-sdk-js";

const nft_contract_id = "mblademo1.mintspace2.testnet";
// Arweave transaction for the NFT metadata.
const nft_reference_hash = "TIN4jPjMJfEBsUXCEgkWCEBRsycyWbKqf-aC2Vy2U4s";
// Arweave transaction for the actual NFT media.
const nft_media_hash = "BvBBsx2hLPpUDQEZ7zY_HZLKupu5y0Yby8_0wzHPLcc";

@NearBindgen({ requireInit: false })
class HelloNear {
  // TODO: Keep track of min/max mints in here.
  constructor() {}

  // Public minting method.
  @call({})
  mint() {
    const minter_id = near.signerAccountId();
    // Let's create a promise that calls the minting method
    // of an arbitrary Mintbase NFT contract.
    const promise = NearPromise.new(nft_contract_id).functionCall(
      "nft_batch_mint",
      JSON.stringify({
        owner_id: minter_id,
        metadata: {
          // These are the same references as our original mintbase
          // contract upload.
          reference: nft_reference_hash,
          media: nft_media_hash,
        },
        num_to_mint: 1,
        royalty_args: null,
        split_owners: null,
        token_ids_to_mint: null,
      }),
      // These need to be more closely calculated.
      // need at least 6260000000000000000000 for storage to be sent.
      // But the then need 10000000000000000000000 to cover "mint fee"
      // That's required in the Mintbase mb-store contract.

      BigInt("7270000000000000000000"),
      // seems to cost about 2.42Tgas to mint,
      // so we'll send 2.5Tgas to be safe.
      BigInt("25000000000000")
    );
    // .then(
    //   NearPromise.new(near.currentAccountId()).functionCall(
    //     "cb_mint",
    //     JSON.stringify({
    //       latest_minter_id: minter_id,
    //       nft_contract_id: nft_contract_id,
    //     }),
    //     BigInt(0),
    //     BigInt("50000000000000")
    //   )
    // );

    return promise.asReturn();
  }
}
