import "tailwindcss/tailwind.css";
import "../styles/global.css";
import type { AppProps } from "next/app";
import { defaultChains, WagmiProvider } from 'wagmi'
import { InjectedConnector } from "wagmi/connectors/injected";

const connector = new InjectedConnector({
  chains: [...defaultChains],
})



function MyApp({ Component, pageProps }: AppProps) {
  return (
      <WagmiProvider autoConnect connectors={[connector]}>
      <Component {...pageProps} />
      </WagmiProvider>
  );
}

import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@/backend/router";
//remember to add wagmi wrapper

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? 'https://hottestnfts.vercel.app/api/trpc';

    return {
      header() {
        return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        };
      },
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
