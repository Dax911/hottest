import * as trpc from "@trpc/server";
import { createAlchemyWeb3, Nft, NftMetadata } from "@alch/alchemy-web3"
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { getNFTsForVote } from "@/utils/getRandomIndex";
import { web3 } from "web3"

const apiKey = '-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t'
//sha.eth
const account = '0xC33881b8FD07d71098b440fA8A3797886D831061' //this will be replaced by a passed arugument for currently signed in accouts
const accounts = 'httpjunkie.eth'
const nullaccount = '0x568820334111ba2a37611F9Ad70BD074295D44C5'


export const appRouter = trpc.router().query( "get-NFT-pair", {
  async resolve() {
    //const accounts = await web3.eth.getAccounts(0)  

    const [first, second] = getNFTsForVote();

    const both = await prisma.nft.findMany( {
      where: { id: { in: [first, second] } },
    } );

    if ( both.length !== 2 ) {
      throw new Error( "Could not find both NFTs" );
    }

    return { firstNft: both[0], secondNft: both[1] };
  }

} ).mutation( "cast-vote", {
  input: z.object( {
    votedFor: z.number(),
    votedAgainst: z.number(),
  } ),
  async resolve( { input } ) {
    const voteInDb = await prisma.vote.create( {
      data: {
        votedAgainstId: input.votedAgainst,
        votedForId: input.votedFor,
      },
    } );
    return { success: true, vote: voteInDb };
  },
}




).query( "get-NFT-owners", {
  input: z.object( {
    owner: z.string(),
  } ),
  async resolve( { input } ) {
    const owner = input.owner;
    const nfts = await prisma.nft.findMany( {
      where: {
        owner: owner,
      },
    } );
    if ( nfts.owner === accounts ) {
      return true
    } else {
      return false;
    }
  },
} )


// export type definition of API
export type AppRouter = typeof appRouter;
