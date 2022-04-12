import * as trpc from "@trpc/server";
import { string, z } from "zod";
import { prisma } from "../utils/prisma";
import { getNFTsForVote } from "@/utils/getRandomIndex";
import { createAlchemyWeb3, NftMetadata } from "@alch/alchemy-web3";

type formattedNfts = {
  name: string;
  image: string;
  contractAddress: string;
  owner: string;
}


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


      const formattedNfts = nfts.ownedNfts.filter(
        ( nft: NftMetadata ) =>
          nft.id.tokenMetadata.tokenType === "ERC721" ||
          nft.id.tokenMetadata.tokenType === "ERC1155" &&
          nft.metadata.image?.startsWith( "https" ) &&
          nft.metadata.name !== undefined &&
          nft.metadata.contractAddress !== undefined &&
          nft.metadata.owner !== undefined
      ).map( async ( nft: NftMetadata ) => {


        if ( typeof nft.name !== undefined && typeof nft.image !== undefined && typeof nft.contractAddress !== undefined && typeof nft.owner !== undefined ) {
          const name: string = nft.name!
          const images: string = nft.image!
          const contractAddressz: string = nft.contractAddress!


           await prisma.nft.createMany( {
            data: {
              name: name,
              imageUrl: images,
              contractAddress: contractAddressz,
              owner: accounts,
            }
          }
          )
        }
      } );

      //const cleanNFTs: formattedNfts = formattedNfts



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
