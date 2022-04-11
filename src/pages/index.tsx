/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import { trpc } from "@/utils/trpc";
//import { OnboardingButton } from "@/utils/getMetaMaskHelper";
import { getNFTsForVote } from "@/utils/getRandomIndex";
import React, { useState } from "react";
var Web3 = require("web3");
import getAccount from "@/utils/getAccount";
import { useUserState } from "../components/hooks/useUser";
import { isINDB } from "@/backend/router/index";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

//declare var window: any;




export default function Home() {


  

  const currentAccount = useUserState().currentAccount;
  console.log(currentAccount);


  const [ids, updateIds] = useState(() => getNFTsForVote());
  const [first, second] = ids;
  const pairNFTs = trpc.useQuery(["get-NFT-pair"]);
  const max = trpc.useQuery(["get-table-size"]);
  
  const databaseValidation = trpc.useMutation(["add-to-db"]);
  console.log(databaseValidation);
  const voteMutation = trpc.useMutation(["cast-vote"]);



  const voteForHottest = (selected: number) => {

    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    //fires mutation to persist changes
    updateIds(getNFTsForVote());
    
  };

  const databaseCheck = (account: string | undefined = currentAccount) => {
    if (account === undefined) {
      const accounts = '0x0000000000000000000000000000000000000000';
      databaseValidation.mutate({ account: accounts });
      console.log(`I added ${accounts} to the database`);
    } else {
      const accounts = account;
      databaseValidation.mutate({ account: accounts });
      console.log(`I added ${accounts} to the database`);

  }

  };


 


  
  if (pairNFTs.isLoading || pairNFTs.isError) {
    return <p>Loading...</p>;
  } else {
    
    console.log(pairNFTs);
      

    const firstNFTimage =
      pairNFTs.data?.firstNft.imageUrl ||
      "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640";
    const secondNFTimage =
      pairNFTs.data?.secondNft.imageUrl ||
      "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640";


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
              <div className="p-2" />
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
              <div className="p-2" />
              <button className={btn} onClick={() => voteForHottest(second)}>
                Vote
              </button>
            </div>
          </div>
        </div>
        <div className="p-2" />
        <div className="flex-col p-12">
        </div>
        <button className={btn} onClick={() => databaseCheck(currentAccount)}>
          Add to Database
        </button>
      </div>
    );
  }
}
