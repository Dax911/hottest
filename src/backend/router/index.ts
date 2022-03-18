import * as trpc from "@trpc/server";
import { createAlchemyWeb3, Nft, NftMetadata } from "@alch/alchemy-web3"
import { z } from "zod";
import { prisma } from "../utils/prisma";

const apiKey = '-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t'
//sha.eth
const account = '0xC33881b8FD07d71098b440fA8A3797886D831061' //this will be replaced by a passed arugument for currently signed in accouts
const accounts = 'httpjunkie.eth'
const nullaccount = '0x568820334111ba2a37611F9Ad70BD074295D44C5'


export const appRouter = trpc.router().query( "get-NFT-by-Id", {
  input: z.object( { id: z.any() } ),
  async resolve( { input } ) {
    const Web3api = createAlchemyWeb3( `https://eth-mainnet.alchemyapi.io/v2/${apiKey}` )
    const nfts = await Web3api.alchemy.getNfts( { owner: accounts } )

    const output = nfts.ownedNfts?.map((nft: NftMetadata) => {
      return {
        name: nft.metadata.name,
        imageUrl: nft.metadata.image,
        contractAddress: nft.contract.address,
        owner: nft.owner,

      }
    } )

    return output;
  }

} ).mutation( "cast-vote", {
  input: z.object( {
    votedFor: z.number(),
    votedAgainst: z.number(),
  } ),
  async resolve( { input } ) {
    const voteInDB = await prisma.vote.create( {
      data: {
        ...input,
      },
    } )
    return { success: true, vote: voteInDB };
  }

} )

// export type definition of API
export type AppRouter = typeof appRouter;
