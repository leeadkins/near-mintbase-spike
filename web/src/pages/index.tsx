/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { MbButton } from "mintbase-ui";
import { useOwnedNftsByStore, useWallet } from "@mintbase-js/react";
import { useOwnedTokens } from "@/hooks/useOwnedTokens";
import { useCallback } from "react";
import { ONE_YOCTO, execute } from "@mintbase-js/sdk";
// import { getWallet } from "@mintbase-js/auth";

const inter = Inter({ subsets: ["latin"] });

const WalletConnector = () => {
  const { connect, disconnect, activeAccountId, isConnected } = useWallet();

  if (!isConnected) {
    return <MbButton onClick={connect} label={"Connect To NEAR"} />;
  }

  return (
    <div>
      <p>You are connected as {activeAccountId}</p>
      <div className="flex justify-center items-center mt-4">
        <MbButton onClick={disconnect} label={"Disconnect"} />
      </div>
    </div>
  );
};

const NFTGrid = (props: { accountID: string }) => {
  const { data, loading, error } = useOwnedTokens(props.accountID, {
    limit: 10,
    offset: 0,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data?.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data!.map((nft) => (
        <div key={`${nft.metadataId}_${nft.tokenId}`}>
          <img
            src={nft.media}
            className={styles.nft_preview_image}
            alt={nft.title}
          />
          <div>
            {nft.title} {nft.tokenId}
          </div>
        </div>
      ))}
    </div>
  );
};

const MintButton = () => {
  const { activeAccountId, selector } = useWallet();
  const mint = useCallback(async () => {
    // const wallet = await getWallet();
    const wallet = await selector.wallet();
    const options = {
      wallet,
      callbackUrl: "http://localhost:3000",
    };
    const contractCall = {
      signer: activeAccountId,
      contractAddress: "dev-1686661085346-98289323810075",
      methodName: "mint",
      args: {},
      gas: "40000000000000",
      deposit: "0",
    };
    const res = await execute(options, contractCall);
    console.log(res);
  }, [activeAccountId, selector]);
  return (
    <div>
      <MbButton label={"Mint"} onClick={mint} />
    </div>
  );
};

export default function Home() {
  const { activeAccountId } = useWallet();
  return (
    <>
      <Head>
        <title>Near / Mintbase Spike</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Near / Mintbase Spike</h1>
        <div className={styles.center}>
          <WalletConnector />
        </div>
        {activeAccountId && <MintButton />}
        {activeAccountId && <NFTGrid accountID={activeAccountId} />}
      </main>
    </>
  );
}
