
const MAX_INDEX_SIZE = 500

export const getNFTlocation: (notThisOne?: number) => number = (
  notThisOne
) => {
  const randNFTindexNumberforLocation = Math.floor(Math.random()*MAX_INDEX_SIZE);

  if (randNFTindexNumberforLocation != notThisOne) return randNFTindexNumberforLocation
  return getNFTlocation(notThisOne)
}

export const getNFTsForVote = () => {
  const firstNFT = getNFTlocation();
  const secondNFT = getNFTlocation(firstNFT)

  return [firstNFT, secondNFT];
}
