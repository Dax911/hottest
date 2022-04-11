/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/utils/ts-bs";
import type { GetServerSideProps } from "next";

import Head from "next/head";

const getNFTsInOrder = async () => {
  return await prisma.nft.findMany({
    orderBy: {
      votedFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,

      _count: {
        select: {
          votedFor: true,
          votedAgainst: true,
        },
      },
    },
  });
};

type NFTQueryResult = AsyncReturnType<typeof getNFTsInOrder>;

const generateCountPercentage = (nft: NFTQueryResult[number]) => {
  const { votedFor, votedAgainst } = nft._count;
  if (votedFor + votedAgainst === 0) {
    return 0;
  }
  return (votedFor / (votedFor + votedAgainst)) * 100;
};

const NFTListing: React.FC<{ nft: NFTQueryResult[number]; rank: number }> = ({
  nft,
  rank,
}) => {
  return (
    <div className="relative flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <div className="flex items-center pl-4">
          <img src={nft.imageUrl} width={64} height={64} layout="fixed" />
          <div className="pl-2 capitalize">{nft.name}</div>
        </div>
      </div>
      <div className="pr-4">
        {generateCountPercentage(nft).toFixed(2) + "%"}
      </div>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center px-2 font-semibold text-white bg-gray-600 border border-gray-500 shadow-lg rounded-br-md">
        {rank}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  nft: NFTQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Most Popular NFTs</title>
      </Head>
      <h2 className="p-4 text-2xl">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.nft
          .sort((a, b) => {
            const difference =
              generateCountPercentage(b) - generateCountPercentage(a);

            if (difference === 0) {
              return b._count.votedFor - a._count.votedFor;
            }

            return difference;
          })
          .map((currentNFT, index) => {
            return <NFTListing nft={currentNFT} key={index} rank={index + 1} />;
          })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
    const nftsOrdered = await getNFTsInOrder();
    const DAY_IN_MILLISECONDS = 86400000;
    return { props: { nft: nftsOrdered }, revalidate: DAY_IN_MILLISECONDS };
};
//TODO: pagination and only showing the top 100 results