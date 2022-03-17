import { trpc } from '@/utils/trpc'
import { OnboardingButton } from '@/utils/getMetaMaskHelper'
import { getNFTsForVote } from '@/utils/getRandomIndex'
import React, { useState } from 'react'
import strNFTs from '@/utils/getNFTs'
import { Nft } from '@alch/alchemy-web3'
import Image from 'next/image'
//import { dataOps } from "@/utils/dataOps"


const btn =
  'inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'

export default function Home() {
  //const {isConnected, isInstalled } = method

  //if isInstalled == false
  //  return install staleTime

  //if isInstalled == true && isConnected == false or error
  //return state for not connected (SignIN)

  //while isInstalled == true && isConnected == true
  //  return game state and retrieve the assets
  //  game loop here

  //get assets from wallet send contract addresses for the NFT or ipfs location to server for store
  //run store compare save only diffs
  //get random number that is the index of the range of the database and then calls that address for display on the page
  //gets winner and increments the winner counter for it and sends response back.

  //need to sign in w MetaMask
  //connect and read NFTs from wallet
  //compare the NFTs in cleint wallet to DB if not in DB add it
  //randomly select two NFTs from database and comparegetMetaMaskHelper
  //display
  //take vote send answer request to DB

  // Using HTTPS

  //should i just have an entry feild for wallet addresses? and do it from that?
  const accounts = React.useState([] as any);

  const [ids, updateIds] = useState(() => getNFTsForVote())
  const [first, second] = ids

  const voteForHottest = () => {
    //todo: fire mutation to persist vote
  }
  const firstNFT = trpc.useQuery(['get-NFT-by-Id', { id: accounts }])
  const secondNFT = trpc.useQuery(['get-NFT-by-Id', { id: accounts }])

  if (firstNFT.isLoading && accounts.length > 0) {
    return <p>Loading...</p>
  } else {
    console.log(firstNFT.data)
    console.log(accounts)
    //console.log(firstNFT.data[2].address)

    const voteForHottest = (selected: number) => {
      //fire mutation to persist vote
      updateIds(getNFTsForVote())
      console.log('Vote for hottest: ' + selected)
    }

    //iterate over the NFTs and display them
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
            <div className="text-xl text-center text-white">
              <button
                className={btn}
                onClick={() => voteForHottest(firstNFT.data[2])}
              >
                Vote
              </button>
            </div>
          </div>
          <div className="p-8">Vs</div>
          <div className="w-64 h-64">
            <div className="text-xl text-center text-white">
              <button
                className={btn}
                onClick={() => voteForHottest(firstNFT.data[2])}
              >
                Vote
              </button>
            </div>
          </div>
        </div>
        <div className="flex-col p-12">
          <OnboardingButton />
          {accounts}
        </div>
      </div>
    )
  }
}
