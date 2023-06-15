# Near / Mintbase Spike Project

This is a rapid vertical slice prototype demonstrating the following:

1. Custom Proxy Contract to allow "Lazy Minting" of NFT assets to an arbitrary Mintbase NFT Contract. By "Lazy Minting", we mean that NFTs are generated just-in-time and only when a user clicks "mint" within our interface. This is opposed to traditional Mintbase NFT creation, where all possible NFTs must be minted (and thus had storage paid for) ahead of time by the NFT "minters" and then listed on marketplaces.
2. Basic wallet integration with Near to allow users to mint and view the Mintbase NFTs.

This is currently targeting TestNet. We've generated a contract using Mintbase's GUI, we've deployed our proxy contract to TestNet and pointed it to the Mintbase Contract, and we've marked our proxy contract as a valid "minter" on Mintbase, closing the loop.

The contract is currently a `next-js-sdk` wasm-based contract for demonstration purposes. This frontend is a Next.js project using @mintbase-js for all contract interactions (using `execute` and custom contract calls), wallet selection, and Mintbase API calls.

# Caveats

This is a spike project and is intentionally not robust. Consider it a proof of concept. Future iterations are unlikely to closely resemble this exact implementation, even if the overall theory and intention remains the same.

# Needs

If you want to try out the deployed version of this on testnet, you'll need a valid testnet account in a wallet with some near. You can use a testnet faucet to get that.

# Future Work

- Actually making the Next.js app robust.
- Improve the proxy contract to allow limited editions and mint limit tracking.

# How it works

The basic Mintbase contract typically requires a contract owner to either mint all the NFTs up front, or designate "minters" who can. This works great for situations where you're organizaning some sort of shared curation of assets, or you're minting 1-of-1s to your own contract. This can also work pretty well for ticketing small numbers of events (with the Multiple and nft_batch_mint functions).

It _doesn't_ necessarily work great for very large collections, especially for open editions. For those, we'd prefer a "lazy mint" scenario, where the NFT creation is controlled by a smart contract at the time of mint by the end user, not the creator. This way, creators do not need to create and list ever NFT nor do they need to pay for storage for assets that may never be "minted". We'd rather only "mint" the exact number of items demanded. And if you're doing an open edition, which has an infinite number of mints, you _must_ use some other technique.

For this example, we use a simple proxy contract. The proxy can control who is allowed to mint and how many they are allowed to mint, and then the proxy can be marked as a "minter" on the Mintbase Contract.

Each NFT on Mintbase holds its own Arweave reference to media and metadata. For this version of the project, we've provided a reference to both media and metadata that will be minted for each NFT. This will function much like an "open edition" on other ecosystems. The system if flexible though, so if it makes more sense to store more onchain data, that could be done.

# FAQ

### Why even do this and not just build a custom contract?

There are likely scenarios where you'd just want to build a custom contract, but doing it this way you can minimize the amount of code you need to write - you only need to focus on the mint mechanism, and you don't need to worry about matching the Mintbase spec and other components of the Near NFT ecosystem. The end result of this is an NFT owned by a user on a Mintbase contract, and that NFT has all the interop that this provides.

There is some weirdness with the redirection that's happening - calling mint on a contract that _isn't_ the actual Mintbase Contract - it's a proxy - that may cause concern for astute users, but ideally systems could be created so users can confidently verify that this is infact a proxy that's allowing them to mint and mint only.

# Quick Start

If you haven't installed dependencies during setup:

    npm install

Build and deploy your contract to TestNet with a temporary dev account:

    npm run deploy

Test your contract:

    npm test

To run the web project, cd into `web` and run `npm run dev`

# Exploring The Code

1. The smart-contract code lives in the `/contract` folder. See the README there for
   more info. In blockchain apps the smart contract is the "backend" of your app.
2. The frontend code lives in the `/web` folder. This is a Next.js project that uses Mintbase.js for all Near interactions.
