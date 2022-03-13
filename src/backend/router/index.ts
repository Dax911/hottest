import * as trpc from "@trpc/server";
import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import { z } from "zod";

const apiKey = '-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t'

const account = '0xC33881b8FD07d71098b440fA8A3797886D831061' //this will be replaced by a passed arugument for currently signed in accouts
const accounts = 'httpjunkie.eth'
export const appRouter = trpc.router().query("get-NFT-by-Id", {
  input: z.object({ id: z.any() }),
  async resolve({ input }) {
    const Web3api = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${apiKey}`)

    const nfts = await Web3api.alchemy.getNfts({owner: accounts})
    return nfts;
  }
})

// export type definition of API
export type AppRouter = typeof appRouter;
