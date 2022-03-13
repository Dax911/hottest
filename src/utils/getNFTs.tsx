// Installation: https://github.com/alchemyplatform/alchemy-web3

import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const apiKey = '-22HQEXbJO6vmXDVTO_mviFzLsnUHi4t'
// Using HTTPS
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`,
);

//set owner to accounts passed through metamask
const nfts = async () => await web3.alchemy.getNfts({owner: "0xC33881b8FD07d71098b440fA8A3797886D831061"})
const strNFTs = JSON.stringify(nfts)
console.log(nfts);

export default strNFTs
