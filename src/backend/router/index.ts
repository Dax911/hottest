import * as trpc from "@trpc/server";
import { createAlchemyWeb3, Nft, NftMetadata } from "@alch/alchemy-web3"
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { getNFTsForVote } from "@/utils/getRandomIndex";
//import { web3 } from "web3"
import getAccount from "@/utils/getAccount";
import { useUserState } from "@/components/hooks/useUser";
import { DoFill } from "@/utils/addTOdb";
//import doFill from "@/utils/addTOdb";

//sha.eth
//const account = '0xC33881b8FD07d71098b440fA8A3797886D831061' //this will be replaced by a passed arugument for currently signed in accouts
//const accounts = 'httpjunkie.eth'
//const nullaccount = '0x568820334111ba2a37611F9Ad70BD074295D44C5'







//TODO: add a function to call max size of table and then use that to create a random index
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


).query( "get-table-size", {
  async resolve() {
    const tableSize = await prisma.nft.count()
    return tableSize
  },
}

).mutation( "add-to-db", {
  input: z.object( {
    account: z.string(),
  } ),

  async resolve( { input } ) {



    const isPresent = await prisma.nft.findFirst( {
      where: {
        owner: input.account
      }
    } )
    if ( !isPresent ) {
      return {
        success: false,
        message: "You already have NFTs in your account"
      }
    } else {
      DoFill()
      return {
        success: true,
        message: "NFTs added to your account"

      }
    }
  }
}
)






// export type definition of API
export type AppRouter = typeof appRouter;
