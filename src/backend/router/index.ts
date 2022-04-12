import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { getNFTsForVote } from "@/utils/getRandomIndex";
import { createAlchemyWeb3, NftMetadata } from "@alch/alchemy-web3";


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
    if ( input.account === undefined ) {
      throw new Error( "No account provided" )
    }


    const isPresent = await prisma.nft.findFirst( {
      where: {
        owner: input.account
      }
    } )
    if ( isPresent ) {
      return {
        success: false,
        message: "You already have NFTs in the database."
      }
    } else {

      const accounts = input.account

      const Web3api = createAlchemyWeb3(
        "https://eth-mainnet.alchemyapi.io/v2/-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t"
      );
      const nfts = await ( Web3api.alchemy.getNfts( { owner: accounts } ) )
      const nullVal = null

      const formattedNfts = nfts.ownedNfts?.map( ( nft: NftMetadata ) => {
        //this probably does nothing in terms of validating the input 

        if ( nft.id.tokenMetadata.tokenType === "ERC721" && nft.id.tokenMetadata.imageUrl !== nullVal && nft.id.tokenMetadata.imageUrl.startswith("https", "ipfs", "data")  ) {
          return {
            name: nft.metadata.name,
            imageUrl: nft.metadata.image,
            contractAddress: nft.contract.address,
            owner: accounts,
          }
        } else {
          throw new Error( "Invalid NFT" );

        }
      } );
        const creation = await prisma.nft.createMany( {
          data: formattedNfts,
      } );

      return {
        success: true,
        creation: creation,
        message: "NFTs added to your account"

      }
    }
  }
}
)


// export type definition of API
export type AppRouter = typeof appRouter;
