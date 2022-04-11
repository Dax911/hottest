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
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
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
