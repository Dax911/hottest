import { createAlchemyWeb3, Nft, NftMetadata } from "@alch/alchemy-web3";
import { useAccount } from "wagmi";

import { prisma } from "@/backend/utils/prisma";

//async function getWalletAddress() {
//    const account = await ethereum.enable();
//    return account[0].toString();
//}

//const account: string = getWalletAddress()

export async function DoFill() {


  //const account: string = await (await accounts()).toString();

  const account: any = await useAccount();
  const accounts = account.address;
    //const accounts: string = getAccount().toString();

    const Web3api = createAlchemyWeb3(
        "https://eth-mainnet.alchemyapi.io/v2/-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t"
    );
    const nfts = await (Web3api.alchemy.getNfts( { owner: accounts } ) )
      const nullVal = null
    //const formattedNfts = nfts.ownedNfts?.map((nft: any) => {
      //  Web3api.alchemy.getNfts( { owner: accounts } )});
    //console.log(nft)
    //const allNfts = ( await Web3api.alchemy.getNfts( { accounts } ) ).totalCount;


    const formattedNfts = nfts.ownedNfts?.map((nft: NftMetadata) => {
      //this probably does nothing in terms of validating the input 
	
	if (nft.id.tokenMetadata.tokenType === "ERC721" || !nft.metadata.image.includes("data:image")) {
        return {
          name: nft.metadata.name,
          imageUrl: nft.metadata.image,
          contractAddress: nft.contract.address,
          owner: accounts,
        } 
      }else {
          return {
            //id: nft.contract.address,
            name: nullVal,
            imageUrl: nullVal,
            contractAddress: nullVal,
            owner: accounts,
          }
        
      }
      } );

    const creation = await prisma.nft.createMany( {
        data: formattedNfts,
    } );

    console.log( "Creation?", creation );
}

