/* eslint-disable react/jsx-no-comment-textnodes */
import { trpc } from '@/utils/trpc'
import { OnboardingButton } from '@/utils/getMetaMaskHelper'
import { getNFTsForVote } from '@/utils/getRandomIndex'
import React, { useState } from 'react'


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

  if (firstNFT.isLoading && accounts.length < 0) {
    return <p>Loading...</p>
  } else {
    console.log(firstNFT)
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
            <img alt="nft" src={"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IndoaXRlIiAvPjx0ZXh0IHg9IjEwIiB5PSIyMCIgY2xhc3M9ImJhc2UiPkdNLU5BQSBJL088L3RleHQ+PHRleHQgeD0iMTAiIHk9IjQwIiBjbGFzcz0iYmFzZSI+VmlzdWFsIFN0dWRpbzwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjAiIGNsYXNzPSJiYXNlIj5XaGl0ZSBUYW5rdG9wPC90ZXh0Pjx0ZXh0IHg9IjEwIiB5PSI4MCIgY2xhc3M9ImJhc2UiPlJ1c3Q8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjEwMCIgY2xhc3M9ImJhc2UiPkZhcm1pbmc8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjEyMCIgY2xhc3M9ImJhc2UiPlJhbWFsbGFoPC90ZXh0Pjx0ZXh0IHg9IjEwIiB5PSIxNDAiIGNsYXNzPSJiYXNlIj5EaXZlcmdlbnQ8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjE2MCIgY2xhc3M9ImJhc2UiPlBob2JpYTwvdGV4dD48L3N2Zz4="} width={800} height={800} />
              <div className="p-8" />
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
