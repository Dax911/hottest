/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import { trpc } from '@/utils/trpc'
import { OnboardingButton } from '@/utils/getMetaMaskHelper'
import { getNFTsForVote } from '@/utils/getRandomIndex'
import React, { useContext, useState } from 'react'
import { MetaMaskInpageProvider } from '@metamask/providers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { getAccountPath } from 'ethers/lib/utils';
var Web3 = require('web3')
//import { ViewProvider } from '@/utils/viewProvider';

const btn =
  'inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'

declare var window: any

export default function Home() {

  const [ids, updateIds] = useState(() => getNFTsForVote())
  const [first, second] = ids
  //const accounts = "0x232323232323232323232323"
  //const [accounts, setAccounts] = useState(() => addtoDatabase())
  const pairNFTs = trpc.useQuery(['get-NFT-pair'])

  
  //const ethereum = window.ethereum;
  //let accounts = ethereum.selectedAddress;

//import provider 
//import the context from the provider
//global state provider or call methods from the provider

  if (pairNFTs.isLoading || pairNFTs.isError) {
    return(<p>Loading...</p>)
  } else {
    let accounts = window.ethereum.selectedAddress;
    //const getOwners = trpc.useMutation(['get-NFT-owners'])  

    const getOwners = async () => {
      const accounts = window.ethereum.selectedAddress;
      const owner = await trpc.useQuery(['get-NFT-owners', accounts])
      console.log(owner)
      console.log(accounts)
      if (owner.includes(accounts)) {
        console.log("You own this NFT")
      } else {
        console.log("You do not own this NFT")
      }
    }
    //const stuff = getOwners.mutate({owner: accounts})
    //console.log(stuff)
    //console.log(trpc.useMutation('get-NFT-owners'), accounts)
    //const addtoDatabase = (accounts: string) => {
      //const getOwners = trpc.useMutation(["get-NFT-owners"]) 
      //if (getOwners === (success: true)) {
      //  console.log("undefined")
      //} else {
      //  console.log("defined")
      //}

      //if (getOwners.isLoading || getOwners.isError) {
      //  return(console.log("Unable to get owners."))
      //} else if (getOwners === accounts) {
      //  const owner = getOwners.data.getNFTOwners(accounts)
      //  console.log(owner)
      //}
    }//
    //console.log(getOwners)
    console.log(pairNFTs)
    console.log(accounts)
    //console.log(owners)


    const voteForHottest = (selected: number) => {
      const voteMutation = trpc.useMutation(["cast-vote"]);

      if (selected === first) {
        voteMutation.mutate({ votedFor: first, votedAgainst: second });
      } else {
        voteMutation.mutate({ votedFor: second, votedAgainst: first });
      }
      // todo: fire mutation to persist changes
      updateIds(getNFTsForVote());
    };

    
    const firstNFTimage = pairNFTs.data?.firstNft.imageUrl || 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640'
    const secondNFTimage = pairNFTs.data?.secondNft.imageUrl || 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640'

    return (
 <div className="flex flex-col items-center justify-center w-screen h-screen">
        <div className="text-2xl text-center">
          Hot or Not?
          <br />
          Which NFT is better?
        </div>
        <div className="p-2" />
        <div className="flex items-center justify-between max-w-2xl p-8">
          <div className="w-64 h-64">
            <img src={firstNFTimage} />
            <div className="text-xl text-center text-white">
            {pairNFTs.data?.firstNft.name}
            <div className='p-2' />
            <button className={btn} onClick={() => voteForHottest(first)}>
              Vote
            </button>
            </div>
          </div>
          <div className="p-8">Vs</div>
          <div className="w-64 h-64">
            <img src={secondNFTimage} />
            <div className="text-xl text-center text-white">
            {pairNFTs.data?.secondNft.name}
            <div className='p-2' />
            <button className={btn} onClick={() => voteForHottest(second)}>
              Vote
            </button>
            </div>
          </div>
        </div>
        <div className="p-2" />
        <div className="flex-col p-12">
          <OnboardingButton />
          {accounts}

        </div>
      </div>

    )
  }
}


