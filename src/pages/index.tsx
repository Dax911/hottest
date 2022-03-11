import { trpc } from "@/utils/trpc";
import { OnboardingButton } from "@/utils/getMetaMaskHelper"
import { getNFTsForVote } from "@/utils/getRandomIndex"

export default function Home() {

//const {isConnected, isInstalled } = method

//if isInstalled == false
//  return install staleTime

//if isInstalled == true && isConnected ==false or error
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


const [first, second] = getNFTsForVote();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Hot or Not? <br />Which NFT is better?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-red-800">{first}</div>
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-red-800">{second}</div>
      </div>
      <div className="flex-col p-12">
      <OnboardingButton />
      </div>
    </div>
  )
}
