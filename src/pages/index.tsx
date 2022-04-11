/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import { trpc } from "@/utils/trpc";
import React from "react";
import { useUserState } from "../components/hooks/useUser";
import { usePlausible } from "next-plausible";

import Link from "next/link";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Head from "next/head";
const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const {
    data: pairNFTs,
    refetch,
    isLoading,
  } = trpc.useQuery(["get-NFT-pair"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const currentAccount = useUserState().currentAccount;
  console.log(currentAccount);

  const databaseValidation = trpc.useMutation(["add-to-db"]);
  console.log(databaseValidation);
  const voteMutation = trpc.useMutation(["cast-vote"]);
  const plausible = usePlausible();

  const voteForHottest = (selected: number) => {
    if (!pairNFTs) return;

    if (selected === pairNFTs?.firstNft.id) {
      // If voted for 1st NFT, fire voteFor with first ID
      voteMutation.mutate({
        votedFor: pairNFTs.firstNft.id,
        votedAgainst: pairNFTs.secondNft.id,
      });
    } else {
      // else fire voteFor with second ID
      voteMutation.mutate({
        votedFor: pairNFTs.secondNft.id,
        votedAgainst: pairNFTs.firstNft.id,
      });
    }

    plausible("cast-vote");
    refetch();
  };

  const databaseCheck = (account: string | undefined | null = currentAccount) => {
    if (account === undefined || account === null) {
      const accounts = "0x0000000000000000000000000000000000000000";
      databaseValidation.mutate({ account: accounts });
      console.log(`I added ${accounts} to the database`);
    } else {
      const accounts = account;
      databaseValidation.mutate({ account: accounts });
      console.log(`I added ${accounts} to the database`);
    }
  };

  const fetchingNext = voteMutation.isLoading || isLoading;

  return (
    <div className="relative flex flex-col items-center justify-between w-screen h-screen">
      <Head>
        <title>Hot or Not NFT</title>
      </Head>

      <div className="pt-8 text-2xl text-center">Which NFT is better?</div>
      <button onClick={() => databaseCheck(currentAccount)} className={btn}>
        {isLoading ? "Loading..." : "Check Database"}
      </button>

      <button onClick={() => refetch()} className={btn} />

      {pairNFTs && (
        <div className="flex flex-col items-center justify-between max-w-2xl p-8 md:flex-row animate-fade-in">
          <NFTListing
            nfts={pairNFTs?.firstNft}
            vote={() => voteForHottest(pairNFTs.firstNft.id)}
            disabled={fetchingNext}
          />
          <div className="p-8 text-xl italic">{"or"}</div>
          <NFTListing
            nfts={pairNFTs?.secondNft}
            vote={() => voteForHottest(pairNFTs.secondNft.id)}
            disabled={fetchingNext}
          />
          <div className="p-2" />
          <div className="p-2" />
        </div>
      )}
      {!pairNFTs && <img src="/rings.svg" className="w-48" />}
      <div className="w-full pb-2 text-xl text-center">
        <a href="https://twitter.com/HaydenAylor">Twitter</a>
        <span className="p-4">{"-"}</span>
        <Link href="/results">
          <a>Results</a>
        </Link>
        <span className="p-4">{"-"}</span>
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </div>
  );
}

type NFTFromServer = inferQueryResponse<"get-NFT-pair">["firstNft"] | any;

const NFTListing: React.FC<{
  nfts: NFTFromServer;
  vote: () => void;
  disabled: boolean;
}> = (props: any) => {
  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.nfts.id}
    >
      <div className="p-2" />

      <div className="text-xl text-center capitalize mt-[-0.5rem]">
        {props.nfts.name}
      </div>
      <div className="p-2" />

      <img
        src={props.nfts.imageUrl}
        width={256}
        height={256}
        className="animate-fade-in"
      />
      <div className="p-2" />

      <button
        className={btn}
        onClick={() => props.vote()}
        disabled={props.disabled}
      >
        VOTE
      </button>
      <div className="p-2" />
    </div>
  );
};
