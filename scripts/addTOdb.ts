import { getNFTsForVote } from "@/utils/getRandomIndex";
import { createAlchemyWeb3, Nft, NftMetadata } from "@alch/alchemy-web3";
import MetaMaskOnboarding from '@metamask/onboarding';


import React, { useState } from "react";
import { prisma } from "../src/backend/utils/prisma";

//async function getWalletAddress() {
//    const account = await ethereum.enable();
//    return account[0].toString();
//}

//const account: string = getWalletAddress()

const doFill = async () => {
    const accounts: string = 'shawn.eth';

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
      if (nft.id.tokenMetadata.tokenType === "ERC721" || !nft.metadata.image.includes("data:image")) {
        return {
          //id: nft.id.tokenId,
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

doFill();