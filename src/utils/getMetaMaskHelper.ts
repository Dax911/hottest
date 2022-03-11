export {}

//import { ethers } from 'ethers';

//export const connect = () => {
//  return new Promise(async (resolve, reject) => {
//    try {
//      const provider = new ethers.providers.Web3Provider(window.ethereum)
//      await provider.send("eth_requestAccounts", [])
//      const signer = provider.getSigner()
//      const accountAddress = await signer.getAddress()
//
//      document.getElementById("current_address").innerText = accountAddress
//      document.getElementById("current_address").removeAttribute("hidden")
//
//      resolve(accountAddress)
//    } catch (error) {
//      console.error(error)
//      reject(error)
//    }
//  })
//}
