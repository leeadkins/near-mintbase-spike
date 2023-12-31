import "@/styles/globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import { WalletContextProvider } from "@mintbase-js/react";
import type { AppProps } from "next/app";
import { mbjs } from "@mintbase-js/sdk";
const config = {
  network: "testnet",
  callbackUrl: "https://mintbase.xyz/success",
};
mbjs.config(config);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider
      network="testnet"
      contractAddress={process.env.NEXT_PUBLIC_MINTBASE_CONTRACT}
    >
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}
