import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { getNFTsForVote } from "@/utils/getRandomIndex";
import { DoFill } from "@/utils/addTOdb";


export const appRouter = trpc.router().query( "get-NFT-pair", {
  async resolve() {

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
