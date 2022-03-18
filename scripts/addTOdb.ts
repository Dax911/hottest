import { getNFTsForVote } from "@/utils/getRandomIndex";
import { createAlchemyWeb3, Nft } from "@alch/alchemy-web3";
import MetaMaskOnboarding from '@metamask/onboarding';


import React, { useState } from "react";
import { prisma } from "../src/backend/utils/prisma";

//async function getWalletAddress() {
//    const account = await ethereum.enable();
//    return account[0].toString();
//}

//const account: string = getWalletAddress()

const doFill = async () => {
    const accounts: string = 'httpjunkie.eth';

    const Web3api = createAlchemyWeb3(
        "https://eth-mainnet.alchemyapi.io/v2/-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t"
    );
    const nfts = await (Web3api.alchemy.getNfts( { owner: accounts } ) )

    //const formattedNfts = nfts.ownedNfts?.map((nft: any) => {
      //  Web3api.alchemy.getNfts( { owner: accounts } )});
    //console.log(nft)

    //const allNfts = ( await Web3api.alchemy.getNfts( { accounts } ) ).totalCount;

    const formattedNfts = nfts.ownedNfts?.map((nft: any) => {
        return {
          id: nft.totalCount,
          name: nft.metadata.name,
          imageUrl: nft.metadata.image,
          contractAddress: nft.contract.address,
          owner: 'httpjunkie.eth',
        }
      } );


    const creation = await prisma.nft.createMany( {
        data: formattedNfts,
    } );

    console.log( creation );
}

doFill();